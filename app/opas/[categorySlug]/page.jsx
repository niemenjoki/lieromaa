import { notFound } from 'next/navigation';

import Advert from '@/components/Advert/Advert';
import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import PostPreview from '@/components/PostPreview/PostPreview';
import { CONTENT_TYPES, GUIDE_CATEGORIES } from '@/data/vars.mjs';
import { SITE_URL } from '@/data/vars.mjs';
import { getAllContent, getGuidesByCategory } from '@/lib/content/index.mjs';

import structuredData from './structuredData.json';

export { default as generateMetadata } from './generateMetadata';

export function generateStaticParams() {
  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE });
  return guides.map((guide) => {
    const category = guide.category.name;
    if (!GUIDE_CATEGORIES.includes(category)) {
      console.log({ title: guide.title, category });
      throw new Error(`Guide ${guide.title} uses an unknown category ${category}`);
    }
    return { categorySlug: category.replaceAll(' ', '-') };
  });
}

export default async function GuideCategoryPage({ params }) {
  const { categorySlug } = await params;
  const category = decodeURIComponent(categorySlug.replaceAll('-', ' '));
  const guides = getGuidesByCategory(category).sort(
    (a, b) => a.category.pagePosition - b.category.pagePosition
  );
  if (guides.length === 0) {
    notFound();
  }

  const data = JSON.parse(JSON.stringify(structuredData));
  data['@graph'][1]['itemListElement'] = guides.map((guide, i) => ({
    '@type': 'ListItem',
    name: guide.title,
    position: i + 1,
    url: `${SITE_URL}/opas/${categorySlug}/${guide.slug}`,
  }));

  // Replace placeholders
  const ldJSON = JSON.parse(
    JSON.stringify(data)
      .replaceAll('[categorySlug]', categorySlug)
      .replaceAll('[categoryName]', category)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ldJSON).replace(/</g, '\\u003c'),
        }}
      />
      <div>
        <Breadcrumbs
          items={[
            { name: 'Etusivu', href: '/' },
            { name: 'Opas' },
            { name: category, href: `/opas/${categorySlug}` },
          ]}
        />
        <h1>Oppaat: {category}</h1>
        {guides.map((guide, index) => (
          <PostPreview
            key={index}
            post={guide}
            overrideHref={`/opas/${categorySlug}/${guide.slug}`}
          />
        ))}
        <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
      </div>
    </>
  );
}

//
