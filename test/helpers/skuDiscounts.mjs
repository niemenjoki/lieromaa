import skuDiscountsSource from '@/lib/commerce/skuDiscountsSource.mjs';

// test/register.mjs removes every configured SKU sale. Tests that need a sale
// install their own here, with dates that match the fixed `now` they pass in.
export function withTemporarySkuDiscounts(discountsBySku, callback) {
  const previous = { ...skuDiscountsSource };

  for (const sku of Object.keys(skuDiscountsSource)) {
    delete skuDiscountsSource[sku];
  }
  Object.assign(skuDiscountsSource, discountsBySku);

  try {
    return callback();
  } finally {
    for (const sku of Object.keys(skuDiscountsSource)) {
      delete skuDiscountsSource[sku];
    }
    Object.assign(skuDiscountsSource, previous);
  }
}

export function createSkuDiscount({
  type = 'percentage',
  value = 10,
  lowestPrice30Days = 1,
  validFrom,
  validUntil,
} = {}) {
  return {
    active: true,
    type,
    value,
    lowestPrice30Days,
    validFrom,
    validUntil,
  };
}
