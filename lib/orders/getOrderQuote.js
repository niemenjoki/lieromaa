import {
  findProductKeyBySku,
  getProductOrderConfig,
  getProductVariantBySku,
  getShippingOption,
} from '@/lib/pricing/catalog';

function isChargeActive(charge, now) {
  const activeMonths = Array.isArray(charge?.activeMonths) ? charge.activeMonths : [];
  if (!activeMonths.length) {
    return true;
  }

  const month = now.getMonth() + 1;
  return activeMonths.includes(month);
}

export function calculateDiscountAmounts(itemPrice, shippingPrice, discount) {
  if (!discount) {
    return {
      productAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
    };
  }

  const productAmount =
    discount.type === 'percentage'
      ? Number(((itemPrice * discount.value) / 100).toFixed(2))
      : discount.type === 'fixed'
        ? Math.min(itemPrice, discount.value)
        : 0;

  const shippingAmount = discount.type === 'free_shipping' ? shippingPrice : 0;

  return {
    productAmount,
    shippingAmount,
    totalAmount: Number((productAmount + shippingAmount).toFixed(2)),
  };
}

export function getOrderQuote({
  productKey,
  sku,
  shippingMethod,
  discount = null,
  selectedExtraCharges = {},
  now = new Date(),
}) {
  const resolvedProductKey = findProductKeyBySku(sku);
  if (!resolvedProductKey || resolvedProductKey !== productKey) {
    throw new Error(`SKU "${sku}" does not belong to product "${productKey}".`);
  }

  const variant = getProductVariantBySku(sku);
  if (!variant) {
    throw new Error(`Unknown SKU "${sku}".`);
  }

  const shippingOption = getShippingOption(productKey, shippingMethod);
  if (!shippingOption) {
    throw new Error(`Unknown shipping option "${shippingMethod}" for "${productKey}".`);
  }

  const orderConfig = getProductOrderConfig(productKey);
  const itemPrice = Number(variant.price) || 0;
  const shippingPrice = Number(shippingOption.price) || 0;
  const extraCharges = orderConfig.extraCharges.map((charge) => {
    const active = isChargeActive(charge, now);
    const selected = Boolean(selectedExtraCharges[charge.fieldName]);
    const price = Number(charge.price) || 0;

    return {
      ...charge,
      active,
      selected,
      appliedPrice: active && selected ? price : 0,
    };
  });
  const extraChargeTotal = Number(
    extraCharges.reduce((sum, charge) => sum + charge.appliedPrice, 0).toFixed(2)
  );
  const discountAmounts = calculateDiscountAmounts(itemPrice, shippingPrice, discount);
  const total = Number(
    (itemPrice + shippingPrice + extraChargeTotal - discountAmounts.totalAmount).toFixed(
      2
    )
  );

  return {
    variant,
    shippingOption,
    orderConfig,
    itemPrice,
    shippingPrice,
    extraCharges,
    extraChargeTotal,
    discountAmounts,
    total,
  };
}
