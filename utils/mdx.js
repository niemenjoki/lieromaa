// lib/mdx.js - Core MDX utilities
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const POSTS_DIR = 'posts';

/**
 * Get all post directories
 */
export function getAllPostSlugs() {
  const files = fs.readdirSync(POSTS_DIR);
  return files
    .filter(
      (f) => !f.startsWith('draft') && fs.statSync(path.join(POSTS_DIR, f)).isDirectory()
    )
    .map((f) => f);
}

/**
 * Get metadata for a single post
 */
export function getPostMetadata(slug) {
  const postDir = path.join(process.cwd(), 'posts', slug);
  const metadataPath = path.join(postDir, 'data.json');
  const structuredDataPath = path.join(postDir, 'structuredData.json');

  if (!fs.existsSync(metadataPath)) {
    throw new Error(`No data.json found for post: ${slug}`);
  }

  let metadata;
  try {
    const raw = fs.readFileSync(metadataPath, 'utf-8');
    metadata = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse data.json for post: ${slug} – ${err.message}`);
  }

  if (fs.existsSync(structuredDataPath)) {
    try {
      const raw = fs.readFileSync(structuredDataPath, 'utf-8');
      const structuredData = JSON.parse(raw);
      metadata.structuredData = structuredData;
    } catch (err) {
      console.warn(
        `Failed to parse structuredData.json for post: ${slug} – ${err.message}`
      );
    }
  } else {
    console.warn(`No structuredData.json found for post: ${slug}`);
  }
  metadata.slug = slug;
  return metadata;
}

/**
 * Get all posts with metadata (excluding drafts)
 */
export function getAllPosts() {
  const slugs = getAllPostSlugs();
  const posts = slugs.map((slug) => getPostMetadata(slug));
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

/**
 * Get posts for a specific tag with pagination
 */
export function getPostsByTag(tag, pageIndex, postsPerPage) {
  const allPosts = getAllPosts();

  const postsForTag = allPosts.filter((post) => {
    const tags = post.tags.map((t) => t.trim().toLowerCase().replaceAll(' ', '-'));
    return tags.includes(tag.toLowerCase());
  });

  const numPages = Math.ceil(postsForTag.length / postsPerPage);
  const pageIdx = pageIndex - 1;
  const pagePosts = postsForTag.slice(
    pageIdx * postsPerPage,
    (pageIdx + 1) * postsPerPage
  );

  return { posts: pagePosts, numPages, total: postsForTag.length };
}

/**
 * Get paginated posts for main blog
 */
export function getPaginatedPosts(pageIndex, postsPerPage) {
  const allPosts = getAllPosts();
  const numPages = Math.ceil(allPosts.length / postsPerPage);
  const pageIdx = pageIndex - 1;
  const pagePosts = allPosts.slice(pageIdx * postsPerPage, (pageIdx + 1) * postsPerPage);

  return { posts: pagePosts, numPages, total: allPosts.length };
}

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
