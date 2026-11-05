import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { POST as requestDataExportDownload } from '@/app/api/data-exports/download/route.js';
import { POST as requestDataExport } from '@/app/api/data-exports/request/route.js';
import { POST as submitGuideFeedback } from '@/app/api/guide-feedback/submit/route.js';
import { POST as createInvoiceCheckout } from '@/app/api/invoice-payment/checkout/route.js';
import { GET as getInvoiceSession } from '@/app/api/invoice-payment/session/route.js';
import { POST as cancelOrder } from '@/app/api/orders/cancel/route.js';
import { GET as getPaymentStatus } from '@/app/api/orders/payment-status/route.js';
import { POST as abandonStripeCheckout } from '@/app/api/orders/stripe-abandon/route.js';
import { POST as submitOrder } from '@/app/api/orders/submit/route.js';
import { POST as bookPickup } from '@/app/api/pickup/book/route.js';
import { GET as getPickupSession } from '@/app/api/pickup/session/route.js';
import { GET as getReviewSession } from '@/app/api/reviews/session/route.js';
import { POST as submitReview } from '@/app/api/reviews/submit/route.js';

import { withMutedConsole } from '../helpers/console.mjs';
import { createValidOrderFormDataForScenario } from '../helpers/orderForm.mjs';
import { listOrderScenarios } from '../helpers/orderScenarios.mjs';
import { createRouteRequest } from '../helpers/routeRequest.mjs';
import {
  ORDER_SERVICE_ENV,
  TEST_ORDER_SERVICE_TOKEN,
  getHeader,
  nonJsonResponse,
  timeoutError,
  withMockFetch,
  withTemporaryEnv,
} from '../helpers/routeTestKit.mjs';

const SITE = 'https://www.lieromaa.fi';
// Runtime mode is 'test' unless NODE_ENV is production; the tests pin it.
const TEST_MODE_ENV = { ...ORDER_SERVICE_ENV, NODE_ENV: 'test' };

function post(path, json) {
  return createRouteRequest({ method: 'POST', url: `${SITE}${path}`, json });
}

function get(pathWithQuery) {
  return createRouteRequest({ url: `${SITE}${pathWithQuery}` });
}

function orderFormData() {
  const scenario = listOrderScenarios()[0];
  assert.ok(scenario, 'at least one product must be orderable for the submit route test');
  return createValidOrderFormDataForScenario(scenario);
}

// usesOrderToken: false means the upstream endpoint is public by design (the
// review link token authorises the request), so the route sends no token.
const ROUTES = [
  {
    name: 'orders/submit',
    call: () =>
      submitOrder(
        createRouteRequest({
          method: 'POST',
          url: `${SITE}/api/orders/submit`,
          formData: orderFormData(),
        })
      ),
    usesOrderToken: true,
  },
  {
    name: 'orders/cancel',
    call: () =>
      cancelOrder(
        post('/api/orders/cancel', { orderId: 'LRM-1', email: 'testi@example.com' })
      ),
    usesOrderToken: true,
  },
  {
    name: 'orders/payment-status',
    call: () =>
      getPaymentStatus(get('/api/orders/payment-status?session_id=cs_test_abc')),
    usesOrderToken: true,
  },
  {
    name: 'orders/stripe-abandon',
    call: () =>
      abandonStripeCheckout(
        post('/api/orders/stripe-abandon', { sessionId: 'cs_test_a' })
      ),
    usesOrderToken: true,
  },
  {
    name: 'reviews/session',
    call: () => getReviewSession(get('/api/reviews/session?token=r1.abc')),
    usesOrderToken: false,
  },
  {
    name: 'reviews/submit',
    call: () => submitReview(post('/api/reviews/submit', { token: 'r1.abc', rating: 5 })),
    usesOrderToken: false,
  },
  {
    name: 'pickup/session',
    call: () => getPickupSession(get('/api/pickup/session?token=p1.1.abc')),
    usesOrderToken: true,
  },
  {
    name: 'pickup/book',
    call: () => bookPickup(post('/api/pickup/book', { token: 'p1.1.abc', optionId: 3 })),
    usesOrderToken: true,
  },
  {
    name: 'data-exports/request',
    call: () =>
      requestDataExport(
        post('/api/data-exports/request', {
          orderId: 'LRM-1',
          email: 'testi@example.com',
        })
      ),
    usesOrderToken: true,
    // Always answers 502 on any upstream failure, so the browser cannot tell
    // whether the order exists.
    hidesUpstreamStatus: true,
  },
  {
    name: 'data-exports/download',
    call: () =>
      requestDataExportDownload(post('/api/data-exports/download', { token: 'd1.abc' })),
    usesOrderToken: true,
  },
  {
    name: 'invoice-payment/session',
    call: () => getInvoiceSession(get('/api/invoice-payment/session?code=ABCD1234')),
    usesOrderToken: true,
  },
  {
    name: 'invoice-payment/checkout',
    call: () =>
      createInvoiceCheckout(post('/api/invoice-payment/checkout', { code: 'ABCD1234' })),
    usesOrderToken: true,
  },
  {
    name: 'guide-feedback/submit',
    call: () =>
      submitGuideFeedback(
        post('/api/guide-feedback/submit', { guideSlug: 'opas', message: 'Hyvä opas' })
      ),
    usesOrderToken: true,
    // Answers with { ok, message } and no error code.
    hasNoErrorCode: true,
  },
];

