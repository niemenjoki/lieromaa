import Link from 'next/link';

import classes from './MadotKampanja.module.css';
import structuredData from './structuredData.json';

export async function generateMetadata() {
  const title = 'Syystarjous – ilmainen toimitus kompostimadoille!';
  const description =
    'Tilaa kotimaisia kompostimatoja (Eisenia fetida) ilman toimituskuluja koko Suomeen. Tarjous voimassa 30.11.2025 asti.';
  const canonicalUrl = 'https://www.lieromaa.fi/madot-kampanja';
  const image =
    'https://www.lieromaa.fi/images/wormspage/kompostimadot-kammenella-eisenia-fetida.jpg';

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      images: [{ url: image, width: 1080, height: 1620 }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@lieromaa',
      title,
      description,
      images: [image],
    },
  };
}

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
                alt="Eisenia fetida -kompostimatoja kämmenellä"
                width="1080"
                height="1620"
                loading="lazy"
                style={{ height: 'auto' }}
              />
            </picture>
          </div>

          <p>
            Kompostimadot (<em>Eisenia fetida</em>) hajottavat biojätettä tehokkaasti ja
            tuottavat ravinteikasta matokakkaa kasveille. Madot on kasvatettu Järvenpäässä
            ilman kemikaaleja ja toimitetaan hengittävässä pakkauksessa.
          </p>

          <h2>Tilaus ja maksaminen</h2>
          <p>
            Lieromaan toiminta on pienimuotoista ja madot ovat elävää materiaalia. Haluan
            varmistaa jokaisen tilauksen yhteydessä, että madot ovat hyväkuntoisia ja että
            toimitus lähtee oikeana päivänä – siksi tilausta ei voi tehdä suoraan
            nettisivujen kautta.
          </p>

          <p>
            Täytä alla oleva lomake, niin tarkistan saatavuuden ja otan yhteyttä
            valitsemallasi tavalla. Saat vahvistuksen, maksutiedot ja toimituspäivän.
            Toimitus tapahtuu Postin kautta koko Suomeen – nyt{' '}
            <strong>ilman toimituskuluja</strong>.
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

          <Link href="/madot">← Lue lisää kompostimadoista</Link>
        </div>
      </article>
    </>
  );
}
