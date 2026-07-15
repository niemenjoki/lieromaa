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

  test('prepared worm bins ship on the third following Monday', () => {
    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['preparedWormBin'],
        orderDate: '2026-05-31',
      }),
      '2026-06-15',
      'Sunday prepared-bin orders should skip the next two Mondays'
    );

    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['preparedWormBin'],
        orderDate: '2026-06-01',
      }),
      '2026-06-22',
      'Monday prepared-bin orders should use the third upcoming Monday'
    );
  });

  test('mixed carts use the slowest product schedule', () => {
    expectEqual(
      getEstimatedShippingDate({
        productKeys: ['worms', 'preparedWormBin', 'compostChow'],
        orderDate: '2026-06-01',
      }),
      '2026-06-22',
      'mixed carts should use the prepared-bin schedule when it is later'
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
});
