import { DEFAULT_LANGUAGE } from '@/lib/i18n/config.mjs';
import { getCommerceMessages } from '@/lib/i18n/messages.mjs';
import { calculateDiscountAmounts } from '@/lib/orders/getOrderQuote';
import {
  findProductKeyBySku,
  getCartAddOnBySku,
  getCartShippingOption,
  getCartShippingOptions,
  getProductVariantBySku,
} from '@/lib/pricing/catalog';

export const MAX_WORM_PACKAGES_PER_ORDER = 5;
export const MAX_CHOW_PRODUCTS_PER_ORDER = 2;

export const CART_ERROR_CODES = Object.freeze({
  UNKNOWN_PRODUCT: 'unknown_product',
  PRODUCT_UNAVAILABLE: 'product_unavailable',
  PREPARED_BIN_REQUIRES_WORMS: 'prepared_bin_requires_worms',
  PREPARED_BIN_LIMIT: 'prepared_bin_limit',
  SMALL_FIBRE_MIX_REQUIRES_WORMS: 'small_fibre_mix_requires_worms',
  WORM_PACKAGE_LIMIT: 'worm_package_limit',
  FIBRE_MIX_LIMIT: 'fibre_mix_limit',
  INVALID_SHIPPING_METHOD: 'invalid_shipping_method',
  CART_EMPTY: 'cart_empty',
});

export class CartError extends Error {
  constructor(code, values = {}) {
    super(code);
    this.name = 'CartError';
    this.code = code;
    this.values = values;
  }
}

export function getCartErrorMessage(
  error,
  language = DEFAULT_LANGUAGE,
  fallbackCode = 'order_quote_failed'
) {
  const commerceMessages = getCommerceMessages(language);
  const code = error instanceof CartError ? error.code : fallbackCode;
  const values = error instanceof CartError ? error.values : {};
  const messageFactory = commerceMessages.cart.errors[code];

  if (typeof messageFactory !== 'function') {
    throw new Error(`Missing cart error message for "${String(code)}".`);
  }

  return messageFactory(values);
}

function roundMoney(value) {
  return Number((Number(value) || 0).toFixed(2));
}

function normalizeQuantity(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.floor(numericValue));
}

export function normalizeCartItems(items = []) {
  const itemsByIdentity = new Map();

  for (const item of Array.isArray(items) ? items : []) {
    const sku = String(item?.sku ?? '').trim();
    const parentSku = String(item?.parentSku ?? '').trim();
    const quantity = normalizeQuantity(item?.quantity);

    if (!sku || quantity <= 0) {
      continue;
    }

    const identity = `${parentSku}\u0000${sku}`;
    const current = itemsByIdentity.get(identity);
    itemsByIdentity.set(identity, {
      sku,
      ...(parentSku ? { parentSku } : {}),
      quantity: (current?.quantity ?? 0) + quantity,
    });
  }

  return [...itemsByIdentity.values()];
}

function formatWeightLabel(variant) {
  return variant?.weightGrams ? `${variant.weightGrams} g` : '';
}

function getEstimatedWormCount(variant, packageQuantity = 1) {
  const estimatedWormCount = Number(variant?.estimatedWormCount) || 0;
  if (!estimatedWormCount) {
    return 0;
  }

  return estimatedWormCount * packageQuantity;
}

export function formatCartLineLabel({
  productKey,
  variant,
  quantity = 1,
  language = DEFAULT_LANGUAGE,
}) {
  const cartMessages = getCommerceMessages(language).cart;

  if (productKey === 'worms') {
    return cartMessages.wormLineLabel({
      weight: variant?.weightGrams ?? variant?.amount ?? '',
      estimatedWormCount: getEstimatedWormCount(variant, quantity),
    });
  }

  const weightLabel = formatWeightLabel(variant);
  const productName = cartMessages.productNames[productKey];
  if (!productName) {
    throw new CartError(CART_ERROR_CODES.UNKNOWN_PRODUCT, { sku: variant?.sku ?? '' });
  }

  return weightLabel ? `${productName} ${weightLabel}` : productName;
}

