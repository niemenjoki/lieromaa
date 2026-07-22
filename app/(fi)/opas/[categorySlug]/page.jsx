import { notFound } from 'next/navigation';

import { getAllContent, getGuideCategoryPageData } from '@/lib/content/index.mjs';
import { CONTENT_TYPES, GUIDE_CATEGORIES, SITE_URL } from '@/lib/site/constants.mjs';
import { createCollectionStructuredData } from '@/lib/structuredData/createCollectionStructuredData.mjs';

import GuideHub, { getGuideHubData } from '../GuideHub';

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
  const data = getGuideHubData();
  const category = data.categories.find(
    (candidate) => candidate.name === pageData.categoryName
  );
  if (!category) {
    notFound();
  }
  const guides = data.guides.filter((guide) => guide.category === pageData.categoryName);

  const ldJSON = createCollectionStructuredData({
    pageUrl: pageData.pageUrl,
    pageName: pageData.pageName,
    description: pageData.description,
    breadcrumbItems: pageData.breadcrumbItems,
    itemListElement: guides.map((guide, i) => ({
      '@type': 'ListItem',
      name: guide.title,
      position: i + 1,
      url: `${SITE_URL}${guide.href}`,
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
      <GuideHub
        breadcrumbItems={[
          { name: 'Etusivu', href: '/' },
          { name: 'Opas', href: '/opas' },
          { name: category.label, href: pageData.pagePath },
        ]}
        data={data}
        description={`${pageData.description} Hae aiheen sisältä tai vaihda rajaus toiseen aihealueeseen.`}
        eyebrow={`Lieromaan opas · ${category.label}`}
        initialCategoryName={category.name}
        pageName={pageData.pageName}
        title={`Oppaat: ${category.label}`}
      />
    </>
  );
}
