import fs from 'fs';
import path from 'path';

import {
  DISCOUNT_OBFUSCATION_ALGORITHM,
  DISCOUNT_OBFUSCATION_PEPPER_VERSION,
  normalizeDiscountCode,
  obfuscateDiscountCode,
} from '../discounts/discountCode.mjs';

const INPUT_FILE = path.join(process.cwd(), 'data', 'discounts.json');
const PRICING_FILE = path.join(process.cwd(), 'data', 'pricing.json');
const ALLOWED_TYPES = new Set(['percentage', 'fixed', 'free_shipping']);

function getAllowedSkus() {
  if (!fs.existsSync(PRICING_FILE)) {
    throw new Error(`Pricing file not found at ${PRICING_FILE}`);
  }

  const raw = fs.readFileSync(PRICING_FILE, 'utf8');
  const data = JSON.parse(raw);
  const prices = data?.prices ?? {};

  return new Set(
    Object.keys(prices).filter(
      (sku) => typeof sku === 'string' && sku.length > 0 && !sku.startsWith('postage-')
    )
  );
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isDateOnly(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validateDiscount(entry, index, allowedSkus) {
  const i = index + 1;
  assert(entry && typeof entry === 'object', `[discount ${i}] must be an object`);
  assert(
    Array.isArray(entry.appliesToSkus) && entry.appliesToSkus.length > 0,
    `[discount ${i}] appliesToSkus must contain at least one SKU`
  );

  for (const sku of entry.appliesToSkus) {
    assert(allowedSkus.has(sku), `[discount ${i}] invalid SKU "${sku}"`);
  }

  assert(ALLOWED_TYPES.has(entry.type), `[discount ${i}] invalid type "${entry.type}"`);

  if (entry.type === 'percentage') {
    assert(
      typeof entry.value === 'number' && entry.value > 0 && entry.value <= 100,
      `[discount ${i}] percentage value must be a number between 0 and 100`
    );
  }

  if (entry.type === 'fixed') {
    assert(
      typeof entry.value === 'number' && entry.value > 0,
      `[discount ${i}] fixed value must be a positive number`
    );
  }

  assert(
    typeof entry.endsOn === 'string' && isDateOnly(entry.endsOn),
    `[discount ${i}] endsOn must be a date string in YYYY-MM-DD format`
  );
}

function run() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.log(
      `ℹ️ No discounts file found at ${INPUT_FILE} - skipping discount preparation.`
    );
    return;
  }

  const raw = fs.readFileSync(INPUT_FILE, 'utf8');
  const data = JSON.parse(raw);
  const discounts = Array.isArray(data.discounts) ? data.discounts : [];
  const allowedSkus = getAllowedSkus();
  let changed = false;

  for (let i = 0; i < discounts.length; i += 1) {
    const discount = discounts[i];
    validateDiscount(discount, i, allowedSkus);

    const plainCode = typeof discount.code === 'string' ? discount.code : '';
    const normalized = normalizeDiscountCode(plainCode);

    if (normalized) {
      discount.obfuscatedCode = obfuscateDiscountCode(normalized);
      discount.code = '';
      changed = true;
    } else if (plainCode !== '') {
      discount.code = '';
      changed = true;
    }

    if (typeof discount.obfuscatedCode !== 'string') {
      discount.obfuscatedCode = '';
      changed = true;
    }
  }

  data.obfuscation = {
    algorithm: DISCOUNT_OBFUSCATION_ALGORITHM,
    pepperVersion: DISCOUNT_OBFUSCATION_PEPPER_VERSION,
  };
  data.discounts = discounts;
  if (Object.prototype.hasOwnProperty.call(data, 'kdf')) {
    delete data.kdf;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(INPUT_FILE, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    console.log(`✅ Discounts prepared and code fields cleared in ${INPUT_FILE}`);
  } else {
    console.log('ℹ️ No plaintext discount codes found - nothing to update.');
  }
}

try {
  run();
} catch (err) {
  console.error(`❌ Failed to prepare discounts: ${err.message}`);
  process.exit(1);
}
