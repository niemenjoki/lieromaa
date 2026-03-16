import { pageDescription, pageId, pageName, pageUrl } from './pageMetadata';

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
      inLanguage: 'fi',
    },
  ],
};

export default structuredData;
