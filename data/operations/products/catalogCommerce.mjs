import {
  COMPOST_CHOW_HANDLING_TIME,
  PREPARED_WORM_BIN_SHIPPING_KEY,
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

export const cartShippingOptionsSource = [
  {
    id: 'posti_noutopiste',
    label: 'Nouto Postista tai automaatista',
    priceSku: 'postage-pickup',
    fulfillmentType: 'pickup_point',
    helperTexts: sharedPickupHelperTexts,
  },
  {
    id: 'posti_kotiinkuljetus',
    label: 'Postin kotiinkuljetus sovittuna aikana',
    priceSku: 'postage-home',
    fulfillmentType: 'home_delivery',
    helperTexts: sharedHomeDeliveryHelperTexts,
  },
  {
    id: 'nouto',
    label: 'Nouto Järvenpäästä',
    price: 0,
    fulfillmentType: 'local_pickup',
    helperTexts: sharedLocalPickupHelperTexts,
  },
];

const frostProtectionExtraCharge = {
  key: 'frostProtection',
  fieldName: 'pakkastoimituslisa',
  checkedValue: 'maksan',
  label: 'Pakkastoimituslisä',
  checkboxLabel: 'Maksan pakkastoimituslisän',
  price: 3,
  activeMonths: [9, 10, 11, 12, 1, 2, 3, 4],
  descriptionLines: [
    'Kun ulkolämpötila on alle -5 C, matojen toimittaminen vaatii ylimääräistä pakkausmateriaalia matojen pitämiseksi elossa. Pakkastilanne määritetään alimmasta lämpötilaennusteesta matojen lähtöpaikan (Järvenpää) ja toimitusosoitteen perusteella.',
  ],
  helperTextLines: [
    'Voit tehdä tilauksen myös ilman pakkaslisää, vaikka ulkona olisi pakkasta, jolloin paketti toimitetaan pikimmiten sään lämmettyä.',
  ],
};

const wormVariantMetadata = {
  'worms-25': {
    amount: 25,
    salesUnit: 'weight',
    weightGrams: 25,
    estimatedWormCount: 50,
  },
  'worms-50': {
    amount: 50,
    salesUnit: 'weight',
    weightGrams: 50,
    estimatedWormCount: 100,
  },
  'worms-75': {
    amount: 75,
    salesUnit: 'weight',
    weightGrams: 75,
    estimatedWormCount: 150,
  },
  'worms-100': {
    amount: 100,
    salesUnit: 'weight',
    weightGrams: 100,
    estimatedWormCount: 200,
  },
};

const legacyWormVariants = [
  {
    sku: 'worms-50',
    amount: 50,
    salesUnit: 'worm_count',
    estimatedWormCount: 50,
    price: 20,
  },
  {
    sku: 'worms-100',
    amount: 100,
    salesUnit: 'worm_count',
    estimatedWormCount: 100,
    price: 30,
  },
  {
    sku: 'worms-200',
    amount: 200,
    salesUnit: 'worm_count',
    estimatedWormCount: 200,
    price: 50,
  },
];

export const cartAddOnsSource = {
  'worms-ready-bin-14l': {
    key: 'preparedWormBin',
    sku: 'worms-ready-bin-14l',
    parentProductKey: 'worms',
    name: 'Käyttövalmis 14 litran matokompostori',
    label: 'Käyttövalmis 14 litran matokompostori',
    priceSku: 'worms-ready-bin-14l',
    maxQuantity: 1,
    fixedQuantity: true,
    shippingScheduleKey: PREPARED_WORM_BIN_SHIPPING_KEY,
    image: {
      src: '/images/content/kompostori_avattuna.avif',
      alt: 'Avattu 14 litran matokompostori, jossa on valmiiksi kostutettu petimateriaali',
      width: 1200,
      height: 900,
    },
  },
};

export const productCatalogCommerceSource = {
  worms: {
    variantSkus: ['worms-25', 'worms-50', 'worms-75', 'worms-100'],
    variantMetadata: wormVariantMetadata,
    legacyVariants: legacyWormVariants,
    shippingSku: 'postage-pickup',
    schema: {
      handlingTime: WORMS_HANDLING_TIME,
    },
    order: {
      defaultVariantAmount: 50,
      variantLegend: 'Valitse matojen paino',
      variantSelectorPosition: 'beforeFulfillment',
      variantDescriptionPrefix: 'Voit arvioida taloudellesi sopivan aloitusmäärän',
      variantDescriptionLinkHref: '/matolaskuri',
      variantDescriptionLinkLabel: 'matolaskurilla',
      showWormAmountFinePrint: true,
      getVariantLabel({ amount, priceFormatted, variant }) {
        const weight = variant?.weightGrams ?? amount;
        const estimatedWormCount = variant?.estimatedWormCount;
        const estimateText = estimatedWormCount
          ? ` (noin ${estimatedWormCount} matoa)`
          : '';

        return `${weight} g${estimateText} - ${priceFormatted} €`;
      },
      shippingOptions: [...cartShippingOptionsSource],
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
      extraCharges: [frostProtectionExtraCharge],
    },
  },
  compostChow: {
    variantSkus: ['chow-150', 'chow-500'],
    variantMetadata: {
      'chow-150': {
        amount: 150,
        salesUnit: 'weight',
        weightGrams: 150,
      },
      'chow-500': {
        amount: 500,
        salesUnit: 'weight',
        weightGrams: 500,
      },
    },
    shippingSku: 'postage-pickup',
    schema: {
      handlingTime: COMPOST_CHOW_HANDLING_TIME,
    },
    order: {
      defaultVariantAmount: 150,
      variantLegend: 'Pakkauskoko',
      variantSelectorPosition: 'beforeFulfillment',
      variantDescription: 'Valitse käyttömäärään sopiva pakkauskoko.',
      getVariantLabel({ amount, priceFormatted, variant }) {
        const weight = variant?.weightGrams ?? amount;
        return `${weight} g - ${priceFormatted} €`;
      },
      shippingOptions: [...cartShippingOptionsSource],
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
      extraCharges: [],
    },
  },
};

export default productCatalogCommerceSource;
