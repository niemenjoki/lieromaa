// Editable per-SKU automatic discounts.
// type: 'percentage' or 'fixed'
// value: discount amount to subtract, stored as a positive number.

const skuDiscounts = {
  'worms-50': {
    active: true,
    type: 'percentage',
    value: 10,
    lowestPrice30Days: 20,
    validUntil: '2026-04-30',
  },
  'worms-100': {
    active: true,
    type: 'percentage',
    value: 10,
    lowestPrice30Days: 30,
    validUntil: '2026-04-30',
  },
  'worms-200': {
    active: true,
    type: 'percentage',
    value: 10,
    lowestPrice30Days: 50,
    validUntil: '2026-04-30',
  },
};

export const codelessSkuDiscounts = skuDiscounts;

export default skuDiscounts;
