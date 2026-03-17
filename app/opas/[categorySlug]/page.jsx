import { notFound } from 'next/navigation';

import Advert from '@/components/Advert/Advert';
import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import PostPreview from '@/components/PostPreview/PostPreview';
import { CONTENT_TYPES, GUIDE_CATEGORIES, SITE_URL } from '@/data/site/constants.mjs';
import {
  getAllContent,
  getGuideCategoryPageData,
  getGuidesByCategory,
} from '@/lib/content/index.mjs';
import { createCollectionStructuredData } from '@/lib/structuredData/createCollectionStructuredData.mjs';

export { default as generateMetadata } from './generateMetadata';

export function generateStaticParams() {
  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE });
  const categorySet = new Set();

  guides.forEach((guide) => {
    const category = guide.category.name;
    if (!GUIDE_CATEGORIES.includes(category)) {
      throw new Error(`Guide ${guide.title} uses an unknown category ${category}`);
    }
    categorySet.add(category);
  });

  return Array.from(categorySet)
    .sort()
    .map((category) => ({ categorySlug: category.replaceAll(' ', '-') }));
}

export default async function GuideCategoryPage({ params }) {
  const { categorySlug } = await params;
  const pageData = getGuideCategoryPageData(categorySlug);
  const guides = getGuidesByCategory(pageData.categoryName).sort(
    (a, b) => a.category.pagePosition - b.category.pagePosition
  );
  if (guides.length === 0) {
    notFound();
  }

  const ldJSON = createCollectionStructuredData({
    pageUrl: pageData.pageUrl,
    pageName: pageData.pageName,
    description: pageData.description,
    breadcrumbItems: pageData.breadcrumbItems,
    itemListElement: guides.map((guide, i) => ({
      '@type': 'ListItem',
      name: guide.title,
      position: i + 1,
      url: `${SITE_URL}/opas/${categorySlug}/${guide.slug}`,
    })),
  });

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
            { name: pageData.categoryName, href: pageData.pagePath },
          ]}
        />
        <h1>Oppaat: {pageData.categoryName}</h1>
        {guides.map((guide, index) => (
          <PostPreview
            key={index}
            post={guide}
            overrideHref={`/opas/${categorySlug}/${guide.slug}`}
          />
        ))}
        <Advert />
      </div>
    </>
  );
}
