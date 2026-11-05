import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { POST } from '@/app/api/orders/submit/route.js';
import { normalizePublicOrderSubmission } from '@/lib/orders/normalizePublicOrder';
import { getCartShippingOptions } from '@/lib/pricing/catalog';

import { withMutedConsole } from '../helpers/console.mjs';
import { createValidOrderFormData } from '../helpers/orderForm.mjs';
import { listOrderScenarios } from '../helpers/orderScenarios.mjs';
import { withTemporaryProductAvailabilityAsync } from '../helpers/productAvailability.mjs';
import { createRouteRequest } from '../helpers/routeRequest.mjs';
import {
  ORDER_SERVICE_ENV,
  withMockFetch,
  withTemporaryEnv,
} from '../helpers/routeTestKit.mjs';

const SUBMIT_URL = 'https://www.lieromaa.fi/api/orders/submit';

const ADDRESS = {
  osoite: 'Kompostikuja 1',
  postinumero: '00100',
  toimipaikka: 'Helsinki',
};

function buildCartForm({ sku, shippingId, paymentProvider = 'INVOICE', items }) {
  return createValidOrderFormData({
    sku: '',
    tuote_avain: '',
    cart_items_json: JSON.stringify(items ?? [{ sku, quantity: 1 }]),
    toimitus: shippingId,
    payment_provider: paymentProvider,
    ...ADDRESS,
  });
}

// The first product and cart shipping option that make a valid one-line cart
// today. Chosen by trying, so the tests do not depend on fixed SKUs, shipping
// ids or which products are on sale.
let cachedCartScenario;
function getCartScenario() {
  if (cachedCartScenario) return cachedCartScenario;

  for (const scenario of listOrderScenarios()) {
    for (const shippingOption of getCartShippingOptions()) {
      try {
        normalizePublicOrderSubmission(
          buildCartForm({ sku: scenario.variant.sku, shippingId: shippingOption.id })
        );
        cachedCartScenario = { ...scenario, cartShippingId: shippingOption.id };
        return cachedCartScenario;
      } catch {
        // Try the next combination.
      }
    }
  }

  assert.fail('at least one product must be orderable through the cart');
}

function cartFormData({ paymentProvider = 'INVOICE', items, scenario } = {}) {
  const selected = scenario ?? getCartScenario();
  return buildCartForm({
    sku: selected.variant.sku,
    shippingId: selected.cartShippingId,
    paymentProvider,
    items,
  });
}

function submit(formData) {
  return POST(createRouteRequest({ method: 'POST', url: SUBMIT_URL, formData }));
}

function failIfCalled() {
  throw new Error('The order must not be forwarded.');
}

async function submitWithUpstream(upstream, { nodeEnv = 'test', formData } = {}) {
  return withTemporaryEnv({ ...ORDER_SERVICE_ENV, NODE_ENV: nodeEnv }, () =>
    withMockFetch(upstream, async (calls) => {
      const response = await withMutedConsole(() => submit(formData ?? cartFormData()));
      return { response, body: await response.json(), calls };
    })
  );
}

function stripeResponse(overrides = {}) {
  return () =>
    Response.json({
      ok: true,
      orderId: 'LRM-1',
      paymentProvider: 'STRIPE',
      paymentStatus: 'UNPAID',
      checkoutStatus: 'OPEN',
      checkoutSessionId: 'cs_test_abc',
      checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_test_abc',
      ...overrides,
    });
}

describe('order submit route: payment provider checks', () => {
  test('an invoice order answered as a Stripe order is rejected with 502', async () => {
    const { response, body } = await submitWithUpstream(stripeResponse(), {
      formData: cartFormData({ paymentProvider: 'INVOICE' }),
    });

    assert.equal(response.status, 502);
    assert.equal(body.code, 'upstream_unavailable');
    assert.equal(JSON.stringify(body).includes('checkout.stripe.com'), false);
  });

  test('the payment provider in the answer is compared case-insensitively', async () => {
    const { response, body } = await submitWithUpstream(
      () => Response.json({ ok: true, orderId: 'LRM-1', paymentProvider: 'invoice' }),
      { formData: cartFormData({ paymentProvider: 'INVOICE' }) }
    );

    assert.equal(response.status, 200);
    assert.equal(body.paymentProvider, 'INVOICE');
  });

  test('an unknown payment provider is rejected before forwarding', async () => {
    const { response, body, calls } = await submitWithUpstream(failIfCalled, {
      formData: cartFormData({ paymentProvider: 'PAYPAL' }),
    });

    assert.equal(response.status, 400);
    assert.equal(body.code, 'payment_provider_invalid');
    assert.equal(calls.length, 0);
  });
});

