import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { extractArticleHeadings } from '@/lib/content/articleHeadings.mjs';
import {
  createWormHuntConfig,
  createWormHuntDiscount,
  wormHuntConfig,
} from '@/lib/wormHunt/config.mjs';
import {
  createWormHuntEntries,
  getWormHuntEntries,
  getWormHuntEntry,
  shouldPlaceWormAfterHeading,
} from '@/lib/wormHunt/trail.server.mjs';

const ENABLED_TEST_CONFIG = createWormHuntConfig({
  enabled: true,
  code: 'NVRKTP',
  discountPercentage: 15,
});

const EXPECTED_PATHS = [
  '/',
  '/opas/kompostorin-hoito/mita-matokompostoriin-saa-laittaa-mita-ei-saa',
  '/opas/kompostorin-hoito/matokompostin-tasapaino-liikaa-vai-liian-vahan-jatetta',
  '/opas/lämpökompostointi/voiko-kompostimadot-laittaa-lampokompostoriin',
  '/opas/kompostin-hyödyntäminen/valoerottelu-matoystavallinen-tapa-kerata-matokakka',
  '/opas/kompostin-hyödyntäminen/matotee-matokakasta-valmistus-ja-kaytto',
];

const EXPECTED_HINTS = [
  'Kaikki keittiön biojäte ei kelpaa madoille. Seuraava mato tietää, mikä kelpaa.',
  'Ruokalista voi olla kunnossa, vaikka arjen rytmi ei olisikaan. Seuraava mato pohtii, mitä silloin tehdään.',
  'Kaikkea biojätettä ei aina tarvitse käsitellä samassa paikassa. Seuraava mato on lähtenyt tutustumaan toisenlaiseen kompostoriin.',
  'Valmis matokakka pitäisi saada talteen ilman, että madot lähtevät sen mukana. Seuraava mato löytyy tämän pulman läheltä.',
  'Kun matokakka on saatu talteen, sen matka kasvien hyödyksi voi jatkua monella tavalla. Viimeinen mato löytyy yhden niistä parista.',
];

test('worm hunt keeps six ordered route-specific clues without a combined code field', () => {
  const entries = createWormHuntEntries(ENABLED_TEST_CONFIG);

  assert.equal(entries.length, 6);
  assert.deepEqual(
    entries.map((entry) => entry.path),
    EXPECTED_PATHS
  );
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
    assert.equal(entry.clue.total, 6);
    assert.equal(Object.hasOwn(entry, 'code'), false);
    assert.equal(Object.hasOwn(entry.clue, 'code'), false);
  }
});

test('configured worm hunt state controls the deployed trail', () => {
  const entries = getWormHuntEntries();

  assert.equal(entries.length, wormHuntConfig.enabled ? 6 : 0);

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

test('worm hunt uses the approved hints and reveals the discount only at the end', () => {
  const entries = createWormHuntEntries(ENABLED_TEST_CONFIG);

  assert.deepEqual(
    entries.slice(0, -1).map((entry) => entry.clue.hint),
    EXPECTED_HINTS
  );
  assert.doesNotMatch(entries[0].clue.message, /(?:15\s*%|alennus)/iu);

  const finalClue = entries.at(-1).clue;
  assert.equal(finalClue.hint, null);
  assert.match(finalClue.message, /numerojärjestyksessä/iu);
  assert.match(finalClue.message, /alennuskoodikenttään/iu);
  assert.match(finalClue.message, /15\s*%/u);
  assert.match(finalClue.message, /vain kompostimadoista/iu);
  assert.match(finalClue.message, /postikuluja/iu);
  assert.match(finalClue.message, /muita tuotteita/iu);
});

test('every guide clue targets an existing heading and at least three are deep', () => {
  const guideEntries = createWormHuntEntries(ENABLED_TEST_CONFIG).filter(
    (entry) => entry.placement.type === 'after-heading'
  );
  let deepPlacementCount = 0;

  for (const entry of guideEntries) {
    const guideSlug = entry.path.split('/').at(-1);
    const source = fs.readFileSync(
      path.join(process.cwd(), 'content', 'guides', guideSlug, 'body.mdx'),
      'utf8'
    );
    const headings = extractArticleHeadings(source);
    const headingIndex = headings.findIndex(
      (heading) => heading.id === entry.placement.headingId
    );

    assert.notEqual(
      headingIndex,
      -1,
      `${entry.path} must contain heading ${entry.placement.headingId}`
    );
    assert.equal(shouldPlaceWormAfterHeading(entry, entry.placement.headingId), true);
    assert.equal(shouldPlaceWormAfterHeading(entry, 'a-different-heading'), false);

    if (headingIndex >= Math.ceil(headings.length / 2)) {
      deepPlacementCount += 1;
    }
  }

  assert.ok(deepPlacementCount >= 3);
});

test('worm hunt marker uses a native dialog without analytics or saved progress', () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), 'components', 'WormHunt', 'WormHuntSpot.jsx'),
    'utf8'
  );

  assert.match(source, /<dialog/u);
  assert.match(source, /aria-controls=\{dialogId\}/u);
  assert.match(source, /aria-expanded=\{isOpen\}/u);
  assert.match(source, /aria-haspopup="dialog"/u);
  assert.match(source, /onCancel=\{handleCancel\}/u);
  assert.match(source, /onClose=\{handleClose\}/u);
  assert.match(source, /document\.body\.style\.overflow = 'hidden'/u);
  assert.doesNotMatch(source, /localStorage|sessionStorage|trackAnalyticsEvent/u);
});
