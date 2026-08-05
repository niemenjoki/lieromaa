import discountData from '@/generated/commerce/discounts.json';
import { getBusinessDateOnly } from '@/lib/dates/businessDate.mjs';
import { obfuscateDiscountCode } from '@/lib/discounts/discountCode.mjs';

function resolveDiscount({ code, now = new Date(), sku = '' }) {
  const obfuscatedCode = obfuscateDiscountCode(code);
  if (!obfuscatedCode) {
    return null;
  }

  const today = getBusinessDateOnly(now);
  const discounts = Array.isArray(discountData?.discounts) ? discountData.discounts : [];
  const match = discounts.find((entry) => {
    if (!entry || typeof entry !== 'object') {
      return false;
    }

    if (typeof entry.endsOn === 'string' && today > entry.endsOn) {
      return false;
    }

    if (entry.obfuscatedCode !== obfuscatedCode) {
      return false;
    }

    return (
      Array.isArray(entry.appliesToSkus) &&
      entry.appliesToSkus.length > 0 &&
      (!sku || entry.appliesToSkus.includes(sku))
    );
  });

  if (!match) {
    return null;
  }

  return {
    id: match.id,
    obfuscatedCode: match.obfuscatedCode,
    type: match.type,
    value: Number(match.value) || 0,
    endsOn: match.endsOn,
    appliesToSkus: [...match.appliesToSkus],
    appliesToExtraChargeKeys: Array.isArray(match.appliesToExtraChargeKeys)
      ? match.appliesToExtraChargeKeys
      : [],
  };
}

export function resolveDiscountCode({ code, now = new Date() }) {
  return resolveDiscount({ code, now });
}

export function resolveDiscountForSku({ code, sku, now = new Date() }) {
  if (!sku) {
    return null;
  }

  return resolveDiscount({ code, now, sku });
}
