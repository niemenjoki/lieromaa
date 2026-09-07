import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { calculateCartDiscountAmounts, getCartOrderQuote } from '@/lib/orders/cartOrder';
import { createWormHuntConfig, createWormHuntDiscount } from '@/lib/wormHunt/config.mjs';

function getCheckoutReward() {
  const discount = createWormHuntDiscount(
    createWormHuntConfig({
      enabled: true,
      code: 'ABCDEF',
      discountPercentage: 15,
    })
  );

  assert.ok(discount, 'the checkout reward should exist for quote tests');
  return discount;
}

describe('cart discount pricing', () => {
  test('discounts eligible worm quantities without discounting add-ons, fibre mix, or postage', () => {
    const quote = getCartOrderQuote({
      items: [
        { sku: 'worms-25', quantity: 2 },
        {
          sku: 'worms-ready-bin-14l',
          parentSku: 'worms-25',
          quantity: 2,
        },
        { sku: 'chow-150', parentSku: 'worms-25', quantity: 1 },
        { sku: 'chow-500', quantity: 1 },
      ],
      shippingMethod: 'posti_noutopiste',
      discount: getCheckoutReward(),
    });

    assert.equal(quote.itemSubtotal, 115);
    assert.equal(quote.shippingPrice, 8.9);
    assert.equal(quote.discountAmounts.eligibleSubtotal, 40);
    assert.equal(quote.discountAmounts.productAmount, 6);
    assert.equal(quote.discountAmounts.extraChargeAmount, 0);
    assert.equal(quote.discountAmounts.shippingAmount, 0);
    assert.equal(quote.discountAmounts.totalAmount, 6);
    assert.equal(quote.total, 117.9);
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
