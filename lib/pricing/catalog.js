import pricingData from '@/lib/commerce/pricingData';
import { getProductAvailabilityConfig } from '@/lib/commerce/productAvailability.mjs';
import { cartShippingOptionsSource } from '@/lib/products/catalogSources.mjs';

import { productCatalog, productDefinitions } from '../products/catalog.mjs';
import { getActiveSkuDiscount } from './skuDiscounts.mjs';

const priceMap = pricingData?.prices ?? {};
const defaultOrderConfig = {
  defaultVariantAmount: null,
  variantLegend: 'Valitse määrä',
  variantSelectorPosition: 'beforeFulfillment',
  showWormAmountFinePrint: false,
  shippingHelperTexts: [],
  extraCharges: [],
  submitButtonLabel() {
    return 'Lähetä sitova tilaus';
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

export function getProductAvailability(productKey) {
  const product = getProductPricing(productKey);
  const configuredAvailability = getProductAvailabilityConfig(productKey);
  const productSkus = new Set(product.variantSkus);
  const unavailableSkus = configuredAvailability.unavailableSkus.filter((sku) =>
    productSkus.has(sku)
  );

  return {
    earliestShippingDate: configuredAvailability.earliestShippingDate,
    unavailableSkus,
    hasLimitedAvailability: configuredAvailability.hasLimitedAvailability,
  };
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
  return getSkuPriceDetails(sku).price;
}

export function getBasePriceForSku(sku) {
  return Number(priceMap[sku]) || 0;
}

export function getSkuPriceDetails(
  sku,
  { basePrice: basePriceOverride, applyDiscount = true } = {}
) {
  const basePrice =
    basePriceOverride === undefined
      ? getBasePriceForSku(sku)
      : Number(basePriceOverride) || 0;
  const discount = applyDiscount ? getActiveSkuDiscount({ sku, basePrice }) : null;

  return {
    basePrice,
    price: discount?.discountedPrice ?? basePrice,
    discount,
  };
}

function getVariantMetadata(product, sku) {
  const metadata = product.variantMetadata?.[sku];
  return metadata && typeof metadata === 'object' ? metadata : {};
}

function getLegacyVariantMetadata(product, sku, { salesUnit = null } = {}) {
  const variants = Array.isArray(product.legacyVariants) ? product.legacyVariants : [];
  const normalizedSalesUnit =
    typeof salesUnit === 'string' && salesUnit.trim() ? salesUnit.trim() : null;

  if (normalizedSalesUnit) {
    const salesUnitMatch = variants.find(
      (variant) => variant?.sku === sku && variant?.salesUnit === normalizedSalesUnit
    );

    if (salesUnitMatch) {
      return salesUnitMatch;
    }
  }

  return variants.find((variant) => variant?.sku === sku) ?? null;
}

function getVariantAvailabilityStatus({ isAvailable, earliestShippingDate }) {
  if (!isAvailable) {
    return 'unavailable';
  }

  return earliestShippingDate ? 'limited' : 'available';
}

export function getProductVariants(productKey, { includeUnavailable = true } = {}) {
  const product = getProductPricing(productKey);
  const productAvailability = getProductAvailability(productKey);
  const unavailableSkuSet = new Set(productAvailability.unavailableSkus);

  const variants = product.variantSkus.map((sku) => {
    const metadata = getVariantMetadata(product, sku);
    const isAvailable = !unavailableSkuSet.has(sku);
    const { basePrice, price, discount } = getSkuPriceDetails(sku, {
      basePrice: metadata.price,
    });
    const amount = Number(metadata.amount ?? sku.split('-').pop()) || 0;

    return {
      sku,
      amount,
      salesUnit: metadata.salesUnit ?? null,
      weightGrams:
        metadata.weightGrams === undefined ? null : Number(metadata.weightGrams) || 0,
      estimatedWormCount:
        metadata.estimatedWormCount === undefined
          ? null
          : Number(metadata.estimatedWormCount) || 0,
      itemCount:
        metadata.itemCount === undefined ? null : Number(metadata.itemCount) || 0,
      basePrice,
      price,
      discount,
      isAvailable,
      isLegacy: false,
      availabilityStatus: getVariantAvailabilityStatus({
        isAvailable,
        earliestShippingDate: productAvailability.earliestShippingDate,
      }),
      earliestShippingDate: isAvailable
        ? productAvailability.earliestShippingDate
        : false,
    };
  });

  return includeUnavailable
    ? variants
    : variants.filter((variant) => variant.isAvailable);
}

export function getAvailableProductVariants(productKey) {
  return getProductVariants(productKey, { includeUnavailable: false });
}

function createLegacyProductVariant(productKey, sku, options = {}) {
  const product = getProductPricing(productKey);
  const metadata = getLegacyVariantMetadata(product, sku, options);
  if (!metadata) {
    return null;
  }

  const amount = Number(metadata.amount ?? sku.split('-').pop()) || 0;
  const { basePrice, price, discount } = getSkuPriceDetails(sku, {
    basePrice: metadata.price,
    applyDiscount: false,
  });

  return {
    sku,
    amount,
    salesUnit: metadata.salesUnit ?? 'worm_count',
    weightGrams:
      metadata.weightGrams === undefined ? null : Number(metadata.weightGrams) || 0,
    estimatedWormCount:
      metadata.estimatedWormCount === undefined
        ? amount
        : Number(metadata.estimatedWormCount) || 0,
    itemCount: metadata.itemCount === undefined ? null : Number(metadata.itemCount) || 0,
    basePrice,
    price,
    discount,
    isAvailable: true,
    isLegacy: true,
    availabilityStatus: 'available',
    earliestShippingDate: false,
  };
}

export function getProductVariant(productKey, amount, options) {
  return (
    getProductVariants(productKey, options).find(
      (variant) => String(variant.amount) === String(amount)
    ) ?? null
  );
}

export function findProductKeyBySku(sku, { includeLegacy = false } = {}) {
  const plainSku = String(sku || '').trim();
  if (!plainSku) {
    return null;
  }

  return (
    Object.entries(productDefinitions).find(([, product]) => {
      if (product.variantSkus.includes(plainSku)) {
        return true;
      }

      return includeLegacy && Boolean(getLegacyVariantMetadata(product, plainSku));
    })?.[0] ?? null
  );
}

export function getProductVariantBySku(sku, { legacy = false, salesUnit = null } = {}) {
  const productKey = findProductKeyBySku(sku, { includeLegacy: legacy });
  if (!productKey) {
    return null;
  }

  if (legacy) {
    const legacyVariant = createLegacyProductVariant(productKey, sku, { salesUnit });
    if (legacyVariant) {
      return legacyVariant;
    }
  }

  return getProductVariants(productKey).find((variant) => variant.sku === sku) ?? null;
}

export function getLegacyProductVariantBySku(sku, options = {}) {
  const productKey = findProductKeyBySku(sku, { includeLegacy: true });
  return productKey ? createLegacyProductVariant(productKey, sku, options) : null;
}

export function isSkuAvailable(sku) {
  return Boolean(getProductVariantBySku(sku)?.isAvailable);
}

function resolveShippingOptionPrices(configuredOptions) {
  if (configuredOptions.length > 0) {
    return configuredOptions.map((option) => ({
      ...option,
      price:
        option.price !== undefined
          ? Number(option.price) || 0
          : option.priceSku
            ? getPriceForSku(option.priceSku)
            : 0,
    }));
  }

  return [];
}

export function getProductShippingOptions(productKey) {
  const product = getProductPricing(productKey);
  const configuredOptions = Array.isArray(product.shippingOptions)
    ? product.shippingOptions
    : [];

  return resolveShippingOptionPrices(configuredOptions);
}

export function getCartShippingOptions() {
  return resolveShippingOptionPrices(
    Array.isArray(cartShippingOptionsSource) ? cartShippingOptionsSource : []
  );
}

export function getCartShippingOption(optionId) {
  return getCartShippingOptions().find((option) => option.id === optionId) ?? null;
}

export function getShippingOption(productKey, optionId) {
  return (
    getProductShippingOptions(productKey).find((option) => option.id === optionId) ?? null
  );
}

export function getDefaultShippingOption(productKey) {
  return getProductShippingOptions(productKey)[0] ?? null;
}

export function getProductOfferStats(productKey, { includeUnavailable = false } = {}) {
  const prices = getProductVariants(productKey, { includeUnavailable })
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
