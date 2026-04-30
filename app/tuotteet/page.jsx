import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import SafeImage from '@/components/SafeImage/SafeImage';
import SafeLink from '@/components/SafeLink/SafeLink';
import { createPageMetadata } from '@/lib/metadata/createPageMetadata';
import { formatPrice, getProductVariants } from '@/lib/pricing/catalog';
import { productCatalog } from '@/lib/products/catalog.mjs';
import { SITE_URL } from '@/lib/site/constants.mjs';
import { createCollectionStructuredData } from '@/lib/structuredData/createCollectionStructuredData.mjs';

import classes from './ProductPage.module.css';

const pageMetadata = {
  title: 'Tuotteet | Lieromaa',
  description:
    'Lieromaan tuotteet matokompostoinnin aloittamiseen ja ylläpitoon: kompostimadot, matokompostorin aloituspakkaus ja kompostorin kuituseos.',
  canonicalUrl: '/tuotteet',
};

const breadcrumbItems = [
  { name: 'Etusivu', href: '/', url: `${SITE_URL}/` },
  { name: 'Tuotteet', href: '/tuotteet', url: `${SITE_URL}/tuotteet` },
];

function formatProductPrice(productKey) {
  const variants = getProductVariants(productKey);

  if (!variants.length) {
    return 'Ei saatavilla';
  }

  const prices = variants.map((variant) => Number(variant.price) || 0);
  const lowPrice = Math.min(...prices);
  const highPrice = Math.max(...prices);

  if (lowPrice === highPrice) {
    return `${formatPrice(lowPrice)} €`;
  }

  return `${formatPrice(lowPrice)}-${formatPrice(highPrice)} €`;
}

export function generateMetadata() {
  return createPageMetadata(pageMetadata);
}

export default function ProductsPage() {
  const products = Object.values(productCatalog);
  const structuredData = createCollectionStructuredData({
    pageUrl: `${SITE_URL}${pageMetadata.canonicalUrl}`,
    pageName: pageMetadata.title,
    description: pageMetadata.description,
    breadcrumbItems,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.productName,
      url: product.pageUrl,
    })),
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
        <Breadcrumbs items={breadcrumbItems} />
        <h1>Lieromaan tuotteet</h1>
        <div className={classes.Content}>
          <section className={classes.SectionStack}>
            <p className={classes.Lead}>
              Kompostimadot, aloituspakkaus ja kompostorin ylläpitoa helpottava kuituseos
              samasta paikasta.
            </p>

            <div className={classes.ProductGrid}>
              {products.map((product) => (
                <SafeLink
                  key={product.key}
                  href={product.canonicalUrl}
                  className={classes.ProductCard}
                >
                  {product.image ? (
                    <SafeImage
                      src={product.image.url}
                      alt={product.image.alt || ''}
                      width={product.image.width || 800}
                      height={product.image.height || 600}
                      sizes="(max-width: 720px) 100vw, 33vw"
                      className={classes.ProductCardImage}
                    />
                  ) : null}
                  <span className={classes.ProductCardBody}>
                    <span className={classes.ProductCardTitle}>
                      {product.productName}
                    </span>
                    <span className={classes.ProductCardDescription}>
                      {product.productDescription}
                    </span>
                    <span className={classes.ProductCardPrice}>
                      {formatProductPrice(product.key)}
                    </span>
                  </span>
                </SafeLink>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
