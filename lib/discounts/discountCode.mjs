export const DISCOUNT_OBFUSCATION_ALGORITHM = 'XOR-BASE64-REVERSE';
export const DISCOUNT_OBFUSCATION_PEPPER_VERSION = 1;

const OBFUSCATION_PEPPER = 'lieromaa-discount-v1';
const encoder = new TextEncoder();

function encodeBase64(bytes) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  if (typeof btoa === 'function') {
    return btoa(binary);
  }

  throw new Error('Base64 encoding is not available in this environment');
}

export function normalizeDiscountCode(value) {
  return String(value).trim().toUpperCase().replace(/\s+/g, '');
}

export function obfuscateDiscountCode(value) {
  const normalizedCode = normalizeDiscountCode(value);
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

  return encodeBase64(output).split('').reverse().join('');
}
