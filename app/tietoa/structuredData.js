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
      isPartOf: { '@id': 'https://www.lieromaa.fi/#website' },
      about: { '@id': 'https://www.lieromaa.fi/#organization' },
      author: {
        '@type': 'Person',
        '@id': 'https://www.lieromaa.fi/#joonas',
        name: 'Joonas Niemenjoki',
        url: 'https://www.linkedin.com/in/joonasniemenjoki',
        affiliation: { '@id': 'https://www.lieromaa.fi/#organization' },
      },
      publisher: { '@id': 'https://www.lieromaa.fi/#organization' },
      mainEntity: {
        '@type': 'Person',
        '@id': 'https://www.lieromaa.fi/#joonas',
        name: 'Joonas Niemenjoki',
        description:
          'Lieromaa.fi-sivuston perustaja, ohjelmoija ja matokompostoinnin harrastaja Järvenpäästä.',
        image: 'https://www.lieromaa.fi/images/portrait2024.avif',
        jobTitle: 'Founder',
        worksFor: { '@id': 'https://www.lieromaa.fi/#organization' },
        sameAs: [
          'https://www.linkedin.com/in/joonasniemenjoki',
          'https://www.instagram.com/lieromaa',
        ],
      },
      inLanguage: 'fi',
    },
  ],
};

export default structuredData;
