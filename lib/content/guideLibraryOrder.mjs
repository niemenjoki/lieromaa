import { GUIDE_CATEGORIES } from '../site/constants.mjs';

function getCategoryRank(categoryName) {
  const categoryIndex = GUIDE_CATEGORIES.indexOf(categoryName);
  return categoryIndex === -1 ? GUIDE_CATEGORIES.length : categoryIndex;
}

function getGuideTimestamp(guide) {
  const timestamp = Date.parse(guide.updatedAt ?? guide.publishedAt ?? '');
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getGuidePagePosition(guide) {
  const pagePosition = Number(guide.category?.pagePosition);
  return Number.isFinite(pagePosition) ? pagePosition : Number.MAX_SAFE_INTEGER;
}

export function compareGuideCategoryNames(a, b) {
  const rankDifference = getCategoryRank(a) - getCategoryRank(b);
  return rankDifference || a.localeCompare(b, 'fi');
}

export function compareGuidesByRecency(a, b) {
  return (
    getGuideTimestamp(b) - getGuideTimestamp(a) || a.title.localeCompare(b.title, 'fi')
  );
}

export function compareGuidesByEditorialOrder(a, b) {
  const categoryDifference = compareGuideCategoryNames(
    a.category?.name ?? '',
    b.category?.name ?? ''
  );
  if (categoryDifference) return categoryDifference;

  const positionDifference = getGuidePagePosition(a) - getGuidePagePosition(b);
  if (positionDifference) return positionDifference;

  return compareGuidesByRecency(a, b);
}

export function orderGuidesForLibrary(guides = []) {
  return [...guides].sort(compareGuidesByEditorialOrder);
}

export function getLatestGuide(guides = []) {
  return [...guides].sort(compareGuidesByRecency)[0] ?? null;
}
