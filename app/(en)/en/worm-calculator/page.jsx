import WormCalculatorClient from '@/components/WormCalculatorClient/WormCalculatorClient';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import { createLocalizedPageStructuredData } from '@/lib/structuredData/createLocalizedPageStructuredData.mjs';

const pageMetadata = {
  language: 'en',
  title: 'Worm calculator | Lieromaa',
  description:
    'Estimate a suitable starting weight of compost worms from your household size and diet with Lieromaa’s English worm calculator.',
  canonicalUrl: '/en/worm-calculator',
};

export function generateMetadata() {
  return createLocalizedPageMetadata(pageMetadata);
}

export default function EnglishWormCalculatorPage() {
  const structuredData = createLocalizedPageStructuredData({
    ...pageMetadata,
    name: 'Worm calculator – estimate a starting weight of compost worms',
    mainEntity: {
      '@type': 'Thing',
      name: 'Compost-worm weight calculator',
      description:
        'An interactive tool that estimates weekly suitable food waste and a corresponding starting weight of compost worms.',
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
      <WormCalculatorClient language="en" />
    </>
  );
}
