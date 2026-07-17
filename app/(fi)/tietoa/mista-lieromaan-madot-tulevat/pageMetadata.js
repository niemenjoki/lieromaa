import { wormSourcePage } from '@/lib/site/pageRecords.mjs';

export const {
  pageName,
  title,
  description,
  canonicalUrl,
  pageUrl,
  pageId,
  pageDescription,
  image,
  imageUrl,
  mainEntityName,
  mainEntityDescription,
} = wormSourcePage;

const pageMetadata = {
  title,
  description,
  canonicalUrl,
  image,
  twitter: {
    card: 'summary_large_image',
  },
};

export default pageMetadata;
