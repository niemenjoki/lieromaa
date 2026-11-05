import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, test } from 'node:test';

import discountData from '@/generated/commerce/discounts.json';
import {
  normalizeDiscountCode,
  obfuscateDiscountCode,
} from '@/lib/discounts/discountCode.mjs';
import {
  resolveDiscountCode,
  resolveDiscountForSku,
} from '@/lib/discounts/resolveDiscountForSku.js';

// The tests replace the generated discount list with their own entries, so
// the owner's real discounts cannot affect them.
const CODE = 'SYKSY26';
let originalDiscounts;

function discount(overrides = {}) {
  return {
    id: 'test-discount',
    obfuscatedCode: obfuscateDiscountCode(CODE),
    type: 'percentage',
    value: 10,
    endsOn: '2026-03-10',
    appliesToSkus: ['test-sku-a'],
    ...overrides,
  };
}

function useDiscounts(entries) {
  discountData.discounts = entries;
}

beforeEach(() => {
  originalDiscounts = discountData.discounts;
});

afterEach(() => {
  discountData.discounts = originalDiscounts;
});

describe('discount code end date in Helsinki time', () => {
  test('a code is valid until Helsinki midnight in winter (UTC+2)', () => {
    useDiscounts([discount({ endsOn: '2026-03-10' })]);

    assert.ok(resolveDiscountCode({ code: CODE, now: new Date('2026-03-10T21:59:59Z') }));
    assert.equal(
      resolveDiscountCode({ code: CODE, now: new Date('2026-03-10T22:00:00Z') }),
      null,
      'at 00:00 Helsinki time on the next day the code should have expired'
    );
  });

  test('a code is valid until Helsinki midnight in summer (UTC+3)', () => {
    useDiscounts([discount({ endsOn: '2026-07-10' })]);

    assert.ok(resolveDiscountCode({ code: CODE, now: new Date('2026-07-10T20:59:59Z') }));
    assert.equal(
      resolveDiscountCode({ code: CODE, now: new Date('2026-07-10T21:00:00Z') }),
      null
    );
  });

  test('a code that ends on the daylight saving change day expires at local midnight', () => {
    useDiscounts([discount({ endsOn: '2026-10-25' })]);

    // Clocks go back at 04:00 local time on 25 October; midnight after that is UTC+2.
    assert.ok(resolveDiscountCode({ code: CODE, now: new Date('2026-10-25T21:59:59Z') }));
    assert.equal(
      resolveDiscountCode({ code: CODE, now: new Date('2026-10-25T22:00:00Z') }),
      null
    );
  });

  test('the end date is compared with the Helsinki date, not the UTC date', () => {
    useDiscounts([discount({ endsOn: '2026-03-10' })]);

    // 23:30 Helsinki on the last day: in UTC it is still the same date.
    assert.ok(resolveDiscountCode({ code: CODE, now: new Date('2026-03-10T21:30:00Z') }));
    // 00:30 Helsinki on the next day: in UTC it is still the last day.
    assert.equal(
      resolveDiscountCode({ code: CODE, now: new Date('2026-03-10T22:30:00Z') }),
      null
    );
  });
});

describe('discount code input normalization', () => {
  test('case and whitespace do not matter', () => {
    useDiscounts([discount({ endsOn: '2026-12-31' })]);
    const now = new Date('2026-06-01T09:00:00Z');

    for (const typed of ['syksy26', ' SyKsY26 ', 'SYK SY 26', '\tsyksy26\n']) {
      assert.ok(resolveDiscountCode({ code: typed, now }), JSON.stringify(typed));
    }
    assert.equal(normalizeDiscountCode(' sy ksy26 '), CODE);
  });

  test('an empty or blank code never matches', () => {
    useDiscounts([discount({ endsOn: '2026-12-31', obfuscatedCode: '' })]);
    const now = new Date('2026-06-01T09:00:00Z');

    for (const typed of ['', '   ', '\n']) {
      assert.equal(
        resolveDiscountCode({ code: typed, now }),
        null,
        JSON.stringify(typed)
      );
    }
    assert.equal(obfuscateDiscountCode('  '), '');
  });

  test('a similar but different code does not match', () => {
    useDiscounts([discount({ endsOn: '2026-12-31' })]);
    const now = new Date('2026-06-01T09:00:00Z');

    for (const typed of ['SYKSY2', 'SYKSY266', 'SYKSY-26']) {
      assert.equal(resolveDiscountCode({ code: typed, now }), null, typed);
    }
  });

  test('an entry without SKUs is never applied', () => {
    useDiscounts([discount({ endsOn: '2026-12-31', appliesToSkus: [] })]);

    assert.equal(
      resolveDiscountCode({ code: CODE, now: new Date('2026-06-01T09:00:00Z') }),
      null
    );
  });
});

describe('two discounts with the same code', () => {
  const now = new Date('2026-06-01T09:00:00Z');

  test('an expired entry does not hide a valid entry with the same code', () => {
    useDiscounts([
      discount({ id: 'old', endsOn: '2026-05-31', value: 50 }),
      discount({ id: 'current', endsOn: '2026-06-30', value: 10 }),
    ]);

    const resolved = resolveDiscountCode({ code: CODE, now });
    assert.equal(resolved?.id, 'current');
    assert.equal(resolved.value, 10);
  });

  test('the SKU lookup finds the entry that covers the SKU', () => {
    useDiscounts([
      discount({ id: 'a', endsOn: '2026-06-30', appliesToSkus: ['test-sku-a'] }),
      discount({ id: 'b', endsOn: '2026-06-30', appliesToSkus: ['test-sku-b'] }),
    ]);

    assert.equal(resolveDiscountForSku({ code: CODE, sku: 'test-sku-b', now })?.id, 'b');
    assert.equal(resolveDiscountForSku({ code: CODE, sku: 'test-sku-c', now }), null);
    assert.equal(resolveDiscountForSku({ code: CODE, sku: '', now }), null);
  });

  test('the cart lookup uses the first valid entry only (current behaviour)', () => {
    // The cart applies the returned entry's SKUs. With two valid entries the
    // second one's SKUs get no discount in the cart, while the product page
    // (SKU lookup) shows one. prepareDiscounts does not reject duplicates.
    useDiscounts([
      discount({ id: 'a', endsOn: '2026-06-30', appliesToSkus: ['test-sku-a'] }),
      discount({ id: 'b', endsOn: '2026-06-30', appliesToSkus: ['test-sku-b'] }),
    ]);

    const resolved = resolveDiscountCode({ code: CODE, now });
    assert.equal(resolved?.id, 'a');
    assert.deepEqual(resolved.appliesToSkus, ['test-sku-a']);
  });

  test('the returned discount is a copy that cannot change the source data', () => {
    const entry = discount({ endsOn: '2026-06-30' });
    useDiscounts([entry]);

    const resolved = resolveDiscountCode({ code: CODE, now });
    resolved.appliesToSkus.push('test-sku-x');
    assert.deepEqual(entry.appliesToSkus, ['test-sku-a']);
  });
});
