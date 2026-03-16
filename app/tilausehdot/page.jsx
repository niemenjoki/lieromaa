import { ORDER_CONTACT_EMAIL } from '@/data/contact';

import classes from './Tilausehdot.module.css';
import structuredData from './structuredData.json';

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
          <em>Voimassa 1.10.2025 alkaen.</em>
        </p>

        <h2>Yleistä</h2>
        <p>
          Lieromaan toiminta on omaa yritystoimintaani (Y-tunnus: 3002257-7), mutta
          laskutus ja verotuksen hallinnointi hoidetaan
          <strong> OP Kevytyrittäjä </strong>-palvelun kautta. Myynti on
          arvonlisäverotonta arvonlisäverolain 2 luvun 3 § nojalla (vähäinen toiminta).
          Pidätän oikeuden hintojen ja toimitusehtojen muutoksiin.
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

        <h2>Maksutavat</h2>
        <p>
          Maksaminen tapahtuu <strong>OP Kevytyrittäjä</strong> -palvelun kautta
          sähköpostitse lähetettävällä laskulla. Maksuaika on 7 vuorokautta. Laskun voi
          maksaa normaalisti verkkopankissa tai mobiilissa.
        </p>

        <h2>Toimitusaika</h2>
        <p>
          Matojen postitus tapahtuu maanantaisin ja tiistaisin. Maanantaina klo 12
          mennessä tehdyt tilaukset postitetaan tiistaina, ja myöhemmin tehdyt tilaukset
          seuraavan viikon maanantaina. Matoja ei postiteta keskiviikon ja sunnuntain
          välisenä aikana, jotta madot eivät jää Postin varastoon viikonlopuksi.
          Mahdolliset muut tuotteet toimitetaan erikseen vahvistettavan aikataulun mukaan.
        </p>

        <h2>Palautusoikeus</h2>
        <p>
          Asiakkaalla on kuluttajansuojalain mukainen 14 päivän peruuttamisoikeus
          etämyynnissä. Palautusoikeus kuitenkin koskee vain käyttämättömiä tuotteita.
        </p>
        <p>
          Madoilla ei ole palautusoikeutta kuluttajansuojalain 6 luvun 16 § perusteella.
        </p>
        <p>
          Jos haluat palauttaa tuotteesi, ota yhteyttä sähköpostitse{' '}
          <strong>{ORDER_CONTACT_EMAIL}</strong>
        </p>
      </div>
    </>
  );
}
