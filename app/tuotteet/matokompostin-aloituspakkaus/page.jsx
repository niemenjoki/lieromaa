import Advert from '@/components/Advert/Advert';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import SafeLink from '@/components/SafeLink/SafeLink';

import classes from '../ProductPage.module.css';
import structuredData from './structuredData.json';

export { default as generateMetadata } from './generateMetadata';

export const dynamic = 'force-static';

export default async function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <article className={classes.PackagePage}>
        <h1>Lieromaan matokompostorin aloituspakkaus (tulossa myyntiin)</h1>

        <div className={classes.Content}>
          <ImageSlider
            images={[
              {
                src: '/images/posts/matokompostorin-aloituspakkaus-osa-2-ensimmainen-tarkastus/kompostori_avattuna.avif',
                alt: 'Käynnistynyt matokompostori sisältä',
              },
              {
                src: '/images/guides/matokakkaa_kadella.avif',
                alt: 'Kasa tummaa matokakkaa kämmenellä',
              },
            ]}
          />

          <section>
            <p>
              Kehitän parhaillaan matokompostorin aloituspakkausta, jonka on tarkoitus
              sisältää kaikki tarvittava matokompostoinnin aloittamiseen: valmiiksi
              poratut laatikot, petimateriaalin, pienen määrän valmista matokakkaa
              mikrobitoiminnan käynnistymisen tehostamiseksi, kananmunankuorijauhetta ja
              tietenkin <em>Eisenia fetida</em> -kompostimadot.
            </p>

            <p>
              Tavoitteena on, että kuka tahansa voi aloittaa matokompostoinnin ilman
              rakentelua tai arpomista. Pakkaus toimitetaan käyttövalmiina ja helppojen
              ohjeiden kanssa.
            </p>
          </section>

          <section>
            <h2>Tuotteen kehitys</h2>
            <p>
              Aloituspakkaus on tällä hetkellä kehitysvaiheessa. Testaan ja dokumentoin
              sen toimivuutta blogisarjassa, jossa näytän prototyypin rakentamisen,
              käynnistymisen ja hoidon vaiheittain.
            </p>

            <ul>
              <li>
                <SafeLink href="/blogi/julkaisu/matokompostorin-aloituspakkaus-osa-1-idea-rakentaminen">
                  Osa 1: Idea ja rakentaminen
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/blogi/julkaisu/matokompostorin-aloituspakkaus-osa-2-ensimmainen-tarkastus">
                  Osa 2: Ensimmäinen tarkistus ja ruokinta
                </SafeLink>
              </li>
            </ul>
          </section>

          <section>
            <h2>Ilmoita kiinnostuksesi</h2>
            <p>
              Jos haluat saada ilmoituksen heti, kun aloituspakkaus on myynnissä, jätä
              yhteystietosi alla olevalla lomakkeella. Ilmoitan sinulle, kun tuote tulee
              myyntiin.
            </p>

            <form
              className={classes.CalculatorForm}
              action="https://formspree.io/f/xkgpdwpa"
              method="POST"
            >
              <label>
                Nimi
                <input type="text" name="nimi" required />
              </label>

              <label>
                Sähköposti
                <input type="email" name="email" required />
              </label>

              <button type="submit">Ilmoita kiinnostuksesi</button>
              <p className={classes.Note}>
                Saat sähköpostin, kun tuote on tilattavissa. Ei spämmiviestejä.
              </p>
            </form>
          </section>

          <section>
            <h2>Arvioitu saatavuus</h2>
            <p>
              Ensimmäinen myyntierä on tarkoitus julkaista keväällä 2026, kun testaus on
              valmis ja pakkauksen sisältö on hiottu lopulliseen muotoonsa.
            </p>
          </section>
        </div>
      </article>

      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
    </>
  );
}
