import { SITE_URL } from './vars';

const title = 'Lieromaa – Kompostimadot ja matokompostointi kotona';
const description =
  'Matokompostointi kotona on helppoa! Tilaa kotimaiset kompostimadot (Eisenia fetida) ja tutustu käytännön oppaisiin ja kompostointivinkkeihin.';
const siteName = 'Lieromaa';
const logoURL = 'https://www.lieromaa.fi/images/luomuliero_logo_1024.png';

export const defaultMetadata = {
  title,
  description,
  metadataBase: new URL(SITE_URL),

  authors: [{ name: 'Joonas Niemenjoki', url: 'https://www.lieromaa.fi/tietoa' }],
  creator: siteName,
  publisher: siteName,

  openGraph: {
    title,
    description,
    siteName,
    type: 'website',
    url: 'https://www.lieromaa.fi',
    images: [
      {
        url: logoURL,
        width: 1024,
        height: 1024,
        alt: 'Lieromaa logo',
      },
    ],
    locale: 'fi_FI',
  },

  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: 'Kompostimadot ja matokompostointi helposti kotona.',
    images: [logoURL],
  },

  icons: {
    icon: '/icons/favicon.ico',
    apple: '/images/luomuliero_logo_1024.png',
  },
  manifest: '/site.webmanifest',
};
