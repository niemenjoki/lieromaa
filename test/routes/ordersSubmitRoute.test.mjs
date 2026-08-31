import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { POST } from '@/app/api/orders/submit/route.js';
import { obfuscateDiscountCode } from '@/lib/discounts/discountCode.mjs';
import { normalizePublicOrderSubmission } from '@/lib/orders/normalizePublicOrder';
import { WORM_HUNT_DISCOUNT_ENDS_ON, wormHuntConfig } from '@/lib/wormHunt/config.mjs';

import { expectDeepEqual, expectEqual } from '../helpers/assertions.mjs';
import { withMutedConsole } from '../helpers/console.mjs';
import {
  createValidOrderFormData,
  createValidOrderFormDataForScenario,
} from '../helpers/orderForm.mjs';
import { findOrderScenario, listOrderScenarios } from '../helpers/orderScenarios.mjs';
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

    expectEqual(
      response.status,
      200,
      'the public order submit route should respond with HTTP 200 for ignored honeypot spam'
    );
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
    const scenario =
      findOrderScenario({ fulfillmentType: 'pickup_point' }) ??
      listOrderScenarios()[0] ??
      null;

    if (!scenario) {
      return;
    }

    await withEnv(
      {
        NODE_ENV: 'development',
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
            paymentProvider: 'INVOICE',
          });
        };

        try {
          const formData = createValidOrderFormDataForScenario(scenario);
          const expectedPayload = normalizePublicOrderSubmission(formData);
          const response = await POST(
            createRouteRequest({
              url: 'https://www.lieromaa.fi/api/orders/submit',
              formData,
            })
          );

          expectEqual(
            response.status,
            200,
            'the public order submit route should return HTTP 200 when the upstream order creation succeeds'
          );
          const body = await response.json();
          expectEqual(
            body.ok,
            true,
            'the public order submit route should return ok=true when the upstream order creation succeeds'
          );
          expectEqual(
            body.orderId,
            'LRM-123',
            'the public order submit route should return the upstream order id'
          );
          expectEqual(
            recordedCalls.length,
            1,
            'the public order submit route should create exactly one upstream order request'
          );
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
          expectEqual(
            recordedCalls[0][1].headers['X-Lieromaa-Language'],
            'fi',
            'the public order submit route should default legacy submissions to Finnish upstream'
          );
          expectEqual(
            recordedCalls[0][1].headers['X-Lieromaa-Stripe-Mode'],
            'test',
            'the development proxy should require the backend Stripe sandbox environment'
          );

          const forwardedPayload = JSON.parse(recordedCalls[0][1].body);
          expectEqual(
            forwardedPayload.sourceRequestId,
            expectedPayload.sourceRequestId,
            'the public order submit route should forward the normalized source request id'
          );
          expectEqual(
            forwardedPayload.paymentProvider,
            'INVOICE',
            'the public order submit route should forward the explicit payment provider'
          );
          expectDeepEqual(
            forwardedPayload.customer,
            expectedPayload.customer,
            'the public order submit route should forward the normalized customer payload'
          );
          expectDeepEqual(
            forwardedPayload.fulfillment,
            expectedPayload.fulfillment,
            'the public order submit route should forward the normalized fulfillment payload'
          );
          expectDeepEqual(
            forwardedPayload.product,
            expectedPayload.product,
            'the public order submit route should forward the normalized product payload'
          );
          expectDeepEqual(
            forwardedPayload.pricing,
            expectedPayload.pricing,
            'the public order submit route should forward the normalized pricing payload'
          );
          expectEqual(
            forwardedPayload.pagePath,
            expectedPayload.pagePath,
            'the public order submit route should forward the normalized page path'
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

  test('the public order submit route should return the hosted Stripe Checkout handoff without exposing secrets', async () => {
    await withEnv(
      {
        NODE_ENV: 'development',
        ORDER_SERVICE_URL: 'https://orders-ingest.lieromaa.fi',
        ORDER_SERVICE_TOKEN: 'shared-secret',
      },
      async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async () =>
          Response.json({
            ok: true,
            orderId: 'LRM-STRIPE',
            duplicate: false,
            paymentProvider: 'STRIPE',
            paymentStatus: 'UNPAID',
            checkoutStatus: 'OPEN',
            checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_test_123',
            checkoutSessionId: 'cs_test_123',
          });

        try {
          const formData = createValidOrderFormData({
            sku: '',
            tuote_avain: '',
            cart_items_json: JSON.stringify([{ sku: 'worms-25', quantity: 1 }]),
            toimitus: 'nouto',
            payment_provider: 'STRIPE',
          });
          const response = await POST(
            createRouteRequest({
              url: 'https://www.lieromaa.fi/api/orders/submit',
              formData,
            })
          );
          const body = await response.json();
          expectEqual(body.paymentProvider, 'STRIPE');
          expectEqual(body.checkoutUrl, 'https://checkout.stripe.com/c/pay/cs_test_123');
          expectEqual(body.checkoutSessionId, 'cs_test_123');
          assert.equal(JSON.stringify(body).includes('sk_test_'), false);
          assert.equal(JSON.stringify(body).includes('whsec_'), false);
        } finally {
          globalThis.fetch = originalFetch;
        }
      }
    );
  });

  test('the development submit route should reject live or non-Stripe Checkout handoffs', async () => {
    await withEnv(
      {
        NODE_ENV: 'development',
        ORDER_SERVICE_URL: 'https://orders-ingest.lieromaa.fi',
        ORDER_SERVICE_TOKEN: 'shared-secret',
      },
      async () => {
        const originalFetch = globalThis.fetch;
        const formData = createValidOrderFormData({
          sku: '',
          tuote_avain: '',
          cart_items_json: JSON.stringify([{ sku: 'worms-25', quantity: 1 }]),
          toimitus: 'nouto',
          payment_provider: 'STRIPE',
        });

        try {
          for (const checkout of [
            {
              checkoutSessionId: 'cs_live_wrong',
              checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_live_wrong',
            },
            {
              checkoutSessionId: 'cs_test_wronghost',
              checkoutUrl: 'https://payments.example.test/fake-checkout',
            },
          ]) {
            globalThis.fetch = async () =>
              Response.json({
                ok: true,
                paymentProvider: 'STRIPE',
                paymentStatus: 'UNPAID',
                checkoutStatus: 'OPEN',
                ...checkout,
              });
            const response = await withMutedConsole(() =>
              POST(
                createRouteRequest({
                  url: 'https://www.lieromaa.fi/api/orders/submit',
                  formData,
                })
              )
            );
            expectEqual(response.status, 502);
          }
        } finally {
          globalThis.fetch = originalFetch;
        }
      }
    );
  });

  test('a Stripe submission should reject a legacy invoice-shaped response', async () => {
    await withEnv(
      {
        NODE_ENV: 'development',
        ORDER_SERVICE_URL: 'https://orders-ingest.lieromaa.fi',
        ORDER_SERVICE_TOKEN: 'shared-secret',
      },
      async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async () =>
          Response.json({
            ok: true,
            orderId: 'LRM-LEGACY',
            duplicate: false,
          });

        try {
          const response = await withMutedConsole(() =>
            POST(
              createRouteRequest({
                url: 'https://www.lieromaa.fi/api/orders/submit',
                formData: createValidOrderFormData({
                  sku: '',
                  tuote_avain: '',
                  cart_items_json: JSON.stringify([{ sku: 'worms-25', quantity: 1 }]),
                  toimitus: 'nouto',
                  payment_provider: 'STRIPE',
                }),
              })
            )
          );
          expectEqual(response.status, 502);
        } finally {
          globalThis.fetch = originalFetch;
        }
      }
    );
  });

  test('the public order submit route should recompute and forward the eligible cart reward', async () => {
    const rewardCode = wormHuntConfig.code;

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
            orderId: 'LRM-DISCOUNTED',
            duplicate: false,
            paymentProvider: 'INVOICE',
          });
        };

        try {
          const formData = createValidOrderFormData({
            sku: '',
            tuote_avain: '',
            cart_items_json: JSON.stringify([
              { sku: 'worms-50', quantity: 1 },
              {
                sku: 'worms-ready-bin-14l',
                parentSku: 'worms-50',
                quantity: 1,
              },
              { sku: 'chow-150', parentSku: 'worms-50', quantity: 1 },
            ]),
            toimitus: 'posti_noutopiste',
            osoite: 'Kompostikuja 1',
            postinumero: '00100',
            toimipaikka: 'Helsinki',
            alennuskoodi: rewardCode,
          });
          const response = await POST(
            createRouteRequest({
              url: 'https://www.lieromaa.fi/api/orders/submit',
              formData,
            })
          );

          if (!wormHuntConfig.enabled) {
            expectEqual(response.status, 400);
            expectEqual(recordedCalls.length, 0);
            return;
          }

          expectEqual(response.status, 200);
          expectEqual(recordedCalls.length, 1);

          const forwardedPayload = JSON.parse(recordedCalls[0][1].body);
          const discountAmount = Number(
            ((30 * wormHuntConfig.discountPercentage) / 100).toFixed(2)
          );
          const rewardLetters = [...rewardCode];
          const codeMasked = `${rewardLetters.slice(0, 2).join('')}**${rewardLetters.slice(-2).join('')}`;
          expectDeepEqual(forwardedPayload.pricing.discount, {
            codePlain: rewardCode,
            codeMasked,
            obfuscatedCode: obfuscateDiscountCode(rewardCode),
            type: 'percentage',
            value: wormHuntConfig.discountPercentage,
            productAmount: discountAmount,
            extraChargeAmount: 0,
            shippingAmount: 0,
            totalAmount: discountAmount,
            endsOn: WORM_HUNT_DISCOUNT_ENDS_ON,
          });
          expectEqual(forwardedPayload.pricing.itemPrice, 63.9);
          expectEqual(forwardedPayload.pricing.shippingPrice, 8.9);
          expectEqual(
            forwardedPayload.pricing.total,
            Number((72.8 - discountAmount).toFixed(2))
          );
        } finally {
          globalThis.fetch = originalFetch;
        }
      }
    );
  });

  test('the public order submit route should reject an invalid applied code before forwarding', async () => {
    const originalFetch = globalThis.fetch;
    let fetchCalled = false;
    globalThis.fetch = async () => {
      fetchCalled = true;
      throw new Error('The invalid order must not be forwarded.');
    };

    try {
      const response = await POST(
        createRouteRequest({
          url: 'https://www.lieromaa.fi/api/orders/submit',
          extraHeaders: {
            'X-Lieromaa-Language': 'en',
          },
          formData: createValidOrderFormData({
            language: 'en',
            sku: '',
            tuote_avain: '',
            cart_items_json: JSON.stringify([{ sku: 'worms-25', quantity: 1 }]),
            toimitus: 'nouto',
            alennuskoodi: 'NOTVALID',
          }),
        })
      );

      expectEqual(response.status, 400);
      expectDeepEqual(await response.json(), {
        ok: false,
        code: 'invalid_discount_code',
        message: 'The discount code is not valid.',
      });
      expectEqual(fetchCalled, false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('the public order submit route should preserve the upstream failure payload when order creation is rejected', async () => {
    const scenario = listOrderScenarios()[0] ?? null;

    if (!scenario) {
      return;
    }

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
                code: 'upstream_unavailable',
                message: 'Palvelin hylkäsi tilauksen.',
              },
              { status: 409 }
            );

          try {
            const response = await POST(
              createRouteRequest({
                url: 'https://www.lieromaa.fi/api/orders/submit',
                formData: createValidOrderFormDataForScenario(scenario),
              })
            );

            expectEqual(
              response.status,
              409,
              'the public order submit route should preserve the upstream rejection status code'
            );
            expectDeepEqual(
              await response.json(),
              {
                ok: false,
                code: 'upstream_unavailable',
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

  test('the public order submit route should return stable English validation errors', async () => {
    const response = await POST(
      createRouteRequest({
        url: 'https://www.lieromaa.fi/api/orders/submit',
        extraHeaders: {
          'X-Lieromaa-Language': 'en',
        },
        formData: createValidOrderFormData({
          language: 'en',
          country: 'SE',
        }),
      })
    );

    expectEqual(response.status, 400);
    expectDeepEqual(await response.json(), {
      ok: false,
      code: 'invalid_country',
      message: 'The delivery country must be Finland.',
    });
  });
});
