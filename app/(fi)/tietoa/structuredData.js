import { SITE_AUTHOR } from '@/lib/site/author';
import {
  AUTHOR_ID,
  AUTHOR_IMAGE_PATH,
  AUTHOR_LINKEDIN_URL,
  ORGANIZATION_ID,
  WEBSITE_ID,
} from '@/lib/site/schema.mjs';

import { description, pageName, pageUrl } from './pageMetadata';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': `${pageUrl}#aboutpage`,
      url: pageUrl,
      name: pageName,
      description,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORGANIZATION_ID },
      author: {
        '@type': 'Person',
        '@id': AUTHOR_ID,
        name: SITE_AUTHOR.name,
        url: AUTHOR_LINKEDIN_URL,
        affiliation: { '@id': ORGANIZATION_ID },
      },
      publisher: { '@id': ORGANIZATION_ID },
      mainEntity: {
        '@type': 'Person',
        '@id': AUTHOR_ID,
        name: SITE_AUTHOR.name,
        description:
          'Lieromaa.fi-sivuston perustaja, ohjelmoija ja matokompostoinnin harrastaja Järvenpäästä.',
        image: `https://www.lieromaa.fi${AUTHOR_IMAGE_PATH}`,
        jobTitle: 'Founder',
        worksFor: { '@id': ORGANIZATION_ID },
        sameAs: [AUTHOR_LINKEDIN_URL, 'https://www.instagram.com/lieromaa'],
      },
      inLanguage: 'fi',
    },
  ],
};

export default structuredData;
