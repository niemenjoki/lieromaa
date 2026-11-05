import discountData from '@/generated/commerce/discounts.json';
import { getBusinessDateOnly } from '@/lib/dates/businessDate.mjs';
import { obfuscateDiscountCode } from '@/lib/discounts/discountCode.mjs';

function findValidEntries({ code, now = new Date(), sku = '' }) {
  const obfuscatedCode = obfuscateDiscountCode(code);
  if (!obfuscatedCode) {
    return [];
  }

  const today = getBusinessDateOnly(now);
  const discounts = Array.isArray(discountData?.discounts) ? discountData.discounts : [];
  return discounts.filter((entry) => {
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
}

function toPublicDiscount(match) {
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

// Ostoskorin alennus. Jos samalla koodilla on useampi voimassa oleva rivi, valitaan
// ensimmäinen rivi, jonka SKU-lista sisältää jonkin korin tuotteen (sama rivi, jonka
// tuotesivu näyttää). Jos mikään rivi ei koske korin tuotteita, palautetaan ensimmäinen
// voimassa oleva rivi, jolloin kori kertoo, ettei koodi koske korin tuotteita.
export function resolveDiscountCode({ code, now = new Date(), skus = [] }) {
  const entries = findValidEntries({ code, now });
  const cartSkus = new Set(
    (Array.isArray(skus) ? skus : [])
      .map((sku) => String(sku ?? '').trim())
      .filter(Boolean)
  );
  const coveringEntry = cartSkus.size
    ? entries.find((entry) => entry.appliesToSkus.some((sku) => cartSkus.has(sku)))
    : null;

  return toPublicDiscount(coveringEntry ?? entries[0]);
}

export function resolveDiscountForSku({ code, sku, now = new Date() }) {
  if (!sku) {
    return null;
  }

  return toPublicDiscount(findValidEntries({ code, now, sku })[0]);
}
