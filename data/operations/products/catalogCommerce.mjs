import {
  STARTER_KIT_HANDLING_TIME,
  WORMS_HANDLING_TIME,
} from '../commerce/shippingSchedule.mjs';

const sharedPickupHelperTexts = [
  'Paketti toimitetaan valitsemaasi Postin noutopisteeseen. Huomaa, että Posti voi ohjata lähetyksen toiseen noutopisteeseen, jos esimerkiksi valitsemasi noutopaikka on täynnä.',
];

const sharedHomeDeliveryHelperTexts = [
  'Posti sopii jakeluajan kanssasi OmaPosti-sovelluksen kautta, tekstiviestillä tai sähköpostitse.',
];

const sharedLocalPickupHelperTexts = [
  'Jos valitset toimitustavaksi noudon, olen sinuun yhteydessä, jotta voimme sopia noudosta tarkemmin',
];

const localPickupOption = {
  id: 'nouto',
  label: 'Nouto Järvenpäästä',
  price: 0,
  fulfillmentType: 'local_pickup',
  helperTexts: sharedLocalPickupHelperTexts,
};

export const productCatalogCommerceSource = {
  worms: {
    variantSkus: ['worms-50', 'worms-100', 'worms-200'],
    shippingSku: 'postage-worms-pickup',
    schema: {
      handlingTime: WORMS_HANDLING_TIME,
    },
    order: {
      defaultVariantAmount: 100,
      variantLegend: 'Valitse matojen määrä',
      variantSelectorPosition: 'beforeFulfillment',
      variantDescriptionPrefix: 'Voi laskea taloudellesi sopivan matojen määrän',
      variantDescriptionLinkHref: '/matolaskuri',
      variantDescriptionLinkLabel: 'matolaskurilla',
      showWormAmountFinePrint: true,
      getVariantLabel({ amount, priceFormatted }) {
        return `${amount} matoa - ${priceFormatted} €`;
      },
      shippingOptions: [
        {
          id: 'posti_noutopiste',
          label: 'Nouto Postista tai automaatista',
          priceSku: 'postage-worms-pickup',
          fulfillmentType: 'pickup_point',
          helperTexts: sharedPickupHelperTexts,
        },
        localPickupOption,
      ],
      shippingHelperTexts: sharedPickupHelperTexts,
      shippingDescription: null,
      submitButtonLabel() {
        return 'Lähetä tilaus';
      },
      extraInfoDescription: null,
      summaryDescription: null,
      invoiceTimingByFulfillmentType: {
        pickup_point: 'Lasku lähetetään, kun tilaus on toimitettu Postin kuljetettavaksi',
        local_pickup: 'Lasku lähetetään, kun olet noutanut tilauksen',
      },
      extraCharges: [
        {
          key: 'frostProtection',
          fieldName: 'pakkastoimituslisa',
          checkedValue: 'maksan',
          label: 'Pakkastoimituslisä',
          checkboxLabel: 'Maksan pakkastoimituslisän',
          price: 3,
          activeMonths: [9, 10, 11, 12, 1, 2, 3, 4, 5],
          descriptionLines: [
            'Kun ulkolämpötila on alle -5 C, matojen toimittaminen vaatii ylimääräistä pakkausmateriaalia matojen pitämiseksi elossa. Pakkastilanne määritetään alimmasta lämpötilaennusteesta matojen lähtöpaikan (Järvenpää) ja toimitusosoitteen perusteella.',
          ],
          helperTextLines: [
            'Voit tehdä tilauksen myös ilman pakkaslisää, vaikka ulkona olisi pakkasta, jolloin paketti toimitetaan pikimmiten sään lämmettyä.',
          ],
        },
      ],
    },
  },
  starterKit: {
    variantSkus: ['starterkit-50', 'starterkit-100', 'starterkit-200'],
    shippingSku: 'postage-starterkit-pickup',
    schema: {
      handlingTime: STARTER_KIT_HANDLING_TIME,
    },
    order: {
      defaultVariantAmount: 100,
      variantLegend: 'Valitse matojen määrä',
      variantSelectorPosition: 'beforeFulfillment',
      variantDescriptionPrefix: 'Voi laskea taloudellesi sopivan matojen määrän',
      variantDescriptionLinkHref: '/matolaskuri',
      variantDescriptionLinkLabel: 'matolaskurilla',
      showWormAmountFinePrint: true,
      getVariantLabel({ amount, priceFormatted }) {
        return `Aloituspakkaus + ${amount} matoa - ${priceFormatted} €`;
      },
      shippingOptions: [
        {
          id: 'posti_noutopiste',
          label: 'Nouto Postista tai automaatista',
          priceSku: 'postage-starterkit-pickup',
          fulfillmentType: 'pickup_point',
          helperTexts: sharedPickupHelperTexts,
        },
        {
          id: 'posti_kotiinkuljetus',
          label: 'Postin kotiinkuljetus sovittuna aikana',
          priceSku: 'postage-starterkit-home',
          fulfillmentType: 'home_delivery',
          helperTexts: sharedHomeDeliveryHelperTexts,
        },
        localPickupOption,
      ],
      shippingHelperTexts: sharedPickupHelperTexts,
      shippingDescription: null,
      submitButtonLabel({ totalFormatted }) {
        return `Lähetä tilaus (${totalFormatted} €)`;
      },
      extraInfoDescription: null,
      summaryDescription: null,
      invoiceTimingByFulfillmentType: {
        pickup_point: 'Lasku lähetetään, kun tilaus on toimitettu Postin kuljetettavaksi',
        home_delivery:
          'Lasku lähetetään, kun tilaus on toimitettu Postin kuljetettavaksi',
        local_pickup: 'Lasku lähetetään, kun olet noutanut tilauksen',
      },
    },
  },
};

export default productCatalogCommerceSource;
