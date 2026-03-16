import { SITE_URL } from './vars.mjs';

function createLegalPage({
  canonicalUrl,
  pageIdSuffix,
  pageName,
  title,
  description,
  pageDescription,
  publishedAt,
  updatedAt,
  effectiveFrom,
}) {
  const pageUrl = new URL(canonicalUrl, SITE_URL).toString();

  return {
    canonicalUrl,
    pageUrl,
    pageId: `${pageUrl}${pageIdSuffix}`,
    pageName,
    title,
    description,
    pageDescription,
    publishedAt,
    updatedAt,
    effectiveFrom,
  };
}

export const privacyPolicyPage = createLegalPage({
  canonicalUrl: '/tietosuoja',
  pageIdSuffix: '#privacypolicy',
  pageName: 'Tietosuojaseloste – Lieromaa',
  title: 'Tietosuojaseloste | Lieromaa',
  description:
    'Lue, miten Lieromaa käsittelee henkilötietoja ja käyttää evästeitä. Sivulla kerrotaan tietosuojaperiaatteet ja käyttäjän oikeudet.',
  pageDescription:
    'Lieromaan tietosuojaseloste henkilötietojen käsittelystä, evästeiden käytöstä ja kolmansien osapuolten palveluista (Google AdSense, Vercel Analytics, Speed Insights).',
  publishedAt: '2025-10-16',
  updatedAt: '2026-03-15',
});

export const orderTermsPage = createLegalPage({
  canonicalUrl: '/tilausehdot',
  pageIdSuffix: '#termsofservice',
  pageName: 'Tilaus- ja toimitusehdot – Lieromaa',
  title: 'Tilaus- ja toimitusehdot | Lieromaa',
  description:
    'Tutustu Lieromaan tilausta, maksua, toimitusta ja palautuksia koskeviin ehtoihin.',
  publishedAt: '2025-10-16',
  updatedAt: '2026-03-16',
  effectiveFrom: '2025-10-01',
});

export function getLegalPageLastModified({ updatedAt, effectiveFrom, publishedAt }) {
  return updatedAt ?? effectiveFrom ?? publishedAt;
}
