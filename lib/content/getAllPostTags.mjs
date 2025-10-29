import { CONTENT_TYPES } from '../../data/vars.mjs';
import { getAllContent } from './getAllContent.mjs';

/**
 * Get all unique tags from all posts
 */
export function getAllPostTags() {
  const allPosts = getAllContent({ type: CONTENT_TYPES.POST });
  const tagsSet = new Set();

  allPosts.forEach((post) => {
    post.tags.map((t) => t.trim()).forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}
