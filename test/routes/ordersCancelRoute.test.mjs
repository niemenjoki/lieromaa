import { describe, test } from 'node:test';

import { POST } from '@/app/api/orders/cancel/route.js';

import { expectDeepEqual, expectEqual } from '../helpers/assertions.mjs';
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

describe('frontend cancellation request proxy route', () => {
  test('the cancellation request route should reject cross-origin requests', async () => {
    const response = await POST(
      createRouteRequest({
        url: 'https://www.lieromaa.fi/api/orders/cancel',
        origin: 'https://evil.example',
        host: 'www.lieromaa.fi',
        json: {
          customerName: 'Testi Asiakas',
          customerEmail: 'testi@example.com',
          cancellationScope: 'full',
          orderDetails: 'Tilasin kuituseoksen.',
        },
      })
    );

    expectEqual(
      response.status,
      403,
      'the cancellation request route should return HTTP 403 for cross-origin requests'
    );
  });

  test('the cancellation request route should forward the payload to the order server', async () => {
    await withEnv(
      {
        ORDER_SERVICE_URL: 'https://orders-ingest.lieromaa.fi',
        ORDER_SERVICE_TOKEN: 'shared-secret',
      },
      async () => {
        const recordedCalls = [];
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (url, init = {}) => {
          recordedCalls.push([url, init]);

          return Response.json({
            ok: true,
            cancellationRequestId: 12,
          });
        };

        try {
          const response = await POST(
            createRouteRequest({
              url: 'https://www.lieromaa.fi/api/orders/cancel',
              json: {
                customerName: 'Testi Asiakas',
                customerEmail: 'testi@example.com',
                orderReference: 'LRM-260410120000AB',
                preferredContactMethod: 'text_message',
                cancellationScope: 'partial',
                orderDetails: 'Haluan peruuttaa kuituseoksen.',
              },
            })
          );

          expectEqual(response.status, 200, 'the route should return HTTP 200');
          expectDeepEqual(
            await response.json(),
            {
              ok: true,
              cancellationRequestId: 12,
            },
            'the route should return the upstream cancellation request id'
          );
          expectEqual(
            recordedCalls[0][0],
            'https://orders-ingest.lieromaa.fi/api/public/order-cancellations',
            'the route should forward to the public cancellation endpoint on the order server'
          );
          expectEqual(
            recordedCalls[0][1].headers['X-Order-Token'],
            'shared-secret',
            'the route should attach the shared order token'
          );

          const forwardedPayload = JSON.parse(recordedCalls[0][1].body);
          expectEqual(forwardedPayload.cancellationScope, 'partial');
          expectEqual(forwardedPayload.preferredContactMethod, 'text_message');
          expectEqual(forwardedPayload.requestContext.origin, 'https://www.lieromaa.fi');
        } finally {
          globalThis.fetch = originalFetch;
        }
      }
    );
  });
});
