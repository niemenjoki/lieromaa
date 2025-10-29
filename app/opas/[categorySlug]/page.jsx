import PostPreview from '@/components/PostPreview/PostPreview';
import { CONTENT_TYPES } from '@/data/vars.mjs';
import { getAllContent, getGuidesByCategory } from '@/lib/content/index.mjs';

export { default as generateMetadata } from './generateMetadata';

export function generateStaticParams() {
  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE });

  return guides.map((guide) => {
    return { categorySlug: guide.category.name.replaceAll(' ', '-') };
  });
}

export default async function GuideCategoryPage({ params }) {
  const { categorySlug } = await params;
  const category = decodeURIComponent(categorySlug.replaceAll('-', ' '));
  const guides = getGuidesByCategory(category).sort(
    (a, b) => a.category.pagePosition - b.category.pagePosition
  );

  return (
    <div>
      <h1>Oppaat: {category}</h1>
      {guides.map((guide, index) => (
        <PostPreview
          key={index}
          post={guide}
          overrideHref={`/opas/${categorySlug}/${guide.slug}`}
        />
      ))}
    </div>
  );
}

//
