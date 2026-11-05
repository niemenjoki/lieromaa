import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { POST } from '@/app/api/looku/route.js';

import { getHeader, withMockFetch, withTemporaryEnv } from '../helpers/routeTestKit.mjs';

const SITE = 'https://www.lieromaa.fi';
const LOOKU_ENV = Object.freeze({
  VERCEL_ENV: 'production',
  LOOKU_ENDPOINT: 'https://looku.example.test/',
  LOOKU_SITE_ID: 'test-site',
  LOOKU_SIGNING_KEY: 'test-signing-key',
});
const VISITOR_IP = '203.0.113.77';
const VISITOR_UA = 'Mozilla/5.0 (X11; Linux x86_64) TestBrowser/1.0';

const EVENT = Object.freeze({
  type: 'event',
  name: 'add_to_cart',
  path: '/tuotteet/madot',
  target: 'product',
  items: [{ sku: 'test-sku', quantity: 2 }],
  props: { value: 'test-sku' },
});

function collectRequest(body, headers = {}) {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return new Request(`${SITE}/api/looku`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'sec-fetch-site': 'same-origin',
      origin: SITE,
      'user-agent': VISITOR_UA,
      'cf-connecting-ip': VISITOR_IP,
      'x-forwarded-for': `${VISITOR_IP}, 10.0.0.1`,
      'x-real-ip': VISITOR_IP,
      ...headers,
    },
    body: text,
  });
}

function failIfCalled() {
  throw new Error('Looku must not be called.');
}

async function collect(
  body,
  headers,
  env = LOOKU_ENV,
  upstream = () => new Response(null)
) {
  return withTemporaryEnv(env, () =>
    withMockFetch(upstream, async (calls) => {
      const response = await POST(collectRequest(body, headers));
      return { response, calls };
    })
  );
}

describe('Looku collect route', () => {
  test('forwards a valid event to Looku with a signature', async () => {
    const { response, calls } = await collect(EVENT);

    assert.equal(response.status, 204);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://looku.example.test/ingest');
    assert.equal(getHeader(calls[0].init, 'X-Looku-Site'), 'test-site');
    assert.match(
      getHeader(calls[0].init, 'X-Looku-Signature'),
      /^t=\d+,v1=[0-9a-f]{64}$/
    );

    const forwarded = JSON.parse(calls[0].init.body);
    assert.equal(forwarded.name, 'add_to_cart');
    assert.equal(forwarded.path, '/tuotteet/madot');
  });

  test('never forwards the IP address or user agent, even when the body names them', async () => {
    const { calls } = await collect({
      ...EVENT,
      ip: VISITOR_IP,
      ua: VISITOR_UA,
      userAgent: VISITOR_UA,
      country: 'FI',
    });

    const body = calls[0].init.body;
    assert.equal(body.includes(VISITOR_IP), false);
    assert.equal(body.includes(VISITOR_UA), false);
    const forwarded = JSON.parse(body);
    for (const key of ['ip', 'ua', 'userAgent', 'country']) {
      assert.equal(key in forwarded, false, key);
    }
    for (const name of [
      'user-agent',
      'x-forwarded-for',
      'cf-connecting-ip',
      'x-real-ip',
    ]) {
      assert.equal(getHeader(calls[0].init, name), undefined, name);
    }
  });

  test('forwards an engagement record with only its known fields', async () => {
    const { calls } = await collect({
      type: 'engagement',
      path: '/opas',
      dwell_ms: 12345.9,
      max_scroll_pct: 140,
      ip: VISITOR_IP,
    });

    const forwarded = JSON.parse(calls[0].init.body);
    assert.deepEqual(Object.keys(forwarded).sort(), [
      'dwell_ms',
      'max_scroll_pct',
      'path',
      'source',
      'ts',
      'type',
    ]);
    assert.equal(forwarded.dwell_ms, 12345);
    assert.equal(forwarded.max_scroll_pct, 100);
  });

  test('rejects a cross-site request', async () => {
    for (const headers of [
      { 'sec-fetch-site': 'cross-site' },
      { 'sec-fetch-site': 'same-site' },
      { 'sec-fetch-site': '', origin: 'https://evil.example' },
    ]) {
      const { response, calls } = await collect(EVENT, headers, LOOKU_ENV, failIfCalled);

      assert.equal(response.status, 403, JSON.stringify(headers));
      assert.equal(calls.length, 0);
    }
  });

  test('without Sec-Fetch-Site, an Origin is required', async () => {
    const request = new Request(`${SITE}/api/looku`, {
      method: 'POST',
      headers: { 'user-agent': VISITOR_UA },
      body: JSON.stringify(EVENT),
    });

    await withTemporaryEnv(LOOKU_ENV, () =>
      withMockFetch(failIfCalled, async (calls) => {
        const response = await POST(request);

        assert.equal(response.status, 403);
        assert.equal(calls.length, 0);
      })
    );
  });

  test('sends nothing outside production', async () => {
    const { response, calls } = await collect(
      EVENT,
      {},
      { ...LOOKU_ENV, VERCEL_ENV: 'preview' },
      failIfCalled
    );

    assert.equal(response.status, 204);
    assert.equal(calls.length, 0);
  });

  test('sends nothing for Do Not Track, Global Privacy Control or a bot', async () => {
    for (const headers of [
      { dnt: '1' },
      { 'sec-gpc': '1' },
      { 'user-agent': 'Googlebot/2.1' },
      { 'user-agent': '' },
    ]) {
      const { response, calls } = await collect(EVENT, headers, LOOKU_ENV, failIfCalled);

      assert.equal(response.status, 204, JSON.stringify(headers));
      assert.equal(calls.length, 0, JSON.stringify(headers));
    }
  });

  test('drops an invalid or oversized body without calling Looku', async () => {
    for (const body of [
      'not json',
      { ...EVENT, name: 'Add To Cart' },
      { ...EVENT, path: 'https://evil.example/' },
      { type: 'pageview', path: '/' },
      [EVENT],
    ]) {
      const { response, calls } = await collect(body, {}, LOOKU_ENV, failIfCalled);

      assert.equal(response.status, 204, JSON.stringify(body));
      assert.equal(calls.length, 0, JSON.stringify(body));
    }

    const large = { ...EVENT, target: 'x'.repeat(5000) };
    const { response, calls } = await collect(large, {}, LOOKU_ENV, failIfCalled);
    assert.ok([204, 413].includes(response.status));
    assert.equal(calls.length, 0);
  });

  test('a Looku failure never reaches the page', async () => {
    const { response, calls } = await collect(EVENT, {}, LOOKU_ENV, () => {
      throw new DOMException('timeout', 'TimeoutError');
    });

    assert.equal(response.status, 204);
    assert.equal(calls.length, 1);
  });
});
