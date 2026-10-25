import { describe, test } from 'node:test';

import { POST as bookPickup } from '@/app/api/pickup/book/route.js';
import { GET as getPickupSession } from '@/app/api/pickup/session/route.js';

import { expectEqual } from '../helpers/assertions.mjs';
import { createRouteRequest } from '../helpers/routeRequest.mjs';

const ENV = {
  ORDER_SERVICE_URL: 'https://orders-ingest.lieromaa.fi',
  ORDER_SERVICE_TOKEN: 'shared-order-token',
};

function withEnvAndFetch(fetchImpl, fn) {
  const previous = new Map(Object.keys(ENV).map((key) => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, ENV);
  globalThis.fetch = fetchImpl;

  return Promise.resolve()
    .then(fn)
    .finally(() => {
      globalThis.fetch = originalFetch;
      for (const [key, value] of previous.entries()) {
        if (value === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      }
    });
}

describe('frontend pickup proxy routes', () => {
  test('the pickup session route rejects requests without a pickup token', async () => {
    const response = await getPickupSession(
      createRouteRequest({ url: 'https://www.lieromaa.fi/api/pickup/session' })
    );

    expectEqual(response.status, 400, 'a missing pickup token should return HTTP 400');
  });

  test('the pickup session route rejects cross-site requests', async () => {
    const response = await getPickupSession(
      createRouteRequest({
        url: 'https://www.lieromaa.fi/api/pickup/session?token=p1.1.abc',
        origin: 'https://evil.example',
      })
    );

    expectEqual(response.status, 403, 'a cross-site request should return HTTP 403');
  });

  test('the pickup session route forwards the token with the order service token', async () => {
    await withEnvAndFetch(
      async (url, init) => {
        expectEqual(
          url,
          'https://orders-ingest.lieromaa.fi/api/public/pickup/session?token=p1.1.abc',
          'the session lookup should go to the public pickup endpoint'
        );
        expectEqual(
          init.headers['X-Order-Token'],
          'shared-order-token',
          'the order service token should be sent upstream'
        );

        return Response.json({ ok: true, status: 'choose', orderId: 'LRM-1', slots: [] });
      },
      async () => {
        const response = await getPickupSession(
          createRouteRequest({
            url: 'https://www.lieromaa.fi/api/pickup/session?token=p1.1.abc',
          })
        );
        const body = await response.json();

        expectEqual(response.status, 200, 'a valid session should return HTTP 200');
        expectEqual(body.status, 'choose', 'the session status should be passed through');
      }
    );
  });

  test('the pickup session route keeps the upstream error status and code', async () => {
    await withEnvAndFetch(
      async () =>
        Response.json(
          {
            ok: false,
            code: 'pickup_link_invalid',
            message: 'Linkki ei ole kelvollinen.',
          },
          { status: 404 }
        ),
      async () => {
        const response = await getPickupSession(
          createRouteRequest({
            url: 'https://www.lieromaa.fi/api/pickup/session?token=invalid',
          })
        );
        const body = await response.json();

        expectEqual(response.status, 404, 'an invalid link should keep HTTP 404');
        expectEqual(
          body.code,
          'pickup_link_invalid',
          'the upstream error code should be kept'
        );
      }
    );
  });

  test('the pickup booking route validates and forwards the selected slot', async () => {
    const invalid = await bookPickup(
      createRouteRequest({
        method: 'POST',
        url: 'https://www.lieromaa.fi/api/pickup/book',
        json: { token: 'p1.1.abc', optionId: 'x' },
      })
    );
    expectEqual(invalid.status, 400, 'an invalid slot id should return HTTP 400');

    await withEnvAndFetch(
      async (url, init) => {
        expectEqual(
          url,
          'https://orders-ingest.lieromaa.fi/api/public/pickup/book',
          'the booking should go to the public pickup booking endpoint'
        );
        expectEqual(
          init.body,
          JSON.stringify({ token: 'p1.1.abc', optionId: 7 }),
          'only the token and slot id should be forwarded'
        );

        return Response.json({
          ok: true,
          status: 'booked',
          booking: { date: '2026-11-04' },
        });
      },
      async () => {
        const response = await bookPickup(
          createRouteRequest({
            method: 'POST',
            url: 'https://www.lieromaa.fi/api/pickup/book',
            json: { token: 'p1.1.abc', optionId: 7, extra: 'ignored' },
          })
        );
        const body = await response.json();

        expectEqual(response.status, 200, 'a successful booking should return HTTP 200');
        expectEqual(body.status, 'booked', 'the booked session should be passed through');
      }
    );
  });
});
