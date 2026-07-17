import {
  LANGUAGE_LOCALES,
  OPEN_GRAPH_LOCALES,
  SUPPORTED_LANGUAGES,
  assertLanguage,
} from './config.mjs';

export const PAIRED_ROUTES = Object.freeze({
  products: Object.freeze({ fi: '/tuotteet', en: '/en' }),
  compostWorms: Object.freeze({
    fi: '/tuotteet/madot',
    en: '/en/products/compost-worms',
  }),
  compostFibreMix: Object.freeze({
    fi: '/tuotteet/kompostorin-kuituseos',
    en: '/en/products/compost-fibre-mix',
  }),
  wormCalculator: Object.freeze({ fi: '/matolaskuri', en: '/en/worm-calculator' }),
  checkout: Object.freeze({ fi: '/tilaus', en: '/en/checkout' }),
  wormSource: Object.freeze({
    fi: '/tietoa/mista-lieromaan-madot-tulevat',
    en: '/en/about/where-our-worms-come-from',
  }),
  about: Object.freeze({ fi: '/tietoa', en: '/en/about' }),
  orderTerms: Object.freeze({
    fi: '/tilausehdot',
    en: '/en/order-and-delivery-terms',
  }),
  privacy: Object.freeze({ fi: '/tietosuoja', en: '/en/privacy' }),
  cancelOrder: Object.freeze({
    fi: '/peruuta-tilaus',
    en: '/en/cancel-order',
  }),
  dataRequest: Object.freeze({ fi: '/tietopyynto', en: '/en/data-request' }),
  dataRequestDownload: Object.freeze({
    fi: '/tietopyynto/lataa',
    en: '/en/data-request/download',
  }),
  review: Object.freeze({ fi: '/arvostele', en: '/en/review' }),
});

export const SPECIAL_ROUTES = Object.freeze({
  home: Object.freeze({ fi: '/', en: '/en' }),
  gettingStarted: Object.freeze({
    fi: '/tuotteet/madot',
    en: '/en/getting-started-with-compost-worms',
  }),
});

export const ROUTES = Object.freeze({ ...PAIRED_ROUTES, ...SPECIAL_ROUTES });

const PREPARED_BIN_ANCHORS = Object.freeze({
  fi: '#valmis-matokompostori',
  en: '#ready-to-use-worm-bin',
});

export function getRoutePath(pageKey, language) {
  const route = ROUTES[pageKey];
  if (!route) {
    throw new Error(`Unknown localized route key "${String(pageKey)}".`);
  }

  return route[assertLanguage(language)];
}

function splitHref(href) {
  const normalizedHref = String(href || '');
  const hashIndex = normalizedHref.indexOf('#');
  const beforeHash =
    hashIndex === -1 ? normalizedHref : normalizedHref.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : normalizedHref.slice(hashIndex);
  const queryIndex = beforeHash.indexOf('?');

  return {
    path: queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex),
    query: queryIndex === -1 ? '' : beforeHash.slice(queryIndex),
    hash,
  };
}

export function getLanguageSwitchHref({ pageKey, language, currentHref = '' }) {
  const targetLanguage = assertLanguage(language);
  const targetPath = getRoutePath(pageKey, targetLanguage);
  const { query, hash } = splitHref(currentHref);

  if (pageKey === 'compostWorms' && Object.values(PREPARED_BIN_ANCHORS).includes(hash)) {
    return `${targetPath}${PREPARED_BIN_ANCHORS[targetLanguage]}`;
  }

  if (pageKey === 'review') {
    return `${targetPath}${query}`;
  }

  if (pageKey === 'dataRequestDownload') {
    return `${targetPath}${hash}`;
  }

  return targetPath;
}

export function getDeclaredLocalizedRoutes() {
  return [...new Set(Object.values(ROUTES).flatMap((route) => Object.values(route)))];
}

export function getPairedRouteKeyForPath(pathname) {
  const normalizedPath = String(pathname || '').replace(/\/$/, '') || '/';

  return (
    Object.entries(PAIRED_ROUTES).find(([, route]) =>
      Object.values(route).some((path) => path === normalizedPath)
    )?.[0] ?? null
  );
}

export function getLanguageAlternatesForPath(pathname) {
  const pageKey = getPairedRouteKeyForPath(pathname);
  if (!pageKey) return null;

  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((language) => [
      LANGUAGE_LOCALES[language],
      PAIRED_ROUTES[pageKey][language],
    ])
  );
}

export function getOpenGraphAlternateLocalesForPath(pathname, language) {
  const normalizedLanguage = assertLanguage(language);
  if (!getPairedRouteKeyForPath(pathname)) return [];

  return SUPPORTED_LANGUAGES.filter(
    (candidateLanguage) => candidateLanguage !== normalizedLanguage
  ).map((candidateLanguage) => OPEN_GRAPH_LOCALES[candidateLanguage]);
}

export function getRouteKeyForPath(pathname) {
  const normalizedPath = String(pathname || '').replace(/\/$/, '') || '/';

  return (
    Object.entries(ROUTES).find(([, route]) =>
      Object.values(route).some((path) => path === normalizedPath)
    )?.[0] ?? null
  );
}

export function getLanguageSwitchHrefForPath(pathname, language) {
  const pageKey = getRouteKeyForPath(pathname);
  return pageKey
    ? getLanguageSwitchHref({ pageKey, language, currentHref: pathname })
    : getRoutePath('home', language);
}