async function callWithUpstream(route, upstream, env = TEST_MODE_ENV) {
  return withTemporaryEnv(env, () =>
    withMockFetch(upstream, async (calls) => {
      const response = await withMutedConsole(() => route.call());
      const text = await response.text();
      return { response, text, body: JSON.parse(text), calls };
    })
  );
}

const UNAUTHORIZED_UPSTREAM = () =>
  Response.json(
    { ok: false, code: 'unauthorized', message: 'Unauthorized order API token.' },
    { status: 401 }
  );

const FORBIDDEN_UPSTREAM = () =>
  Response.json(
    { ok: false, code: 'unauthorized', message: 'Unauthorized order API token.' },
    { status: 403 }
  );

const INTERNAL_UPSTREAM_MESSAGE = 'SQLITE_BUSY: database is locked (orders.db)';
const INTERNAL_ERROR_UPSTREAM = () =>
  Response.json(
    { ok: false, code: 'internal_error', message: INTERNAL_UPSTREAM_MESSAGE },
    { status: 500 }
  );

for (const route of ROUTES) {
  describe(`${route.name}: upstream failures`, () => {
    test('a timeout answers 502 with a generic error', async () => {
      const { response, body, calls } = await callWithUpstream(route, () => {
        throw timeoutError();
      });

      assert.equal(calls.length, 1, 'the route should try the order service once');
      assert.equal(response.status, 502);
      assert.equal(body.ok, false);
      if (!route.hasNoErrorCode) {
        assert.equal(body.code, 'upstream_unavailable');
      }
    });

    test('a non-JSON 5xx answer does not reach the browser', async () => {
      const { response, text, body } = await callWithUpstream(route, () =>
        nonJsonResponse(503)
      );

      assert.equal(response.status, route.hidesUpstreamStatus ? 502 : 503);
      assert.equal(body.ok, false);
      assert.equal(text.includes('upstream proxy error page'), false);
      assert.equal(text.includes(TEST_ORDER_SERVICE_TOKEN), false);
    });

    if (route.usesOrderToken) {
      test('a missing ORDER_SERVICE_TOKEN stops the request before fetch', async () => {
        const { response, body, calls } = await callWithUpstream(
          route,
          () => {
            throw new Error('The order service must not be called without a token.');
          },
          { ...TEST_MODE_ENV, ORDER_SERVICE_TOKEN: undefined }
        );

        assert.equal(calls.length, 0);
        assert.ok([500, 502].includes(response.status), `status ${response.status}`);
        assert.equal(body.ok, false);
      });

      test('the order service token is sent upstream', async () => {
        const { calls } = await callWithUpstream(route, () => nonJsonResponse(503));

        assert.equal(getHeader(calls[0].init, 'X-Order-Token'), TEST_ORDER_SERVICE_TOKEN);
      });
    } else {
      test('the public review endpoint is called without the order service token', async () => {
        const { calls } = await callWithUpstream(route, () => nonJsonResponse(503), {
          ...TEST_MODE_ENV,
          ORDER_SERVICE_TOKEN: undefined,
        });

        assert.equal(calls.length, 1);
        assert.equal(getHeader(calls[0].init, 'X-Order-Token'), undefined);
      });
    }
  });
}

