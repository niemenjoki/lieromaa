import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { getOrderQuote } from '@/lib/orders/getOrderQuote';

import { expectEqual } from '../helpers/assertions.mjs';

describe('frontend order quote pricing', () => {
  test('getOrderQuote should apply the active worm discount when worms are picked up', () => {
    const quote = getOrderQuote({
      productKey: 'worms',
      sku: 'worms-100',
      shippingMethod: 'nouto',
      now: new Date('2026-04-05T10:00:00Z'),
    });

    expectEqual(
      quote.itemPrice,
      27,
      'getOrderQuote should set the discounted pickup worm item price to 27 EUR'
    );
    expectEqual(
      quote.shippingPrice,
      0,
      'getOrderQuote should not add shipping for pickup worm orders'
    );
    expectEqual(
      quote.discountAmounts.totalAmount,
      0,
      'getOrderQuote should show zero explicit discount amount when the discounted SKU price is already active'
    );
    expectEqual(
      quote.total,
      27,
      'getOrderQuote should keep the total at 27 EUR for pickup worm orders'
    );
  });

  test('getOrderQuote should only charge frost protection during the configured cold season', () => {
    const winterQuote = getOrderQuote({
      productKey: 'worms',
      sku: 'worms-100',
      shippingMethod: 'posti_noutopiste',
      selectedExtraCharges: {
        pakkastoimituslisa: true,
      },
      now: new Date('2026-01-15T10:00:00Z'),
    });

    const summerQuote = getOrderQuote({
      productKey: 'worms',
      sku: 'worms-100',
      shippingMethod: 'posti_noutopiste',
      selectedExtraCharges: {
        pakkastoimituslisa: true,
      },
      now: new Date('2026-06-15T10:00:00Z'),
    });

    expectEqual(
      winterQuote.extraChargeTotal,
      3,
      'getOrderQuote should add a 3 EUR frost charge for winter postal deliveries'
    );
    expectEqual(
      winterQuote.total,
      38.9,
      'getOrderQuote should return a 38.9 EUR total for the winter frost-protected worm shipment'
    );
    expectEqual(
      summerQuote.extraChargeTotal,
      0,
      'getOrderQuote should not charge frost protection outside the configured season'
    );
    expectEqual(
      summerQuote.total,
      35.9,
      'getOrderQuote should return a 35.9 EUR total when the frost charge is inactive'
    );
  });

  test('getOrderQuote should price the starter-kit home delivery option separately', () => {
    const quote = getOrderQuote({
      productKey: 'starterKit',
      sku: 'starterkit-100',
      shippingMethod: 'posti_kotiinkuljetus',
    });

    expectEqual(
      quote.shippingPrice,
      14.9,
      'getOrderQuote should use the configured 14.9 EUR price for starter-kit home delivery'
    );
    expectEqual(
      quote.total,
      87.9,
      'getOrderQuote should return an 87.9 EUR total for the starter-kit home-delivery order'
    );
  });

  test('getOrderQuote should reject unsupported shipping methods for the selected product', () => {
    assert.throws(
      () =>
        getOrderQuote({
          productKey: 'worms',
          sku: 'worms-100',
          shippingMethod: 'courier',
        }),
      /Unknown shipping option/,
      'getOrderQuote should throw when a worm order is quoted with an unsupported shipping method'
    );
  });
});
