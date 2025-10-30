import { CONTENT_TYPES } from '@/data/vars.mjs';
import { getContentMetadata } from '@/lib/content/index.mjs';
import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default async function generateMetadata({ params }) {
  const { categorySlug, guideSlug } = await params;
  const data = getContentMetadata({ type: CONTENT_TYPES.GUIDE, slug: guideSlug });

  const title = data.title || '';
  const description = data.description || '';
  const url = `/opas/${categorySlug}/${guideSlug}`;
  const image = data.image || {
    url: '/images/lieromaa_logo_1024.avif',
    width: 1024,
    height: 1024,
    alt: 'Lieromaa logo',
  };

  const customMetadata = {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
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
