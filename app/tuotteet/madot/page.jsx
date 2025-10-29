import Advert from '@/components/Advert/Advert';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import PostRecommendation from '@/components/PostRecommendation/PostRecommendation';
import PromoBox from '@/components/PromoBox/Promobox';
import SafeLink from '@/components/SafeLink/SafeLink';

import classes from './Madot.module.css';
import structuredData from './structuredData.json';

export { default as generateMetadata } from './generateMetadata';

export const dynamic = 'force-static';

export default async function Page() {
  const recommendedPosts = [
    {
      title: 'Kuinka perustaa matokomposti kotona: Opas aloittelijoille',
      excerpt:
        'Harkitsetko matokompostin perustamista? Se on helppo, edullinen ja ympäristöystävällinen tapa hyödyntää keittiöjätteet ravinteiksi.',
      date: '6 September, 2025',
      tags: ['matokompostointi', 'aloittelijan opas', 'kompostorin perustaminen'],
      keywords: [
        'aloittelijan opas',
        'continuous flow',
        'diy',
        'jatkuva virtaus',
        'kompostorin perustaminen',
        'lämpökompostointi',
        'matokakan keräys',
        'matokompostointi',
        'opas',
        'perustaminen',
        'rakentaminen',
      ],
      slug: 'kuinka-perustaa-matokomposti-kotona-opas-aloittelijoille',
    },
    {
      title: 'Kolmen laatikon matokompostori - tehokas ja helppo ratkaisu',
      excerpt:
        'Rakenna kolmen laatikon matokompostori, joka tuottaa jatkuvasti valmista matokakkaa ja tekee kompostoinnista vaivatonta.',
      date: '1 October, 2025',
      tags: ['matokompostointi', 'kompostorin perustaminen'],
      keywords: [
        'banaanikärpäset',
        'continuous flow',
        'diy',
        'jatkuva virtaus',
        'kompostorin perustaminen',
        'kosteus',
        'matokakan keräys',
        'matokakka',
        'matokompostointi',
        'opas',
        'rakentaminen',
        'ruokinta',
      ],
      slug: 'kolmen-laatikon-matokompostori-edistyneempi-helppohoitoinen',
    },
  ];

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
            href="/tuotteet/madot-kampanja"
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

          <section>
            <p>
              Kasvatan ja myyn kotimaisia kompostimatoja (<em>Eisenia fetida</em>) omasta
              kotikompostistani.
            </p>
            <p>
              Kompostimadot ovat erinomainen tapa muuttaa biojäte ravinteikkaaksi mullaksi
              kotona. Matokompostori voidaan pitää sisätiloissa, se on hajuton ja
              helppohoitoinen. Madot hajottavat jätettä tehokkaasti – jopa oman painonsa
              verran viikossa – ja populaatio tuplaantuu noin kolmen kuukauden välein.
              Vilkkaasti kiemurtelevat kompostimadot sopivat myös hyvin onkimadoiksi.
            </p>
            <p>
              Pakkaus sisältää valitsemasi määrän kompostimatoja ja niiden kasvualustaa
              (pahvi- ja puusilppu, kookoskuori, puutarhamulta). Jos et ole varma kuinka
              paljon tarvitset matoja, kokeile sivustolta löytyvää{' '}
              <SafeLink href="/matolaskuri">matolaskuria</SafeLink>.
            </p>
          </section>

          <aside>
            <h3>Hinnat</h3>
            <ul>
              <li>50 matoa – 20 €</li>
              <li>100 matoa – 30 €</li>
              <li>200 matoa – 50 €</li>
            </ul>
          </aside>

          <section>
            <h2>Tilaus ja maksaminen</h2>
            <p>
              Matoja ei saa tilattua suoraan verkkosivun kautta, koska haluan varmistaa
              matojen saatavuuden ennen tilauksen vahvistamista. Toimintani on
              pienimuotoista ja joudun pitämään myynnin rajallisena, jotta matojen määrä
              omassa kompostissani ei vähene liikaa. Ota yhteyttä (ohjeet alempana), niin
              vahvistan saatavuuden ennen maksua.
            </p>
            <p>
              Lieromaan toiminta on pienimuotoista ja madot ovat elävää materiaalia. Siksi
              jokainen tilaus vahvistetaan erikseen, jotta voin varmistaa matojen
              saatavuuden ja lähetyksen ajankohdan.
            </p>
            <p>
              Täytä alla oleva lomake, niin tarkistan saatavuuden ja otan yhteyttä
              valitsemallasi tavalla. Kun olemme sopineet tilauksesta, saat
              <strong> sähköpostilaskun OP Kevytyrittäjä -palvelun kautta</strong>.
              Maksuaika on 14 vuorokautta. Toimitus tapahtuu Postin kautta koko Suomeen.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#555' }}>
              Lieromaan matomyynti on omaa yritystoimintaani (Y-tunnus 3002257-7), mutta
              laskutus ja verotuksen hallinnointi hoidetaan
              <strong> OP Kevytyrittäjä </strong> -palvelun kautta.
            </p>
          </section>

          <form
            className={classes.CalculatorForm}
            action="https://formspree.io/f/xyznlyow"
            method="POST"
          >
            <label>
              Nimi
              <input type="text" name="nimi" required />
            </label>
            <label>
              Sähköposti
              <input type="email" name="email" />
            </label>
            <label>
              Puhelinnumero
              <input type="phone" name="phone" />
            </label>
            <label>
              Haluttu määrä (10–500)
              <input type="number" name="maara" min="10" max="500" required />
            </label>

            <fieldset>
              <legend>Toivottu yhteydenottotapa</legend>
              <label>
                <input
                  type="radio"
                  name="yhteydenottotapa"
                  value="Sähköposti"
                  defaultChecked
                />{' '}
                Sähköposti
              </label>
              <label>
                <input type="radio" name="yhteydenottotapa" value="Tekstiviesti" />{' '}
                Tekstiviesti
              </label>
              <label>
                <input type="radio" name="yhteydenottotapa" value="WhatsApp" /> WhatsApp
              </label>
            </fieldset>

            <button type="submit">Lähetä tilauspyyntö</button>
          </form>

          <section>
            <p>
              Voit myös ottaa yhteyttä suoraan sähköpostitse:{' '}
              <strong>lieromaa@gmail.com</strong> tai WhatsAppissa{' '}
              <a
                href="https://api.whatsapp.com/send?phone=358503365054&text=Hei!%20Olen%20kiinnostunut%20kompostimadoista."
                target="_blank"
                rel="noopener noreferrer"
              >
                Lähetä viesti
              </a>
            </p>
          </section>

          <section>
            <h2>Toimitus ja nouto</h2>
            <p>
              Madot toimitetaan pakasterasiassa postitettuna tai ne voi noutaa
              Järvenpäästä. Suosittelen hakemaan postitetut madot heti saapumisilmoituksen
              saapuessa, koska madot voivat elää suljetussa rasiassa vain noin 5 vrk.
              Lähetän matopakkauksia vain maanantaisin ja tiistaisin, jotta madot eivät
              jää viikonlopuksi Postin kyytiin.
            </p>
          </section>
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
