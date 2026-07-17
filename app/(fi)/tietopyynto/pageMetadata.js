import { dataRequestPage } from '@/lib/site/pageRecords.mjs';

export const {
  pageName,
  title,
  description,
  canonicalUrl,
  pageUrl,
  pageId,
  publishedAt,
  updatedAt,
} = dataRequestPage;

const pageMetadata = {
  title,
  description,
  canonicalUrl,
  twitter: {},
};

export default pageMetadata;
