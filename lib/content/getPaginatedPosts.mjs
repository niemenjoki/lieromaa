import { CONTENT_TYPES } from '../../data/vars.mjs';
import { getAllContent } from './getAllContent.mjs';

/**
 * Get paginated posts for main blog
 */
export function getPaginatedPosts(pageIndex, postsPerPage) {
  const allPosts = getAllContent({ type: CONTENT_TYPES.POST });
  const numPages = Math.ceil(allPosts.length / postsPerPage);
  const pageIdx = pageIndex - 1;
  const pagePosts = allPosts.slice(pageIdx * postsPerPage, (pageIdx + 1) * postsPerPage);

  return { posts: pagePosts, numPages, total: allPosts.length };
}
