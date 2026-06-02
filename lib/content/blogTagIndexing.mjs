export const MIN_INDEXABLE_BLOG_TAG_POST_COUNT = 3;

export function isIndexableBlogTag(postCount) {
  return postCount >= MIN_INDEXABLE_BLOG_TAG_POST_COUNT;
}
