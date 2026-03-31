import {
  BUSINESS_ADDRESS_LINES,
  BUSINESS_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from '@/data/site/contact';
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

        <h2>Rekisterinpitäjän yhteystiedot</h2>
        <p>
          Rekisterinpitäjä: <strong>{BUSINESS_NAME}</strong>
          <br />
          Osoite: <strong>{BUSINESS_ADDRESS_LINES.join(', ')}</strong>
          <br />
          Sähköposti: <strong>{CONTACT_EMAIL}</strong>
          <br />
          Puhelin / WhatsApp: <strong>{CONTACT_PHONE}</strong>
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
            Kysymys- ja aihe-ehdotustiedot: oppaiden yhteydessä lähetetty viesti, viestin
            tyyppi (kysymys tai aihe-ehdotus), mahdollinen sähköpostiosoite, nykyisen
            sivun URL-osoite ja viittaava sivu (referrer).
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
          tilauslomakkeella tai viestin oppaiden yhteydessä olevalla kysymys- ja
          aihe-ehdotuslomakkeella. Lisäksi kolmannen osapuolen palvelut (esimerkiksi
          Google AdSense, Vercel Analytics, Speed Insights ja Formspree) voivat kerätä
          teknisiä tietoja sivuston käytöstä. Tilauslomakkeiden välityksessä käytetään
          lisäksi Verceliä ja Cloudflare Tunnel -yhteyttä. Sivustoa voi käyttää myös
          mainostenesto-ohjelmien tai muiden seurantaa estävien työkalujen kanssa.
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
            Kysymysten vastaanotto, niihin vastaaminen sekä uusien opasaiheiden
            kehittäminen viestien perusteella: oikeusperusteena oikeutettu etu (GDPR Art.
            6(1)(f)).
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
            Käyttäjäasetusten tallentaminen (localStorage): Oikeusperusteena oikeutettu
            etu (GDPR Art. 6(1)(f)) sivuston käytettävyyden parantamiseksi.
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

        <h2>Oppaiden kysymys- ja aihe-ehdotuslomake (Formspree)</h2>
        <p>
          Oppaiden yhteydessä olevien kysymys- ja aihe-ehdotuslomakkeiden viestit
          välitetään Formspree-palvelun kautta. Lähetyksessä välitetään viestin lisäksi
          myös viestin tyyppi, sivun URL-osoite, sivun otsikko ja viittaava sivu
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
          sivuston käytön ja suorituskyvyn seuraamiseen. Vercelin dokumentaation mukaan
          Web Analyticsin ja Speed Insightsin keräämät datapisteet ovat anonyymejä, eikä
          niitä ole tarkoitettu yksittäisen käyttäjän tai IP-osoitteen tunnistamiseen. Web
          Analytics ei käytä kolmannen osapuolen evästeitä, vaan kävijä tunnistetaan
          pyynnöstä muodostettavan tiivisteen avulla. Näiden palveluiden avulla voidaan
          seurata esimerkiksi sivulatauksia, reittejä, URL-osoitteita, viittaavia sivuja,
          laitetyyppiä, selainta, käyttöjärjestelmää, maata, verkkonopeutta ja Web Vitals
          -metriikoita aggregoidussa muodossa sivuston kehittämiseksi. Vierailijaistunnot
          hylätään 24 tunnin jälkeen, ja aggregoidut tiedot säilytetään Vercelin
          käytäntöjen mukaisesti.
        </p>
        <p>
          Vercelin dokumentaatio korostaa myös sitä, että URL-osoitteet ja niiden
          parametrit voivat joissakin toteutuksissa sisältää henkilötietoja. Lieromaan
          sivusto on pyritty toteuttamaan niin, ettei URL-osoitteisiin sisällytetä
          tarkoituksellisesti nimiä, sähköpostiosoitteita, tilausnumeroita tai muita
          vastaavia tunnisteita.
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
          selaimesi paikalliseen tallennustilaan (localStorage). Tieto tallennetaan
          ainoastaan laitteellesi, eikä sitä siirretä eteenpäin. Tietoa säilytetään
          toistaiseksi, kunnes poistat sen selaimestasi.
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
        <p>
          Voit pyytää lisätietoa käytetyistä siirtoperusteista ja suojatoimista ottamalla
          yhteyttä rekisterinpitäjään.
        </p>

        <h2>Tietojen vastaanottajat</h2>
        <p>
          Henkilötietoja luovutetaan kolmansille osapuolille vain edellä mainituissa
          palveluissa kuvatulla tavalla (Cloudflare, Zoho Mail, Formspree oppaiden
          kysymys- ja aihe-ehdotuslomakkeen osalta, Posti, OP Kevytyrittäjä, Google ja
          Vercel). Henkilötietoja ei myydä eikä luovuteta muihin tarkoituksiin ilman
          lainmukaista perustetta.
        </p>

        <h2>Tietojen säilytysaika</h2>
        <ul>
          <li>
            Tilauspyyntöjä, joita ei vahvisteta, säilytetään enintään 12 kuukautta, ellei
            pidempi säilytys ole tarpeen esimerkiksi väärinkäytösten selvittämiseksi.
          </li>
          <li>
            Vahvistettuihin tilauksiin liittyviä yhteystietoja ja toimitustietoja
            säilytetään niin kauan kuin se on tarpeen tilauksen toimittamiseksi,
            asiakaspalvelun hoitamiseksi ja mahdollisten reklamaatioiden käsittelemiseksi.
          </li>
          <li>
            Laskutukseen ja kirjanpitoon liittyviä tietoja säilytetään Suomen
            kirjanpitolainsäädännön edellyttämän ajan.
          </li>
          <li>
            Oppaiden kysymys- ja aihe-ehdotuslomakkeiden kautta lähetettyjä viestejä
            säilytetään niin kauan kuin se on tarpeen viestiin vastaamiseksi,
            aihe-ehdotusten käsittelemiseksi tai sivuston sisällön kehittämiseksi,
            kuitenkin enintään 24 kuukautta ilman erillistä perustetta.
          </li>
          <li>
            Reklamaatioihin, palautuksiin ja muihin jälkikäteisiin
            asiakaspalvelutilanteisiin liittyviä tietoja säilytetään niin kauan kuin asian
            käsittely kohtuudella edellyttää.
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
          {CONTACT_EMAIL}. Pyyntöihin vastataan kuukauden kuluessa.
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
          sähköpostitse osoitteeseen {CONTACT_EMAIL}.
        </p>
      </div>
    </>
  );
}
