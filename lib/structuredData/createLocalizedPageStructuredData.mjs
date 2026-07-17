import { assertLanguage } from '@/lib/i18n/config.mjs';
import { SITE_URL } from '@/lib/site/constants.mjs';
import { ORGANIZATION_ID, WEBSITE_ID } from '@/lib/site/schema.mjs';

export function createLocalizedPageStructuredData({
  language,
  canonicalUrl,
  name,
  description,
  type = 'WebPage',
  image,
  datePublished,
  dateModified,
  mainEntity,
  breadcrumbs = [],
}) {
  const normalizedLanguage = assertLanguage(language);
  const pageUrl = new URL(canonicalUrl, SITE_URL).toString();
  const pageNode = {
    '@type': type,
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    inLanguage: normalizedLanguage,
    ...(image ? { image: new URL(image, SITE_URL).toString() } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(mainEntity ? { mainEntity } : {}),
  };
  const graph = [pageNode];

  if (breadcrumbs.length) {
    const breadcrumbId = `${pageUrl}#breadcrumb`;
    pageNode.breadcrumb = { '@id': breadcrumbId };
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: new URL(item.href, SITE_URL).toString(),
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
