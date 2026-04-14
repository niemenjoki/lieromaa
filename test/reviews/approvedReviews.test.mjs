import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import approvedReviewsSource from '@/data/published/reviews/approved.json';
import { productDefinitions } from '@/lib/products/catalog.mjs';
import {
  getApprovedProductReviewSummary,
  getApprovedProductReviews,
} from '@/lib/reviews/approvedReviews';

import { expectEqual } from '../helpers/assertions.mjs';

describe('frontend approved review data', () => {
  test('approved review normalization should keep every review from the static data file', () => {
    const rawEntries = Array.isArray(approvedReviewsSource) ? approvedReviewsSource : [];
    const normalizedEntries = Object.keys(productDefinitions)
      .flatMap((productKey) => getApprovedProductReviews(productKey))
      .sort((left, right) => String(left.id).localeCompare(String(right.id)));

    expectEqual(
      normalizedEntries.length,
      rawEntries.length,
      'approved review normalization should keep the same number of entries as the raw approved review file'
    );
  });

  test('approved review summaries should stay internally consistent for each product', () => {
    for (const productKey of Object.keys(productDefinitions)) {
      const reviews = getApprovedProductReviews(productKey);
      const summary = getApprovedProductReviewSummary(productKey);

      expectEqual(
        summary.reviewCount,
        reviews.length,
        `approved review summaries should report the correct review count for ${productKey}`
      );

      if (!reviews.length) {
        expectEqual(
          summary.averageRating,
          0,
          `approved review summaries should report an average rating of 0 for ${productKey} when there are no reviews`
        );
        continue;
      }

      const calculatedAverage = Number(
        (
          reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        ).toFixed(1)
      );

      expectEqual(
        summary.averageRating,
        calculatedAverage,
        `approved review summaries should match the calculated average rating for ${productKey}`
      );
    }
  });
});
