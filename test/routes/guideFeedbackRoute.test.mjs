import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { POST } from '@/app/api/guide-feedback/submit/route.js';

import { withMutedConsole } from '../helpers/console.mjs';
import { createRouteRequest } from '../helpers/routeRequest.mjs';
import {
  ORDER_SERVICE_ENV,
  TEST_ORDER_SERVICE_TOKEN,
  TEST_ORDER_SERVICE_URL,
  getHeader,
  withMockFetch,
  withTemporaryEnv,
} from '../helpers/routeTestKit.mjs';

const FEEDBACK_URL = 'https://www.lieromaa.fi/api/guide-feedback/submit';

// The fields GuideFeedbackBox sends.
const FEEDBACK = Object.freeze({
  _gotcha: '',
  feedbackType: 'correction',
  feedbackTypeLabel: 'Korjaus',
  message: 'Kappaleessa on kirjoitusvirhe.',
  email: 'lukija@example.com',
  pageContext: 'guide',
  pageTitle: 'Opas',
  pageUrl: 'https://www.lieromaa.fi/opas',
  referrer: '',
});

function feedbackRequest(json, options = {}) {
  return createRouteRequest({ method: 'POST', url: FEEDBACK_URL, json, ...options });
}

function failIfCalled() {
  throw new Error('The order service must not be called.');
}

describe('guide feedback route', () => {
  test('rejects a cross-site request before calling the order service', async () => {
    await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
      withMockFetch(failIfCalled, async (calls) => {
        const response = await POST(
          feedbackRequest(FEEDBACK, { origin: 'https://evil.example' })
        );

        assert.equal(response.status, 403);
        assert.equal((await response.json()).ok, false);
        assert.equal(calls.length, 0);
      })
    );
  });

  test('rejects a body that is not JSON', async () => {
    await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
      withMockFetch(failIfCalled, async (calls) => {
        const response = await POST(feedbackRequest(new SyntaxError('bad json')));

        assert.equal(response.status, 400);
        assert.equal(calls.length, 0);
      })
    );
  });

  test('does not call the order service without a token or URL', async () => {
    for (const missing of ['ORDER_SERVICE_TOKEN', 'ORDER_SERVICE_URL']) {
      await withTemporaryEnv({ ...ORDER_SERVICE_ENV, [missing]: undefined }, () =>
        withMockFetch(failIfCalled, async (calls) => {
          const response = await withMutedConsole(() => POST(feedbackRequest(FEEDBACK)));

          assert.equal(response.status, 500, missing);
          assert.equal(calls.length, 0, missing);
        })
      );
    }
  });

  test('forwards the feedback with the order service token and returns only the message id', async () => {
    await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
      withMockFetch(
        () =>
          Response.json(
            { ok: true, messageId: 'msg-1', email: 'lukija@example.com', internal: 'x' },
            { status: 201 }
          ),
        async (calls) => {
          const response = await POST(
            feedbackRequest(FEEDBACK, {
              extraHeaders: { 'user-agent': 'Mozilla/5.0 test' },
            })
          );

          assert.equal(response.status, 200);
          assert.deepEqual(await response.json(), { ok: true, messageId: 'msg-1' });

          assert.equal(calls.length, 1);
          assert.equal(
            calls[0].url,
            `${TEST_ORDER_SERVICE_URL}/api/public/guide-feedback`
          );
          assert.equal(
            getHeader(calls[0].init, 'X-Order-Token'),
            TEST_ORDER_SERVICE_TOKEN
          );

          const forwarded = JSON.parse(calls[0].init.body);
          for (const [key, value] of Object.entries(FEEDBACK)) {
            assert.equal(forwarded[key], value, key);
          }
        }
      )
    );
  });

  test('the server sets requestContext; the browser cannot replace it', async () => {
    await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
      withMockFetch(
        () => Response.json({ ok: true, messageId: 'msg-1' }),
        async (calls) => {
          await POST(
            feedbackRequest(
              {
                ...FEEDBACK,
                requestContext: { forwardedFor: '6.6.6.6', userAgent: 'spoofed' },
              },
              {
                extraHeaders: {
                  'user-agent': 'Mozilla/5.0 test',
                  'x-forwarded-for': '203.0.113.5',
                },
              }
            )
          );

          const { requestContext } = JSON.parse(calls[0].init.body);
          assert.equal(requestContext.forwardedFor, '203.0.113.5');
          assert.equal(requestContext.userAgent, 'Mozilla/5.0 test');
        }
      )
    );
  });

  test('passes unknown fields through unchanged (current behaviour, the order service validates)', async () => {
    // The route does no validation of its own: whatever the browser sends is
    // forwarded with the server's token. See the todo below.
    await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
      withMockFetch(
        () => Response.json({ ok: true, messageId: 'msg-1' }),
        async (calls) => {
          await POST(feedbackRequest({ ...FEEDBACK, status: 'resolved', extra: 'x' }));

          const forwarded = JSON.parse(calls[0].init.body);
          assert.equal(forwarded.status, 'resolved');
          assert.equal(forwarded.extra, 'x');
        }
      )
    );
  });

  test.todo(
    'forwards only the known feedback fields (VIKA: runko välitetään validoimatta palvelimen tokenilla)',
    async () => {
      await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
        withMockFetch(
          () => Response.json({ ok: true, messageId: 'msg-1' }),
          async (calls) => {
            await POST(feedbackRequest({ ...FEEDBACK, status: 'resolved', extra: 'x' }));

            const forwarded = JSON.parse(calls[0].init.body);
            assert.equal('status' in forwarded, false);
            assert.equal('extra' in forwarded, false);
          }
        )
      );
    }
  );

  test.todo(
    'rejects a JSON body that is not an object (VIKA: taulukko tai merkkijono levitetään runkoon)',
    async () => {
      await withTemporaryEnv(ORDER_SERVICE_ENV, () =>
        withMockFetch(
          () => Response.json({ ok: true, messageId: 'msg-1' }),
          async (calls) => {
            const response = await POST(feedbackRequest(['a', 'b']));

            assert.equal(response.status, 400);
            assert.equal(calls.length, 0);
          }
        )
      );
    }
  );
});
