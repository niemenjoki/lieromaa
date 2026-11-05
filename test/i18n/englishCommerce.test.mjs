import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import { getEnglishNavigation } from '@/lib/i18n/englishNavigation.mjs';
import { getRoutePath } from '@/lib/i18n/routes.mjs';

const PROJECT_ROOT = process.cwd();
const ENGLISH_APP_ROOT = path.join(PROJECT_ROOT, 'app', '(en)', 'en');
const englishCommerceRoutes = new Map([
  ['compostWorms', 'products/compost-worms/page.jsx'],
  ['compostFibreMix', 'products/compost-fibre-mix/page.jsx'],
  ['checkout', 'checkout/page.jsx'],
  ['cancelOrder', 'cancel-order/page.jsx'],
  ['dataRequest', 'data-request/page.jsx'],
  ['dataRequestDownload', 'data-request/download/page.jsx'],
  ['review', 'review/page.jsx'],
]);

function readSource(relativePath) {
  return fs.readFileSync(path.join(ENGLISH_APP_ROOT, relativePath), 'utf8');
}

function flattenNavigationLinks(navigation) {
  return [
    ...navigation.desktopItems.flatMap((item) => item.items ?? [item]),
    ...navigation.footerColumns.flatMap((section) => section.items),
    ...navigation.mobileSections.flatMap((section) => section.items),
  ];
}

describe('English commerce and customer-service pages', () => {
  test('provides a page for every English transactional route', () => {
    for (const [routeKey, relativePath] of englishCommerceRoutes) {
      const route = getRoutePath(routeKey, 'en');
      const fullPath = path.join(ENGLISH_APP_ROOT, relativePath);
      assert.equal(fs.existsSync(fullPath), true, route);
    }
  });

  test('routes English product links to the product-led landing page', () => {
    assert.equal(getRoutePath('products', 'en'), '/en');
  });

  test('uses the final English header order and complete four-column footer', () => {
    const navigation = getEnglishNavigation();
    assert.deepEqual(
      navigation.desktopItems.map((item) => item.label),
      ['Products', 'Worm calculator', 'About', 'More in Finnish']
    );
    assert.deepEqual(
      navigation.footerColumns.map((column) => column.heading),
      ['Shop', 'Customer service', 'About', 'More in Finnish']
    );

    const links = flattenNavigationLinks(navigation);
    for (const routeKey of [
      'products',
      'compostWorms',
      'compostFibreMix',
      'checkout',
      'cancelOrder',
      'dataRequest',
    ]) {
      if (routeKey === 'checkout') continue;
      assert.equal(
        links.some((link) => link.href === getRoutePath(routeKey, 'en')),
        true,
        routeKey
      );
    }

    const finnishLinks = links.filter((link) => link.href.includes('from=en'));
    assert.equal(finnishLinks.length > 0, true);
    for (const link of finnishLinks) {
      assert.equal(link.lang, 'fi');
      assert.equal(link.badge, 'In Finnish');
    }
  });

  test('English commerce copy has no prohibited provider wording or placeholders', () => {
    const transactions = fs.readFileSync(
      path.join(PROJECT_ROOT, 'data', 'i18n', 'en', 'transactions.mjs'),
      'utf8'
    );
    const products = fs.readFileSync(
      path.join(PROJECT_ROOT, 'data', 'i18n', 'en', 'products.mjs'),
      'utf8'
    );
    const englishRuntimeSource = [
      transactions,
      products,
      ...[...englishCommerceRoutes.values()].map(readSource),
    ].join('\n');

    assert.doesNotMatch(englishRuntimeSource, /OP Kevytyrittäjä/i);
    assert.doesNotMatch(englishRuntimeSource, /TODO|translation placeholder/i);
  });

  test('marks private utility routes for no indexing and keeps the download token in the fragment', () => {
    for (const relativePath of [
      'checkout/page.jsx',
      'cancel-order/page.jsx',
      'data-request/download/page.jsx',
      'review/page.jsx',
    ]) {
      assert.match(readSource(relativePath), /index: false/);
    }

    const downloadClient = fs.readFileSync(
      path.join(
        PROJECT_ROOT,
        'app',
        '(fi)',
        'tietopyynto',
        'lataa',
        'DownloadDataClient.jsx'
      ),
      'utf8'
    );
    assert.match(downloadClient, /globalThis\.location\.hash/);
    assert.match(downloadClient, /X-Lieromaa-Language/);
  });
});
