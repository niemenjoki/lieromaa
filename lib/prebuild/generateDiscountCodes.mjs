import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
const LOCAL_FILE = path.join(
  process.cwd(),
  'data',
  'operations',
  'commerce',
  'discounts.local.json'
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function getLocalDiscounts(localData) {
  const discounts = localData?.discounts ?? [];
  assert(
    Array.isArray(discounts),
    'discounts.local.json must contain a "discounts" array'
  );

  return discounts;
}

function createSourceDiscount(localDiscount, index, seenIds) {
  assert(
    localDiscount && typeof localDiscount === 'object' && !Array.isArray(localDiscount),
    `[discount ${index + 1}] must be an object`
  );

  const id = String(localDiscount.id || '').trim();
  assert(id, `[discount ${index + 1}] must contain an id`);
  assert(!seenIds.has(id), `[discount ${index + 1}] duplicate id "${id}"`);
  seenIds.add(id);

  const plainCode = normalizeDiscountCode(localDiscount.code ?? '');
  assert(plainCode, `[discount ${index + 1}] must contain a plaintext code`);

  const { code, obfuscatedCode, ...sourceDiscount } = localDiscount;
  return {
    ...sourceDiscount,
    id,
    obfuscatedCode: obfuscateDiscountCode(plainCode),
  };
}

function getDiscountIds(discounts) {
  return new Set(
    (Array.isArray(discounts) ? discounts : [])
      .map((discount) => String(discount?.id || '').trim())
      .filter(Boolean)
  );
}

export function createDiscountSourceData(localData, previousSourceData = {}) {
  const seenIds = new Set();
  const sourceDiscounts = getLocalDiscounts(localData).map((discount, index) =>
    createSourceDiscount(discount, index, seenIds)
  );
  const previousIds = getDiscountIds(previousSourceData.discounts);
  const nextIds = getDiscountIds(sourceDiscounts);

  const removedIds = [...previousIds].filter((id) => !nextIds.has(id));

  return {
    sourceData: {
      ...previousSourceData,
      obfuscation: {
        algorithm: DISCOUNT_OBFUSCATION_ALGORITHM,
        pepperVersion: DISCOUNT_OBFUSCATION_PEPPER_VERSION,
      },
      discounts: sourceDiscounts,
    },
    removedIds,
  };
}

function formatRemovedMessage(removedIds) {
  if (!removedIds.length) {
    return '';
  }

  return `ℹ️ Removed discount source entr${
    removedIds.length === 1 ? 'y' : 'ies'
  } not listed in discounts.local.json: ${removedIds.join(', ')}.`;
}

function writeSourceFile(sourceData) {
  fs.mkdirSync(path.dirname(SOURCE_FILE), { recursive: true });
  fs.writeFileSync(SOURCE_FILE, `${JSON.stringify(sourceData, null, 2)}\n`, 'utf8');
}

export function run() {
  assert(
    fs.existsSync(LOCAL_FILE),
    `Local discount code file not found at ${LOCAL_FILE}. Create it with a "discounts" array.`
  );

  const previousSourceData = fs.existsSync(SOURCE_FILE) ? readJson(SOURCE_FILE) : {};
  const localData = readJson(LOCAL_FILE);
  const result = createDiscountSourceData(localData, previousSourceData);

  writeSourceFile(result.sourceData);

  const removedMessage = formatRemovedMessage(result.removedIds);
  if (removedMessage) {
    console.log(removedMessage);
  }

  console.log(`✅ Discount obfuscations updated in ${SOURCE_FILE}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    run();
  } catch (err) {
    console.error(`❌ Failed to generate discount codes: ${err.message}`);
    process.exit(1);
  }
}
