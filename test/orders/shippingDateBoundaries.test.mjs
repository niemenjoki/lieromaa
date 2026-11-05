import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { getEstimatedShippingDate } from '@/lib/commerce/shippingEstimate.mjs';
import {
  formatBusinessDateTime,
  getBusinessDateOnly,
} from '@/lib/dates/businessDate.mjs';

// The schedule keys are structural (they select the rule), not sale data.
// An empty product list uses the plain next-business-day rule.
const WORMS = ['worms'];
const NEXT_BUSINESS_DAY = [];

function estimate(productKeys, isoInstant) {
  return getEstimatedShippingDate({ productKeys, orderDate: new Date(isoInstant) });
}

describe('shipping estimate around the Saturday cutoff in Helsinki time', () => {
  test('Saturday 23:30 in Helsinki still makes the next Monday (summer)', () => {
    // 2026-05-30 is a Saturday; 23:30 EEST is 20:30 UTC on the same day.
    assert.equal(estimate(WORMS, '2026-05-30T20:30:00Z'), '2026-06-01');
  });

  test('Sunday 00:30 in Helsinki misses the next Monday although UTC is still Saturday', () => {
    // 00:30 EEST on Sunday is 21:30 UTC on Saturday.
    assert.equal(estimate(WORMS, '2026-05-30T21:30:00Z'), '2026-06-08');
  });

  test('Saturday 23:30 in Helsinki still makes the next Monday (winter)', () => {
    // 2026-01-31 is a Saturday; 23:30 EET is 21:30 UTC.
    assert.equal(estimate(WORMS, '2026-01-31T21:30:00Z'), '2026-02-02');
    assert.equal(estimate(WORMS, '2026-01-31T22:00:00Z'), '2026-02-09');
  });
});

describe('shipping estimate on daylight saving change days', () => {
  test('spring forward: Saturday 28 March before and after Helsinki midnight (UTC+2)', () => {
    assert.equal(estimate(WORMS, '2026-03-28T21:59:59Z'), '2026-03-30');
    assert.equal(estimate(WORMS, '2026-03-28T22:00:00Z'), '2026-04-06');
  });

  test('spring forward: Sunday 29 March ends at 21:00 UTC (UTC+3)', () => {
    assert.equal(estimate(NEXT_BUSINESS_DAY, '2026-03-29T20:59:59Z'), '2026-03-30');
    assert.equal(estimate(NEXT_BUSINESS_DAY, '2026-03-29T21:00:00Z'), '2026-03-31');
  });

  test('fall back: Saturday 24 October before and after Helsinki midnight (UTC+3)', () => {
    assert.equal(estimate(WORMS, '2026-10-24T20:59:59Z'), '2026-10-26');
    assert.equal(estimate(WORMS, '2026-10-24T21:00:00Z'), '2026-11-02');
  });

  test('fall back: Sunday 25 October ends at 22:00 UTC (UTC+2)', () => {
    assert.equal(estimate(NEXT_BUSINESS_DAY, '2026-10-25T21:59:59Z'), '2026-10-26');
    assert.equal(estimate(NEXT_BUSINESS_DAY, '2026-10-25T22:00:00Z'), '2026-10-27');
  });

  test('the hour that repeats or is skipped stays on the same Helsinki day', () => {
    // 03:00-04:00 local time is skipped on 29 March and repeated on 25 October.
    assert.equal(estimate(NEXT_BUSINESS_DAY, '2026-03-29T00:30:00Z'), '2026-03-30');
    assert.equal(estimate(NEXT_BUSINESS_DAY, '2026-10-25T00:30:00Z'), '2026-10-26');
    assert.equal(estimate(NEXT_BUSINESS_DAY, '2026-10-25T01:30:00Z'), '2026-10-26');
  });
});

describe('business date on daylight saving change days', () => {
  test('getBusinessDateOnly changes the date at Helsinki midnight on both change days', () => {
    assert.equal(getBusinessDateOnly(new Date('2026-03-28T21:59:59Z')), '2026-03-28');
    assert.equal(getBusinessDateOnly(new Date('2026-03-28T22:00:00Z')), '2026-03-29');
    assert.equal(getBusinessDateOnly(new Date('2026-03-29T20:59:59Z')), '2026-03-29');
    assert.equal(getBusinessDateOnly(new Date('2026-03-29T21:00:00Z')), '2026-03-30');
    assert.equal(getBusinessDateOnly(new Date('2026-10-24T20:59:59Z')), '2026-10-24');
    assert.equal(getBusinessDateOnly(new Date('2026-10-24T21:00:00Z')), '2026-10-25');
    assert.equal(getBusinessDateOnly(new Date('2026-10-25T21:59:59Z')), '2026-10-25');
    assert.equal(getBusinessDateOnly(new Date('2026-10-25T22:00:00Z')), '2026-10-26');
  });

  test('the end of a change day uses the offset that is in force at 23:59:59', () => {
    const springEnd = formatBusinessDateTime('2026-03-29', '23:59:59');
    const autumnEnd = formatBusinessDateTime('2026-10-25', '23:59:59');

    assert.equal(springEnd, '2026-03-29T23:59:59+03:00');
    assert.equal(autumnEnd, '2026-10-25T23:59:59+02:00');
    assert.equal(getBusinessDateOnly(new Date(springEnd)), '2026-03-29');
    assert.equal(getBusinessDateOnly(new Date(autumnEnd)), '2026-10-25');
  });

  test.todo(
    'the start of a change day uses the offset that is in force at 00:00 (VIKA: offset luetaan klo 12 UTC:n mukaan)',
    () => {
      // Midnight on 29 March is still winter time (+02:00) and midnight on
      // 25 October is still summer time (+03:00). With the noon offset the
      // Merchant feed sale window starts an hour early in spring and an hour
      // late in autumn.
      const springStart = formatBusinessDateTime('2026-03-29');
      const autumnStart = formatBusinessDateTime('2026-10-25');

      assert.equal(getBusinessDateOnly(new Date(springStart)), '2026-03-29');
      assert.equal(springStart, '2026-03-29T00:00:00+02:00');
      assert.equal(autumnStart, '2026-10-25T00:00:00+03:00');
    }
  );
});
