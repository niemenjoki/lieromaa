import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import enCommerceMessages from '@/data/i18n/en/commerce.mjs';
import enCommonMessages from '@/data/i18n/en/common.mjs';
import enPageMessages from '@/data/i18n/en/pages.mjs';
import enProductMessages from '@/data/i18n/en/products.mjs';
import enTransactionMessages from '@/data/i18n/en/transactions.mjs';
import fiCommerceMessages from '@/data/i18n/fi/commerce.mjs';
import fiCommonMessages from '@/data/i18n/fi/common.mjs';
import fiPageMessages from '@/data/i18n/fi/pages.mjs';
import fiProductMessages from '@/data/i18n/fi/products.mjs';
import fiTransactionMessages from '@/data/i18n/fi/transactions.mjs';
import safeRoutes from '@/generated/site/safeRoutes.json';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  assertLanguage,
  getFormattingLocale,
  getOpenGraphLocale,
  normalizeLanguage,
} from '@/lib/i18n/config.mjs';
import {
  formatCurrency,
  formatDate,
  formatDistance,
  formatPrice,
} from '@/lib/i18n/formatters.mjs';
import { getMessage } from '@/lib/i18n/messages.mjs';
import {
  PAIRED_ROUTES,
  getDeclaredLocalizedRoutes,
  getLanguageSwitchHref,
  getRoutePath,
} from '@/lib/i18n/routes.mjs';
import {
  CART_ERROR_CODES,
  getCartErrorMessage,
  getCartLineItems,
  getCartOrderQuote,
} from '@/lib/orders/cartOrder';
import { getCartShippingOptions } from '@/lib/pricing/catalog';

function collectKeyPaths(value, prefix = '') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix];
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    return prefix ? [prefix] : [];
  }

  return entries.flatMap(([key, childValue]) =>
    collectKeyPaths(childValue, prefix ? `${prefix}.${key}` : key)
  );
}

function assertLocaleParity(fiMessages, enMessages, moduleName) {
  assert.deepEqual(
    collectKeyPaths(enMessages).sort(),
    collectKeyPaths(fiMessages).sort(),
    `${moduleName} locale modules must expose matching key paths`
  );
}

describe('locale foundation', () => {
  test('supports only the approved languages and locale mappings', () => {
    assert.deepEqual(SUPPORTED_LANGUAGES, ['fi', 'en']);
    assert.equal(DEFAULT_LANGUAGE, 'fi');
    assert.equal(normalizeLanguage('EN'), 'en');
    assert.equal(normalizeLanguage(), 'fi');
    assert.equal(assertLanguage('fi'), 'fi');
    assert.equal(getFormattingLocale('en'), 'en-FI');
    assert.equal(getOpenGraphLocale('fi'), 'fi_FI');
    assert.throws(() => normalizeLanguage('sv'), /Unsupported language/);
  });

  test('keeps every current locale module in translation-key parity', () => {
    assertLocaleParity(fiCommonMessages, enCommonMessages, 'common');
    assertLocaleParity(fiCommerceMessages, enCommerceMessages, 'commerce');
    assertLocaleParity(fiPageMessages, enPageMessages, 'pages');
    assertLocaleParity(fiProductMessages, enProductMessages, 'products');
    assertLocaleParity(fiTransactionMessages, enTransactionMessages, 'transactions');
  });

  test('throws for missing message keys instead of falling back to Finnish', () => {
    assert.equal(
      getMessage('en', 'common.notFound.title'),
      'The page you were looking for does not exist'
    );
    assert.throws(
      () => getMessage('en', 'pages.notImplementedYet'),
      /Missing en message key/
    );
  });

  test('formats dates, prices and distances using the explicit language', () => {
    assert.equal(formatDate('2026-07-17', 'fi'), '17. heinäkuuta 2026');
    assert.equal(formatDate('2026-07-17', 'en'), '17 July 2026');
    assert.equal(formatPrice(12.5, 'fi'), '12,50');
    assert.equal(formatPrice(12.5, 'en'), '12,50');
    assert.equal(formatCurrency(12.5, 'fi'), '12,50 €');
    assert.equal(formatCurrency(12.5, 'en'), '12,50 €');
    assert.equal(formatDistance(1250, 'fi'), '1,3 km');
    assert.equal(formatDistance(1250, 'en'), '1,3 km');
  });

  test('declares every final route pair and preserves functional tokens and anchors', () => {
    assert.equal(Object.keys(PAIRED_ROUTES).length, 13);
    assert.equal(getRoutePath('products', 'en'), '/en');
    assert.equal(
      getLanguageSwitchHref({
        pageKey: 'compostWorms',
        language: 'en',
        currentHref: '/tuotteet/madot#valmis-matokompostori',
      }),
      '/en/products/compost-worms#ready-to-use-worm-bin'
    );
    assert.equal(
      getLanguageSwitchHref({
        pageKey: 'review',
        language: 'en',
        currentHref: '/arvostele?token=abc123',
      }),
      '/en/review?token=abc123'
    );
    assert.equal(
      getLanguageSwitchHref({
        pageKey: 'dataRequestDownload',
        language: 'en',
        currentHref: '/tietopyynto/lataa#token=abc123',
      }),
      '/en/data-request/download#token=abc123'
    );
  });

  test('safe routes contain declared localized paths without route-group names', () => {
    for (const route of getDeclaredLocalizedRoutes()) {
      assert.equal(
        safeRoutes.includes(route),
        true,
        `safe routes should include ${route}`
      );
    }

    assert.equal(
      safeRoutes.some((route) => route.includes('(fi)')),
      false
    );
    assert.equal(
      safeRoutes.some((route) => route.includes('(en)')),
      false
    );
  });

  test('localizes operational shipping labels and cart output without changing SKUs', () => {
    const finnishShipping = getCartShippingOptions('fi');
    const englishShipping = getCartShippingOptions('en');
    assert.equal(finnishShipping[0].id, 'posti_noutopiste');
    assert.equal(englishShipping[0].id, 'posti_noutopiste');
    assert.equal(finnishShipping[0].label, 'Nouto Postista tai automaatista');
    assert.equal(englishShipping[0].label, 'Posti pickup point or parcel locker');

    const [finnishLine] = getCartLineItems([{ sku: 'worms-25', quantity: 1 }], {
      language: 'fi',
    });
    const [englishLine] = getCartLineItems([{ sku: 'worms-25', quantity: 1 }], {
      language: 'en',
    });
    assert.equal(finnishLine.sku, englishLine.sku);
    assert.match(finnishLine.label, /kompostimatoja/);
    assert.match(englishLine.label, /compost worms/);
  });

  test('uses stable cart error codes and localizes them at the boundary', () => {
    assert.throws(
      () =>
        getCartOrderQuote({
          items: [{ sku: 'worms-ready-bin-14l', quantity: 1 }],
          shippingMethod: 'nouto',
        }),
      (error) => {
        assert.equal(error.code, CART_ERROR_CODES.PREPARED_BIN_REQUIRES_WORMS);
        assert.match(getCartErrorMessage(error, 'fi'), /kompostimatojen kanssa/);
        assert.match(getCartErrorMessage(error, 'en'), /with compost worms/);
        return true;
      }
    );
  });
});
