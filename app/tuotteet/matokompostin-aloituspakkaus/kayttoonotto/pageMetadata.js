import { SITE_URL } from '@/data/vars.mjs';

export const pageName = 'Aloituspakkauksen käyttöönotto';
export const title = `${pageName} | Lieromaa`;
export const description =
  'Näin käynnistät aloituspakkauksen oikein: oikea kosteus, laatikoiden kerrokset, matojen totuttelu ja ensimmäiset ruokinnat.';
export const canonicalUrl = '/tuotteet/matokompostin-aloituspakkaus/kayttoonotto';
export const pageUrl = new URL(canonicalUrl, SITE_URL).toString();
export const pageId = `${pageUrl}#webpage`;
export const howToId = `${pageUrl}#howto`;
export const image = {
  url: '/images/content/aloituspakkauksen_aloitus.avif',
  width: 1200,
  height: 900,
  alt: 'Matokompostorin aloituspakkauksen käyttöönotto',
};
export const imageUrl = new URL(image.url, SITE_URL).toString();
export const howToName = 'Matokompostorin aloituspakkauksen käyttöönotto';
export const breadcrumbId = `${pageUrl}#breadcrumb`;
export const parentPageUrl = new URL(
  '/tuotteet/matokompostin-aloituspakkaus',
  SITE_URL
).toString();

const pageMetadata = {
  title,
  description,
  canonicalUrl,
  image,
};

export default pageMetadata;
