import {
  getLanguageAlternatesForPath,
  getOpenGraphAlternateLocalesForPath,
} from '@/lib/i18n/routes.mjs';

import { withDefaultMetadata } from './withDefaultMetadata';

export function createPageMetadata({
  title,
  description,
  canonicalUrl,
  image,
  openGraph = {},
  robots,
  twitter,
}) {
  const languageAlternates = getLanguageAlternatesForPath(canonicalUrl);
  const openGraphAlternateLocales = getOpenGraphAlternateLocalesForPath(
    canonicalUrl,
    'fi'
  );
  const customMetadata = {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      ...(languageAlternates ? { languages: languageAlternates } : {}),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      ...(openGraphAlternateLocales.length
        ? { alternateLocale: openGraphAlternateLocales }
        : {}),
      ...(image ? { images: [image] } : {}),
      ...openGraph,
    },
  };

  if (robots) {
    customMetadata.robots = robots;
  }

  if (image || twitter) {
    customMetadata.twitter = {
      title,
      description,
      ...(image ? { images: [image.url] } : {}),
      ...twitter,
    };
  }

  return withDefaultMetadata(customMetadata);
}
