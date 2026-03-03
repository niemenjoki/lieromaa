import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default function generateMetadata() {
  const title =
    'Matokompostorin aloituspakkaus kotiin – valmis läpivirtauskompostori | Lieromaa';

  const description =
    'Lieromaan aloituspakkaus tekee aloituksesta helppoa: kolmen laatikon kompostori, petimateriaali ja kompostimadot valmiina käyttöön.';

  const canonicalUrl = '/tuotteet/matokompostin-aloituspakkaus';

  const image = {
    url: '/images/starterkit/aloituspakkaus_suljettu_matokompostori.avif',
    width: 1200,
    height: 800,
    alt: 'Valmis kolmen laatikon matokompostori',
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
