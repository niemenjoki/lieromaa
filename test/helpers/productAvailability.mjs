import assert from 'node:assert/strict';

import productAvailabilitySource from '@/lib/commerce/productAvailability.mjs';
import { getProductPricing } from '@/lib/pricing/catalog';

export function getRequiredProductSku(productKey, behavior) {
  const product = getProductPricing(productKey);
  const sku = product.variantSkus[0];

  assert.ok(sku, `${behavior}. No SKU is currently configured for "${productKey}".`);

  return sku;
}

export function withTemporaryProductAvailability(productKey, overrides, callback) {
  const hadConfig = Object.prototype.hasOwnProperty.call(
    productAvailabilitySource,
    productKey
  );
  const previousConfig = hadConfig ? productAvailabilitySource[productKey] : undefined;
  const baseConfig =
    previousConfig && typeof previousConfig === 'object' ? previousConfig : {};

  productAvailabilitySource[productKey] = {
    earliestShippingDate: false,
    unavailableSkus: [],
    ...baseConfig,
    ...overrides,
    unavailableSkus: Array.isArray(overrides?.unavailableSkus)
      ? [...overrides.unavailableSkus]
      : Array.isArray(baseConfig.unavailableSkus)
        ? [...baseConfig.unavailableSkus]
        : [],
  };

  try {
    return callback();
  } finally {
    if (hadConfig) {
      productAvailabilitySource[productKey] = previousConfig;
    } else {
      delete productAvailabilitySource[productKey];
    }
  }
}
