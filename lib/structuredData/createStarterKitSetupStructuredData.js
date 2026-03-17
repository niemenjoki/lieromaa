import { SITE_URL } from '@/data/site/constants.mjs';
import { ORGANIZATION_ID, WEBSITE_ID } from '@/data/site/schema.mjs';
import { getStarterKitSetupStructuredDataConfig } from '@/lib/site/pageRecords.mjs';

export function createStarterKitSetupStructuredData() {
  const page = getStarterKitSetupStructuredDataConfig();

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': page.pageId,
        url: page.pageUrl,
        name: page.pageName,
        description: page.description,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': ORGANIZATION_ID },
        mainEntity: { '@id': page.howToId },
        inLanguage: 'fi',
      },
      {
        '@type': 'HowTo',
        '@id': page.howToId,
        url: page.pageUrl,
        name: page.howToName,
        description: page.description,
        image: page.imageUrl,
        inLanguage: 'fi',
        supply: page.howToSupplies.map((name) => ({
          '@type': 'HowToSupply',
          name,
        })),
        tool: page.howToTools.map((name) => ({
          '@type': 'HowToTool',
          name,
        })),
        step: page.howToSteps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': page.breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Etusivu',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.parentPageName,
            item: page.parentPageUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: page.pageName,
            item: page.pageUrl,
          },
        ],
      },
    ],
  };
}
