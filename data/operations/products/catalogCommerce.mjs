import {
  COMPOST_CHOW_HANDLING_TIME,
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

const wormPackagePricesByWeight = {
  25: 20,
  50: 30,
  75: 40,
  100: 50,
};
const starterKitModelSkus = ['starterkit-1', 'starterkit-2', 'starterkit-3'];
const starterKitExpansionSkus = [
  'starterkit-expansion-1',
  'starterkit-expansion-2',
  'starterkit-expansion-3',
];
const starterKitVariantMetadata = {
  'starterkit-1': {
    amount: 1,
    salesUnit: 'piece',
    itemCount: 1,
    binCount: 1,
    solidBinCount: 1,
    drilledBinCount: 0,
    lidCount: 1,
    includedCoirLiters: 1.5,
    expansionSku: 'starterkit-expansion-1',
  },
  'starterkit-2': {
    amount: 2,
    salesUnit: 'piece',
    itemCount: 2,
    binCount: 2,
    solidBinCount: 1,
    drilledBinCount: 1,
    lidCount: 1,
    includedCoirLiters: 1.5,
    expansionSku: 'starterkit-expansion-2',
  },
  'starterkit-3': {
    amount: 3,
    salesUnit: 'piece',
    itemCount: 3,
    binCount: 3,
    solidBinCount: 1,
    drilledBinCount: 2,
    lidCount: 1,
    includedCoirLiters: 1.5,
    expansionSku: 'starterkit-expansion-3',
  },
  'starterkit-expansion-1': {
    amount: 1,
    salesUnit: 'piece',
    itemCount: 1,
    binCount: 1,
    solidBinCount: 0,
    drilledBinCount: 1,
    lidCount: 1,
    includedCoirLiters: 1.5,
    isExpansion: true,
    baseSku: 'starterkit-1',
    hideFromVariantSelector: true,
    hideFromPublicOffers: true,
    hideFromMerchantFeed: true,
  },
  'starterkit-expansion-2': {
    amount: 2,
    salesUnit: 'piece',
    itemCount: 2,
    binCount: 2,
    solidBinCount: 0,
    drilledBinCount: 2,
    lidCount: 1,
    includedCoirLiters: 1.5,
    isExpansion: true,
    baseSku: 'starterkit-2',
    hideFromVariantSelector: true,
    hideFromPublicOffers: true,
    hideFromMerchantFeed: true,
  },
  'starterkit-expansion-3': {
    amount: 3,
    salesUnit: 'piece',
    itemCount: 3,
    binCount: 3,
    solidBinCount: 0,
    drilledBinCount: 3,
    lidCount: 1,
    includedCoirLiters: 1.5,
    isExpansion: true,
    baseSku: 'starterkit-3',
    hideFromVariantSelector: true,
    hideFromPublicOffers: true,
    hideFromMerchantFeed: true,
  },
};

const legacyStarterKitVariants = [
  {
    sku: 'starterkit-base',
    amount: 1,
    salesUnit: 'piece',
    itemCount: 1,
    price: 46,
  },
  ...Object.entries(wormVariantMetadata).map(([, variant]) => ({
    sku: `starterkit-${variant.weightGrams}`,
    amount: variant.amount,
    salesUnit: 'weight',
    weightGrams: variant.weightGrams,
    estimatedWormCount: variant.estimatedWormCount,
    price: 46 + wormPackagePricesByWeight[variant.weightGrams],
  })),
  {
    sku: 'starterkit-50',
    amount: 50,
    salesUnit: 'worm_count',
    estimatedWormCount: 50,
    price: 64,
  },
  {
    sku: 'starterkit-100',
    amount: 100,
    salesUnit: 'worm_count',
    estimatedWormCount: 100,
    price: 73,
  },
  {
    sku: 'starterkit-200',
    amount: 200,
    salesUnit: 'worm_count',
    estimatedWormCount: 200,
    price: 91,
  },
];

function formatStarterKitBoxCount(count) {
  return count === 1 ? '1 laatikko' : `${count} laatikkoa`;
}

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
  starterKit: {
    variantSkus: [...starterKitModelSkus, ...starterKitExpansionSkus],
    variantMetadata: starterKitVariantMetadata,
    legacyVariants: legacyStarterKitVariants,
    shippingSku: 'postage-pickup',
    schema: {
      handlingTime: STARTER_KIT_HANDLING_TIME,
    },
    order: {
      defaultVariantAmount: 1,
      variantLegend: 'Valitse laatikoiden määrä',
      variantSelectorPosition: 'beforeFulfillment',
      variantDescription:
        'Voit aloittaa pienellä mallilla ja laajentaa samaa kompostoria myöhemmin.',
      showWormAmountFinePrint: false,
      getVariantLabel({ amount, priceFormatted, variant }) {
        const boxCount = variant?.binCount ?? variant?.itemCount ?? amount;
        return `${formatStarterKitBoxCount(boxCount)} - ${priceFormatted} €`;
      },
      expansionOption: {
        checkboxLabel:
          'Käytän laatikot lisäkerroksina nykyiseen Lieromaan matokompostoriin',
        helperText:
          'Valitse tämä, jos sinulla on jo Lieromaan pohjalaatikko. Tällöin kaikki tilauksen laatikot toimitetaan rei’itettyinä lisäkerroksina. Mukana tulee yksi kansi ja kookoskuitua uuden kerroksen käynnistämiseen.',
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
