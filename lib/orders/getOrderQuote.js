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

function roundMoney(value) {
  return Number((Number(value) || 0).toFixed(2));
}

function calculateDiscountForAmount(amount, discount) {
  const discountableAmount = roundMoney(amount);
  if (!discount || discountableAmount <= 0) {
    return 0;
  }

  if (discount.type === 'percentage') {
    return roundMoney((discountableAmount * discount.value) / 100);
  }

  if (discount.type === 'fixed') {
    return roundMoney(Math.min(discountableAmount, Number(discount.value) || 0));
  }

  return 0;
}

export function getDiscountExtraChargeKeys(discount) {
  return [
    ...new Set(
      (Array.isArray(discount?.appliesToExtraChargeKeys)
        ? discount.appliesToExtraChargeKeys
        : []
      )
        .map((key) => String(key).trim())
        .filter(Boolean)
    ),
  ];
}

function getDiscountableExtraChargeTotal(extraCharges, discount) {
  const targetKeys = new Set(getDiscountExtraChargeKeys(discount));
  if (!targetKeys.size) {
    return 0;
  }

  return roundMoney(
    extraCharges.reduce((sum, charge) => {
      if (!targetKeys.has(charge.key) || !charge.active || !charge.selected) {
        return sum;
      }

      return sum + (Number(charge.appliedPrice) || 0);
    }, 0)
  );
}

export function calculateDiscountAmounts(
  itemPrice,
  shippingPrice,
  discount,
  extraCharges = []
) {
  if (!discount) {
    return {
      productAmount: 0,
      extraChargeAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
    };
  }

  const appliesToExtraCharges = getDiscountExtraChargeKeys(discount).length > 0;
  const extraChargeAmount = appliesToExtraCharges
    ? calculateDiscountForAmount(
        getDiscountableExtraChargeTotal(extraCharges, discount),
        discount
      )
    : 0;
  const productAmount = appliesToExtraCharges
    ? 0
    : calculateDiscountForAmount(itemPrice, discount);

  const shippingAmount =
    !appliesToExtraCharges && discount.type === 'free_shipping' ? shippingPrice : 0;

  return {
    productAmount,
    extraChargeAmount,
    shippingAmount,
    totalAmount: roundMoney(productAmount + extraChargeAmount + shippingAmount),
  };
}

export function getOrderQuote({
  productKey,
  sku,
  legacy = false,
  salesUnit = null,
  shippingMethod,
  discount = null,
  selectedExtraCharges = {},
  now = new Date(),
}) {
  const resolvedProductKey = findProductKeyBySku(sku, { includeLegacy: legacy });
  if (!resolvedProductKey || resolvedProductKey !== productKey) {
    throw new Error(`SKU "${sku}" does not belong to product "${productKey}".`);
  }

  const variant = getProductVariantBySku(sku, { legacy, salesUnit });
  if (!variant) {
    throw new Error(`Unknown SKU "${sku}".`);
  }
  if (!variant.isAvailable) {
    throw new Error(`SKU "${sku}" is currently unavailable.`);
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
  const discountAmounts = calculateDiscountAmounts(
    itemPrice,
    shippingPrice,
    discount,
    extraCharges
  );
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
