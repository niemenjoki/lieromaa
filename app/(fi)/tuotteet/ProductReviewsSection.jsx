import {
  getApprovedProductReviewSummary,
  getApprovedProductReviews,
  getApprovedProductWrittenReviews,
} from '@/lib/reviews/approvedReviews';

import ProductReviewsSectionClient from './ProductReviewsSectionClient';

export default function ProductReviewsSection({ productKey, language }) {
  const reviews = getApprovedProductReviews(productKey);
  if (reviews.length === 0) {
    return null;
  }

  const summary = getApprovedProductReviewSummary(productKey);
  const writtenReviews = getApprovedProductWrittenReviews(productKey);
  const orderedWrittenReviews =
    language === 'en'
      ? [...writtenReviews].sort((left, right) => {
          if (left.language === right.language) return 0;
          return left.language === 'en' ? -1 : 1;
        })
      : writtenReviews;

  return (
    <ProductReviewsSectionClient
      productKey={productKey}
      reviews={orderedWrittenReviews}
      summary={summary}
      language={language}
    />
  );
}
