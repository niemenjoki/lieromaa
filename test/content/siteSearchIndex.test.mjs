import assert from 'node:assert/strict';
import test from 'node:test';

import { getGuidePath } from '@/lib/content/guideRoutes.mjs';
import { getAllContent } from '@/lib/content/index.mjs';
import { productCatalog } from '@/lib/products/catalog.mjs';
import { createPathSearchQuery } from '@/lib/search/searchQuery.mjs';
import { getSiteSearchIndex } from '@/lib/search/siteSearchIndex.mjs';
import { CONTENT_TYPES } from '@/lib/site/constants.mjs';
import { wormCalculatorPage } from '@/lib/site/pageRecords.mjs';

test('site search index covers primary searchable surfaces', () => {
  const index = getSiteSearchIndex();
  const ids = new Set(index.map((item) => item.id));
  const hrefs = new Set(index.map((item) => item.href));

  assert.equal(ids.size, index.length);

  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE });
  const guidePaths = new Set(
    guides.map((guide) =>
      getGuidePath({ categoryName: guide.category.name, guideSlug: guide.slug })
    )
  );
  for (const guidePath of guidePaths) {
    assert.ok(hrefs.has(guidePath), `search should include ${guidePath}`);
  }
  // A guide is listed only under its current category.
  const indexedGuidePaths = [...hrefs].filter((href) => href.startsWith('/opas/'));
  for (const guide of guides) {
    assert.deepEqual(
      indexedGuidePaths.filter((href) => href.endsWith(`/${guide.slug}`)),
      [getGuidePath({ categoryName: guide.category.name, guideSlug: guide.slug })],
      guide.slug
    );
  }

  for (const product of Object.values(productCatalog)) {
    assert.ok(hrefs.has(product.canonicalUrl), product.canonicalUrl);
  }
  assert.ok(hrefs.has(wormCalculatorPage.canonicalUrl));

  for (const item of index) {
    assert.ok(item.title, `[${item.id}] missing title`);
    assert.ok(item.description, `[${item.id}] missing description`);
    assert.ok(item.href?.startsWith('/'), `[${item.id}] href must be internal`);
    assert.ok(item.typeLabel, `[${item.id}] missing type label`);
  }
});

test('404 path search query removes route boilerplate from URLs', () => {
  assert.equal(
    createPathSearchQuery('/opas/foo/mika-on-matokompostointi-miksi-se-kannattaa'),
    'foo mika on matokompostointi miksi se kannattaa'
  );
  assert.equal(
    createPathSearchQuery('/tuotteet/matokompostin-aloituspakkaus'),
    'matokompostin aloituspakkaus'
  );
});
