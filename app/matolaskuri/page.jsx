import WormCalculatorClient from '@/components/WormCalculatorClient/WormCalculatorClient';
import { getPostRecommendations } from '@/lib/content/index.mjs';

import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

export default async function Page() {
  const recommendedPosts = await getPostRecommendations({
    self: 'laskuri',
    keywords: [
      'fosfori',
      'kalium',
      'kasvit',
      'kompostorin perustaminen',
      'matojen hankinta',
      'matojen paino',
      'matokompostointi',
      'npk',
      'opas',
      'perustaminen',
      'ravinteet',
      'typpi',
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <WormCalculatorClient recommendedPosts={recommendedPosts} />
    </>
  );
}
