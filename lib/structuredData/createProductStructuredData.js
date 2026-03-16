import { getProductCatalogEntry } from '@/data/productCatalog.mjs';
import {
  formatSchemaPrice,
  getProductOfferStats,
  getShippingOption,
} from '@/lib/pricing/catalog';

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

export function createProductStructuredData(productKey) {
  const product = getProductCatalogEntry(productKey);
  const { highPrice, lowPrice, offerCount } = getProductOfferStats(productKey);
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

  const offers = {
    '@type': 'AggregateOffer',
    url: product.pageUrl,
    priceCurrency: 'EUR',
    lowPrice: formatSchemaPrice(lowPrice),
    highPrice: formatSchemaPrice(highPrice),
    offerCount,
    availability: 'https://schema.org/InStock',
    ...product.schema.offerAttributes,
    shippingDetails: createShippingDetails(product, shippingRate),
    hasMerchantReturnPolicy: createReturnPolicy(product),
  };

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
    offers,
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
