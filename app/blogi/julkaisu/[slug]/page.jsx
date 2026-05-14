import { notFound } from 'next/navigation';

import Advert from '@/components/Advert/Advert';
import ContentRecommendations from '@/components/ContentRecommendations/ContentRecommendations';
import MdxArticlePage from '@/components/MdxArticlePage/MdxArticlePage';
import {
  getAllContentSlugs,
  getContentMdxSource,
  getContentMetadata,
  getContentRecommendations,
} from '@/lib/content/index.mjs';
import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';
import { CONTENT_TYPES } from '@/lib/site/constants.mjs';

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

  const recommendations = getContentRecommendations({
    current: {
      ...data,
      type: CONTENT_TYPES.POST,
      slug,
      keywords: [...(data.tags ?? []), ...(data.keywords ?? [])],
    },
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
        share={{
          title: data.title,
          tags: data.tags,
        }}
      />

      <Advert />
      <ContentRecommendations recommendations={recommendations} />
    </>
  );
}