describe('upstream failures: what the browser sees', () => {
  test('data-exports/request hides an upstream 401 behind 502', async () => {
    const route = ROUTES.find(({ name }) => name === 'data-exports/request');
    const { response, text } = await callWithUpstream(route, UNAUTHORIZED_UPSTREAM);

    assert.equal(response.status, 502);
    assert.equal(text.includes('Unauthorized order API token'), false);
  });

  test('an upstream 401 or 403 (wrong ORDER_SERVICE_TOKEN) reaches the browser as 502 with a generic error', async () => {
    for (const upstream of [UNAUTHORIZED_UPSTREAM, FORBIDDEN_UPSTREAM]) {
      for (const route of ROUTES) {
        const { response, text, body } = await callWithUpstream(route, upstream);

        assert.equal(response.status, 502, route.name);
        assert.equal(body.ok, false, route.name);
        assert.equal(text.includes('Unauthorized order API token'), false, route.name);
        assert.equal(text.includes('unauthorized'), false, route.name);
        if (!route.hasNoErrorCode) {
          assert.equal(body.code, 'upstream_unavailable', route.name);
        }
      }
    }
  });

  test('an upstream 401 is logged on the server without the token', async () => {
    const route = ROUTES.find(({ name }) => name === 'orders/cancel');
    const logged = [];
    const originalError = console.error;
    console.error = (...args) => logged.push(args.map(String).join(' '));
    try {
      await withTemporaryEnv(TEST_MODE_ENV, () =>
        withMockFetch(UNAUTHORIZED_UPSTREAM, () => route.call())
      );
    } finally {
      console.error = originalError;
    }

    assert.equal(logged.length, 1);
    assert.match(logged[0], /401/);
    assert.equal(logged[0].includes(TEST_ORDER_SERVICE_TOKEN), false);
  });

  test('an internal upstream 5xx message is not shown to the browser', async () => {
    for (const route of ROUTES) {
      const { response, text, body } = await callWithUpstream(
        route,
        INTERNAL_ERROR_UPSTREAM
      );

      assert.equal(text.includes(INTERNAL_UPSTREAM_MESSAGE), false, route.name);
      assert.equal(response.status, route.hidesUpstreamStatus ? 502 : 500, route.name);
      assert.equal(body.ok, false, route.name);
      if (!route.hasNoErrorCode) {
        assert.equal(body.code, 'upstream_unavailable', route.name);
      }
    }
  });

  test('a 5xx answer uses the localized generic message', async () => {
    const route = ROUTES.find(({ name }) => name === 'orders/cancel');
    const finnish = await callWithUpstream(route, INTERNAL_ERROR_UPSTREAM);
    const english = await withTemporaryEnv(TEST_MODE_ENV, () =>
      withMockFetch(INTERNAL_ERROR_UPSTREAM, async () => {
        const response = await withMutedConsole(() =>
          cancelOrder(
            createRouteRequest({
              method: 'POST',
              url: `${SITE}/api/orders/cancel`,
              json: { orderId: 'LRM-1', email: 'testi@example.com' },
              extraHeaders: { 'X-Lieromaa-Language': 'en' },
            })
          )
        );
        return response.json();
      })
    );

    assert.equal(typeof finnish.body.message, 'string');
    assert.equal(typeof english.message, 'string');
    assert.notEqual(finnish.body.message, english.message);
  });

  test('a 4xx validation message from the order service still reaches the browser', async () => {
    for (const route of ROUTES.filter(
      ({ hidesUpstreamStatus }) => !hidesUpstreamStatus
    )) {
      const { response, body } = await callWithUpstream(route, () =>
        Response.json(
          { ok: false, code: 'validation_failed', message: 'Tarkista tiedot.' },
          { status: 422 }
        )
      );

      assert.equal(response.status, 422, route.name);
      assert.equal(body.message, 'Tarkista tiedot.', route.name);
    }
  });

  test('data-exports/download reports an upstream outage as upstream_unavailable', async () => {
    const route = ROUTES.find(({ name }) => name === 'data-exports/download');
    for (const upstream of [() => nonJsonResponse(503), INTERNAL_ERROR_UPSTREAM]) {
      const { body } = await callWithUpstream(route, upstream);

      assert.equal(body.code, 'upstream_unavailable');
    }
  });
});
