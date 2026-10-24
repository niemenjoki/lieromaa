import { Suspense } from 'react';

import classes from '@/app/(fi)/nouto/PickupPage.module.css';
import PickupPageClient from '@/app/(fi)/nouto/PickupPageClient';
import { getRoutePath } from '@/lib/i18n/routes.mjs';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import { createLocalizedPageStructuredData } from '@/lib/structuredData/createLocalizedPageStructuredData.mjs';

const language = 'en';
const pageMetadata = {
  language,
  title: 'Choose a pickup time | Lieromaa',
  description: 'Book a pickup time for a Lieromaa order collected in Järvenpää.',
  canonicalUrl: getRoutePath('pickup', language),
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-static';

export function generateMetadata() {
  return createLocalizedPageMetadata(pageMetadata);
}

function PickupPageFallback() {
  return (
    <section className={classes.Card} aria-live="polite">
      <p className={classes.StatusRow}>
        <span className={classes.Spinner} aria-hidden="true" />
        Loading pickup times...
      </p>
    </section>
  );
}

export default function EnglishPickupPage() {
  const structuredData = createLocalizedPageStructuredData({
    ...pageMetadata,
    name: 'Choose a pickup time for your Lieromaa order',
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
          <h1>Choose a pickup time</h1>
          <p>
            Your order will wait in a cool bag at my front door in Järvenpää during the
            pickup time you choose, and you collect it yourself. I will send detailed
            pickup instructions and the address to your email right after booking.
          </p>
          <p>The booking link is intended only for the customer who placed the order.</p>
        </div>

        <Suspense fallback={<PickupPageFallback />}>
          <PickupPageClient language={language} />
        </Suspense>
      </article>
    </>
  );
}
