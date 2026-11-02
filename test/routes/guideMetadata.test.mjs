import assert from 'node:assert/strict';
import test from 'node:test';

import generateMetadata from '@/app/(fi)/opas/[categorySlug]/[guideSlug]/generateMetadata.js';
import { getGuideCategorySlug, getGuidePath } from '@/lib/content/guideRoutes.mjs';
import { getAllContentSlugs, getContentMetadata } from '@/lib/content/index.mjs';
import { CONTENT_TYPES } from '@/lib/site/constants.mjs';

const [guideSlug] = getAllContentSlugs({ type: CONTENT_TYPES.GUIDE });
const categoryName = getContentMetadata({ type: CONTENT_TYPES.GUIDE, slug: guideSlug })
  .category.name;
const categorySlug = getGuideCategorySlug(categoryName);

test('guide metadata uses the guide title for an existing guide', async () => {
  const metadata = await generateMetadata({
    params: Promise.resolve({ categorySlug, guideSlug }),
  });

  assert.equal(typeof metadata.title, 'string');
  assert.notEqual(metadata.title, '');
  assert.equal(metadata.alternates.canonical, getGuidePath({ categoryName, guideSlug }));
});

test('guide metadata calls notFound for a guide that does not exist', async () => {
  await assert.rejects(
    generateMetadata({
      params: Promise.resolve({ categorySlug, guideSlug: 'ei-ole-olemassa' }),
    }),
    { message: 'NEXT_NOT_FOUND' }
  );
});
