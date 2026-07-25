import AddToCartPanel from '@/app/(fi)/tuotteet/AddToCartPanel';
import classes from '@/app/(fi)/tuotteet/ProductPage.module.css';
import VariantPriceDisplay from '@/app/(fi)/tuotteet/VariantPriceDisplay';
import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import { getCommerceMessages, getProductMessages } from '@/lib/i18n/messages.mjs';
import { getRoutePath } from '@/lib/i18n/routes.mjs';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import { formatCurrency, getProductVariants } from '@/lib/pricing/catalog';
import { getProductCatalogEntry } from '@/lib/products/catalog.mjs';
import { createProductStructuredData } from '@/lib/structuredData/createProductStructuredData';

const language = 'en';
const messages = getProductMessages(language);
const productCopy = messages.catalog.compostChow;
const commerceCopy = getCommerceMessages(language);
const product = getProductCatalogEntry('compostChow');
const pageMetadata = {
  language,
  title: productCopy.title,
  description: productCopy.description,
  canonicalUrl: getRoutePath('compostFibreMix', language),
  image: {
    ...product.image,
    alt: productCopy.imageAlts[0],
  },
};
const breadcrumbItems = [
  { name: 'Products', href: getRoutePath('products', language) },
  { name: productCopy.productName, href: pageMetadata.canonicalUrl },
];
const galleryImages = product.images.map((image, index) => ({
  ...image,
  alt: productCopy.imageAlts[index] || productCopy.imageAlts[0],
}));

export const revalidate = 300;

export function generateMetadata() {
  return createLocalizedPageMetadata(pageMetadata);
}

function DeliveryNotice() {
  return (
    <aside className={classes.InfoCard}>
      <h3>{messages.deliveryNotice.heading}</h3>
      <p>{messages.deliveryNotice.body}</p>
    </aside>
  );
}

export default function EnglishCompostFibreMixPage() {
  const variants = getProductVariants('compostChow');
  const structuredData = createProductStructuredData('compostChow', language);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <article className={classes.ProductPage}>
        <Breadcrumbs items={breadcrumbItems} ariaLabel="Breadcrumb" />
        <h1>{productCopy.h1}</h1>

        <div className={classes.Content}>
          <section className={classes.ProductHero}>
            <ImageSlider images={galleryImages} language={language} />

            <div className={classes.HeroDetails}>
              <div className={classes.HeroText}>
                <p className={classes.Lead}>
                  Lieromaa compost fibre mix is an easy-to-use supplement for a worm bin.
                </p>
                <p>
                  It helps maintain balance when the amount of suitable food waste varies.
                  The mix is primarily intended for use alongside food waste, and it can
                  also support feeding temporarily when very little kitchen waste is
                  available.
                </p>
                <p>
                  Its fine texture breaks down quickly and encourages microbial activity,
                  which may increase the worms’ activity and growth over time.
                </p>
              </div>

              <aside className={classes.SummaryCard}>
                <h2>How to order</h2>
                <ul className={classes.FeatureList}>
                  <li>
                    A separately orderable 500 g pack for supplementing a worm bin’s food.
                  </li>
                  <li>
                    The smaller 150 g pack is only available as an add-on to a worm
                    package.
                  </li>
                  <li>
                    Ingredients: wheat bran, oat bran, soya meal, wheat flour, garden
                    lime, zeolite and basalt.
                  </li>
                </ul>

                <h3>Prices</h3>
                <ul className={classes.PriceList}>
                  {variants.map((variant) => (
                    <li key={variant.sku}>
                      <VariantPriceDisplay
                        title={`${variant.weightGrams ?? variant.amount} g`}
                        variant={variant}
                        language={language}
                      />
                    </li>
                  ))}
                </ul>

                <a
                  className={classes.PrimaryCTA}
                  href="#order"
                  data-analytics-cta="order"
                >
                  Add to shopping cart
                </a>
              </aside>
            </div>
          </section>

          <section className={classes.SectionStack}>
            <h2>How to use the mix</h2>
            <div className={classes.CardGrid}>
              <div className={classes.InfoCard}>
                <h3>With food waste</h3>
                <p>
                  When adding kitchen food waste, sprinkle approximately 1 tablespoon of
                  the fibre mix per 10 litres of worm-bin material once a week as a small
                  maintenance dose.
                </p>
              </div>
              <div className={classes.InfoCard}>
                <h3>Temporarily without food waste</h3>
                <p>
                  If little food waste is available, use 0.5 dl / 10 L of active worm-bin
                  material once a week at about 15–25 °C. Use this only temporarily, for
                  no more than 3 consecutive weeks.
                </p>
              </div>
              <div className={classes.InfoCard}>
                <h3>Application and adjustment</h3>
                <p>
                  Sprinkle a thin layer on the surface, moisten it lightly and cover it
                  with moist paper or worm bedding. Increase the amount if it disappears
                  in 1–2 days. Reduce it if the bin begins to smell or develops mould.
                </p>
              </div>
              <div className={classes.InfoCard}>
                <h3>When not to add more</h3>
                <p>
                  Do not add another dose when earlier mix or food remains clearly
                  unprocessed, the bin is too wet, or there is a sharp or rotting smell.
                  Correct moisture and feeding first.
                </p>
              </div>
              <div className={classes.InfoCard}>
                <h3>Dispatch</h3>
                <p>{messages.deliveryNotice.body}</p>
                <p>
                  {commerceCopy.shippingSchedule.compostChow} Orders placed on Sunday or
                  Monday are dispatched on Monday of the following week.
                </p>
              </div>
            </div>
          </section>

          <section id="order" className={classes.OrderSection}>
            <div className={classes.OrderSectionHeader}>
              <h2>Order compost fibre mix</h2>
              <p>Prices start at {formatCurrency(variants[0]?.price ?? 0, language)}.</p>
            </div>

            <DeliveryNotice />
            <AddToCartPanel productKey="compostChow" language={language} />
          </section>
        </div>
      </article>
    </>
  );
}
