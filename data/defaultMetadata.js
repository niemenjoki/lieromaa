import { SITE_URL } from './vars.mjs';

const title = 'Lieromaa – Kompostimadot ja matokompostointi kotona';
const description =
  'Matokompostointi kotona on helppoa! Tilaa kotimaiset kompostimadot (Eisenia fetida) ja tutustu käytännön oppaisiin ja kompostointivinkkeihin.';
const siteName = 'Lieromaa';
const logoURL = '/images/luomuliero_logo_1024.avif';

export const defaultMetadata = {
  title,
  description,
  metadataBase: new URL(SITE_URL),

  authors: [{ name: 'Joonas Niemenjoki', url: '/tietoa' }],
  creator: siteName,
  publisher: siteName,

  openGraph: {
    title,
    description,
    siteName,
    type: 'website',
    url: '/',
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
    apple: '/images/luomuliero_logo_1024.avif',
  },
  manifest: '/site.webmanifest',
};
