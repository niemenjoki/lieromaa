import { CONTENT_TYPES, GUIDE_CATEGORIES } from '@/lib/site/constants.mjs';

import {
  getGuideCategoryLabel,
  getGuideCategorySlug,
  getGuidePath,
} from './content/guideRoutes.mjs';
import { getAllContent, getBlogTagArchives } from './content/index.mjs';
import { productCatalog } from './products/catalog.mjs';
import {
  aboutPage,
  blogIndexPage,
  cancellationRequestPage,
  dataRequestPage,
  orderTermsPage,
  privacyPolicyPage,
  wormCalculatorPage,
  wormSourcePage,
} from './site/pageRecords.mjs';

const secondarySitePages = [
  blogIndexPage,
  wormCalculatorPage,
  aboutPage,
  wormSourcePage,
  privacyPolicyPage,
  orderTermsPage,
];

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

function getGuideCategories() {
  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE });
  const uniqueCategoryNames = Array.from(
    new Set(guides.map((guide) => guide.category.name))
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

  return uniqueCategoryNames.map((categoryName) => {
    const categorySlug = getGuideCategorySlug(categoryName);
    const categoryGuides = guides
      .filter((guide) => guide.category.name === categoryName)
      .sort((a, b) => a.category.pagePosition - b.category.pagePosition);

    return {
      id: categorySlug,
      href: `/opas/${categorySlug}`,
      label: getGuideCategoryLabel(categoryName),
      count: categoryGuides.length,
      items: categoryGuides.map((guide) => ({
        href: getGuidePath({
          categoryName: guide.category.name,
          guideSlug: guide.slug,
        }),
        label: guide.title,
      })),
    };
  });
}

export function getSiteNavigation() {
  const productLinks = getProductLinks();
  const guideCategories = getGuideCategories();
  const guideLinks = [
    { href: '/opas', label: 'Kaikki oppaat' },
    ...guideCategories.map(({ href, label }) => ({ href, label })),
  ];
  const calculatorLink = createLink(wormCalculatorPage);
  const aboutLink = createLink(aboutPage);
  const wormSourceLink = createLink(wormSourcePage);
  const orderTermsLink = createLink(orderTermsPage);
  const cancellationLink = createLink(cancellationRequestPage);
  const privacyLink = createLink(privacyPolicyPage);
  const dataRequestLink = {
    href: dataRequestPage.canonicalUrl,
    label: 'Tietopyyntö',
  };
  const languageLink = {
    href: '/en',
    label: 'In English',
    lang: 'en',
  };
  const blogLinks = [
    { href: blogIndexPage.canonicalUrl, label: 'Kaikki julkaisut' },
    ...getBlogTagArchives()
      .filter((tagArchive) => tagArchive.indexable)
      .map(({ href, label }) => ({ href, label })),
  ];
  const secondarySections = [
    {
      heading: 'Työkalut',
      items: [calculatorLink],
    },
    {
      heading: 'Lieromaa',
      items: [aboutLink, wormSourceLink],
    },
    {
      heading: 'Asiointi',
      items: [orderTermsLink, cancellationLink],
    },
    {
      heading: 'Tietosuoja',
      items: [privacyLink, dataRequestLink],
    },
  ];

  return {
    primaryItems: [
      {
        id: 'home',
        href: '/',
        label: 'Koti',
        icon: 'home',
        exactPaths: ['/'],
      },
      {
        id: 'guides',
        href: '/opas',
        label: 'Oppaat',
        icon: 'guides',
        matchPrefixes: ['/opas'],
      },
      {
        id: 'blog',
        href: '/blogi',
        label: 'Blogi',
        icon: 'blog',
        matchPrefixes: ['/blogi'],
      },
      {
        id: 'calculator',
        href: '/matolaskuri',
        label: 'Laskuri',
        icon: 'calculator',
        exactPaths: ['/matolaskuri'],
      },
      {
        id: 'shop',
        href: '/tuotteet',
        label: 'Tuotteet',
        icon: 'products',
        exactPaths: ['/tilaus', '/madot'],
        matchPrefixes: ['/tuotteet'],
      },
    ],
    mobileDockIds: ['home', 'guides', 'blog', 'shop'],
    desktopPrimaryIds: ['guides', 'blog', 'shop'],
    guideCategories,
    secondarySections,
    settingsSection: {
      heading: 'Kieli ja asetukset',
      languageLink,
    },
    desktopItems: [
      { kind: 'menu', label: 'Oppaat', items: guideLinks },
      { kind: 'link', ...createLink(blogIndexPage) },
      { kind: 'menu', label: 'Tuotteet', items: productLinks },
    ],
    footerColumns: [
      { heading: 'Oppaat', items: guideLinks },
      { heading: 'Blogi', items: blogLinks },
      { heading: 'Tuotteet', items: productLinks },
      {
        heading: 'Työkalut',
        items: [calculatorLink],
        mobilePresentation: 'direct',
      },
      {
        heading: 'Lieromaa',
        items: [aboutLink, wormSourceLink, languageLink],
      },
      {
        heading: 'Asiointi ja tietosuoja',
        items: [orderTermsLink, cancellationLink, privacyLink, dataRequestLink],
      },
    ],
    mobileSections: secondarySections,
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
