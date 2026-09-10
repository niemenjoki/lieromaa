import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ORDER_SUPPORT_EMAIL } from '@/lib/copy/orderMessages';
import { buildOrderEmailDraft } from '@/lib/orders/orderEmailDraft';
import { isOrderServiceUnavailable, submitOrderForm } from '@/lib/orders/submitOrderForm';

test('submission retains error codes/status without changing successful responses', async (t) => {
  t.mock.method(globalThis, 'FormData', function () {
    return new Map([['nimi', 'Testiasiakas']]);
  });
  const fetch = t.mock.method(globalThis, 'fetch', async () =>
    Response.json({ ok: true, orderId: 'test-order' })
  );
  assert.deepEqual(await submitOrderForm({}), { ok: true, orderId: 'test-order' });
  for (const [status, code, unavailable] of [
    [500, 'upstream_unavailable', true],
    [502, '', true],
    [503, '', true],
    [504, '', true],
    [408, '', true],
    [400, 'invalid_request', false],
    [409, 'out_of_stock', false],
    [422, 'invalid_email', false],
    [429, 'rate_limited', false],
  ]) {
    fetch.mock.mockImplementation(async () =>
      Response.json({ ok: false, code, message: 'Specific message' }, { status })
    );
    await assert.rejects(submitOrderForm({}), (error) => {
      assert.equal(error.status, status);
      assert.equal(error.code, code);
      assert.equal(error.message, 'Specific message');
      assert.equal(isOrderServiceUnavailable(error), unavailable);
      return true;
    });
  }
  fetch.mock.mockImplementation(
    async () => new Response('<html>Gateway timeout</html>', { status: 504 })
  );
  await assert.rejects(submitOrderForm({}), isOrderServiceUnavailable);
  fetch.mock.mockImplementation(async () => new Response('<html>Unexpected page</html>'));
  await assert.rejects(submitOrderForm({}), isOrderServiceUnavailable);
  for (const cause of [
    new TypeError('Failed to fetch'),
    new DOMException('Timeout', 'TimeoutError'),
  ]) {
    fetch.mock.mockImplementation(async () => {
      throw cause;
    });
    await assert.rejects(submitOrderForm({}), (error) => {
      assert.equal(error.cause, cause);
      return isOrderServiceUnavailable(error);
    });
  }
  assert.equal(
    isOrderServiceUnavailable(new Error('Unrelated application error')),
    false
  );
});

test('draft contains readable order fields and extras without internal data', () => {
  const order = {
    items: [
      {
        label: 'Kompostimadot 50 g',
        quantity: 2,
        extras: ['Lieromaan kompostorin kuituseos 150 g'],
      },
    ],
    customer: {
      name: 'Testiasiakas',
      email: 'test@example.test',
      phone: '+358401234567',
      message: 'Ovikoodi & lisäohje\nToinen rivi',
    },
    address: { line1: 'Testikatu 1', postalCode: '00100', city: 'Helsinki' },
    shippingLabel: 'Postipaketti noutopisteeseen',
    pickupPoint: {
      id: 'INTERNAL-PICKUP-ID',
      name: 'Testipiste',
      street: 'Postikatu 2',
      postalCode: '00100',
      city: 'Helsinki',
      specificLocation: 'Aula',
    },
    paymentLabel: 'Sähköpostilasku',
    discountCode: 'TEST&10',
    total: 47.9,
    submission_id: 'INTERNAL-SUBMISSION-ID',
    _gotcha: 'HONEYPOT',
  };
  const draft = buildOrderEmailDraft(order);
  for (const text of [
    'Aihe: Tilaus Lieromaasta',
    'Verkkolomakkeen lähetys ei saanut vahvistusta.',
    '2 × Kompostimadot 50 g',
    'kuituseos 150 g',
    'Nimi: Testiasiakas',
    'Sähköposti: test@example.test',
    'Puhelinnumero: +358401234567',
    'Testikatu 1, 00100, Helsinki',
    'Postikatu 2',
    'Aula',
    'Maksutapa: Sähköpostilasku',
    'Alennuskoodi: TEST&10',
    '47,90',
    'Ovikoodi & lisäohje\nToinen rivi',
  ]) {
    assert.ok(draft.text.includes(text), text);
  }
  assert.doesNotMatch(draft.text, /INTERNAL|HONEYPOT|undefined|\[object Object\]/);
  const url = new URL(draft.href);
  assert.equal(url.pathname, ORDER_SUPPORT_EMAIL);
  assert.equal(url.searchParams.get('subject'), 'Tilaus Lieromaasta');
  assert.equal(
    draft.text,
    `Aihe: ${url.searchParams.get('subject')}\n\n${url.searchParams.get('body')}`
  );
  const edited = buildOrderEmailDraft({
    ...order,
    customer: { ...order.customer, name: 'Muokattu nimi' },
    total: 52,
  });
  assert.match(edited.text, /Muokattu nimi/);
  assert.doesNotMatch(edited.text, /Testiasiakas/);
  assert.notEqual(edited.href, draft.href);
});

test('empty optional fields and unknown totals are omitted; English uses English copy', () => {
  const draft = buildOrderEmailDraft({
    language: 'en',
    items: [{ label: 'Worms 50 g', quantity: 1 }],
  });
  assert.match(draft.text, /Subject: Order from Lieromaa/);
  assert.match(draft.text, /did not receive confirmation/);
  assert.doesNotMatch(
    draft.text,
    /Address:|Pickup point:|Discount code:|Total shown|undefined|null/
  );
});
