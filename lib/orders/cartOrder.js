import {
  findProductKeyBySku,
  getCartAddOnBySku,
  getCartShippingOption,
  getCartShippingOptions,
  getProductVariantBySku,
} from '@/lib/pricing/catalog';
import { getProductCatalogEntry } from '@/lib/products/catalog.mjs';

export const MAX_WORM_PACKAGES_PER_ORDER = 2;
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

  const weightLabel = formatWeightLabel(variant);
  const productName = product.productName ?? product.name;
  return weightLabel ? `${productName} ${weightLabel}` : productName;
}

export function getCartLineItems(items = []) {
  const normalizedItems = normalizeCartItems(items);
  const lines = normalizedItems.map((item) => {
    const addOn = getCartAddOnBySku(item.sku);
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
      throw new Error(`Tuntematon tuote "${item.sku}".`);
    }

    if (!variant.isAvailable) {
      throw new Error(`Tuote "${item.sku}" ei ole tällä hetkellä saatavilla.`);
    }

    const product = getProductCatalogEntry(productKey);
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
      isAddOn: false,
      isQuantityEditable: true,
      shippingScheduleKey: null,
    };
  });

  const addOnLines = lines.filter((line) => line.isAddOn);
  for (const line of addOnLines) {
    const addOn = getCartAddOnBySku(line.sku);
    const parentProductIsPresent = lines.some(
      (candidate) =>
        !candidate.isAddOn && candidate.productKey === addOn?.parentProductKey
    );

    if (!parentProductIsPresent) {
      throw new Error(
        'Käyttövalmiin matokompostorin voi tilata vain kompostimatojen kanssa.'
      );
    }

    if (line.packageQuantity > (addOn?.maxQuantity ?? 1)) {
      throw new Error(
        'Yhdessä tilauksessa voi olla enintään yksi käyttövalmis matokompostori.'
      );
    }
  }

  const wormPackageCount = lines
    .filter((line) => line.productKey === 'worms' && !line.isAddOn)
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
