export function getGuideCategorySlug(categoryName) {
  return categoryName.replaceAll(' ', '-');
}

export function getGuidePath({ categoryName, guideSlug }) {
  return `/opas/${getGuideCategorySlug(categoryName)}/${guideSlug}`;
}

export function isMatchingGuideCategorySlug({ categoryName, categorySlug }) {
  let decodedCategorySlug = categorySlug;

  try {
    decodedCategorySlug = decodeURIComponent(categorySlug);
  } catch {
    decodedCategorySlug = categorySlug;
  }

  return decodedCategorySlug === getGuideCategorySlug(categoryName);
}
