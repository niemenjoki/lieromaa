import assert from 'node:assert/strict';

import productAvailabilitySource from '@/lib/commerce/productAvailability.mjs';
import { getProductPricing } from '@/lib/pricing/catalog';

// Tests that use a fixed worm SKU must not depend on what is currently on sale:
// marking a package unavailable from the admin would otherwise break the build.
export const ALL_WORM_SKUS_AVAILABLE = Object.freeze({
  earliestShippingDate: false,
  unavailableSkus: [],
});

export function getRequiredProductSku(productKey, behavior) {
  const product = getProductPricing(productKey);
  const sku = product.variantSkus[0];

  assert.ok(sku, `${behavior}. No SKU is currently configured for "${productKey}".`);

  return sku;
}

function applyTemporaryProductAvailability(productKey, overrides) {
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

  return () => {
    if (hadConfig) {
      productAvailabilitySource[productKey] = previousConfig;
    } else {
      delete productAvailabilitySource[productKey];
    }
  };
}

export function withTemporaryProductAvailability(productKey, overrides, callback) {
  const restore = applyTemporaryProductAvailability(productKey, overrides);

  try {
    return callback();
  } finally {
    restore();
  }
}

export async function withTemporaryProductAvailabilityAsync(
  productKey,
  overrides,
  callback
) {
  const restore = applyTemporaryProductAvailability(productKey, overrides);

  try {
    return await callback();
  } finally {
    restore();
  }
}
