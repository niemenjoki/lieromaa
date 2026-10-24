import { Suspense } from 'react';

import { createPageMetadata } from '@/lib/metadata/createPageMetadata';

import classes from './PickupPage.module.css';
import PickupPageClient from './PickupPageClient';

export const dynamic = 'force-static';

export const metadata = createPageMetadata({
  title: 'Valitse noutoaika | Lieromaa',
  description:
    'Valitse Järvenpäästä noudettavalle Lieromaan tilaukselle sopiva kahden tunnin noutoaika.',
  canonicalUrl: '/nouto',
  robots: {
    index: false,
    follow: false,
  },
});

function PickupPageFallback() {
  return (
    <section className={classes.Card} aria-live="polite">
      <p className={classes.StatusRow}>
        <span className={classes.Spinner} aria-hidden="true" />
        Ladataan noutoaikoja...
      </p>
    </section>
  );
}

export default function PickupPage() {
  return (
    <article className={classes.Page}>
      <div className={classes.Intro}>
        <h1>Valitse noutoaika</h1>
        <p>
          Laitan tilauksesi kylmälaukkuun kuistilleni valitsemasi kahden tunnin noutoajan
          alkuun mennessä. Voit noutaa sen itse milloin tahansa noutoajan aikana.
        </p>
        <p>Noutoaikalinkki on tarkoitettu vain tilauksen tehneelle asiakkaalle.</p>
      </div>

      <Suspense fallback={<PickupPageFallback />}>
        <PickupPageClient />
      </Suspense>
    </article>
  );
}
