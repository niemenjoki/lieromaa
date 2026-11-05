import assert from 'node:assert/strict';

import {
  getCartAddOnBySku,
  getCartShippingOption,
  getProductVariantBySku,
} from '@/lib/pricing/catalog';
import { cartAddOnsSource } from '@/lib/products/catalogSources.mjs';

export { getRequiredProductSku } from './productAvailability.mjs';

// Tests that are not about one particular SKU look SKUs and prices up from the
// catalogue, so a new price or package size does not break the build.
export function getRequiredAddOnSku(addOnKey, behavior) {
  const sku = Object.values(cartAddOnsSource).find(
    (addOn) => addOn.key === addOnKey
  )?.sku;

  assert.ok(sku, `${behavior}. No cart add-on "${addOnKey}" is configured.`);

  return sku;
}

export function roundMoney(value) {
  return Number((Number(value) || 0).toFixed(2));
}

export function getVariantPrice(sku, { now } = {}) {
  const variant = getProductVariantBySku(sku, { now });

  assert.ok(variant, `No product variant is configured for "${sku}".`);

  return Number(variant.price) || 0;
}

export function getAddOnPrice(sku) {
  const addOn = getCartAddOnBySku(sku);

  assert.ok(addOn, `No cart add-on is configured for "${sku}".`);

  return Number(addOn.price) || 0;
}

export function getCartShippingPrice(optionId) {
  const option = getCartShippingOption(optionId);

  assert.ok(option, `No cart shipping option "${optionId}" is configured.`);

  return Number(option.price) || 0;
}
