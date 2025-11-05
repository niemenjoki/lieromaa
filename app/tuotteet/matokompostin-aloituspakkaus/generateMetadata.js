import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default function generateMetadata() {
  const title = 'Matokompostorin aloituspakkaus - tulossa myyntiin | Lieromaa';
  const description =
    'Lieromaan matokompostorin aloituspakkaus sisältää kaiken tarvittavan kompostoinnin aloittamiseen. Tulossa myyntiin keväällä 2026.';
  const canonicalUrl = '/tuotteet/aloituspakkaus';
  const image = {
    url: '/images/content/matokakkaa_kadella.avif',
    width: 1200,
    height: 800,
    alt: 'Kourallinen tummaa matokakkaa',
  };

  const customMetadata = {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [image],
    },
    twitter: {
      title,
      description,
      images: [image.url],
    },
  };

  return withDefaultMetadata(customMetadata);
}
