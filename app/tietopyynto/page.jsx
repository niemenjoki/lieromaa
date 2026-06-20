import SafeLink from '@/components/SafeLink/SafeLink';
import { CONTACT_EMAIL } from '@/lib/site/contact';

import DataRequestForm from './DataRequestForm';
import classes from './DataRequestPage.module.css';
import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

export default function DataRequestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <div className={classes.DataRequestPage}>
        <h1>Lataa tilaukseen liittyvät tietosi</h1>
        <p className={classes.Lead}>
          Voit pyytää sähköpostiisi turvallisen latauslinkin tietoihin, jotka Lieromaan
          tilausjärjestelmässä liittyvät tilaukseesi.
        </p>

        <section className={classes.Panel}>
          <h2>Pyydä latauslinkki</h2>
          <p>
            Anna tilausnumero ja sama sähköpostiosoite, jota käytit tilauksessa. Linkki
            lähetetään vain tilaukseen tallennettuun osoitteeseen, se toimii yhden
            latauksen ajan ja vanhenee 24 tunnissa.
          </p>
          <DataRequestForm />
        </section>

        <section className={classes.Panel}>
          <h2>Jos automaattinen pyyntö ei onnistu</h2>
          <p>
            Anonymisoitua tilausta ei voi enää hakea tilausnumerolla ja
            sähköpostiosoitteella. Voit käyttää muita tietosuojaoikeuksiasi tai pyytää
            apua sähköpostitse osoitteesta{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
          <p>
            Lisätietoja henkilötietojen käsittelystä saat{' '}
            <SafeLink href="/tietosuoja">tietosuojaselosteesta</SafeLink>.
          </p>
        </section>
      </div>
    </>
  );
}
