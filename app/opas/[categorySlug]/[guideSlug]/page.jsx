import { notFound } from 'next/navigation';

import Advert from '@/components/Advert/Advert';
import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import GuideFeedbackBox from '@/components/GuideFeedbackBox/GuideFeedbackBox';
import MdxArticlePage from '@/components/MdxArticlePage/MdxArticlePage';
import SocialShareButtons from '@/components/SocialShareButtons/SocialShareButtons';
import {
  getAllContent,
  getContentMdxSource,
  getContentMetadata,
} from '@/lib/content/index.mjs';
import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';
import { CONTENT_TYPES } from '@/lib/site/constants.mjs';

export function generateStaticParams() {
  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE });

  return guides.map((guide) => ({
    categorySlug: guide.category.name.replaceAll(' ', '-'),
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

  const { structuredData } = data;

  return (
    <>
      <MdxArticlePage
        structuredData={structuredData}
        title={data.title}
        dateContent={`Päivitetty: ${formatFinnishDate(data.updatedAt)}`}
        source={mdxContent}
        preTitle={
          <Breadcrumbs
            items={[
              { name: 'Etusivu', href: '/' },
              { name: 'Opas', href: '/opas' },
              { name: data.category.name, href: `/opas/${categorySlug}` },
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

      <SocialShareButtons
        title={data.title}
        text={data.description}
        tags={data.keywords}
      />
      <Advert />
    </>
  );
}
