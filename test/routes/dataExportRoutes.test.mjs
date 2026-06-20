import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { POST as downloadDataExport } from '@/app/api/data-exports/download/route.js';
import { POST as requestDataExport } from '@/app/api/data-exports/request/route.js';

import { expectDeepEqual, expectEqual } from '../helpers/assertions.mjs';
import { createRouteRequest } from '../helpers/routeRequest.mjs';

function withEnv(env, fn) {
  const previousValues = new Map();

  for (const [key, value] of Object.entries(env)) {
    previousValues.set(key, process.env[key]);
    process.env[key] = value;
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

describe('frontend data export proxy routes', () => {
  test('the request route rejects cross-origin submissions', async () => {
    const response = await requestDataExport(
      createRouteRequest({
        url: 'https://www.lieromaa.fi/api/data-exports/request',
        origin: 'https://example.com',
        json: { orderId: 'LRM-123', email: 'testi@example.com' },
      })
    );

    expectEqual(response.status, 403, 'cross-origin requests should be rejected');
  });

  test('the request route forwards the lookup and returns only a generic result', async () => {
    await withEnv(
      {
        ORDER_SERVICE_URL: 'https://orders-ingest.lieromaa.fi/',
        ORDER_SERVICE_TOKEN: 'shared-token',
      },
      async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (url, init = {}) => {
          expectEqual(
            url,
            'https://orders-ingest.lieromaa.fi/api/public/data-exports/request',
            'the request should use the public data-export endpoint'
          );
          expectEqual(
            init.headers['X-Order-Token'],
            'shared-token',
            'the request should authenticate to the order service'
          );
          expectDeepEqual(
            JSON.parse(init.body),
            {
              orderId: 'LRM-123',
              email: 'testi@example.com',
              _gotcha: '',
              requestContext: { forwardedFor: '' },
            },
            'the request should forward only the expected fields'
          );
          return Response.json({ ok: true }, { status: 202 });
        };

        try {
          const response = await requestDataExport(
            createRouteRequest({
              url: 'https://www.lieromaa.fi/api/data-exports/request',
              json: {
                orderId: 'LRM-123',
                email: 'testi@example.com',
                _gotcha: '',
              },
            })
          );

          expectEqual(response.status, 202, 'accepted requests should return HTTP 202');
          expectDeepEqual(
            await response.json(),
            { ok: true },
            'the response should not reveal whether an order matched'
          );
        } finally {
          globalThis.fetch = originalFetch;
        }
      }
    );
  });

  test('the download route returns a private JSON attachment', async () => {
    await withEnv(
      {
        ORDER_SERVICE_URL: 'https://orders-ingest.lieromaa.fi',
        ORDER_SERVICE_TOKEN: 'shared-token',
      },
      async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (_url, init = {}) => {
          assert.deepEqual(JSON.parse(init.body), { token: 'one-time-token' });
          return Response.json({
            ok: true,
            filename: 'lieromaa-LRM-123-tiedot.json',
            data: { order: { id: 'LRM-123' } },
          });
        };

        try {
          const response = await downloadDataExport(
            createRouteRequest({
              url: 'https://www.lieromaa.fi/api/data-exports/download',
              json: { token: 'one-time-token' },
            })
          );

          expectEqual(response.status, 200, 'valid tokens should download successfully');
          expectEqual(
            response.headers.get('cache-control'),
            'private, no-store, max-age=0',
            'downloads should never be cached'
          );
          expectEqual(
            response.headers.get('content-disposition'),
            'attachment; filename="lieromaa-LRM-123-tiedot.json"',
            'downloads should use the filename supplied by the order service'
          );
          expectDeepEqual(
            JSON.parse(await response.text()),
            { order: { id: 'LRM-123' } },
            'the attachment should contain the exported order data'
          );
        } finally {
          globalThis.fetch = originalFetch;
        }
      }
    );
  });
});
