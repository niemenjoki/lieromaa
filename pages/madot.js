import Advert from '@/components/Advert';
import Layout from '@/components/Layout';
import PostRecommendation from '@/components/PostRecommendation';
import classes from '@/styles/PostPage.module.css';
import getPostRecommendations from '@/utils/getPostRecommendations';
import Link from 'next/link';

const WormsPage = ({ recommendedPosts }) => {
  const title =
    'Osta kompostimatoja (Eisenia fetida) | Kotimaiset madot matokompostointiin';
  const excerpt =
    'Tilaa kotimaisia kompostimatoja (Eisenia fetida) helposti postitettuna koko Suomeen. Aloita oma matokomposti Luomulieron madoilla!';

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Kompostimadot (Eisenia fetida)',
      image:
        'https://www.luomuliero.fi/images/wormspage/kompostimadot-kammenella-eisenia-fetida.jpg',
      description:
        'Kotimaiset kompostimadot (Eisenia fetida) matokompostointiin. Myynnissä 50, 100 ja 200 madon pakkauksina.',
      brand: 'Luomuliero',
      sku: 'MADOT',
      offers: {
        '@type': 'Offer',
        url: 'https://www.luomuliero.fi/madot',
        priceCurrency: 'EUR',
        priceValidUntil: '2026-06-30',
        itemCondition: 'https://schema.org/NewCondition',
        areaServed: 'FI',
        price: '20.00',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Person',
          name: 'Joonas Niemenjoki',
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'FI',
          },
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '8.90',
            currency: 'EUR',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'd',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 2,
              maxValue: 4,
              unitCode: 'd',
            },
          },
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'FI',
          returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
          additionalProperty: [
            {
              '@type': 'PropertyValue',
              name: 'Syy',
              value:
                'Kompostimadot eivät kuulu 14 vrk peruuttamisoikeuden piiriin (Kuluttajansuojalaki 6 luku 16 §)',
            },
          ],
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Kuinka paljon kompostimatoja tarvitsen?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Voit arvioida määrän Luomulieron matolaskurilla. Yleensä 100–200 matoa riittää aloittamaan pienen keittiökompostorin.',
          },
        },
        {
          '@type': 'Question',
          name: 'Voinko tilata kompostimatoja postitse?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Kyllä, toimitan madot postitse pakasterasiassa maanantaisin ja tiistaisin tai voit noutaa Järvenpäästä.',
          },
        },
      ],
    },
  ];

  return (
    <Layout
      title={title + ' | Luomuliero'}
      ads={true}
      description={excerpt}
      structuredData={structuredData}
      showTermsLink={true}
    >
      <article className={classes.PostPage}>
        <h1>{title}</h1>
        <div className={classes.Content}>
          <div className={classes.Flex}>
            <picture>
              <source
                srcSet="/images/wormspage/kompostimatoja_kammenella-800.avif 800w, /images/wormspage/kompostimatoja_kammenella-1200.avif 1200w"
                type="image/avif"
              />
              <source
                srcSet="/images/wormspage/kompostimatoja_kammenella-800.webp 800w, /images/wormspage/kompostimatoja_kammenella-1200.webp 1200w"
                type="image/webp"
              />
              <img
                src="/images/wormspage/kompostimatoja_kammenella-800.jpg"
                srcSet="/images/wormspage/kompostimatoja_kammenella-800.jpg 800w, /images/wormspage/kompostimatoja_kammenella-1200.jpg 1200w"
                alt="Noin 100 kompostimatoa läjässä kämmenellä"
                sizes="(max-width: 600px) 100vw, 800px"
                style={{ height: 'auto' }}
                loading="lazy"
              />
            </picture>
            <div>
              <p>
                Kasvatan ja myyn kotimaisia kompostimatoja (
                <em>Eisenia fetida</em>) omasta kotikompostistani. Madot ovat
                täysin kotimaisia ja kasvaneet luonnonmukaisesti* ilman
                kemikaaleja.
              </p>
              <p>
                Kompostimadot ovat erinomainen tapa muuttaa biojäte
                ravinteikkaaksi mullaksi kotona. Matokompostori voidaan pitää
                sisätiloissa, se on hajuton ja helppohoitoinen. Madot hajottavat
                jätettä tehokkaasti, jopa oman painonsa verran viikossa, ja
                populaatio tuplaantuu noin kolmen kuukauden välein. Kastematoja
                vilkkaammin kiemurtelevat kompostimadot sopivat myös hyvin
                onkimadoiksi.
              </p>
              <p>
                Pakkaus sisältää noin 50 kompostimatoa ja niiden kasvualustaa
                (pahvi- ja puusilppu, kookoskuori, puutarhamulta).
              </p>
              <p>
                Matoja ei saa tilattua suoraan verkkosivun kautta, koska haluan
                varmistaa matojen saatavuuden ennen tilauksen vahvistamista.
                Toimintani on pienimuotoista ja joudun pitämään myynnin
                rajallisena, jotta matojen määrä omassa kompostissani ei vähene
                liikaa. Ota sen sijaan suoraan yhteyttä minuun (ohjeet
                alempana), niin vahvistan saatavuuden ennen maksua.
              </p>
              <h2>Hinnat</h2>
              <ul>
                <li>50 matoa 20€</li>
                <li>100 matoa 30€</li>
                <li>200 matoa 50€</li>
              </ul>
              <p>
                Jos et ole varma kuinka paljon tarvitset matoja, kokeile
                sivustolta löytyvää{' '}
                <Link href="/matolaskuri">matolaskuria</Link>
              </p>
              <h2>Tilaaminen</h2>
              <p>
                Jos haluat tilata matoja tai sinulla on kysyttävää, laita
                viestiä:
              </p>
              <ul>
                <li>
                  📧 Sähköpostitse: <strong>luomuliero@gmail.com</strong>
                </li>
                <li>
                  📸 Instagramissa:{' '}
                  <a
                    href="https://www.instagram.com/luomuliero"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @luomuliero
                  </a>
                </li>
                <li>
                  💬 WhatsAppissa:{' '}
                  <a
                    href="https://wa.me/358503365054?text=Hei!%20Olen%20kiinnostunut%20kompostimadoista."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lähetä viesti WhatsAppissa
                  </a>
                </li>
              </ul>
              <h2>Toimitus ja nouto</h2>
              <p>
                Madot toimitetaan pakasterasiassa postitettuna tai ne voi noutaa
                Järvenpäästä. Suosittelen hakemaan postitetut madot heti
                saapumisilmoituksen saapuessa, koska madot voivat elää
                suljetussa rasiassa vain noin 5 vuorokautta. Lähetän
                matopakkauksia vain maanantaisin ja tiistaisin, jotta madot
                eivät jää viikonlopuksi Postin kyytiin.
              </p>
              <h2>Maksaminen</h2>
              <p>
                Toivon, että tilaukset maksetaan MobilePayllä, mutta voimme
                sopia myös muista maksutavoista kuten käteinen noudon yhteydessä
                tai tilisiirto
              </p>
              <p className={classes.WormsPageNote}>
                Luomuliero on kaupparekisteriin rekisteröiity toiminimi, jota
                käytän toimiessani yksityisenä elinkeinonharjoittaja (Y-tunnus:
                3002257-7). En ole arvolisäverolain 3 § mukaan
                arvonlisäverovelvollinen vähäisen toiminnan vuoksi ja kaikki
                sivuston hinnat ovat näin ollen verottomia.
              </p>
              <p className={classes.WormsPageNote}>
                *Maininta “luonnonmukaisesti” viittaa omiin toimintatapoihini,
                kuten kemikaalittomaan ja kotimaiseen kasvatukseen. En kuulu
                Ruokaviraston, Ely-keskuksen tai Valviran luomuvalvontaan, enkä
                ole maksanut luomu-nimityksen käyttöoikeudesta. Kyse ei ole
                virallisesta luomusertifioidusta tuotannosta.
              </p>
            </div>
          </div>
        </div>
      </article>

      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
      <PostRecommendation
        posts={recommendedPosts}
        customTitle="Aiheeseen liittyviä blogijulkaisuja"
      />
    </Layout>
  );
};

export async function getStaticProps() {
  const recommendedPosts = await getPostRecommendations({
    self: 'madot',
    keywords:
      'kompostimadot, Eisenia fetida, matokompostointi, kastemadot vs kompostimadot, osto, saatavuus, Suomi, hankinta, matojen hoito, käyttö, lajikkeet, opas, kysymykset, harrastus, hyöty, ympäristö, biojäte, kotikompostointi, kasvatus, vinkit',
  });

  return {
    props: { recommendedPosts },
  };
}

export default WormsPage;
