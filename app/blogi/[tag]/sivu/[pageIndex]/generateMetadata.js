import { POSTS_PER_PAGE } from '@/data/vars.mjs';
import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';
import { getPostsByTag } from '@/lib/posts';

export default async function generateMetadata({ params }) {
  const { tag, pageIndex } = await params;
  const tagName = tag.replaceAll('-', ' ');
  const decodedTag = decodeURIComponent(tagName);

  const title = `Avainsana ${decodedTag} | Lieromaa`;
  const description = `Julkaisut avainsanalla ${decodedTag}: Lieromaan blogi käsittelee matokompostointia, kompostimatoja ja kestävää jätteenkäsittelyä.`;
  const pageURL = `/blogi/${tag}/sivu/${pageIndex}`;

  const pageIndexInt = parseInt(pageIndex, 10);

  const { numPages } = getPostsByTag(decodeURIComponent(tag), pageIndex, POSTS_PER_PAGE);

  const isFirst = pageIndexInt === 1;
  const isLast = pageIndexInt === numPages;

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
    pagination: {
      ...(isFirst ? {} : { previous: `/blogi/${tag}/sivu/${pageIndexInt - 1}` }),
      ...(isLast ? {} : { next: `/blogi/${tag}/sivu/${pageIndexInt + 1}` }),
    },
  };

  return withDefaultMetadata(customMetadata);
}
