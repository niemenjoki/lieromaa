import skuDiscountSource from '../commerce/skuDiscountsSource.mjs';
import { getBusinessDateOnly } from '../dates/businessDate.mjs';

const ALLOWED_TYPES = new Set(['percentage', 'fixed']);

function roundPrice(value) {
  return Number((Number(value) || 0).toFixed(2));
}

function isDateOnly(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeDiscountType(value) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return ALLOWED_TYPES.has(normalized) ? normalized : '';
}

function normalizeNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function getConfiguredSkuDiscount(sku) {
  const entry = skuDiscountSource?.[sku];
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  return {
    active: entry.active === true,
    type: normalizeDiscountType(entry.type),
    value: normalizeNumber(entry.value),
    lowestPrice30Days: roundPrice(entry.lowestPrice30Days),
    validFrom: isDateOnly(entry.validFrom) ? entry.validFrom : '',
    validUntil: isDateOnly(entry.validUntil) ? entry.validUntil : '',
  };
}

export function getScheduledSkuDiscount({ sku, basePrice }) {
  const normalizedBasePrice = roundPrice(basePrice);
  const discount = getConfiguredSkuDiscount(sku);

  if (
    !discount?.active ||
    !discount.type ||
    discount.value <= 0 ||
    discount.lowestPrice30Days <= 0 ||
    !discount.validUntil ||
    (discount.validFrom && discount.validFrom > discount.validUntil) ||
    normalizedBasePrice <= 0
  ) {
    return null;
  }

  const amount =
    discount.type === 'percentage'
      ? roundPrice((normalizedBasePrice * discount.value) / 100)
      : Math.min(normalizedBasePrice, roundPrice(discount.value));

  if (amount <= 0) {
    return null;
  }

  return {
    ...discount,
    amount,
    basePrice: normalizedBasePrice,
    discountedPrice: roundPrice(normalizedBasePrice - amount),
  };
}

export function getActiveSkuDiscount({ sku, basePrice, now = new Date() }) {
  const discount = getScheduledSkuDiscount({ sku, basePrice });
  const today = getBusinessDateOnly(now);

  if (
    !discount ||
    !today ||
    (discount.validFrom && today < discount.validFrom) ||
    today > discount.validUntil
  ) {
    return null;
  }

  return discount;
}
