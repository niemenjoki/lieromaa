import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default async function generateMetadata({ params }) {
  const { pageIndex } = await params;

  const pageIndexInt = parseInt(pageIndex, 10);

  let canonical, ogUrl;

  if (!pageIndex) {
    canonical = '/';
    ogUrl = '/';
  } else if (pageIndexInt === 1) {
    canonical = '/';
    ogUrl = `/blogi/sivu/${pageIndexInt}`;
  } else {
    canonical = `/blogi/sivu/${pageIndexInt}`;
    ogUrl = canonical;
  }

  const customMetadata = {
    alternates: {
      canonical,
    },
    openGraph: {
      url: ogUrl,
    },
  };

  return withDefaultMetadata(customMetadata);
}