describe('order submit route: Stripe environment', () => {
  const stripeForm = () => cartFormData({ paymentProvider: 'STRIPE' });

  test('production accepts a live Checkout session and asks the backend for live mode', async () => {
    const { response, body, calls } = await submitWithUpstream(
      stripeResponse({
        checkoutSessionId: 'cs_live_abc',
        checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_live_abc',
      }),
      { nodeEnv: 'production', formData: stripeForm() }
    );

    assert.equal(response.status, 200);
    assert.equal(body.checkoutSessionId, 'cs_live_abc');
    assert.equal(calls[0].init.headers['X-Lieromaa-Stripe-Mode'], 'live');
  });

  test('production rejects a test-mode Checkout session', async () => {
    const { response } = await submitWithUpstream(stripeResponse(), {
      nodeEnv: 'production',
      formData: stripeForm(),
    });

    assert.equal(response.status, 502);
  });

  test('a Checkout address over http or on another host is rejected', async () => {
    for (const checkoutUrl of [
      'http://checkout.stripe.com/c/pay/cs_test_abc',
      'https://checkout.stripe.com.evil.example/c/pay/cs_test_abc',
      'not a url',
    ]) {
      const { response } = await submitWithUpstream(stripeResponse({ checkoutUrl }), {
        formData: stripeForm(),
      });

      assert.equal(response.status, 502, checkoutUrl);
    }
  });

  test('a COMPLETE session without a Checkout address is accepted (already paid)', async () => {
    const { response, body } = await submitWithUpstream(
      stripeResponse({
        checkoutUrl: '',
        checkoutStatus: 'COMPLETE',
        paymentStatus: 'PAID',
      }),
      { formData: stripeForm() }
    );

    assert.equal(response.status, 200);
    assert.equal(body.checkoutUrl, '');
    assert.equal(body.checkoutStatus, 'COMPLETE');
  });

  test('an OPEN session without a Checkout address is rejected', async () => {
    const { response } = await submitWithUpstream(stripeResponse({ checkoutUrl: '' }), {
      formData: stripeForm(),
    });

    assert.equal(response.status, 502);
  });
});

describe('order submit route: malformed requests', () => {
  test('a body that cannot be read as form data answers 400 without forwarding', async () => {
    await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
      withMockFetch(failIfCalled, async (calls) => {
        const request = createRouteRequest({ method: 'POST', url: SUBMIT_URL });
        request.formData = async () => {
          throw new TypeError('Could not parse content as FormData.');
        };
        const response = await POST(request);

        assert.equal(response.status, 400);
        assert.equal((await response.json()).code, 'invalid_request');
        assert.equal(calls.length, 0);
      })
    );
  });

  test('a cart that is not a JSON array answers 400', async () => {
    for (const cartJson of ['{', '{"sku":"x"}', '"text"']) {
      const formData = cartFormData();
      formData.set('cart_items_json', cartJson);
      const { response, body, calls } = await submitWithUpstream(failIfCalled, {
        formData,
      });

      assert.equal(response.status, 400, cartJson);
      assert.equal(body.code, 'cart_invalid', cartJson);
      assert.equal(calls.length, 0);
    }
  });

  test('a cart with only empty lines answers 400', async () => {
    const { response, calls } = await submitWithUpstream(failIfCalled, {
      formData: cartFormData({
        items: [
          { sku: '', quantity: 1 },
          { sku: 'x', quantity: 0 },
        ],
      }),
    });

    assert.equal(response.status, 400);
    assert.equal(calls.length, 0);
  });
});

describe('order submit route: products that cannot be sold', () => {
  test('an unknown SKU in the cart answers unknown_product without forwarding', async () => {
    const { response, body, calls } = await submitWithUpstream(failIfCalled, {
      formData: cartFormData({ items: [{ sku: 'no-such-sku-123', quantity: 1 }] }),
    });

    assert.equal(response.status, 400);
    assert.equal(body.code, 'unknown_product');
    assert.equal(calls.length, 0);
  });

  test('a SKU marked unavailable answers product_unavailable without forwarding', async () => {
    const scenario = getCartScenario();

    await withTemporaryProductAvailabilityAsync(
      scenario.productKey,
      { unavailableSkus: [scenario.variant.sku] },
      async () => {
        const { response, body, calls } = await submitWithUpstream(failIfCalled, {
          formData: cartFormData({ scenario }),
        });

        assert.equal(response.status, 400);
        assert.equal(body.code, 'product_unavailable');
        assert.equal(calls.length, 0);
      }
    );
  });

  test('the legacy single-product form also rejects an unavailable SKU', async () => {
    const scenario = getCartScenario();

    await withTemporaryProductAvailabilityAsync(
      scenario.productKey,
      { unavailableSkus: [scenario.variant.sku] },
      async () => {
        const { response, body, calls } = await submitWithUpstream(failIfCalled, {
          formData: createValidOrderFormData({
            sku: scenario.variant.sku,
            tuote_avain: scenario.productKey,
            toimitus: scenario.shippingOption.id,
            osoite: 'Kompostikuja 1',
            postinumero: '00100',
            toimipaikka: 'Helsinki',
          }),
        });

        assert.equal(response.status, 400);
        assert.equal(body.code, 'product_unavailable');
        assert.equal(calls.length, 0);
      }
    );
  });
});
