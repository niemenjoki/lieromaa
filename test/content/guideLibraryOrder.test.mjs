import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  getLatestGuide,
  orderGuidesForLibrary,
} from '../../lib/content/guideLibraryOrder.mjs';
import { GUIDE_CATEGORIES } from '../../lib/site/constants.mjs';

function createGuide({ categoryName, pagePosition, title, updatedAt }) {
  return {
    category: {
      name: categoryName,
      pagePosition,
    },
    publishedAt: '2025-01-01',
    title,
    updatedAt,
  };
}

describe('guide library order', () => {
  const guides = [
    createGuide({
      categoryName: GUIDE_CATEGORIES[2],
      pagePosition: 0,
      title: 'Hyödyntäminen ensin omassa osiossaan',
      updatedAt: '2030-01-01',
    }),
    createGuide({
      categoryName: GUIDE_CATEGORIES[0],
      pagePosition: 2,
      title: 'Perustaminen kolmas',
      updatedAt: '2028-01-01',
    }),
    createGuide({
      categoryName: GUIDE_CATEGORIES[1],
      pagePosition: 1,
      title: 'Hoito toinen',
      updatedAt: '2027-01-01',
    }),
    createGuide({
      categoryName: GUIDE_CATEGORIES[0],
      pagePosition: 0,
      title: 'Perustaminen ensimmäinen',
      updatedAt: '2025-01-01',
    }),
    createGuide({
      categoryName: GUIDE_CATEGORIES[1],
      pagePosition: 0,
      title: 'Hoito ensimmäinen',
      updatedAt: '2026-01-01',
    }),
    createGuide({
      categoryName: GUIDE_CATEGORIES[3],
      pagePosition: 0,
      title: 'Lämpökompostointi viimeisenä',
      updatedAt: '2024-01-01',
    }),
  ];

  it('keeps the four guide categories in their defined editorial order', () => {
    assert.deepEqual(GUIDE_CATEGORIES, [
      'kompostorin perustaminen',
      'kompostorin hoito',
      'kompostin hyödyntäminen',
      'lämpökompostointi',
    ]);
  });

  it('groups guides by the defined category order and then by pagePosition', () => {
    assert.deepEqual(
      orderGuidesForLibrary(guides).map((guide) => guide.title),
      [
        'Perustaminen ensimmäinen',
        'Perustaminen kolmas',
        'Hoito ensimmäinen',
        'Hoito toinen',
        'Hyödyntäminen ensin omassa osiossaan',
        'Lämpökompostointi viimeisenä',
      ]
    );
  });

  it('calculates the latest guide independently from editorial display order', () => {
    assert.equal(getLatestGuide(guides)?.title, 'Hyödyntäminen ensin omassa osiossaan');
  });
});
