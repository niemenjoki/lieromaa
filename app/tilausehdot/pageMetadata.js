import { SITE_URL } from '@/data/vars.mjs';

export const pageName = 'Tilaus- ja toimitusehdot – Lieromaa';
export const title = 'Tilaus- ja toimitusehdot | Lieromaa';
export const description =
  'Tutustu Lieromaan tilausta, maksua, toimitusta ja palautuksia koskeviin ehtoihin. Ehdot voimassa 1.10.2025 alkaen.';
export const canonicalUrl = '/tilausehdot';
export const pageUrl = new URL(canonicalUrl, SITE_URL).toString();
export const pageId = `${pageUrl}#termsofservice`;

const pageMetadata = {
  title,
  description,
  canonicalUrl,
  twitter: {},
};

export default pageMetadata;
