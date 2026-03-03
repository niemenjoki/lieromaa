import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default function generateMetadata() {
  const title =
    'Aloituspakkauksen käyttöönotto – matokompostorin käynnistysohje | Lieromaa';
  const description =
    'Vaiheittainen ohje Lieromaan matokompostorin aloituspakkauksen käyttöönottoon: kookoskuidun kostutus, kerrosten rakentaminen, matojen totuttelu ja ensimmäinen ruokinta.';
  const canonicalUrl = '/tuotteet/matokompostin-aloituspakkaus/kayttoonotto';
  const image = {
    url: '/images/content/aloituspakkauksen_aloitus.avif',
    width: 1200,
    height: 900,
    alt: 'Matokompostorin aloituspakkauksen käyttöönotto',
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
