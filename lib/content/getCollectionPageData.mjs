import { SITE_URL } from '../site/constants.mjs';

function parsePageIndex(pageIndex) {
  const parsedPageIndex = Number.parseInt(pageIndex, 10);

  if (Number.isNaN(parsedPageIndex) || parsedPageIndex < 1) {
    return 1;
  }

  return parsedPageIndex;
}

export function getBlogPageData(pageIndex) {
  const pageIndexInt = parsePageIndex(pageIndex);
  const pagePath = pageIndexInt === 1 ? '/blogi' : `/blogi/sivu/${pageIndexInt}`;

  return {
    pageIndexInt,
    pagePath,
    pageUrl: `${SITE_URL}${pagePath}`,
    pageName:
      pageIndexInt === 1
        ? 'Blogi – Kaikki julkaisut'
        : `Blogi – Kaikki julkaisut (sivu ${pageIndexInt})`,
    description:
      'Lieromaan blogi käsittelee matokompostointia, kompostimatoja ja kestävää jätteenkäsittelyä.',
    breadcrumbItems: [
      { name: 'Etusivu', url: `${SITE_URL}/` },
      { name: 'Blogi', url: `${SITE_URL}/blogi` },
    ],
  };
}

export function getBlogTagPageData({ tag, pageIndex }) {
  const pageIndexInt = parsePageIndex(pageIndex);
  const tagSlug = decodeURIComponent(tag);
  const tagName = tagSlug.replaceAll('-', ' ');
  const pagePath = `/blogi/${tag}/sivu/${pageIndexInt}`;

  return {
    pageIndexInt,
    tagSlug,
    tagName,
    pagePath,
    pageUrl: `${SITE_URL}${pagePath}`,
    title: `Avainsana ${tagName} | Lieromaa`,
    pageName: `Blogi – ${tagName} (sivu ${pageIndexInt})`,
    description: `Julkaisut avainsanalla ${tagName}: Lieromaan blogi käsittelee matokompostointia, kompostimatoja ja kestävää jätteenkäsittelyä.`,
  };
}

export function getGuideCategoryPageData(categorySlug) {
  const categoryName = decodeURIComponent(categorySlug.replaceAll('-', ' '));
  const pagePath = `/opas/${categorySlug}`;
  const title = `Lieromaan oppaat aiheesta: ${categoryName}`;

  return {
    categoryName,
    pagePath,
    pageUrl: `${SITE_URL}${pagePath}`,
    title,
    pageName: title,
    description: `Lue käytännön vinkit ja ohjeet aiheesta ${categoryName} – miten perustaa, hoitaa ja hyödyntää matokompostia.`,
    breadcrumbItems: [
      { name: 'Etusivu', url: `${SITE_URL}/` },
      { name: 'Opas', url: `${SITE_URL}/opas` },
      { name: categoryName, url: `${SITE_URL}${pagePath}` },
    ],
  };
}
