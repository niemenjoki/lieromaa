import { ORGANIZATION_ID, WEBSITE_ID } from '@/lib/site/schema.mjs';

import { imageUrl, pageDescription, pageName, pageUrl } from './pageMetadata';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: pageName,
      description: pageDescription,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORGANIZATION_ID },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: 1024,
        height: 1024,
      },
      inLanguage: 'fi',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Etusivu',
          item: pageUrl,
        },
      ],
    },
  ],
};

export default structuredData;
