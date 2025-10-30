import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  const category = categorySlug.replaceAll('-', ' ');
  const title = `Lieromaan oppaat aiheeesta: ${category}`;
  const description = `Lue käytännön vinkit ja ohjeet aiheesta ${category} – miten perustaa, hoitaa ja hyödyntää matokompostia.`;
  const pageURL = `/opas/${categorySlug}`;

  const customMetadata = {
    title,
    description,
    alternates: {
      canonical: pageURL,
    },
    openGraph: {
      title,
      description,
      url: pageURL,
    },
  };

  return withDefaultMetadata(customMetadata);
}
