import { ORGANIZATION_ID, WEBSITE_ID } from '@/data/site/schema.mjs';

import {
  description,
  pageId,
  pageName,
  pageUrl,
  publishedAt,
  updatedAt,
} from './pageMetadata';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': pageId,
      url: pageUrl,
      name: pageName,
      description,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORGANIZATION_ID },
      datePublished: publishedAt,
      dateModified: updatedAt,
      inLanguage: 'fi',
    },
  ],
};

export default structuredData;
