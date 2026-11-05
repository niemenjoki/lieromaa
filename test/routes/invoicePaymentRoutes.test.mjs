import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { POST as createCheckout } from '@/app/api/invoice-payment/checkout/route.js';
import { GET as getSession } from '@/app/api/invoice-payment/session/route.js';

import { withMutedConsole } from '../helpers/console.mjs';
import { createRouteRequest } from '../helpers/routeRequest.mjs';
import {
  ORDER_SERVICE_ENV,
  TEST_ORDER_SERVICE_TOKEN,
  TEST_ORDER_SERVICE_URL,
  getHeader,
  nonJsonResponse,
  timeoutError,
  withMockFetch,
  withTemporaryEnv,
} from '../helpers/routeTestKit.mjs';

const SITE = 'https://www.lieromaa.fi';
const CODE = 'ABCD-EFGH-JKLM';

function sessionRequest(code, options = {}) {
  const query = code === undefined ? '' : `?code=${encodeURIComponent(code)}`;
  return createRouteRequest({
    url: `${SITE}/api/invoice-payment/session${query}`,
    ...options,
  });
}

function checkoutRequest(json, options = {}) {
  return createRouteRequest({
    method: 'POST',
    url: `${SITE}/api/invoice-payment/checkout`,
    json,
    ...options,
  });
}

const ROUTES = [
  {
    name: 'session',
    call: (code, options) => getSession(sessionRequest(code, options)),
    upstreamPath: '/api/public/invoice-payment/session',
  },
  {
    name: 'checkout',
    call: (code, options) =>
      createCheckout(checkoutRequest(code === undefined ? {} : { code }, options)),
    upstreamPath: '/api/public/invoice-payment/checkout',
  },
];

function failIfCalled() {
  throw new Error('The order service must not be called.');
}

