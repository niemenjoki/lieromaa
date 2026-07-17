import { assertLanguage } from '../i18n/config.mjs';
import { getProductMessages } from '../i18n/messages.mjs';
import { getRoutePath } from '../i18n/routes.mjs';
import {
  formatSchemaPrice,
  getDefaultShippingOption,
  getProductVariants,
} from '../pricing/catalog.js';
import { getProductCatalogEntry } from '../products/catalog.mjs';
import {
  getApprovedProductReviewSummary,
  getApprovedProductWrittenReviews,
} from '../reviews/approvedReviews.js';

const MAX_PRODUCT_SCHEMA_REVIEWS = 20;

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

function createReturnPolicy(product, schemaCopy) {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: product.schema.shippingDestinationCountry,
    returnPolicyCategory: product.schema.returnPolicyCategory,
    additionalProperty: schemaCopy.returnPolicyText
      ? [
          {
            '@type': 'PropertyValue',
            name: schemaCopy.returnPolicyName,
            value: schemaCopy.returnPolicyText,
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

function createFaqNode({ faqId, faqItems, language }) {
  if (faqItems.length === 0) {
    return null;
  }

  return {
    '@type': 'FAQPage',
    '@id': faqId,
    inLanguage: language,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function getSchemaAvailabilityUrl(availabilityStatus) {
  if (availabilityStatus === 'unavailable') {
    return 'https://schema.org/OutOfStock';
  }

  if (availabilityStatus === 'limited') {
    return 'https://schema.org/LimitedAvailability';
  }

  return 'https://schema.org/InStock';
}

function formatVariantName(variant, language) {
  if (variant.salesUnit === 'weight' && variant.weightGrams) {
    return `${variant.weightGrams} g`;
  }

  if (variant.binCount) {
    if (language === 'en') {
      return `${variant.binCount} ${variant.binCount === 1 ? 'box' : 'boxes'}`;
    }

    return variant.binCount === 1 ? '1 laatikko' : `${variant.binCount} laatikkoa`;
  }

  return language === 'en' ? `${variant.amount} items` : `${variant.amount} kpl`;
}

function createOffer({
  language,
  pageUrl,
  product,
  productName,
  schemaCopy,
  shippingRate,
  variant,
}) {
  const offerAttributes = {
    ...(product.schema.offerAttributes ?? {}),
  };
  const defaultPriceValidUntil = offerAttributes.priceValidUntil;
  const variantName = formatVariantName(variant, language);

  delete offerAttributes.priceValidUntil;

  const offer = {
    '@type': 'Offer',
    url: pageUrl,
    name: `${productName} (${variantName})`,
    priceCurrency: 'EUR',
    price: formatSchemaPrice(variant.price),
    availability: getSchemaAvailabilityUrl(variant.availabilityStatus),
    ...offerAttributes,
    shippingDetails: createShippingDetails(product, shippingRate),
    hasMerchantReturnPolicy: createReturnPolicy(product, schemaCopy),
  };

  const priceValidUntil = variant.discount?.validUntil || defaultPriceValidUntil;
  if (priceValidUntil) {
    offer.priceValidUntil = priceValidUntil;
  }

  if (variant.discount) {
    if (variant.discount.validFrom) {
      offer.validFrom = variant.discount.validFrom;
    }

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

function createBreadcrumbNode({ breadcrumbId, breadcrumbItems }) {
  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function createAggregateRating(summary) {
  if (!summary.reviewCount) {
    return null;
  }

  return {
    '@type': 'AggregateRating',
    ratingValue: summary.averageRating.toFixed(1),
    reviewCount: summary.reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

function createReviewNodes(reviews, pageLanguage) {
  return reviews.map((review) => {
    const reviewNode = {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name:
          review.displayName ||
          (pageLanguage === 'en' ? 'Verified buyer' : 'Vahvistettu ostaja'),
      },
      inLanguage: review.language,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    };

    if (review.review) {
      reviewNode.reviewBody = review.review;
    }

    if (review.submittedAt) {
      const publishedDate = new Date(review.submittedAt);
      if (!Number.isNaN(publishedDate.getTime())) {
        reviewNode.datePublished = publishedDate.toISOString().slice(0, 10);
      }
    }

    return reviewNode;
  });
}

export function createProductStructuredData(productKey, language = 'fi') {
  const normalizedLanguage = assertLanguage(language);
  const product = getProductCatalogEntry(productKey);
  const productMessages = getProductMessages(normalizedLanguage);
  const productCopy = productMessages.catalog[productKey];
  const routeKey = productKey === 'worms' ? 'compostWorms' : 'compostFibreMix';
  const canonicalUrl = getRoutePath(routeKey, normalizedLanguage);
  const pageUrl = new URL(canonicalUrl, product.pageUrl).toString();
  const pageId = `${pageUrl}#webpage`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const faqId = `${pageUrl}#faq`;
  const productId = `${pageUrl}#product`;
  const breadcrumbItems = [
    {
      name: normalizedLanguage === 'en' ? 'English home' : 'Etusivu',
      url: new URL(getRoutePath('home', normalizedLanguage), pageUrl).toString(),
    },
    {
      name: productMessages.collection.pageName,
      url: new URL(getRoutePath('products', normalizedLanguage), pageUrl).toString(),
    },
    { name: productCopy.productName, url: pageUrl },
  ];
  const variants = getProductVariants(productKey).filter(
    (variant) => !variant.hideFromPublicOffers
  );
  const shippingRate = getDefaultShippingOption(productKey)?.price ?? 0;
  const approvedReviews = getApprovedProductWrittenReviews(productKey);
  const reviewSummary = getApprovedProductReviewSummary(productKey);

  const webPageNode = {
    '@type': 'WebPage',
    '@id': pageId,
    url: pageUrl,
    name: productCopy.pageName,
    description: productCopy.pageDescription,
    ...product.schema.webPage,
    breadcrumb: { '@id': breadcrumbId },
    inLanguage: normalizedLanguage,
  };

  const offers = variants.map((variant) =>
    createOffer({
      language: normalizedLanguage,
      pageUrl,
      product,
      productName: productCopy.productName,
      schemaCopy: productCopy.schema,
      shippingRate,
      variant,
    })
  );

  const productNode = {
    '@type': 'Product',
    '@id': productId,
    name: productCopy.productName,
    description: productCopy.productDescription,
    image: product.productImageUrls,
    sku: product.product.sku,
    brand: createBrand(product),
    itemCondition: 'https://schema.org/NewCondition',
    ...product.schema.productAttributes,
    material: productCopy.schema.material,
    inLanguage: normalizedLanguage,
    offers: offers.length === 1 ? offers[0] : offers,
  };

  const aggregateRating = createAggregateRating(reviewSummary);
  if (aggregateRating) {
    productNode.aggregateRating = aggregateRating;
  }

  if (approvedReviews.length > 0) {
    productNode.review = createReviewNodes(
      approvedReviews.slice(0, MAX_PRODUCT_SCHEMA_REVIEWS),
      normalizedLanguage
    );
  }

  const graph = [
    webPageNode,
    productNode,
    createBreadcrumbNode({ breadcrumbId, breadcrumbItems }),
  ];
  const faqNode = createFaqNode({
    faqId,
    faqItems: productCopy.faqItems ?? [],
    language: normalizedLanguage,
  });

  if (faqNode) {
    graph.push(faqNode);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
