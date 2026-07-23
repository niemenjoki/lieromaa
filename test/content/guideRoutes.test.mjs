import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getGuideCategoryLabel,
  getGuideCategoryNameFromSlug,
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
  assert.equal(getGuideCategorySlug('lämpökompostointi'), 'lämpökompostointi');
  assert.equal(
    getGuideCategoryLabel('kompostorin perustaminen'),
    'Matokompostorin perustaminen'
  );
  assert.equal(getGuideCategoryLabel('kompostorin hoito'), 'Matokompostorin hoito');
  assert.equal(
    getGuideCategoryLabel('kompostin hyödyntäminen'),
    'Matokompostin hyödyntäminen'
  );
  assert.equal(getGuideCategoryLabel('lämpökompostointi'), 'Lämpökompostointi');
  assert.equal(getGuideCategoryNameFromSlug('kompostorin-hoito'), 'kompostorin hoito');
  assert.equal(
    getGuideCategoryNameFromSlug('l%C3%A4mp%C3%B6kompostointi'),
    'lämpökompostointi'
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
      categoryName: 'kompostin hyödyntäminen',
      categorySlug: 'matokakan-hyödyntäminen',
    }),
    false
  );
  assert.equal(
    isMatchingGuideCategorySlug({
      categoryName: 'kompostorin perustaminen',
      categorySlug: 'foo',
    }),
    false
  );
  assert.equal(
    isMatchingGuideCategorySlug({
      categoryName: 'lämpökompostointi',
      categorySlug: 'l%C3%A4mp%C3%B6kompostointi',
    }),
    true
  );
});
