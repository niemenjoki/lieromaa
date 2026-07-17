'use client';

import { useState } from 'react';

import { formatDate, formatNumber } from '@/lib/i18n/formatters.mjs';
import { getProductMessages } from '@/lib/i18n/messages.mjs';

import classes from './ProductPage.module.css';

const INITIAL_VISIBLE_REVIEWS = 5;
const REVIEW_BATCH_SIZE = 5;
const STAR_BREAKDOWN_VALUES = [5, 4, 3, 2, 1];

function formatReviewDate(value, language) {
  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime())
    ? ''
    : formatDate(parsedDate, language, 'numeric');
}

function formatAverageRating(value, language) {
  return formatNumber(value, language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function getStarString(value, maxValue = 5) {
  const safeValue = Math.max(0, Math.min(maxValue, Number(value) || 0));
  return '\u2605'.repeat(safeValue) + '\u2606'.repeat(Math.max(maxValue - safeValue, 0));
}

export default function ProductReviewsSectionClient({
  productKey,
  reviews,
  summary,
  language,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_REVIEWS);
  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMoreReviews = visibleCount < reviews.length;
  const hiddenReviewCount = Math.max(reviews.length - visibleCount, 0);
  const reviewListId = `reviews-list-${productKey}`;
  const hasWrittenReviews = reviews.length > 0;
  const ratingCounts = summary.ratingCounts || {};
  const copy = getProductMessages(language).reviews;

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
        <h2 id={`reviews-${productKey}`}>{copy.heading}</h2>
        <p className={classes.ReviewSummaryRating}>
          <span className={classes.ReviewSummaryStars} aria-hidden="true">
            {getStarString(Math.round(summary.averageRating))}
          </span>
          {formatAverageRating(summary.averageRating, language)} / 5.0
        </p>
        <p className={classes.ReviewSummaryMeta}>
          {copy.verifiedCount({ count: summary.reviewCount })}
        </p>

        <dl className={classes.StarBreakdown} aria-label={copy.distributionLabel}>
          {STAR_BREAKDOWN_VALUES.map((ratingValue) => {
            const count = Number(ratingCounts[ratingValue]) || 0;
            const width =
              summary.reviewCount > 0 ? `${(count / summary.reviewCount) * 100}%` : '0%';

            return (
              <div key={ratingValue} className={classes.StarBreakdownRow}>
                <dt className={classes.StarBreakdownLabel}>
                  {copy.starLabel({ value: ratingValue })}
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
                ? copy.hideWritten
                : copy.showWritten({ count: summary.writtenReviewCount })}
            </button>
          </div>
        ) : null}
      </div>

      {isOpen && hasWrittenReviews ? (
        <div id={reviewListId}>
          <ul className={classes.ReviewList}>
            {visibleReviews.map((review, reviewIndex) => {
              const isFinnishReview = review.language === 'fi';
              const isFirstFinnishReview =
                isFinnishReview &&
                visibleReviews.findIndex((entry) => entry.language === 'fi') ===
                  reviewIndex;

              return (
                <li key={review.id} className={classes.ReviewItem}>
                  {language === 'en' && isFirstFinnishReview ? (
                    <p className={classes.ReviewLanguageNoticePlain}>
                      {copy.finnishNotice}
                    </p>
                  ) : null}
                  {language === 'en' && isFinnishReview ? (
                    <span className={classes.ReviewLanguageBadge}>
                      {copy.finnishBadge}
                    </span>
                  ) : null}
                  <p className={classes.ReviewHeading}>
                    <strong>{review.displayName || copy.anonymous}</strong>
                    {formatReviewDate(review.submittedAt, language) ? (
                      <span className={classes.ReviewDate}>
                        {formatReviewDate(review.submittedAt, language)}
                      </span>
                    ) : null}
                  </p>
                  <p
                    className={classes.ReviewStars}
                    aria-label={copy.reviewStarLabel({ rating: review.rating })}
                  >
                    {getStarString(review.rating)}
                  </p>
                  <p
                    className={classes.ReviewBody}
                    lang={language === 'en' && isFinnishReview ? 'fi' : undefined}
                  >
                    {review.review}
                  </p>
                </li>
              );
            })}
          </ul>

          {hasMoreReviews ? (
            <div className={classes.ReviewActions}>
              <button
                type="button"
                className={classes.ReviewMoreButton}
                onClick={handleShowMoreReviews}
              >
                {hiddenReviewCount > REVIEW_BATCH_SIZE
                  ? copy.showMore({
                      count: Math.min(REVIEW_BATCH_SIZE, hiddenReviewCount),
                    })
                  : copy.showRest}
              </button>
            </div>
          ) : null}

          <div className={classes.ReviewBottomActions}>
            <button
              type="button"
              className={classes.ReviewHideButton}
              onClick={handleToggleReviews}
            >
              {copy.hideWritten}
            </button>
          </div>

          {summary.ratingOnlyCount > 0 ? (
            <p className={classes.ReviewRatingOnlyNote}>
              {copy.ratingOnly({ count: summary.ratingOnlyCount })}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
