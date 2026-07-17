import { assertLanguage } from '../i18n/config.mjs';
import { getCommonMessages } from '../i18n/messages.mjs';
import { SITE_URL } from '../site/constants.mjs';
import { CONTACT_EMAIL } from '../site/contact.js';
import { defaultMetadata } from '../site/defaultMetadata.js';
import {
  AUTHOR_ID,
  AUTHOR_IMAGE_PATH,
  AUTHOR_LINKEDIN_URL,
  AUTHOR_NAME,
  ORGANIZATION_ID,
  ORGANIZATION_NAME,
  ORGANIZATION_SAME_AS,
  ORGANIZATION_SUPPORT_LANGUAGE,
  SCHEMA_LANGUAGE,
  SITE_FOUNDING_DATE,
  SITE_FOUNDING_LOCATION,
  SITE_LOGO_URL,
  WEBSITE_ID,
} from '../site/schema.mjs';

export function createSiteStructuredData(language = SCHEMA_LANGUAGE) {
  const normalizedLanguage = assertLanguage(language);
  const commonMessages = getCommonMessages(normalizedLanguage);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: ORGANIZATION_NAME,
        description:
          normalizedLanguage === SCHEMA_LANGUAGE
            ? defaultMetadata.description
            : commonMessages.site.description,
        publisher: {
          '@type': 'Organization',
          '@id': ORGANIZATION_ID,
          name: ORGANIZATION_NAME,
        },
        inLanguage: normalizedLanguage,
      },
      {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: ORGANIZATION_NAME,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: SITE_LOGO_URL,
          contentUrl: SITE_LOGO_URL,
          width: 1024,
          height: 1024,
        },
        sameAs: ORGANIZATION_SAME_AS,
        founder: { '@id': AUTHOR_ID },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: commonMessages.site.contactType,
          email: CONTACT_EMAIL,
          availableLanguage:
            normalizedLanguage === SCHEMA_LANGUAGE
              ? ORGANIZATION_SUPPORT_LANGUAGE
              : ['fi', 'en'],
        },
        foundingDate: SITE_FOUNDING_DATE,
        foundingLocation: { '@type': 'Place', name: SITE_FOUNDING_LOCATION },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'FI',
        },
      },
      {
        '@type': 'Person',
        '@id': AUTHOR_ID,
        name: AUTHOR_NAME,
        url: AUTHOR_LINKEDIN_URL,
        jobTitle: 'Founder',
        worksFor: { '@id': ORGANIZATION_ID },
        sameAs: [AUTHOR_LINKEDIN_URL],
        image: `${SITE_URL}${AUTHOR_IMAGE_PATH}`,
      },
    ],
  };
}
