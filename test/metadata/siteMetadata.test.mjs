import assert from 'node:assert/strict';
import test from 'node:test';

import generateBlogTagMetadata from '@/app/(fi)/blogi/[tag]/sivu/[pageIndex]/generateMetadata';
import generateGuideMetadata from '@/app/(fi)/opas/[categorySlug]/[guideSlug]/generateMetadata';
import generateGuideCategoryMetadata from '@/app/(fi)/opas/[categorySlug]/generateMetadata';
import sitemap from '@/app/sitemap';
import { englishPageDefinitions } from '@/data/pages/english.mjs';
import safeRoutes from '@/generated/site/safeRoutes.json';
import { getGuideCategorySlug } from '@/lib/content/guideRoutes.mjs';
import { HOT_COMPOSTING_GUIDES } from '@/lib/content/hotCompostingGuide.mjs';
import {
  getAllContent,
  getAllGuideCategories,
  getAllPostTags,
  getBlogPageData,
  getBlogTagPageData,
  getGuideCategoryPageData,
  getPostsByTag,
  isIndexableBlogTag,
} from '@/lib/content/index.mjs';
import { createProductPageMetadata } from '@/lib/metadata/createProductPageMetadata';
import { productCatalog, productDefinitions } from '@/lib/products/catalog.mjs';
import { CONTENT_TYPES, POSTS_PER_PAGE, SITE_URL } from '@/lib/site/constants.mjs';
import {
  aboutPage,
  blogIndexPage,
  cancellationRequestPage,
  dataRequestPage,
  guideHubPage,
  homePage,
  orderTermsPage,
  privacyPolicyPage,
  starterKitSetupPage,
  wormCalculatorPage,
  wormSourcePage,
} from '@/lib/site/pageRecords.mjs';

import { readFinnishPageMetadata } from '../helpers/pageMetadataSource.mjs';
import {
  createSkuDiscount,
  withTemporarySkuDiscounts,
} from '../helpers/skuDiscounts.mjs';

// These pages declare their metadata inside page.jsx.
const SOURCE_METADATA_PAGES = new Map([
  ['/tuotteet', 'tuotteet'],
  ['/tilaus', 'tilaus'],
  ['/arvostele', 'arvostele'],
  ['/nouto', 'nouto'],
  ['/maksa', 'maksa'],
  ['/tietopyynto/lataa', 'tietopyynto/lataa'],
  ['/haku', 'haku'],
]);

const explicitNonMetadataRoutes = new Map([
  ['/7b0d4de4-7896-4f1f-b8f4-c7d94d9bf7a8', 'analytics opt-out client redirect'],
  ['/madot', 'legacy redirect to /tuotteet/madot'],
  ['/en/products', 'legacy redirect to the English product-led landing page'],
]);

function slugifySegment(value) {
  return value.replaceAll(' ', '-');
}

function addScenario(map, path, metadata) {
  assert.equal(map.has(path), false, `Duplicate metadata scenario for ${path}`);
  map.set(path, metadata);
}

function createBlogPageScenario(pageIndex, routePath) {
  const pageData = getBlogPageData(pageIndex);

  return {
    canonicalUrl: pageData.pagePath,
    description: pageData.description,
    title: pageData.pageName,
    routePath,
  };
}

