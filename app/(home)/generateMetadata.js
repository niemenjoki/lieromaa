import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default function generateMetadata() {
  const title = 'Lieromaa – Kompostimadot ja oppaat matokompostointiin';
  const description =
    'Tilaa kotimaiset kompostimadot ja opi matokompostointi helposti. Lieromaan oppaat ja blogi auttavat perustamaan, hoitamaan ja hyödyntämään oman kompostorin.';

  const customMetadata = {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      url: '/',
    },
  };

  return withDefaultMetadata(customMetadata);
}
