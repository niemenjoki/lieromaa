import WormCalculatorClient from '@/components/WormCalculatorClient/WormCalculatorClient';
import { getPostRecommendations } from '@/lib/posts';

export { default as generateMetadata } from './generateMetadata';

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Matolaskuri',
    url: 'https://www.lieromaa.fi/matolaskuri',
    description:
      'Verkkopohjainen laskuri, joka arvioi kotitalouden biojätteen määrän ja suosittelee tarvittavan kompostimatojen populaation.',
    image: 'https://www.lieromaa.fi/images/pages/matolaskuri/matolaskuri-naytto-1200.jpg',
    datePublished: '2025-09-20T00:00:00+03:00',
    author: {
      '@type': 'Person',
      name: 'Joonas Niemenjoki',
      url: 'https://www.linkedin.com/in/joonasniemenjoki/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lieromaa (Joonas Niemenjoki, Y-tunnus 3002257-7)',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.lieromaa.fi/images/luomuliero_logo_1024.avif',
      },
    },
  },
];

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
