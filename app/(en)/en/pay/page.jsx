import { Suspense } from 'react';

import InvoicePaymentClient from '@/app/(fi)/maksa/InvoicePaymentClient';
import classes from '@/app/(fi)/nouto/PickupPage.module.css';
import { getRoutePath } from '@/lib/i18n/routes.mjs';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';

const language = 'en';

export const dynamic = 'force-static';

// The address may contain the payment code, so the page sends no referrer onwards (payment page, analytics).
export function generateMetadata() {
  return {
    ...createLocalizedPageMetadata({
      language,
      title: 'Pay an invoice | Lieromaa',
      description:
        'Pay a Lieromaa invoice with MobilePay or a card using the payment code on the invoice.',
      canonicalUrl: getRoutePath('invoicePayment', language),
      robots: {
        index: false,
        follow: false,
      },
    }),
    referrer: 'no-referrer',
  };
}

function InvoicePaymentFallback() {
  return (
    <section className={classes.Card} aria-live="polite">
      <p className={classes.StatusRow}>
        <span className={classes.Spinner} aria-hidden="true" />
        Looking up the invoice...
      </p>
    </section>
  );
}

export default function EnglishInvoicePaymentPage() {
  return (
    <article className={classes.Page}>
      <div className={classes.Intro}>
        <h1>Pay an invoice</h1>
        <p>
          You can pay a Lieromaa invoice now with MobilePay or a card. You need the
          payment code shown on the invoice.
        </p>
      </div>

      <Suspense fallback={<InvoicePaymentFallback />}>
        <InvoicePaymentClient language={language} />
      </Suspense>
    </article>
  );
}
