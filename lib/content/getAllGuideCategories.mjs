import { CONTENT_TYPES } from '../../data/vars.mjs';
import { getAllContent } from './getAllContent.mjs';

/**
 * Get all unique tags from all posts
 */
export function getAllGuideCategories() {
  const allGuides = getAllContent({ type: CONTENT_TYPES.GUIDE });
  const categorySet = new Set();

  allGuides.forEach((guide) => {
    categorySet.add(guide.category.name);
  });

  return Array.from(categorySet).sort();
}
