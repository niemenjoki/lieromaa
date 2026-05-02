import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import { formatPrice, getProductVariants } from '@/lib/pricing/catalog';

import AddToCartPanel from '../AddToCartPanel';
import classes from '../ProductPage.module.css';
import VariantPriceDisplay from '../VariantPriceDisplay';
import { breadcrumbItems, galleryImages, h1 } from './pageMetadata';
import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

export const dynamic = 'force-static';

const variants = getProductVariants('compostChow');

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
        <Breadcrumbs items={breadcrumbItems} />
        <h1>{h1}</h1>

        <div className={classes.Content}>
          <section className={classes.ProductHero}>
            <ImageSlider images={galleryImages} />

            <div className={classes.HeroDetails}>
              <div className={classes.HeroText}>
                <p className={classes.Lead}>
                  Lieromaan kompostorin kuituseos on helppokäyttöinen lisäseos kompostiin.
                </p>
                <p>
                  Se helpottaa kompostin ylläpitoa erityisesti silloin, kun biojätteen
                  määrä vaihtelee. Kuituseos sopii käytettäväksi biojätteen rinnalla tai
                  tilapäisesti sen sijaan.
                </p>
                <p>
                  Hienojakoinen koostumus hajoaa nopeasti ja tehostaa mikrobitoimintaa,
                  mikä näkyy matojen lisääntyneenä aktiivisuutena ja pitkällä aikavälillä
                  nopeampana kasvuna.
                </p>
              </div>

              <aside className={classes.SummaryCard}>
                <h2>Tilaa helposti</h2>
                <ul className={classes.FeatureList}>
                  <li>500 g pakkaus matokompostin ruokinnan tasaamiseen.</li>
                  <li>Koostumus: vehnälese, kauralese, soija, kalkki ja kivijauhe.</li>
                </ul>

                <h3>Hinta</h3>
                <ul className={classes.PriceList}>
                  {variants.map((variant) => (
                    <li key={variant.sku}>
                      <VariantPriceDisplay
                        title={`${variant.weightGrams ?? variant.amount} g`}
                        variant={variant}
                      />
                    </li>
                  ))}
                </ul>

                <a
                  className={classes.PrimaryCTA}
                  href="#tilaa"
                  data-analytics-cta="order"
                >
                  Lisää ostoskoriin
                </a>
              </aside>
            </div>
          </section>

          <section className={classes.SectionStack}>
            <h2>Käyttö</h2>
            <div className={classes.CardGrid}>
              <div className={classes.InfoCard}>
                <h3>Lähtöannos</h3>
                <p>
                  Aktiivisessa noin 15-25 °C matokompostissa voit aloittaa annoksella 0,5
                  dl kuituseosta / 10 L kompostimassaa kerran viikossa.
                </p>
              </div>
              <div className={classes.InfoCard}>
                <h3>Biojätteen rinnalla</h3>
                <p>
                  Jos lisäät kompostiin samaan aikaan myös keittiön biojätettä, vähennä
                  kuituseoksen määrä noin puoleen eli 0,25 dl / 10 L kompostimassaa
                  viikossa.
                </p>
              </div>
              <div className={classes.InfoCard}>
                <h3>Käyttötapa ja säätö</h3>
                <p>
                  Ripottele ohut kerros pintaan, kostuta kevyesti ja peitä kostealla
                  paperilla tai kuivikkeella. Lisää määrää, jos seos häviää 1-2 päivässä.
                  Vähennä määrää, jos kompostiin tulee hajua tai hometta.
                </p>
              </div>
            </div>
          </section>

          <section id="tilaa" className={classes.OrderSection}>
            <div className={classes.OrderSectionHeader}>
              <h2>Tilaa kuituseos</h2>
              <p>Hinta {formatPrice(variants[0]?.price ?? 0)} €.</p>
            </div>

            <AddToCartPanel productKey="compostChow" />
          </section>
        </div>
      </article>
    </>
  );
}
