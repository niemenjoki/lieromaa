import { ORGANIZATION_ID, SCHEMA_LANGUAGE, WEBSITE_ID } from '../../data/site/schema.mjs';

function createWebPageNode({ pageUrl, pageName, description }) {
  const webPageNode = {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageName,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    inLanguage: SCHEMA_LANGUAGE,
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
}) {
  const graph = [
    createWebPageNode({ pageUrl, pageName, description }),
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
