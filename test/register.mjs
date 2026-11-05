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
