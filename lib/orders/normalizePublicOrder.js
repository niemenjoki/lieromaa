import { ORDER_FORM_MIN_FILL_MS } from '@/data/commerce/orderMessages';
import { normalizeDiscountCode } from '@/lib/discounts/discountCode.mjs';
import { resolveDiscountForSku } from '@/lib/discounts/resolveDiscountForSku';
import { getOrderQuote } from '@/lib/orders/getOrderQuote';
import {
  findProductKeyBySku,
  getProductOrderConfig,
  getProductPricing,
  getProductVariantBySku,
  getShippingOption,
} from '@/lib/pricing/catalog';

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

function sanitizePhone(source, key, { required = false } = {}) {
  return sanitizeField(source, key, { required, maxLength: 50 });
}

function sanitizeOptionalAddress(source, key, required) {
  return sanitizeField(source, key, { required, maxLength: 160 });
}

function sanitizePickupPoint(source) {
  const id = sanitizeField(source, 'pickup_point_id', { maxLength: 80 });
  const name = sanitizeField(source, 'pickup_point_name', { maxLength: 160 });
  const careOf = sanitizeField(source, 'pickup_point_care_of', { maxLength: 160 });
  const street = sanitizeField(source, 'pickup_point_street', { maxLength: 160 });
  const postalCode = sanitizeField(source, 'pickup_point_postal_code', { maxLength: 20 });
  const city = sanitizeField(source, 'pickup_point_city', { maxLength: 120 });
  const municipality = sanitizeField(source, 'pickup_point_municipality', {
    maxLength: 120,
  });
  const specificLocation = sanitizeField(source, 'pickup_point_specific_location', {
    maxLength: 160,
  });
  const routingServiceCode = sanitizeField(source, 'pickup_point_routing_service_code', {
    maxLength: 80,
  });
  const parcelLockerValue = sanitizeField(source, 'pickup_point_parcel_locker', {
    maxLength: 20,
  });
  const distanceInMetersRaw = sanitizeField(source, 'pickup_point_distance_meters', {
    maxLength: 20,
  });

  if (!id && !name && !street && !postalCode && !city) {
    return null;
  }

  const numericDistance = Number(distanceInMetersRaw);

  return {
    id,
    name,
    careOf,
    street,
    postalCode,
    city,
    municipality,
    specificLocation,
    parcelLocker: parcelLockerValue === 'true' || parcelLockerValue === '1',
    routingServiceCode: routingServiceCode || null,
    distanceInMeters:
      Number.isFinite(numericDistance) && numericDistance >= 0 ? numericDistance : null,
  };
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
  const resolvedProductKey = findProductKeyBySku(sku);
  const productKey =
    sanitizeField(source, 'tuote_avain', { maxLength: 80 }) || resolvedProductKey;
  const variant = getProductVariantBySku(sku);
  if (!productKey || !variant || productKey !== resolvedProductKey) {
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

  const fulfillmentType = shippingOption.fulfillmentType || 'local_pickup';
  const deliveryUsesPickupPoint = fulfillmentType === 'pickup_point';
  const deliveryUsesHomeAddress = fulfillmentType === 'home_delivery';
  const name = sanitizeField(source, 'nimi', { required: true, maxLength: 120 });
  const email = sanitizeEmail(source, 'email');
  const phone = sanitizePhone(source, 'phone', { required: true });
  const addressLine1 = sanitizeOptionalAddress(
    source,
    'osoite',
    deliveryUsesPickupPoint || deliveryUsesHomeAddress
  );
  const postalCode = sanitizeOptionalAddress(
    source,
    'postinumero',
    deliveryUsesPickupPoint || deliveryUsesHomeAddress
  );
  const city = sanitizeOptionalAddress(
    source,
    'toimipaikka',
    deliveryUsesPickupPoint || deliveryUsesHomeAddress
  );
  const customerMessage = sanitizeField(source, 'lisatiedot', {
    maxLength: 2000,
    multiline: true,
  });
  const pickupPoint = sanitizePickupPoint(source);
  const plainDiscountCode = sanitizeField(source, 'alennuskoodi', { maxLength: 80 });
  const pagePath = sanitizeField(source, 'sivu_polku', { maxLength: 200 });

  if (
    pickupPoint &&
    (!pickupPoint.id ||
      !pickupPoint.name ||
      !pickupPoint.street ||
      !pickupPoint.postalCode ||
      !pickupPoint.city)
  ) {
    throw validationError('Selected pickup point data was incomplete.', {
      publicMessage:
        'Valittu Postin noutopaikka täytyy hakea uudelleen ennen tilauksen lähetystä.',
    });
  }

  const discount = plainDiscountCode
    ? resolveDiscountForSku({ code: plainDiscountCode, sku: variant.sku, now })
    : null;
  const selectedExtraCharges = Object.fromEntries(
    getProductOrderConfig(productKey).extraCharges.map((charge) => [
      charge.fieldName,
      sanitizeField(source, charge.fieldName, { maxLength: 20 }) ===
        (charge.checkedValue ?? 'on'),
    ])
  );

  let quote;
  try {
    quote = getOrderQuote({
      productKey,
      sku: variant.sku,
      shippingMethod,
      discount,
      selectedExtraCharges,
      now,
    });
  } catch (error) {
    throw validationError(
      error instanceof Error ? error.message : 'Order quote resolution failed.',
      {
        publicMessage:
          'Tilauksen tuotetietoja ei voitu varmistaa. Päivitä sivu ja yritä uudelleen.',
      }
    );
  }

  const frostProtectionCharge =
    quote.extraCharges.find((charge) => charge.key === 'frostProtection') ?? null;

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
      type: fulfillmentType,
      address:
        deliveryUsesPickupPoint || deliveryUsesHomeAddress
          ? {
              line1: addressLine1,
              postalCode,
              city,
            }
          : null,
      pickupPoint,
      searchAddress: deliveryUsesPickupPoint
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
      unitPrice: quote.itemPrice,
      itemTotal: quote.itemPrice,
    },
    pricing: {
      currency: 'EUR',
      itemPrice: quote.itemPrice,
      shippingPrice: quote.shippingPrice,
      shippingLabel: shippingOption.label,
      extraCharges: quote.extraCharges.map((charge) => ({
        key: charge.key,
        fieldName: charge.fieldName,
        label: charge.label,
        active: charge.active,
        selected: charge.selected,
        appliedPrice: charge.appliedPrice,
      })),
      frostProtectionSelected: Boolean(frostProtectionCharge?.selected),
      frostProtectionPrice: frostProtectionCharge?.appliedPrice ?? 0,
      discount: discount
        ? {
            codePlain: normalizeDiscountCode(plainDiscountCode),
            codeMasked: maskDiscountCode(plainDiscountCode),
            obfuscatedCode: discount.obfuscatedCode,
            type: discount.type,
            value: discount.value,
            productAmount: quote.discountAmounts.productAmount,
            shippingAmount: quote.discountAmounts.shippingAmount,
            totalAmount: quote.discountAmounts.totalAmount,
            endsOn: discount.endsOn,
          }
        : null,
      total: quote.total,
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
