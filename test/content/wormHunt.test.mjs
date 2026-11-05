import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import safeRoutes from '@/generated/site/safeRoutes.json';
import { extractArticleHeadings } from '@/lib/content/articleHeadings.mjs';
import {
  WORM_HUNT_LENGTH,
  createWormHuntConfig,
  createWormHuntDiscount,
  wormHuntConfig,
} from '@/lib/wormHunt/config.mjs';
import {
  createWormHuntEntries,
  getWormHuntEntries,
  getWormHuntEntry,
  shouldPlaceWormAfterHeading,
  shouldPlaceWormBeforeFooter,
  shouldPlaceWormInFooter,
} from '@/lib/wormHunt/trail.server.mjs';

const ENABLED_TEST_CONFIG = createWormHuntConfig({
  enabled: true,
  code: 'NVRKTP',
  discountPercentage: 15,
});

test('worm hunt keeps six ordered route-specific clues without a combined code field', () => {
  const entries = createWormHuntEntries(ENABLED_TEST_CONFIG);

  assert.equal(entries.length, WORM_HUNT_LENGTH);
  assert.equal(new Set(entries.map((entry) => entry.path)).size, WORM_HUNT_LENGTH);
  assert.deepEqual(
    entries.map((entry) => entry.clue.number),
    [1, 2, 3, 4, 5, 6]
  );
  assert.deepEqual(
    entries.map((entry) => entry.clue.letter),
    ['N', 'V', 'R', 'K', 'T', 'P']
  );

  for (const entry of entries) {
    assert.match(entry.clue.letter, /^[A-Z]$/u);
    assert.equal(entry.clue.total, WORM_HUNT_LENGTH);
    assert.equal(Object.hasOwn(entry, 'code'), false);
    assert.equal(Object.hasOwn(entry.clue, 'code'), false);
  }
});

test('configured worm hunt state controls the deployed trail', () => {
  const entries = getWormHuntEntries();

  assert.equal(entries.length, wormHuntConfig.enabled ? WORM_HUNT_LENGTH : 0);

  if (!wormHuntConfig.enabled) {
    assert.equal(getWormHuntEntry('/'), null);
    return;
  }

  assert.equal(entries.map((entry) => entry.clue.letter).join(''), wormHuntConfig.code);

  for (const entry of entries) {
    assert.equal(getWormHuntEntry(`${entry.path}/`), entry);
    assert.equal(getWormHuntEntry(encodeURI(entry.path)), entry);
  }
});

test('worm hunt config can replace the six letters and percentage or disable everything', () => {
  const customConfig = createWormHuntConfig({
    enabled: true,
    code: 'ABCDEF',
    discountPercentage: 12.5,
  });
  const customEntries = createWormHuntEntries(customConfig);
  const customDiscount = createWormHuntDiscount(customConfig);

  assert.deepEqual(
    customEntries.map((entry) => entry.clue.letter),
    ['A', 'B', 'C', 'D', 'E', 'F']
  );
  assert.match(customEntries.at(-1).clue.message, /12,5\s*%/u);
  assert.equal(customDiscount.value, 12.5);

  const disabledConfig = createWormHuntConfig({
    enabled: false,
    code: 'ABCDEF',
    discountPercentage: 12.5,
  });
  assert.deepEqual(createWormHuntEntries(disabledConfig), []);
  assert.equal(createWormHuntDiscount(disabledConfig), null);
});

test('worm hunt config rejects values that cannot map safely to the six placements', () => {
  assert.throws(
    () =>
      createWormHuntConfig({
        enabled: true,
        code: 'TOOLONG',
        discountPercentage: 15,
      }),
    /exactly 6 letters/u
  );
  assert.throws(
    () =>
      createWormHuntConfig({
        enabled: true,
        code: 'ABC DEF',
        discountPercentage: 15,
      }),
    /without spaces/u
  );
  assert.throws(
    () =>
      createWormHuntConfig({
        enabled: true,
        code: 'ABCDEF',
        discountPercentage: 0,
      }),
    /greater than 0/u
  );
});

test('worm hunt gives a hint on every clue but the last and reveals the discount only at the end', () => {
  const entries = createWormHuntEntries(ENABLED_TEST_CONFIG);

  for (const entry of entries.slice(0, -1)) {
    assert.ok(entry.clue.hint, `clue ${entry.clue.number} should have a hint`);
    assert.doesNotMatch(entry.clue.message ?? '', /(?:15\s*%|alennus)/iu);
  }

  const finalClue = entries.at(-1).clue;
  assert.equal(finalClue.hint, null);
  assert.match(finalClue.message, /15\s*%/u);
});

test('placement helpers follow each clue placement type', () => {
  for (const entry of createWormHuntEntries(ENABLED_TEST_CONFIG)) {
    const { type, headingId } = entry.placement;

    assert.equal(shouldPlaceWormBeforeFooter(entry), type === 'before-footer');
    assert.equal(shouldPlaceWormInFooter(entry), type === 'footer');
    assert.equal(shouldPlaceWormAfterHeading(entry, 'a-different-heading'), false);
    if (type === 'after-heading') {
      assert.equal(shouldPlaceWormAfterHeading(entry, headingId), true);
    }
  }
});

// The deployed trail must point at pages and headings that exist: otherwise a
// worm silently disappears and nobody can finish the code. Checked only while
// the hunt is enabled, so content edits are free when it is off.
test('the enabled worm hunt points at existing pages and headings', (t) => {
  const entries = getWormHuntEntries();
  if (entries.length === 0) {
    t.skip('the worm hunt is disabled');
    return;
  }

  for (const entry of entries) {
    assert.ok(safeRoutes.includes(entry.path), `${entry.path} must be a site route`);

    if (entry.placement.type !== 'after-heading') {
      continue;
    }

    const guideSlug = entry.path.split('/').at(-1);
    const source = fs.readFileSync(
      path.join(process.cwd(), 'content', 'guides', guideSlug, 'body.mdx'),
      'utf8'
    );
    const headingIds = extractArticleHeadings(source).map((heading) => heading.id);

    assert.ok(
      headingIds.includes(entry.placement.headingId),
      `${entry.path} must contain heading ${entry.placement.headingId}`
    );
  }
});
