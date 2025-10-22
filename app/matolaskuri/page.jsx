import WormCalculatorClient from '@/components/WormCalculatorClient/WormCalculatorClient';
import { SITE_URL } from '@/data/vars';
import { getPostRecommendations } from '@/lib/posts';

export const metadata = {
  title: 'Matolaskuri | Lieromaa',
  description:
    'Syötä kotitaloutesi tiedot ja laskuri arvioi tuottamasi biojätteen määrän sekä tarvittavan matomäärän.',
  alternates: {
    canonical: `${SITE_URL}/matolaskuri`,
  },
  openGraph: {
    title: 'Matolaskuri | Lieromaa',
    description:
      'Syötä kotitaloutesi tiedot ja laskuri arvioi tuottamasi biojätteen määrän sekä tarvittavan matomäärän.',
    url: `${SITE_URL}/matolaskuri`,
    images: [
      {
        url: 'https://www.lieromaa.fi/images/pages/matolaskuri/matolaskuri-naytto-1200.jpg',
        width: 1200,
        height: 800,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matolaskuri | Lieromaa',
    description:
      'Syötä kotitaloutesi tiedot ja laskuri arvioi tuottamasi biojätteen määrän sekä tarvittavan matomäärän.',
  },
};

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
        url: 'https://www.lieromaa.fi/images/luomuliero_logo_1024.png',
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
