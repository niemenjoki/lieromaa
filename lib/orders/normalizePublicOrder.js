import { ORDER_FORM_MIN_FILL_MS } from '@/data/orderConfig';
import { resolveDiscountForSku } from '@/lib/discounts/resolveDiscountForSku';
import {
  findProductKeyBySku,
  getProductPricing,
  getProductVariantBySku,
  getShippingOption,
} from '@/lib/pricing/catalog';

const FROST_PROTECTION_FEE = 3;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class PublicOrderValidationError extends Error {
  constructor(
    message,
    { code = 'validation', publicMessage = message, statusCode = 400 } = {}
  ) {
    super(message);
    this.name = 'PublicOrderValidationError';
    this.code = code;
    this.publicMessage = publicMessage;
    this.statusCode = statusCode;
  }
}

function validationError(message, options) {
  return new PublicOrderValidationError(message, options);
}

function getField(source, key) {
  const value = source[key];
  return typeof value === 'string' ? value : '';
}

function normalizeSingleLine(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function normalizeMultiLine(value) {
  return String(value)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => normalizeSingleLine(line))
    .filter(Boolean)
    .join('\n')
    .trim();
}

function sanitizeField(
  source,
  key,
  { required = false, maxLength = 200, multiline = false } = {}
) {
  const rawValue = getField(source, key);
  const normalizedValue = multiline
    ? normalizeMultiLine(rawValue)
    : normalizeSingleLine(rawValue);

  if (required && !normalizedValue) {
    throw validationError(`Field "${key}" is required.`, {
      publicMessage: 'Täytä kaikki pakolliset kentät ennen lähetystä.',
    });
  }

  if (normalizedValue.length > maxLength) {
    throw validationError(`Field "${key}" exceeds max length.`, {
      publicMessage: 'Jokin lomakkeen kentistä on liian pitkä.',
    });
  }

  return normalizedValue;
}

function sanitizeEmail(source, key) {
  const value = sanitizeField(source, key, { required: true, maxLength: 200 });
  if (!EMAIL_REGEX.test(value)) {
    throw validationError(`Field "${key}" is not a valid email.`, {
      publicMessage: 'Sähköpostiosoite ei näytä kelvolliselta.',
    });
  }

  return value.toLowerCase();
}

function sanitizePhone(source, key) {
  return sanitizeField(source, key, { maxLength: 50 });
}

function sanitizeOptionalAddress(source, key, required) {
  return sanitizeField(source, key, { required, maxLength: 160 });
}

function sanitizeFormData(formData) {
  if (!formData || typeof formData.entries !== 'function') {
    return {};
  }

  return Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [
      key,
      typeof value === 'string' ? value : '',
    ])
  );
}

function isFrostProtectionSeason(now) {
  const month = now.getMonth() + 1;
  return month >= 9 || month <= 5;
}

function calculateDiscountAmounts(itemPrice, shippingPrice, discount) {
  if (!discount) {
    return {
      productAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
    };
  }

  const productAmount =
    discount.type === 'percentage'
      ? Number(((itemPrice * discount.value) / 100).toFixed(2))
      : discount.type === 'fixed'
        ? Math.min(itemPrice, discount.value)
        : 0;

  const shippingAmount = discount.type === 'free_shipping' ? shippingPrice : 0;

  return {
    productAmount,
    shippingAmount,
    totalAmount: Number((productAmount + shippingAmount).toFixed(2)),
  };
}

function maskDiscountCode(code) {
  if (!code) {
    return '';
  }

  if (code.length <= 4) {
    return '*'.repeat(code.length);
  }

  return `${code.slice(0, 2)}${'*'.repeat(Math.max(code.length - 4, 1))}${code.slice(-2)}`;
}

