import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';

import { createBareRequest } from '../helpers/routeTestKit.mjs';

const SITE_HOST = 'www.lieromaa.fi';

function check(headers, url = `https://${SITE_HOST}/api/orders/submit`) {
  return isSameOriginRequest(createBareRequest({ method: 'POST', url, headers }));
}

describe('isSameOriginRequest', () => {
  test('accepts the site itself behind the proxy', () => {
    assert.equal(
      check({
        origin: `https://${SITE_HOST}`,
        host: 'internal-app:3000',
        'x-forwarded-host': SITE_HOST,
        'x-forwarded-proto': 'https',
      }),
      true
    );
  });

  test('accepts a request without an Origin header (deliberate: same-origin GETs and old browsers send none)', () => {
    // Browsers always send Origin on cross-site POST and fetch requests, so a
    // missing header means a same-origin navigation, a GET or a non-browser
    // client. A non-browser client can set any header anyway.
    assert.equal(check({ host: SITE_HOST, 'x-forwarded-proto': 'https' }), true);
    assert.equal(check({}), true);
  });

  test('rejects the opaque Origin "null" from sandboxed frames and file pages', () => {
    assert.equal(
      check({ origin: 'null', host: SITE_HOST, 'x-forwarded-proto': 'https' }),
      false
    );
  });

  test('rejects an Origin that is not a URL', () => {
    assert.equal(
      check({ origin: 'lieromaa', host: SITE_HOST, 'x-forwarded-proto': 'https' }),
      false
    );
  });

  test('rejects another host, including a look-alike subdomain', () => {
    for (const origin of [
      'https://evil.example',
      `https://${SITE_HOST}.evil.example`,
      'https://lieromaa.fi',
    ]) {
      assert.equal(
        check({ origin, host: SITE_HOST, 'x-forwarded-proto': 'https' }),
        false,
        origin
      );
    }
  });

  test('rejects http when the site is served over https', () => {
    assert.equal(
      check({
        origin: `http://${SITE_HOST}`,
        host: SITE_HOST,
        'x-forwarded-proto': 'https',
      }),
      false
    );
  });

  test('uses the first protocol of a forwarded protocol list', () => {
    assert.equal(
      check({
        origin: `https://${SITE_HOST}`,
        host: SITE_HOST,
        'x-forwarded-proto': 'https, http',
      }),
      true
    );
    assert.equal(
      check({
        origin: `https://${SITE_HOST}`,
        host: SITE_HOST,
        'x-forwarded-proto': 'http, https',
      }),
      false
    );
  });

  test('falls back to the request URL protocol without x-forwarded-proto', () => {
    assert.equal(
      check(
        { origin: `http://${SITE_HOST}`, host: SITE_HOST },
        `https://${SITE_HOST}/api/x`
      ),
      false
    );
    assert.equal(
      check(
        { origin: `https://${SITE_HOST}`, host: SITE_HOST },
        `https://${SITE_HOST}/api/x`
      ),
      true
    );
  });

  test('rejects a different port', () => {
    assert.equal(
      check({
        origin: `https://${SITE_HOST}:8443`,
        host: SITE_HOST,
        'x-forwarded-proto': 'https',
      }),
      false
    );
    assert.equal(
      check({
        origin: 'http://localhost:3001',
        host: 'localhost:3000',
        'x-forwarded-proto': 'http',
      }),
      false
    );
  });

  test('accepts a matching non-default port in development', () => {
    assert.equal(
      check(
        { origin: 'http://localhost:3000', host: 'localhost:3000' },
        'http://localhost:3000/api/x'
      ),
      true
    );
  });

  test('compares the host case-insensitively', () => {
    assert.equal(
      check({
        origin: 'https://WWW.Lieromaa.FI',
        host: 'www.LIEROMAA.fi',
        'x-forwarded-proto': 'https',
      }),
      true
    );
  });

  test('x-forwarded-host wins over host when they differ', () => {
    const headers = {
      host: 'lieromaa.vercel.app',
      'x-forwarded-host': SITE_HOST,
      'x-forwarded-proto': 'https',
    };

    assert.equal(check({ ...headers, origin: `https://${SITE_HOST}` }), true);
    assert.equal(
      check({ ...headers, origin: 'https://lieromaa.vercel.app' }),
      false,
      'an Origin that matches only the internal host should be rejected'
    );
  });

  test('rejects an Origin when the request has no host at all', () => {
    assert.equal(check({ origin: `https://${SITE_HOST}` }), false);
  });
});
