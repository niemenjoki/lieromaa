import { getStarterKitSetupStructuredDataConfig } from '@/lib/site/pageRecords.mjs';

const page = getStarterKitSetupStructuredDataConfig();

export const {
  breadcrumbId,
  canonicalUrl,
  description,
  howToId,
  howToName,
  image,
  imageUrl,
  pageId,
  pageName,
  pageUrl,
  parentPageUrl,
  title,
} = page;

const pageMetadata = {
  title,
  description,
  canonicalUrl,
  image,
};

export default pageMetadata;
