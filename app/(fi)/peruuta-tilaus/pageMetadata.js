import { cancellationRequestPage } from '@/lib/site/pageRecords.mjs';

export const {
  pageName,
  title,
  description,
  canonicalUrl,
  pageUrl,
  pageId,
  publishedAt,
  updatedAt,
  effectiveFrom,
} = cancellationRequestPage;

const pageMetadata = {
  title,
  description,
  canonicalUrl,
  robots: {
    index: false,
    follow: true,
  },
  twitter: {},
};

export default pageMetadata;
