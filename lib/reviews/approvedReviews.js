import approvedReviewsSource from '@/data/published/reviews/approved.json';
import { productDefinitions } from '@/lib/products/catalog.mjs';

const validProductKeys = new Set(Object.keys(productDefinitions));

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getSubmittedAtTimestamp(value) {
  const parsedValue = Date.parse(value);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

function normalizeApprovedReview(entry, index) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const productKey = normalizeString(entry.productKey);
  if (!validProductKeys.has(productKey)) {
    return null;
  }

  const rating = Number.parseInt(String(entry.rating || ''), 10);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return null;
  }

  const review = normalizeString(entry.review);
  const displayName = normalizeString(entry.displayName);
  const submittedAt = normalizeString(entry.submittedAt);

  return {
    id: `${productKey}-${submittedAt || 'no-date'}-${index}`,
    productKey,
    rating,
    review,
    displayName,
    submittedAt,
  };
}

const approvedReviews = (
  Array.isArray(approvedReviewsSource) ? approvedReviewsSource : []
)
  .map(normalizeApprovedReview)
  .filter(Boolean)
  .sort(
    (left, right) =>
      getSubmittedAtTimestamp(right.submittedAt) -
      getSubmittedAtTimestamp(left.submittedAt)
  );

export function getApprovedProductReviews(productKey) {
  const normalizedProductKey = normalizeString(productKey);
  return approvedReviews.filter((review) => review.productKey === normalizedProductKey);
}

export function getApprovedProductReviewSummary(productKey) {
  const reviews = getApprovedProductReviews(productKey);
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount === 0
      ? 0
      : Number(
          (reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(
            1
          )
        );

  return {
    reviewCount,
    averageRating,
  };
}
