// Editable per-SKU automatic discounts.
// type: 'percentage' or 'fixed'
// value: discount amount to subtract, stored as a positive number.

const skuDiscounts = {
  'worms-25': {
    active: true,
    type: 'percentage',
    value: 10,
    lowestPrice30Days: 18,
    validUntil: '2026-04-30',
  },
  'worms-50': {
    active: true,
    type: 'percentage',
    value: 10,
    lowestPrice30Days: 27,
    validUntil: '2026-04-30',
  },
  'worms-75': {
    active: true,
    type: 'percentage',
    value: 10,
    lowestPrice30Days: 36,
    validUntil: '2026-04-30',
  },
  'worms-100': {
    active: true,
    type: 'percentage',
    value: 10,
    lowestPrice30Days: 45,
    validUntil: '2026-04-30',
  },
};

export const codelessSkuDiscounts = skuDiscounts;

export default skuDiscounts;
