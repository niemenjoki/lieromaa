import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default function generateMetadata() {
  const title = 'Tietosuojaseloste | Lieromaa';
  const description =
    'Lieromaan tietosuojaseloste henkilötietojen käsittelystä ja evästeiden käytöstä';
  const canonicalUrl = '/tietosuoja';

  const customMetadata = {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl },
    twitter: { title, description },
  };

  return withDefaultMetadata(customMetadata);
}
