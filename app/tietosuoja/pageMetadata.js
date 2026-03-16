import { SITE_URL } from '@/data/vars.mjs';

export const pageName = 'Tietosuojaseloste – Lieromaa';
export const title = 'Tietosuojaseloste | Lieromaa';
export const description =
  'Lue, miten Lieromaa käsittelee henkilötietoja ja käyttää evästeitä. Sivulla kerrotaan tietosuojaperiaatteet ja käyttäjän oikeudet.';
export const canonicalUrl = '/tietosuoja';
export const pageUrl = new URL(canonicalUrl, SITE_URL).toString();
export const pageId = `${pageUrl}#privacypolicy`;
export const pageDescription =
  'Lieromaan tietosuojaseloste henkilötietojen käsittelystä, evästeiden käytöstä ja kolmansien osapuolten palveluista (Google AdSense, Vercel Analytics, Speed Insights).';

const pageMetadata = {
  title,
  description,
  canonicalUrl,
  twitter: {},
};

export default pageMetadata;
