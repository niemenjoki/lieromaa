import {
  COMPOST_CHOW_HANDLING_TIME,
  PREPARED_WORM_BIN_SHIPPING_KEY,
  WORMS_HANDLING_TIME,
} from '../commerce/shippingSchedule.mjs';

export const cartShippingOptionsSource = [
  {
    id: 'posti_noutopiste',
    copyKey: 'postiPickup',
    priceSku: 'postage-pickup',
    fulfillmentType: 'pickup_point',
  },
  {
    id: 'posti_kotiinkuljetus',
    copyKey: 'postiHome',
    priceSku: 'postage-home',
    fulfillmentType: 'home_delivery',
  },
  {
    id: 'nouto',
    copyKey: 'localPickup',
    price: 0,
    fulfillmentType: 'local_pickup',
  },
];

const frostProtectionExtraCharge = {
  key: 'frostProtection',
  copyKey: 'frostProtection',
  fieldName: 'pakkastoimituslisa',
  checkedValue: 'maksan',
  price: 3,
  activeMonths: [9, 10, 11, 12, 1, 2, 3, 4],
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
    copyKey: 'preparedWormBin',
    sku: 'worms-ready-bin-14l',
    parentProductKey: 'worms',
    priceSku: 'worms-ready-bin-14l',
    maxQuantity: 1,
    fixedQuantity: true,
    shippingScheduleKey: PREPARED_WORM_BIN_SHIPPING_KEY,
    image: {
      src: '/images/content/kompostori_avattuna.avif',
      altKey: 'imageAlt',
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
      copyKey: 'worms',
      defaultVariantAmount: 50,
      variantSelectorPosition: 'beforeFulfillment',
      variantDescriptionLinkPageKey: 'wormCalculator',
      showWormAmountFinePrint: true,
      shippingOptions: [...cartShippingOptionsSource],
      shippingHelperTextKey: 'postiPickup',
      shippingDescription: null,
      extraInfoDescription: null,
      summaryDescription: null,
      invoiceTimingKeysByFulfillmentType: {
        pickup_point: 'postal',
        local_pickup: 'localPickup',
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
      copyKey: 'compostChow',
      defaultVariantAmount: 150,
      variantSelectorPosition: 'beforeFulfillment',
      shippingOptions: [...cartShippingOptionsSource],
      shippingHelperTextKey: 'postiPickup',
      shippingDescription: null,
      extraInfoDescription: null,
      summaryDescription: null,
      invoiceTimingKeysByFulfillmentType: {
        pickup_point: 'postal',
        home_delivery: 'postal',
        local_pickup: 'localPickup',
      },
      extraCharges: [],
    },
  },
};

export default productCatalogCommerceSource;
