import {
  getApprovedProductReviewSummary,
  getApprovedProductReviews,
  getApprovedProductWrittenReviews,
} from '@/lib/reviews/approvedReviews';

import ProductReviewsSectionClient from './ProductReviewsSectionClient';

export default function ProductReviewsSection({ productKey }) {
  const reviews = getApprovedProductReviews(productKey);
  if (reviews.length === 0) {
    return null;
  }

  const summary = getApprovedProductReviewSummary(productKey);
  const writtenReviews = getApprovedProductWrittenReviews(productKey);

  return (
    <ProductReviewsSectionClient
      productKey={productKey}
      reviews={writtenReviews}
      summary={summary}
    />
  );
}
