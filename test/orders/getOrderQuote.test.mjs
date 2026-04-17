import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { getOrderQuote } from '@/lib/orders/getOrderQuote';

import { expectEqual } from '../helpers/assertions.mjs';
import {
  buildExpectedQuoteFromSource,
  findOrderScenario,
  getDateForChargeActivity,
  listOrderScenarios,
} from '../helpers/orderScenarios.mjs';
import {
  getRequiredProductSku,
  withTemporaryProductAvailability,
} from '../helpers/productAvailability.mjs';

describe('frontend order quote pricing', () => {
  test('getOrderQuote should match the current runtime pricing for configured order scenarios', () => {
    const scenarios = listOrderScenarios();
    const now = new Date('2026-04-05T10:00:00Z');

    for (const scenario of scenarios) {
      const quote = getOrderQuote({
        productKey: scenario.productKey,
        sku: scenario.variant.sku,
        shippingMethod: scenario.shippingOption.id,
        now,
      });
      const expected = buildExpectedQuoteFromSource({
        productKey: scenario.productKey,
        sku: scenario.variant.sku,
        shippingMethod: scenario.shippingOption.id,
        now,
      });

      expectEqual(
        quote.itemPrice,
        expected.itemPrice,
        `getOrderQuote should use the current item price from source data for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        quote.shippingPrice,
        expected.shippingPrice,
        `getOrderQuote should use the current shipping price from source data for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        quote.extraChargeTotal,
        expected.extraChargeTotal,
        `getOrderQuote should not add unselected extra charges for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        quote.discountAmounts.totalAmount,
        0,
        `getOrderQuote should keep explicit discount totals at zero when no discount code is applied for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        quote.total,
        expected.total,
        `getOrderQuote should calculate the current total from source data for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
    }
  });

  test('getOrderQuote should respect the current extra-charge configuration', () => {
    const scenario =
      listOrderScenarios().find((entry) => entry.orderConfig.extraCharges.length > 0) ?? null;

    if (!scenario) {
      return;
    }

    const selectedExtraCharges = Object.fromEntries(
      scenario.orderConfig.extraCharges.map((charge) => [charge.fieldName, true])
    );
    const now =
      scenario.orderConfig.extraCharges
        .map((charge) => getDateForChargeActivity(charge, { active: true }))
        .find(Boolean) ?? new Date('2026-06-15T10:00:00Z');
    const quote = getOrderQuote({
      productKey: scenario.productKey,
      sku: scenario.variant.sku,
      shippingMethod: scenario.shippingOption.id,
      selectedExtraCharges,
      now,
    });
    const expected = buildExpectedQuoteFromSource({
      productKey: scenario.productKey,
      sku: scenario.variant.sku,
      shippingMethod: scenario.shippingOption.id,
      selectedExtraCharges,
      now,
    });

    expectEqual(
      quote.extraChargeTotal,
      expected.extraChargeTotal,
      `getOrderQuote should apply the currently active extra charges for ${scenario.productKey}`
    );
    expectEqual(
      quote.total,
      expected.total,
      `getOrderQuote should include the currently active extra charges in the total for ${scenario.productKey}`
    );
  });

  test('getOrderQuote should respect seasonal extra-charge activity from source data', () => {
    const scenario =
      listOrderScenarios().find((entry) =>
        entry.orderConfig.extraCharges.some((charge) => {
          const activeDate = getDateForChargeActivity(charge, { active: true });
          const inactiveDate = getDateForChargeActivity(charge, { active: false });
          return Boolean(activeDate && inactiveDate);
        })
      ) ?? null;

    if (!scenario) {
      return;
    }

    const charge = scenario.orderConfig.extraCharges.find((entry) => {
      const activeDate = getDateForChargeActivity(entry, { active: true });
      const inactiveDate = getDateForChargeActivity(entry, { active: false });
      return Boolean(activeDate && inactiveDate);
    });

    if (!charge) {
      return;
    }

    const selectedExtraCharges = {
      [charge.fieldName]: true,
    };
    const activeNow = getDateForChargeActivity(charge, { active: true });
    const inactiveNow = getDateForChargeActivity(charge, { active: false });
    const activeQuote = getOrderQuote({
      productKey: scenario.productKey,
      sku: scenario.variant.sku,
      shippingMethod: scenario.shippingOption.id,
      selectedExtraCharges,
      now: activeNow,
    });
    const inactiveQuote = getOrderQuote({
      productKey: scenario.productKey,
      sku: scenario.variant.sku,
      shippingMethod: scenario.shippingOption.id,
      selectedExtraCharges,
      now: inactiveNow,
    });

    expectEqual(
      activeQuote.extraCharges.find((entry) => entry.fieldName === charge.fieldName)
        ?.appliedPrice,
      Number(charge.price) || 0,
      `getOrderQuote should apply ${charge.fieldName} during its configured active months`
    );
    expectEqual(
      inactiveQuote.extraCharges.find((entry) => entry.fieldName === charge.fieldName)
        ?.appliedPrice,
      0,
      `getOrderQuote should not apply ${charge.fieldName} outside its configured active months`
    );
  });

  test('getOrderQuote should reject unsupported shipping methods for the selected product', () => {
    const scenario = findOrderScenario();

    if (!scenario) {
      return;
    }

    assert.throws(
      () =>
        getOrderQuote({
          productKey: scenario.productKey,
          sku: scenario.variant.sku,
          shippingMethod: 'not-a-real-shipping-option',
        }),
      /Unknown shipping option/,
      'getOrderQuote should throw when an order is quoted with an unsupported shipping method'
    );
  });

  test('getOrderQuote should reject temporarily unavailable configured SKUs', () => {
    const scenario = findOrderScenario();

    if (!scenario) {
      return;
    }

    const unavailableSku = getRequiredProductSku(
      scenario.productKey,
      'getOrderQuote unavailable-SKU test needs at least one configured SKU'
    );

    withTemporaryProductAvailability(scenario.productKey, {
      unavailableSkus: [unavailableSku],
    }, () => {
      assert.throws(
        () =>
          getOrderQuote({
            productKey: scenario.productKey,
            sku: unavailableSku,
            shippingMethod: scenario.shippingOption.id,
          }),
        /currently unavailable/,
        'getOrderQuote should throw when the selected SKU is unavailable'
      );
    });
  });
});
