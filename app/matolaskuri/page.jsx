import WormCalculatorClient from '@/components/WormCalculatorClient/WormCalculatorClient';
import { getContentRecommendations } from '@/lib/content/index.mjs';

import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

export default async function Page() {
  const recommendations = getContentRecommendations({
    current: {
      type: 'PAGE',
      slug: 'matolaskuri',
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
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <WormCalculatorClient recommendations={recommendations} />
    </>
  );
}
