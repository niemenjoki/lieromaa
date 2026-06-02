import { ADSENSE_CLIENT } from './adsense.js';
import { SITE_URL } from './constants.mjs';

const title = 'Lieromaa – Käytännön opas matokompostointiin kotona';
const description =
  'Lieromaa kokoaa käytännön oppaat, kokemukset ja työkalut matokompostoinnin aloittamiseen, hoitoon ja matokakan hyödyntämiseen.';
const siteName = 'Lieromaa';
const logoURL = '/images/lieromaa_logo_1024.avif';

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
    description: 'Käytännön oppaat matokompostointiin kotona.',
    images: [logoURL],
  },

  icons: {
    icon: '/icons/favicon.ico',
    apple: '/images/lieromaa_logo_1024.avif',
  },
  other: {
    'google-adsense-account': ADSENSE_CLIENT,
  },
  manifest: '/site.webmanifest',
};
