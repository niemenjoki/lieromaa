import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import { obfuscateDiscountCode } from '@/lib/discounts/discountCode.mjs';
import {
  resolveDiscountCode,
  resolveDiscountForSku,
} from '@/lib/discounts/resolveDiscountForSku';
import { createDiscountSourceData } from '@/lib/prebuild/generateDiscountCodes.mjs';
import {
  WORM_HUNT_DISCOUNT_ID,
  WORM_HUNT_DISCOUNT_SKUS,
  createWormHuntDiscount,
  wormHuntConfig,
} from '@/lib/wormHunt/config.mjs';

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

  test('the active checkout reward should resolve only for the configured worm SKUs', () => {
    const rewardCode = wormHuntConfig.code;
    const now = new Date('2026-08-04T10:00:00Z');
    const discount = resolveDiscountCode({ code: rewardCode.toLowerCase(), now });

    if (!wormHuntConfig.enabled) {
      assert.equal(discount, null, 'a disabled worm hunt should not deploy its reward');
      return;
    }

    assert.ok(discount, 'the configured checkout reward should be active');
    assert.equal(discount.id, WORM_HUNT_DISCOUNT_ID);
    assert.equal(discount.type, 'percentage');
    assert.equal(discount.value, wormHuntConfig.discountPercentage);
    assert.deepEqual(discount.appliesToSkus, WORM_HUNT_DISCOUNT_SKUS);

    for (const sku of discount.appliesToSkus) {
      assert.ok(
        resolveDiscountForSku({ code: rewardCode, sku, now }),
        `${sku} should accept the checkout reward`
      );
    }

    for (const sku of [
      'worms-ready-bin-14l',
      'chow-150',
      'chow-500',
      'postage-pickup',
      'postage-home',
    ]) {
      assert.equal(
        resolveDiscountForSku({ code: rewardCode, sku, now }),
        null,
        `${sku} should not accept the checkout reward`
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

    if (expected.discounts.length === 0) {
      return;
    }

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

  test('generic discount generation leaves the worm hunt reward to its build-time config', () => {
    const configuredDiscount = createWormHuntDiscount();
    const result = createDiscountSourceData(
      {
        discounts: [
          {
            id: WORM_HUNT_DISCOUNT_ID,
            code: 'ABCDEF',
            appliesToSkus: ['worms-25'],
            type: 'percentage',
            value: 99,
            endsOn: '2099-12-31',
          },
        ],
      },
      { discounts: configuredDiscount ? [configuredDiscount] : [] }
    );

    assert.deepEqual(result.sourceData.discounts, []);
  });

  test('expired local discount definitions should not generate deployable source entries', () => {
    const result = createDiscountSourceData(
      {
        discounts: [
          {
            id: 'expired',
            code: 'old-code',
            appliesToSkus: ['chow-500'],
            type: 'fixed',
            value: 3,
            endsOn: '2026-05-03',
          },
        ],
      },
      {
        discounts: [
          {
            id: 'expired',
            obfuscatedCode: 'old-value',
            type: 'fixed',
            value: 3,
            endsOn: '2026-05-03',
          },
        ],
      }
    );

    assert.deepEqual(result.sourceData.discounts, []);
    assert.deepEqual(result.removedIds, ['expired']);
  });
});
