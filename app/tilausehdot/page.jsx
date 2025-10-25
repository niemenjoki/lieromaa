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
          <strong> OP Kevytyrittäjä </strong>-palvelun kautta. Kaikki sivuston hinnat
          sisältävät arvonlisäveron. Pidätän oikeuden hintojen ja toimitusehtojen
          muutoksiin.
        </p>

        <h2>Tilaaminen</h2>
        <p>
          Tuotteet tilataan sähköpostitse tai pikaviestinten avulla. Kaikki tilaukset
          vahvistetaan erikseen, kun tuotteen saatavuus on tarkistettu. Vahvistuksessa
          ilmoitetaan tilauksen hinta, toimituskulut sekä tilatut tuotteet.
        </p>

        <h2>Maksutavat</h2>
        <p>
          Maksaminen tapahtuu <strong>OP Kevytyrittäjä</strong> -palvelun kautta
          sähköpostitse lähetettävällä laskulla. Maksuaika on 14 vuorokautta. Laskun voi
          maksaa normaalisti verkkopankissa tai mobiilissa.
        </p>

        <h2>Toimitusaika</h2>
        <p>
          Matotilaukset postitetaan tilausta seuraavana maanantaina tai tiistaina. Matoja
          ei postiteta keskiviikon ja sunnuntain välisenä aikana, jotta varmistetaan,
          ettei madot jää Postin varastoon viikonlopuksi. Mahdolliset muut tuotteet
          toimitetaan Postin kuljetettavaksi viimeistään kolmen päivän kuluessa maksun
          suorituksesta.
        </p>

        <h2>Palautusoikeus</h2>
        <p>
          Asiakkaalla on kuluttajansuojalain mukainen 14 päivän vaihto- ja palautusoikeus.
          Palautusoikeus kuitenkin koskee vain käyttämättömiä tuotteita.
        </p>
        <p>
          Madoilla ei ole palautusoikeutta kuluttajansuojalain 6 luvun 16 § perusteella.
        </p>
        <p>
          Jos haluat palauttaa tuotteesi, ota yhteyttä minuun samassa kanavassa kuin
          tilaus tehtiin.
        </p>
      </div>
    </>
  );
}
