import {
  findProductKeyBySku,
  getCartShippingOption,
  getCartShippingOptions,
  getProductVariantBySku,
} from '@/lib/pricing/catalog';
import { getProductCatalogEntry } from '@/lib/products/catalog.mjs';

export const MAX_WORM_PACKAGES_PER_ORDER = 1;
export const MAX_CHOW_PRODUCTS_PER_ORDER = 2;

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

function formatWormEstimate(variant, packageQuantity = 1) {
  const estimatedWormCount = Number(variant?.estimatedWormCount) || 0;
  if (!estimatedWormCount) {
    return '';
  }

  const totalWorms = estimatedWormCount * packageQuantity;
  return ` (noin ${totalWorms} matoa)`;
}

export function formatCartLineLabel({ product, productKey, variant, quantity = 1 }) {
  if (productKey === 'worms') {
    return `${formatWeightLabel(variant)} kompostimatoja${formatWormEstimate(
      variant,
      quantity
    )}`.trim();
  }

  if (productKey === 'starterKit') {
    return product.productName;
  }

  const weightLabel = formatWeightLabel(variant);
  const productName = product.productName ?? product.name;
  return weightLabel ? `${productName} ${weightLabel}` : productName;
}

export function getCartLineItems(items = []) {
  const normalizedItems = normalizeCartItems(items);
  const lines = normalizedItems.map((item) => {
    const productKey = findProductKeyBySku(item.sku);
    const variant = getProductVariantBySku(item.sku);

    if (!productKey || !variant) {
      throw new Error(`Tuntematon tuote "${item.sku}".`);
    }

    if (!variant.isAvailable) {
      throw new Error(`Tuote "${item.sku}" ei ole tällä hetkellä saatavilla.`);
    }

    const product = getProductCatalogEntry(productKey);
    const packageQuantity = normalizeQuantity(item.quantity);
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
      name: product.productName,
      displayName: product.name,
      label: formatCartLineLabel({
        product,
        productKey,
        variant,
        quantity: packageQuantity,
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
    };
  });

  const wormPackageCount = lines
    .filter((line) => line.productKey === 'worms')
    .reduce((sum, line) => sum + line.packageQuantity, 0);

  if (wormPackageCount > MAX_WORM_PACKAGES_PER_ORDER) {
    throw new Error(
      `Yhdessä tilauksessa voi olla enintään ${MAX_WORM_PACKAGES_PER_ORDER} matopakettia.`
    );
  }

  const chowProductCount = lines
    .filter((line) => line.productKey === 'compostChow')
    .reduce((sum, line) => sum + line.packageQuantity, 0);

  if (chowProductCount > MAX_CHOW_PRODUCTS_PER_ORDER) {
    throw new Error(
      `Yhdessä tilauksessa voi olla enintään ${MAX_CHOW_PRODUCTS_PER_ORDER} kuituseosta.`
    );
  }

  return lines;
}

export function getDefaultCartShippingOption() {
  return getCartShippingOptions()[0] ?? null;
}

export function getCartOrderQuote({ items = [], shippingMethod }) {
  const lines = getCartLineItems(items);
  const selectedShippingMethod =
    shippingMethod || getDefaultCartShippingOption()?.id || '';
  const shippingOption = getCartShippingOption(selectedShippingMethod);

  if (!shippingOption) {
    throw new Error('Valittu toimitustapa ei ole kelvollinen.');
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
