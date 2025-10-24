import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default async function generateMetadata({ params }) {
  const { pageIndex } = await params;

  const customMetadata = {
    alternates: {
      canonical: `/blogi/sivu/${pageIndex}`,
    },

    openGraph: {
      url: `/blogi/sivu/${pageIndex}`,
    },
  };

  return withDefaultMetadata(customMetadata);
}
