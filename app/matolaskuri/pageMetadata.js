import { SITE_URL } from '@/data/vars.mjs';

export const pageName = 'Matolaskuri – arvioi tarvittava kompostimatojen määrä';
export const title = 'Matolaskuri | Lieromaa';
export const description =
  'Syötä kotitaloutesi tiedot ja laskuri arvioi tuottamasi biojätteen määrän sekä tarvittavan matomäärän.';
export const canonicalUrl = '/matolaskuri';
export const pageUrl = new URL(canonicalUrl, SITE_URL).toString();
export const pageId = `${pageUrl}#webpage`;
export const pageDescription =
  'Lieromaan matolaskuri auttaa arvioimaan, kuinka paljon kompostimatoja (Eisenia fetida) tarvitaan kotitalouden biojätteen käsittelyyn. Syötä perheesi koko ja ruokavalio, ja laskuri kertoo suuntaa-antavan määrän.';
export const mainEntityName = 'Kompostimatojen määrän laskuri';
export const mainEntityDescription =
  'Interaktiivinen työkalu, joka arvioi biojätteen määrän ja siihen tarvittavan kompostimatojen populaation.';

const pageMetadata = {
  title,
  description,
  canonicalUrl,
  twitter: {},
};

export default pageMetadata;
