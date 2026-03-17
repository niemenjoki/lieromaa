import { CONTENT_TYPES } from '../../data/site/constants.mjs';
import { getAllContentSlugs } from './getAllContentSlugs.mjs';
import { getContentMetadata } from './getContentMetadata.mjs';

function getContentPublishedDate(content) {
  return content.publishedAt ?? content.updatedAt ?? '';
}

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
  const content = slugs
    .map((slug) => getContentMetadata({ type, slug }))
    .sort(
      (a, b) =>
        new Date(getContentPublishedDate(b)) - new Date(getContentPublishedDate(a))
    );
  return content;
}
