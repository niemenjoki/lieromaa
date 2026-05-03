import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';
import {
  BUSINESS_ADDRESS_LINES,
  BUSINESS_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from '@/lib/site/contact';

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
            Arvostelutiedot: arvostelulinkin tunniste, tuotetieto, tähtiarvio, kirjoitettu
            arvostelu sekä mahdollinen näyttönimi.
          </li>
          <li>
            Tekninen käyttödata: sivupolut, aikaleimat, anonyymi selainkohtainen tunniste,
            istuntotieto, edellinen sisäinen sivu, ulkoisen viittaavan sivun host-nimi,
            arvioitu viipymä, scrollaussyvyys, lomakealoitukset, lomakelähetykset,
            tilaus-CTA-klikkaukset, ostoskori- ja tilauslomaketapahtumat sekä
            suorituskykymittarit.
          </li>
          <li>
            Käyttäjäasetukset: teema-asetus (vaalea/tumma tila), joka tallennetaan
            selaimen localStorageen.
          </li>
          <li>
            Ostoskoritiedot: ostoskoriin lisättyjen tuotteiden tunnisteet, määrät ja korin
            viimeisin muokkausaika.
          </li>
        </ul>

        <h2>Tietojen kerääminen ja lähteet</h2>
        <p>
          Tietoja kerätään ensisijaisesti suoraan sinulta, kun lähetät tilauksen
          tilauslomakkeella, jätät arvostelun tai lähetät viestin oppaiden yhteydessä
          olevalla kysymys- ja aihe-ehdotuslomakkeella. Lisäksi kolmannen osapuolen
          palvelut (esimerkiksi Google AdSense ja Speed Insights) voivat kerätä teknisiä
          tietoja sivuston käytöstä. Lieromaa käyttää lisäksi omaa ensimmäisen osapuolen
          analytiikkaa, joka tallentaa vain sivuston käytön kannalta olennaiset mittarit
          omalle palvelimelle suostumuksen perusteella. Tilaus- ja arvostelulomakkeiden
          välityksessä käytetään lisäksi Verceliä ja Cloudflare Tunnel -yhteyttä. Sivustoa
          voi käyttää myös mainostenesto-ohjelmien tai muiden seurantaa estävien
          työkalujen kanssa.
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
            Arvostelujen vastaanotto, tarkistaminen ja julkaiseminen: oikeusperusteena
            suostumus (GDPR Art. 6(1)(a)) sekä väärinkäytösten torjunnan osalta oikeutettu
            etu (GDPR Art. 6(1)(f)).
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
            Sivuston käytön ja suorituskyvyn analysointi (Lieromaan oma ensimmäisen
            osapuolen analytiikka ja Speed Insights): ensimmäisen osapuolen analytiikan
            oikeusperusteena suostumus (GDPR Art. 6(1)(a)) ja Speed Insightsin osalta
            oikeutettu etu (GDPR Art. 6(1)(f)) sivuston kehittämiseksi.
          </li>
          <li>
            Käyttäjäasetusten tallentaminen (localStorage): Oikeusperusteena oikeutettu
            etu (GDPR Art. 6(1)(f)) sivuston käytettävyyden parantamiseksi.
          </li>
          <li>
            Ostoskorin tallentaminen selaimeen: oikeusperusteena oikeutettu etu (GDPR Art.
            6(1)(f)) ostoskorin ja tilaamisen käytettävyyden parantamiseksi.
          </li>
        </ul>

        <h2>Tilauslomakkeet</h2>
        <p>
          Tilauslomakkeiden lähetykset vastaanotetaan ensin Lieromaan julkisella
          verkkosivustolla Vercelissä ja välitetään sieltä Lieromaan omaan
          tilaustenhallintapalveluun. Yhteys julkisen sivuston ja kotipalvelimella
          toimivan tilaustenhallinnan välillä kulkee Cloudflare Tunnel -palvelun kautta.
          Tilaustiedot tallennetaan Lieromaan hallinnoimaan paikalliseen
          SQLite-tietokantaan kotipalvelimella. Tilauksiin liittyviä sähköposteja
          lähetetään Zoho Mailin SMTP-palvelun kautta. Tilauspyynnön yhteydessä voidaan
          välittää myös tekninen pyyntökonteksti, kuten selaimen user agent, lähetyksen
          alkuperä- ja viittaustieto sekä välittävän palvelun antama IP-osoitetieto, jotta
          lomakkeen väärinkäyttöä voidaan selvittää ja palvelua suojata.
        </p>

        <h2>Arvostelulomake</h2>
        <p>
          Arvostelulomake toimii henkilökohtaisella arvostelulinkillä, joka liittyy
          aiempaan tilaukseen. Arvostelun yhteydessä käsitellään arvostelulinkin tunniste,
          tuotetieto, tähtiarvio, kirjoitettu arvostelu ja mahdollinen näyttönimi.
          Arvostelu tallennetaan ensin tarkistettavaksi, eikä sitä julkaista sivustolla
          ennen manuaalista hyväksyntää.
        </p>

        <h2>Oppaiden kysymys- ja aihe-ehdotuslomake</h2>
        <p>
          Oppaiden yhteydessä olevien kysymys- ja aihe-ehdotuslomakkeiden viestit
          vastaanotetaan ensin Lieromaan julkisella verkkosivustolla Vercelissä ja
          välitetään sieltä Lieromaan omaan tilaustenhallintapalveluun Cloudflare Tunnel
          -yhteyden kautta. Lähetyksessä välitetään viestin lisäksi myös viestin tyyppi,
          mahdollinen sähköpostiosoite, sivun URL-osoite, sivun otsikko ja viittaava sivu
          (referrer), jos sellainen on saatavilla. Uudesta viestistä lähetetään
          sähköposti-ilmoitus Lieromaan ylläpitäjälle Zoho Mailin SMTP-palvelun kautta.
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

        <h2>Ensimmäisen osapuolen analytiikka ja Speed Insights</h2>
        <p>
          Sivustolla käytetään Lieromaan omaa kevyttä ensimmäisen osapuolen analytiikkaa
          sekä Vercel Speed Insights -palvelua sivuston käytön ja suorituskyvyn
          seuraamiseen. Ensimmäisen osapuolen analytiikka käynnistyy vasta, kun olet
          hyväksynyt analytiikan ja mainontaan liittyvän päätelaitetallennuksen
          suostumuksenhallintatyökalussa. Tällöin analytiikka tallentaa omalle
          palvelimelle anonyymin selaimeen tallennetun tunnisteen, istuntotunnisteen,
          sivupolun, aikaleiman, edellisen sisäisen sivun, ulkoisen viittaavan sivun
          host-nimen (esimerkiksi google.com tai com.linkedin.android), arvioidun
          viipymän, scrollaussyvyyden, lomakealoitukset, lomakelähetykset ja
          tilaus-CTA-klikkaukset. Lisäksi analytiikka voi tallentaa anonyymejä tapahtumia,
          kuten ostoskoriin lisäämisen, tilauslomakkeen lähetysyrityksen ja onnistuneen
          tilauslomakkeen lähetyksen. Tietoja käytetään vain sen ymmärtämiseen, miten
          sivuilla liikutaan ja missä kohtaa kävijät osoittavat kiinnostusta tilaamiseen
          tai muihin lomakkeisiin.
        </p>
        <p>
          Ensimmäisen osapuolen analytiikka ei tallenna IP-osoitteita, selaimen tai
          laitteen tarkkoja tunnistetietoja, maantieteellistä sijaintia eikä käytä
          sormenjälkitunnistusta tai muita vastaavia tunnistuskeinoja. Analytiikan
          tapahtumia ei yhdistetä yksittäisiin tilaustietoihin, kuten nimeen,
          sähköpostiosoitteeseen, puhelinnumeroon, toimitusosoitteeseen tai
          tilausnumeroon. Raportointi tehdään istunto- ja sivuryhmätasolla, jotta voidaan
          nähdä yleisesti miten tilaavat istunnot etenevät sivustolla ilman yksittäisen
          asiakkaan selaushistorian yhdistämistä tilaukseen. URL-parametreja ei tallenneta
          analytiikkaan. Anonyymi kävijätunniste säilytetään suostumuksen jälkeen selaimen
          localStoragessa ja istuntotieto sessionStoragessa. Speed Insights kerää
          suorituskykymittareita palveluntarjoajansa käytäntöjen mukaisesti.
        </p>
        <p>
          Ensimmäisen osapuolen analytiikkadata tallennetaan Lieromaan hallinnoimaan
          SQLite-tietokantaan kotipalvelimella. Lisätietoja Speed Insightsista löydät
          palveluntarjoajan sivulta:{' '}
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
          selaimesi paikalliseen tallennustilaan (localStorage). Ostoskori tallentuu
          localStorageen, jotta voit jatkaa tilaamista myöhemmin samalla selaimella.
          Ostoskori poistetaan automaattisesti, jos sitä ei muokata 7 päivään. Lisäksi
          anonyymi kävijätunniste tallennetaan suostumuksen jälkeen localStorageen ja
          istuntotieto sessionStorageen ensimmäisen osapuolen analytiikkaa varten. Näistä
          tunnisteista ei voida päätellä henkilöllisyyttäsi. Analytiikan kieltomerkintä
          voidaan tallentaa localStorageen, jos käytät erillistä analytiikan estolinkkiä.
        </p>

        <h2>Evästeet</h2>
        <p>
          Sivusto ei itse käytä analytiikkaevästeitä. Ensimmäisen osapuolen analytiikka
          käyttää suostumuksen jälkeen selaimen localStoragea ja sessionStoragea, ei
          evästeitä. Google AdSense sekä muut kolmannen osapuolen palvelut voivat
          kuitenkin käyttää evästeitä mainosten näyttämiseen, kohdentamiseen ja
          tilastointiin. Voit estää evästeiden käytön selaimesi asetuksista tai asettaa
          ilmoituksen evästeiden lähettämisestä. Voit peruuttaa suostumuksesi milloin
          tahansa suostumuksenhallintatyökalun kautta tai selaimen asetuksista.
        </p>

        <h2>Tietojen siirto EU-/ETA-alueen ulkopuolelle</h2>
        <p>
          Osa käytetyistä palveluista (kuten Google, Cloudflare, Vercel ja mahdollisesti
          Zoho Mail käytetyn palvelinalueen mukaan) voi käsitellä tietoja EU-/ETA-alueen
          ulkopuolella. Tällöin siirrot toteutetaan GDPR:n edellyttämillä suojatoimilla,
          kuten vakiosopimuslausekkeilla.
        </p>
        <p>
          Voit pyytää lisätietoa käytetyistä siirtoperusteista ja suojatoimista ottamalla
          yhteyttä rekisterinpitäjään.
        </p>

        <h2>Tietojen vastaanottajat</h2>
        <p>
          Henkilötietoja luovutetaan kolmansille osapuolille vain edellä mainituissa
          palveluissa kuvatulla tavalla (Cloudflare, Zoho Mail, Posti, OP Kevytyrittäjä,
          Google ja Vercel). Oppaiden kysymys- ja aihe-ehdotuslomakkeiden viestit sekä
          arvostelut välitetään Lieromaan omaan tilaustenhallintapalveluun Vercelin
          kautta. Ensimmäisen osapuolen analytiikkadata pysyy Lieromaan omassa
          hallinnassa. Henkilötietoja ei myydä eikä luovuteta muihin tarkoituksiin ilman
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
            Lähetettyihin ja peruttuihin tilauksiin liittyvät henkilötiedot anonymisoidaan
            tilausjärjestelmässä pääsääntöisesti 12 kuukauden kuluttua lähetyksestä tai
            peruutuksesta, minkä jälkeen järjestelmään jää vain tilaushistorian seurantaan
            tarvittava ei-henkilökohtainen tieto.
          </li>
          <li>
            Laskutukseen ja kirjanpitoon liittyviä tietoja säilytetään Suomen
            kirjanpitolainsäädännön edellyttämän ajan. OP Kevytyrittäjä voi säilyttää
            laskutus- ja kirjanpitotietoja tätä pidempään oman lakisääteisen
            velvollisuutensa perusteella.
          </li>
          <li>
            Oppaiden kysymys- ja aihe-ehdotuslomakkeiden kautta lähetettyjä viestejä
            säilytetään niin kauan kuin se on tarpeen viestiin vastaamiseksi,
            aihe-ehdotusten käsittelemiseksi tai sivuston sisällön kehittämiseksi,
            kuitenkin enintään 24 kuukautta ilman erillistä perustetta.
          </li>
          <li>
            Arvostelut säilytetään niin kauan kuin arvostelua tarvitaan sivuston
            asiakasarvostelujen näyttämiseen ja luotettavuuden varmistamiseen, ellei
            poistopyyntöä tai muuta perustetta poistamiselle ole. Julkaistusta
            arvostelusta voidaan poistaa näyttönimi tai muu tunnistettava tieto pyynnöstä.
          </li>
          <li>
            Reklamaatioihin, palautuksiin ja muihin jälkikäteisiin
            asiakaspalvelutilanteisiin liittyviä tietoja säilytetään niin kauan kuin asian
            käsittely kohtuudella edellyttää.
          </li>
          <li>
            Ensimmäisen osapuolen analytiikkatiedot säilyvät Lieromaan omassa
            SQLite-tietokannassa niin kauan kuin niitä tarvitaan sivuston käytön
            seuraamiseen ja kuukausiraportointiin. Speed Insightsin tiedot säilyvät
            palveluntarjoajan käytäntöjen mukaisesti.
          </li>
          <li>
            LocalStorageen tallennettu teema-asetus, ostoskoritieto ja anonyymi
            kävijätunniste sekä sessionStorageen tallennettu istuntotieto säilyvät
            käytössä olevassa selaimessa, kunnes poistat ne tai selain poistaa ne omien
            säilytyskäytäntöjensä mukaisesti. Ostoskori poistetaan sivuston toimesta
            viimeistään 7 päivän käyttämättömyyden jälkeen.
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
