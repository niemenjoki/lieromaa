import Advert from '@/components/Advert';
import Layout from '@/components/Layout';
import PostRecommendation from '@/components/PostRecommendation';
import classes from '@/styles/PostPage.module.css';
import getPostRecommendations from '@/utils/getPostRecommendations';
import fs from 'fs';
import path from 'path';

const WormsPage = ({ worms, lastUpdated, recommendedPosts }) => {
  const title =
    'Mistä ostaa kompostimatoja (Eisenia fetida) Suomessa? | Luomuliero';
  const excerpt =
    'Etsitkö kompostimatoja (Eisenia fetida)? Tästä oppaasta löydät vinkit, mistä kompostimatoja voi ostaa, mitä eroa on kastemadoilla ja kompostimadoilla sekä ajantasaisen saatavuustilanteen Suomessa.';
  const tags = 'matokompostointi,kompostorin perustaminen';

  return (
    <Layout title={title} ads={true} description={excerpt}>
      <article className={classes.PostPage}>
        <h1>{title}</h1>
        <div className={classes.Date}>
          Matojen saatavuustilanne päivitetty:{' '}
          {lastUpdated
            ? new Date(lastUpdated).toLocaleDateString('fi-FI')
            : 'Ei saatavilla'}
        </div>
        <picture>
          <source
            srcSet="/images/wormspage/kompostimadot-pakkaus-800.avif 800w, /images/wormspage/kompostimadot-pakkaus-1200.avif 1200w"
            type="image/avif"
          />
          <source
            srcSet="/images/wormspage/kompostimadot-pakkaus-800.webp 800w, /images/wormspage/kompostimadot-pakkaus-1200.webp 1200w"
            type="image/webp"
          />
          <img
            src="/images/wormspage/kompostimadot-pakkaus-800.jpg"
            srcSet="/images/wormspage/kompostimadot-pakkaus-800.jpg 800w, /images/wormspage/kompostimadot-pakkaus-1200.jpg 1200w"
            alt="Pieni pahvinen pakkausrasia, jossa tummaa kompostimultaa ja muutama kompostimato näkyvissä"
            sizes="(max-width: 600px) 100vw, 800px"
            style={{ maxWidth: '100%', height: 'auto' }}
            loading="lazy"
          />
        </picture>

        <div className={classes.Content}>
          <h2>Minkälaiset madot sopivat kompostiin?</h2>
          <p>
            Matokompostin perustamiseen käytettävät madot eivät ole tavallisia
            kastematoja. Kastemadot syövät pääasiassa kuolleita kasvien juuria
            ja muuta maaperän orgaanista ainetta ja viihtyvät tyypillisesti
            syvällä maassa. Kompostimadot viihtyvät lähempänä maan pintaa ja
            syövät mielellään ruokajätettä. Yleisimmin käytetty kompostimatojen
            lajike on tunkioliero (<em>Eisenia fetida</em>). Ne ovat punertavia,
            kastematoja pienempiä ja erittäin tehokkaita biojätteen
            käsittelyssä. Tunkiolierot viihtyvät tiiviissä, kosteissa ja
            pimeissä kompostiastioissa ja pystyvät syömään noin painonsa verran
            ruokajätettä parissa päivässä.
          </p>
          <p>
            Alkuun pääsee pienelläkin matomäärällä, mutta käsittelytahti on
            silloin hidas. Esimerkiksi 50 madon populaatio syö vain muutaman
            kymmenen gramman verran jätettä viikossa. Hyvissä oloissa madot
            kuitenkin tuplaavat määränsä noin kolmen kuukauden välein. Pienellä
            populaatiolla voi siis aloittaa edullisesti ja kasvattaa määrää
            vähitellen, mutta suuremmalla alkuinvestoinnilla pääsee heti
            käsittelemään suurempia jätemääriä.
          </p>
          <h2>Voiko kompostimatoja kerätä luonnosta?</h2>
          <p>
            Olen kuullut, että kompostimatoja voi kerätä myös itse. Ilmeisesti
            ainakin maatiloilla niitä näkyy lantakasoista, navettojen ympäriltä
            ja vanhoista puutarhakomposteista. Kaupungissa asuvana en pitänyt
            tätä kovinkaan käytännöllisenä ja tilasin omat matoni aikanaan
            netistä.
          </p>
          <h2>Kompostimatojen tilaaminen netistä</h2>
          <p>
            Kompostimatoja voi tilata verkosta tai ostaa yksityisiltä myyjiltä,
            mutta niiden saatavuus vaihtelee. Valitettavasti vain muutama
            verkkokauppa Suomessa myy kompostimatoja ja niidenkin saatavuus
            vaihtelee suuresti. Välillä matoja ilmestyy Tori.fi-sivustolle ja
            muille vastaaville sivustoille, joissa yksityiset myyjät myyvät omia
            matojaan.
          </p>
          <p>
            Jos matoja ei heti löydy netistä, kannattaa etsiä udestaan muutaman
            päivän päästä. Suosittelen myös etsimään niitä suoraan tori.fi:stä.
          </p>
          <h2>Matojen saatavuustilanne</h2>
          <p>
            Matojen heikon saatavuuden vuoksi päätin alkaa ylläpitämään
            päivittyvää tilanneseurantaa, josta näkee helposti, onko matoja
            saatavilla.
          </p>

          {worms.map((item, idx) => {
            const isUnavailable =
              !item.availability ||
              item.availability === 'Ei toistaiseksi saatavilla';

            console.log(isUnavailable);
            return (
              <div
                key={idx}
                className={isUnavailable ? classes.Unavailable : undefined}
              >
                <h3>{item.seller}</h3>
                <ul>
                  <li>Pakkauskoot: {item.package}</li>
                  <li>
                    Hinnat:{' '}
                    {typeof item.price === 'object'
                      ? Object.entries(item.price)
                          .map(([qty, price]) => `${qty} kpl: ${price}`)
                          .join(', ')
                      : item.price
                      ? `${item.price} €`
                      : 'Ei saatavilla'}
                  </li>
                  <li>
                    Saatavuus:{' '}
                    {item.availability || 'Ei toistaiseksi saatavilla'}
                  </li>
                  <li>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Linkki myynti-ilmoitukseen
                    </a>
                  </li>
                </ul>
              </div>
            );
          })}

          <h2>Oma myyntini</h2>
          <p>
            <strong>Huomautus:</strong> Läpinäkyvyyden nimissä kerron vielä
            erikseen, että saatavuuslistassa on mukana oma myynti-ilmoitukseni
            Tori.fi:ssä. Lupaan kuitenkin pitää saatavuustiedot
            totuudenmukaisena ja ajan tasalla.
          </p>
          <p>
            Itse myymäni madot ovat peräsin omasta kompostistani, enkä pysty
            myymään kovin suuria määriä kerralla ilman että matojen määrä omassa
            kompostissani vähenee liikaa.
          </p>
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
  const filePath = path.join(process.cwd(), 'data', 'worms.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const worms = JSON.parse(jsonData);

  const updatedTimes = worms
    .map((w) => (w.updated ? new Date(w.updated).getTime() : null))
    .filter(Boolean);
  const lastUpdated =
    updatedTimes.length > 0
      ? new Date(Math.max(...updatedTimes)).toISOString()
      : null;

  const recommendedPosts = await getPostRecommendations({
    self: 'madot',
    keywords: 'matokompostointi,matokakka,madot',
  });

  return {
    props: { worms, lastUpdated, recommendedPosts },
  };
}

export default WormsPage;
