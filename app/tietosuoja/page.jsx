import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';

import classes from './Tietosuoja.module.css';
import { updatedAt } from './pageMetadata';
import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <div className={classes.PrivacyPage}>
        <h1>Tietosuojaseloste</h1>
        <p>
          <em>Päivitetty: {formatFinnishDate(updatedAt)}</em>
        </p>

        <p>
          Lieromaa-verkkosivustoa ylläpitää Joonas Niemenjoki (rekisterinpitäjä). Tässä
          tietosuojaselosteessa kerrotaan käytännöistä, jotka liittyvät henkilötietojen
          keräämiseen, käyttöön, säilyttämiseen ja luovuttamiseen kolmansille osapuolille
          tämän sivuston yhteydessä GDPR:n (EU 2016/679) mukaisesti. Sivustoa voi selata
          ilman tilausta, mutta tilausten tekeminen edellyttää tiettyjen henkilötietojen
          antamista. Sivustolla ei käytetä automaattista päätöksentekoa tai profilointia,
          joka tuottaisi oikeusvaikutuksia.
        </p>

        <h2>Mitä tietoja kerätään</h2>
        <p>Tällä sivustolla voidaan käsitellä seuraavia tietoryhmiä:</p>
        <ul>
          <li>
            Tilaustiedot: nimi, sähköposti, puhelinnumero, toimitusosoite, postinumero,
            postitoimipaikka, tilaustuote, toimitustapa, viestikentän sisältö sekä
            mahdolliset alennuskoodiin liittyvät tiedot.
          </li>
          <li>
            Palautetiedot: palautewidgetin kautta lähetetty viesti, mahdollinen
            sähköpostiosoite, nykyisen sivun URL-osoite ja viittaava sivu (referrer).
          </li>
          <li>
            Tekninen käyttödata: esimerkiksi IP-osoite, selain- ja laitetiedot,
            verkkokäyttäytymiseen liittyvät tiedot ja suorituskykymittarit kolmansien
            osapuolten palveluissa.
          </li>
          <li>
            Käyttäjäasetukset: teema-asetus (vaalea/tumma tila), joka tallennetaan
            selaimen localStorageen.
          </li>
        </ul>

        <h2>Tietojen kerääminen ja lähteet</h2>
        <p>
          Tietoja kerätään ensisijaisesti suoraan sinulta, kun lähetät tilauksen
          tilauslomakkeella tai viestin palautewidgetin kautta. Lisäksi kolmannen
          osapuolen palvelut (esimerkiksi Google AdSense, Vercel Analytics, Speed Insights
          ja Formspree) voivat kerätä teknisiä tietoja sivuston käytöstä.
          Tilauslomakkeiden välityksessä käytetään lisäksi Verceliä ja Cloudflare Tunnel
          -yhteyttä. Sivustoa voi käyttää myös mainostenesto-ohjelmien tai muiden
          seurantaa estävien työkalujen kanssa.
        </p>

        <h2>Käsittelyn tarkoitukset ja oikeusperusteet</h2>
        <p>Henkilötietoja käsitellään seuraaviin tarkoituksiin:</p>
        <ul>
          <li>
            Tilausten vastaanotto, käsittely, toimituksen järjestäminen ja
            asiakasviestintä: oikeusperusteena sopimuksen täytäntöönpano tai sopimusta
            edeltävät toimet (GDPR Art. 6(1)(b)).
          </li>
          <li>
            Palautekysymysten vastaanotto, niihin vastaaminen sekä sisältöideoiden
            kehittäminen palautteen perusteella: oikeusperusteena oikeutettu etu (GDPR
            Art. 6(1)(f)).
          </li>
          <li>
            Kirjanpito ja lakisääteiset velvoitteet: oikeusperusteena lakisääteinen
            velvoite (GDPR Art. 6(1)(c)).
          </li>
          <li>
            Roskapostin, väärinkäytösten ja palvelun tietoturvariskien torjunta:
            oikeusperusteena oikeutettu etu (GDPR Art. 6(1)(f)).
          </li>
          <li>
            Mainosten näyttäminen ja kohdentaminen (Google AdSense): Oikeusperusteena
            suostumus (GDPR Art. 6(1)(a)).
          </li>
          <li>
            Sivuston käytön ja suorituskyvyn analysointi (Vercel Analytics ja Speed
            Insights): Oikeusperusteena oikeutettu etu (GDPR Art. 6(1)(f)) sivuston
            kehittämiseksi.
          </li>
          <li>
            Käyttäjäasetusten ja palautewidgetin näyttölogiikan tallentaminen
            (localStorage): Oikeusperusteena oikeutettu etu (GDPR Art. 6(1)(f)) sivuston
            käytettävyyden parantamiseksi.
          </li>
        </ul>

        <h2>Tilauslomakkeet</h2>
        <p>
          Tilauslomakkeiden lähetykset vastaanotetaan ensin Lieromaan julkisella
          verkkosivustolla Vercelissä ja välitetään sieltä Lieromaan omaan
          tilaustenhallinta- palveluun. Yhteys julkisen sivuston ja kotipalvelimella
          toimivan tilaustenhallinnan välillä kulkee Cloudflare Tunnel -palvelun kautta.
          Tilaustiedot tallennetaan Lieromaan hallinnoimaan paikalliseen
          SQLite-tietokantaan kotipalvelimella. Tilauksiin liittyviä sähköposteja
          lähetetään Zoho Mailin SMTP-palvelun kautta.
        </p>

        <h2>Palautewidget (Formspree)</h2>
        <p>
          Palautewidgetin viestit välitetään edelleen Formspree-palvelun kautta.
          Lähetyksessä välitetään viestin lisäksi myös sivun URL-osoite ja viittaava sivu
          (referrer), jos sellainen on saatavilla. Formspree voi käsitellä henkilötietoja
          EU-/ETA-alueen ulkopuolella (esimerkiksi Yhdysvalloissa). Tietosiirrot suojataan
          GDPR:n mukaisilla suojatoimilla, kuten vakiosopimuslausekkeilla.
        </p>

        <h2>Toimitukset (Posti)</h2>
        <p>
          Kun valitset toimituksen Postin kautta, toimitusta varten tarvittavat tiedot
          (kuten nimi, osoite, postinumero, postitoimipaikka, puhelinnumero ja/tai
          sähköposti) syötetään Postin järjestelmään. Posti käsittelee tietoja oman
          tietosuojakäytäntönsä mukaisesti.
        </p>

        <h2>Laskutus ja maksut (OP Kevytyrittäjä)</h2>
        <p>
          Laskutusta ja maksujen käsittelyä varten henkilötietoja luovutetaan OP
          Kevytyrittäjä -palveluun. Tyypillisesti tähän sisältyy nimi ja sähköpostiosoite.
          OP Kevytyrittäjä käsittelee tietoja oman tietosuojakäytäntönsä mukaisesti.
        </p>

        <h2>Google AdSense</h2>
        <p>
          Sivustolla käytetään Google AdSensea mainosten näyttämiseen. Google voi kerätä
          tietoja, kuten IP-osoitteen, selaintyypin, laitetiedot, selaustottumuksia ja
          muita tunnisteita. Google voi käsitellä tietoja itsenäisenä rekisterinpitäjänä
          ja siirtää niitä myös EU-/ETA-alueen ulkopuolelle. Tietosiirrot suojataan GDPR:n
          mukaisesti vakiosopimuslausekkeilla. Google Consent Mode -toimintoa käytetään
          suostumuksen pyytämiseen ennen ei-välttämättömien evästeiden tallentamista tai
          käyttämistä.
        </p>
        <p>
          Google voi käyttää tietoja profilointiin kohdennettujen mainosten näyttämiseksi
          suostumuksen perusteella. Tietoja säilytetään palvelinlokeissa, ja ne
          anonymisoidaan osittain 9 kuukauden (IP-osoite) ja 18 kuukauden (evästeet)
          jälkeen Googlen tietojen säilytyskäytäntöjen mukaisesti.
        </p>
        <p>
          Lisätietoja saat Googlen tietosuojakäytännöistä:{' '}
          <a
            href="https://support.google.com/adsense/topic/13821022?hl=fi"
            target="_blank"
            rel="noreferrer"
          >
            Google AdSensen tietosuojakäytännöt
          </a>{' '}
          ja{' '}
          <a
            href="https://policies.google.com/technologies/retention?hl=fi"
            target="_blank"
            rel="noreferrer"
          >
            Googlen tietojen säilytys
          </a>
          .
        </p>

        <h2>Vercel Analytics ja Speed Insights</h2>
        <p>
          Sivustolla käytetään myös Vercel Analyticsia ja Speed Insights -palvelua
          sivuston käytön ja suorituskyvyn seuraamiseen. Kerätty tieto on tilastollista ja
          anonymisoitua eikä sisällä henkilökohtaisesti tunnistettavia tietoja. Tietoja,
          kuten reitti, URL, verkkonopeus, selain, laite, maa, käyttöjärjestelmä ja Web
          Vitals -metriikit, käytetään aggregoidusti. Näiden palveluiden avulla voidaan
          esimerkiksi seurata kävijämäärää ja kehittää sivuston käytettävyyttä.
          Vierailijaistunnot hylätään 24 tunnin jälkeen, ja aggregoidut tiedot säilytetään
          Vercelin käytäntöjen mukaisesti, tyypillisesti 30–90 päivää suunnitelmasta
          riippuen.
        </p>
        <p>
          Lisätietoja löydät palveluntarjoajien sivuilta:
          <br />
          <a
            href="https://vercel.com/docs/analytics/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            Vercel Analyticsin tietosuoja
          </a>{' '}
          ja{' '}
          <a
            href="https://vercel.com/docs/speed-insights/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            Speed Insightsin tietosuoja
          </a>
          .
        </p>

        <h2>LocalStorage</h2>
        <p>
          Kun vaihdat vaaleaan tai tummaan tilaan, sivusto tallentaa valitsemasi teeman
          selaimesi paikalliseen tallennustilaan (localStorage). Lisäksi palautewidgetin
          näyttämistä hallitaan localStorage-arvoilla <code>lieromaa_session_start</code>,{' '}
          <code>lieromaa_pages_visited</code> ja <code>lieromaa_feedback_last_shown</code>
          . Näillä varmistetaan, että widget näkyy vain aktiivisille kävijöille eikä liian
          usein (korkeintaan 30 päivän välein). Tiedot tallennetaan ainoastaan
          laitteellesi, eikä niitä siirretä eteenpäin. Tietoa säilytetään toistaiseksi,
          kunnes poistat sen selaimestasi.
        </p>

        <h2>Evästeet</h2>
        <p>
          Sivusto ei itse käytä evästeitä, mutta Google AdSense sekä muut kolmannen
          osapuolen palvelut voivat käyttää evästeitä mainosten näyttämiseen,
          kohdentamiseen ja tilastointiin. Voit estää evästeiden käytön selaimesi
          asetuksista tai asettaa ilmoituksen evästeiden lähettämisestä. Voit peruuttaa
          suostumuksesi milloin tahansa suostumuksenhallintatyökalun kautta tai selaimen
          asetuksista.
        </p>

        <h2>Tietojen siirto EU-/ETA-alueen ulkopuolelle</h2>
        <p>
          Osa käytetyistä palveluista (kuten Google, Formspree, Cloudflare ja
          mahdollisesti Zoho Mail käytetyn palvelinalueen mukaan) voi käsitellä tietoja
          EU-/ETA-alueen ulkopuolella. Tällöin siirrot toteutetaan GDPR:n edellyttämillä
          suojatoimilla, kuten vakiosopimuslausekkeilla.
        </p>

        <h2>Tietojen vastaanottajat</h2>
        <p>
          Henkilötietoja luovutetaan kolmansille osapuolille vain edellä mainituissa
          palveluissa kuvatulla tavalla (Cloudflare, Zoho Mail, Formspree palautewidgetin
          osalta, Posti, OP Kevytyrittäjä, Google ja Vercel). Henkilötietoja ei myydä eikä
          luovuteta muihin tarkoituksiin ilman lainmukaista perustetta.
        </p>

        <h2>Tietojen säilytysaika</h2>
        <ul>
          <li>
            Tilausviestejä ja tilauslomakkeiden tietoja säilytetään, kunnes maksu on
            vastaanotettu ja tilaus on toimitettu, ellei säilytys ole tarpeen esimerkiksi
            reklamaatioiden tai lakisääteisten velvoitteiden vuoksi.
          </li>
          <li>
            Palautewidgetin kautta lähetettyjä viestejä säilytetään niin kauan kuin se on
            tarpeen viestiin vastaamiseksi, palautteen käsittelemiseksi tai sivuston
            sisällön kehittämiseksi, kuitenkin enintään 24 kuukautta ilman erillistä
            perustetta.
          </li>
          <li>
            Kirjanpitoon liittyviä tietoja säilytetään Suomen kirjanpitolainsäädännön
            edellyttämän ajan.
          </li>
          <li>
            Vercel Analyticsin ja Speed Insightsin tiedot säilyvät palveluntarjoajan
            käytäntöjen mukaisesti.
          </li>
          <li>
            LocalStorageen tallennettu teema-asetus säilyy käytössä olevassa selaimessa,
            kunnes poistat sen.
          </li>
        </ul>

        <h2>Pakolliset tiedot tilausta varten</h2>
        <p>
          Tilauslomakkeen pakolliset tiedot ovat tarpeen tilauksen käsittelemiseksi ja
          toimittamiseksi. Jos pakollisia tietoja ei anneta, tilausta ei voida käsitellä.
        </p>

        <h2>Rekisteröidyn oikeudet</h2>
        <p>Sinulla on seuraavat oikeudet GDPR:n mukaisesti:</p>
        <ul>
          <li>Oikeus saada pääsy tietoihisi (Art. 15).</li>
          <li>Oikeus tietojen oikaisemiseen (Art. 16).</li>
          <li>Oikeus tietojen poistamiseen ("oikeus tulla unohdetuksi", Art. 17).</li>
          <li>Oikeus käsittelyn rajoittamiseen (Art. 18).</li>
          <li>
            Oikeus vastustaa käsittelyä (Art. 21), esimerkiksi oikeutettuun etuun
            perustuvaa käsittelyä.
          </li>
          <li>Oikeus tietojen siirrettävyyteen (Art. 20).</li>
          <li>
            Oikeus peruuttaa suostumus milloin tahansa (Art. 7(3)), ilman että se
            vaikuttaa ennen peruuttamista suoritetun käsittelyn lainmukaisuuteen.
          </li>
        </ul>
        <p>
          Voit käyttää oikeuksiasi ottamalla yhteyttä sähköpostitse osoitteeseen
          joonas.niemenjoki(a)gmail.com. Pyyntöihin vastataan kuukauden kuluessa.
        </p>

        <h2>Valitusoikeus</h2>
        <p>
          Jos katsot, että henkilötietojesi käsittely rikkoo GDPR:ää, sinulla on oikeus
          tehdä valitus valvontaviranomaiselle, kuten Suomen tietosuojavaltuutetulle (
          <a href="https://tietosuoja.fi" target="_blank" rel="noreferrer">
            tietosuoja.fi
          </a>
          ).
        </p>

        <h2>Yhteystiedot</h2>
        <p>
          Jos sinulla on kysyttävää tästä tietosuojaselosteesta, voit ottaa yhteyttä
          sähköpostitse osoitteeseen joonas.niemenjoki(a)gmail.com.
        </p>
      </div>
    </>
  );
}