for (const route of ROUTES) {
  describe(`invoice payment ${route.name} route`, () => {
    test('rejects a cross-site request before calling the order service', async () => {
      await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
        withMockFetch(failIfCalled, async (calls) => {
          const response = await route.call(CODE, { origin: 'https://evil.example' });

          assert.equal(response.status, 403);
          assert.equal((await response.json()).code, 'same_origin_required');
          assert.equal(calls.length, 0);
        })
      );
    });

    test('rejects an empty, blank or too long code without calling the order service', async () => {
      await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
        withMockFetch(failIfCalled, async (calls) => {
          for (const code of [undefined, '', '   ', 'A'.repeat(21)]) {
            const response = await route.call(code);
            assert.equal(response.status, 400, `code ${JSON.stringify(code)}`);
            assert.equal((await response.json()).code, 'invalid_request');
          }
          assert.equal(calls.length, 0);
        })
      );
    });

    test('accepts a code of exactly 20 characters after trimming', async () => {
      await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
        withMockFetch(
          () =>
            Response.json({
              ok: true,
              status: 'open',
              url: 'https://checkout.stripe.com/c/pay/cs_test_1',
            }),
          async (calls) => {
            const response = await route.call(`  ${'B'.repeat(20)}  `);

            assert.equal(response.status, 200);
            assert.equal(calls.length, 1);
          }
        )
      );
    });

    test('sends the code, order service token, language and client IP upstream', async () => {
      await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
        withMockFetch(
          () =>
            Response.json({
              ok: true,
              status: 'open',
              url: 'https://checkout.stripe.com/c/pay/cs_test_1',
            }),
          async (calls) => {
            await route.call(` ${CODE} `, {
              extraHeaders: {
                'cf-connecting-ip': '203.0.113.7',
                'x-forwarded-for': '198.51.100.1, 10.0.0.1',
                'x-real-ip': '198.51.100.2',
                'X-Lieromaa-Language': 'en',
              },
            });

            assert.equal(calls.length, 1);
            const { url, init } = calls[0];
            const upstreamUrl = new URL(url);
            assert.equal(upstreamUrl.origin, TEST_ORDER_SERVICE_URL);
            assert.equal(upstreamUrl.pathname, route.upstreamPath);
            assert.equal(getHeader(init, 'X-Order-Token'), TEST_ORDER_SERVICE_TOKEN);
            assert.equal(getHeader(init, 'X-Lieromaa-Language'), 'en');
            // Cloudflare's header names the visitor; the others are proxies.
            assert.equal(getHeader(init, 'X-Lieromaa-Client-Ip'), '203.0.113.7');

            const sentCode =
              route.name === 'session'
                ? upstreamUrl.searchParams.get('code')
                : JSON.parse(init.body).code;
            assert.equal(sentCode, CODE, 'the code should be sent trimmed');
            if (route.name === 'checkout') {
              assert.deepEqual(Object.keys(JSON.parse(init.body)), ['code']);
            }
          }
        )
      );
    });

    test('falls back to x-real-ip and then the first x-forwarded-for address', async () => {
      await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
        withMockFetch(
          () =>
            Response.json({
              ok: true,
              url: 'https://checkout.stripe.com/c/pay/cs_test_1',
            }),
          async (calls) => {
            await route.call(CODE, {
              extraHeaders: { 'x-real-ip': '198.51.100.2', 'x-forwarded-for': '1.1.1.1' },
            });
            await route.call(CODE, {
              extraHeaders: { 'x-forwarded-for': ' 198.51.100.9 , 10.0.0.1' },
            });
            await route.call(CODE);

            assert.deepEqual(
              calls.map(({ init }) => getHeader(init, 'X-Lieromaa-Client-Ip')),
              ['198.51.100.2', '198.51.100.9', 'unknown']
            );
          }
        )
      );
    });

    test('passes characters outside the code alphabet to the order service only as data', async () => {
      // The route checks only the length; the order service validates the
      // format. The code must not be able to change the upstream path or add
      // query parameters.
      const code = '../x?y=1&z#';
      await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
        withMockFetch(
          () =>
            Response.json({
              ok: true,
              url: 'https://checkout.stripe.com/c/pay/cs_test_1',
            }),
          async (calls) => {
            await route.call(code);

            const upstreamUrl = new URL(calls[0].url);
            assert.equal(upstreamUrl.pathname, route.upstreamPath);
            assert.equal(upstreamUrl.hash, '');
            if (route.name === 'session') {
              assert.deepEqual([...upstreamUrl.searchParams.keys()], ['code']);
              assert.equal(upstreamUrl.searchParams.get('code'), code);
            } else {
              assert.equal(upstreamUrl.search, '');
              assert.equal(JSON.parse(calls[0].init.body).code, code);
            }
          }
        )
      );
    });

    test('does not call the order service when the token is missing', async () => {
      await withTemporaryEnv(
        { ...ORDER_SERVICE_ENV, ORDER_SERVICE_TOKEN: undefined },
        () =>
          withMockFetch(failIfCalled, async (calls) => {
            const response = await withMutedConsole(() => route.call(CODE));

            assert.equal(response.status, 500);
            assert.equal((await response.json()).code, 'upstream_unavailable');
            assert.equal(calls.length, 0);
          })
      );
    });

    test('answers 502 when the order service times out', async () => {
      await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
        withMockFetch(
          () => {
            throw timeoutError();
          },
          async () => {
            const response = await withMutedConsole(() => route.call(CODE));

            assert.equal(response.status, 502);
            assert.equal((await response.json()).code, 'upstream_unavailable');
          }
        )
      );
    });

    test('answers with a generic error when the order service returns a non-JSON error page', async () => {
      await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
        withMockFetch(
          () => nonJsonResponse(503),
          async () => {
            const response = await route.call(CODE);
            const text = await response.text();

            assert.equal(response.status, 503);
            assert.equal(JSON.parse(text).code, 'upstream_unavailable');
            assert.equal(text.includes('upstream proxy error page'), false);
          }
        )
      );
    });

    test('keeps the public error code of an invalid or rate-limited code', async () => {
      await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
        withMockFetch(
          () =>
            Response.json(
              { ok: false, code: 'invoice_payment_rate_limited', message: 'Odota.' },
              { status: 429 }
            ),
          async () => {
            const response = await route.call(CODE);

            assert.equal(response.status, 429);
            assert.equal((await response.json()).code, 'invoice_payment_rate_limited');
          }
        )
      );
    });

    test('never returns the order service token or URL to the browser', async () => {
      await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
        withMockFetch(
          () =>
            Response.json({
              ok: true,
              status: 'open',
              invoiceNumber: '1001',
              amountCents: 3490,
              dueDate: '2026-11-20',
              url: 'https://checkout.stripe.com/c/pay/cs_test_1',
            }),
          async () => {
            const response = await route.call(CODE);
            const text = await response.text();

            assert.equal(response.status, 200);
            assert.equal(response.headers.get('cache-control'), 'no-store');
            assert.equal(text.includes(TEST_ORDER_SERVICE_TOKEN), false);
            assert.equal(text.includes(TEST_ORDER_SERVICE_URL), false);
          }
        )
      );
    });
  });
}

