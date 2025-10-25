import WormCalculatorClient from '@/components/WormCalculatorClient/WormCalculatorClient';
import { getPostRecommendations } from '@/lib/posts';

import structuredData from './structuredData.json';

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
      'matojen määrä',
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
