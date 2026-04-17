import {
  findProductKeyBySku,
  getAvailableProductVariants,
  getProductOrderConfig,
  getProductShippingOptions,
  getProductVariantBySku,
  getShippingOption,
} from '@/lib/pricing/catalog';
import { getProductCatalogEntry, productDefinitions } from '@/lib/products/catalog.mjs';

function getFulfillmentType(option) {
  return option?.fulfillmentType || 'local_pickup';
}

export function listOrderScenarios() {
  return Object.keys(productDefinitions).flatMap((productKey) => {
    const product = getProductCatalogEntry(productKey);
    const variant = getAvailableProductVariants(productKey)[0] ?? null;
    const orderConfig = getProductOrderConfig(productKey);

    return getProductShippingOptions(productKey)
      .filter(Boolean)
      .map((shippingOption) => ({
        productKey,
        product,
        variant,
        shippingOption,
        orderConfig,
        fulfillmentType: getFulfillmentType(shippingOption),
      }))
      .filter((scenario) => scenario.variant);
  });
}

export function findOrderScenario({ productKey, fulfillmentType } = {}) {
  return (
    listOrderScenarios().find((scenario) => {
      if (productKey && scenario.productKey !== productKey) {
        return false;
      }

      if (fulfillmentType && scenario.fulfillmentType !== fulfillmentType) {
        return false;
      }

      return true;
    }) ?? null
  );
}

export function getFallbackFormScenario(overrides = {}) {
  const overrideSku = String(overrides.sku ?? '').trim();
  const resolvedProductKey = overrideSku ? findProductKeyBySku(overrideSku) : '';
  const overrideProductKey = String(overrides.tuote_avain ?? '').trim();
  const preferredProductKey =
    resolvedProductKey ||
    (productDefinitions[overrideProductKey] ? overrideProductKey : '') ||
    '';
  const fallbackScenario =
    (preferredProductKey ? findOrderScenario({ productKey: preferredProductKey }) : null) ??
    listOrderScenarios()[0] ??
    null;
  const productKey =
    fallbackScenario?.productKey ||
    preferredProductKey ||
    Object.keys(productDefinitions)[0] ||
    '';
  const product = productKey ? getProductCatalogEntry(productKey) : null;
  const variant =
    (overrideSku ? getProductVariantBySku(overrideSku) : null) ??
    (productKey ? getAvailableProductVariants(productKey)[0] ?? null : null);
  const overrideShippingMethod = String(overrides.toimitus ?? '').trim();
  const shippingOption =
    (productKey && overrideShippingMethod
      ? getShippingOption(productKey, overrideShippingMethod)
      : null) ??
    (productKey ? getProductShippingOptions(productKey)[0] ?? null : null);

  return {
    productKey,
    product,
    variant,
    shippingOption,
    fulfillmentType: getFulfillmentType(shippingOption),
  };
}

function isChargeActive(charge, now) {
  const activeMonths = Array.isArray(charge?.activeMonths) ? charge.activeMonths : [];
  if (!activeMonths.length) {
    return true;
  }

  return activeMonths.includes(now.getMonth() + 1);
}

export function getDateForChargeActivity(charge, { active } = {}) {
  const activeMonths = Array.isArray(charge?.activeMonths)
    ? [...new Set(charge.activeMonths.map(Number).filter(Number.isInteger))]
    : [];

  if (!activeMonths.length) {
    return new Date('2026-06-15T10:00:00Z');
  }

  if (active) {
    return new Date(Date.UTC(2026, activeMonths[0] - 1, 15, 10, 0, 0));
  }

  const inactiveMonth = Array.from({ length: 12 }, (_, index) => index + 1).find(
    (month) => !activeMonths.includes(month)
  );

  return inactiveMonth
    ? new Date(Date.UTC(2026, inactiveMonth - 1, 15, 10, 0, 0))
    : null;
}

export function buildExpectedQuoteFromSource({
  productKey,
  sku,
  shippingMethod,
  selectedExtraCharges = {},
  now = new Date(),
}) {
  const variant = getProductVariantBySku(sku);
  const shippingOption = getShippingOption(productKey, shippingMethod);
  const orderConfig = getProductOrderConfig(productKey);
  const itemPrice = Number(variant?.price) || 0;
  const shippingPrice = Number(shippingOption?.price) || 0;
  const extraCharges = orderConfig.extraCharges.map((charge) => {
    const chargeActive = isChargeActive(charge, now);
    const chargeSelected = Boolean(selectedExtraCharges[charge.fieldName]);
    const price = Number(charge.price) || 0;

    return {
      ...charge,
      active: chargeActive,
      selected: chargeSelected,
      appliedPrice: chargeActive && chargeSelected ? price : 0,
    };
  });
  const extraChargeTotal = Number(
    extraCharges.reduce((sum, charge) => sum + charge.appliedPrice, 0).toFixed(2)
  );

  return {
    variant,
    shippingOption,
    orderConfig,
    itemPrice,
    shippingPrice,
    extraCharges,
    extraChargeTotal,
    total: Number((itemPrice + shippingPrice + extraChargeTotal).toFixed(2)),
  };
}
