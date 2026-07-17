import { DEFAULT_LANGUAGE } from '@/lib/i18n/config.mjs';
import { getCommerceMessages } from '@/lib/i18n/messages.mjs';
import {
  findProductKeyBySku,
  getCartAddOnBySku,
  getCartShippingOption,
  getCartShippingOptions,
  getProductVariantBySku,
} from '@/lib/pricing/catalog';

export const MAX_WORM_PACKAGES_PER_ORDER = 2;
export const MAX_CHOW_PRODUCTS_PER_ORDER = 2;

export const CART_ERROR_CODES = Object.freeze({
  UNKNOWN_PRODUCT: 'unknown_product',
  PRODUCT_UNAVAILABLE: 'product_unavailable',
  PREPARED_BIN_REQUIRES_WORMS: 'prepared_bin_requires_worms',
  PREPARED_BIN_LIMIT: 'prepared_bin_limit',
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
  const quantitiesBySku = new Map();

  for (const item of Array.isArray(items) ? items : []) {
    const sku = String(item?.sku ?? '').trim();
    const quantity = normalizeQuantity(item?.quantity);

    if (!sku || quantity <= 0) {
      continue;
    }

    quantitiesBySku.set(sku, (quantitiesBySku.get(sku) ?? 0) + quantity);
  }

  return [...quantitiesBySku.entries()].map(([sku, quantity]) => ({
    sku,
    quantity,
  }));
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
        key: addOn.parentProductKey,
        productKey: addOn.parentProductKey,
        name: addOn.name,
        displayName: addOn.name,
        label: addOn.label,
        sku: addOn.sku,
        quantity: packageQuantity,
        packageQuantity,
        amount: 1,
        salesUnit: 'piece',
        weightGrams: null,
        estimatedWormCount: null,
        unitPrice,
        itemTotal: roundMoney(unitPrice * packageQuantity),
        isAddOn: true,
        isQuantityEditable: !addOn.fixedQuantity,
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
      shippingScheduleKey: null,
    };
  });

  const addOnLines = lines.filter((line) => line.isAddOn);
  for (const line of addOnLines) {
    const addOn = getCartAddOnBySku(line.sku, language);
    const parentProductIsPresent = lines.some(
      (candidate) =>
        !candidate.isAddOn && candidate.productKey === addOn?.parentProductKey
    );

    if (!parentProductIsPresent) {
      throw new CartError(CART_ERROR_CODES.PREPARED_BIN_REQUIRES_WORMS);
    }

    if (line.packageQuantity > (addOn?.maxQuantity ?? 1)) {
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

export function getCartItemsAfterRemoval(items = [], removedSku) {
  const normalizedSku = String(removedSku || '').trim();
  const remainingItems = normalizeCartItems(items).filter(
    (item) => item.sku !== normalizedSku
  );
  const hasWorms = remainingItems.some(
    (item) => findProductKeyBySku(item.sku) === 'worms'
  );

  return hasWorms
    ? remainingItems
    : remainingItems.filter((item) => !getCartAddOnBySku(item.sku));
}

export function getDefaultCartShippingOption(language = DEFAULT_LANGUAGE) {
  return getCartShippingOptions(language)[0] ?? null;
}

export function getCartOrderQuote({
  items = [],
  shippingMethod,
  language = DEFAULT_LANGUAGE,
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
  const total = roundMoney(itemSubtotal + shippingPrice);

  return {
    items: lines,
    shippingOption,
    itemSubtotal,
    shippingPrice,
    total,
  };
}
