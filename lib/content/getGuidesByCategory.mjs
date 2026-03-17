import { CONTENT_TYPES } from '../../data/site/constants.mjs';
import { getAllContent } from './getAllContent.mjs';

/**
 * Get all guides based on category
 */
export function getGuidesByCategory(category) {
  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE });
  const categoryGuides = guides.filter((guide) => guide.category.name === category);
  return categoryGuides;
}
