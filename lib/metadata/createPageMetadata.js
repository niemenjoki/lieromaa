import { withDefaultMetadata } from './withDefaultMetadata';

export function createPageMetadata({
  title,
  description,
  canonicalUrl,
  image,
  openGraph = {},
  robots,
  twitter,
}) {
  const customMetadata = {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      ...(image ? { images: [image] } : {}),
      ...openGraph,
    },
  };

  if (robots) {
    customMetadata.robots = robots;
  }

  if (image || twitter) {
    customMetadata.twitter = {
      title,
      description,
      ...(image ? { images: [image.url] } : {}),
      ...twitter,
    };
  }

  return withDefaultMetadata(customMetadata);
}
