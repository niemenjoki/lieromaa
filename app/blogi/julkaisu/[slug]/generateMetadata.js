import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';
import { getPostMetadata } from '@/lib/posts';

export default async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = getPostMetadata(slug);

  const title = data.title || '';
  const description = data.excerpt || '';
  const url = `/blogi/julkaisu/${slug}`;
  const image = data.image || {
    url: '/images/luomuliero_logo_1024.avif',
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
