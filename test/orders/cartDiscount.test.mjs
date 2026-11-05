import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { calculateCartDiscountAmounts, getCartOrderQuote } from '@/lib/orders/cartOrder';
import { createWormHuntConfig, createWormHuntDiscount } from '@/lib/wormHunt/config.mjs';

import {
  getAddOnPrice,
  getCartShippingPrice,
  getRequiredAddOnSku,
  getRequiredProductSku,
  getVariantPrice,
  roundMoney,
} from '../helpers/catalogSkus.mjs';

const REWARD_PERCENTAGE = 15;
const NOW = new Date('2026-08-04T10:00:00Z');

function getCheckoutReward() {
  const discount = createWormHuntDiscount(
    createWormHuntConfig({
      enabled: true,
      code: 'ABCDEF',
      discountPercentage: REWARD_PERCENTAGE,
    })
  );

  assert.ok(discount, 'the checkout reward should exist for quote tests');
  return discount;
}

describe('cart discount pricing', () => {
  test('discounts eligible worm quantities without discounting add-ons, fibre mix, or postage', () => {
    const behavior = 'the cart reward quote test needs';
    const wormSku = getRequiredProductSku('worms', `${behavior} a worm package`);
    const binSku = getRequiredAddOnSku('preparedWormBin', `${behavior} a prepared bin`);
    const smallChowSku = getRequiredAddOnSku(
      'smallCompostChow',
      `${behavior} the small fibre mix`
    );
    const chowSku = getRequiredProductSku('compostChow', `${behavior} the fibre mix`);
    const wormLineTotal = roundMoney(getVariantPrice(wormSku, { now: NOW }) * 2);
    const itemSubtotal = roundMoney(
      wormLineTotal +
        getAddOnPrice(binSku) * 2 +
        getAddOnPrice(smallChowSku) +
        getVariantPrice(chowSku, { now: NOW })
    );
    const shippingPrice = getCartShippingPrice('posti_noutopiste');
    const rewardAmount = roundMoney((wormLineTotal * REWARD_PERCENTAGE) / 100);

    const quote = getCartOrderQuote({
      items: [
        { sku: wormSku, quantity: 2 },
        { sku: binSku, parentSku: wormSku, quantity: 2 },
        { sku: smallChowSku, parentSku: wormSku, quantity: 1 },
        { sku: chowSku, quantity: 1 },
      ],
      shippingMethod: 'posti_noutopiste',
      discount: getCheckoutReward(),
      now: NOW,
    });

    assert.equal(quote.itemSubtotal, itemSubtotal);
    assert.equal(quote.shippingPrice, shippingPrice);
    assert.equal(quote.discountAmounts.eligibleSubtotal, wormLineTotal);
    assert.equal(quote.discountAmounts.productAmount, rewardAmount);
    assert.equal(quote.discountAmounts.extraChargeAmount, 0);
    assert.equal(quote.discountAmounts.shippingAmount, 0);
    assert.equal(quote.discountAmounts.totalAmount, rewardAmount);
    assert.equal(quote.total, roundMoney(itemSubtotal + shippingPrice - rewardAmount));
  });

  test('rounds the percentage discount from the combined eligible line subtotal to cents', () => {
    const discountAmounts = calculateCartDiscountAmounts(
      [
        { sku: 'worms-25', itemTotal: 10.03 },
        { sku: 'worms-ready-bin-14l', itemTotal: 99.99 },
      ],
      14.9,
      getCheckoutReward()
    );

    assert.equal(discountAmounts.eligibleSubtotal, 10.03);
    assert.equal(discountAmounts.productAmount, 1.5);
    assert.equal(discountAmounts.shippingAmount, 0);
    assert.equal(discountAmounts.totalAmount, 1.5);
  });

  test('does not create a discount when the cart has no eligible worm SKU', () => {
    const discountAmounts = calculateCartDiscountAmounts(
      [
        { sku: 'worms-ready-bin-14l', itemTotal: 30 },
        { sku: 'chow-500', itemTotal: 8.9 },
      ],
      8.9,
      getCheckoutReward()
    );

    assert.deepEqual(discountAmounts, {
      eligibleSubtotal: 0,
      productAmount: 0,
      extraChargeAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
    });
  });
});
