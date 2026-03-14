import pricingData from '@/data/pricing.json';

const priceMap = pricingData?.prices ?? {};
const productDefinitions = {
  worms: {
    name: 'Kompostimadot',
    variantSkus: ['worms-50', 'worms-100', 'worms-200'],
    shippingSku: 'postage-worms',
  },
  starterKit: {
    name: 'Matokompostorin aloituspakkaus',
    variantSkus: ['starterkit-50', 'starterkit-100', 'starterkit-200'],
    shippingSku: 'postage-starterkit',
  },
};
const pickupOption = {
  id: 'nouto',
  label: 'Nouto Järvenpäästä',
  price: 0,
};

export function getProductPricing(productKey) {
  const product = productDefinitions[productKey];

  if (!product || typeof product !== 'object') {
    throw new Error(`Unknown product pricing key "${productKey}"`);
  }

  return product;
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
