import { createPageMetadata } from '@/lib/metadata/createPageMetadata';

import classes from '../DataRequestPage.module.css';
import DownloadDataClient from './DownloadDataClient';

const pageMetadata = {
  title: 'Lataa tilaukseen liittyvät tietosi | Lieromaa',
  description: 'Lataa Lieromaan tilaukseen liittyvät henkilötiedot.',
  canonicalUrl: '/tietopyynto/lataa',
  referrer: 'no-referrer',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export const metadata = {
  ...createPageMetadata(pageMetadata),
  referrer: pageMetadata.referrer,
};

export default function DownloadDataPage() {
  return (
    <div className={classes.DataRequestPage}>
      <h1>Lataa tilaukseen liittyvät tietosi</h1>
      <section className={classes.Panel}>
        <p>
          Lataus sisältää tilaukseen liittyvät henkilötiedot JSON-muodossa. Linkki toimii
          vain kerran.
        </p>
        <DownloadDataClient />
      </section>
    </div>
  );
}
