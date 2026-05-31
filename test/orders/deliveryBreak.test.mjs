import { describe, test } from 'node:test';

import { adjustShippingDateForDeliveryBreak } from '@/lib/commerce/deliveryBreak.mjs';

import { expectEqual } from '../helpers/assertions.mjs';

describe('delivery break shipping date adjustments', () => {
  test('keeps normal shipping dates outside the summer break', () => {
    expectEqual(
      adjustShippingDateForDeliveryBreak({
        estimatedShippingDate: '2026-06-22',
        orderDate: '2026-06-18',
      }),
      '2026-06-22',
      'delivery break adjustment should not change dates before the break'
    );
  });

  test('moves cutoff-day orders that would ship during the break to the final pre-break shipping day', () => {
    expectEqual(
      adjustShippingDateForDeliveryBreak({
        estimatedShippingDate: '2026-07-06',
        orderDate: '2026-06-27',
      }),
      '2026-06-29',
      'delivery break adjustment should use the announced final pre-break shipping date'
    );
  });

  test('moves post-cutoff and holiday orders to the first post-break shipping day', () => {
    expectEqual(
      adjustShippingDateForDeliveryBreak({
        estimatedShippingDate: '2026-07-06',
        orderDate: '2026-06-28',
      }),
      '2026-07-13',
      'delivery break adjustment should not include Sunday orders in the final pre-break shipping day'
    );

    expectEqual(
      adjustShippingDateForDeliveryBreak({
        estimatedShippingDate: '2026-07-06',
        orderDate: '2026-06-29',
      }),
      '2026-07-13',
      'delivery break adjustment should use the announced next shipping date after the break'
    );
  });
});
