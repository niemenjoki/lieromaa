import { WORM_HUNT_LENGTH, wormHuntConfig } from './config.mjs';

const TRAIL_BLUEPRINTS = Object.freeze([
  {
    path: '/',
    placement: Object.freeze({ type: 'home-hero' }),
    clue: {
      align: 'start',
      number: 1,
      title: 'Ensimmäinen mato löytyi!',
      message:
        'Lieromaahan on piiloutunut kuusi numeroitua matoa, joista jokainen kantaa yhtä kirjainta. Pidä löytämäsi kirjaimet itse tallessa ja kokoa ne numerojärjestyksessä. Niistä muodostuva kuuden kirjaimen koodi tuo kassalla pienen yllätyksen.',
      hint: 'Kaikki keittiön biojäte ei kelpaa madoille. Seuraava mato tietää, mikä kelpaa.',
    },
  },
  {
    path: '/opas/kompostorin-hoito/mita-matokompostoriin-saa-laittaa-mita-ei-saa',
    placement: Object.freeze({
      type: 'after-heading',
      headingId: '7-kertaus',
    }),
    clue: {
      align: 'end',
      number: 2,
      title: 'Toinen mato löytyi!',
      message: null,
      hint: 'Ruokalista voi olla kunnossa, vaikka arjen rytmi ei olisikaan. Seuraava mato pohtii, mitä silloin tehdään.',
    },
  },
  {
    path: '/opas/kompostorin-hoito/matokompostin-tasapaino-liikaa-vai-liian-vahan-jatetta',
    placement: Object.freeze({
      type: 'after-heading',
      headingId: 'loppusanat',
    }),
    clue: {
      align: 'end',
      number: 3,
      title: 'Kolmas mato löytyi!',
      message: null,
      hint: 'Kaikkea biojätettä ei aina tarvitse käsitellä samassa paikassa. Seuraava mato on lähtenyt tutustumaan toisenlaiseen kompostoriin.',
    },
  },
  {
    path: '/opas/lämpökompostointi/voiko-kompostimadot-laittaa-lampokompostoriin',
    placement: Object.freeze({ type: 'before-footer' }),
    clue: {
      align: 'end',
      number: 4,
      title: 'Neljäs mato löytyi!',
      message: null,
      hint: 'Valmis matokakka pitäisi saada talteen ilman, että madot lähtevät sen mukana. Seuraava mato löytyy tämän pulman läheltä.',
    },
  },
  {
    path: '/opas/kompostin-hyödyntäminen/valoerottelu-matoystavallinen-tapa-kerata-matokakka',
    placement: Object.freeze({ type: 'footer' }),
    clue: {
      align: 'end',
      number: 5,
      title: 'Viides mato löytyi!',
      message: null,
      hint: 'Kun matokakka on saatu talteen, sen matka kasvien hyödyksi voi jatkua monella tavalla. Viimeinen mato löytyy yhden niistä parista.',
    },
  },
  {
    path: '/opas/kompostin-hyödyntäminen/matotee-matokakasta-valmistus-ja-kaytto',
    placement: Object.freeze({ type: 'footer' }),
    clue: {
      align: 'end',
      number: 6,
      title: 'Kuudes ja viimeinen mato löytyi!',
      hint: null,
    },
  },
]);

function formatPercentage(value) {
  return String(value).replace('.', ',');
}

export function createWormHuntEntries(config = wormHuntConfig) {
  if (!config.enabled) {
    return Object.freeze([]);
  }

  return Object.freeze(
    TRAIL_BLUEPRINTS.map((blueprint, index) =>
      Object.freeze({
        ...blueprint,
        clue: Object.freeze({
          ...blueprint.clue,
          total: WORM_HUNT_LENGTH,
          letter: config.letters[index],
          message:
            index === WORM_HUNT_LENGTH - 1
              ? `Yhdistä kaikkien kuuden madon kirjaimet numerojärjestyksessä ja syötä valmis koodi kassalla alennuskoodikenttään. Koodilla saat ${formatPercentage(config.discountPercentage)} % alennuksen vain kompostimadoista. Alennus ei koske postikuluja eikä muita tuotteita.`
              : blueprint.clue.message,
        }),
      })
    )
  );
}

const TRAIL_ENTRIES = createWormHuntEntries();

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

export function shouldPlaceWormBeforeFooter(entry) {
  return entry?.placement?.type === 'before-footer';
}

export function shouldPlaceWormInFooter(entry) {
  return entry?.placement?.type === 'footer';
}
