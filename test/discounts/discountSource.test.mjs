import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import { obfuscateDiscountCode } from '@/lib/discounts/discountCode.mjs';
import { createDiscountSourceData } from '@/lib/prebuild/generateDiscountCodes.mjs';

const sourceFile = path.join(
  process.cwd(),
  'data',
  'operations',
  'commerce',
  'discounts.source.json'
);
const localFile = path.join(
  process.cwd(),
  'data',
  'operations',
  'commerce',
  'discounts.local.json'
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

describe('discount source data', () => {
  test('tracked discount source should contain generated obfuscations only', () => {
    const sourceData = readJson(sourceFile);
    const discounts = Array.isArray(sourceData.discounts) ? sourceData.discounts : [];
    const seenIds = new Set();

    for (const [index, discount] of discounts.entries()) {
      const label = discount?.id || `discount ${index + 1}`;

      assert.equal(typeof discount?.id, 'string', `${label} should contain an id`);
      assert.ok(discount.id.trim().length > 0, `${label} should contain an id`);
      assert.equal(seenIds.has(discount.id), false, `${label} id should be unique`);
      seenIds.add(discount.id);
      assert.equal(
        Object.hasOwn(discount, 'code'),
        false,
        `${label} should not commit a plaintext code`
      );
      assert.equal(
        typeof discount?.obfuscatedCode,
        'string',
        `${label} should contain a generated obfuscatedCode`
      );
      assert.ok(
        discount.obfuscatedCode.trim().length > 0,
        `${label} should contain a non-empty generated obfuscatedCode`
      );
    }
  });

  test('tracked discount source should match local discount definitions when local file exists', () => {
    if (!fs.existsSync(localFile)) {
      return;
    }

    const sourceData = readJson(sourceFile);
    const localData = readJson(localFile);
    const expected = createDiscountSourceData(localData, sourceData).sourceData;

    assert.deepEqual(
      sourceData.discounts,
      expected.discounts,
      'discounts.source.json should be regenerated after local ids, codes, or discount definitions change'
    );
  });

  test('local discount definitions should generate source and remove entries that are not listed locally', () => {
    const previousSourceData = {
      discounts: [
        {
          id: 'keep_me',
          obfuscatedCode: 'old-value',
          type: 'fixed',
          value: 1,
        },
        {
          id: 'remove_me',
          obfuscatedCode: 'stale-value',
        },
      ],
    };
    const result = createDiscountSourceData(
      {
        discounts: [
          {
            id: 'keep_me',
            code: 'new-local-code',
            type: 'percentage',
            value: 25,
          },
        ],
      },
      previousSourceData
    );

    assert.deepEqual(
      result.sourceData.discounts.map((discount) => discount.id),
      ['keep_me'],
      'local discount generation should keep only source discounts listed in the local file'
    );
    assert.equal(
      result.sourceData.discounts[0].obfuscatedCode,
      obfuscateDiscountCode('new-local-code'),
      'local discount generation should refresh obfuscatedCode from the local plaintext code'
    );
    assert.equal(
      result.sourceData.discounts[0].type,
      'percentage',
      'local discount generation should use metadata from the local file'
    );
    assert.equal(
      Object.hasOwn(result.sourceData.discounts[0], 'code'),
      false,
      'local discount generation should remove plaintext code fields from retained source entries'
    );
    assert.deepEqual(result.removedIds, ['remove_me']);
  });
});
