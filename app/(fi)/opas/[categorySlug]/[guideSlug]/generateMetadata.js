import { notFound } from 'next/navigation';

import { getGuidePath, isMatchingGuideCategorySlug } from '@/lib/content/guideRoutes.mjs';
import { getContentMetadata } from '@/lib/content/index.mjs';
import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';
import { CONTENT_TYPES } from '@/lib/site/constants.mjs';

export default async function generateMetadata({ params }) {
  const { categorySlug, guideSlug } = await params;
  const data = getContentMetadata({ type: CONTENT_TYPES.GUIDE, slug: guideSlug });

  if (
    !isMatchingGuideCategorySlug({
      categoryName: data.category.name,
      categorySlug,
    })
  ) {
    notFound();
  }

  const title = data.title || '';
  const description = data.description || '';
  const url = getGuidePath({
    categoryName: data.category.name,
    guideSlug,
  });
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
