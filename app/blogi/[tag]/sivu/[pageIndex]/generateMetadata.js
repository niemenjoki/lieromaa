import { getBlogTagPageData, getPostsByTag } from '@/lib/content/index.mjs';
import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';
import { POSTS_PER_PAGE } from '@/lib/site/constants.mjs';

export default async function generateMetadata({ params }) {
  const { tag, pageIndex } = await params;
  const pageData = getBlogTagPageData({ tag, pageIndex });
  const { numPages } = getPostsByTag(
    pageData.tagSlug,
    pageData.pageIndexInt,
    POSTS_PER_PAGE
  );

  const isFirst = pageData.pageIndexInt === 1;
  const isLast = pageData.pageIndexInt === numPages;

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
    pagination: {
      ...(isFirst ? {} : { previous: `/blogi/${tag}/sivu/${pageData.pageIndexInt - 1}` }),
      ...(isLast ? {} : { next: `/blogi/${tag}/sivu/${pageData.pageIndexInt + 1}` }),
    },
  };

  return withDefaultMetadata(customMetadata);
}
