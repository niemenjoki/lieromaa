import Advert from '@/components/Advert/Advert';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import SafeLink from '@/components/SafeLink/SafeLink';
import { WORMS_SHIPPING_SCHEDULE_TEXT } from '@/data/commerce/shippingSchedule.mjs';
import { ORDER_CONTACT_EMAIL, ORDER_WHATSAPP_URL } from '@/data/site/contact';
import {
  formatPrice,
  getProductShippingOptions,
  getProductVariants,
} from '@/lib/pricing/catalog';

import ProductOrderForm from '../ProductOrderForm';
import classes from '../ProductPage.module.css';
import ProductReviewsSection from '../ProductReviewsSection';
import VariantPriceDisplay from '../VariantPriceDisplay';
import { galleryImages, h1 } from './pageMetadata';
import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

export const dynamic = 'force-static';

const wormVariants = getProductVariants('worms');
const wormShippingOptions = getProductShippingOptions('worms');
const wormPickupOption =
  wormShippingOptions.find((option) => option.id === 'posti_noutopiste') ?? null;
const wormLocalPickupOption =
  wormShippingOptions.find((option) => option.id === 'nouto') ?? null;

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
        <h1>{h1}</h1>

        <div className={classes.Content}>
          <ImageSlider images={galleryImages} />

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
              {wormVariants.map((variant) => (
                <li key={variant.sku}>
                  <VariantPriceDisplay
                    title={`${variant.amount} matoa`}
                    variant={variant}
                  />
                </li>
              ))}
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
              aikaisintaan silloin, kun pakkaus on toimitettu postille. Maksuaika on 7
              päivää. Voit valita toimitukseksi{' '}
              <strong>
                {wormPickupOption?.label} ({formatPrice(wormPickupOption?.price ?? 0)} €)
              </strong>{' '}
              tai{' '}
              <strong>
                {wormLocalPickupOption?.label} (
                {formatPrice(wormLocalPickupOption?.price ?? 0)} €)
              </strong>
              .
            </p>
            <p>
              Kompostimadoilla ei ole 14 päivän peruuttamisoikeutta, koska kyse on
              elävistä kompostimadoista. Tarkemmat ehdot löytyvät{' '}
              <SafeLink href="/tilausehdot">tilaus- ja toimitusehdoista</SafeLink>.
            </p>
          </section>

          <ProductOrderForm productKey="worms" />

          <section>
            <p>
              Voit myös ottaa yhteyttä sähköpostitse:{' '}
              <strong>{ORDER_CONTACT_EMAIL}</strong> tai WhatsAppissa{' '}
              <a href={ORDER_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                Lähetä viesti
              </a>
            </p>
          </section>

          <ProductReviewsSection productKey="worms" />

          <section>
            <h2>Toimitus ja nouto</h2>
            <p>
              Madot ovat elävää materiaalia, joten postitan ne vain maanantaisin.{' '}
              {WORMS_SHIPPING_SCHEDULE_TEXT}
            </p>
            <p>
              Näin varmistetaan, etteivät madot jää viikonlopuksi Postin kuljetukseen.
              Saat sähköpostiisi ilmoituksen, kun lähetys on postitettu. Kompostimadot
              lähetetään Postin noutopisteeseen tai automaattiin, ei kotiinkuljetuksena.
            </p>
            <p>
              Toimitusaika on yleensä 1–2 arkipäivää postituksesta. Aikataulu riippuu
              Postin toiminnasta. Nouda paketti saapumisilmoituksen jälkeen mahdollisimman
              pian, jotta madot eivät viivy pakkauksessa turhaan.
            </p>
            <p>
              Kassalla voit hakea ja valita sopivan Postin noutopaikan. Jos haku ei ole
              hetkellisesti käytettävissä, voit kirjoittaa toivomasi noutopaikan
              viestikenttään. Voin lähettää paketin myös pelkän postinumeron perusteella.
            </p>
            <p>
              Halutessasi voit myös noutaa tilauksen Järvenpäästä sovittuna ajankohtana.
              Valitse Järvenpää-nouto tilauslomakkeessa, niin otan yhteyttä sopiakseni
              tarkan ajan.
            </p>
          </section>
        </div>
      </article>

      <Advert />
    </>
  );
}
