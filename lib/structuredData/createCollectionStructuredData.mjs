import { assertLanguage } from '../i18n/config.mjs';
import { ORGANIZATION_ID, SCHEMA_LANGUAGE, WEBSITE_ID } from '../site/schema.mjs';

function createWebPageNode({ pageUrl, pageName, description, language }) {
  const webPageNode = {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageName,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    inLanguage: language,
  };

  if (description) {
    webPageNode.description = description;
  }

  return webPageNode;
}

function createItemListNode({ pageUrl, itemListElement }) {
  return {
    '@type': 'ItemList',
    '@id': `${pageUrl}#itemlist`,
    itemListElement,
  };
}

function createBreadcrumbNode({ pageUrl, breadcrumbItems }) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createCollectionStructuredData({
  pageUrl,
  pageName,
  description,
  itemListElement = [],
  breadcrumbItems = [],
  language = SCHEMA_LANGUAGE,
}) {
  const normalizedLanguage = assertLanguage(language);
  const graph = [
    createWebPageNode({
      pageUrl,
      pageName,
      description,
      language: normalizedLanguage,
    }),
    createItemListNode({ pageUrl, itemListElement }),
  ];

  if (breadcrumbItems.length > 0) {
    graph.push(createBreadcrumbNode({ pageUrl, breadcrumbItems }));
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
