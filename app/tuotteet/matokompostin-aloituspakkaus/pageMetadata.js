import { SITE_URL } from '@/data/vars.mjs';

export const pageName = 'Matokompostorin aloituspakkaus ja madot';
export const title = `${pageName} | Lieromaa`;
export const description =
  'Lieromaan aloituspakkaus tekee aloituksesta helppoa: kolmen laatikon kompostori, petimateriaali ja kompostimadot valmiina käyttöön.';
export const canonicalUrl = '/tuotteet/matokompostin-aloituspakkaus';
export const pageUrl = new URL(canonicalUrl, SITE_URL).toString();
export const pageId = `${pageUrl}#webpage`;
export const image = {
  url: '/images/starterkit/aloituspakkaus_suljettu_matokompostori.avif',
  width: 1200,
  height: 800,
  alt: 'Valmis kolmen laatikon matokompostori',
};
export const productImageUrls = [
  new URL(image.url, SITE_URL).toString(),
  new URL(
    '/images/starterkit/aloituspakkaus_sisalto_ylhaalta_kuvattuna.avif',
    SITE_URL
  ).toString(),
];
export const productId = `${pageUrl}#product`;
export const productName = 'Matokompostorin aloituspakkaus';
export const faqId = `${pageUrl}#faq`;

const pageMetadata = {
  title,
  description,
  canonicalUrl,
  image,
};

export default pageMetadata;
