import Layout from '@/components/Layout';
import classes from '@/styles/PrivacyPage.module.css';

const OrderPolicyPage = () => {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Tilaus- ja toimitusehdot',
      description:
        'Luomulieron tilausta, maksua, toimitusta ja palautuksia koskevat ehdot. Voimassa 1.10.2025 alkaen.',
      url: 'https://www.luomuliero.fi/tilausehdot',
      datePublished: '2025-10-01T00:00:00+03:00',
      inLanguage: 'fi',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Luomuliero',
        url: 'https://www.luomuliero.fi',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Luomuliero (Joonas Niemenjoki, Y-tunnus 3002257-7)',
        url: 'https://www.luomuliero.fi',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.luomuliero.fi/icons/apple-touch-icon.png',
        },
      },
    },
  ];
  return (
    <Layout
      title={'Tilaus- ja toimitusehdot | Luomuliero'}
      showTermsLink={true}
      structuredData={structuredData}
    >
      <div className={classes.PrivacyPage}>
        <h1>Tilaus- ja toimitusehdot</h1>
        <p>
          <em>Voimassa 1.10.2025 alkaen.</em>
        </p>
        <h2>Yleistä</h2>
        <p>
          Luomuliero on kaupparekisteriin rekisteröiity toiminimi, jota käytän toimiessani
          yksityisenä elinkeinonharjoittaja (Y-tunnus: 3002257-7). Vähäisen toiminnan
          vuoksi en toistaiseksi ole arvonlisäverovelvollinen (arvolisäverolain 3 §) ja
          kaikki sivuston hinnat ovat näin ollen verottomia. Pidätän oikeuden hintojen ja
          postikulujen muutoksiin.
        </p>
        <h2>Tilaaminen</h2>
        <p>
          Tuotteet tilataan sähköpostitse tai pikaviestinten avulla. Kaikki tilaukset
          vahvistetaan erikseen, kun tuotteen saatavuus on tarkistettu. Vahvistuksessa
          ilmoitetaan tilauksen hinta, toimituskulut sekä tilatut tuotteet.
        </p>
        <h2>Maksutavat</h2>
        <p>
          Maksutapana käytetään oletusarvoisesti MobilePay-maksua ja toissijaisesti
          käteistä rahaa tai suoraa tilisiirtoa
        </p>
        <h2>Toimitusaika</h2>
        <p>
          Matotilaukset postitetaan tilausta seuraavana maanantaina tai tiistaina. Matoja
          ei postiteta keskiviikon ja sunnuntain välisenä aikana, jotta varmistetaan,
          ettei madot jää postin varastoon viikonlopuksi. Mahdolliset muut tuotteet
          toimitetaan Postin kuljettavaksi viimeistään kolmen päivän kuluessa maksun
          suorituksesta.
        </p>
        <h2>Palautusoikeus</h2>
        <p>
          Asiakkaalla on kuluttajansuojalain mukainen 14 päivän vaihto- ja palautusoikeus.
          Palautusoikeus kuitenkin koskee vain käyttämättömiä tuotteita.
        </p>
        <p>
          Madoilla ei ole palautusoikeutta kuluttajansuojalain 6 luvun 16 § perusteella
        </p>
        <p>
          Jos haluat palauttaa tuotteesi, ota yhteyttä minuun samassa kanavassa kuin
          tilaus tehtiin.
        </p>
      </div>
    </Layout>
  );
};

export default OrderPolicyPage;
