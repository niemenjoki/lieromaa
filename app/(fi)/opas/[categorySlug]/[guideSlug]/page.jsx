import { notFound } from 'next/navigation';

import Advert from '@/components/Advert/Advert';
import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import ContentRecommendations from '@/components/ContentRecommendations/ContentRecommendations';
import GuideFeedbackBox from '@/components/GuideFeedbackBox/GuideFeedbackBox';
import MdxArticlePage from '@/components/MdxArticlePage/MdxArticlePage';
import WormHuntFooterPortal from '@/components/WormHunt/WormHuntFooterPortal';
import WormHuntSpot from '@/components/WormHunt/WormHuntSpot';
import {
  getGuideCategorySlug,
  getGuidePath,
  isMatchingGuideCategorySlug,
} from '@/lib/content/guideRoutes.mjs';
import {
  HOT_COMPOSTING_CATEGORY_NAME,
  HOT_COMPOSTING_GUIDE_SLUGS,
} from '@/lib/content/hotCompostingGuide.mjs';
import {
  getAllContent,
  getContentMdxSource,
  getContentMetadata,
  getContentRecommendations,
} from '@/lib/content/index.mjs';
import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';
import { CONTENT_TYPES } from '@/lib/site/constants.mjs';
import {
  getWormHuntEntry,
  shouldPlaceWormBeforeFooter,
  shouldPlaceWormInFooter,
} from '@/lib/wormHunt/trail.server.mjs';

export function generateStaticParams() {
  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE });

  return guides.map((guide) => ({
    categorySlug: getGuideCategorySlug(guide.category.name),
    guideSlug: guide.slug,
  }));
}

export { default as generateMetadata } from './generateMetadata';

export default async function GuidePage({ params }) {
  const { guideSlug, categorySlug } = await params;
  let data;
  let mdxContent;
  try {
    data = getContentMetadata({ type: CONTENT_TYPES.GUIDE, slug: guideSlug });
    mdxContent = getContentMdxSource({ type: CONTENT_TYPES.GUIDE, slug: guideSlug });
  } catch {
    notFound();
  }

  if (
    !isMatchingGuideCategorySlug({
      categoryName: data.category.name,
      categorySlug,
    })
  ) {
    notFound();
  }

  const canonicalCategorySlug = getGuideCategorySlug(data.category.name);
  const canonicalGuidePath = getGuidePath({
    categoryName: data.category.name,
    guideSlug,
  });
  const wormHuntEntry = getWormHuntEntry(canonicalGuidePath);
  const { structuredData } = data;
  const isHotCompostingGuide = data.category.name === HOT_COMPOSTING_CATEGORY_NAME;
  const hotCompostingRecommendationCount = Math.max(
    0,
    HOT_COMPOSTING_GUIDE_SLUGS.length - 1
  );
  const recommendations = getContentRecommendations({
    current: {
      ...data,
      type: CONTENT_TYPES.GUIDE,
      slug: guideSlug,
      ...(isHotCompostingGuide
        ? {
            recommendedContent: {
              pinned: HOT_COMPOSTING_GUIDE_SLUGS.filter((slug) => slug !== guideSlug).map(
                (slug) => ({ type: CONTENT_TYPES.GUIDE, slug })
              ),
            },
          }
        : {}),
    },
    ...(isHotCompostingGuide
      ? { maxRecommendations: hotCompostingRecommendationCount }
      : {}),
  });
  const visibleRecommendations =
    !isHotCompostingGuide || recommendations.length === hotCompostingRecommendationCount
      ? recommendations
      : [];

  return (
    <>
      <MdxArticlePage
        structuredData={structuredData}
        title={data.title}
        dateContent={`Päivitetty: ${formatFinnishDate(data.updatedAt)}`}
        source={mdxContent}
        wormHuntEntry={wormHuntEntry}
        share={{
          title: data.title,
          tags: data.keywords,
        }}
        preTitle={
          <Breadcrumbs
            items={[
              { name: 'Etusivu', href: '/' },
              { name: 'Opas', href: '/opas' },
              { name: data.category.name, href: `/opas/${canonicalCategorySlug}` },
              { name: data.title },
            ]}
          />
        }
      />

      <GuideFeedbackBox
        title="Jäikö jokin epäselväksi?"
        description="Jos tämä opas ei vielä vastannut kysymykseesi, voit pyytää tarkennusta tai ehdottaa aihetta, josta tarvitaan uusi opas."
        sourceContext={`guide:${data.category.name}`}
        pageTitle={data.title}
        defaultType="question"
      />

      <Advert />
      <ContentRecommendations recommendations={visibleRecommendations} />
      {shouldPlaceWormBeforeFooter(wormHuntEntry) ? (
        <WormHuntSpot clue={wormHuntEntry.clue} />
      ) : null}
      {shouldPlaceWormInFooter(wormHuntEntry) ? (
        <WormHuntFooterPortal clue={wormHuntEntry.clue} />
      ) : null}
    </>
  );
}
