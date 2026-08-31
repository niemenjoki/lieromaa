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
  test('provides the English transactional routes with explicit metadata', () => {
    for (const [routeKey, relativePath] of englishCommerceRoutes) {
      const route = getRoutePath(routeKey, 'en');
      const fullPath = path.join(ENGLISH_APP_ROOT, relativePath);
      assert.equal(fs.existsSync(fullPath), true, route);

      const source = readSource(relativePath);
      assert.match(source, /const language = ['"]en['"]/);
      assert.match(source, new RegExp(`getRoutePath\\(['\"]${routeKey}['\"]`));
      assert.match(source, /createLocalizedPageMetadata\(pageMetadata\)/);
      assert.match(source, /title:/);
      assert.match(source, /description:/);
    }
  });

  test('redirects the retired English products URL to the product-led landing page', () => {
    const source = readSource('products/page.jsx');
    assert.match(source, /permanentRedirect\(['"]\/en['"]\)/);
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

  test('contains the delivery and explicit Stripe-or-invoice payment choices with no prohibited provider wording', () => {
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

    assert.match(englishRuntimeSource, /Delivery within Finland only/);
    assert.match(
      englishRuntimeSource,
      /I deliver to addresses and Posti pickup points in Finland\. I do not ship abroad\. Local pickup is available in Järvenpää\./
    );
    assert.match(transactions, /Pay now with MobilePay or a card/);
    assert.match(transactions, /Pay by email invoice after dispatch or collection/);
    assert.match(
      transactions,
      /I send the invoice by email after handing your order to Posti/
    );
    assert.match(transactions, /submitInvoice: ['"]Place order['"]/);
    assert.match(transactions, /submitStripe: ['"]Continue to payment['"]/);
    assert.match(
      transactions,
      /steps: Object\.freeze\(\['Cart', 'Delivery', 'Details', 'Payment', 'Confirmation'\]\)/
    );
    assert.match(transactions, /order details were restored for this browser session/);
    assert.doesNotMatch(englishRuntimeSource, /OP Kevytyrittäjä/i);
    assert.doesNotMatch(englishRuntimeSource, /TODO|translation placeholder/i);
  });

  test('keeps English-only checkout guidance out of the Finnish checkout', () => {
    const checkoutSource = fs.readFileSync(
      path.join(PROJECT_ROOT, 'app', '(fi)', 'tilaus', 'CheckoutPageClient.jsx'),
      'utf8'
    );
    const finnishTransactions = fs.readFileSync(
      path.join(PROJECT_ROOT, 'data', 'i18n', 'fi', 'transactions.mjs'),
      'utf8'
    );

    assert.match(
      checkoutSource,
      /language === ['"]en['"] \? \([\s\S]*copy\.deliveryNoticeHeading/
    );
    assert.match(
      checkoutSource,
      /language === ['"]en['"] \? \([\s\S]*copy\.invoiceTimingLocal/
    );
    assert.match(
      finnishTransactions,
      /voit käyttää['"],\s*cancellationLink: ['"]peruuttamisilmoituksen lomaketta['"]/
    );
    assert.match(
      finnishTransactions,
      /steps: Object\.freeze\(\['Kori', 'Toimitus', 'Tiedot', 'Maksu', 'Vahvistus'\]\)/
    );
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

    const downloadSource = readSource('data-request/download/page.jsx');
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
    assert.match(downloadSource, /never\s+sent as a URL query parameter/);
    assert.match(downloadClient, /globalThis\.location\.hash/);
    assert.match(downloadClient, /X-Lieromaa-Language/);
  });

  test('renders original Finnish reviews after English reviews with a visible language badge', () => {
    const reviewSource = fs.readFileSync(
      path.join(
        PROJECT_ROOT,
        'app',
        '(fi)',
        'tuotteet',
        'ProductReviewsSectionClient.jsx'
      ),
      'utf8'
    );
    const reviewServerSource = fs.readFileSync(
      path.join(PROJECT_ROOT, 'app', '(fi)', 'tuotteet', 'ProductReviewsSection.jsx'),
      'utf8'
    );
    const productCopy = fs.readFileSync(
      path.join(PROJECT_ROOT, 'data', 'i18n', 'en', 'products.mjs'),
      'utf8'
    );

    assert.match(reviewServerSource, /left\.language === ['"]en['"] \? -1 : 1/);
    assert.match(reviewSource, /review\.language === ['"]fi['"]/);
    assert.match(
      reviewSource,
      /lang=\{language === ['"]en['"] && isFinnishReview \? ['"]fi['"] : undefined\}/
    );
    assert.match(productCopy, /finnishBadge: ['"]In Finnish['"]/);
    assert.match(productCopy, /Reviews are shown in their original language\./);
  });
});
