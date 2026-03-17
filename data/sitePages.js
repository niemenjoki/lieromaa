import { orderTermsPage, privacyPolicyPage } from './legalPages';
import { SITE_URL } from './vars.mjs';

function createSitePage({
  canonicalUrl,
  description,
  navigationLabel,
  pageDescription,
  pageName,
  search = null,
  shortLabel,
  title,
  ...rest
}) {
  const pageUrl = new URL(canonicalUrl, SITE_URL).toString();

  return {
    ...rest,
    canonicalUrl,
    description,
    navigationLabel: navigationLabel ?? shortLabel ?? pageName,
    pageDescription: pageDescription ?? description,
    pageName,
    pageUrl,
    search: search
      ? {
          contexts: search.contexts ?? [],
          description: search.description ?? description,
          keywords: search.keywords ?? [],
          title: search.title ?? shortLabel ?? pageName,
        }
      : null,
    shortLabel: shortLabel ?? pageName,
    title: title ?? `${pageName} | Lieromaa`,
  };
}

export const blogIndexPage = createSitePage({
  canonicalUrl: '/blogi',
  pageName: 'Blogi',
  title: 'Blogi | Lieromaa',
  description:
    'Lieromaan blogi käsittelee matokompostointia, kompostimatoja ja kestävää jätteenkäsittelyä.',
  shortLabel: 'Blogi',
  search: {
    contexts: ['notFound'],
    keywords: ['blogi', 'julkaisut', 'artikkelit', 'matokompostointi'],
  },
});

const wormCalculatorBasePage = createSitePage({
  canonicalUrl: '/matolaskuri',
  pageName: 'Matolaskuri – arvioi tarvittava kompostimatojen määrä',
  title: 'Matolaskuri | Lieromaa',
  description:
    'Syötä kotitaloutesi tiedot ja laskuri arvioi tuottamasi biojätteen määrän sekä tarvittavan matomäärän.',
  pageDescription:
    'Lieromaan matolaskuri auttaa arvioimaan, kuinka paljon kompostimatoja (Eisenia fetida) tarvitaan kotitalouden biojätteen käsittelyyn. Syötä perheesi koko ja ruokavalio, ja laskuri kertoo suuntaa-antavan määrän.',
  shortLabel: 'Matolaskuri',
  search: {
    contexts: ['blog', 'notFound'],
    keywords: ['matolaskuri', 'kompostimadot', 'laskuri', 'lieromaa', 'työkalut'],
  },
});

export const wormCalculatorPage = {
  ...wormCalculatorBasePage,
  pageId: `${wormCalculatorBasePage.pageUrl}#webpage`,
  mainEntityName: 'Kompostimatojen määrän laskuri',
  mainEntityDescription:
    'Interaktiivinen työkalu, joka arvioi biojätteen määrän ja siihen tarvittavan kompostimatojen populaation.',
};

export const aboutPage = createSitePage({
  canonicalUrl: '/tietoa',
  pageName: 'Tietoa Lieromaasta',
  description:
    'Tutustu Lieromaan perustajaan Joonas Niemenjokeen ja siihen, miten sivusto syntyi käytännön matokompostointikokemusten pohjalta.',
  shortLabel: 'Tietoa Lieromaasta',
  search: {
    contexts: ['notFound'],
    keywords: ['tietoa', 'lieromaa', 'joonas niemenjoki', 'sivusto'],
  },
});

export const privacyPolicySitePage = createSitePage({
  ...privacyPolicyPage,
  shortLabel: 'Tietosuojaseloste',
  search: {
    contexts: ['notFound'],
    keywords: ['tietosuoja', 'tietosuojaseloste', 'evästeet', 'henkilötiedot'],
  },
});

export const orderTermsSitePage = createSitePage({
  ...orderTermsPage,
  shortLabel: 'Tilaus- ja toimitusehdot',
  search: {
    contexts: ['notFound'],
    keywords: ['tilausehdot', 'toimitusehdot', 'toimitus', 'palautus', 'maksu'],
  },
});

export const standaloneSitePages = Object.freeze({
  about: aboutPage,
  blogIndex: blogIndexPage,
  orderTerms: orderTermsSitePage,
  privacyPolicy: privacyPolicySitePage,
  wormCalculator: wormCalculatorPage,
});
