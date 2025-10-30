import { CONTENT_TYPES } from '@/data/vars.mjs';

import { getAllContentSlugs } from './getAllContentSlugs.mjs';
import { getContentMetadata } from './getContentMetadata.mjs';

/**
 * Get all content by type with metadata (excluding drafts)
 */
export function getAllContent({ type }) {
  if (type === CONTENT_TYPES.ALL) {
    const posts = getAllContent({ type: CONTENT_TYPES.POST });
    const guides = getAllContent({ type: CONTENT_TYPES.GUIDE });
    return { posts, guides };
  }
  const slugs = getAllContentSlugs({ type });
  const content = slugs.map((slug) => getContentMetadata({ type, slug }));
  return content;
}
