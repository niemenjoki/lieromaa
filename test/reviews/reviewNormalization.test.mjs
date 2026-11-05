import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';

import { productDefinitions } from '@/lib/products/catalog.mjs';
import approvedReviewsSource from '@/lib/reviews/approvedReviewsSource';

// approvedReviews.js normalizes the source once when it is loaded. This file
// runs in its own process (node --test), so the source array is replaced with
// example data before the module is imported. Real reviews never affect it.
const [productKey, otherProductKey] = Object.keys(productDefinitions);

const EXAMPLE_REVIEWS = [
  { productKey, rating: 5, review: 'Uusin', submittedAt: '2026-10-03T10:00:00Z' },
  { productKey, rating: '5', review: 'Merkkijono', submittedAt: '2026-10-02T10:00:00Z' },
  { productKey, rating: ' 4 ', review: '  Välilyönnit  ', submittedAt: '2026-10-01' },
  { productKey, rating: 0, review: 'Nolla', submittedAt: '2026-09-01T10:00:00Z' },
  { productKey, rating: 6, review: 'Kuusi', submittedAt: '2026-09-02T10:00:00Z' },
  { productKey, rating: -1, review: 'Negatiivinen', submittedAt: '2026-09-03' },
  { productKey, rating: 'viisi', review: 'Teksti', submittedAt: '2026-09-04' },
  { productKey, rating: null, review: 'Tyhjä', submittedAt: '2026-09-05' },
  {
    productKey: 'noSuchProduct',
    rating: 5,
    review: 'Tuntematon',
    submittedAt: '2026-09-06',
  },
  { productKey: '', rating: 5, review: 'Ei tuotetta', submittedAt: '2026-09-07' },
  { productKey, rating: 3, review: 'Ei päivää', submittedAt: 'not a date' },
  { productKey, rating: 2, review: '12345', submittedAt: '2026-08-01' },
  { productKey, rating: 1, review: '', submittedAt: '2026-08-02' },
  null,
  'not an object',
  { productKey: ` ${otherProductKey} `, rating: 4, review: 'Toinen' },
];

let reviews;

before(async () => {
  assert.ok(otherProductKey, 'the catalog should define at least two products');
  approvedReviewsSource.splice(0, approvedReviewsSource.length, ...EXAMPLE_REVIEWS);
  reviews = await import('@/lib/reviews/approvedReviews');
});

function texts(list) {
  return list.map(({ review }) => review);
}

describe('approved review normalization with example data', () => {
  test('keeps whole ratings 1-5 given as numbers or numeric strings', () => {
    const kept = reviews.getApprovedProductReviews(productKey);
    const byText = Object.fromEntries(kept.map((review) => [review.review, review]));

    assert.equal(byText.Uusin.rating, 5);
    assert.equal(byText.Merkkijono.rating, 5);
    assert.equal(byText['Välilyönnit'].rating, 4);
  });

  test('drops ratings 0, 6, negative, non-numeric and missing', () => {
    const kept = texts(reviews.getApprovedProductReviews(productKey));

    for (const dropped of ['Nolla', 'Kuusi', 'Negatiivinen', 'Teksti', 'Tyhjä']) {
      assert.equal(kept.includes(dropped), false, dropped);
    }
  });

  test('drops entries with an unknown or missing product key and non-objects', () => {
    const all = Object.keys(productDefinitions).flatMap((key) =>
      texts(reviews.getApprovedProductReviews(key))
    );

    assert.equal(all.includes('Tuntematon'), false);
    assert.equal(all.includes('Ei tuotetta'), false);
    assert.deepEqual(reviews.getApprovedProductReviews('noSuchProduct'), []);
  });

  test('trims the product key and the review text', () => {
    assert.ok(
      texts(reviews.getApprovedProductReviews(` ${otherProductKey} `)).includes('Toinen')
    );
    assert.ok(
      texts(reviews.getApprovedProductReviews(productKey)).includes('Välilyönnit')
    );
  });

  test('sorts newest first and puts reviews without a valid date last', () => {
    const own = texts(reviews.getApprovedProductReviews(productKey));

    assert.deepEqual(own, [
      'Uusin',
      'Merkkijono',
      'Välilyönnit',
      '',
      '12345',
      'Ei päivää',
    ]);
  });

  test('ids stay unique even when the date is missing or repeated', () => {
    const ids = Object.keys(productDefinitions).flatMap((key) =>
      reviews.getApprovedProductReviews(key).map(({ id }) => id)
    );

    assert.equal(new Set(ids).size, ids.length);
  });

  test('the summary counts number-only and empty texts as rating-only reviews', () => {
    const summary = reviews.getApprovedProductReviewSummary(productKey);

    assert.equal(summary.reviewCount, 6);
    assert.equal(summary.ratingOnlyCount, 2);
    assert.equal(summary.writtenReviewCount, 4);
    assert.deepEqual(summary.ratingCounts, { 1: 1, 2: 1, 3: 1, 4: 1, 5: 2 });
    assert.equal(summary.averageRating, 3.3);
    assert.deepEqual(texts(reviews.getApprovedProductWrittenReviews(productKey)), [
      'Uusin',
      'Merkkijono',
      'Välilyönnit',
      'Ei päivää',
    ]);
  });

  test('a product without reviews has an empty summary', () => {
    const summary = reviews.getApprovedProductReviewSummary('noSuchProduct');

    assert.equal(summary.reviewCount, 0);
    assert.equal(summary.averageRating, 0);
  });
});
