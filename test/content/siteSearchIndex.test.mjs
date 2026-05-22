import assert from 'node:assert/strict';
import test from 'node:test';

import { createPathSearchQuery } from '@/lib/search/searchQuery.mjs';
import { getSiteSearchIndex } from '@/lib/search/siteSearchIndex.mjs';

test('site search index covers primary searchable surfaces', () => {
  const index = getSiteSearchIndex();
  const ids = new Set(index.map((item) => item.id));
  const hrefs = new Set(index.map((item) => item.href));

  assert.equal(ids.size, index.length);
  assert.ok(
    hrefs.has(
      '/opas/kompostorin-perustaminen/mika-on-matokompostointi-miksi-se-kannattaa'
    )
  );
  assert.ok(hrefs.has('/tuotteet/madot'));
  assert.ok(hrefs.has('/matolaskuri'));

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
