import { describe, test } from 'node:test';

import { GET } from '@/app/api/pickup-points/search/route.js';

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

describe('frontend pickup-point search route', () => {
  test('the pickup-point search route should reject cross-origin requests', async () => {
    const response = await GET(
      createRouteRequest({
        url: 'https://www.lieromaa.fi/api/pickup-points/search?postalCode=00100',
        origin: 'https://evil.example',
        host: 'www.lieromaa.fi',
      })
    );

    expectEqual(
      response.status,
      403,
      'the pickup-point search route should return HTTP 403 for cross-origin requests'
    );
  });

  test('the pickup-point search route should reject non-mainland Finnish postal codes', async () => {
    const response = await GET(
      createRouteRequest({
        url: 'https://www.lieromaa.fi/api/pickup-points/search?postalCode=22100',
      })
    );

    expectEqual(
      response.status,
      400,
      'the pickup-point search route should reject postal codes outside mainland Finland'
    );
    expectDeepEqual(
      await response.json(),
      {
        ok: false,
        message:
          'Noutopistehaku on käytettävissä vain manner-Suomen 5-numeroisilla postinumeroilla.',
      },
      'the pickup-point search route should explain that the search is limited to mainland Finland postal codes'
    );
  });

  test('the pickup-point search route should fetch an access token and normalize Posti pickup points', async () => {
    await withEnv(
      {
        POSTI_API_CLIENT_ID: 'client-id',
        POSTI_API_CLIENT_SECRET: 'client-secret',
        POSTI_API_AUTH_URL: 'https://gateway-auth.posti.fi/api/v1/token',
        POSTI_API_GATEWAY_URL: 'https://gateway.posti.fi',
        POSTI_API_VERSION: '2025-04',
      },
      async () => {
        const recordedCalls = [];
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (url, init = {}) => {
          recordedCalls.push([url, init]);

          if (recordedCalls.length === 1) {
            return Response.json({
              access_token: 'posti-token',
              expires_in: 300,
            });
          }

          return Response.json({
            pickupPoints: [
              {
                id: 'POSTI-001',
                publicName: 'Posti Pasila',
                careOf: '',
                parcelLocker: true,
                availability: {
                  openingHours: [],
                },
                location: {
                  countryCode: 'FI',
                  street: 'Ratapihantie 6',
                  postcode: '00520',
                  city: 'Helsinki',
                  municipality: 'Helsinki',
                  specificLocation: '1. kerros',
                  coordinates: {
                    latitude: 60.2,
                    longitude: 24.9,
                  },
                },
                capabilities: [],
                routingServiceCode: '3198',
                distanceInMeters: 450,
              },
            ],
          });
        };

        try {
          const response = await GET(
            createRouteRequest({
              url: 'https://www.lieromaa.fi/api/pickup-points/search?postalCode=00100&street=Kompostikuja%201&city=Helsinki',
            })
          );

          expectEqual(
            response.status,
            200,
            'the pickup-point search route should return HTTP 200 when Posti responds successfully'
          );

          const body = await response.json();
          expectEqual(
            body.ok,
            true,
            'the pickup-point search route should respond with ok=true when the pickup-point lookup succeeds'
          );
          expectDeepEqual(
            body.pickupPoints,
            [
              {
                id: 'POSTI-001',
                name: 'Posti Pasila',
                careOf: '',
                street: 'Ratapihantie 6',
                postalCode: '00520',
                city: 'Helsinki',
                municipality: 'Helsinki',
                specificLocation: '1. kerros',
                parcelLocker: true,
                routingServiceCode: '3198',
                distanceInMeters: 450,
              },
            ],
            'the pickup-point search route should normalize Posti pickup-point fields for the checkout UI'
          );
          expectEqual(
            recordedCalls[0][0],
            'https://gateway-auth.posti.fi/api/v1/token',
            'the pickup-point search route should first fetch an OAuth token from Posti'
          );
          expectEqual(
            recordedCalls[1][0],
            'https://gateway.posti.fi/2025-04/pickuppoints',
            'the pickup-point search route should then call Posti’s pickup-point search endpoint'
          );
          expectEqual(
            recordedCalls[1][1].headers.Authorization,
            'Bearer posti-token',
            'the pickup-point search route should authenticate the pickup-point request with the fetched bearer token'
          );
          expectDeepEqual(
            JSON.parse(recordedCalls[1][1].body),
            {
              searchCriteria: {
                location: {
                  postcode: '00100',
                  countryCode: 'FI',
                  street: 'Kompostikuja 1',
                  city: 'Helsinki',
                },
                serviceFilters: {},
              },
              limit: 8,
            },
            'the pickup-point search route should forward the expected search criteria to Posti'
          );
        } finally {
          globalThis.fetch = originalFetch;
        }
      }
    );
  });
});
