'use client';

import { useState } from 'react';

import classes from './ProductPage.module.css';

const INITIAL_VISIBLE_REVIEWS = 5;
const REVIEW_BATCH_SIZE = 5;
const STAR_BREAKDOWN_VALUES = [5, 4, 3, 2, 1];

const reviewDateFormatter = new Intl.DateTimeFormat('fi-FI', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
});

function formatReviewDate(value) {
  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? '' : reviewDateFormatter.format(parsedDate);
}

function formatAverageRating(value) {
  return value.toLocaleString('fi-FI', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function getStarString(value, maxValue = 5) {
  const safeValue = Math.max(0, Math.min(maxValue, Number(value) || 0));
  return '\u2605'.repeat(safeValue) + '\u2606'.repeat(Math.max(maxValue - safeValue, 0));
}

function getStarLabel(value) {
  return value === 1 ? '1 tähti' : `${value} tähteä`;
}

export default function ProductReviewsSectionClient({ productKey, reviews, summary }) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_REVIEWS);
  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMoreReviews = visibleCount < reviews.length;
  const hiddenReviewCount = Math.max(reviews.length - visibleCount, 0);
  const reviewListId = `reviews-list-${productKey}`;
  const hasWrittenReviews = reviews.length > 0;
  const ratingCounts = summary.ratingCounts || {};

  function handleToggleReviews() {
    setIsOpen((currentValue) => {
      const nextValue = !currentValue;

      if (!nextValue) {
        setVisibleCount(INITIAL_VISIBLE_REVIEWS);
      }

      return nextValue;
    });
  }

  function handleShowMoreReviews() {
    setVisibleCount((currentValue) =>
      Math.min(currentValue + REVIEW_BATCH_SIZE, reviews.length)
    );
  }

  return (
    <section className={classes.ReviewsSection} aria-labelledby={`reviews-${productKey}`}>
      <div className={classes.ReviewSummary}>
        <h2 id={`reviews-${productKey}`}>Asiakasarvostelut</h2>
        <p className={classes.ReviewSummaryRating}>
          <span className={classes.ReviewSummaryStars} aria-hidden="true">
            {getStarString(Math.round(summary.averageRating))}
          </span>
          {formatAverageRating(summary.averageRating)} / 5.0
        </p>
        <p className={classes.ReviewSummaryMeta}>
          {summary.reviewCount} vahvistetun ostajan arvostelua
        </p>

        <dl className={classes.StarBreakdown} aria-label="Tähtijakauma">
          {STAR_BREAKDOWN_VALUES.map((ratingValue) => {
            const count = Number(ratingCounts[ratingValue]) || 0;
            const width =
              summary.reviewCount > 0 ? `${(count / summary.reviewCount) * 100}%` : '0%';

            return (
              <div key={ratingValue} className={classes.StarBreakdownRow}>
                <dt className={classes.StarBreakdownLabel}>
                  {getStarLabel(ratingValue)}
                </dt>
                <dd className={classes.StarBreakdownValue}>
                  <span className={classes.StarBreakdownTrack} aria-hidden="true">
                    <span className={classes.StarBreakdownFill} style={{ width }} />
                  </span>
                  <span className={classes.StarBreakdownCount}>{count}</span>
                </dd>
              </div>
            );
          })}
        </dl>

        {hasWrittenReviews ? (
          <div className={classes.ReviewActions}>
            <button
              type="button"
              className={classes.ReviewToggleButton}
              aria-expanded={isOpen}
              aria-controls={reviewListId}
              onClick={handleToggleReviews}
            >
              {isOpen
                ? 'Piilota kirjoitetut arvostelut'
                : `Näytä kirjoitetut arvostelut (${summary.writtenReviewCount})`}
            </button>
          </div>
        ) : null}
      </div>

      {isOpen && hasWrittenReviews ? (
        <div id={reviewListId}>
          <ul className={classes.ReviewList}>
            {visibleReviews.map((review) => (
              <li key={review.id} className={classes.ReviewItem}>
                <p className={classes.ReviewHeading}>
                  <strong>{review.displayName || '<nimetön>'}</strong>
                  {formatReviewDate(review.submittedAt) ? (
                    <span className={classes.ReviewDate}>
                      {formatReviewDate(review.submittedAt)}
                    </span>
                  ) : null}
                </p>
                <p
                  className={classes.ReviewStars}
                  aria-label={`${review.rating} / 5 tähteä`}
                >
                  {getStarString(review.rating)}
                </p>
                <p className={classes.ReviewBody}>{review.review}</p>
              </li>
            ))}
          </ul>

          {hasMoreReviews ? (
            <div className={classes.ReviewActions}>
              <button
                type="button"
                className={classes.ReviewMoreButton}
                onClick={handleShowMoreReviews}
              >
                {hiddenReviewCount > REVIEW_BATCH_SIZE
                  ? `Näytä ${Math.min(REVIEW_BATCH_SIZE, hiddenReviewCount)} lisää arvostelua`
                  : 'Näytä loput arvostelut'}
              </button>
            </div>
          ) : null}

          <div className={classes.ReviewBottomActions}>
            <button
              type="button"
              className={classes.ReviewHideButton}
              onClick={handleToggleReviews}
            >
              Piilota kirjoitetut arvostelut
            </button>
          </div>

          {summary.ratingOnlyCount > 0 ? (
            <p className={classes.ReviewRatingOnlyNote}>
              {summary.ratingOnlyCount}{' '}
              {summary.ratingOnlyCount === 1 ? 'asiakas jätti' : 'asiakasta jätti'} pelkän
              tähtiarvion. Nämä arvostelut ovat mukana keskiarvossa ja tähtijakaumassa.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
