import { describe, test } from 'node:test';

import { GET } from '@/app/api/pickup-points/search/route.js';

import { expectDeepEqual, expectEqual } from '../helpers/assertions.mjs';
import { withEnv } from '../helpers/env.mjs';
import { createRouteRequest } from '../helpers/routeRequest.mjs';

const POSTI_POINT = {
  id: 'POSTI-002',
  publicName: 'Posti Kallio',
  careOf: '',
  parcelLocker: false,
  location: {
    countryCode: 'FI',
    street: 'Hämeentie 1',
    postcode: '00530',
    city: 'Helsinki',
    municipality: 'Helsinki',
    specificLocation: '',
  },
  routingServiceCode: '3200',
  distanceInMeters: 120,
};

const ALAND_POINT = {
  ...POSTI_POINT,
  id: 'POSTI-ALAND',
  location: { ...POSTI_POINT.location, postcode: '22100', city: 'Mariehamn' },
};

// Jokainen testi käyttää omaa tunnusta, jotta reitin välimuistissa oleva Posti-asiakas ja sen
// tunnus eivät siirry testistä toiseen.
async function withPosti(clientId, responses, run) {
  await withEnv(
    {
      POSTI_API_CLIENT_ID: clientId,
      POSTI_API_CLIENT_SECRET: 'client-secret',
    },
    async () => {
      const calls = [];
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async (url, init = {}) => {
        calls.push([url, init]);
        const next = responses.shift();
        if (!next) {
          throw new Error(`unexpected Posti call: ${url}`);
        }
        return next();
      };

      try {
        await run(calls);
      } finally {
        globalThis.fetch = originalFetch;
      }
    }
  );
}

function token(value = 'posti-token') {
  return () => Response.json({ access_token: value, expires_in: 300 });
}

async function search(language = 'fi') {
  return GET(
    createRouteRequest({
      url: 'https://www.lieromaa.fi/api/pickup-points/search?postalCode=00100',
      extraHeaders: { 'X-Lieromaa-Language': language },
    })
  );
}

describe('frontend pickup-point search route with the Posti package', () => {
  test('returns only the public fields, without the original Posti object, and drops Åland points', async () => {
    await withPosti(
      'client-fields',
      [token(), () => Response.json({ pickupPoints: [POSTI_POINT, ALAND_POINT] })],
      async () => {
        const response = await search();
        const body = await response.json();

        expectEqual(response.status, 200, 'a successful search returns HTTP 200');
        expectDeepEqual(
          body.pickupPoints,
          [
            {
              id: 'POSTI-002',
              name: 'Posti Kallio',
              careOf: '',
              street: 'Hämeentie 1',
              postalCode: '00530',
              city: 'Helsinki',
              municipality: 'Helsinki',
              specificLocation: '',
              parcelLocker: false,
              routingServiceCode: '3200',
              distanceInMeters: 120,
            },
          ],
          'the response keeps the earlier fields and leaves out raw, countryCode and Åland points'
        );
      }
    );
  });

  test('keeps a null distance from Posti as 0, as before the package', async () => {
    await withPosti(
      'client-null-distance',
      [
        token(),
        () =>
          Response.json({ pickupPoints: [{ ...POSTI_POINT, distanceInMeters: null }] }),
      ],
      async () => {
        const body = await (await search()).json();
        expectEqual(
          body.pickupPoints[0].distanceInMeters,
          0,
          'a null distance is returned as 0'
        );
      }
    );
  });

  test('fetches a new token and retries once when Posti rejects the cached token', async () => {
    await withPosti(
      'client-retry',
      [
        token('old-token'),
        () => Response.json({ message: 'expired' }, { status: 401 }),
        token('new-token'),
        () => Response.json({ pickupPoints: [POSTI_POINT] }),
      ],
      async (calls) => {
        const response = await search();
        const body = await response.json();

        expectEqual(response.status, 200, 'the retried search succeeds');
        expectEqual(body.pickupPoints.length, 1, 'the retried search returns the point');
        expectEqual(
          calls[3][1].headers.Authorization,
          'Bearer new-token',
          'the retry uses the new token'
        );
      }
    );
  });

  test('returns 503 with the generic message when the token request fails', async () => {
    await withPosti(
      'client-auth',
      [() => Response.json({ error: 'invalid_client' }, { status: 401 })],
      async () => {
        const response = await search('en');
        const body = await response.json();

        expectEqual(response.status, 503, 'a failed token request returns HTTP 503');
        expectEqual(body.ok, false, 'the search fails');
        expectEqual(body.code, 'upstream_unavailable', 'the generic upstream code');
      }
    );
  });

  test('returns 503 when the Posti credentials are missing', async () => {
    await withEnv({ POSTI_API_CLIENT_ID: '', POSTI_API_CLIENT_SECRET: '' }, async () => {
      const response = await search();
      expectEqual(response.status, 503, 'missing credentials return HTTP 503');
    });
  });

  test('passes a Posti 5xx status through and hides other failures behind 502', async () => {
    await withPosti(
      'client-5xx',
      [token(), () => Response.json({ message: 'down' }, { status: 500 })],
      async () => {
        const response = await search();
        expectEqual(response.status, 500, 'a Posti 5xx status is passed through');
      }
    );

    await withPosti(
      'client-invalid',
      [token(), () => Response.json({ unexpected: true })],
      async () => {
        const response = await search();
        const body = await response.json();
        expectEqual(
          response.status,
          502,
          'a response without pickupPoints returns HTTP 502'
        );
        expectEqual(body.code, 'upstream_unavailable', 'the generic upstream code');
      }
    );

    await withPosti(
      'client-network',
      [
        token(),
        () => {
          throw new TypeError('fetch failed');
        },
      ],
      async () => {
        const response = await search();
        expectEqual(response.status, 502, 'a network failure returns HTTP 502');
      }
    );
  });
});
