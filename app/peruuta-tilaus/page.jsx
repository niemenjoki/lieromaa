import SafeLink from '@/components/SafeLink/SafeLink';
import {
  CONTACT_PHONE,
  ORDER_CONTACT_EMAIL,
  ORDER_WHATSAPP_URL,
} from '@/lib/site/contact';

import CancellationRequestForm from './CancellationRequestForm';
import classes from './CancellationRequestPage.module.css';
import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

export default function CancellationRequestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <div className={classes.CancellationRequestPage}>
        <h1>Peruuttamisilmoitus</h1>
        <p className={classes.Lead}>
          Tällä lomakkeella voit tehdä peruuttamisilmoituksen Lieromaan tilauksesta, kun
          haluat peruuttaa tilauksen muusta syystä kuin tuotteen virheen vuoksi.
        </p>

        <section className={classes.Panel}>
          <h2>Ennen kuin lähetät ilmoituksen</h2>
          <p>
            Huomaathan, että postitettuja matotilauksia ei voi peruuttaa, koska
            kompostimatoja ei voida palautuksen jälkeen käsitellä tai myydä edelleen
            tavanomaisena tuotteena. Muilla tuotteilla on kuitenkin normaali
            peruuttamisoikeus, vaikka ne olisi tilattu samassa tilauksessa matojen kanssa.
          </p>
          <p>
            Jos tuotteessa tai toimituksessa on virhe, ota yhteyttä sähköpostitse
            osoitteeseen{' '}
            <a href={`mailto:${ORDER_CONTACT_EMAIL}`}>{ORDER_CONTACT_EMAIL}</a>,
            puhelimitse numeroon <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a> tai{' '}
            <a href={ORDER_WHATSAPP_URL} target="_blank" rel="noreferrer">
              WhatsAppilla,
            </a>{' '}
            niin voimme sopia virheen korjauksesta erikseen.
          </p>
          <p>
            Tarkemmat ehdot löytyvät{' '}
            <SafeLink href="/tilausehdot">tilaus- ja toimitusehdoista</SafeLink>.
          </p>
        </section>

        <section className={classes.Panel}>
          <h2>Lähetä peruuttamisilmoitus</h2>
          <CancellationRequestForm />
        </section>
      </div>
    </>
  );
}
