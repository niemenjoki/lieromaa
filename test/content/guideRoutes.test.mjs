import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getGuideCategorySlug,
  getGuidePath,
  isMatchingGuideCategorySlug,
} from '@/lib/content/guideRoutes.mjs';

test('guide category slug helpers build canonical guide paths', () => {
  assert.equal(
    getGuideCategorySlug('kompostorin perustaminen'),
    'kompostorin-perustaminen'
  );
  assert.equal(
    getGuidePath({
      categoryName: 'kompostin hyödyntäminen',
      guideSlug: 'milloin-matokomposti-on-valmista-miten-sita-kaytetaan',
    }),
    '/opas/kompostin-hyödyntäminen/milloin-matokomposti-on-valmista-miten-sita-kaytetaan'
  );
});

test('guide category slug matching rejects duplicate wrong-category guide URLs', () => {
  assert.equal(
    isMatchingGuideCategorySlug({
      categoryName: 'kompostin hyödyntäminen',
      categorySlug: 'kompostin-hyödyntäminen',
    }),
    true
  );
  assert.equal(
    isMatchingGuideCategorySlug({
      categoryName: 'kompostin hyödyntäminen',
      categorySlug: 'kompostin-hy%C3%B6dynt%C3%A4minen',
    }),
    true
  );
  assert.equal(
    isMatchingGuideCategorySlug({
      categoryName: 'kompostorin perustaminen',
      categorySlug: 'foo',
    }),
    false
  );
});
