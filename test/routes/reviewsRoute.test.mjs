import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { GET as getReviewSession } from '@/app/api/reviews/session/route.js';
import { POST as submitReview } from '@/app/api/reviews/submit/route.js';

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

describe('frontend review proxy routes', () => {
  test('the review session route should reject requests that do not include a review token', async () => {
    const response = await getReviewSession(
      createRouteRequest({
        url: 'https://www.lieromaa.fi/api/reviews/session',
      })
    );

    expectEqual(
      response.status,
      400,
      'the review session route should return HTTP 400 when the review token is missing'
    );
  });

  test('the review session route should forward the session lookup to the order server when a token is present', async () => {
    await withEnv(
      {
        ORDER_SERVICE_URL: 'https://orders-ingest.lieromaa.fi',
      },
      async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (url) => {
          expectEqual(
            url,
            'https://orders-ingest.lieromaa.fi/api/public/reviews/session?token=review-token',
            'the review session route should query the public review-session endpoint on the order server'
          );

          return Response.json({
            ok: true,
            orderId: 'LRM-123',
            productKey: 'worms',
            productName: 'Kompostimadot',
          });
        };

        try {
          const response = await getReviewSession(
            createRouteRequest({
              url: 'https://www.lieromaa.fi/api/reviews/session?token=review-token',
            })
          );

          expectEqual(
            response.status,
            200,
            'the review session route should preserve the successful upstream status'
          );
          expectDeepEqual(
            await response.json(),
            {
              ok: true,
              status: 'ready',
              orderId: 'LRM-123',
              productKey: 'worms',
              productName: 'Kompostimadot',
            },
            'the review session route should return the normalized review session payload from the order server'
          );
        } finally {
          globalThis.fetch = originalFetch;
        }
      }
    );
  });

  test('the review submit route should forward the payload and preserve upstream error messages', async () => {
    await withEnv(
      {
        ORDER_SERVICE_URL: 'https://orders-ingest.lieromaa.fi',
      },
      async () => {
        const originalFetch = globalThis.fetch;
        const recordedCalls = [];
        globalThis.fetch = async (url, init = {}) => {
          recordedCalls.push([url, init]);
          return Response.json(
            {
              ok: false,
              message: 'Tälle tilaukselle on jo lähetetty arvostelu.',
            },
            { status: 409 }
          );
        };

        try {
          const response = await submitReview(
            createRouteRequest({
              url: 'https://www.lieromaa.fi/api/reviews/submit',
              json: {
                token: 'review-token',
                rating: 5,
                review: 'Toimi hyvin.',
                displayName: 'Mato',
              },
            })
          );

          expectEqual(
            recordedCalls[0][0],
            'https://orders-ingest.lieromaa.fi/api/public/reviews',
            'the review submit route should post to the public review endpoint on the order server'
          );
          expectEqual(
            response.status,
            409,
            'the review submit route should preserve the upstream rejection status'
          );
          expectDeepEqual(
            await response.json(),
            {
              ok: false,
              message: 'Tälle tilaukselle on jo lähetetty arvostelu.',
            },
            'the review submit route should preserve the upstream rejection message'
          );
        } finally {
          globalThis.fetch = originalFetch;
        }
      }
    );
  });
});
