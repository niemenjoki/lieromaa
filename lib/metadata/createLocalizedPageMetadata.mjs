import { assertLanguage } from '@/lib/i18n/config.mjs';
import {
  getLanguageAlternatesForPath,
  getOpenGraphAlternateLocalesForPath,
} from '@/lib/i18n/routes.mjs';
import { getDefaultMetadata } from '@/lib/metadata/getDefaultMetadata.mjs';

export function createLocalizedPageMetadata({
  language,
  title,
  description,
  canonicalUrl,
  image,
  openGraph = {},
  robots,
  twitter = {},
}) {
  const normalizedLanguage = assertLanguage(language);
  const defaults = getDefaultMetadata(normalizedLanguage);
  const languageAlternates = getLanguageAlternatesForPath(canonicalUrl);
  const openGraphAlternateLocales = getOpenGraphAlternateLocalesForPath(
    canonicalUrl,
    normalizedLanguage
  );
  const metadata = {
    ...defaults,
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      ...(languageAlternates ? { languages: languageAlternates } : {}),
    },
    openGraph: {
      ...defaults.openGraph,
      title,
      description,
      url: canonicalUrl,
      ...(openGraphAlternateLocales.length
        ? { alternateLocale: openGraphAlternateLocales }
        : {}),
      ...(image ? { images: [image] } : {}),
      ...openGraph,
    },
    twitter: {
      ...defaults.twitter,
      title,
      description,
      ...(image ? { images: [image.url] } : {}),
      ...twitter,
    },
  };

  if (robots) {
    metadata.robots = robots;
  }

  return metadata;
}
