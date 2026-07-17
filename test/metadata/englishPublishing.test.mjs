import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import { GET as getRss } from '@/app/rss/route.js';
import sitemap from '@/app/sitemap';
import {
  englishFunctionalPagePaths,
  englishIndexablePageDefinitions,
  englishPageDefinitions,
  englishRedirectPaths,
} from '@/data/pages/english.mjs';
import safeRoutes from '@/generated/site/safeRoutes.json';
import {
  ANALYTICS_EXCLUDED_PATHS,
  isAnalyticsExcludedPath,
} from '@/lib/analytics/pathPolicy.mjs';
import { PAIRED_ROUTES, getLanguageAlternatesForPath } from '@/lib/i18n/routes.mjs';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import { createPageMetadata } from '@/lib/metadata/createPageMetadata';
import { getSiteSearchIndex } from '@/lib/search/siteSearchIndex.mjs';
import { SITE_URL } from '@/lib/site/constants.mjs';
import { createProductStructuredData } from '@/lib/structuredData/createProductStructuredData';
import { createSiteStructuredData } from '@/lib/structuredData/createSiteStructuredData';

function getGraphNode(structuredData, type) {
  return structuredData['@graph'].find((node) => node['@type'] === type);
}

function toOfferList(productNode) {
  return Array.isArray(productNode.offers) ? productNode.offers : [productNode.offers];
}

