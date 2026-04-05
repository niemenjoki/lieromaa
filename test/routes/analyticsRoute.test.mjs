import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { POST } from '@/app/api/analytics/route.js';

import { expectEqual } from '../helpers/assertions.mjs';
import { withMutedConsole } from '../helpers/console.mjs';
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

describe('frontend analytics proxy route', () => {
  test('the analytics route should reject requests that come from the wrong origin', async () => {
    const response = await POST(
      createRouteRequest({
        url: 'https://www.lieromaa.fi/api/analytics',
        origin: 'https://evil.example',
        json: {
          pageViewId: 'view-1',
        },
      })
    );

    expectEqual(response.status, 403, 'the analytics route should return HTTP 403 for cross-origin requests');
  });

  test('the analytics route should return 400 when the request body is not valid JSON', async () => {
    const response = await POST(
      createRouteRequest({
        url: 'https://www.lieromaa.fi/api/analytics',
        json: new Error('Broken JSON'),
      })
    );

    expectEqual(response.status, 400, 'the analytics route should return HTTP 400 for malformed JSON payloads');
  });

  test('the analytics route should forward the payload to the order server when configuration is present', async () => {
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
          return new Response(null, {
            status: 204,
          });
        };

        try {
          const response = await POST(
            createRouteRequest({
              url: 'https://www.lieromaa.fi/api/analytics',
              json: {
                pageViewId: 'pageview-1',
                visitorId: 'visitor-1',
                sessionId: 'session-1',
                sessionPageIndex: 1,
                path: '/tuotteet/madot',
                previousPath: '',
                referrerHost: '',
                startedAt: '2026-04-05T10:00:00.000Z',
                endedAt: '2026-04-05T10:00:05.000Z',
                dwellMs: 5000,
                maxScrollPercent: 80,
                formStartCount: 1,
                formSubmitCount: 0,
                orderClickCount: 1,
              },
            })
          );

          expectEqual(response.status, 204, 'the analytics route should preserve the upstream 204 response status');
          expectEqual(recordedCalls.length, 1, 'the analytics route should forward exactly one analytics request upstream');
          expectEqual(
            recordedCalls[0][0],
            'https://orders-ingest.lieromaa.fi/api/public/analytics',
            'the analytics route should forward events to the public analytics endpoint on the order server'
          );
          expectEqual(
            recordedCalls[0][1].headers['X-Order-Token'],
            'shared-secret',
            'the analytics route should include the shared order token when proxying analytics events'
          );
        } finally {
          globalThis.fetch = originalFetch;
        }
      }
    );
  });

  test('the analytics route should surface missing server configuration as HTTP 500', async () => {
    await withEnv(
      {
        ORDER_SERVICE_URL: undefined,
        ORDER_SERVICE_TOKEN: undefined,
      },
      () =>
        withMutedConsole(async () => {
          const response = await POST(
            createRouteRequest({
              url: 'https://www.lieromaa.fi/api/analytics',
              json: {
                pageViewId: 'pageview-1',
              },
            })
          );

          expectEqual(response.status, 500, 'the analytics route should return HTTP 500 when server configuration is missing');
        })
    );
  });
});
