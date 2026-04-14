import { ORGANIZATION_ID, WEBSITE_ID } from '@/lib/site/schema.mjs';

import {
  mainEntityDescription,
  mainEntityName,
  pageDescription,
  pageId,
  pageName,
  pageUrl,
} from './pageMetadata';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': pageId,
      url: pageUrl,
      name: pageName,
      description: pageDescription,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORGANIZATION_ID },
      mainEntity: {
        '@type': 'Thing',
        name: mainEntityName,
        description: mainEntityDescription,
      },
      inLanguage: 'fi',
    },
  ],
};

export default structuredData;
