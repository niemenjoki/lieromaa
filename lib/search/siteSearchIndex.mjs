import { getGuidePath } from '../content/guideRoutes.mjs';
import { getAllContent, getContentMdxSource } from '../content/index.mjs';
import { productCatalog } from '../products/catalog.mjs';
import { CONTENT_TYPES } from '../site/constants.mjs';
import {
  aboutPage,
  blogIndexPage,
  guideHubPage,
  wormCalculatorPage,
  wormSourcePage,
} from '../site/pageRecords.mjs';

const TEXT_LIMIT = 900;

function cleanText(value = '') {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_>#+|{}[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getMdxHeadings(source) {
  return [...source.matchAll(/^#{2,3}\s+(.+)$/gm)].map((match) => cleanText(match[1]));
}

function getMdxExcerpt(source) {
  const text = cleanText(
    source
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/<SafeImage[\s\S]*?\/>/g, ' ')
      .replace(/import\s.+$/gm, ' ')
  );

  return text.slice(0, TEXT_LIMIT);
}

function getFaqText(faqItems = []) {
  return faqItems
    .flatMap((item) => [item.question, item.answer])
    .filter(Boolean)
    .join(' ');
}

function getContentSearchParts({ type, slug, content }) {
  let source = '';

  try {
    source = getContentMdxSource({ type, slug });
  } catch {
    source = '';
  }

  return {
    headings: getMdxHeadings(source),
    searchText: [getMdxExcerpt(source), getFaqText(content.faqItems)].join(' ').trim(),
  };
}

function createGuideSearchItem(guide) {
  const { headings, searchText } = getContentSearchParts({
    content: guide,
    slug: guide.slug,
    type: CONTENT_TYPES.GUIDE,
  });

  return {
    id: `guide:${guide.slug}`,
    type: 'guide',
    typeLabel: 'Opas',
    title: guide.title,
    description: guide.description,
    href: getGuidePath({
      categoryName: guide.category.name,
      guideSlug: guide.slug,
    }),
    section: guide.category.name,
    tags: [guide.category.name],
    keywords: guide.keywords ?? [],
    headings,
    searchText,
  };
}

function createPostSearchItem(post) {
  const { headings, searchText } = getContentSearchParts({
    content: post,
    slug: post.slug,
    type: CONTENT_TYPES.POST,
  });

  return {
    id: `post:${post.slug}`,
    type: 'post',
    typeLabel: 'Blogi',
    title: post.title,
    description: post.description,
    href: `/blogi/julkaisu/${post.slug}`,
    section: post.tags?.[0] ?? 'blogi',
    tags: post.tags ?? [],
    keywords: post.keywords ?? [],
    headings,
    searchText,
  };
}

function createProductSearchItem(product) {
  return {
    id: `product:${product.key}`,
    type: 'product',
    typeLabel: 'Tuote',
    title: product.search?.title ?? product.navigationLabel ?? product.pageName,
    description: product.pageDescription ?? product.description,
    href: product.canonicalUrl,
    section: 'tuotteet',
    tags: ['tuotteet'],
    keywords: [
      ...(product.search?.keywords ?? []),
      product.productName,
      product.navigationLabel,
      product.h1,
    ].filter(Boolean),
    headings: [product.h1].filter(Boolean),
    searchText: [
      product.productDescription,
      getFaqText(product.faqItems),
      product.merchant?.productType,
    ]
      .filter(Boolean)
      .join(' '),
  };
}

function createPageSearchItem(page, type = 'page', typeLabel = 'Sivu') {
  return {
    id: `${type}:${page.canonicalUrl}`,
    type,
    typeLabel,
    title: page.search?.title ?? page.shortLabel ?? page.pageName,
    description: page.search?.description ?? page.pageDescription ?? page.description,
    href: page.canonicalUrl,
    section: typeLabel.toLocaleLowerCase('fi-FI'),
    tags: page.search?.tags ?? [],
    keywords: page.search?.keywords ?? [],
    headings: [],
    searchText: page.pageDescription ?? page.description,
  };
}

export function getSiteSearchIndex() {
  const { posts, guides } = getAllContent({ type: CONTENT_TYPES.ALL });
  const products = Object.values(productCatalog).map(createProductSearchItem);
  const utilityPages = [
    createPageSearchItem(guideHubPage, 'guideHub', 'Opas'),
    createPageSearchItem(wormCalculatorPage, 'tool', 'Työkalu'),
    createPageSearchItem(blogIndexPage, 'page', 'Sivu'),
    createPageSearchItem(aboutPage, 'page', 'Sivu'),
    createPageSearchItem(wormSourcePage, 'page', 'Sivu'),
  ];

  return [
    ...guides.map(createGuideSearchItem),
    ...posts.map(createPostSearchItem),
    ...products,
    ...utilityPages,
  ];
}
