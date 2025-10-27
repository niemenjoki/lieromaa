import Advert from '@/components/Advert/Advert';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import PostRecommendation from '@/components/PostRecommendation/PostRecommendation';
import PromoBox from '@/components/PromoBox/Promobox';
import SafeLink from '@/components/SafeLink/SafeLink';
import { getPostRecommendations } from '@/lib/posts';

import classes from './Madot.module.css';
import structuredData from './structuredData.json';

export { default as generateMetadata } from './generateMetadata';

export const dynamic = 'force-static';

export default async function Page() {
  const recommendedPosts = await getPostRecommendations({
    self: 'madot',
    keywords: [
      'eisenia fetida',
      'kasvit',
      'kompostorin hoito',
      'kompostorin perustaminen',
      'matojen hankinta',
      'matojen hankinta',
      'matokakka',
      'matokompostointi',
      'opas',
      'puutarha',
      'ravinteet',
      'suomi',
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <article className={classes.WormsPage}>
        <PromoBox>
          <h3 style={{ marginTop: 0, color: 'var(--highlight-alt)' }}>Syystarjous 🍂</h3>
          <p style={{ marginBottom: '0.5rem' }}>
            Ilmainen toimitus kaikille kompostimadoille koko Suomeen 30.11.2025 asti.
          </p>
          <SafeLink
            href="/madot-kampanja"
            style={{ fontWeight: 'bold', color: 'var(--highlight-content-link)' }}
          >
            Katso kampanjasivu »
          </SafeLink>
        </PromoBox>
        <h1>Osta Luomulieron Eisenia fetida -kompostimatoja</h1>

        <div className={classes.Content}>
          <ImageSlider
            images={[
              {
                src: '/images/wormspage/kompostimadot_kammenella.avif',
                alt: 'Kourallinen matokompostin sisältöä ja matoja käsissä',
              },
              {
                src: '/images/wormspage/madot_toimituspakkauksessa.avif',
                alt: 'Kompostimadot toimituspakkauksessa',
              },
            ]}
          />

          <p>
            Kasvatan ja myyn kotimaisia kompostimatoja (<em>Eisenia fetida</em>) omasta
            kotikompostistani.
          </p>

          <p>
            Kompostimadot ovat erinomainen tapa muuttaa biojäte ravinteikkaaksi mullaksi
            kotona. Matokompostori voidaan pitää sisätiloissa, se on hajuton ja
            helppohoitoinen. Madot hajottavat jätettä tehokkaasti, jopa oman painonsa
            verran viikossa, ja populaatio tuplaantuu noin kolmen kuukauden välein.
            Kastematoja vilkkaammin kiemurtelevat kompostimadot sopivat myös hyvin
            onkimadoiksi.
          </p>

          <p>
            Pakkaus sisältää noin 50 kompostimatoa ja niiden kasvualustaa (pahvi- ja
            puusilppu, kookoskuori, puutarhamulta).
          </p>

          <p>
            Matoja ei saa tilattua suoraan verkkosivun kautta, koska haluan varmistaa
            matojen saatavuuden ennen tilauksen vahvistamista. Toimintani on
            pienimuotoista ja joudun pitämään myynnin rajallisena, jotta matojen määrä
            omassa kompostissani ei vähene liikaa. Ota sen sijaan suoraan yhteyttä minuun
            (ohjeet alempana), niin vahvistan saatavuuden ennen maksua.
          </p>

          <h2>Hinnat</h2>
          <ul>
            <li>50 matoa 20€</li>
            <li>100 matoa 30€</li>
            <li>200 matoa 50€</li>
          </ul>

          <p>
            Jos et ole varma kuinka paljon tarvitset matoja, kokeile sivustolta löytyvää{' '}
            <SafeLink href="/matolaskuri">matolaskuria</SafeLink>
          </p>

          <h2>Tilaaminen</h2>
          <p>Jos haluat tilata matoja tai sinulla on kysyttävää, laita viestiä:</p>
          <ul>
            <li>
              📧 Sähköpostitse: <strong>lieromaa@gmail.com</strong>
            </li>
            <li>
              📸 Instagramissa:{' '}
              <a
                href="https://www.instagram.com/lieromaa"
                target="_blank"
                rel="noopener noreferrer"
              >
                @lieromaa
              </a>
            </li>
            <li>
              💬 WhatsAppissa:{' '}
              <a
                href="https://api.whatsapp.com/send?phone=358503365054&text=Hei!%20Olen%20kiinnostunut%20kompostimadoista."
                target="_blank"
                rel="noopener noreferrer"
              >
                Lähetä viesti WhatsAppissa
              </a>
            </li>
          </ul>

          <h2>Toimitus ja nouto</h2>
          <p>
            Madot toimitetaan pakasterasiassa postitettuna tai ne voi noutaa Järvenpäästä.
            Suosittelen hakemaan postitetut madot heti saapumisilmoituksen saapuessa,
            koska madot voivat elää suljetussa rasiassa vain noin 5 vrk. Lähetän
            matopakkauksia vain maanantaisin ja tiistaisin, jotta madot eivät jää
            viikonlopuksi Postin kyytiin.
          </p>

          <h2>Maksaminen</h2>
          <p>
            Laskutus tapahtuu <strong>OP Kevytyrittäjä</strong> -palvelun kautta
            sähköpostilaskulla. Saat laskun, kun olemme sopineet tilauksesta. Maksuaika on
            14 vuorokautta.
          </p>

          <p>
            Lieromaan matomyynti hoidetaan <strong>OP Kevytyrittäjä</strong> -palvelun
            kautta. Toiminta on omaa yritystoimintaani (Y-tunnus: 3002257-7), mutta
            laskutus ja verotuksen hallinnointi tapahtuu OP Kevytyrittäjän kautta.
          </p>
          <p>
            OP Kevytyrittäjä on OP Ryhmän tarjoama palvelu, jonka kautta yrittäjä voi
            hoitaa yrityksen laskutuksen ja kirjanpidon. Lieromaan madot laskutetaan tämän
            palvelun kautta.
          </p>
        </div>
      </article>

      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
      <PostRecommendation
        posts={recommendedPosts}
        customTitle="Aiheeseen liittyviä blogijulkaisuja"
      />
    </>
  );
}
