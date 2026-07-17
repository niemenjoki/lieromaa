import DataRequestForm from '@/app/(fi)/tietopyynto/DataRequestForm';
import classes from '@/app/(fi)/tietopyynto/DataRequestPage.module.css';
import SafeLink from '@/components/SafeLink/SafeLink';
import { getRoutePath } from '@/lib/i18n/routes.mjs';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import { CONTACT_EMAIL } from '@/lib/site/contact';
import { createLocalizedPageStructuredData } from '@/lib/structuredData/createLocalizedPageStructuredData.mjs';

const language = 'en';
const pageMetadata = {
  language,
  title: 'Download your order data | Lieromaa',
  description:
    'Request a secure one-time download link for personal data connected with your Lieromaa order.',
  canonicalUrl: getRoutePath('dataRequest', language),
};

export function generateMetadata() {
  return createLocalizedPageMetadata(pageMetadata);
}

export default function EnglishDataRequestPage() {
  const structuredData = createLocalizedPageStructuredData({
    ...pageMetadata,
    name: 'Download the data connected with your order',
    breadcrumbs: [
      { name: 'English home', href: getRoutePath('home', language) },
      { name: 'Download your data', href: pageMetadata.canonicalUrl },
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
      <div className={classes.DataRequestPage}>
        <h1>Download the data connected with your order</h1>
        <p className={classes.Lead}>
          You can request a secure link by email to the information connected with your
          order in Lieromaa’s order system.
        </p>

        <section className={classes.Panel}>
          <h2>Request a download link</h2>
          <p>
            Enter the order number and the same email address you used for the order. The
            link is sent only to the address stored with the order, can be used once and
            expires after 24 hours. The stored order language determines the language of
            the email and download link.
          </p>
          <DataRequestForm language={language} />
        </section>

        <section className={classes.Panel}>
          <h2>If the automatic request does not work</h2>
          <p>
            An anonymised order can no longer be found by order number and email address.
            To exercise another privacy right or ask for help, email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
          <p>
            Read more about personal-data processing in the{' '}
            <SafeLink href={getRoutePath('privacy', language)}>privacy notice</SafeLink>.
          </p>
        </section>
      </div>
    </>
  );
}
