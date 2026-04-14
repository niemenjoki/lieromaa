import { CONTENT_TYPES, SITE_URL } from '../site/constants.mjs';
import {
  AUTHOR_ID,
  AUTHOR_NAME,
  ORGANIZATION_ID,
  ORGANIZATION_NAME,
  SCHEMA_LANGUAGE,
  SCHEMA_TIME_ZONE,
  SITE_LOGO_URL,
  WEBSITE_ID,
} from '../site/schema.mjs';

function titleize(value) {
  if (!value) {
    return '';
  }

  return value.charAt(0).toLocaleUpperCase('fi-FI') + value.slice(1);
}

function getHelsinkiOffset(date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: SCHEMA_TIME_ZONE,
    timeZoneName: 'shortOffset',
  });
  const parts = formatter.formatToParts(new Date(`${date}T00:00:00Z`));
  const offset = parts.find((part) => part.type === 'timeZoneName')?.value ?? 'GMT+0';
  const [, hours = '+0', minutes = '00'] =
    offset.match(/^GMT([+-]\d{1,2})(?::(\d{2}))?$/) ?? [];
  const sign = hours.startsWith('-') ? '-' : '+';
  const absoluteHours = hours.replace(/^[+-]/, '').padStart(2, '0');

  return `${sign}${absoluteHours}:${minutes}`;
}

function toSchemaDateTime(date) {
  return `${date}T00:00:00${getHelsinkiOffset(date)}`;
}

function toAbsoluteImageUrl(image) {
  if (!image) {
    return undefined;
  }

  if (typeof image === 'string') {
    return image.startsWith('http') ? image : `${SITE_URL}${image}`;
  }

  if (typeof image?.url === 'string') {
    return image.url.startsWith('http') ? image.url : `${SITE_URL}${image.url}`;
  }

  return undefined;
}

function createAuthor() {
  return {
    '@type': 'Person',
    '@id': AUTHOR_ID,
    name: AUTHOR_NAME,
  };
}

function createPublisher() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: ORGANIZATION_NAME,
    logo: {
      '@type': 'ImageObject',
      url: SITE_LOGO_URL,
    },
  };
}

function createAboutNodes(names = []) {
  return names.map((name) => ({
    '@type': 'Thing',
    name,
  }));
}

function createFaqEntities(faqItems = []) {
  return faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  }));
}

function createBreadcrumbNode(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function getGuideCategorySlug(categoryName) {
  return categoryName.replaceAll(' ', '-');
}

function getPageUrl({ type, slug, categoryName }) {
  if (type === CONTENT_TYPES.POST) {
    return `${SITE_URL}/blogi/julkaisu/${slug}`;
  }

  if (type === CONTENT_TYPES.GUIDE) {
    return `${SITE_URL}/opas/${getGuideCategorySlug(categoryName)}/${slug}`;
  }

  throw new Error(`Unsupported content type for structured data: ${type}`);
}

function getDefaultArticleSection({ type, content }) {
  if (type === CONTENT_TYPES.POST) {
    return titleize(content.tags?.[0]);
  }

  return titleize(content.category?.name);
}

function getAboutNames({ type, content }) {
  if (Array.isArray(content.about) && content.about.length > 0) {
    return content.about;
  }

  if (type === CONTENT_TYPES.POST) {
    return content.tags ?? [];
  }

  return content.category?.name ? [content.category.name] : [];
}

function createPrimaryNode({ type, pageUrl, content }) {
  const primaryType =
    content.schemaType ?? (type === CONTENT_TYPES.POST ? 'BlogPosting' : 'Article');
  const publishedAt = toSchemaDateTime(content.publishedAt);
  const updatedAt = toSchemaDateTime(content.updatedAt ?? content.publishedAt);
  const about = createAboutNodes(getAboutNames({ type, content }));
  const image = toAbsoluteImageUrl(content.image);
  const keywords = content.keywords?.length ? content.keywords : undefined;
  const articleSection =
    content.articleSection ?? getDefaultArticleSection({ type, content });

  const baseNode = {
    '@type': primaryType,
    '@id': `${pageUrl}#${primaryType === 'FAQPage' ? 'faqpage' : 'blogpost'}`,
    url: pageUrl,
    description: content.description,
    datePublished: publishedAt,
    dateModified: updatedAt,
    inLanguage: SCHEMA_LANGUAGE,
    author: createAuthor(),
    publisher: createPublisher(),
    isPartOf: { '@id': WEBSITE_ID },
  };

  if (about.length > 0) {
    baseNode.about = about;
  }

  if (keywords) {
    baseNode.keywords = keywords;
  }

  if (image) {
    baseNode.image = image;
  }

  if (primaryType === 'FAQPage') {
    return {
      ...baseNode,
      name: content.title,
      mainEntity: createFaqEntities(content.faqItems),
    };
  }

  const articleNode = {
    ...baseNode,
    headline: content.title,
  };

  if (articleSection) {
    articleNode.articleSection = articleSection;
  }

  return articleNode;
}

function createSupplementaryFaqNode(content) {
  if (!content.faqItems?.length || content.schemaType === 'FAQPage') {
    return null;
  }

  return {
    '@type': 'FAQPage',
    mainEntity: createFaqEntities(content.faqItems),
  };
}

function createGuideBreadcrumbNode({ pageUrl, content }) {
  const categoryName = content.category.name;

  return createBreadcrumbNode([
    { name: 'Etusivu', url: `${SITE_URL}/` },
    { name: 'Opas', url: `${SITE_URL}/opas` },
    {
      name: titleize(categoryName),
      url: `${SITE_URL}/opas/${getGuideCategorySlug(categoryName)}`,
    },
    { name: content.title, url: pageUrl },
  ]);
}

export function createContentStructuredData({ type, slug, content }) {
  const pageUrl = getPageUrl({
    type,
    slug,
    categoryName: content.category?.name,
  });
  const graph = [createPrimaryNode({ type, pageUrl, content })];

  if (type === CONTENT_TYPES.GUIDE) {
    graph.push(createGuideBreadcrumbNode({ pageUrl, content }));
  }

  const supplementaryFaqNode = createSupplementaryFaqNode(content);
  if (supplementaryFaqNode) {
    graph.push(supplementaryFaqNode);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
