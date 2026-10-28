import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  ANALYTICS_OPT_OUT_PATH,
  ANALYTICS_OPT_OUT_STORAGE_KEY,
  ANALYTICS_OPT_OUT_STORAGE_VALUE,
} from '@/lib/analytics/optOut';
import {
  buildServerPageView,
  sendServerPageView,
} from '@/lib/analytics/serverPageView.mjs';

const BROWSER_HEADERS = {
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) Firefox/140.0',
  'accept-language': 'fi-FI,fi;q=0.9',
  'x-forwarded-for': '203.0.113.7, 10.0.0.1',
  referer: 'https://www.google.com/search?q=madot',
};

function request({
  url = 'https://www.lieromaa.fi/tuotteet/madot?utm_source=newsletter&utm_campaign=syksy',
  method = 'GET',
  headers = {},
  cookies = {},
  env = { VERCEL_ENV: 'production' },
} = {}) {
  const headerMap = new Headers({ ...BROWSER_HEADERS, ...headers });
  for (const [key, value] of Object.entries(headers)) {
    if (value === null) headerMap.delete(key);
  }

  return {
    method,
    url,
    headers: headerMap,
    cookies: { get: (name) => cookies[name] },
    env,
  };
}

describe('server-side page view collection', () => {
  test('a normal production page request becomes a page view without storing anything', () => {
    const pageView = buildServerPageView(request());

    assert.equal(pageView.payload.path, '/tuotteet/madot');
    assert.equal(pageView.payload.referrerHost, 'google.com');
    assert.equal(pageView.payload.utmSource, 'newsletter');
    assert.equal(pageView.payload.utmCampaign, 'syksy');
    assert.equal(pageView.payload.utmMedium, '');
    assert.deepEqual(pageView.client, {
      ip: '203.0.113.7',
      userAgent: BROWSER_HEADERS['user-agent'],
    });
    assert.equal(JSON.stringify(pageView.payload).includes('203.0.113.7'), false);
  });

  test('internal navigation keeps no referrer', () => {
    const pageView = buildServerPageView(
      request({ headers: { referer: 'https://www.lieromaa.fi/' } })
    );

    assert.equal(pageView.payload.referrerHost, '');
  });

  for (const [label, options] of [
    ['preview deployments', { env: { VERCEL_ENV: 'preview' } }],
    ['non-GET requests', { method: 'POST' }],
    ['bots', { headers: { 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' } }],
    ['requests without a language', { headers: { 'accept-language': null } }],
    ['Global Privacy Control', { headers: { 'sec-gpc': '1' } }],
    ['Do Not Track', { headers: { dnt: '1' } }],
    [
      "the owner's opt-out cookie",
      {
        cookies: { [ANALYTICS_OPT_OUT_STORAGE_KEY]: ANALYTICS_OPT_OUT_STORAGE_VALUE },
      },
    ],
    ['the opt-out page', { url: `https://www.lieromaa.fi${ANALYTICS_OPT_OUT_PATH}` }],
    ['the data download page', { url: 'https://www.lieromaa.fi/tietopyynto/lataa' }],
  ]) {
    test(`${label} are not counted`, () => {
      assert.equal(buildServerPageView(request(options)), null);
    });
  }

  test('the page view is sent with the client details only in headers', async () => {
    const calls = [];
    await sendServerPageView(buildServerPageView(request()), {
      env: {
        ORDER_SERVICE_URL: 'https://orders.example/',
        ORDER_SERVICE_TOKEN: 'token',
      },
      fetchImpl: async (url, init) => {
        calls.push([url, init]);
        return new Response(null, { status: 204 });
      },
    });

    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], 'https://orders.example/api/public/analytics/pageview');
    assert.equal(calls[0][1].headers['X-Analytics-Client-Ip'], '203.0.113.7');
    assert.equal(calls[0][1].body.includes('203.0.113.7'), false);
  });

  test('a failing analytics service never throws into the page request', async () => {
    await sendServerPageView(buildServerPageView(request()), {
      env: { ORDER_SERVICE_URL: 'https://orders.example', ORDER_SERVICE_TOKEN: 't' },
      fetchImpl: async () => {
        throw new Error('down');
      },
    });
  });
});
