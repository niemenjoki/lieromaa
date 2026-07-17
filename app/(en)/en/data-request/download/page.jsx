import classes from '@/app/(fi)/tietopyynto/DataRequestPage.module.css';
import DownloadDataClient from '@/app/(fi)/tietopyynto/lataa/DownloadDataClient';
import { getRoutePath } from '@/lib/i18n/routes.mjs';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';

const language = 'en';
const pageMetadata = {
  language,
  title: 'Download your data | Lieromaa',
  description: 'Download the data connected with your Lieromaa order.',
  canonicalUrl: getRoutePath('dataRequestDownload', language),
  referrer: 'no-referrer',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export function generateMetadata() {
  return {
    ...createLocalizedPageMetadata(pageMetadata),
    referrer: pageMetadata.referrer,
  };
}

export default function EnglishDownloadDataPage() {
  return (
    <div className={classes.DataRequestPage}>
      <h1>Download the data connected with your order</h1>
      <section className={classes.Panel}>
        <p>
          The download contains personal data connected with the order in JSON format. The
          link can only be used once. Its token remains in the URL fragment and is never
          sent as a URL query parameter.
        </p>
        <DownloadDataClient language={language} />
      </section>
    </div>
  );
}
