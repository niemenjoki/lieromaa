import AddToCartPanel from '@/app/(fi)/tuotteet/AddToCartPanel';
import ProductAvailabilityNotice from '@/app/(fi)/tuotteet/ProductAvailabilityNotice';
import classes from '@/app/(fi)/tuotteet/ProductPage.module.css';
import ProductReviewsSection from '@/app/(fi)/tuotteet/ProductReviewsSection';
import VariantPriceDisplay from '@/app/(fi)/tuotteet/VariantPriceDisplay';
import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import SafeLink from '@/components/SafeLink/SafeLink';
import { getCommerceMessages, getProductMessages } from '@/lib/i18n/messages.mjs';
import { getRoutePath } from '@/lib/i18n/routes.mjs';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import {
  formatCurrency,
  getProductShippingOptions,
  getProductVariants,
} from '@/lib/pricing/catalog';
import { getProductCatalogEntry } from '@/lib/products/catalog.mjs';
import { createProductStructuredData } from '@/lib/structuredData/createProductStructuredData';

const language = 'en';
const messages = getProductMessages(language);
const productCopy = messages.catalog.worms;
const commerceCopy = getCommerceMessages(language);
const product = getProductCatalogEntry('worms');
const pageMetadata = {
  language,
  title: productCopy.title,
  description: productCopy.description,
  canonicalUrl: getRoutePath('compostWorms', language),
  image: {
    ...product.image,
    alt: productCopy.imageAlts[0],
  },
};
const breadcrumbItems = [
  { name: 'Products', href: getRoutePath('products', language) },
  { name: 'Compost worms', href: pageMetadata.canonicalUrl },
];
const galleryImages = product.images.map((image, index) => ({
  ...image,
  alt: productCopy.imageAlts[index] || productCopy.imageAlts[0],
}));
const shippingOptions = getProductShippingOptions('worms', language);
const pickupOption = shippingOptions.find((option) => option.id === 'posti_noutopiste');
const homeOption = shippingOptions.find((option) => option.id === 'posti_kotiinkuljetus');
const localPickupOption = shippingOptions.find((option) => option.id === 'nouto');

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

export default function EnglishCompostWormsPage() {
  const variants = getProductVariants('worms');
  const structuredData = createProductStructuredData('worms', language);

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
                  I raise and sell compost worms (<em>Eisenia fetida</em>, commonly called
                  red wigglers) from my own worm bins in Järvenpää.
                </p>
                <p>
                  Compost worms turn suitable food waste into nutrient-rich worm castings
                  at home. A worm bin can be kept indoors, and a balanced bin is
                  low-maintenance and does not smell unpleasant. The worms process waste
                  efficiently and increase in number when conditions are suitable.
                </p>
                <p>
                  Each pack contains your selected weight of worms and approximately half
                  a litre of active worm-bin material for transport. This transport
                  bedding is not their permanent home: move all the worms and bedding into
                  the prepared moist worm bedding in your own bin. The active material
                  also introduces beneficial microbes. If you are unsure about the
                  starting amount, use the{' '}
                  <SafeLink href={getRoutePath('wormCalculator', language)}>
                    worm calculator
                  </SafeLink>
                  .
                </p>
                <p>
                  Take things slowly for the first few weeks after adding the worms. Read
                  the complete{' '}
                  <SafeLink href={getRoutePath('gettingStarted', language)}>
                    getting-started instructions for compost worms
                  </SafeLink>
                  .
                </p>
              </div>

              <aside className={classes.SummaryCard}>
                <h2>How to order</h2>
                <ul className={classes.FeatureList}>
                  <li>Choose 25 g, 50 g, 75 g or 100 g of compost worms.</li>
                  <li>
                    The pack includes the worms and about 0.5 litre of active bedding.
                  </li>
                  <li>
                    Add a ready-to-use 14-litre worm bin for 30 € if you would like the
                    bedding, worms and first feeding prepared for you.
                  </li>
                </ul>

                <h3>Prices</h3>
                <ul className={classes.PriceList}>
                  {variants.map((variant) => (
                    <li key={variant.sku}>
                      <VariantPriceDisplay
                        title={`${variant.weightGrams ?? variant.amount} g${
                          variant.estimatedWormCount
                            ? ` (~${variant.estimatedWormCount} worms)`
                            : ''
                        }`}
                        variant={variant}
                        language={language}
                      />
                    </li>
                  ))}
                </ul>

                <ProductAvailabilityNotice
                  productKey="worms"
                  className={classes.HelperText}
                  prefix="Availability:"
                  language={language}
                />

                <p className={classes.HelperText}>
                  Find out{' '}
                  <SafeLink href={getRoutePath('wormSource', language)}>
                    where Lieromaa’s worms come from
                  </SafeLink>
                  .
                </p>
                <p className={classes.HelperText}>
                  I confirm availability within two days.
                </p>

                <a
                  className={classes.PrimaryCTA}
                  href="#order"
                  data-analytics-cta="order"
                >
                  Order now
                </a>
              </aside>
            </div>
          </section>

          <ProductReviewsSection productKey="worms" language={language} />

          <section className={classes.SectionStack}>
            <h2>Before ordering</h2>
            <div className={classes.CardGrid}>
              <div className={classes.InfoCard}>
                <h3>Payment</h3>
                <p>
                  After you place the order, I check availability and personally confirm
                  it within two days.
                </p>
                <p>
                  Payment is made by invoice. Lieromaa sends the invoice directly to your
                  email address. <strong>The payment term is 7 days.</strong>
                </p>
              </div>

              <div className={classes.InfoCard}>
                <h3>Delivery</h3>
                <p>{messages.deliveryNotice.body}</p>
                <p>
                  Choose <strong>{pickupOption?.label}</strong> (
                  {formatCurrency(pickupOption?.price ?? 0, language)}),{' '}
                  <strong>{homeOption?.label}</strong> (
                  {formatCurrency(homeOption?.price ?? 0, language)}) or{' '}
                  <strong>{localPickupOption?.label}</strong> (
                  {formatCurrency(localPickupOption?.price ?? 0, language)}).
                </p>
                <p>
                  {commerceCopy.shippingSchedule.mondayOnly}{' '}
                  {commerceCopy.shippingSchedule.worms} Orders placed on Sunday or Monday
                  are dispatched on Monday of the following week.
                </p>
              </div>

              <div className={classes.InfoCard}>
                <h3>Cancellation and defects</h3>
                <p>
                  Dispatched worm orders cannot be cancelled because returned live worms
                  cannot be handled or resold as ordinary products. Other statutory rights
                  and liability for defects remain unaffected.
                </p>
                <p>
                  Contact customer service if a product or delivery is defective. Full
                  details are in the{' '}
                  <SafeLink href={getRoutePath('orderTerms', language)}>
                    order and delivery terms
                  </SafeLink>
                  .
                </p>
              </div>
            </div>
          </section>

          <section id="order" className={classes.OrderSection}>
            <span
              id="ready-to-use-worm-bin"
              className={classes.AnchorTarget}
              aria-hidden="true"
            />
            <div className={classes.OrderSectionHeader}>
              <h2>Order compost worms</h2>
            </div>

            <DeliveryNotice />
            <AddToCartPanel
              productKey="worms"
              relatedProductKeys={['compostChow']}
              language={language}
            />
          </section>
        </div>
      </article>
    </>
  );
}
