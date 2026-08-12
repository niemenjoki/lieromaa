const WORM_HUNT_TOTAL = 6;

const TRAIL_ENTRIES = Object.freeze([
  Object.freeze({
    path: '/',
    placement: Object.freeze({ type: 'home-hero' }),
    clue: Object.freeze({
      align: 'start',
      number: 1,
      total: WORM_HUNT_TOTAL,
      letter: 'N',
      title: 'Ensimmäinen mato löytyi!',
      message:
        'Lieromaahan on piiloutunut kuusi numeroitua matoa, joista jokainen kantaa yhtä kirjainta. Pidä löytämäsi kirjaimet itse tallessa ja kokoa ne numerojärjestyksessä. Niistä muodostuva kuuden kirjaimen koodi tuo kassalla pienen yllätyksen.',
      hint: 'Kaikki keittiön biojäte ei kelpaa madoille. Seuraava mato tietää, mikä kelpaa.',
    }),
  }),
  Object.freeze({
    path: '/opas/kompostorin-hoito/mita-matokompostoriin-saa-laittaa-mita-ei-saa',
    placement: Object.freeze({
      type: 'after-heading',
      headingId: '6-syottotapa-ja-annoskoko',
    }),
    clue: Object.freeze({
      align: 'end',
      number: 2,
      total: WORM_HUNT_TOTAL,
      letter: 'V',
      title: 'Toinen mato löytyi!',
      message: null,
      hint: 'Ruokalista voi olla kunnossa, vaikka arjen rytmi ei olisikaan. Seuraava mato pohtii, mitä silloin tehdään.',
    }),
  }),
  Object.freeze({
    path: '/opas/kompostorin-hoito/matokompostin-tasapaino-liikaa-vai-liian-vahan-jatetta',
    placement: Object.freeze({
      type: 'after-heading',
      headingId: 'kun-biojatetta-kertyy-liikaa',
    }),
    clue: Object.freeze({
      align: 'end',
      number: 3,
      total: WORM_HUNT_TOTAL,
      letter: 'R',
      title: 'Kolmas mato löytyi!',
      message: null,
      hint: 'Kaikkea biojätettä ei aina tarvitse käsitellä samassa paikassa. Seuraava mato on lähtenyt tutustumaan toisenlaiseen kompostoriin.',
    }),
  }),
  Object.freeze({
    path: '/opas/lämpökompostointi/voiko-kompostimadot-laittaa-lampokompostoriin',
    placement: Object.freeze({
      type: 'after-heading',
      headingId: 'jalkikompostissa-madot-toimivat-yleensa-paremmin',
    }),
    clue: Object.freeze({
      align: 'end',
      number: 4,
      total: WORM_HUNT_TOTAL,
      letter: 'K',
      title: 'Neljäs mato löytyi!',
      message: null,
      hint: 'Valmis matokakka pitäisi saada talteen ilman, että madot lähtevät sen mukana. Seuraava mato löytyy tämän pulman läheltä.',
    }),
  }),
  Object.freeze({
    path: '/opas/kompostin-hyödyntäminen/valoerottelu-matoystavallinen-tapa-kerata-matokakka',
    placement: Object.freeze({
      type: 'after-heading',
      headingId: 'kayttotavat',
    }),
    clue: Object.freeze({
      align: 'end',
      number: 5,
      total: WORM_HUNT_TOTAL,
      letter: 'T',
      title: 'Viides mato löytyi!',
      message: null,
      hint: 'Kun matokakka on saatu talteen, sen matka kasvien hyödyksi voi jatkua monella tavalla. Viimeinen mato löytyy yhden niistä parista.',
    }),
  }),
  Object.freeze({
    path: '/opas/kompostin-hyödyntäminen/matotee-matokakasta-valmistus-ja-kaytto',
    placement: Object.freeze({
      type: 'after-heading',
      headingId: 'yleisimmat-virheet',
    }),
    clue: Object.freeze({
      align: 'end',
      number: 6,
      total: WORM_HUNT_TOTAL,
      letter: 'P',
      title: 'Kuudes ja viimeinen mato löytyi!',
      message:
        'Yhdistä kaikkien kuuden madon kirjaimet numerojärjestyksessä ja syötä valmis koodi kassalla alennuskoodikenttään. Koodilla saat 15 % alennuksen vain kompostimadoista. Alennus ei koske postikuluja eikä muita tuotteita.',
      hint: null,
    }),
  }),
]);

function normalizePathname(pathname) {
  const pathOnly = String(pathname ?? '')
    .trim()
    .split(/[?#]/u, 1)[0];

  if (!pathOnly.startsWith('/')) {
    return '';
  }

  let decodedPath = pathOnly;
  try {
    decodedPath = decodeURIComponent(pathOnly);
  } catch {
    // Leave malformed paths unmatched instead of throwing during rendering.
  }

  if (/^\/+$/u.test(decodedPath)) {
    return '/';
  }

  return decodedPath.replace(/\/+$/u, '');
}

export function getWormHuntEntry(pathname) {
  const normalizedPathname = normalizePathname(pathname);

  return TRAIL_ENTRIES.find((entry) => entry.path === normalizedPathname) ?? null;
}

export function getWormHuntEntries() {
  return TRAIL_ENTRIES;
}

export function shouldPlaceWormAfterHeading(entry, headingId) {
  return (
    entry?.placement?.type === 'after-heading' && entry.placement.headingId === headingId
  );
}
