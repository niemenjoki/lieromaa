import Layout from '@/components/Layout';
import classes from '@/styles/PrivacyPage.module.css';
import Link from 'next/link';

const PrivacyPage = () => {
  return (
    <Layout title={'Tietosuojaseloste | Luomuliero'}>
      <div className={classes.PrivacyPage}>
        <h1>Tietosuojaseloste</h1>
        <p>
          <em>Päivitetty: 14. huhtikuuta 2025</em>
        </p>

        <p>
          Luomuliero verkkosivustoa ylläpitää Joonas Niemenjoki. Tässä
          tietosuojaselosteessa kerrotaan käytännöistä, jotka liittyvät
          henkilötietojesi keräämiseen ja käyttöön tällä verkkosivustolla sekä
          luovuttamiseen kolmansille osapuolille.
        </p>
        <h2>Tietojen kerääminen ja käyttö</h2>
        <p>
          Tämä verkkosivusto ei suoraan kerää mitään henkilökohtaisesti
          tunnistettavaa tietoa. Se kuitenkin käyttää kolmannen osapuolen
          palveluita, jotka saattavat kerätä tietoa. Voit jatkaa tämän
          verkkosivuston käyttöä vapaasti, vaikka käyttäisit mainosten
          esto-ohjelmia tai muita palveluita, jotka estävät tietojen keräämistä
          kolmannen osapuolen palveluilla tällä verkkosivustolla.
        </p>
        <h2>Google AdSense ja Google Analytics</h2>
        <p>
          Tällä sivustolla käytetään Google AdSensea ja Google Analyticsia
          mainosten näyttämiseen ja käyttäjien käyttäytymisen analysointiin.
          Nämä palvelut voivat kerätä tietoja, kuten IP-osoitteet, selaintyyppi,
          selaustottumukset ja laitetiedot. Google voi käsitellä tietoja
          itsenäisenä rekisterinpitäjänä ja siirtää niitä EU-/ETA-alueen
          ulkopuolelle. Tietosiirrot suojataan GDPR:n mukaisesti
          vakiosopimuslausekkeilla. Google Consent Mode -toimintoa käytetään
          suostumuksen pyytämiseen ennen ei-välttämättömien evästeiden
          tallentamista tai käyttämistä.
        </p>
        <p>
          Lisätietoja siitä, miten nämä palvelut käsittelevät tietojasi, löydät
          Googlen tietosuojakäytännöistä:{' '}
          <a
            href="https://support.google.com/adsense/topic/13821022?hl=fi"
            target="_blank"
            rel="noreferrer"
          >
            Google AdSensen tietosuojakäytännöt
          </a>{' '}
          ja{' '}
          <a
            href="https://support.google.com/analytics/topic/2919631?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            Google Analyticsin tietosuojakäytännöt
          </a>
        </p>
        <h2>LocalStorage</h2>
        <p>
          Kun vaihdat vaaleaan tai tummaan tilaan tai suomen ja englannin kielen
          välillä tällä verkkosivustolla, sivusto tallentaa mieltymyksesi
          selaimesi paikalliseen tallennustilaan (localStorage). Tällä tavoin
          voimme automaattisesti käyttää valitsemaasi teemaa ja kieltä
          seuraavalla sivuston käyntikerralla. Tämä tieto tallennetaan
          paikallisesti laitteellesi eikä sitä siirretä minnekään.
        </p>
        <h2>Evästeet</h2>
        <p>
          Tämä sivusto ei suoraan käytä evästeitä, mutta se käyttää kolmannen
          osapuolen palveluita, jotka käyttävät evästeitä. Voit ohjeistaa
          selaimesi kieltämään kaikki evästeet tai ilmoittamaan, kun evästeitä
          lähetetään.
        </p>
        <h2>Yhteys</h2>
        <p>
          Jos sinulla on kysymyksiä tästä tietosuojakäytännöstä, ota yhteyttä
          minuun sähköpostitse osoitteeseen joonas.niemenjoki(a)gmail.com.
        </p>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
