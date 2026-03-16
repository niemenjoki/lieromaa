import {
  formatSchemaPrice,
  getProductOfferStats,
  getShippingOption,
} from '@/lib/pricing/catalog';

import {
  description,
  faqId,
  pageId,
  pageName,
  pageUrl,
  productId,
  productImageUrls,
  productName,
} from './pageMetadata';

const { highPrice, lowPrice, offerCount } = getProductOfferStats('starterKit');
const shippingRate = getShippingOption('starterKit', 'postitus')?.price ?? 0;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': pageId,
      url: pageUrl,
      name: pageName,
      description,
      inLanguage: 'fi',
    },
    {
      '@type': 'Product',
      '@id': productId,
      name: productName,
      sku: 'LM-STARTER-001',
      image: productImageUrls,
      description,
      brand: {
        '@type': 'Brand',
        name: 'Lieromaa',
      },
      itemCondition: 'https://schema.org/NewCondition',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'EUR',
        lowPrice: formatSchemaPrice(lowPrice),
        highPrice: formatSchemaPrice(highPrice),
        offerCount,
        availability: 'https://schema.org/InStock',
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
                'Aloituspakkaus sisältää kompostimatoja, jotka eivät kuulu 14 vrk peruuttamisoikeuden piiriin (Kuluttajansuojalaki 6 luku 16 §).',
            },
          ],
        },
      },
    },
    {
      '@type': 'FAQPage',
      '@id': faqId,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Haiseeko matokompostori?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Oikein hoidettuna matokompostori on hajuton. Hajuhaitat liittyvät yleensä liialliseen ruokintaan tai liian kosteaan massaan.',
          },
        },
        {
          '@type': 'Question',
          name: 'Kuinka nopeasti kompostointi käynnistyy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Madot alkavat käsitellä biojätettä heti, mutta ensimmäisten viikkojen aikana ruokintaa suositellaan maltillisena.',
          },
        },
        {
          '@type': 'Question',
          name: 'Voiko kompostoria pitää sisätiloissa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Kyllä. Läpivirtauskompostori soveltuu hyvin sisäkäyttöön, kun kosteustasapaino ja ruokinta pidetään hallinnassa.',
          },
        },
      ],
    },
  ],
};

export default structuredData;