function collectMetadataScenarios() {
  const scenarios = new Map();
  const posts = getAllContent({ type: CONTENT_TYPES.POST });
  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE });

  [
    homePage,
    blogIndexPage,
    guideHubPage,
    aboutPage,
    cancellationRequestPage,
    dataRequestPage,
    privacyPolicyPage,
    orderTermsPage,
    starterKitSetupPage,
    wormCalculatorPage,
    wormSourcePage,
  ].forEach((page) => {
    addScenario(scenarios, page.canonicalUrl, page);
  });

  for (const [routePath, routeDirectory] of SOURCE_METADATA_PAGES) {
    addScenario(scenarios, routePath, readFinnishPageMetadata(routeDirectory));
  }

  englishPageDefinitions.forEach((page) => {
    addScenario(scenarios, page.canonicalUrl, page);
  });

  addScenario(scenarios, '/blogi/sivu/1', createBlogPageScenario(1, '/blogi/sivu/1'));

  Object.values(productCatalog).forEach((product) => {
    addScenario(scenarios, product.canonicalUrl, product.metadata);
  });

  posts.forEach((post) => {
    addScenario(scenarios, `/blogi/julkaisu/${post.slug}`, {
      canonicalUrl: `/blogi/julkaisu/${post.slug}`,
      description: post.description,
      title: post.title,
    });
  });

  guides.forEach((guide) => {
    const categorySlug = getGuideCategorySlug(guide.category.name);

    addScenario(scenarios, `/opas/${categorySlug}/${guide.slug}`, {
      canonicalUrl: `/opas/${categorySlug}/${guide.slug}`,
      description: guide.description,
      title: guide.seoTitle ?? guide.title,
    });
  });

  getAllGuideCategories().forEach((category) => {
    const categorySlug = getGuideCategorySlug(category);
    const pageData = getGuideCategoryPageData(categorySlug);

    addScenario(scenarios, pageData.pagePath, {
      canonicalUrl: pageData.pagePath,
      description: pageData.description,
      title: pageData.title,
    });
  });

  getAllPostTags().forEach((tag) => {
    const tagSlug = slugifySegment(tag);
    const { numPages } = getPostsByTag(tagSlug, 1, POSTS_PER_PAGE);

    for (let pageIndex = 1; pageIndex <= numPages; pageIndex += 1) {
      const pageData = getBlogTagPageData({ tag: tagSlug, pageIndex });
      const tagPosts = getPostsByTag(tagSlug, pageIndex, POSTS_PER_PAGE);

      addScenario(scenarios, pageData.pagePath, {
        canonicalUrl: pageData.pagePath,
        description: pageData.description,
        title: pageData.title,
        ...(!isIndexableBlogTag(tagPosts.total)
          ? { robots: { index: false, follow: true } }
          : {}),
      });
    }
  });

  const blogListPageCount = Math.ceil(posts.length / POSTS_PER_PAGE);
  for (let pageIndex = 2; pageIndex <= blogListPageCount; pageIndex += 1) {
    const pageData = getBlogPageData(pageIndex);
    addScenario(scenarios, pageData.pagePath, {
      canonicalUrl: pageData.pagePath,
      description: pageData.description,
      title: pageData.pageName,
    });
  }

  return scenarios;
}

function getCanonical(metadata) {
  return metadata.canonicalUrl ?? metadata.alternates?.canonical;
}

function isNoindex(metadata) {
  return metadata.robots?.index === false;
}

function assertMetadataShape(path, metadata) {
  assert.ok(metadata.title, `[${path}] missing title`);
  assert.ok(metadata.title.length <= 70, `[${path}] title is too long`);

  if (isNoindex(metadata)) {
    return;
  }

  assert.ok(metadata.description, `[${path}] missing description`);
  assert.ok(getCanonical(metadata), `[${path}] missing canonical URL`);
  assert.ok(
    metadata.description.length <= 160,
    `[${path}] description is too long (${metadata.description.length})`
  );
}

test('every site route is covered by title and metadata expectations', () => {
  const scenarios = collectMetadataScenarios();
  const uncoveredRoutes = safeRoutes.filter(
    (route) => !scenarios.has(route) && !explicitNonMetadataRoutes.has(route)
  );
  const staleScenarios = [...scenarios.keys()].filter(
    (route) => !safeRoutes.includes(route)
  );

  assert.deepEqual(uncoveredRoutes, []);
  assert.deepEqual(staleScenarios, []);

  for (const [path, metadata] of scenarios) {
    assertMetadataShape(path, metadata);
  }
});

function assertProductDescription(product, metadata, label) {
  const { length } = metadata.description;

  assert.ok(
    length >= 110 && length <= 160,
    `[${product.canonicalUrl}] ${label}: description must be 110-160 characters (${length})`
  );
  assert.ok(
    metadata.description.startsWith(product.metadata.description),
    `[${product.canonicalUrl}] ${label}: the sale text may only be appended`
  );
  assertMetadataShape(product.canonicalUrl, metadata);
}

