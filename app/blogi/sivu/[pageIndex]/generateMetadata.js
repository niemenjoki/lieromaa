import { getAllContentSlugs, getBlogPageData } from '@/lib/content/index.mjs';
import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';
import { CONTENT_TYPES, POSTS_PER_PAGE } from '@/lib/site/constants.mjs';

export default async function generateMetadata({ params }) {
  const { pageIndex } = await params;
  const pageData = getBlogPageData(pageIndex);

  const numPages = Math.ceil(
    getAllContentSlugs({ type: CONTENT_TYPES.POST }).length / POSTS_PER_PAGE
  );
  const isFirst = pageData.pageIndexInt === 1;
  const isLast = pageData.pageIndexInt === numPages;
  const previousPagePath =
    pageData.pageIndexInt === 2 ? '/blogi' : `/blogi/sivu/${pageData.pageIndexInt - 1}`;

  const customMetadata = {
    title: pageData.pageName,
    description: pageData.description,
    alternates: {
      canonical: pageData.pagePath,
    },
    openGraph: {
      title: pageData.pageName,
      description: pageData.description,
      url: pageData.pagePath,
    },
    pagination: {
      ...(isFirst ? {} : { previous: previousPagePath }),
      ...(isLast ? {} : { next: `/blogi/sivu/${pageData.pageIndexInt + 1}` }),
    },
  };

  return withDefaultMetadata(customMetadata);
}
