import Layout from '@/components/Layout';
import classes from '@/styles/PostPage.module.css';
import Link from 'next/link';

const MadotKampanjaPage = () => {
  const title = 'Syystarjous – ilmainen toimitus kompostimadoille!';
  const excerpt =
    'Tilaa kotimaisia kompostimatoja (Eisenia fetida) ilman toimituskuluja koko Suomeen. Tarjous voimassa 30.11.2025 asti.';

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Kompostimadot (Eisenia fetida)',
      description:
        'Kotimaiset kompostimadot (Eisenia fetida) matokompostointiin. Syystarjouksena ilmainen toimitus koko Suomeen 30.11.2025 asti.',
      image:
        'https://www.luomuliero.fi/images/wormspage/kompostimadot-kammenella-eisenia-fetida.jpg',
      sku: 'MADOT-SYYS25',
      brand: { '@type': 'Brand', name: 'Luomuliero' },
      offers: {
        '@type': 'Offer',
        url: 'https://www.luomuliero.fi/madot-kampanja',
        priceCurrency: 'EUR',
        priceSpecification: [
          { '@type': 'PriceSpecification', name: '50 matoa', price: '20.00' },
          { '@type': 'PriceSpecification', name: '100 matoa', price: '30.00' },
          { '@type': 'PriceSpecification', name: '200 matoa', price: '50.00' },
        ],
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2025-11-30',
        seller: { '@type': 'Person', name: 'Joonas Niemenjoki' },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: 'EUR',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'FI',
          },
        },
      },
    },
  ];

  return (
    <Layout
      title={title}
      description={excerpt}
      structuredData={structuredData}
      showTermsLink={true}
      canonical="https://www.luomuliero.fi/madot-kampanja"
    >
      <article className={classes.PostPage}>
        <h1>{title}</h1>
        <div className={classes.Content}>
          <p>
            Syksyn kampanjassa kaikki Luomulieron kompostimadot toimitetaan{' '}
            <strong>ilman toimituskuluja koko Suomeen</strong>. Tarjous on
            voimassa 30.11.2025 asti ja koskee kaikkia pakkauskokoja 10–500
            madon välillä.
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
            Kompostimadot (<em>Eisenia fetida</em>) hajottavat biojätettä
            tehokkaasti ja tuottavat ravinteikasta matokakkaa kasveille. Madot
            on kasvatettu Järvenpäässä ilman kemikaaleja ja toimitetaan
            hengittävässä pakkauksessa.
          </p>

          <h2>Tilaus ja maksaminen</h2>
          <p>
            Luomulieron toiminta on pienimuotoista ja madot ovat elävää
            materiaalia. Haluan varmistaa jokaisen tilauksen yhteydessä, että
            madot ovat hyväkuntoisia ja että toimitus lähtee oikeana päivänä –
            siksi tilausta ei voi tehdä suoraan nettisivujen kautta..
          </p>

          <p>
            Täytä alla oleva lomake, niin tarkistan saatavuuden ja otan yhteyttä
            valitsemallasi tavalla. Saat vahvistuksen, maksutiedot ja
            toimituspäivän. Toimitus tapahtuu Postin kautta koko Suomeen – nyt{' '}
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
                <input
                  type="radio"
                  name="yhteydenottotapa"
                  value="Tekstiviesti"
                />{' '}
                Tekstiviesti
              </label>
              <label>
                <input type="radio" name="yhteydenottotapa" value="WhatsApp" />{' '}
                WhatsApp
              </label>
            </fieldset>

            <button type="submit">Lähetä tilauspyyntö</button>
          </form>

          <p>
            Voit myös ottaa yhteyttä suoraan sähköpostitse:{' '}
            <strong>luomuliero@gmail.com</strong> tai WhatsAppissa{' '}
            <a
              href="https://api.whatsapp.com/send?phone=358503365054&text=Hei!%20Olen%20kiinnostunut%20kompostimadoista."
              target="_blank"
              rel="noopener noreferrer"
            >
              Lähetä viesti
            </a>
          </p>

          <p style={{ fontSize: '0.9rem', color: '#777' }}>
            Tarjous voimassa 1.–30.11.2025. Hinnat sisältävät postituksen
            kaikkialle Suomeen.
          </p>

          <Link href="/madot">← Lue lisää kompostimadoista</Link>
        </div>
      </article>
    </Layout>
  );
};

export default MadotKampanjaPage;