export function getCartLineItems(items = [], { language = DEFAULT_LANGUAGE } = {}) {
  const normalizedItems = normalizeCartItems(items);
  const lines = normalizedItems.map((item) => {
    const addOn = getCartAddOnBySku(item.sku, language);
    const packageQuantity = normalizeQuantity(item.quantity);

    if (addOn) {
      const unitPrice = Number(addOn.price) || 0;

      return {
        key: addOn.productKey ?? addOn.parentProductKey,
        productKey: addOn.productKey ?? addOn.parentProductKey,
        parentProductKey: addOn.parentProductKey,
        parentSku: item.parentSku ?? '',
        name: addOn.name,
        displayName: addOn.name,
        label: addOn.label,
        sku: addOn.sku,
        quantity: packageQuantity,
        packageQuantity,
        amount: addOn.amount ?? 1,
        salesUnit: addOn.salesUnit ?? 'piece',
        weightGrams: addOn.weightGrams ?? null,
        estimatedWormCount: null,
        unitPrice,
        itemTotal: roundMoney(unitPrice * packageQuantity),
        isAddOn: true,
        isQuantityEditable: !addOn.fixedQuantity,
        maxQuantityPerParent: addOn.maxQuantityPerParent ?? null,
        shippingScheduleKey: addOn.shippingScheduleKey ?? null,
      };
    }

    const productKey = findProductKeyBySku(item.sku);
    const variant = getProductVariantBySku(item.sku);

    if (!productKey || !variant) {
      throw new CartError(CART_ERROR_CODES.UNKNOWN_PRODUCT, { sku: item.sku });
    }

    if (!variant.isAvailable) {
      throw new CartError(CART_ERROR_CODES.PRODUCT_UNAVAILABLE, { sku: item.sku });
    }

    const productName = getCommerceMessages(language).cart.productNames[productKey];
    const unitPrice = Number(variant.price) || 0;
    const itemTotal = roundMoney(unitPrice * packageQuantity);
    const estimatedWormCount =
      variant.estimatedWormCount === null
        ? null
        : (Number(variant.estimatedWormCount) || 0) * packageQuantity;
    const productQuantity =
      estimatedWormCount ??
      (variant.itemCount ? variant.itemCount * packageQuantity : packageQuantity);

    return {
      key: productKey,
      productKey,
      name: productName,
      displayName: productName,
      label: formatCartLineLabel({
        productKey,
        variant,
        quantity: packageQuantity,
        language,
      }),
      sku: item.sku,
      quantity: productQuantity,
      packageQuantity,
      amount: variant.amount,
      salesUnit: variant.salesUnit ?? null,
      weightGrams: variant.weightGrams ?? null,
      estimatedWormCount,
      unitPrice,
      itemTotal,
      isAddOn: false,
      isQuantityEditable: true,
      parentSku: '',
      shippingScheduleKey: null,
    };
  });

  const addOnLines = lines.filter((line) => line.isAddOn);
  for (const line of addOnLines) {
    const addOn = getCartAddOnBySku(line.sku, language);
    const parentLine = lines.find(
      (candidate) =>
        !candidate.isAddOn &&
        candidate.productKey === addOn?.parentProductKey &&
        candidate.sku === line.parentSku
    );

    if (!parentLine) {
      throw new CartError(
        addOn?.key === 'smallCompostChow'
          ? CART_ERROR_CODES.SMALL_FIBRE_MIX_REQUIRES_WORMS
          : CART_ERROR_CODES.PREPARED_BIN_REQUIRES_WORMS
      );
    }

    const maxQuantityPerParent = Number(addOn?.maxQuantityPerParent) || 0;
    if (
      maxQuantityPerParent > 0 &&
      line.packageQuantity > parentLine.packageQuantity * maxQuantityPerParent
    ) {
      throw new CartError(CART_ERROR_CODES.PREPARED_BIN_LIMIT);
    }
  }

  const wormPackageCount = lines
    .filter((line) => line.productKey === 'worms' && !line.isAddOn)
    .reduce((sum, line) => sum + line.packageQuantity, 0);

  if (wormPackageCount > MAX_WORM_PACKAGES_PER_ORDER) {
    throw new CartError(CART_ERROR_CODES.WORM_PACKAGE_LIMIT, {
      limit: MAX_WORM_PACKAGES_PER_ORDER,
    });
  }

  const chowProductCount = lines
    .filter((line) => line.productKey === 'compostChow')
    .reduce((sum, line) => sum + line.packageQuantity, 0);

  if (chowProductCount > MAX_CHOW_PRODUCTS_PER_ORDER) {
    throw new CartError(CART_ERROR_CODES.FIBRE_MIX_LIMIT, {
      limit: MAX_CHOW_PRODUCTS_PER_ORDER,
    });
  }

  return lines;
}

