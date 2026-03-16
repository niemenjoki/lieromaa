import { SITE_URL } from '@/data/vars.mjs';

export const pageName = 'Osta kompostimatoja – Eisenia fetida matokompostointiin';
export const title = 'Osta kompostimatoja | Lieromaa';
export const description =
  'Tilaa kotimaisia kompostimatoja (Eisenia fetida) helposti postitettuna koko Suomeen. Aloita oma matokomposti Lieromaan madoilla!';
export const canonicalUrl = '/tuotteet/madot';
export const pageUrl = new URL(canonicalUrl, SITE_URL).toString();
export const pageId = `${pageUrl}#webpage`;
export const pageDescription =
  'Tilaa kotimaisia kompostimatoja (Eisenia fetida) postitse tai nouda Järvenpäästä. Lieromaa kasvattaa ja myy kompostimatoja vastuullisesti pienimuotoisena yritystoimintana.';
export const image = {
  url: '/images/wormspage/kompostimadot_kammenella.avif',
  width: 1536,
  height: 1024,
  alt: 'Kompostimatoja ja matokompostin sisältöä kämmenellä',
};
export const imageUrl = new URL(image.url, SITE_URL).toString();
export const productId = `${pageUrl}#product`;
export const productName = 'Kompostimadot (Eisenia fetida)';
export const productDescription =
  'Kotimaiset kompostimadot (Eisenia fetida) matokompostointiin. Myynnissä 50, 100 ja 200 madon pakkauksina. Sopivat sisä- ja ulkokäyttöön, hajuttomaan biojätteen käsittelyyn ja luonnonmukaiseen lannoitukseen.';

const pageMetadata = {
  title,
  description,
  canonicalUrl,
  image,
};

export default pageMetadata;
