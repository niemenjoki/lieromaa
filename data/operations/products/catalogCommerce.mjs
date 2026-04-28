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

const orderUpsellExtraCharges = [
  {
    key: 'compostFood',
    section: 'upsell',
    fieldName: 'kompostiruoka_lisatilaus',
    label: 'Lieromaan kompostiruoka 150g',
    checkboxLabel: 'Lisää Lieromaan kompostiruoka 150g',
    price: 3,
    descriptionLines: [
      'Viljapohjainen lisäruoka matokompostiin. Helpottaa kompostin ylläpitoa ja tasaa toimintaa, kun biojätteen määrä vaihtelee.',
    ],
    helperTextLines: ['Annostelu: n. 1 tl / 5-10 L kompostia, 1-2 kertaa viikossa.'],
  },
  {
    key: 'compostBalancer',
    section: 'upsell',
    fieldName: 'tasapainottaja_lisatilaus',
    label: 'Lieromaan kompostin tasapainottaja 50g',
    checkboxLabel: 'Lisää Lieromaan kompostin tasapainottaja 50g',
    price: 2,
    descriptionLines: [
      'Kalsiumkarbonaattipohjainen jauhe, joka vähentää kompostin happamuutta. Ehkäisee hajuhaittoja ja parantaa olosuhteita madoille.',
    ],
    helperTextLines: [
      'Annostelu: n. 1 tl / 5-10 L kompostia 2-3 viikon välein tai tarpeen mukaan.',
    ],
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

const localPickupOption = {
  id: 'nouto',
  label: 'Nouto Järvenpäästä',
  price: 0,
  fulfillmentType: 'local_pickup',
  helperTexts: sharedLocalPickupHelperTexts,
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

const starterKitBasePrice = 46;
const wormPackagePricesByWeight = {
  25: 20,
  50: 30,
  75: 40,
  100: 50,
};
const starterKitVariantMetadata = Object.fromEntries(
  Object.entries(wormVariantMetadata).map(([wormSku, variant]) => {
    const weight = variant.weightGrams;

    return [
      `starterkit-${weight}`,
      {
        ...variant,
        price: starterKitBasePrice + wormPackagePricesByWeight[weight],
      },
    ];
  })
);

const legacyStarterKitVariants = [
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

export const productCatalogCommerceSource = {
  worms: {
    variantSkus: ['worms-25', 'worms-50', 'worms-75', 'worms-100'],
    variantMetadata: wormVariantMetadata,
    legacyVariants: legacyWormVariants,
    shippingSku: 'postage-worms-pickup',
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
      extraCharges: [frostProtectionExtraCharge, ...orderUpsellExtraCharges],
    },
  },
  starterKit: {
    variantSkus: ['starterkit-25', 'starterkit-50', 'starterkit-75', 'starterkit-100'],
    variantMetadata: starterKitVariantMetadata,
    legacyVariants: legacyStarterKitVariants,
    shippingSku: 'postage-starterkit-pickup',
    schema: {
      handlingTime: STARTER_KIT_HANDLING_TIME,
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

        return `Aloituspakkaus + ${weight} g matoja${estimateText} - ${priceFormatted} €`;
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
      extraCharges: orderUpsellExtraCharges,
    },
  },
};

export default productCatalogCommerceSource;
