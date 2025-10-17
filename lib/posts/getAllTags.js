import { getAllPosts } from './getAllPosts';

/**
 * Get all unique tags from all posts
 */
export function getAllTags() {
  const allPosts = getAllPosts();
  const tagsSet = new Set();

  allPosts.forEach((post) => {
    post.tags.map((t) => t.trim()).forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}
