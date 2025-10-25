import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default function generateMetadata() {
  const title = 'Osta kompostimatoja | Lieromaa';
  const description =
    'Tilaa kotimaisia kompostimatoja (Eisenia fetida) helposti postitettuna koko Suomeen. Aloita oma matokomposti Lieromaan madoilla!';
  const canonicalUrl = '/madot';
  const image = {
    url: '/images/wormspage/kompostimadot-kammenella.avif',
    width: 1536,
    height: 1024,
    alt: 'Kompostimatoja ja matokompostin sisältöä kämmenellä',
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
