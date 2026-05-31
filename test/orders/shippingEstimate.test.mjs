import { describe, test } from 'node:test';

import { getEstimatedShippingDate } from '@/lib/commerce/shippingEstimate.mjs';

import { expectEqual } from '../helpers/assertions.mjs';

describe('checkout shipping date estimates', () => {
  test('worms use Saturday as the last order day for the next Monday shipment', () => {
    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['worms'],
        orderDate: '2026-05-30',
      }),
      '2026-06-01',
      'Saturday worm orders should estimate the next Monday shipment'
    );

    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['worms'],
        orderDate: '2026-05-31',
      }),
      '2026-06-08',
      'Sunday worm orders should skip the next-day Monday shipment'
    );

    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['worms'],
        orderDate: '2026-06-01',
      }),
      '2026-06-08',
      'Monday worm orders should estimate the following Monday shipment'
    );
  });

  test('compost chow uses the same Saturday cutoff as worms', () => {
    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['compostChow'],
        orderDate: '2026-05-31',
      }),
      '2026-06-08',
      'Sunday chow orders should skip the next-day Monday shipment'
    );
  });

  test('starter kit estimates keep the existing second-following-Monday schedule', () => {
    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['starterKit'],
        orderDate: '2026-05-31',
      }),
      '2026-06-08',
      'Sunday starter-kit orders should keep the existing one-week-plus schedule'
    );

    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['starterKit'],
        orderDate: '2026-06-01',
      }),
      '2026-06-15',
      'Monday starter-kit orders should keep the second-following-Monday schedule'
    );
  });

  test('mixed carts use the slowest product schedule', () => {
    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['worms', 'starterKit', 'compostChow'],
        orderDate: '2026-06-01',
      }),
      '2026-06-15',
      'mixed carts should use the starter-kit schedule when it is later'
    );
  });

  test('manual availability dates can delay but not shorten the normal estimate', () => {
    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['worms'],
        availabilityDatesByProductKey: {
          worms: '2026-06-15',
        },
        orderDate: '2026-05-30',
      }),
      '2026-06-15',
      'later manual availability dates should delay the estimate'
    );

    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['worms'],
        availabilityDatesByProductKey: {
          worms: '2026-06-01',
        },
        orderDate: '2026-05-31',
      }),
      '2026-06-08',
      'earlier manual availability dates should not shorten the normal estimate'
    );
  });

  test('summer break estimates keep product-specific cutoffs', () => {
    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['worms'],
        orderDate: '2026-06-27',
      }),
      '2026-06-29',
      'Saturday worm orders before the break should still estimate the final pre-break Monday'
    );

    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['worms'],
        orderDate: '2026-06-28',
      }),
      '2026-07-13',
      'Sunday worm orders before the break should move to the first post-break Monday'
    );

    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['starterKit'],
        orderDate: '2026-06-21',
      }),
      '2026-06-29',
      'starter-kit orders made far enough ahead should still estimate the final pre-break Monday'
    );

    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['starterKit'],
        orderDate: '2026-06-22',
      }),
      '2026-07-13',
      'starter-kit orders should not be shortened into the final pre-break Monday'
    );
  });
});
