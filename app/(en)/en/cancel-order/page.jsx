import CancellationRequestForm from '@/app/(fi)/peruuta-tilaus/CancellationRequestForm';
import classes from '@/app/(fi)/peruuta-tilaus/CancellationRequestPage.module.css';
import SafeLink from '@/components/SafeLink/SafeLink';
import { getRoutePath } from '@/lib/i18n/routes.mjs';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import {
  CONTACT_PHONE,
  ORDER_CONTACT_EMAIL,
  ORDER_WHATSAPP_URL,
} from '@/lib/site/contact';
import { createLocalizedPageStructuredData } from '@/lib/structuredData/createLocalizedPageStructuredData.mjs';

const language = 'en';
const pageMetadata = {
  language,
  title: 'Cancel an order | Lieromaa',
  description:
    'Send an English cancellation notice for a Lieromaa order and provide the details needed to identify the order.',
  canonicalUrl: getRoutePath('cancelOrder', language),
  robots: {
    index: false,
    follow: true,
  },
};

export function generateMetadata() {
  return createLocalizedPageMetadata(pageMetadata);
}

export default function EnglishCancellationRequestPage() {
  const structuredData = createLocalizedPageStructuredData({
    ...pageMetadata,
    name: 'Lieromaa cancellation notice',
    breadcrumbs: [
      { name: 'English home', href: getRoutePath('home', language) },
      { name: 'Cancel an order', href: pageMetadata.canonicalUrl },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <div className={classes.CancellationRequestPage}>
        <h1>Cancellation notice</h1>
        <p className={classes.Lead}>
          Use this form when you want to cancel a Lieromaa order for a reason other than a
          product defect.
        </p>

        <section className={classes.Panel}>
          <h2>Before sending the notice</h2>
          <p>
            Dispatched worm orders cannot be cancelled because returned live compost worms
            cannot be handled or resold as ordinary products. The normal cancellation
            right still applies to other products, even when they are ordered together
            with worms.
          </p>
          <p>
            If a product or delivery is defective, contact{' '}
            <a href={`mailto:${ORDER_CONTACT_EMAIL}`}>{ORDER_CONTACT_EMAIL}</a>, call{' '}
            <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a> or send a message through{' '}
            <a href={ORDER_WHATSAPP_URL} target="_blank" rel="noreferrer">
              WhatsApp
            </a>{' '}
            so that the defect can be handled separately.
          </p>
          <p>
            Read the full{' '}
            <SafeLink href={getRoutePath('orderTerms', language)}>
              order and delivery terms
            </SafeLink>
            .
          </p>
        </section>

        <section className={classes.Panel}>
          <h2>Send a cancellation notice</h2>
          <CancellationRequestForm language={language} />
        </section>
      </div>
    </>
  );
}
