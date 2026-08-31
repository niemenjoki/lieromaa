import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import { calculateWormRecommendation } from '@/lib/wormCalculator/calculateWormRecommendation.mjs';

const PROJECT_ROOT = process.cwd();
const ENGLISH_APP_ROOT = path.join(PROJECT_ROOT, 'app', '(en)', 'en');

const englishContentRoutes = new Map([
  ['/en', 'page.jsx'],
  ['/en/worm-calculator', 'worm-calculator/page.jsx'],
  [
    '/en/getting-started-with-compost-worms',
    'getting-started-with-compost-worms/page.jsx',
  ],
  ['/en/about', 'about/page.jsx'],
  ['/en/about/where-our-worms-come-from', 'about/where-our-worms-come-from/page.jsx'],
  ['/en/order-and-delivery-terms', 'order-and-delivery-terms/page.jsx'],
  ['/en/privacy', 'privacy/page.jsx'],
]);

function readEnglishSource(relativePath) {
  return fs.readFileSync(path.join(ENGLISH_APP_ROOT, relativePath), 'utf8');
}

describe('English content pages', () => {
  test('provides the English content routes with self-canonical metadata', () => {
    for (const [route, relativePath] of englishContentRoutes) {
      assert.equal(fs.existsSync(path.join(ENGLISH_APP_ROOT, relativePath)), true, route);
      const source = readEnglishSource(relativePath);

      if (route === '/en') {
        assert.match(source, /canonicalUrl: getRoutePath\(['"]products['"], language\)/);
        assert.match(source, /const language = ['"]en['"]/);
      } else {
        assert.match(source, new RegExp(`canonicalUrl: ['\"]${route}['\"]`));
        assert.match(source, /language: ['"]en['"]/);
      }
      assert.match(source, /title:/);
      assert.match(source, /description:/);
      assert.match(source, /createLocalizedPageMetadata\(pageMetadata\)/);
    }
  });

  test('implements the tab-scoped Finnish-content notice and exact customer copy', () => {
    const noticeSource = fs.readFileSync(
      path.join(
        PROJECT_ROOT,
        'components',
        'FinnishContentLanguageNotice',
        'FinnishContentLanguageNotice.jsx'
      ),
      'utf8'
    );
    const commonSource = fs.readFileSync(
      path.join(PROJECT_ROOT, 'data', 'i18n', 'en', 'common.mjs'),
      'utf8'
    );

    assert.match(noticeSource, /sessionStorage/);
    assert.match(noticeSource, /searchParams\.get\('from'\) === 'en'/);
    assert.match(
      commonSource,
      /You are now viewing content that is available only in Finnish\./
    );
    assert.match(commonSource, /Back to the English shop/);
  });

  test('shares the unchanged calculator algorithm with English copy', () => {
    const result = calculateWormRecommendation({
      adults: 2,
      teens: 0,
      children: 1,
      toddlers: 0,
      diet: 'sekaruoka',
    });

    assert.deepEqual(result.scraps, [560, 840]);
    assert.equal(result.wormsNeeded, 700);
    assert.equal(result.wormWeightGrams, 350);
    assert.equal(result.options.halfStartWeightGrams, 175);
  });

  test('contains complete legal Stripe and invoice language with no prohibited provider wording', () => {
    const terms = readEnglishSource('order-and-delivery-terms/page.jsx');
    const privacy = readEnglishSource('privacy/page.jsx');
    const englishSource = [...englishContentRoutes.values()]
      .map(readEnglishSource)
      .join('\n');

    assert.match(
      terms,
      /At checkout you can either pay on Stripe’s secure hosted payment page or/
    );
    assert.match(terms, /MobilePay and payment\s+cards are supported/);
    assert.match(terms, /choose an email invoice after dispatch or collection/);
    assert.match(terms, /The payment term is 14 days/);
    assert.match(terms, /Delivery within Finland only/);
    assert.match(privacy, /Invoicing, payments and accounting/);
    assert.match(privacy, /Temporary draft for an order proceeding to Stripe/);
    assert.match(privacy, /sessionStorage for up to one hour/);
    assert.doesNotMatch(englishSource, /OP Kevytyrittäjä/i);
    assert.doesNotMatch(englishSource, /TODO|translation placeholder/i);
  });

  test('includes the required landing and getting-started sections', () => {
    const landing = readEnglishSource('page.jsx');
    const gettingStarted = readEnglishSource(
      'getting-started-with-compost-worms/page.jsx'
    );

    for (const heading of [
      'Compost worms and worm-composting supplies in Finland',
      'Products',
      'How ordering works',
      'Why buy from Lieromaa',
    ]) {
      assert.match(landing, new RegExp(heading));
    }

    for (const heading of [
      'Which instructions apply to your order?',
      'The first 48 hours',
      'First feeding and the first four weeks',
      'Food essentials',
      'Moisture, smell, temperature and worms trying to escape',
      'Basic corrective actions',
      'Contact and next actions',
    ]) {
      assert.match(gettingStarted, new RegExp(heading));
    }
  });

  test('reuses Finnish page styles for equivalent translated pages', () => {
    const styleImports = new Map([
      ['page.jsx', '@/app/(fi)/tuotteet/ProductPage.module.css'],
      ['about/page.jsx', '@/app/(fi)/tietoa/Tietoa.module.css'],
      [
        'about/where-our-worms-come-from/page.jsx',
        '@/app/(fi)/tietoa/mista-lieromaan-madot-tulevat/WormSource.module.css',
      ],
      [
        'order-and-delivery-terms/page.jsx',
        '@/app/(fi)/tilausehdot/Tilausehdot.module.css',
      ],
      ['privacy/page.jsx', '@/app/(fi)/tietosuoja/Tietosuoja.module.css'],
    ]);

    for (const [relativePath, styleImport] of styleImports) {
      assert.equal(
        readEnglishSource(relativePath).includes(styleImport),
        true,
        relativePath
      );
    }
  });
});
