import {
  pageDescription,
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
      description: pageDescription,
      isPartOf: { '@id': 'https://www.lieromaa.fi/#website' },
      about: { '@id': 'https://www.lieromaa.fi/#organization' },
      datePublished: publishedAt,
      dateModified: updatedAt,
      inLanguage: 'fi',
    },
  ],
};

export default structuredData;
