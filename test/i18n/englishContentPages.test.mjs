import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import { calculateWormRecommendation } from '@/lib/wormCalculator/calculateWormRecommendation.mjs';

const PROJECT_ROOT = process.cwd();
const ENGLISH_APP_ROOT = path.join(PROJECT_ROOT, 'app', '(en)', 'en');

const englishContentRoutes = new Map([
  ['/en', 'page.jsx'],
  ['/en/worm-calculator', 'worm-calculator/page.jsx'],
  [
    '/en/getting-started-with-compost-worms',
    'getting-started-with-compost-worms/page.jsx',
  ],
  ['/en/about', 'about/page.jsx'],
  ['/en/about/where-our-worms-come-from', 'about/where-our-worms-come-from/page.jsx'],
  ['/en/order-and-delivery-terms', 'order-and-delivery-terms/page.jsx'],
  ['/en/privacy', 'privacy/page.jsx'],
]);

function readEnglishSource(relativePath) {
  return fs.readFileSync(path.join(ENGLISH_APP_ROOT, relativePath), 'utf8');
}

describe('English content pages', () => {
  test('provides a page for every English content route', () => {
    for (const [route, relativePath] of englishContentRoutes) {
      assert.equal(fs.existsSync(path.join(ENGLISH_APP_ROOT, relativePath)), true, route);
    }
  });

  test('shares the unchanged calculator algorithm with English copy', () => {
    const result = calculateWormRecommendation({
      adults: 2,
      teens: 0,
      children: 1,
      toddlers: 0,
      diet: 'sekaruoka',
    });

    assert.deepEqual(result.scraps, [560, 840]);
    assert.equal(result.wormsNeeded, 700);
    assert.equal(result.wormWeightGrams, 350);
    assert.equal(result.options.halfStartWeightGrams, 175);
  });

  test('English content pages have no prohibited provider wording or placeholders', () => {
    const englishSource = [...englishContentRoutes.values()]
      .map(readEnglishSource)
      .join('\n');

    assert.doesNotMatch(englishSource, /OP Kevytyrittäjä/i);
    assert.doesNotMatch(englishSource, /TODO|translation placeholder/i);
  });
});
