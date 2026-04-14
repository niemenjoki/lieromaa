import fs from 'fs';
import path from 'path';

import {
  DISCOUNT_OBFUSCATION_ALGORITHM,
  DISCOUNT_OBFUSCATION_PEPPER_VERSION,
  normalizeDiscountCode,
  obfuscateDiscountCode,
} from '../discounts/discountCode.mjs';

const SOURCE_FILE = path.join(
  process.cwd(),
  'data',
  'operations',
  'commerce',
  'discounts.source.json'
);
const OUTPUT_FILE = path.join(process.cwd(), 'generated', 'commerce', 'discounts.json');
const PRICING_FILE = path.join(
  process.cwd(),
  'data',
  'operations',
  'commerce',
  'pricing.json'
);
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
  if (!fs.existsSync(SOURCE_FILE)) {
    console.log(
      `ℹ️ No discounts file found at ${SOURCE_FILE} - skipping discount preparation.`
    );
    return;
  }

  const raw = fs.readFileSync(SOURCE_FILE, 'utf8');
  const sourceData = JSON.parse(raw);
  const discounts = Array.isArray(sourceData.discounts)
    ? sourceData.discounts.map((discount) => ({ ...discount }))
    : [];
  const allowedSkus = getAllowedSkus();

  for (let i = 0; i < discounts.length; i += 1) {
    const discount = discounts[i];
    validateDiscount(discount, i, allowedSkus);

    const plainCode = typeof discount.code === 'string' ? discount.code : '';
    const normalized = normalizeDiscountCode(plainCode);

    if (normalized) {
      discount.obfuscatedCode = obfuscateDiscountCode(normalized);
      discount.code = '';
    } else if (plainCode !== '') {
      discount.code = '';
    }

    if (typeof discount.obfuscatedCode !== 'string') {
      discount.obfuscatedCode = '';
    }
  }

  const preparedData = {
    algorithm: DISCOUNT_OBFUSCATION_ALGORITHM,
    pepperVersion: DISCOUNT_OBFUSCATION_PEPPER_VERSION,
  };
  const runtimeData = {
    obfuscation: preparedData,
    discounts,
  };
  const nextContent = `${JSON.stringify(runtimeData, null, 2)}\n`;
  const previousContent = fs.existsSync(OUTPUT_FILE)
    ? fs.readFileSync(OUTPUT_FILE, 'utf8')
    : null;

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });

  if (previousContent === nextContent) {
    console.log('ℹ️ Discounts runtime data already up to date.');
    return;
  }

  fs.writeFileSync(OUTPUT_FILE, nextContent, 'utf8');
  console.log(`✅ Discounts runtime data written to ${OUTPUT_FILE}`);
}

try {
  run();
} catch (err) {
  console.error(`❌ Failed to prepare discounts: ${err.message}`);
  process.exit(1);
}
