import { SITE_URL } from '@/data/vars.mjs';

export const pageName = 'Tietoa Lieromaasta';
export const title = `${pageName} | Lieromaa`;
export const description =
  'Tutustu Lieromaan perustajaan Joonas Niemenjokeen ja siihen, miten sivusto syntyi käytännön matokompostointikokemusten pohjalta.';
export const canonicalUrl = '/tietoa';
export const pageUrl = new URL(canonicalUrl, SITE_URL).toString();

const pageMetadata = {
  title,
  description,
  canonicalUrl,
  twitter: {
    card: 'summary',
  },
};

export default pageMetadata;
