import classes from '@/app/(fi)/tuotteet/ProductPage.module.css';
import FinnishContentLinks from '@/components/FinnishContentLinks/FinnishContentLinks';
import SafeImage from '@/components/SafeImage/SafeImage';
import SafeLink from '@/components/SafeLink/SafeLink';
import SalesMilestones from '@/components/SalesMilestones/SalesMilestones';
import { formatCurrency, formatPrice } from '@/lib/i18n/formatters.mjs';
import { getProductMessages } from '@/lib/i18n/messages.mjs';
import { getRoutePath } from '@/lib/i18n/routes.mjs';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import { getProductVariants } from '@/lib/pricing/catalog';
import { getProductCatalogEntry } from '@/lib/products/catalog.mjs';
import { SITE_URL } from '@/lib/site/constants.mjs';
import { createCollectionStructuredData } from '@/lib/structuredData/createCollectionStructuredData.mjs';

const language = 'en';
const copy = getProductMessages(language);
const pageMetadata = {
  language,
  title: 'Compost worms and worm-composting supplies in Finland | Lieromaa',
  description:
    'Shop locally raised compost worms with optional add-ons and a separately orderable 500 g compost fibre mix from Lieromaa.',
  canonicalUrl: getRoutePath('products', language),
};
const productKeys = ['worms', 'compostChow'];

export const revalidate = 300;

export function generateMetadata() {
  return createLocalizedPageMetadata(pageMetadata);
}

function formatProductPrice(productKey) {
  const variants = getProductVariants(productKey).filter(
    (variant) => !variant.hideFromPublicOffers && variant.isAvailable
  );

  if (!variants.length) return copy.collection.unavailable;

  const prices = variants.map((variant) => Number(variant.price) || 0);
  const lowPrice = Math.min(...prices);
  const highPrice = Math.max(...prices);

  return lowPrice === highPrice
    ? formatCurrency(lowPrice, language)
    : `${formatPrice(lowPrice, language)}–${formatPrice(highPrice, language)} €`;
}

export default function EnglishHomePage() {
  const pageUrl = new URL(pageMetadata.canonicalUrl, SITE_URL).toString();
  const structuredData = createCollectionStructuredData({
    pageUrl,
    pageName: 'Lieromaa English shop',
    description: pageMetadata.description,
    language,
    itemListElement: productKeys.map((productKey, index) => {
      const routeKey = productKey === 'worms' ? 'compostWorms' : 'compostFibreMix';

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: copy.catalog[productKey].productName,
        url: new URL(getRoutePath(routeKey, language), SITE_URL).toString(),
      };
    }),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <article className={`${classes.ProductPage} ${classes.ProductListPage}`}>
        <h1>Compost worms and worm-composting supplies in Finland</h1>

        <div className={classes.Content}>
          <section className={classes.ProductHero}>
            <div className={classes.HeroDetails}>
              <p className={classes.Lead}>
                Lieromaa raises compost worms in Järvenpää and supplies the essentials for
                starting and maintaining a worm bin. Order in English and choose Posti
                delivery or local pickup in Järvenpää.
              </p>
              <SafeLink
                href={getRoutePath('compostWorms', language)}
                className={classes.PrimaryCTA}
              >
                Shop compost worms
              </SafeLink>
            </div>
          </section>

          <section className={classes.SectionStack}>
            <div className={classes.HeroDetails}>
              <h2>Products</h2>
              <p>{copy.collection.lead}</p>
            </div>

            <SalesMilestones language={language} />

            <div className={classes.ProductGrid}>
              {productKeys.map((productKey) => {
                const product = getProductCatalogEntry(productKey);
                const productCopy = copy.catalog[productKey];
                const href = getRoutePath(
                  productKey === 'worms' ? 'compostWorms' : 'compostFibreMix',
                  language
                );

                return (
                  <SafeLink key={productKey} href={href} className={classes.ProductCard}>
                    {product.image ? (
                      <SafeImage
                        src={product.image.url}
                        alt={productCopy.imageAlts[0]}
                        width={product.image.width || 800}
                        height={product.image.height || 600}
                        sizes="(max-width: 720px) 100vw, 50vw"
                        className={classes.ProductCardImage}
                      />
                    ) : null}
                    <span className={classes.ProductCardBody}>
                      <span className={classes.ProductCardTitle}>
                        {productCopy.productName}
                      </span>
                      <span className={classes.ProductCardDescription}>
                        {productCopy.productDescription}
                      </span>
                      <span className={classes.ProductCardPrice}>
                        {formatProductPrice(productKey)}
                      </span>
                    </span>
                  </SafeLink>
                );
              })}
            </div>
          </section>

          <section className={classes.CardGrid}>
            <aside className={classes.InfoCard}>
              <h2>How ordering works</h2>
              <ol>
                <li>Choose the products and quantities you need.</li>
                <li>
                  Select a Posti pickup point, home delivery or local pickup in Järvenpää.
                </li>
                <li>Lieromaa checks availability and confirms your order personally.</li>
                <li>
                  Pay now with MobilePay or a card through Stripe, or choose an email
                  invoice after dispatch or collection. The invoice payment term is 14
                  days.
                </li>
              </ol>
            </aside>

            <aside className={classes.InfoCard}>
              <h2>Why buy from Lieromaa?</h2>
              <p>
                The worms are raised locally and packed by weight with moist bedding from
                an active worm bin. English instructions help you get started and increase
                feeding gradually.
              </p>
              <SafeLink href={getRoutePath('wormCalculator', language)}>
                Calculate how many worms you need
              </SafeLink>
              <SafeLink href={getRoutePath('gettingStarted', language)}>
                Getting started with compost worms
              </SafeLink>
            </aside>
          </section>

          <FinnishContentLinks />
        </div>
      </article>
    </>
  );
}
