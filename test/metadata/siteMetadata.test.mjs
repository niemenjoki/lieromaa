import assert from 'node:assert/strict';
import test from 'node:test';

import generateBlogTagMetadata from '@/app/blogi/[tag]/sivu/[pageIndex]/generateMetadata';
import sitemap from '@/app/sitemap';
import safeRoutes from '@/generated/site/safeRoutes.json';
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
import { productCatalog } from '@/lib/products/catalog.mjs';
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

const productIndexPage = {
  canonicalUrl: '/tuotteet',
  title: 'Tuotteet | Lieromaa',
  description:
    'Lieromaan tuotteet matokompostoinnin aloittamiseen ja ylläpitoon: kompostimadot, matokompostorin aloituspakkaus ja kompostorin kuituseos.',
};

const checkoutPage = {
  canonicalUrl: '/tilaus',
  title: 'Tilaus | Lieromaa',
  description:
    'Tarkista ostoskorisi, valitse toimitustapa ja lähetä Lieromaan tuotteiden tilaus helposti yhdeltä sivulta.',
  robots: { index: false, follow: true },
};

const reviewPage = {
  title: 'Jätä arvostelu | Lieromaa',
  robots: { index: false, follow: false },
};

const dataDownloadPage = {
  title: 'Lataa tietosi | Lieromaa',
  robots: { index: false, follow: false, nocache: true },
};

const searchPage = {
  canonicalUrl: '/haku',
  title: 'Haku | Lieromaa',
  description:
    'Hae Lieromaan oppaita, tuotteita, blogijulkaisuja ja matokompostointiin liittyviä aiheita.',
  robots: { index: false, follow: true },
};

const explicitNonMetadataRoutes = new Map([
  ['/7b0d4de4-7896-4f1f-b8f4-c7d94d9bf7a8', 'analytics opt-out client redirect'],
  ['/madot', 'legacy redirect to /tuotteet/madot'],
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
    productIndexPage,
    guideHubPage,
    aboutPage,
    cancellationRequestPage,
    dataRequestPage,
    privacyPolicyPage,
    orderTermsPage,
    starterKitSetupPage,
    wormCalculatorPage,
    wormSourcePage,
    checkoutPage,
    reviewPage,
    dataDownloadPage,
    searchPage,
  ].forEach((page) => {
    const fallbackPath = page === reviewPage ? '/arvostele' : '/tietopyynto/lataa';
    addScenario(scenarios, page.canonicalUrl ?? fallbackPath, page);
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
    const categorySlug = slugifySegment(guide.category.name);

    addScenario(scenarios, `/opas/${categorySlug}/${guide.slug}`, {
      canonicalUrl: `/opas/${categorySlug}/${guide.slug}`,
      description: guide.description,
      title: guide.title,
    });
  });

  getAllGuideCategories().forEach((category) => {
    const categorySlug = slugifySegment(category);
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

test('product page metadata descriptions stay valid after dynamic offer copy', () => {
  for (const [productKey, product] of Object.entries(productCatalog)) {
    const metadata = createProductPageMetadata(productKey, product.metadata);

    assertMetadataShape(product.canonicalUrl, metadata);
  }
});

test('low-count blog tag pages are noindexed', async () => {
  const metadata = await generateBlogTagMetadata({
    params: { tag: 'lapset', pageIndex: '1' },
  });

  assert.deepEqual(metadata.robots, { index: false, follow: true });
});

test('indexable blog tag pages do not get explicit noindex metadata', async () => {
  const metadata = await generateBlogTagMetadata({
    params: { tag: 'matokompostointi', pageIndex: '1' },
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
});
