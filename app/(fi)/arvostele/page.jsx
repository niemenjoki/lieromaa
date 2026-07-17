import { Suspense } from 'react';

import { createPageMetadata } from '@/lib/metadata/createPageMetadata';

import classes from './ReviewPage.module.css';
import ReviewPageClient from './ReviewPageClient';

export const dynamic = 'force-static';

export const metadata = createPageMetadata({
  title: 'Jätä arvostelu | Lieromaa',
  description:
    'Jätä tähtiarvio, kirjallinen arvostelu ja yksityinen palaute vahvistetusta Lieromaan tilauksesta.',
  canonicalUrl: '/arvostele',
  robots: {
    index: false,
    follow: false,
  },
});

function ReviewPageFallback() {
  return (
    <section className={classes.Card} aria-live="polite">
      <p className={classes.StatusRow}>
        <span className={classes.Spinner} aria-hidden="true" />
        Ladataan arvostelulomaketta...
      </p>
    </section>
  );
}

export default function ReviewPage() {
  return (
    <article className={classes.Page}>
      <div className={classes.Intro}>
        <h1>Arvostele tilauksesi</h1>
        <p>
          Tällä sivulla voit jättää yhden arvostelun ostoksestasi ilman kirjautumista.
          Arvostelulinkki on tarkoitettu vain tilauksen tehneelle asiakkaalle.
        </p>
        <p>
          Tähtiarvio on pakollinen. Kirjoitettu palaute ja näyttönimi ovat valinnaisia.
        </p>
      </div>

      <Suspense fallback={<ReviewPageFallback />}>
        <ReviewPageClient />
      </Suspense>
    </article>
  );
}
