import { getOpenGraphLocale } from '@/lib/i18n/config.mjs';
import { getCommonMessages } from '@/lib/i18n/messages.mjs';
import { getRoutePath } from '@/lib/i18n/routes.mjs';
import { ADSENSE_CLIENT } from '@/lib/site/adsense';
import { SITE_URL } from '@/lib/site/constants.mjs';

const siteName = 'Lieromaa';
const logoUrl = '/images/lieromaa_logo_1024.avif';

const TITLES = Object.freeze({
  fi: 'Lieromaa – Käytännön opas matokompostointiin kotona',
  en: 'Lieromaa – Compost worms for worm composting in Finland',
});

const TWITTER_DESCRIPTIONS = Object.freeze({
  fi: 'Käytännön oppaat matokompostointiin kotona.',
  en: 'Compost worms and practical support for worm composting in Finland.',
});

export function getDefaultMetadata(language) {
  const commonMessages = getCommonMessages(language);
  const title = TITLES[language];
  const description = commonMessages.site.description;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    authors: [{ name: 'Joonas Niemenjoki', url: getRoutePath('about', language) }],
    creator: siteName,
    publisher: siteName,
    openGraph: {
      title,
      description,
      siteName,
      type: 'website',
      url: getRoutePath('home', language),
      images: [
        {
          url: logoUrl,
          width: 1024,
          height: 1024,
          alt: commonMessages.navbar.logoAlt,
        },
      ],
      locale: getOpenGraphLocale(language),
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: TWITTER_DESCRIPTIONS[language],
      images: [logoUrl],
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
}
