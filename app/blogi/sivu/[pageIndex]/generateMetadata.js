import { CONTENT_TYPES, POSTS_PER_PAGE } from '@/data/vars.mjs';
import { getAllContentSlugs, getBlogPageData } from '@/lib/content/index.mjs';
import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

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
    alternates: {
      canonical: pageData.pagePath,
    },
    openGraph: {
      url: pageData.pagePath,
    },
    pagination: {
      ...(isFirst ? {} : { previous: previousPagePath }),
      ...(isLast ? {} : { next: `/blogi/sivu/${pageData.pageIndexInt + 1}` }),
    },
  };

  return withDefaultMetadata(customMetadata);
}
