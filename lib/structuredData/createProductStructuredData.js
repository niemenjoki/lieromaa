import {
  formatSchemaPrice,
  getProductVariants,
  getShippingOption,
} from '@/lib/pricing/catalog';
import { getProductCatalogEntry } from '@/lib/products/catalog.mjs';

function createShippingDetails(product, shippingRate) {
  return {
    '@type': 'OfferShippingDetails',
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: product.schema.shippingDestinationCountry,
    },
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: formatSchemaPrice(shippingRate),
      currency: 'EUR',
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: {
        '@type': 'QuantitativeValue',
        minValue: product.schema.handlingTime.minValue,
        maxValue: product.schema.handlingTime.maxValue,
        unitCode: product.schema.handlingTime.unitCode,
      },
      transitTime: {
        '@type': 'QuantitativeValue',
        minValue: product.schema.transitTime.minValue,
        maxValue: product.schema.transitTime.maxValue,
        unitCode: product.schema.transitTime.unitCode,
      },
    },
  };
}

function createReturnPolicy(product) {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: product.schema.shippingDestinationCountry,
    returnPolicyCategory: product.schema.returnPolicyCategory,
    additionalProperty: product.schema.returnPolicyText
      ? [
          {
            '@type': 'PropertyValue',
            name: 'Peruuttamisoikeus',
            value: product.schema.returnPolicyText,
          },
        ]
      : [],
  };
}

function createBrand(product) {
  const brand = {
    '@type': 'Brand',
    name: product.schema.brandName,
  };

  if (product.schema.brandLogo) {
    brand.logo = product.schema.brandLogo;
  }

  return brand;
}

function createFaqNode(product) {
  if (product.faqItems.length === 0) {
    return null;
  }

  return {
    '@type': 'FAQPage',
    '@id': product.faqId,
    mainEntity: product.faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function createOffer(product, variant, shippingRate) {
  const offerAttributes = {
    ...(product.schema.offerAttributes ?? {}),
  };
  const defaultPriceValidUntil = offerAttributes.priceValidUntil;

  delete offerAttributes.priceValidUntil;

  const offer = {
    '@type': 'Offer',
    url: product.pageUrl,
    name: `${product.productName} (${variant.amount} kpl)`,
    priceCurrency: 'EUR',
    price: formatSchemaPrice(variant.price),
    availability: 'https://schema.org/InStock',
    ...offerAttributes,
    shippingDetails: createShippingDetails(product, shippingRate),
    hasMerchantReturnPolicy: createReturnPolicy(product),
  };

  const priceValidUntil = variant.discount?.validUntil || defaultPriceValidUntil;
  if (priceValidUntil) {
    offer.priceValidUntil = priceValidUntil;
  }

  if (variant.discount) {
    offer.priceSpecification = {
      '@type': 'UnitPriceSpecification',
      price: formatSchemaPrice(variant.basePrice),
      priceCurrency: 'EUR',
      priceType: 'https://schema.org/StrikethroughPrice',
      validThrough: variant.discount.validUntil,
    };
  }

  return offer;
}

export function createProductStructuredData(productKey) {
  const product = getProductCatalogEntry(productKey);
  const variants = getProductVariants(productKey);
  const shippingRate = getShippingOption(productKey, 'postitus')?.price ?? 0;

  const webPageNode = {
    '@type': 'WebPage',
    '@id': product.pageId,
    url: product.pageUrl,
    name: product.pageName,
    description: product.pageDescription,
    ...product.schema.webPage,
    inLanguage: 'fi',
  };

  const offers = variants.map((variant) => createOffer(product, variant, shippingRate));

  const productNode = {
    '@type': 'Product',
    '@id': product.productId,
    name: product.productName,
    description: product.productDescription,
    image: product.productImageUrls,
    sku: product.product.sku,
    brand: createBrand(product),
    itemCondition: 'https://schema.org/NewCondition',
    ...product.schema.productAttributes,
    offers: offers.length === 1 ? offers[0] : offers,
  };

  const graph = [webPageNode, productNode];
  const faqNode = createFaqNode(product);

  if (faqNode) {
    graph.push(faqNode);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
