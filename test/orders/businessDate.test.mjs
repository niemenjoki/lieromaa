import { describe, test } from 'node:test';

import {
  formatBusinessDateTime,
  getBusinessDateOnly,
} from '@/lib/dates/businessDate.mjs';

import { expectEqual } from '../helpers/assertions.mjs';

describe('business date handling', () => {
  test('uses Helsinki midnight for summer discount boundaries', () => {
    expectEqual(
      getBusinessDateOnly(new Date('2026-07-14T20:59:59Z')),
      '2026-07-14',
      'the date should remain July 14 immediately before Helsinki midnight'
    );
    expectEqual(
      getBusinessDateOnly(new Date('2026-07-14T21:00:00Z')),
      '2026-07-15',
      'the date should change at Helsinki midnight during daylight saving time'
    );
  });

  test('formats Merchant feed boundaries with the seasonal Helsinki offset', () => {
    expectEqual(
      formatBusinessDateTime('2026-07-15'),
      '2026-07-15T00:00:00+03:00',
      'summer promotion dates should use the daylight-saving offset'
    );
    expectEqual(
      formatBusinessDateTime('2026-12-15', '23:59:59'),
      '2026-12-15T23:59:59+02:00',
      'winter promotion dates should use the standard-time offset'
    );
  });
});
