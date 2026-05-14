import assert from 'node:assert/strict';
import test from 'node:test';

import safeRoutes from '@/generated/site/safeRoutes.json';
import {
  getAllContent,
  getAllGuideCategories,
  getAllPostTags,
  getBlogPageData,
  getBlogTagPageData,
  getGuideCategoryPageData,
  getPostsByTag,
} from '@/lib/content/index.mjs';
import { createProductPageMetadata } from '@/lib/metadata/createProductPageMetadata';
import { productCatalog } from '@/lib/products/catalog.mjs';
import { CONTENT_TYPES, POSTS_PER_PAGE } from '@/lib/site/constants.mjs';
import {
  aboutPage,
  blogIndexPage,
  guideHubPage,
  homePage,
  orderTermsPage,
  privacyPolicyPage,
  starterKitSetupPage,
  wormCalculatorPage,
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
    privacyPolicyPage,
    orderTermsPage,
    starterKitSetupPage,
    wormCalculatorPage,
    checkoutPage,
    reviewPage,
  ].forEach((page) => addScenario(scenarios, page.canonicalUrl ?? '/arvostele', page));

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

      addScenario(scenarios, pageData.pagePath, {
        canonicalUrl: pageData.pagePath,
        description: pageData.description,
        title: pageData.title,
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
