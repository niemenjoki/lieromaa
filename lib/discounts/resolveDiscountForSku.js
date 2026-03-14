import discountData from '@/data/discounts.json';

const OBFUSCATION_PEPPER = 'lieromaa-discount-v1';
const encoder = new TextEncoder();

function normalizeCode(value) {
  return String(value).trim().toUpperCase().replace(/\s+/g, '');
}

function encodeBase64(binaryString) {
  if (typeof btoa === 'function') {
    return btoa(binaryString);
  }

  return Buffer.from(binaryString, 'binary').toString('base64');
}

function getDateOnly(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function obfuscateCode(normalizedCode) {
  if (!normalizedCode) {
    return '';
  }

  const codeBytes = encoder.encode(normalizedCode);
  const pepperBytes = encoder.encode(OBFUSCATION_PEPPER);
  if (!codeBytes.length || !pepperBytes.length) {
    return '';
  }

  const output = new Uint8Array(codeBytes.length);
  for (let i = 0; i < codeBytes.length; i += 1) {
    output[i] = codeBytes[i] ^ pepperBytes[i % pepperBytes.length];
  }

  let binary = '';
  for (let i = 0; i < output.length; i += 1) {
    binary += String.fromCharCode(output[i]);
  }

  return encodeBase64(binary).split('').reverse().join('');
}

export function resolveDiscountForSku({ code, sku, now = new Date() }) {
  const normalizedCode = normalizeCode(code);
  const obfuscatedCode = obfuscateCode(normalizedCode);
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
  };
}