test('product page descriptions stay within 110-160 characters with and without a sale', () => {
  const now = new Date('2026-07-15T10:00:00Z');
  const saleScenarios = [
    ['one end date', () => '2026-07-21'],
    ['a different end date per SKU', (index) => `2026-07-${String(20 + index)}`],
  ];

  for (const [productKey, product] of Object.entries(productCatalog)) {
    assertProductDescription(
      product,
      createProductPageMetadata(productKey, product.metadata, { now }),
      'no sale'
    );

    const skus = productDefinitions[productKey].variantSkus;
    for (const [label, getValidUntil] of saleScenarios) {
      const sales = Object.fromEntries(
        skus.map((sku, index) => [
          sku,
          createSkuDiscount({
            validFrom: '2026-07-13',
            validUntil: getValidUntil(index),
          }),
        ])
      );

      withTemporarySkuDiscounts(sales, () => {
        const metadata = createProductPageMetadata(productKey, product.metadata, { now });

        assertProductDescription(product, metadata, `sale with ${label}`);
      });
    }
  }
});

function findBlogTag(indexable) {
  return getAllPostTags()
    .map(slugifySegment)
    .find(
      (tagSlug) =>
        isIndexableBlogTag(getPostsByTag(tagSlug, 1, POSTS_PER_PAGE).total) === indexable
    );
}

test('low-count blog tag pages are noindexed', async (t) => {
  const tagSlug = findBlogTag(false);
  if (!tagSlug) {
    t.skip('every blog tag currently has enough posts to be indexed');
    return;
  }

  const metadata = await generateBlogTagMetadata({
    params: { tag: tagSlug, pageIndex: '1' },
  });

  assert.deepEqual(metadata.robots, { index: false, follow: true });
});

test('indexable blog tag pages do not get explicit noindex metadata', async (t) => {
  const tagSlug = findBlogTag(true);
  if (!tagSlug) {
    t.skip('no blog tag currently has enough posts to be indexed');
    return;
  }

  const metadata = await generateBlogTagMetadata({
    params: { tag: tagSlug, pageIndex: '1' },
  });

  assert.equal(metadata.robots, undefined);
});

test('sitemap excludes low-count blog tag pages', async () => {
  const sitemapPaths = new Set(
    (await sitemap()).map(({ url }) => url.replace(SITE_URL, ''))
  );

  getAllPostTags().forEach((tag) => {
    const tagSlug = slugifySegment(tag);
    const { total } = getPostsByTag(tagSlug, 1, POSTS_PER_PAGE);
    const tagPath = `/blogi/${tagSlug}/sivu/1`;

    assert.equal(sitemapPaths.has(tagPath), isIndexableBlogTag(total), tagPath);
  });

  assert.equal(
    sitemapPaths.has(starterKitSetupPage.canonicalUrl),
    false,
    'archived starter-kit setup guide should be excluded from the sitemap'
  );
});

test('hot composting category metadata has correct social copy and main image', async () => {
  const metadata = await generateGuideCategoryMetadata({
    params: { categorySlug: 'lämpökompostointi' },
  });
  const pageData = getGuideCategoryPageData('lämpökompostointi');
  const mainGuide = getAllContent({ type: CONTENT_TYPES.GUIDE }).find(
    (guide) => guide.slug === HOT_COMPOSTING_GUIDES[0].slug
  );
  const expectedTitle = pageData.title;
  const expectedDescription = pageData.description;
  const expectedAlt = mainGuide.image.alt;

  assert.equal(metadata.title, expectedTitle);
  assert.equal(metadata.description, expectedDescription);
  assert.equal(metadata.alternates.canonical, '/opas/lämpökompostointi');
  assert.equal(metadata.openGraph.title, expectedTitle);
  assert.equal(metadata.openGraph.description, expectedDescription);
  assert.equal(metadata.openGraph.images[0].alt, expectedAlt);
  assert.equal(metadata.twitter.title, expectedTitle);
  assert.equal(metadata.twitter.description, expectedDescription);
  assert.equal(metadata.twitter.images[0].alt, expectedAlt);
});

test('hot composting article social metadata follows each page main image', async () => {
  for (const { slug } of HOT_COMPOSTING_GUIDES) {
    const guide = getAllContent({ type: CONTENT_TYPES.GUIDE }).find(
      (candidate) => candidate.slug === slug
    );
    const metadata = await generateGuideMetadata({
      params: {
        categorySlug: 'lämpökompostointi',
        guideSlug: slug,
      },
    });

    assert.equal(metadata.alternates.canonical, `/opas/lämpökompostointi/${slug}`);
    assert.equal(metadata.openGraph.images[0].url, guide.image.url);
    assert.equal(metadata.openGraph.images[0].alt, guide.image.alt);
    assert.equal(metadata.twitter.images[0].url, guide.image.url);
    assert.equal(metadata.twitter.images[0].alt, guide.image.alt);
  }
});
