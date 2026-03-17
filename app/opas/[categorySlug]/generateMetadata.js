import { getGuideCategoryPageData } from '@/lib/content/index.mjs';
import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  const pageData = getGuideCategoryPageData(categorySlug);

  const customMetadata = {
    title: pageData.title,
    description: pageData.description,
    alternates: {
      canonical: pageData.pagePath,
    },
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url: pageData.pagePath,
    },
  };

  return withDefaultMetadata(customMetadata);
}
