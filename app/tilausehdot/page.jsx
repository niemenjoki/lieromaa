import SafeLink from '@/components/SafeLink/SafeLink';
import {
  COMPOST_CHOW_SHIPPING_SCHEDULE_TEXT,
  MONDAY_ONLY_SHIPPING_NOTE,
  STARTER_KIT_SHIPPING_SCHEDULE_TEXT,
  WORMS_SHIPPING_SCHEDULE_TEXT,
} from '@/lib/commerce/shippingSchedule.mjs';
import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';
import {
  BUSINESS_ADDRESS_LINES,
  BUSINESS_ID,
  BUSINESS_NAME,
  CONTACT_PHONE,
  ORDER_CONTACT_EMAIL,
  ORDER_WHATSAPP_URL,
} from '@/lib/site/contact';

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
          Kaikki tilaukset vahvistetaan manuaalisesti erikseen normaalisti 1-2 arkipäivän
          kuluessa, kun tuotteen saatavuus on tarkistettu. Sivustolla erikseen ilmoitetut
          loma- ja poissaoloajat voivat siirtää tilausten käsittelyn, vahvistuksen ja
          toimituksen loman jälkeiseen käsittelyyn. Vahvistuksessa ilmoitetaan tilauksen
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
        <p>
          Maksamattomasta laskusta voidaan lähettää maksumuistutus, ja edelleen maksamatta
          oleva saatava voidaan siirtää perintään voimassa olevan lainsäädännön
          mukaisesti. Erääntyneelle saatavalle voidaan periä korkolain mukainen
          viivästyskorko sekä lainmukaiset muistutus- ja perintäkulut. Pidätän oikeuden
          olla hyväksymättä uusia tilauksia asiakkaalta, jolla on avoimia, erääntyneitä
          tai perintään siirrettyjä saatavia.
        </p>

        <h2>Toimitusaika</h2>
        <p>
          {MONDAY_ONLY_SHIPPING_NOTE} {WORMS_SHIPPING_SCHEDULE_TEXT}{' '}
          {COMPOST_CHOW_SHIPPING_SCHEDULE_TEXT} Sunnuntaina tai maanantaina tehty mato-
          tai kuituseostilaus siirtyy seuraavan viikon maanantailähetykseen.{' '}
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
          vastaanottamisesta.
        </p>
        <p>
          Jos haluat tehdä peruuttamisilmoituksen muusta syystä kuin tuotteen virheen
          vuoksi, voit käyttää verkkolomaketta sivulla{' '}
          <SafeLink href="/peruuta-tilaus">peruuta tilaus</SafeLink>. Ilmoituksen voi
          tehdä myös sähköpostitse osoitteeseen <strong>{ORDER_CONTACT_EMAIL}</strong>.
          Verkkolomakkeen lähettämisestä lähetetään automaattinen vahvistus sähköpostitse.
          Vahvistus koskee ilmoituksen vastaanottamista; vastaan erikseen mahdollisista
          palautus- ja maksujärjestelyistä tilauksen tilanteen ja sisällön mukaan.
        </p>
        <p>
          Huomaathan, että postitettuja matotilauksia ei voi peruuttaa, koska
          kompostimatoja ei voida palautuksen jälkeen käsitellä tai myydä edelleen
          tavanomaisena tuotteena. Muilla tuotteilla on kuitenkin normaali
          peruuttamisoikeus, vaikka ne olisi tilattu samassa tilauksessa matojen kanssa.
        </p>
        <p>
          Palautettavan tuotteen tulee olla olennaisesti samassa kunnossa kuin
          vastaanottohetkellä. Asiakas vastaa palautuskuluista, ellei toisin sovita. Ennen
          palautuksen lähettämistä pyydän ottamaan yhteyttä sähköpostitse osoitteeseen{' '}
          <strong>{ORDER_CONTACT_EMAIL}</strong>, jotta palautustavasta voidaan sopia. Jos
          peruutat tilauksesi peruutuslomakkeella, sähköpostia ei tarvitse lähettää, vaan
          olen sinuun yhteydessä saatuani peruutusilmoituksen.
        </p>
        <p>
          Jos tuotteessa tai toimituksessa on virhe, peruuttamisilmoituksen lomake ei ole
          oikea ensisijainen kanava. Ota silloin yhteyttä sähköpostitse osoitteeseen{' '}
          <strong>{ORDER_CONTACT_EMAIL}</strong>, puhelimitse tai WhatsAppilla numeroon{' '}
          <strong>{CONTACT_PHONE}</strong> tai{' '}
          <a href={ORDER_WHATSAPP_URL} target="_blank" rel="noreferrer">
            WhatsAppin kautta.
          </a>{' '}
          Selvitetään ja korjataan virhe erikseen.
        </p>
        <p>
          Jos haluat käyttää peruuttamisoikeuttasi sähköpostitse, kerro viestissäsi
          mahdollisuuksien mukaan nimesi, tilausnumero tai muu tunnistetieto, tilaamasi
          tuotteet, tilauspäivä tai vastaanottopäivä sekä tieto siitä, haluatko peruuttaa
          kaupan kokonaan vai osittain.
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
