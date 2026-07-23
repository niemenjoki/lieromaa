import { getGuideCategorySlug } from '../content/guideRoutes.mjs';
import { HOT_COMPOSTING_CATEGORY_NAME } from '../content/hotCompostingGuide.mjs';
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

function createHowToListItems(items = [], type) {
  return items.map((item) => ({
    '@type': type,
    name: typeof item === 'string' ? item : item.name,
  }));
}

function createHowToSteps(steps = [], pageUrl) {
  return steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
    ...(step.anchor ? { url: `${pageUrl}#${step.anchor}` } : {}),
  }));
}

function createBreadcrumbNode(items, pageUrl) {
  return {
    '@type': 'BreadcrumbList',
    ...(pageUrl ? { '@id': `${pageUrl}#breadcrumb` } : {}),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
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
  const isHotCompostingGuide =
    type === CONTENT_TYPES.GUIDE &&
    content.category?.name === HOT_COMPOSTING_CATEGORY_NAME;

  const baseNode = {
    '@type': primaryType,
    '@id': `${pageUrl}#${primaryType === 'FAQPage' ? 'faqpage' : primaryType === 'BlogPosting' || !isHotCompostingGuide ? 'blogpost' : 'article'}`,
    url: pageUrl,
    description: content.description,
    datePublished: publishedAt,
    dateModified: updatedAt,
    inLanguage: SCHEMA_LANGUAGE,
    author: createAuthor(),
    publisher: createPublisher(),
    isPartOf: {
      '@id': isHotCompostingGuide ? `${pageUrl}#webpage` : WEBSITE_ID,
    },
    ...(isHotCompostingGuide
      ? { mainEntityOfPage: { '@id': `${pageUrl}#webpage` } }
      : {}),
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

function createSupplementaryHowToNode({ content, pageUrl }) {
  if (!content.howTo?.steps?.length) {
    return null;
  }

  const image = toAbsoluteImageUrl(content.image);
  const howToNode = {
    '@type': 'HowTo',
    '@id': `${pageUrl}#howto`,
    name: content.howTo.name ?? content.title,
    description: content.howTo.description ?? content.description,
    inLanguage: SCHEMA_LANGUAGE,
    isPartOf: { '@id': `${pageUrl}#webpage` },
    step: createHowToSteps(content.howTo.steps, pageUrl),
  };

  if (image) {
    howToNode.image = image;
  }

  if (content.howTo.supplies?.length) {
    howToNode.supply = createHowToListItems(content.howTo.supplies, 'HowToSupply');
  }

  if (content.howTo.tools?.length) {
    howToNode.tool = createHowToListItems(content.howTo.tools, 'HowToTool');
  }

  return howToNode;
}

function createGuideBreadcrumbNode({ pageUrl, content }) {
  const categoryName = content.category.name;

  return createBreadcrumbNode(
    [
      { name: 'Etusivu', url: `${SITE_URL}/` },
      { name: 'Opas', url: `${SITE_URL}/opas` },
      {
        name: titleize(categoryName),
        url: `${SITE_URL}/opas/${getGuideCategorySlug(categoryName)}`,
      },
      { name: content.title, url: pageUrl },
    ],
    pageUrl
  );
}

function createGuideWebPageNode({ pageUrl, content, primaryNode }) {
  const image = toAbsoluteImageUrl(content.image);

  return {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: content.title,
    description: content.description,
    inLanguage: SCHEMA_LANGUAGE,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: { '@id': primaryNode['@id'] },
    breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
    ...(image
      ? {
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: image,
          },
        }
      : {}),
  };
}

export function createContentStructuredData({ type, slug, content }) {
  const pageUrl = getPageUrl({
    type,
    slug,
    categoryName: content.category?.name,
  });
  const primaryNode = createPrimaryNode({ type, pageUrl, content });
  const graph = [primaryNode];
  const isHotCompostingGuide =
    type === CONTENT_TYPES.GUIDE &&
    content.category?.name === HOT_COMPOSTING_CATEGORY_NAME;

  if (type === CONTENT_TYPES.GUIDE) {
    if (isHotCompostingGuide) {
      graph.unshift(createGuideWebPageNode({ pageUrl, content, primaryNode }));
    }
    graph.push(createGuideBreadcrumbNode({ pageUrl, content }));
  }

  const supplementaryFaqNode = createSupplementaryFaqNode(content);
  if (supplementaryFaqNode) {
    graph.push(supplementaryFaqNode);
  }

  const supplementaryHowToNode = createSupplementaryHowToNode({ content, pageUrl });
  if (supplementaryHowToNode) {
    graph.push(supplementaryHowToNode);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
