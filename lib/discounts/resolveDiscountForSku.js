import discountData from '@/generated/commerce/discounts.json';
import { obfuscateDiscountCode } from '@/lib/discounts/discountCode.mjs';

function getDateOnly(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function resolveDiscountForSku({ code, sku, now = new Date() }) {
  const obfuscatedCode = obfuscateDiscountCode(code);
  if (!obfuscatedCode || !sku) {
    return null;
  }

  const today = getDateOnly(now);
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

    return Array.isArray(entry.appliesToSkus) && entry.appliesToSkus.includes(sku);
  });

  if (!match) {
    return null;
  }

  return {
    obfuscatedCode: match.obfuscatedCode,
    type: match.type,
    value: Number(match.value) || 0,
    endsOn: match.endsOn,
    appliesToExtraChargeKeys: Array.isArray(match.appliesToExtraChargeKeys)
      ? match.appliesToExtraChargeKeys
      : [],
  };
}
