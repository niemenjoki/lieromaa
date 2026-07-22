import { SITE_URL } from '@/lib/site/constants.mjs';
import { createCollectionStructuredData } from '@/lib/structuredData/createCollectionStructuredData.mjs';

import GuideHub, { getGuideHubData } from './GuideHub';
import { canonicalUrl, description, pageName } from './pageMetadata';

export { default as generateMetadata } from './generateMetadata';

export default function GuideHubPage() {
  const data = getGuideHubData();

  const structuredData = createCollectionStructuredData({
    pageUrl: `${SITE_URL}${canonicalUrl}`,
    pageName,
    description,
    breadcrumbItems: [
      { name: 'Etusivu', url: `${SITE_URL}/` },
      { name: 'Opas', url: `${SITE_URL}${canonicalUrl}` },
    ],
    itemListElement: data.categories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: category.label,
      url: `${SITE_URL}/opas/${category.slug}`,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <GuideHub
        breadcrumbItems={[
          { name: 'Etusivu', href: '/' },
          { name: 'Opas', href: canonicalUrl },
        ]}
        data={data}
        description={`${description} Hae kokoelmasta aiheella tai rajaa näkymä perustamiseen, kompostorin hoitoon tai valmiin kompostin hyödyntämiseen.`}
        pageName={pageName}
        title="Matokompostoinnin opaskirjasto"
      />
    </>
  );
}
