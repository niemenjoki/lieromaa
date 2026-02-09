import Advert from '@/components/Advert/Advert';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import PromoBox from '@/components/PromoBox/Promobox';
import SafeLink from '@/components/SafeLink/SafeLink';

import classes from '../ProductPage.module.css';
import OrderForm from './OrderForm';
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

      <article className={classes.ProductPage}>
        <PromoBox>
          <strong>Uutta tulossa:</strong> Kehitän parhaillaan matokompostorin
          aloituspakkausta, jonka on tarkoitus tulla myyntiin kevääseen 2026 mennessä.
          Pakkaus tulee sisältämään kaiken, mitä matokompostorin aloittamiseen tarvitsee;
          laatikot, petimateriaalin ja kompostimadot. Voit tutustua pakkauksen kehitykseen
          ja ilmoittaa kiinnostuksesi{' '}
          <SafeLink
            href="/tuotteet/matokompostin-aloituspakkaus"
            style={{ color: 'var(--highlight-alt)', fontWeight: 600 }}
          >
            täällä
          </SafeLink>
        </PromoBox>
        <h1>Osta Lieromaan Eisenia fetida -kompostimatoja</h1>

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
              Voit tilata kompostimadot suoraan tämän lomakkeen kautta. Kun olet
              lähettänyt tilauksen, saat tilausvahvistuksen sähköpostiisi 1–2 arkipäivän
              kuluessa. Vahvistan tilauksen manuaalisesti varmistaakseni matojen
              saatavuuden ja hyvän lähetyskunnon ennen laskutusta.
            </p>
            <p>
              Saat laskun <strong>OP Kevytyrittäjä</strong> -palvelun kautta sähköpostitse
              aikaisintaan silloin, kun pakkaus on toimitettu postille. Maksuaika on 14
              päivää, ja toimitus tapahtuu Postin kautta koko Suomeen.
            </p>
          </section>

          <OrderForm />

          <section>
            <p>
              Voit myös ottaa yhteyttä sähköpostitse: <strong>lieromaa@gmail.com</strong>{' '}
              tai WhatsAppissa{' '}
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
              Madot ovat elävää materiaalia, joten lähetän niitä vain maanantaisin ja
              tiistaisin. Maanantaina klo 12 mennessä tehdyt tilaukset postitan tiistaina,
              ja myöhemmin saapuneet tilaukset seuraavan viikon maanantaina.
            </p>
            <p>
              Näin varmistetaan, etteivät madot jää viikonlopuksi Postin kuljetukseen.
              Saat sähköpostiisi ilmoituksen, kun lähetys on postitettu.
            </p>
            <p>
              Toimitusaika on yleensä 2–3 arkipäivää postituksesta. Aikataulu riippuu
              Postin toiminnasta, johon en valitettavasti voi vaikuttaa.
            </p>
            <p>
              Halutessasi voit myös noutaa tilauksen Järvenpäästä sovittuna ajankohtana.
              Valitse nouto toimitustavaksi tilauslomakkeessa, niin otan yhteyttä
              sopiakseni tarkan ajan.
            </p>
          </section>
        </div>
      </article>

      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
    </>
  );
}
