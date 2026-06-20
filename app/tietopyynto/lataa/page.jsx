import classes from '../DataRequestPage.module.css';
import DownloadDataClient from './DownloadDataClient';

export const metadata = {
  title: 'Lataa tietosi | Lieromaa',
  description: 'Lataa Lieromaan tilaukseen liittyvät tiedot.',
  referrer: 'no-referrer',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
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
