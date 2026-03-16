import {
  formatSchemaPrice,
  getProductOfferStats,
  getShippingOption,
} from '@/lib/pricing/catalog';

import {
  imageUrl,
  pageDescription,
  pageId,
  pageName,
  pageUrl,
  productDescription,
  productId,
  productName,
} from './pageMetadata';

const { highPrice, lowPrice, offerCount } = getProductOfferStats('worms');
const shippingRate = getShippingOption('worms', 'postitus')?.price ?? 0;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': pageId,
      url: pageUrl,
      name: pageName,
      description: pageDescription,
      isPartOf: { '@id': 'https://www.lieromaa.fi/#website' },
      about: { '@id': 'https://www.lieromaa.fi/#organization' },
      inLanguage: 'fi',
    },
    {
      '@type': 'Product',
      '@id': productId,
      name: productName,
      description: productDescription,
      image: imageUrl,
      sku: 'MADOT',
      brand: {
        '@type': 'Brand',
        name: 'Lieromaa',
        logo: 'https://www.lieromaa.fi/images/lieromaa_logo_1024.avif',
      },
      category: 'GardenProduct',
      material: 'Kompostimulta, pahvisilppu, puukuitu, kookoskuitu',
      offers: {
        '@type': 'AggregateOffer',
        url: pageUrl,
        priceCurrency: 'EUR',
        lowPrice: formatSchemaPrice(lowPrice),
        highPrice: formatSchemaPrice(highPrice),
        offerCount,
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2026-06-30',
        seller: {
          '@type': 'Organization',
          name: 'Lieromaa / Joonas Niemenjoki',
          identifier: 'Y-tunnus 3002257-7',
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'FI',
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
              minValue: 1,
              maxValue: 2,
              unitCode: 'd',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 2,
              maxValue: 4,
              unitCode: 'd',
            },
          },
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'FI',
          returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
          additionalProperty: [
            {
              '@type': 'PropertyValue',
              name: 'Peruuttamisoikeus',
              value:
                'Kompostimadot eivät kuulu 14 vrk peruuttamisoikeuden piiriin (Kuluttajansuojalaki 6 luku 16 §).',
            },
          ],
        },
      },
    },
  ],
};

export default structuredData;
