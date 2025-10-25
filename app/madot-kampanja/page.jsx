import ImageSlider from '@/components/ImageSlider/ImageSlider';
import SafeLink from '@/components/SafeLink/SafeLink';

import classes from './MadotKampanja.module.css';
import structuredData from './structuredData.json';

export { default as generateMetadata } from './generateMetadata';

export default function Page() {
  const title = 'Syystarjous – ilmainen toimitus kompostimadoille!';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <article className={classes.WormsCampaignPage}>
        <h1>{title}</h1>

        <div className={classes.Content}>
          <p>
            Syksyn kampanjassa kaikki Lieromaan kompostimadot toimitetaan{' '}
            <strong>ilman toimituskuluja koko Suomeen</strong>. Tarjous on voimassa
            30.11.2025 asti ja koskee kaikkia pakkauskokoja 10–500 madon välillä.
          </p>

          <aside>
            <h3>Hinnat (sis. toimituksen)</h3>
            <ul>
              <li>50 matoa – 20 €</li>
              <li>100 matoa – 30 €</li>
              <li>200 matoa – 50 €</li>
            </ul>
          </aside>

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
            Kompostimadot (<em>Eisenia fetida</em>) hajottavat biojätettä tehokkaasti ja
            tuottavat ravinteikasta matokakkaa kasveille. Madot on kasvatettu Järvenpäässä
            ilman kemikaaleja ja toimitetaan hengittävässä pakkauksessa.
          </p>

          <h2>Tilaus ja maksaminen</h2>
          <p>
            Lieromaan toiminta on pienimuotoista ja madot ovat elävää materiaalia. Siksi
            jokainen tilaus vahvistetaan erikseen, jotta voin varmistaa matojen
            saatavuuden ja lähetyksen ajankohdan.
          </p>

          <p>
            Täytä alla oleva lomake, niin tarkistan saatavuuden ja otan yhteyttä
            valitsemallasi tavalla. Kun olemme sopineet tilauksesta, saat
            <strong> sähköpostilaskun OP Kevytyrittäjä-palvelun kautta</strong>. Maksuaika
            on 14 vuorokautta. Toimitus tapahtuu Postin kautta koko Suomeen – nyt{' '}
            <strong>ilman toimituskuluja</strong>.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#555' }}>
            Lieromaan matomyynti on omaa yritystoimintaani (Y-tunnus 3002257-7), mutta
            laskutus ja verotuksen hallinnointi hoidetaan
            <strong> OP Kevytyrittäjä </strong>-palvelun kautta.
          </p>
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

          <p style={{ fontSize: '0.9rem', color: '#777' }}>
            Tarjous voimassa 1.–30.11.2025. Hinnat sisältävät postituksen kaikkialle
            Suomeen.
          </p>

          <SafeLink href="/madot">← Lue lisää kompostimadoista</SafeLink>
        </div>
      </article>
    </>
  );
}
