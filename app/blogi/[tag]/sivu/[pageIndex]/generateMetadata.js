import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default async function generateMetadata({ params }) {
  const { tag, pageIndex } = await params;
  const tagName = tag.replaceAll('-', ' ');
  const decodedTag = decodeURIComponent(tagName);

  const title = `Avainsana ${decodedTag} | Lieromaa`;
  const description = `Julkaisut avainsanalla ${decodedTag}: Lieromaan blogi käsittelee matokompostointia, kompostimatoja ja kestävää jätteenkäsittelyä.`;
  const pageURL = `/blogi/${tag}/sivu/${pageIndex}`;

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
