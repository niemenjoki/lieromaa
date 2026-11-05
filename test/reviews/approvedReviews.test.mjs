import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { getProductMessages } from '@/lib/i18n/messages.mjs';
import { productDefinitions } from '@/lib/products/catalog.mjs';
import approvedReviewsSource from '@/lib/reviews/approvedReviewsSource';

import { expectEqual } from '../helpers/assertions.mjs';

// Example reviews are added before the review module normalizes the file, so the
// language fallback is tested even when every real review states its language.
const EXAMPLE_PRODUCT_KEY = Object.keys(productDefinitions)[0];
const EXAMPLE_REVIEWS = [
  { review: 'Esimerkki ilman kieltä', submittedAt: '2000-01-01T10:00:00.000Z' },
  {
    review: 'Example in English',
    submittedAt: '2000-01-02T10:00:00.000Z',
    language: 'en',
  },
  {
    review: 'Esimerkki tuntemattomalla kielellä',
    submittedAt: '2000-01-03T10:00:00.000Z',
    language: 'sv',
  },
].map((entry) => ({ productKey: EXAMPLE_PRODUCT_KEY, rating: 5, ...entry }));

approvedReviewsSource.push(...EXAMPLE_REVIEWS);

const {
  REVIEW_PURCHASED_PRODUCTS,
  getApprovedProductReviewSummary,
  getApprovedProductReviews,
  normalizePurchasedProducts,
} = await import('@/lib/reviews/approvedReviews');

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

  test('approved reviews without a known language remain Finnish for compatibility', () => {
    const languageBySubmittedAt = new Map(
      getApprovedProductReviews(EXAMPLE_PRODUCT_KEY).map((review) => [
        review.submittedAt,
        review.language,
      ])
    );

    assert.equal(languageBySubmittedAt.get('2000-01-01T10:00:00.000Z'), 'fi');
    assert.equal(languageBySubmittedAt.get('2000-01-02T10:00:00.000Z'), 'en');
    assert.equal(languageBySubmittedAt.get('2000-01-03T10:00:00.000Z'), 'fi');
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

      expectEqual(
        Object.values(summary.ratingCounts).reduce((sum, count) => sum + count, 0),
        reviews.length,
        `approved review summaries should report a complete star breakdown for ${productKey}`
      );

      expectEqual(
        summary.writtenReviewCount + summary.ratingOnlyCount,
        reviews.length,
        `approved review summaries should separate written and rating-only reviews for ${productKey}`
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

describe('purchased product tags on reviews', () => {
  test('purchased products keep only known tags once, in display order', () => {
    assert.deepEqual(
      normalizePurchasedProducts(['compostChow', 'unknown', 'worms', 'worms', 7]),
      ['worms', 'compostChow']
    );
    assert.deepEqual(normalizePurchasedProducts(undefined), []);
    assert.deepEqual(normalizePurchasedProducts('worms'), []);
  });

  test('every purchased product tag has a label in both languages', () => {
    for (const language of ['fi', 'en']) {
      const copy = getProductMessages(language).reviews;
      assert.ok(copy.purchasedLabel, `${language} purchased label`);
      for (const tag of REVIEW_PURCHASED_PRODUCTS) {
        assert.ok(copy.purchasedProducts[tag], `${language} label for ${tag}`);
      }
    }
  });

  test('approved reviews expose purchased products as known tags', () => {
    const knownTags = new Set(REVIEW_PURCHASED_PRODUCTS);
    for (const productKey of Object.keys(productDefinitions)) {
      for (const review of getApprovedProductReviews(productKey)) {
        assert.ok(Array.isArray(review.purchasedProducts));
        assert.ok(review.purchasedProducts.every((tag) => knownTags.has(tag)));
      }
    }
  });
});
