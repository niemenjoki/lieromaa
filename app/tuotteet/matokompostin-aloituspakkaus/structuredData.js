import {
  formatSchemaPrice,
  getProductOfferStats,
  getShippingOption,
} from '@/lib/pricing/catalog';

const { highPrice, lowPrice, offerCount } = getProductOfferStats('starterKit');
const shippingRate = getShippingOption('starterKit', 'postitus')?.price ?? 0;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.lieromaa.fi/tuotteet/matokompostin-aloituspakkaus#webpage',
      url: 'https://www.lieromaa.fi/tuotteet/matokompostin-aloituspakkaus',
      name: 'Matokompostorin aloituspakkaus ja madot',
      description:
        'Lieromaan aloituspakkaus tekee aloituksesta helppoa: kolmen laatikon kompostori, petimateriaali ja kompostimadot valmiina käyttöön.',
      inLanguage: 'fi',
    },
    {
      '@type': 'Product',
      '@id': 'https://www.lieromaa.fi/tuotteet/matokompostin-aloituspakkaus#product',
      name: 'Matokompostorin aloituspakkaus',
      sku: 'LM-STARTER-001',
      image: [
        'https://www.lieromaa.fi/images/starterkit/aloituspakkaus_suljettu_matokompostori.avif',
        'https://www.lieromaa.fi/images/starterkit/aloituspakkaus_sisalto_ylhaalta_kuvattuna.avif',
      ],
      description:
        'Lieromaan aloituspakkaus tekee aloituksesta helppoa: kolmen laatikon kompostori, petimateriaali ja kompostimadot valmiina käyttöön.',
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
      '@id': 'https://www.lieromaa.fi/tuotteet/matokompostin-aloituspakkaus#faq',
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
