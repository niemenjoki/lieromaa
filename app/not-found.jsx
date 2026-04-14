import ClientNotFoundPage from '@/components/NotFoundClient/NotFoundClient';
import { getAllContent } from '@/lib/content/index.mjs';
import { CONTENT_TYPES } from '@/lib/site/constants.mjs';
import { getSearchableSitePages } from '@/lib/siteStructure.mjs';

export const metadata = {
  title: 'Sivua ei löytynyt | Lieromaa',
  description: 'Hakemaasi sivua ei löytynyt. Palaa etusivulle tai selaa blogia.',
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const { posts, guides } = getAllContent({ type: CONTENT_TYPES.ALL });
  const searchablePages = getSearchableSitePages({ context: 'notFound' });

  const resultGuides = guides.map((guide) => {
    const categorySlug = guide.category.name.replaceAll(' ', '-');
    return { altPath: `opas/${categorySlug}`, ...guide };
  });

  return <ClientNotFoundPage content={[...posts, ...resultGuides, ...searchablePages]} />;
}
