import { homePageDefinition } from '../../data/pages/home.js';
import { legalPageDefinitions } from '../../data/pages/legal.js';
import { starterKitSetupPageDefinition } from '../../data/pages/products/starterKitSetup.js';
import { standalonePageDefinitions } from '../../data/pages/standalone.js';
import { SITE_URL } from '../../data/site/constants.mjs';

function createSearchRecord(search, description, pageName, shortLabel) {
  if (!search) {
    return null;
  }

  return {
    contexts: search.contexts ?? [],
    description: search.description ?? description,
    keywords: search.keywords ?? [],
    tags: search.tags ?? [],
    title: search.title ?? shortLabel ?? pageName,
  };
}

function createPageRecord({
  canonicalUrl,
  description,
  image,
  navigationLabel,
  pageDescription,
  pageIdSuffix = '#webpage',
  pageName,
  search = null,
  shortLabel,
  title,
  ...rest
}) {
  const pageUrl = new URL(canonicalUrl, SITE_URL).toString();
  const imageUrl =
    image?.url != null ? new URL(image.url, SITE_URL).toString() : undefined;

  return {
    ...rest,
    canonicalUrl,
    description,
    image,
    imageUrl,
    metadata: {
      title: title ?? `${pageName} | Lieromaa`,
      description,
      canonicalUrl,
      ...(image ? { image } : {}),
    },
    navigationLabel: navigationLabel ?? shortLabel ?? pageName,
    pageDescription: pageDescription ?? description,
    pageId: `${pageUrl}${pageIdSuffix}`,
    pageName,
    pageUrl,
    search: createSearchRecord(search, description, pageName, shortLabel),
    shortLabel: shortLabel ?? pageName,
    title: title ?? `${pageName} | Lieromaa`,
  };
}

export const homePage = createPageRecord(homePageDefinition);
export const blogIndexPage = createPageRecord(standalonePageDefinitions.blogIndex);
export const wormCalculatorPage = createPageRecord(
  standalonePageDefinitions.wormCalculator
);
export const aboutPage = createPageRecord(standalonePageDefinitions.about);
export const privacyPolicyPage = createPageRecord(legalPageDefinitions.privacyPolicy);
export const orderTermsPage = createPageRecord(legalPageDefinitions.orderTerms);
export const starterKitSetupPage = createPageRecord(starterKitSetupPageDefinition);

export const standaloneSitePages = Object.freeze({
  about: aboutPage,
  blogIndex: blogIndexPage,
  orderTerms: orderTermsPage,
  privacyPolicy: privacyPolicyPage,
  wormCalculator: wormCalculatorPage,
});

export function getLegalPageLastModified({ updatedAt, effectiveFrom, publishedAt }) {
  return updatedAt ?? effectiveFrom ?? publishedAt;
}

export function getStarterKitSetupStructuredDataConfig() {
  return {
    ...starterKitSetupPage,
    breadcrumbId: `${starterKitSetupPage.pageUrl}#breadcrumb`,
    howToId: `${starterKitSetupPage.pageUrl}#howto`,
    howToName: starterKitSetupPageDefinition.howTo.name,
    howToSupplies: starterKitSetupPageDefinition.howTo.supplies,
    howToTools: starterKitSetupPageDefinition.howTo.tools,
    howToSteps: starterKitSetupPageDefinition.howTo.steps,
    parentPageName: starterKitSetupPageDefinition.parentPageName,
    parentPageUrl: new URL(
      starterKitSetupPageDefinition.parentPageCanonicalUrl,
      SITE_URL
    ).toString(),
  };
}
