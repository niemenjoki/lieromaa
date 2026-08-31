import assert from 'node:assert/strict';
import { test } from 'node:test';

import { GET } from '@/app/api/orders/payment-status/route.js';

import { createRouteRequest } from '../helpers/routeRequest.mjs';

async function withEnv(env, fn) {
  const previous = Object.fromEntries(
    Object.keys(env).map((key) => [key, process.env[key]])
  );
  Object.assign(process.env, env);
  try {
    return await fn();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('payment status proxy is same-origin, no-store and returns no customer data', async () => {
  await withEnv(
    {
      NODE_ENV: 'development',
      ORDER_SERVICE_URL: 'https://orders-ingest.lieromaa.fi',
      ORDER_SERVICE_TOKEN: 'shared-token',
    },
    async () => {
      const originalFetch = globalThis.fetch;
      let upstreamCall;
      globalThis.fetch = async (url, init) => {
        upstreamCall = { url: String(url), init };
        return Response.json({
          ok: true,
          orderId: 'LRM-1',
          paymentStatus: 'PAID',
          checkoutStatus: 'COMPLETE',
          outcomeCode: 'paid',
          customer: { email: 'must-not-leak@example.test' },
        });
      };
      try {
        const response = await GET(
          createRouteRequest({
            url: 'https://www.lieromaa.fi/api/orders/payment-status?session_id=cs_test_123',
            origin: 'https://www.lieromaa.fi',
            host: 'www.lieromaa.fi',
            method: 'GET',
          })
        );
        assert.equal(response.status, 200);
        assert.equal(response.headers.get('cache-control'), 'no-store');
        assert.deepEqual(await response.json(), {
          ok: true,
          orderId: 'LRM-1',
          paymentStatus: 'PAID',
          checkoutStatus: 'COMPLETE',
          outcomeCode: 'paid',
        });
        assert.match(upstreamCall.url, /sessionId=cs_test_123/);
        assert.equal(upstreamCall.init.headers['X-Order-Token'], 'shared-token');
      } finally {
        globalThis.fetch = originalFetch;
      }
    }
  );
});

test('payment status proxy rejects invalid and cross-origin session requests', async () => {
  const invalid = await GET(
    createRouteRequest({
      url: 'https://www.lieromaa.fi/api/orders/payment-status?session_id=invalid',
      method: 'GET',
    })
  );
  assert.equal(invalid.status, 400);

  const crossOrigin = await GET(
    createRouteRequest({
      url: 'https://www.lieromaa.fi/api/orders/payment-status?session_id=cs_test_123',
      origin: 'https://evil.example',
      host: 'www.lieromaa.fi',
      method: 'GET',
    })
  );
  assert.equal(crossOrigin.status, 403);
});

test('payment status proxy refuses a session from the opposite Stripe environment', async () => {
  await withEnv({ NODE_ENV: 'production' }, async () => {
    const response = await GET(
      createRouteRequest({
        url: 'https://www.lieromaa.fi/api/orders/payment-status?session_id=cs_test_123',
        method: 'GET',
      })
    );
    assert.equal(response.status, 400);
  });
});