export function normalizePublicOrderSubmission(
  formData,
  { now = new Date(), sourceRequestId } = {}
) {
  const source = sanitizeFormData(formData);
  const honeypot = sanitizeField(source, '_gotcha', { maxLength: 200 });
  if (honeypot) {
    throw validationError('Honeypot field was filled.', {
      code: 'spam',
      publicMessage: 'Tilaus vastaanotettu.',
      statusCode: 200,
    });
  }

  const providedSourceRequestId = sanitizeField(source, 'submission_id', {
    maxLength: 120,
  });
  const formStartedAtRaw = sanitizeField(source, 'lomake_aloitettu_ms', {
    maxLength: 30,
  });
  if (formStartedAtRaw) {
    const startedAt = Number(formStartedAtRaw);
    if (
      Number.isFinite(startedAt) &&
      now.getTime() - startedAt < ORDER_FORM_MIN_FILL_MS
    ) {
      throw validationError('Form submitted too quickly.', {
        code: 'too_fast',
        publicMessage:
          'Lomakkeen lähetys tapahtui liian nopeasti. Odota hetki ja yritä uudelleen.',
      });
    }
  }

  const sku = sanitizeField(source, 'sku', { required: true, maxLength: 80 });
  const productKey =
    sanitizeField(source, 'tuote_avain', { maxLength: 80 }) || findProductKeyBySku(sku);
  const variant = getProductVariantBySku(sku);
  if (!productKey || !variant) {
    throw validationError(`Unknown SKU "${sku}".`, {
      publicMessage:
        'Tilauksen tuotetietoja ei voitu varmistaa. Päivitä sivu ja yritä uudelleen.',
    });
  }

  const product = getProductPricing(productKey);
  const shippingMethod = sanitizeField(source, 'toimitus', {
    required: true,
    maxLength: 40,
  });
  const shippingOption = getShippingOption(productKey, shippingMethod);
  if (!shippingOption) {
    throw validationError(`Unknown shipping option "${shippingMethod}".`, {
      publicMessage: 'Valittu toimitustapa ei ole kelvollinen.',
    });
  }

  const deliveryIsPost = shippingOption.id === 'postitus';
  const name = sanitizeField(source, 'nimi', { required: true, maxLength: 120 });
  const email = sanitizeEmail(source, 'email');
  const phone = sanitizePhone(source, 'phone');
  const addressLine1 = sanitizeOptionalAddress(source, 'osoite', deliveryIsPost);
  const postalCode = sanitizeOptionalAddress(source, 'postinumero', deliveryIsPost);
  const city = sanitizeOptionalAddress(source, 'toimipaikka', deliveryIsPost);
  const customerMessage = sanitizeField(source, 'lisatiedot', {
    maxLength: 2000,
    multiline: true,
  });
  const plainDiscountCode = sanitizeField(source, 'alennuskoodi', { maxLength: 80 });
  const pagePath = sanitizeField(source, 'sivu_polku', { maxLength: 200 });

  const itemPrice = Number(variant.price) || 0;
  const shippingPrice = Number(shippingOption.price) || 0;
  const frostProtectionSelected =
    productKey === 'worms' &&
    isFrostProtectionSeason(now) &&
    sanitizeField(source, 'pakkastoimituslisa', { maxLength: 20 }) === 'maksan';
  const frostProtectionPrice = frostProtectionSelected ? FROST_PROTECTION_FEE : 0;

  const discount = plainDiscountCode
    ? resolveDiscountForSku({ code: plainDiscountCode, sku: variant.sku, now })
    : null;
  const discountAmounts = calculateDiscountAmounts(itemPrice, shippingPrice, discount);
  const total = Number(
    (
      itemPrice +
      shippingPrice +
      frostProtectionPrice -
      discountAmounts.totalAmount
    ).toFixed(2)
  );

  return {
    source: 'website',
    sourceRequestId:
      sourceRequestId ||
      providedSourceRequestId ||
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}`,
    sourceSubmittedAt: now.toISOString(),
    pagePath,
    customer: {
      name,
      email,
      phone,
    },
    fulfillment: {
      method: shippingOption.id,
      label: shippingOption.label,
      address: deliveryIsPost
        ? {
            line1: addressLine1,
            postalCode,
            city,
          }
        : null,
    },
    product: {
      key: productKey,
      name: product.name,
      sku: variant.sku,
      quantity: variant.amount,
      unitPrice: itemPrice,
      itemTotal: itemPrice,
    },
    pricing: {
      currency: 'EUR',
      itemPrice,
      shippingPrice,
      shippingLabel: shippingOption.label,
      frostProtectionSelected,
      frostProtectionPrice,
      discount: discount
        ? {
            codeMasked: maskDiscountCode(plainDiscountCode),
            obfuscatedCode: discount.obfuscatedCode,
            type: discount.type,
            value: discount.value,
            productAmount: discountAmounts.productAmount,
            shippingAmount: discountAmounts.shippingAmount,
            totalAmount: discountAmounts.totalAmount,
            endsOn: discount.endsOn,
          }
        : null,
      total,
    },
    notes: {
      customerMessage,
    },
    rawFields: {
      tuote: sanitizeField(source, 'tuote', { maxLength: 120 }),
      maara: sanitizeField(source, 'maara', { maxLength: 40 }),
    },
  };
}
