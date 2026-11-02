import assert from 'node:assert/strict';
import test from 'node:test';

import generateMetadata from '@/app/(fi)/blogi/julkaisu/[slug]/generateMetadata.js';
import { getAllContentSlugs } from '@/lib/content/index.mjs';
import { CONTENT_TYPES } from '@/lib/site/constants.mjs';

test('blog post metadata uses the post title for an existing post', async () => {
  const [slug] = getAllContentSlugs({ type: CONTENT_TYPES.POST });
  const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });

  assert.equal(typeof metadata.title, 'string');
  assert.notEqual(metadata.title, '');
  assert.equal(metadata.alternates.canonical, `/blogi/julkaisu/${slug}`);
});

test('blog post metadata calls notFound for a post that does not exist', async () => {
  await assert.rejects(
    generateMetadata({ params: Promise.resolve({ slug: 'ei-ole-olemassa' }) }),
    { message: 'NEXT_NOT_FOUND' }
  );
});
