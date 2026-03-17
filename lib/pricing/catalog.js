import pricingData from '@/data/pricing.json';

import { productCatalog, productDefinitions } from '../../data/productCatalog.mjs';

const priceMap = pricingData?.prices ?? {};
const pickupOption = {
  id: 'nouto',
  label: 'Nouto Järvenpäästä',
  price: 0,
};
const defaultOrderConfig = {
  defaultVariantAmount: null,
  variantLegend: 'Valitse määrä',
  variantSelectorPosition: 'beforeFulfillment',
  showWormAmountFinePrint: false,
  shippingHelperTexts: [],
  extraCharges: [],
  submitButtonLabel() {
    return 'Lähetä tilaus';
  },
  confirmationNote: '',
  getVariantLabel({ amount, priceFormatted }) {
    return `${amount} - ${priceFormatted} €`;
  },
};

export function getProductPricing(productKey) {
  const product = productDefinitions[productKey];

  if (!product || typeof product !== 'object') {
    throw new Error(`Unknown product pricing key "${productKey}"`);
  }

  return product;
}

export function getProductOrderConfig(productKey) {
  const product = productCatalog[productKey];

  if (!product || typeof product !== 'object') {
    throw new Error(`Unknown product order key "${productKey}"`);
  }

  return {
    ...defaultOrderConfig,
    ...(product.order ?? {}),
    shippingHelperTexts: product.order?.shippingHelperTexts ?? [],
    extraCharges: product.order?.extraCharges ?? [],
  };
}

export function getPriceForSku(sku) {
  return Number(priceMap[sku]) || 0;
}

export function getProductVariants(productKey) {
  const product = getProductPricing(productKey);

  return product.variantSkus.map((sku) => ({
    sku,
    amount: Number(sku.split('-').pop()) || 0,
    price: getPriceForSku(sku),
  }));
}

export function getProductVariant(productKey, amount) {
  return (
    getProductVariants(productKey).find(
      (variant) => String(variant.amount) === String(amount)
    ) ?? null
  );
}

export function findProductKeyBySku(sku) {
  const plainSku = String(sku || '').trim();
  if (!plainSku) {
    return null;
  }

  return (
    Object.entries(productDefinitions).find(([, product]) =>
      product.variantSkus.includes(plainSku)
    )?.[0] ?? null
  );
}

export function getProductVariantBySku(sku) {
  const productKey = findProductKeyBySku(sku);
  if (!productKey) {
    return null;
  }

  return getProductVariants(productKey).find((variant) => variant.sku === sku) ?? null;
}

export function getProductShippingOptions(productKey) {
  const product = getProductPricing(productKey);

  return [
    {
      id: 'postitus',
      label: 'Posti',
      price: getPriceForSku(product.shippingSku),
    },
    pickupOption,
  ];
}

export function getShippingOption(productKey, optionId) {
  return (
    getProductShippingOptions(productKey).find((option) => option.id === optionId) ?? null
  );
}

export function getProductOfferStats(productKey) {
  const prices = getProductVariants(productKey)
    .map((variant) => Number(variant.price) || 0)
    .sort((a, b) => a - b);

  return {
    lowPrice: prices[0] ?? 0,
    highPrice: prices[prices.length - 1] ?? 0,
    offerCount: prices.length,
  };
}

export function getAllSkus() {
  return Object.keys(priceMap).filter((sku) => typeof sku === 'string' && sku.length > 0);
}

export function formatPrice(value) {
  const numericValue = Number(value) || 0;

  if (numericValue % 1 === 0) {
    return numericValue.toLocaleString('fi-FI');
  }

  return numericValue.toLocaleString('fi-FI', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatSchemaPrice(value) {
  return (Number(value) || 0).toFixed(2);
}
