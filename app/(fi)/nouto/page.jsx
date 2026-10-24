import { Suspense } from 'react';

import { createPageMetadata } from '@/lib/metadata/createPageMetadata';

import classes from './PickupPage.module.css';
import PickupPageClient from './PickupPageClient';

export const dynamic = 'force-static';

export const metadata = createPageMetadata({
  title: 'Valitse noutoaika | Lieromaa',
  description: 'Varaa noutoaika Järvenpäästä noudettavalle Lieromaan tilaukselle.',
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
          Tilauksesi odottaa valitsemasi noutoajan kylmälaukussa kuistillani Järvenpäässä,
          ja noudat sen itse. Lähetän tarkat nouto-ohjeet ja osoitteen sähköpostiisi heti
          varauksen jälkeen.
        </p>
        <p>Varauslinkki on tarkoitettu vain tilauksen tehneelle asiakkaalle.</p>
      </div>

      <Suspense fallback={<PickupPageFallback />}>
        <PickupPageClient />
      </Suspense>
    </article>
  );
}
