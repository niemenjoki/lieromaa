import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';

import {
  ANALYTICS_OPT_OUT_PATH,
  ANALYTICS_OPT_OUT_STORAGE_KEY,
  ANALYTICS_OPT_OUT_STORAGE_VALUE,
} from '@/lib/analytics/optOut.js';
import { ANALYTICS_EXCLUDED_PATHS } from '@/lib/analytics/pathPolicy.mjs';
import { config, proxy } from '@/proxy.js';

const ENV_KEYS = ['VERCEL_ENV', 'LOOKU_ENDPOINT', 'LOOKU_SITE_ID', 'LOOKU_SIGNING_KEY'];
const originalFetch = globalThis.fetch;
let savedEnv;
let sent;

function pageRequest(path, headers = {}) {
  const request = new Request(`https://www.lieromaa.fi${path}`, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/140.0',
      'accept-language': 'fi-FI',
      'x-vercel-forwarded-for': '203.0.113.7',
      ...headers,
    },
  });
  return request;
}

async function runProxy(request) {
  const waits = [];
  proxy(request, { waitUntil: (promise) => waits.push(promise) });
  await Promise.all(waits);
}

beforeEach(() => {
  savedEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
  process.env.VERCEL_ENV = 'production';
  process.env.LOOKU_ENDPOINT = 'https://looku.example';
  process.env.LOOKU_SITE_ID = 'lieromaa';
  process.env.LOOKU_SIGNING_KEY = 'test-signing-key';
  sent = [];
  globalThis.fetch = async (url, init) => {
    sent.push({ url, init, body: JSON.parse(init.body) });
    return new Response(null, { status: 202 });
  };
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

test('proxy sends a signed Looku page view with the campaign for a page request', async () => {
  await runProxy(pageRequest('/tuotteet/madot?utm_campaign=syksy&utm_source=fb'));

  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, 'https://looku.example/ingest');
  assert.equal(sent[0].init.headers['X-Looku-Site'], 'lieromaa');
  assert.match(sent[0].init.headers['X-Looku-Signature'], /^t=\d+,v1=[0-9a-f]{64}$/);
  assert.equal(sent[0].body.type, 'pageview');
  assert.equal(sent[0].body.path, '/tuotteet/madot');
  assert.equal(sent[0].body.ip, '203.0.113.7');
  assert.equal(sent[0].body.utm_campaign, 'syksy');
  assert.equal(sent[0].body.utm_source, 'fb');
});

test('proxy does not count the opt-out page, private download pages or the owner', async () => {
  for (const path of [ANALYTICS_OPT_OUT_PATH, ...ANALYTICS_EXCLUDED_PATHS]) {
    await runProxy(pageRequest(path));
  }
  await runProxy(
    pageRequest('/', {
      cookie: `${ANALYTICS_OPT_OUT_STORAGE_KEY}=${ANALYTICS_OPT_OUT_STORAGE_VALUE}`,
    })
  );

  assert.equal(sent.length, 0);
});

test('proxy does not count bots, Do Not Track or previews', async () => {
  await runProxy(pageRequest('/', { 'user-agent': 'Googlebot/2.1' }));
  await runProxy(pageRequest('/', { dnt: '1' }));
  await runProxy(pageRequest('/', { 'sec-gpc': '1' }));
  process.env.VERCEL_ENV = 'preview';
  await runProxy(pageRequest('/'));

  assert.equal(sent.length, 0);
});

test('proxy matcher skips files and API routes but keeps pages with a dot-free path', () => {
  const pattern = new RegExp(`^${config.matcher[0].source}$`);

  assert.equal(pattern.test('/tuotteet/madot'), true);
  assert.equal(pattern.test('/'), true);
  assert.equal(pattern.test('/favicon.ico'), false);
  assert.equal(pattern.test('/api/looku'), false);
  assert.equal(pattern.test('/_next/static/chunk'), false);
});
