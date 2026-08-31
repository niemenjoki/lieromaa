import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  CHECKOUT_DRAFT_LIFETIME_MS,
  createCheckoutDraft,
  parseCheckoutDraft,
} from '@/lib/orders/checkoutDraft.mjs';

const NOW = Date.UTC(2026, 7, 31, 8, 0, 0);

function createDraft() {
  return createCheckoutDraft(
    {
      language: 'fi',
      cartFingerprint: 'cart-123',
      sourceRequestId: 'submission-123',
      formStartedAt: String(NOW - 5000),
      shippingMethod: 'posti_noutopiste',
      addressFields: {
        line1: 'Testikatu 1',
        postalCode: '00100',
        city: 'Helsinki',
      },
      customerFields: {
        name: 'Testiasiakas',
        email: 'customer@example.test',
        phone: '+358401234567',
        message: 'Testiviesti',
      },
      selectedPickupPoint: {
        id: 'pickup-1',
        name: 'Testinoutopiste',
        street: 'Postikatu 2',
        postalCode: '00100',
        city: 'Helsinki',
        parcelLocker: true,
        distanceInMeters: 250,
      },
      paymentProvider: 'STRIPE',
      discountCodeInput: 'ABCDEF',
      appliedDiscountCode: 'ABCDEF',
    },
    { now: NOW }
  );
}

test('checkout draft round-trips the fields required after a Stripe cancellation', () => {
  const draft = createDraft();
  const restored = parseCheckoutDraft(JSON.stringify(draft), { now: NOW + 1000 });

  assert.deepEqual(restored, draft);
  assert.equal(restored.customerFields.email, 'customer@example.test');
  assert.equal(restored.selectedPickupPoint.id, 'pickup-1');
  assert.equal(restored.expiresAt, NOW + CHECKOUT_DRAFT_LIFETIME_MS);
});

test('checkout draft expires after one hour', () => {
  const serialized = JSON.stringify(createDraft());

  assert.ok(
    parseCheckoutDraft(serialized, {
      now: NOW + CHECKOUT_DRAFT_LIFETIME_MS - 1,
    })
  );
  assert.equal(
    parseCheckoutDraft(serialized, {
      now: NOW + CHECKOUT_DRAFT_LIFETIME_MS,
    }),
    null
  );
});

test('checkout draft rejects malformed, incomplete and extended-lifetime values', () => {
  const draft = createDraft();

  assert.equal(parseCheckoutDraft('not-json', { now: NOW }), null);
  assert.equal(
    parseCheckoutDraft(JSON.stringify({ ...draft, sourceRequestId: '' }), {
      now: NOW,
    }),
    null
  );
  assert.equal(
    parseCheckoutDraft(
      JSON.stringify({
        ...draft,
        expiresAt: draft.expiresAt + 1,
      }),
      { now: NOW }
    ),
    null
  );
});
