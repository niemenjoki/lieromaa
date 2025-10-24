import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default function generateMetadata() {
  const title = 'Tilaus- ja toimitusehdot | Lieromaa';
  const description =
    'Tutustu Lieromaan tilausta, maksua, toimitusta ja palautuksia koskeviin ehtoihin. Ehdot voimassa 1.10.2025 alkaen.';
  const canonicalUrl = '/tilausehdot';

  const customMetadata = {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl },
    twitter: { title, description },
  };

  return withDefaultMetadata(customMetadata);
}
