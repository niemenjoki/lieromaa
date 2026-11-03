import { Suspense } from 'react';

import { createPageMetadata } from '@/lib/metadata/createPageMetadata';

import classes from '../nouto/PickupPage.module.css';
import InvoicePaymentClient from './InvoicePaymentClient';

export const dynamic = 'force-static';

// Osoitteessa voi olla maksukoodi, joten sivu ei lähetä viittaajaa eteenpäin (maksusivu, analytiikka).
export const metadata = {
  ...createPageMetadata({
    title: 'Maksa lasku | Lieromaa',
    description:
      'Maksa Lieromaan lasku MobilePaylla tai kortilla laskussa olevalla maksukoodilla.',
    canonicalUrl: '/maksa',
    robots: {
      index: false,
      follow: false,
    },
  }),
  referrer: 'no-referrer',
};

function InvoicePaymentFallback() {
  return (
    <section className={classes.Card} aria-live="polite">
      <p className={classes.StatusRow}>
        <span className={classes.Spinner} aria-hidden="true" />
        Haetaan laskua...
      </p>
    </section>
  );
}

export default function InvoicePaymentPage() {
  return (
    <article className={classes.Page}>
      <div className={classes.Intro}>
        <h1>Maksa lasku</h1>
        <p>
          Voit maksaa Lieromaan laskun heti MobilePaylla tai kortilla. Tarvitset laskussa
          olevan maksukoodin.
        </p>
      </div>

      <Suspense fallback={<InvoicePaymentFallback />}>
        <InvoicePaymentClient />
      </Suspense>
    </article>
  );
}
