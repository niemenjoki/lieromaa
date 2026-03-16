import { SITE_URL } from '@/data/vars.mjs';

export const pageName = 'Lieromaa – Kompostimadot ja matokompostointi kotona';
export const title = 'Lieromaa – Kompostimadot ja oppaat matokompostointiin';
export const description =
  'Tilaa kotimaiset kompostimadot ja opi matokompostointi helposti. Lieromaan oppaat ja blogi auttavat perustamaan, hoitamaan ja hyödyntämään oman kompostorin.';
export const canonicalUrl = '/';
export const pageUrl = new URL(canonicalUrl, SITE_URL).toString();
export const pageDescription =
  'Tilaa kotimaiset kompostimadot (Eisenia fetida) ja opi matokompostointi helposti. Lieromaan oppaat ja blogi auttavat perustamaan, hoitamaan ja hyödyntämään oman kompostorin.';
export const imageUrl = new URL('/images/lieromaa_logo_1024.avif', SITE_URL).toString();

const pageMetadata = {
  title,
  description,
  canonicalUrl,
};

export default pageMetadata;
