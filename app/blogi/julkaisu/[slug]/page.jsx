import { notFound } from 'next/navigation';

import Advert from '@/components/Advert/Advert';
import MdxArticlePage from '@/components/MdxArticlePage/MdxArticlePage';
import PostRecommendation from '@/components/PostRecommendation/PostRecommendation';
import SocialShareButtons from '@/components/SocialShareButtons/SocialShareButtons';
import { CONTENT_TYPES } from '@/data/vars.mjs';
import {
  getAllContentSlugs,
  getContentMdxSource,
  getContentMetadata,
  getPostRecommendations,
} from '@/lib/content/index.mjs';
import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';

export async function generateStaticParams() {
  const slugs = getAllContentSlugs({ type: CONTENT_TYPES.POST });
  return slugs.map((slug) => ({
    slug,
  }));
}

export { default as generateMetadata } from './generateMetadata';

export default async function PostPage({ params }) {
  const { slug } = await params;
  let data;
  let mdxContent;
  try {
    data = getContentMetadata({ type: CONTENT_TYPES.POST, slug });
    mdxContent = getContentMdxSource({ type: CONTENT_TYPES.POST, slug });
  } catch {
    notFound();
  }

  const recommendedPosts = await getPostRecommendations({
    self: slug,
    keywords: [...data.tags, ...data.keywords],
  });

  const { structuredData } = data;

  return (
    <>
      <MdxArticlePage
        structuredData={structuredData}
        title={data.title}
        dateContent={
          <>
            Julkaistu: {formatFinnishDate(data.publishedAt)}
            {data.updatedAt
              ? ` (Päivitetty: ${formatFinnishDate(data.updatedAt)})`
              : undefined}
          </>
        }
        source={mdxContent}
      />

      <SocialShareButtons title={data.title} text={data.description} tags={data.tags} />
      <Advert />
      <PostRecommendation posts={recommendedPosts} />
    </>
  );
}
