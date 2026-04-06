import {
  MONDAY_ONLY_SHIPPING_NOTE,
  STARTER_KIT_SHIPPING_SCHEDULE_TEXT,
  WORMS_SHIPPING_SCHEDULE_TEXT,
} from '@/data/commerce/shippingSchedule.mjs';
import {
  BUSINESS_ADDRESS_LINES,
  BUSINESS_ID,
  BUSINESS_NAME,
  CONTACT_PHONE,
  ORDER_CONTACT_EMAIL,
} from '@/data/site/contact';
import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';

import classes from './Tilausehdot.module.css';
import { effectiveFrom, updatedAt } from './pageMetadata';
import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

export default function OrderPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <div className={classes.OrderPolicyPage}>
        <h1>Tilaus- ja toimitusehdot</h1>
        <p>
          <em>Voimassa {formatFinnishDate(effectiveFrom, 'numeric')} alkaen.</em>
          {updatedAt && updatedAt !== effectiveFrom ? (
            <>
              <br />
              <em>Päivitetty: {formatFinnishDate(updatedAt)}</em>
            </>
          ) : null}
        </p>

        <h2>Yleistä</h2>
        <p>
          Lieromaan toimintaa harjoittaa <strong>{BUSINESS_NAME}</strong> (Y-tunnus:{' '}
          {BUSINESS_ID}), mutta laskutus ja verotuksen hallinnointi hoidetaan
          <strong> OP Kevytyrittäjä </strong>-palvelun kautta. Myynti on
          arvonlisäverotonta arvonlisäverolain 2 luvun 3 § nojalla (vähäinen toiminta).
          Pidätän oikeuden hintojen ja toimitusehtojen muutoksiin.
        </p>

        <h2>Myyjän tiedot ja asiakaspalvelu</h2>
        <p>
          Myyjä: <strong>{BUSINESS_NAME}</strong>
          <br />
          Y-tunnus: <strong>{BUSINESS_ID}</strong>
          <br />
          Osoite: <strong>{BUSINESS_ADDRESS_LINES.join(', ')}</strong>
          <br />
          Sähköposti: <strong>{ORDER_CONTACT_EMAIL}</strong>
          <br />
          Puhelin / WhatsApp: <strong>{CONTACT_PHONE}</strong>
        </p>
        <p>
          Kaikki tilauksiin, toimituksiin, palautuksiin, reklamaatioihin ja muihin
          asiakaspalveluasioihin liittyvät yhteydenotot pyydetään ensisijaisesti
          sähköpostitse osoitteeseen <strong>{ORDER_CONTACT_EMAIL}</strong>.
        </p>

        <h2>Tilaaminen</h2>
        <p>
          Tuotteet tilataan ensisijaisesti sivuston tilauslomakkeilla. Tilauksen voi tehdä
          myös sähköpostitse tai pikaviestinten avulla.{' '}
        </p>
        <p>
          Kaikki tilaukset vahvistetaan manuaalisesti erikseen 1-2 arkipäivän kuluessa,
          kun tuotteen saatavuus on tarkistettu. Vahvistuksessa ilmoitetaan tilauksen
          hinta, toimituskulut sekä tilatut tuotteet.
        </p>
        <p>
          Saatavilla olevat toimitustavat näkyvät aina kyseisen tuotteen kassalla.
          Käytössä voivat olla nouto Postista tai automaatista, Postin kotiinkuljetus
          sovittuna aikana tai nouto Järvenpäästä. Noutopiste lähetetään asiakkaan
          kassalla valitsemaan Postin toimipisteeseen tai automaattiin, ellei Posti joudu
          kapasiteettisyistä ohjaamaan lähetystä toiseen noutopaikkaan.
        </p>

        <h2>Maksutavat</h2>
        <p>
          Maksaminen tapahtuu <strong>OP Kevytyrittäjä</strong> -palvelun kautta
          sähköpostitse lähetettävällä laskulla. Maksuaika on 7 vuorokautta. Laskun voi
          maksaa normaalisti verkkopankissa tai mobiilissa.
        </p>

        <h2>Toimitusaika</h2>
        <p>
          {MONDAY_ONLY_SHIPPING_NOTE} {WORMS_SHIPPING_SCHEDULE_TEXT}{' '}
          {STARTER_KIT_SHIPPING_SCHEDULE_TEXT}
        </p>
        <p>Tarkempi toimitusaika ilmoitetaan aina tilausvahvistuksessa.</p>
        <p>
          Postin noutopistelähetykset saapuvat tavallisesti 1-2 arkipäivässä
          postituksesta. Kotiinkuljetuksissa Posti sopii jakeluajan vastaanottajan kanssa.
          Noutopistelähetys kannattaa hakea saapumisilmoituksen jälkeen mahdollisimman
          pian.
        </p>
        <p>
          Jos noutopistehaku ei ole kassalla hetkellisesti käytettävissä, asiakkaan tulee
          halutessaan kirjoittaa toivottu Postin noutopaikka viestikenttään. Tällöin
          noutopaikka asetetaan manuaalisesti tilauksen käsittelyn yhteydessä. Noutopaikan
          voi jättää myös valitsematta, jolloin lähetys ohjataan ilmoitetun postinumeron
          perusteella.
        </p>

        <h2>Peruuttamisoikeus ja peruuttamisohje</h2>
        <p>
          Kuluttaja-asiakkaalla on lähtökohtaisesti kuluttajansuojalain mukainen 14 päivän
          peruuttamisoikeus etämyynnissä. Peruuttamisaika alkaa tavaran
          vastaanottamisesta. Peruuttamisesta on ilmoitettava määräajan kuluessa
          sähköpostitse osoitteeseen <strong>{ORDER_CONTACT_EMAIL}</strong>.
        </p>
        <p>
          Kompostimadoilla ei ole peruuttamisoikeutta kuluttajansuojalain 6 luvun 16 §:n
          mukaisen poikkeuksen perusteella. Poikkeus liittyy siihen, että kyse on elävistä
          kompostimadoista, joita ei voida palautuksen jälkeen käsitellä tai myydä
          edelleen tavanomaisena tuotteena.
        </p>
        <p>
          Matokompostorin aloituspaketilla on peruuttamisoikeus itse pakkauksen osalta,
          mutta ei siihen sisältyvien kompostimatojen osalta. Jos aloituspakkaus on
          ehditty jo lähettää, palautettava summa on tuotteen ostohinta ilman
          toimituskuluja, josta vähennetään pakettiin sisältyneiden matojen osuus. Matojen
          osuus määräytyy sen hinnan mukaan, joka on ilmoitettu erikseen aloituspakkauksen
          ostosivulla valitulle matomäärälle.
        </p>
        <p>
          Palautettavan tuotteen tulee olla olennaisesti samassa kunnossa kuin
          vastaanottohetkellä. Asiakas vastaa palautuskuluista, ellei toisin sovita. Ennen
          palautuksen lähettämistä pyydän ottamaan yhteyttä sähköpostitse osoitteeseen{' '}
          <strong>{ORDER_CONTACT_EMAIL}</strong>, jotta palautustavasta voidaan sopia.
        </p>
        <p>
          Jos haluat käyttää peruuttamisoikeuttasi, ilmoita sähköpostissasi vähintään
          nimesi, tilaamasi tuote, tilauspäivä tai vastaanottopäivä sekä tieto siitä, että
          haluat peruuttaa kaupan kokonaan tai osittain.
        </p>

        <h2>Virhevastuu</h2>
        <p>
          Tuotteilla on kuluttajansuojalain mukainen virhevastuu. Jos toimitettu tuote on
          virheellinen, vaurioitunut tai ei vastaa sovittua, ota yhteyttä viipymättä
          sähköpostitse osoitteeseen <strong>{ORDER_CONTACT_EMAIL}</strong>, jotta asia
          voidaan selvittää ja sopia tilanteeseen sopivasta hyvityksestä, korjauksesta,
          uudesta toimituksesta tai muusta lainmukaisesta toimenpiteestä.
        </p>

        <h2>Erimielisyydet ja riidanratkaisu</h2>
        <p>
          Pyrin ratkaisemaan mahdolliset erimielisyydet ensisijaisesti suoraan asiakkaan
          kanssa. Jos kauppasopimusta koskevaa erimielisyyttä ei saada ratkaistua
          neuvottelemalla, kuluttaja voi ottaa yhteyttä kuluttajaneuvontaan (
          <a
            href="https://www.kkv.fi/kuluttaja-asiat/kuluttajaneuvonta/"
            target="_blank"
            rel="noreferrer"
          >
            kkv.fi/kuluttajaneuvonta
          </a>
          ) ja tarvittaessa saattaa asian kuluttajariitalautakunnan käsiteltäväksi (
          <a href="https://www.kuluttajariita.fi" target="_blank" rel="noreferrer">
            kuluttajariita.fi
          </a>
          ).
        </p>
      </div>
    </>
  );
}
