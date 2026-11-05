import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { getCartOrderQuote } from '@/lib/orders/cartOrder';
import { getOrderQuote } from '@/lib/orders/getOrderQuote';
import { normalizePublicOrderSubmission } from '@/lib/orders/normalizePublicOrder';
import { getBasePriceForSku, getProductVariantBySku } from '@/lib/pricing/catalog';
import { getActiveSkuDiscount } from '@/lib/pricing/skuDiscounts.mjs';

import { getRequiredProductSku, roundMoney } from '../helpers/catalogSkus.mjs';
import { createValidOrderFormData } from '../helpers/orderForm.mjs';
import {
  createSkuDiscount,
  withTemporarySkuDiscounts,
} from '../helpers/skuDiscounts.mjs';

const SALE_PERCENTAGE = 10;
// Summer sale: Helsinki is UTC+3, so the business day starts at 21:00 UTC the day before.
const SUMMER_SALE = createSkuDiscount({
  value: SALE_PERCENTAGE,
  validFrom: '2026-07-13',
  validUntil: '2026-07-21',
});
// Winter sale: Helsinki is UTC+2.
const WINTER_SALE = createSkuDiscount({
  value: SALE_PERCENTAGE,
  validFrom: '2026-01-10',
  validUntil: '2026-01-12',
});

const IN_SUMMER_SALE = new Date('2026-07-15T10:00:00Z');
const AFTER_SUMMER_SALE = new Date('2026-07-22T10:00:00Z');

function getSaleSku() {
  return getRequiredProductSku('worms', 'the SKU sale tests need a worm package');
}

function getSalePrice(sku) {
  const basePrice = getBasePriceForSku(sku);
  return roundMoney(basePrice - roundMoney((basePrice * SALE_PERCENTAGE) / 100));
}

describe('scheduled SKU sale pricing', () => {
  test('a SKU sale is active from the first to the last day in Helsinki time', () => {
    const sku = getSaleSku();
    const basePrice = getBasePriceForSku(sku);

    withTemporarySkuDiscounts({ [sku]: SUMMER_SALE }, () => {
      const isActive = (isoTime) =>
        Boolean(getActiveSkuDiscount({ sku, basePrice, now: new Date(isoTime) }));

      assert.equal(isActive('2026-07-12T20:59:59Z'), false, 'Helsinki 12.7. 23.59.59');
      assert.equal(isActive('2026-07-12T21:00:00Z'), true, 'Helsinki 13.7. 00.00');
      assert.equal(isActive('2026-07-21T20:59:59Z'), true, 'Helsinki 21.7. 23.59.59');
      assert.equal(isActive('2026-07-21T21:00:00Z'), false, 'Helsinki 22.7. 00.00');
    });

    withTemporarySkuDiscounts({ [sku]: WINTER_SALE }, () => {
      const isActive = (isoTime) =>
        Boolean(getActiveSkuDiscount({ sku, basePrice, now: new Date(isoTime) }));

      assert.equal(isActive('2026-01-09T21:59:59Z'), false, 'Helsinki 9.1. 23.59.59');
      assert.equal(isActive('2026-01-09T22:00:00Z'), true, 'Helsinki 10.1. 00.00');
      assert.equal(isActive('2026-01-12T21:59:59Z'), true, 'Helsinki 12.1. 23.59.59');
      assert.equal(isActive('2026-01-12T22:00:00Z'), false, 'Helsinki 13.1. 00.00');
    });
  });

  test('variants, quotes and submitted orders use the sale price only on sale days', () => {
    const sku = getSaleSku();
    const basePrice = getBasePriceForSku(sku);
    const salePrice = getSalePrice(sku);

    assert.ok(salePrice < basePrice, 'the example sale should lower the price');

    withTemporarySkuDiscounts({ [sku]: SUMMER_SALE }, () => {
      assert.equal(getProductVariantBySku(sku, { now: IN_SUMMER_SALE }).price, salePrice);
      assert.equal(
        getProductVariantBySku(sku, { now: AFTER_SUMMER_SALE }).price,
        basePrice
      );

      const quote = (now) =>
        getCartOrderQuote({
          items: [{ sku, quantity: 2 }],
          shippingMethod: 'nouto',
          now,
        });
      assert.equal(quote(IN_SUMMER_SALE).itemSubtotal, roundMoney(salePrice * 2));
      assert.equal(quote(AFTER_SUMMER_SALE).itemSubtotal, roundMoney(basePrice * 2));

      const singleQuote = getOrderQuote({
        productKey: 'worms',
        sku,
        shippingMethod: 'nouto',
        now: IN_SUMMER_SALE,
      });
      assert.equal(singleQuote.itemPrice, salePrice);

      const payload = normalizePublicOrderSubmission(
        createValidOrderFormData({
          sku: '',
          tuote_avain: '',
          cart_items_json: JSON.stringify([{ sku, quantity: 1 }]),
          toimitus: 'nouto',
        }),
        { now: IN_SUMMER_SALE }
      );
      assert.equal(payload.pricing.itemPrice, salePrice);
    });
  });

  test('tests start without any configured SKU sale', () => {
    const sku = getSaleSku();

    assert.equal(getProductVariantBySku(sku, { now: IN_SUMMER_SALE }).discount, null);
  });
});
