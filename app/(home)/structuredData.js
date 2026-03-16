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
      isPartOf: { '@id': 'https://www.lieromaa.fi/#website' },
      about: { '@id': 'https://www.lieromaa.fi/#organization' },
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
