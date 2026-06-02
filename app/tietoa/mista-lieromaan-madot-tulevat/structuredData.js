import { AUTHOR_ID, ORGANIZATION_ID, WEBSITE_ID } from '@/lib/site/schema.mjs';

import {
  description,
  imageUrl,
  mainEntityDescription,
  mainEntityName,
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
      description,
      image: imageUrl,
      isPartOf: { '@id': WEBSITE_ID },
      about: [
        { '@id': ORGANIZATION_ID },
        {
          '@type': 'Thing',
          name: mainEntityName,
          description: mainEntityDescription,
        },
      ],
      author: { '@id': AUTHOR_ID },
      publisher: { '@id': ORGANIZATION_ID },
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
