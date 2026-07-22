import { POSTS_PER_PAGE } from '../site/constants.mjs';
import { isIndexableBlogTag } from './blogTagIndexing.mjs';
import { getAllPostTags } from './getAllPostTags.mjs';
import { getPostsByTag } from './getPostsByTag.mjs';

export function getBlogTagSlug(tag) {
  return tag.trim().toLowerCase().replaceAll(' ', '-');
}

function formatBlogTagLabel(tag) {
  const normalizedTag = tag.trim();
  return normalizedTag.charAt(0).toLocaleUpperCase('fi') + normalizedTag.slice(1);
}

export function getBlogTagArchives() {
  return getAllPostTags()
    .map((tag) => {
      const slug = getBlogTagSlug(tag);
      const { numPages, total } = getPostsByTag(slug, 1, POSTS_PER_PAGE);

      return {
        href: `/blogi/${slug}/sivu/1`,
        indexable: isIndexableBlogTag(total),
        label: formatBlogTagLabel(tag),
        numPages,
        slug,
        total,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'fi'));
}
