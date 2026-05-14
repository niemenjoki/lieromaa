'use client';

import SafeLink from '@/components/SafeLink/SafeLink';

import classes from './ContentRecommendations.module.css';

export default function ContentRecommendations({
  recommendations = [],
  title = 'Jatka lukemista',
}) {
  if (!recommendations.length) {
    return null;
  }

  return (
    <section
      className={classes.Recommendations}
      aria-labelledby="content-recommendations"
    >
      <div className={classes.Header}>
        <p className={classes.Eyebrow}>Suositukset</p>
        <h2 id="content-recommendations">{title}</h2>
      </div>

      <div className={classes.Grid}>
        {recommendations.map((recommendation) => (
          <article
            key={`${recommendation.type}:${recommendation.slug}`}
            className={classes.Card}
          >
            <div className={classes.Meta}>
              <span>{recommendation.typeLabel}</span>
            </div>

            <h3>
              <SafeLink href={recommendation.href}>{recommendation.title}</SafeLink>
            </h3>

            <p>{recommendation.description}</p>

            <SafeLink
              href={recommendation.href}
              className={classes.Action}
              aria-label={`${recommendation.ctaLabel}: ${recommendation.title}`}
            >
              {recommendation.ctaLabel}
            </SafeLink>
          </article>
        ))}
      </div>
    </section>
  );
}
