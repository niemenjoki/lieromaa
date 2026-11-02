import assert from 'node:assert/strict';
import test from 'node:test';

import { toLookuEvent } from '@/lib/analytics/lookuEvents.mjs';

test('site events map to Looku events with the text value in props', () => {
  assert.deepEqual(
    toLookuEvent({
      eventName: 'add_to_cart',
      eventTarget: 'product',
      eventValue: 'MATO-250',
      eventItems: [{ sku: 'MATO-250', quantity: '2' }, { sku: '' }],
    }),
    {
      name: 'add_to_cart',
      options: {
        target: 'product',
        props: { value: 'MATO-250' },
        items: [{ sku: 'MATO-250', quantity: 2 }],
      },
    }
  );
  assert.deepEqual(toLookuEvent({ eventName: 'checkout_view' }), {
    name: 'checkout_view',
    options: {},
  });
});

test('events with a name Looku does not accept are dropped', () => {
  assert.equal(toLookuEvent({ eventName: '' }), null);
  assert.equal(toLookuEvent({ eventName: 'Add To Cart' }), null);
  assert.equal(toLookuEvent(), null);
});