describe('invoice payment routes: response fields', () => {
  test('the session route passes only the fields the payment page reads', async () => {
    await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
      withMockFetch(
        () =>
          Response.json({
            ok: true,
            status: 'open',
            language: 'fi',
            invoiceNumber: '1001',
            amountCents: 3490,
            currency: 'EUR',
            dueDate: '2026-11-20',
            customerEmail: 'asiakas@example.com',
            customerName: 'Asiakas',
          }),
        async () => {
          const body = await (await getSession(sessionRequest(CODE))).json();

          // InvoicePaymentClient reads ok, status, language, invoiceNumber,
          // amountCents and dueDate.
          assert.deepEqual(body, {
            ok: true,
            status: 'open',
            language: 'fi',
            invoiceNumber: '1001',
            amountCents: 3490,
            dueDate: '2026-11-20',
          });
        }
      )
    );
  });

  test('the session route passes a paid or unavailable state without invoice fields', async () => {
    await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
      withMockFetch(
        () => Response.json({ ok: true, status: 'paid', language: 'en' }),
        async () => {
          const body = await (await getSession(sessionRequest(CODE))).json();

          assert.deepEqual(body, { ok: true, status: 'paid', language: 'en' });
        }
      )
    );
  });

  test('the checkout route returns only the Stripe Checkout address', async () => {
    await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
      withMockFetch(
        () =>
          Response.json({
            ok: true,
            url: 'https://checkout.stripe.com/c/pay/cs_test_1',
            orderId: 'LRM-1',
            customerEmail: 'asiakas@example.com',
          }),
        async () => {
          const body = await (
            await createCheckout(checkoutRequest({ code: CODE }))
          ).json();

          assert.deepEqual(body, {
            ok: true,
            url: 'https://checkout.stripe.com/c/pay/cs_test_1',
          });
        }
      )
    );
  });

  test('the checkout route accepts only a Stripe Checkout address', async () => {
    for (const url of [
      'https://payments.example.test/fake',
      'http://checkout.stripe.com/c/pay/cs_test_1',
      'https://checkout.stripe.com.example.test/c/pay/cs_test_1',
      'javascript:alert(1)',
      '',
      undefined,
    ]) {
      await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
        withMockFetch(
          () => Response.json({ ok: true, url }),
          async () => {
            const response = await withMutedConsole(() =>
              createCheckout(checkoutRequest({ code: CODE }))
            );
            const text = await response.text();

            assert.equal(response.status, 502, String(url));
            assert.equal(JSON.parse(text).code, 'upstream_unavailable', String(url));
            if (url) {
              assert.equal(text.includes(url), false, String(url));
            }
          }
        )
      );
    }
  });
});
