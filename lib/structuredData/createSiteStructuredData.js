import { SITE_URL } from '@/data/site/constants.mjs';
import { CONTACT_EMAIL } from '@/data/site/contact';
import { defaultMetadata } from '@/data/site/defaultMetadata';
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
} from '@/data/site/schema.mjs';

export function createSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: ORGANIZATION_NAME,
        description: defaultMetadata.description,
        publisher: {
          '@type': 'Organization',
          '@id': ORGANIZATION_ID,
          name: ORGANIZATION_NAME,
        },
        inLanguage: SCHEMA_LANGUAGE,
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
          contactType: 'Customer Support',
          email: CONTACT_EMAIL,
          availableLanguage: ORGANIZATION_SUPPORT_LANGUAGE,
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
