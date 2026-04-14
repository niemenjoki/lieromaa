import ImageSlider from '@/components/ImageSlider/ImageSlider';
import SafeLink from '@/components/SafeLink/SafeLink';
import { WORMS_SHIPPING_SCHEDULE_TEXT } from '@/data/operations/commerce/shippingSchedule.mjs';
import {
  formatPrice,
  getProductShippingOptions,
  getProductVariants,
} from '@/lib/pricing/catalog';

import ProductAvailabilityNotice from '../ProductAvailabilityNotice';
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
          <section className={classes.ProductHero}>
            <ImageSlider images={galleryImages} />

            <div className={classes.HeroDetails}>
              <div className={classes.HeroText}>
                <p className={classes.Lead}>
                  Kasvatan ja myyn kotimaisia kompostimatoja (<em>Eisenia fetida</em>)
                  omasta kotikompostistani.
                </p>
                <p>
                  Kompostimadot muuttavat biojätteen ravinteikkaaksi mullaksi kotona.
                  Matokompostori voidaan pitää sisätiloissa, se on hajuton ja
                  helppohoitoinen. Madot hajottavat jätettä tehokkaasti, ja populaatio
                  kasvaa hyvissä olosuhteissa nopeasti.
                </p>
                <p>
                  Pakkaus sisältää valitsemasi määrän kompostimatoja ja niiden
                  kasvualustaa (pahvi- ja puusilppu, kookoskuori, puutarhamulta). Jos et
                  ole varma sopivasta määrästä, kokeile{' '}
                  <SafeLink href="/matolaskuri">matolaskuria</SafeLink>.
                </p>
              </div>

              <aside className={classes.SummaryCard}>
                <h2>Tilaa helposti</h2>
                <ul className={classes.FeatureList}>
                  <li>Valitse 50, 100 tai 200 kompostimatoa.</li>
                  <li>Pakkaus sisältää madot ja niiden kasvualustan.</li>
                </ul>

                <h3>Hinnat</h3>
                <ul className={classes.PriceList}>
                  {wormVariants.map((variant) => (
                    <li key={variant.sku}>
                      <VariantPriceDisplay
                        title={`${variant.amount} matoa`}
                        variant={variant}
                      />
                    </li>
                  ))}
                </ul>

                <ProductAvailabilityNotice
                  productKey="worms"
                  className={classes.HelperText}
                  prefix="Saatavuustiedote:"
                />

                <p className={classes.HelperText}>
                  Vahvistan tilauksen kahden päivän kuluessa.
                </p>

                <a
                  className={classes.PrimaryCTA}
                  href="#tilaa"
                  data-analytics-cta="order"
                >
                  Siirry tilaamaan
                </a>
              </aside>
            </div>
          </section>

          <ProductReviewsSection productKey="worms" />

          <section className={classes.SectionStack}>
            <h2>Ennen tilausta</h2>

            <div className={classes.CardGrid}>
              <div className={classes.InfoCard}>
                <h3>Maksaminen</h3>
                <p>
                  Kun tilaat kompostimatoja alla olevalla lomakkeella, varmistan matojen
                  saatavuuden ja lähetän manuaalisen tilausvahvistuksen viimeistään kahden
                  päivän kuluessa.
                </p>
                <p>
                  Lasku tulee OP Kevytyrittäjä -palvelun kautta sähköpostiin.{' '}
                  <strong>Maksuaika on 7 vuorokautta.</strong>
                </p>
              </div>

              <div className={classes.InfoCard}>
                <h3>Toimitus</h3>
                <p>
                  Voit valita toimitustavaksi{' '}
                  <strong>
                    {wormPickupOption?.label} ({formatPrice(wormPickupOption?.price ?? 0)}{' '}
                    €)
                  </strong>{' '}
                  tai{' '}
                  <strong>
                    {wormLocalPickupOption?.label} (
                    {formatPrice(wormLocalPickupOption?.price ?? 0)} €)
                  </strong>
                  .
                </p>
                <p>
                  Madot ovat elävää materiaalia, joten postitan ne vain maanantaisin.{' '}
                  {WORMS_SHIPPING_SCHEDULE_TEXT}
                </p>
              </div>

              <div className={classes.InfoCard}>
                <h3>Hyvä tietää</h3>
                <p>
                  Kompostimadoilla ei ole 14 päivän peruuttamisoikeutta, koska kyse on
                  elävistä kompostimadoista.
                </p>
                <p>
                  Tarkemmat ehdot löytyvät{' '}
                  <SafeLink href="/tilausehdot">tilaus- ja toimitusehdoista</SafeLink>.
                </p>
              </div>
            </div>
          </section>

          <section id="tilaa" className={classes.OrderSection}>
            <div className={classes.OrderSectionHeader}>
              <h2>Tilaa kompostimadot</h2>
            </div>

            <ProductOrderForm productKey="worms" />
          </section>
        </div>
      </article>
    </>
  );
}
