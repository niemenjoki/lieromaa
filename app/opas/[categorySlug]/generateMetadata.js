import { CONTENT_TYPES, POSTS_PER_PAGE } from '@/data/vars.mjs';
import { getAllContentSlugs } from '@/lib/content/index.mjs';
import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';

export default async function generateMetadata({ params }) {
  return withDefaultMetadata({});
}
