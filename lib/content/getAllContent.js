import { getAllContentSlugs } from './getAllContentSlugs';
import { getContentMetadata } from './getContentMetadata';

/**
 * Get all content by type with metadata (excluding drafts)
 */
export function getAllContent({ type }) {
  const slugs = getAllContentSlugs({ type });
  const content = slugs.map((slug) => getContentMetadata({ type, slug }));
  return content;
}
