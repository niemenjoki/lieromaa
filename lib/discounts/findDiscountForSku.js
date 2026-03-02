'use client';

import discountData from '@/data/discounts.json';

const OBFUSCATION_PEPPER = 'lieromaa-discount-v1';
const encoder = new TextEncoder();

function normalizeCode(value) {
  return String(value).trim().toUpperCase().replace(/\s+/g, '');
}

function getTodayDateOnly() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
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

  const base64 = btoa(binary);
  return base64.split('').reverse().join('');
}

export async function findDiscountForSku({ code, sku }) {
  const normalizedCode = normalizeCode(code);
  const obfuscatedCode = obfuscateCode(normalizedCode);
  if (!obfuscatedCode || !sku) {
    return null;
  }

  const today = getTodayDateOnly();
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
