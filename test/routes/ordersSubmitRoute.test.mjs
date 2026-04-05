import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { POST } from '@/app/api/orders/submit/route.js';

import { expectDeepEqual, expectEqual } from '../helpers/assertions.mjs';
import { withMutedConsole } from '../helpers/console.mjs';
import { createValidOrderFormData } from '../helpers/orderForm.mjs';
import { createRouteRequest } from '../helpers/routeRequest.mjs';

function withEnv(env, fn) {
  const previousValues = new Map();

  for (const [key, value] of Object.entries(env)) {
    previousValues.set(key, process.env[key]);
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  return Promise.resolve()
    .then(fn)
    .finally(() => {
      for (const [key, value] of previousValues.entries()) {
        if (value === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      }
    });
}

describe('frontend public order submit route', () => {
  test('the public order submit route should reject cross-origin requests before reading the payload', async () => {
    const response = await POST(
      createRouteRequest({
        url: 'https://www.lieromaa.fi/api/orders/submit',
        origin: 'https://evil.example',
        host: 'www.lieromaa.fi',
        formData: createValidOrderFormData(),
      })
    );

    expectEqual(
      response.status,
      403,
      'the public order submit route should return HTTP 403 for cross-origin requests'
    );
  });

  test('the public order submit route should treat honeypot spam as a successful ignored submission', async () => {
    const response = await POST(
      createRouteRequest({
        url: 'https://www.lieromaa.fi/api/orders/submit',
        formData: createValidOrderFormData({
          _gotcha: 'spam',
        }),
      })
    );

    expectEqual(response.status, 200, 'the public order submit route should respond with HTTP 200 for ignored honeypot spam');
    expectDeepEqual(
      await response.json(),
      {
        ok: true,
        ignored: true,
      },
      'the public order submit route should mark honeypot spam submissions as ignored'
    );
  });

  test('the public order submit route should forward the normalized order with auth and idempotency headers', async () => {
    await withEnv(
      {
        ORDER_SERVICE_URL: 'https://orders-ingest.lieromaa.fi',
        ORDER_SERVICE_TOKEN: 'shared-secret',
        ORDER_SERVICE_TIMEOUT_MS: '2500',
      },
      async () => {
        const recordedCalls = [];
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (url, init = {}) => {
          recordedCalls.push([url, init]);

          return Response.json({
            ok: true,
            orderId: 'LRM-123',
            duplicate: false,
          });
        };

        try {
          const response = await POST(
            createRouteRequest({
              url: 'https://www.lieromaa.fi/api/orders/submit',
              formData: createValidOrderFormData({
                toimitus: 'postitus',
                osoite: 'Kompostikuja 1',
                postinumero: '00100',
                toimipaikka: 'Helsinki',
              }),
            })
          );

          expectEqual(response.status, 200, 'the public order submit route should return HTTP 200 when the upstream order creation succeeds');
          const body = await response.json();
          expectEqual(body.ok, true, 'the public order submit route should return ok=true when the upstream order creation succeeds');
          expectEqual(body.orderId, 'LRM-123', 'the public order submit route should return the upstream order id');
          expectEqual(recordedCalls.length, 1, 'the public order submit route should create exactly one upstream order request');
          expectEqual(
            recordedCalls[0][0],
            'https://orders-ingest.lieromaa.fi/api/public/orders',
            'the public order submit route should forward to the public order endpoint on the server'
          );
          expectEqual(
            recordedCalls[0][1].headers['X-Order-Token'],
            'shared-secret',
            'the public order submit route should attach the shared order token to the upstream request'
          );
          expectEqual(
            recordedCalls[0][1].headers['X-Idempotency-Key'],
            'submission-123',
            'the public order submit route should reuse the submission id as the upstream idempotency key'
          );

          const forwardedPayload = JSON.parse(recordedCalls[0][1].body);
          expectEqual(forwardedPayload.product.sku, 'worms-100', 'the public order submit route should forward the validated worm SKU');
          expectEqual(
            forwardedPayload.fulfillment.method,
            'postitus',
            'the public order submit route should forward the selected fulfillment method'
          );
          expectEqual(
            forwardedPayload.requestContext.origin,
            'https://www.lieromaa.fi',
            'the public order submit route should include the originating website in the forwarded request context'
          );
        } finally {
          globalThis.fetch = originalFetch;
        }
      }
    );
  });

  test('the public order submit route should preserve the upstream failure payload when order creation is rejected', async () => {
    await withEnv(
      {
        ORDER_SERVICE_URL: 'https://orders-ingest.lieromaa.fi',
        ORDER_SERVICE_TOKEN: 'shared-secret',
      },
      () =>
        withMutedConsole(async () => {
          const originalFetch = globalThis.fetch;
          globalThis.fetch = async () =>
            Response.json(
              {
                ok: false,
                message: 'Palvelin hylkäsi tilauksen.',
              },
              { status: 409 }
            );

          try {
            const response = await POST(
              createRouteRequest({
                url: 'https://www.lieromaa.fi/api/orders/submit',
                formData: createValidOrderFormData(),
              })
            );

            expectEqual(response.status, 409, 'the public order submit route should preserve the upstream rejection status code');
            expectDeepEqual(
              await response.json(),
              {
                ok: false,
                message: 'Palvelin hylkäsi tilauksen.',
              },
              'the public order submit route should return the upstream rejection message to the user'
            );
          } finally {
            globalThis.fetch = originalFetch;
          }
        })
    );
  });
});
