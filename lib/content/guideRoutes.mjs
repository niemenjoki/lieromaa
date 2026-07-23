const GUIDE_CATEGORY_LABELS = Object.freeze({
  'kompostin hyödyntäminen': 'Matokompostin hyödyntäminen',
  'kompostorin perustaminen': 'Matokompostorin perustaminen',
  'kompostorin hoito': 'Matokompostorin hoito',
  lämpökompostointi: 'Lämpökompostointi',
});

function decodeSlug(categorySlug) {
  try {
    return decodeURIComponent(categorySlug);
  } catch {
    return categorySlug;
  }
}

export function getGuideCategorySlug(categoryName) {
  return String(categoryName ?? '').replaceAll(' ', '-');
}

export function getGuideCategoryNameFromSlug(categorySlug) {
  return decodeSlug(categorySlug).replaceAll('-', ' ');
}

export function getGuideCategoryLabel(categoryName) {
  const normalizedName = String(categoryName ?? '');

  return (
    GUIDE_CATEGORY_LABELS[normalizedName] ??
    normalizedName.charAt(0).toLocaleUpperCase('fi-FI') + normalizedName.slice(1)
  );
}

export function getGuidePath({ categoryName, guideSlug }) {
  return `/opas/${getGuideCategorySlug(categoryName)}/${guideSlug}`;
}

export function isMatchingGuideCategorySlug({ categoryName, categorySlug }) {
  const decodedCategorySlug = decodeSlug(categorySlug);

  return decodedCategorySlug === getGuideCategorySlug(categoryName);
}
