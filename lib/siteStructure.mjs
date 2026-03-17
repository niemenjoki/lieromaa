import { productCatalog } from '../data/productCatalog.mjs';
import {
  aboutPage,
  blogIndexPage,
  orderTermsSitePage,
  privacyPolicySitePage,
  wormCalculatorPage,
} from '../data/sitePages.js';
import { CONTENT_TYPES } from '../data/vars.mjs';
import { getAllContent } from './content/index.mjs';

const GUIDE_CATEGORY_PREFERRED_ORDER = [
  'kompostorin perustaminen',
  'kompostorin hoito',
  'kompostin hyödyntäminen',
];

const secondarySitePages = [
  blogIndexPage,
  wormCalculatorPage,
  aboutPage,
  privacyPolicySitePage,
  orderTermsSitePage,
];

function formatCategoryLabel(categoryName) {
  return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
}

function slugifySegment(value) {
  return value.replaceAll(' ', '-');
}

function createLink({ canonicalUrl, navigationLabel, shortLabel }) {
  return {
    href: canonicalUrl,
    label: navigationLabel ?? shortLabel,
  };
}

function createSearchEntry({ canonicalUrl, description, search }) {
  if (!search) {
    return null;
  }

  return {
    overrideHref: canonicalUrl,
    title: search.title,
    description: search.description ?? description,
    tags: search.tags ?? [],
    keywords: search.keywords ?? [],
  };
}

function getProductLinks() {
  return Object.values(productCatalog).map((product) => createLink(product));
}

function getGuideCategoryLinks() {
  const uniqueCategoryNames = Array.from(
    new Set(
      getAllContent({ type: CONTENT_TYPES.GUIDE }).map((guide) => guide.category.name)
    )
  );

  uniqueCategoryNames.sort((a, b) => {
    const aIndex = GUIDE_CATEGORY_PREFERRED_ORDER.indexOf(a);
    const bIndex = GUIDE_CATEGORY_PREFERRED_ORDER.indexOf(b);

    if (aIndex === -1 && bIndex === -1) {
      return a.localeCompare(b, 'fi');
    }

    if (aIndex === -1) {
      return 1;
    }

    if (bIndex === -1) {
      return -1;
    }

    return aIndex - bIndex;
  });

  return uniqueCategoryNames.map((categoryName) => ({
    href: `/opas/${slugifySegment(categoryName)}`,
    label: formatCategoryLabel(categoryName),
  }));
}

export function getSiteNavigation() {
  const productLinks = getProductLinks();
  const guideLinks = getGuideCategoryLinks();
  const secondaryLinks = secondarySitePages.map((page) => createLink(page));

  return {
    desktopItems: [
      { kind: 'menu', label: 'Tuotteet', items: productLinks },
      { kind: 'menu', label: 'Opas', items: guideLinks },
      { kind: 'link', ...createLink(blogIndexPage) },
    ],
    footerColumns: [
      { heading: 'Tuotteet', items: productLinks },
      { heading: 'Oppaat', items: guideLinks },
      { heading: 'Muut sivut', items: secondaryLinks },
    ],
    mobileSections: [
      { heading: 'Tuotteet', items: productLinks },
      { heading: 'Opas', items: guideLinks },
      { items: secondaryLinks },
    ],
  };
}

export function getSearchableSitePages({ context }) {
  const productPages = Object.values(productCatalog)
    .filter((product) => product.search?.contexts?.includes(context))
    .map((product) => createSearchEntry(product));
  const standalonePages = secondarySitePages
    .filter((page) => page.search?.contexts?.includes(context))
    .map((page) => createSearchEntry(page));

  return [...productPages, ...standalonePages].filter(Boolean);
}