describe('English publishing integration', () => {
  test('publishes reciprocal alternates only for true Finnish and English pairs', () => {
    for (const pair of Object.values(PAIRED_ROUTES)) {
      const expectedLanguages = {
        'fi-FI': pair.fi,
        'en-FI': pair.en,
      };
      const finnishMetadata = createPageMetadata({
        title: 'Finnish test page',
        description: 'Finnish metadata test description.',
        canonicalUrl: pair.fi,
      });
      const englishMetadata = createLocalizedPageMetadata({
        language: 'en',
        title: 'English test page',
        description: 'English metadata test description.',
        canonicalUrl: pair.en,
      });

      assert.deepEqual(getLanguageAlternatesForPath(pair.fi), expectedLanguages);
      assert.deepEqual(finnishMetadata.alternates.languages, expectedLanguages);
      assert.deepEqual(englishMetadata.alternates.languages, expectedLanguages);
      assert.deepEqual(finnishMetadata.openGraph.alternateLocale, ['en_FI']);
      assert.deepEqual(englishMetadata.openGraph.alternateLocale, ['fi_FI']);
      assert.equal(finnishMetadata.alternates.canonical, pair.fi);
      assert.equal(englishMetadata.alternates.canonical, pair.en);
    }

    for (const canonicalUrl of ['/en/getting-started-with-compost-worms']) {
      const metadata = createLocalizedPageMetadata({
        language: 'en',
        title: 'English standalone page',
        description: 'English standalone metadata description.',
        canonicalUrl,
      });

      assert.equal(metadata.alternates.languages, undefined);
      assert.equal(metadata.openGraph.alternateLocale, undefined);
    }
  });

  test('covers every final English route in safe routes and metadata records', () => {
    const metadataPaths = new Set(
      englishPageDefinitions.map((page) => page.canonicalUrl)
    );

    assert.equal(metadataPaths.size, englishPageDefinitions.length);
    for (const route of safeRoutes.filter((candidate) => candidate.startsWith('/en'))) {
      if (englishRedirectPaths.includes(route)) continue;
      assert.equal(metadataPaths.has(route), true, route);
    }
  });

  test('includes only indexable English routes in the sitemap with source-backed dates', async () => {
    const sitemapByPath = new Map(
      (await sitemap()).map((entry) => [entry.url.replace(SITE_URL, ''), entry])
    );

    for (const page of englishIndexablePageDefinitions) {
      assert.equal(sitemapByPath.has(page.canonicalUrl), true, page.canonicalUrl);
      assert.equal(
        sitemapByPath.get(page.canonicalUrl).lastModified,
        page.updatedAt,
        page.canonicalUrl
      );
    }

    for (const pathName of englishFunctionalPagePaths) {
      assert.equal(sitemapByPath.has(pathName), false, pathName);
    }
  });

  test('builds English product schema from localized copy and shared offers', () => {
    for (const productKey of ['worms', 'compostChow']) {
      const englishData = createProductStructuredData(productKey, 'en');
      const finnishData = createProductStructuredData(productKey, 'fi');
      const englishPage = getGraphNode(englishData, 'WebPage');
      const finnishPage = getGraphNode(finnishData, 'WebPage');
      const englishProduct = getGraphNode(englishData, 'Product');
      const finnishProduct = getGraphNode(finnishData, 'Product');
      const englishOffers = toOfferList(englishProduct);
      const finnishOffers = toOfferList(finnishProduct);

      assert.equal(englishPage.inLanguage, 'en');
      assert.match(englishPage.url, /^https:\/\/www\.lieromaa\.fi\/en\/products\//);
      assert.equal(finnishPage.inLanguage, 'fi');
      assert.match(finnishPage.url, /^https:\/\/www\.lieromaa\.fi\/tuotteet\//);
      assert.equal(englishProduct.inLanguage, 'en');
      assert.equal(finnishProduct.inLanguage, 'fi');
      assert.deepEqual(
        englishOffers.map((offer) => offer.price),
        finnishOffers.map((offer) => offer.price)
      );
      assert.match(
        englishOffers[0].hasMerchantReturnPolicy.additionalProperty[0].value,
        /I will handle any problems with the product or delivery separately through customer service\./
      );
      assert.match(
        finnishOffers[0].hasMerchantReturnPolicy.additionalProperty[0].value,
        /Jos tuotteessa tai toimituksessa on virhe, asia käsitellään erikseen asiakaspalvelun kautta\./
      );

      for (const offer of englishOffers) {
        assert.equal(offer.priceCurrency, 'EUR');
        assert.equal(offer.shippingDetails.shippingDestination.addressCountry, 'FI');
        assert.match(offer.url, /^https:\/\/www\.lieromaa\.fi\/en\/products\//);
        assert.equal(
          offer.hasMerchantReturnPolicy.additionalProperty[0].name,
          'Cancellation rights'
        );
      }

      for (const review of englishProduct.review ?? []) {
        assert.ok(['fi', 'en'].includes(review.inLanguage));
      }
    }
  });

  test('declares bilingual customer support in the English site schema', () => {
    const organization = getGraphNode(createSiteStructuredData('en'), 'Organization');
    assert.deepEqual(organization.contactPoint.availableLanguage, ['fi', 'en']);
  });

  test('keeps search and RSS Finnish-only', async () => {
    const searchIndex = getSiteSearchIndex();
    assert.equal(
      searchIndex.some((item) => item.href.startsWith('/en')),
      false
    );

    const rssResponse = await getRss();
    const rss = await rssResponse.text();
    assert.match(rss, /<language>fi<\/language>/);
    assert.doesNotMatch(rss, /https:\/\/www\.lieromaa\.fi\/en(?:\/|<)/);
  });

  test('excludes both private data-download paths from analytics without a language field', () => {
    assert.deepEqual(ANALYTICS_EXCLUDED_PATHS, [
      '/tietopyynto/lataa',
      '/en/data-request/download',
    ]);
    for (const pathName of ANALYTICS_EXCLUDED_PATHS) {
      assert.equal(isAnalyticsExcludedPath(pathName), true);
    }
    assert.equal(isAnalyticsExcludedPath('/en/products/compost-worms'), false);

    const analyticsSource = fs.readFileSync(
      path.join(process.cwd(), 'components', 'Analytics', 'FirstPartyAnalytics.jsx'),
      'utf8'
    );
    assert.match(analyticsSource, /path: view\.path/);
    assert.doesNotMatch(analyticsSource, /language:\s*(?:view\.|['"](?:fi|en)['"])/);
  });
});
