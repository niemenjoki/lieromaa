import { register } from 'node:module';

register('./loader.mjs', import.meta.url);

// The owner marks packages unavailable from the admin, and that change is pushed
// straight to master. Tests must not depend on what is on sale at the moment, so
// every product starts as available. Tests that check unavailability set it
// themselves with test/helpers/productAvailability.mjs.
const { default: productAvailabilitySource } = await import(
  '../data/operations/commerce/productAvailability.json',
  { with: { type: 'json' } }
);

for (const productKey of Object.keys(productAvailabilitySource)) {
  productAvailabilitySource[productKey] = {
    ...productAvailabilitySource[productKey],
    earliestShippingDate: false,
    unavailableSkus: [],
  };
}

// The owner schedules SKU sales from the admin as well, and a sale that is on
// today changes every price the tests see. Tests start with no SKU sale at all;
// sale pricing is tested with test/helpers/skuDiscounts.mjs and a fixed date.
const { default: skuDiscountsSource } = await import(
  '../data/operations/commerce/skuDiscounts.json',
  { with: { type: 'json' } }
);

for (const sku of Object.keys(skuDiscountsSource)) {
  delete skuDiscountsSource[sku];
}

// Tests must never reach the order service, Stripe (through the order service),
// Posti or Looku, even when the build environment has real credentials. The
// variables are removed and every fetch that a test has not replaced fails.
const EXTERNAL_SERVICE_ENV_PREFIXES = ['ORDER_SERVICE_', 'STRIPE_', 'POSTI_', 'LOOKU_'];

for (const key of Object.keys(process.env)) {
  if (EXTERNAL_SERVICE_ENV_PREFIXES.some((prefix) => key.startsWith(prefix))) {
    delete process.env[key];
  }
}

globalThis.fetch = async function blockedFetch(input) {
  const url = typeof input === 'string' ? input : (input?.url ?? String(input));
  throw new Error(`unexpected network call in tests: ${url}`);
};
