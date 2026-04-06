import { productCatalogSource } from '../../data/products/catalogSource.mjs';
import { SITE_URL } from '../../data/site/constants.mjs';

const merchantDefaults = {
  brand: 'Lieromaa',
  availability: 'in_stock',
  condition: 'new',
  identifierExists: 'no',
  shippingService: 'Nouto Postista tai automaatista',
};

const schemaDefaults = {
  brandName: 'Lieromaa',
  brandLogo: `${SITE_URL}/images/lieromaa_logo_1024.avif`,
  handlingTime: {
    minValue: 1,
    maxValue: 2,
    unitCode: 'd',
  },
  offerAttributes: {},
  productAttributes: {},
  returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
  shippingDestinationCountry: 'FI',
  transitTime: {
    minValue: 2,
    maxValue: 4,
    unitCode: 'd',
  },
  webPage: {
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
  },
};

function createImageEntries(images) {
  return images.map((image) => ({
    ...image,
    src: image.url,
    absoluteUrl: new URL(image.url, SITE_URL).toString(),
  }));
}

function createCatalogEntry(productKey, product) {
  const canonicalUrl = product.page.canonicalUrl;
  const pageUrl = new URL(canonicalUrl, SITE_URL).toString();
  const images = createImageEntries(product.media.images);
  const primaryImage = images[0];
  const title = product.page.title ?? `${product.page.pageName} | Lieromaa`;
  const description = product.page.description;

  return {
    ...product,
    key: productKey,
    canonicalUrl,
    pageUrl,
    pageId: `${pageUrl}#webpage`,
    faqId: `${pageUrl}#faq`,
    productId: `${pageUrl}#product`,
    pageName: product.page.pageName,
    title,
    description,
    pageDescription: product.page.pageDescription ?? description,
    h1: product.page.h1,
    navigationLabel: product.page.navigationLabel ?? product.name,
    updatedAt: product.page.updatedAt,
    productName: product.product.name,
    productDescription: product.product.description ?? description,
    image: primaryImage
      ? {
          url: primaryImage.url,
          width: primaryImage.width,
          height: primaryImage.height,
          alt: primaryImage.alt,
        }
      : null,
    imageUrl: primaryImage?.absoluteUrl ?? '',
    images,
    productImageUrls: images.map((image) => image.absoluteUrl),
    faqItems: product.faqItems ?? [],
    search: product.search ?? null,
    metadata: {
      title,
      description,
      canonicalUrl,
      image: primaryImage
        ? {
            url: primaryImage.url,
            width: primaryImage.width,
            height: primaryImage.height,
            alt: primaryImage.alt,
          }
        : undefined,
    },
    merchant: {
      ...merchantDefaults,
      ...product.merchant,
    },
    schema: {
      ...schemaDefaults,
      ...product.schema,
      offerAttributes: {
        ...schemaDefaults.offerAttributes,
        ...product.schema?.offerAttributes,
      },
      productAttributes: {
        ...schemaDefaults.productAttributes,
        ...product.schema?.productAttributes,
      },
      webPage: {
        ...schemaDefaults.webPage,
        ...product.schema?.webPage,
      },
    },
  };
}

export const productCatalog = Object.fromEntries(
  Object.entries(productCatalogSource).map(([productKey, product]) => [
    productKey,
    createCatalogEntry(productKey, product),
  ])
);

export function getProductCatalogEntry(productKey) {
  const product = productCatalog[productKey];

  if (!product || typeof product !== 'object') {
    throw new Error(`Unknown product catalog key "${productKey}"`);
  }

  return product;
}

export const productDefinitions = Object.fromEntries(
  Object.entries(productCatalog).map(([productKey, product]) => [
    productKey,
    {
      name: product.name,
      variantSkus: product.variantSkus,
      shippingSku: product.shippingSku,
      shippingOptions: product.order?.shippingOptions ?? [],
    },
  ])
);
