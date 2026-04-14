import skuDiscountSource from '../../data/operations/commerce/skuDiscounts.mjs';

const ALLOWED_TYPES = new Set(['percentage', 'fixed']);

function roundPrice(value) {
  return Number((Number(value) || 0).toFixed(2));
}

function getDateOnly(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
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
    validUntil: isDateOnly(entry.validUntil) ? entry.validUntil : '',
  };
}

export function getActiveSkuDiscount({ sku, basePrice, now = new Date() }) {
  const normalizedBasePrice = roundPrice(basePrice);
  const discount = getConfiguredSkuDiscount(sku);
  const today = getDateOnly(now);

  if (
    !discount?.active ||
    !discount.type ||
    discount.value <= 0 ||
    discount.lowestPrice30Days <= 0 ||
    !discount.validUntil ||
    today > discount.validUntil ||
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
