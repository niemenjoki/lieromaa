import { Suspense } from 'react';

import classes from '@/app/(fi)/arvostele/ReviewPage.module.css';
import ReviewPageClient from '@/app/(fi)/arvostele/ReviewPageClient';
import { getRoutePath } from '@/lib/i18n/routes.mjs';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import { createLocalizedPageStructuredData } from '@/lib/structuredData/createLocalizedPageStructuredData.mjs';

const language = 'en';
const pageMetadata = {
  language,
  title: 'Review your order | Lieromaa',
  description:
    'Leave a star rating, written review and private feedback for a verified Lieromaa order.',
  canonicalUrl: getRoutePath('review', language),
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-static';

export function generateMetadata() {
  return createLocalizedPageMetadata(pageMetadata);
}

function ReviewPageFallback() {
  return (
    <section className={classes.Card} aria-live="polite">
      <p className={classes.StatusRow}>
        <span className={classes.Spinner} aria-hidden="true" />
        Loading the review form...
      </p>
    </section>
  );
}

export default function EnglishReviewPage() {
  const structuredData = createLocalizedPageStructuredData({
    ...pageMetadata,
    name: 'Review your Lieromaa order',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <article className={classes.Page}>
        <div className={classes.Intro}>
          <h1>Review your order</h1>
          <p>
            You can leave one review of your purchase without signing in. The review link
            is intended only for the customer who placed the order.
          </p>
          <p>
            A star rating is required. A written review, private feedback and display name
            are optional. Reviews are moderated before publication.
          </p>
        </div>

        <Suspense fallback={<ReviewPageFallback />}>
          <ReviewPageClient language={language} />
        </Suspense>
      </article>
    </>
  );
}