function hasCartIdentity(item, sku, parentSku = '') {
  return item.sku === sku && String(item.parentSku ?? '') === parentSku;
}

export function getCartItemsAfterQuantityChange(
  items = [],
  changedSku,
  quantity,
  changedParentSku = ''
) {
  const normalizedSku = String(changedSku || '').trim();
  const normalizedParentSku = String(changedParentSku || '').trim();
  const nextQuantity = Math.max(1, normalizeQuantity(quantity) || 1);
  const changedItems = normalizeCartItems(items).map((item) =>
    hasCartIdentity(item, normalizedSku, normalizedParentSku)
      ? { ...item, quantity: nextQuantity }
      : item
  );

  if (normalizedParentSku) {
    return changedItems;
  }

  return changedItems.map((item) => {
    if (item.parentSku !== normalizedSku) {
      return item;
    }

    const addOn = getCartAddOnBySku(item.sku);
    const maxQuantityPerParent = Number(addOn?.maxQuantityPerParent) || 0;
    if (!maxQuantityPerParent) {
      return item;
    }

    return {
      ...item,
      quantity: Math.min(item.quantity, nextQuantity * maxQuantityPerParent),
    };
  });
}

export function getCartItemsAfterRemoval(items = [], removedSku, removedParentSku = '') {
  const normalizedSku = String(removedSku || '').trim();
  const normalizedParentSku = String(removedParentSku || '').trim();
  const remainingItems = normalizeCartItems(items).filter(
    (item) =>
      !hasCartIdentity(item, normalizedSku, normalizedParentSku) &&
      !(!normalizedParentSku && item.parentSku === normalizedSku)
  );

  return remainingItems;
}

export function getDefaultCartShippingOption(language = DEFAULT_LANGUAGE) {
  return getCartShippingOptions(language)[0] ?? null;
}

export function getCartDiscountEligibleSubtotal(lines = [], discount = null) {
  const eligibleSkus = new Set(
    (Array.isArray(discount?.appliesToSkus) ? discount.appliesToSkus : [])
      .map((sku) => String(sku || '').trim())
      .filter(Boolean)
  );

  if (!eligibleSkus.size) {
    return 0;
  }

  return roundMoney(
    (Array.isArray(lines) ? lines : []).reduce(
      (sum, line) =>
        eligibleSkus.has(String(line?.sku || '').trim())
          ? sum + (Number(line?.itemTotal) || 0)
          : sum,
      0
    )
  );
}

export function calculateCartDiscountAmounts(
  lines = [],
  shippingPrice = 0,
  discount = null
) {
  const eligibleSubtotal = getCartDiscountEligibleSubtotal(lines, discount);

  if (!discount || eligibleSubtotal <= 0) {
    return {
      eligibleSubtotal,
      productAmount: 0,
      extraChargeAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
    };
  }

  return {
    eligibleSubtotal,
    ...calculateDiscountAmounts(eligibleSubtotal, shippingPrice, discount),
  };
}

export function getCartOrderQuote({
  items = [],
  shippingMethod,
  language = DEFAULT_LANGUAGE,
  discount = null,
}) {
  const lines = getCartLineItems(items, { language });
  const selectedShippingMethod =
    shippingMethod || getDefaultCartShippingOption(language)?.id || '';
  const shippingOption = getCartShippingOption(selectedShippingMethod, language);

  if (!shippingOption) {
    throw new CartError(CART_ERROR_CODES.INVALID_SHIPPING_METHOD);
  }

  const itemSubtotal = roundMoney(lines.reduce((sum, line) => sum + line.itemTotal, 0));
  const shippingPrice = Number(shippingOption.price) || 0;
  const discountAmounts = calculateCartDiscountAmounts(lines, shippingPrice, discount);
  const total = roundMoney(itemSubtotal + shippingPrice - discountAmounts.totalAmount);

  return {
    items: lines,
    shippingOption,
    itemSubtotal,
    shippingPrice,
    discountAmounts,
    total,
  };
}
