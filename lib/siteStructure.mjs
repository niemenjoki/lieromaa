import { CONTENT_TYPES, GUIDE_CATEGORIES } from '@/lib/site/constants.mjs';

import { getAllContent } from './content/index.mjs';
import { productCatalog } from './products/catalog.mjs';
import {
  aboutPage,
  blogIndexPage,
  orderTermsPage,
  privacyPolicyPage,
  wormCalculatorPage,
} from './site/pageRecords.mjs';

const secondarySitePages = [
  blogIndexPage,
  wormCalculatorPage,
  aboutPage,
  privacyPolicyPage,
  orderTermsPage,
];

const contentLinks = [
  createLink(blogIndexPage),
  createLink(wormCalculatorPage),
  createLink(aboutPage),
];

const utilityLinks = [createLink(privacyPolicyPage), createLink(orderTermsPage)];

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
  return [
    { href: '/tuotteet', label: 'Kaikki tuotteet' },
    ...Object.values(productCatalog).map((product) => createLink(product)),
  ];
}

function getGuideCategoryLinks() {
  const uniqueCategoryNames = Array.from(
    new Set(
      getAllContent({ type: CONTENT_TYPES.GUIDE }).map((guide) => guide.category.name)
    )
  );

  uniqueCategoryNames.sort((a, b) => {
    const aIndex = GUIDE_CATEGORIES.indexOf(a);
    const bIndex = GUIDE_CATEGORIES.indexOf(b);

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

  return [
    { href: '/opas', label: 'Kaikki oppaat' },
    ...uniqueCategoryNames.map((categoryName) => ({
      href: `/opas/${slugifySegment(categoryName)}`,
      label: formatCategoryLabel(categoryName),
    })),
  ];
}

export function getSiteNavigation() {
  const productLinks = getProductLinks();
  const guideLinks = getGuideCategoryLinks();

  return {
    desktopItems: [
      { kind: 'menu', label: 'Oppaat', items: guideLinks },
      { kind: 'link', ...createLink(blogIndexPage) },
      { kind: 'link', ...createLink(wormCalculatorPage) },
      { kind: 'menu', label: 'Tuotteet', items: productLinks },
    ],
    footerColumns: [
      { heading: 'Oppaat', items: guideLinks },
      { heading: 'Sisältö', items: contentLinks },
      { heading: 'Tuotteet', items: productLinks },
      { heading: 'Muut sivut', items: utilityLinks },
    ],
    mobileSections: [
      { heading: 'Oppaat', items: guideLinks },
      { heading: 'Sisältö', items: contentLinks },
      { heading: 'Tuotteet', items: productLinks },
      { items: utilityLinks },
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
