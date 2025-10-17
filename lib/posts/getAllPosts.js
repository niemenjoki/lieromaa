import { getAllPostSlugs } from './getAllPostSlugs';
import { getPostMetadata } from './getPostMetadata';

/**
 * Get all posts with metadata (excluding drafts)
 */
export function getAllPosts() {
  const slugs = getAllPostSlugs();
  const posts = slugs.map((slug) => getPostMetadata(slug));
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}
