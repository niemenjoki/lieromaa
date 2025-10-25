import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default function generateMetadata() {
  const title = 'Tietoa | Lieromaa';
  const description =
    'Tilaa kotimaisia kompostimatoja (Eisenia fetida) ilman toimituskuluja koko Suomeen. Tarjous voimassa 30.11.2025 asti.';
  const canonicalUrl = '/tietoa';

  const customMetadata = {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };

  return withDefaultMetadata(customMetadata);
}
