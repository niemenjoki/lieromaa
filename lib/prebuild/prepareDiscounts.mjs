import fs from 'fs';
import path from 'path';

import productCatalogCommerceSource from '../../data/operations/products/catalogCommerce.mjs';
import { getBusinessDateOnly } from '../dates/businessDate.mjs';
import {
  DISCOUNT_OBFUSCATION_ALGORITHM,
  DISCOUNT_OBFUSCATION_PEPPER_VERSION,
  normalizeDiscountCode,
} from '../discounts/discountCode.mjs';
import { createWormHuntDiscount, isWormHuntDiscountId } from '../wormHunt/config.mjs';

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

function getAllowedExtraChargeKeys() {
  return new Set(
    Object.values(productCatalogCommerceSource)
      .flatMap((product) => product?.order?.extraCharges ?? [])
      .map((charge) => charge?.key)
      .filter((key) => typeof key === 'string' && key.length > 0)
  );
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Päivän on oltava oikea kalenteripäivä: pelkkä muoto päästäisi läpi esimerkiksi päivän 2026-02-31, jota
// päättymispäivien merkkijonovertailu pitäisi voimassa olevana koko helmikuun lopun ja maaliskuun alun.
function isDateOnly(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof value === 'string' ? value : '');
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function validateDiscount(entry, index, allowedSkus, allowedExtraChargeKeys) {
  const i = index + 1;
  assert(entry && typeof entry === 'object', `[discount ${i}] must be an object`);
  assert(
    Array.isArray(entry.appliesToSkus) && entry.appliesToSkus.length > 0,
    `[discount ${i}] appliesToSkus must contain at least one SKU`
  );

  for (const sku of entry.appliesToSkus) {
    assert(allowedSkus.has(sku), `[discount ${i}] invalid SKU "${sku}"`);
  }

  const hasObfuscatedCode =
    typeof entry.obfuscatedCode === 'string' && entry.obfuscatedCode.trim().length > 0;
  assert(
    !normalizeDiscountCode(entry.code ?? ''),
    `[discount ${i}] must not contain code`
  );
  assert(hasObfuscatedCode, `[discount ${i}] must contain obfuscatedCode`);

  assert(ALLOWED_TYPES.has(entry.type), `[discount ${i}] invalid type "${entry.type}"`);

  if ('appliesToExtraChargeKeys' in entry) {
    assert(
      Array.isArray(entry.appliesToExtraChargeKeys) &&
        entry.appliesToExtraChargeKeys.length > 0,
      `[discount ${i}] appliesToExtraChargeKeys must contain at least one extra-charge key`
    );

    for (const key of entry.appliesToExtraChargeKeys) {
      assert(
        allowedExtraChargeKeys.has(key),
        `[discount ${i}] invalid extra-charge key "${key}"`
      );
    }

    assert(
      entry.type !== 'free_shipping',
      `[discount ${i}] free_shipping cannot target extra charges`
    );
  }

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
    `[discount ${i}] endsOn must be a real calendar date in YYYY-MM-DD format`
  );
}

// Sama koodi usealla voimassa olevalla rivillä toimii (kori valitsee rivin, joka koskee
// korin tuotetta), mutta se on helppo tehdä vahingossa. Siitä vain varoitetaan, jotta
// omistajan datamuutos ei kaada buildia.
function warnAboutSharedCodes(discounts, today) {
  const entriesByCode = new Map();
  for (const discount of discounts) {
    if (discount.endsOn < today) {
      continue;
    }
    const ids = entriesByCode.get(discount.obfuscatedCode) ?? [];
    ids.push(discount.id ?? '(no id)');
    entriesByCode.set(discount.obfuscatedCode, ids);
  }

  for (const ids of entriesByCode.values()) {
    if (ids.length > 1) {
      console.warn(
        `⚠️ Discounts ${ids.join(', ')} share the same code and are valid at the same time. The cart uses the entry that covers the product in the cart.`
      );
    }
  }
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
    ? sourceData.discounts
        .filter((discount) => !isWormHuntDiscountId(discount?.id))
        .map((discount) => ({ ...discount }))
    : [];
  const wormHuntDiscount = createWormHuntDiscount();
  if (wormHuntDiscount) {
    discounts.push(wormHuntDiscount);
  }
  const allowedSkus = getAllowedSkus();
  const allowedExtraChargeKeys = getAllowedExtraChargeKeys();

  for (let i = 0; i < discounts.length; i += 1) {
    const discount = discounts[i];
    validateDiscount(discount, i, allowedSkus, allowedExtraChargeKeys);

    delete discount.code;
  }

  warnAboutSharedCodes(discounts, getBusinessDateOnly());

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
