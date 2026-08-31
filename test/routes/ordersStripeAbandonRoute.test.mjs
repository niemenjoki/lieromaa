import assert from 'node:assert/strict';
import { test } from 'node:test';

import { POST } from '@/app/api/orders/stripe-abandon/route.js';

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

test('Stripe abandonment proxy forwards a same-origin sandbox session', async () => {
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
        return Response.json({ ok: true, discarded: true });
      };
      try {
        const response = await POST(
          createRouteRequest({
            url: 'https://www.lieromaa.fi/api/orders/stripe-abandon',
            origin: 'https://www.lieromaa.fi',
            host: 'www.lieromaa.fi',
            method: 'POST',
            json: { sessionId: 'cs_test_abandon123' },
          })
        );

        assert.equal(response.status, 200);
        assert.deepEqual(await response.json(), { ok: true, discarded: true });
        assert.equal(
          upstreamCall.url,
          'https://orders-ingest.lieromaa.fi/api/public/orders/stripe-abandon'
        );
        assert.equal(upstreamCall.init.headers['X-Order-Token'], 'shared-token');
        assert.equal(upstreamCall.init.headers['X-Lieromaa-Stripe-Mode'], 'test');
        assert.deepEqual(JSON.parse(upstreamCall.init.body), {
          sessionId: 'cs_test_abandon123',
        });
      } finally {
        globalThis.fetch = originalFetch;
      }
    }
  );
});

test('Stripe abandonment proxy rejects cross-origin and wrong-environment sessions', async () => {
  const crossOrigin = await POST(
    createRouteRequest({
      url: 'https://www.lieromaa.fi/api/orders/stripe-abandon',
      origin: 'https://evil.example',
      host: 'www.lieromaa.fi',
      method: 'POST',
      json: { sessionId: 'cs_test_abandon123' },
    })
  );
  assert.equal(crossOrigin.status, 403);

  await withEnv({ NODE_ENV: 'production' }, async () => {
    const wrongMode = await POST(
      createRouteRequest({
        url: 'https://www.lieromaa.fi/api/orders/stripe-abandon',
        method: 'POST',
        json: { sessionId: 'cs_test_abandon123' },
      })
    );
    assert.equal(wrongMode.status, 400);
  });
});
