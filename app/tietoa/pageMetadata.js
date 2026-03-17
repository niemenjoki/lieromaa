import { aboutPage } from '@/lib/site/pageRecords.mjs';

export const { pageName, title, description, canonicalUrl, pageUrl } = aboutPage;

const pageMetadata = {
  title,
  description,
  canonicalUrl,
  twitter: {
    card: 'summary',
  },
};

export default pageMetadata;
