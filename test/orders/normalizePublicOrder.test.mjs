import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  PublicOrderValidationError,
  normalizePublicOrderSubmission,
} from '@/lib/orders/normalizePublicOrder';

import { expectDeepEqual, expectEqual, expectOk } from '../helpers/assertions.mjs';
import {
  createValidOrderFormData,
  createValidOrderFormDataForScenario,
} from '../helpers/orderForm.mjs';
import {
  buildExpectedQuoteFromSource,
  findOrderScenario,
  listOrderScenarios,
} from '../helpers/orderScenarios.mjs';
import {
  getRequiredProductSku,
  withTemporaryProductAvailability,
} from '../helpers/productAvailability.mjs';

describe('frontend public order normalization', () => {
  test('normalizePublicOrderSubmission should match the current runtime config for configured order scenarios', () => {
    const now = new Date('2026-04-05T10:00:00Z');

    for (const scenario of listOrderScenarios()) {
      const payload = normalizePublicOrderSubmission(
        createValidOrderFormDataForScenario(scenario),
        { now }
      );
      const expectedQuote = buildExpectedQuoteFromSource({
        productKey: scenario.productKey,
        sku: scenario.variant.sku,
        shippingMethod: scenario.shippingOption.id,
        now,
      });

      expectEqual(
        payload.source,
        'website',
        `normalizePublicOrderSubmission should label ${scenario.productKey}/${scenario.shippingOption.id} orders with source=website`
      );
      expectEqual(
        payload.sourceRequestId,
        'submission-123',
        `normalizePublicOrderSubmission should preserve the submission id for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        payload.customer.email,
        'testi@example.com',
        `normalizePublicOrderSubmission should keep the customer email for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        payload.fulfillment.method,
        scenario.shippingOption.id,
        `normalizePublicOrderSubmission should keep the selected fulfillment method for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        payload.fulfillment.type,
        scenario.fulfillmentType,
        `normalizePublicOrderSubmission should keep the fulfillment type for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        payload.product.key,
        scenario.productKey,
        `normalizePublicOrderSubmission should keep the current product key for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        payload.product.name,
        scenario.product.name,
        `normalizePublicOrderSubmission should use the current product name for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        payload.product.sku,
        scenario.variant.sku,
        `normalizePublicOrderSubmission should keep the current SKU for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        payload.product.quantity,
        scenario.variant.estimatedWormCount ?? scenario.variant.amount,
        `normalizePublicOrderSubmission should keep the current quantity for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        payload.pricing.shippingPrice,
        expectedQuote.shippingPrice,
        `normalizePublicOrderSubmission should use the current shipping price for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        payload.pricing.itemPrice,
        expectedQuote.itemPrice,
        `normalizePublicOrderSubmission should use the current item price for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        payload.pricing.total,
        expectedQuote.total,
        `normalizePublicOrderSubmission should calculate the current total for ${scenario.productKey}/${scenario.shippingOption.id}`
      );
      expectEqual(
        payload.availability.earliestShippingDate,
        '',
        `normalizePublicOrderSubmission should omit empty availability snapshots for ${scenario.productKey}/${scenario.shippingOption.id}`
      );

      if (
        scenario.fulfillmentType === 'pickup_point' ||
        scenario.fulfillmentType === 'home_delivery'
      ) {
        expectDeepEqual(
          payload.fulfillment.address,
          {
            line1: 'Kompostikuja 1',
            postalCode: '00100',
            city: 'Helsinki',
          },
          `normalizePublicOrderSubmission should keep the current delivery address for ${scenario.productKey}/${scenario.shippingOption.id}`
        );
      } else {
        expectEqual(
          payload.fulfillment.address,
          null,
          `normalizePublicOrderSubmission should omit addresses for ${scenario.productKey}/${scenario.shippingOption.id}`
        );
      }

      if (scenario.fulfillmentType === 'pickup_point') {
        expectEqual(
          payload.fulfillment.pickupPoint?.name,
          'Posti Pasila',
          `normalizePublicOrderSubmission should include the selected pickup point for ${scenario.productKey}/${scenario.shippingOption.id}`
        );
        expectDeepEqual(
          payload.fulfillment.searchAddress,
          {
            line1: 'Kompostikuja 1',
            postalCode: '00100',
            city: 'Helsinki',
          },
          `normalizePublicOrderSubmission should preserve the pickup-point search address for ${scenario.productKey}/${scenario.shippingOption.id}`
        );
      } else {
        expectEqual(
          payload.fulfillment.pickupPoint,
          null,
          `normalizePublicOrderSubmission should not include a pickup point for ${scenario.productKey}/${scenario.shippingOption.id}`
        );
        expectEqual(
          payload.fulfillment.searchAddress,
          null,
          `normalizePublicOrderSubmission should omit the pickup-point search address for ${scenario.productKey}/${scenario.shippingOption.id}`
        );
      }
    }
  });

  test('normalizePublicOrderSubmission should allow pickup-point shipping without a selected pickup point', () => {
    const scenario = findOrderScenario({ fulfillmentType: 'pickup_point' });

    if (!scenario) {
      return;
    }

    const payload = normalizePublicOrderSubmission(
      createValidOrderFormDataForScenario(scenario, {
        lisatiedot: '',
        pickup_point_id: '',
        pickup_point_name: '',
        pickup_point_care_of: '',
        pickup_point_street: '',
        pickup_point_postal_code: '',
        pickup_point_city: '',
        pickup_point_municipality: '',
        pickup_point_specific_location: '',
        pickup_point_parcel_locker: '',
        pickup_point_routing_service_code: '',
        pickup_point_distance_meters: '',
        alennuskoodi: 'ei-ole',
      }),
      {
        now: new Date('2026-06-15T10:00:00Z'),
      }
    );
    const expectedQuote = buildExpectedQuoteFromSource({
      productKey: scenario.productKey,
      sku: scenario.variant.sku,
      shippingMethod: scenario.shippingOption.id,
      now: new Date('2026-06-15T10:00:00Z'),
    });

    expectEqual(
      payload.fulfillment.pickupPoint,
      null,
      'normalizePublicOrderSubmission should allow a missing pickup point when the customer only gave a postal code'
    );
    expectEqual(
      payload.fulfillment.address.line1,
      'Kompostikuja 1',
      'normalizePublicOrderSubmission should keep the customer home address even when no exact pickup point was provided'
    );
    expectDeepEqual(
      payload.fulfillment.searchAddress,
      {
        line1: 'Kompostikuja 1',
        postalCode: '00100',
        city: 'Helsinki',
      },
      'normalizePublicOrderSubmission should preserve the pickup-point lookup address separately'
    );
    expectEqual(
      payload.pricing.discount,
      null,
      'normalizePublicOrderSubmission should not attach an invalid discount code to pricing'
    );
    expectEqual(
      payload.pricing.total,
      expectedQuote.total,
      'normalizePublicOrderSubmission should keep the current source-data total when the pickup point is omitted'
    );
  });

  test('normalizePublicOrderSubmission should keep weight-based worm SKUs distinct from legacy count SKUs', () => {
    const now = new Date('2026-04-28T10:00:00Z');
    const weightPayload = withTemporaryProductAvailability(
      'worms',
      { earliestShippingDate: false, unavailableSkus: [] },
      () =>
        normalizePublicOrderSubmission(
          createValidOrderFormData({
            tuote_avain: 'worms',
            sku: 'worms-50',
            maara: '50',
            myyntiyksikko: 'weight',
            paino_grammoina: '50',
            arvioitu_matomäärä: '100',
            toimitus: 'nouto',
          }),
          { now }
        )
    );

    expectEqual(weightPayload.product.sku, 'worms-50');
    expectEqual(weightPayload.product.salesUnit, 'weight');
    expectEqual(weightPayload.product.weightGrams, 50);
    expectEqual(weightPayload.product.quantity, 100);
    expectEqual(weightPayload.product.estimatedWormCount, 100);

    const legacyPayload = normalizePublicOrderSubmission(
      createValidOrderFormData({
        tuote_avain: 'worms',
        sku: 'worms-200',
        maara: '200',
        myyntiyksikko: '',
        paino_grammoina: '',
        arvioitu_matomäärä: '',
        toimitus: 'nouto',
      }),
      { now }
    );

    expectEqual(legacyPayload.product.sku, 'worms-200');
    expectEqual(legacyPayload.product.salesUnit, 'worm_count');
    expectEqual(legacyPayload.product.weightGrams, null);
    expectEqual(legacyPayload.product.quantity, 200);
    expectEqual(legacyPayload.pricing.itemPrice, 50);

    const starterKitPayload = normalizePublicOrderSubmission(
      createValidOrderFormData({
        tuote_avain: 'starterKit',
        sku: 'starterkit-50',
        maara: '50',
        myyntiyksikko: 'weight',
        paino_grammoina: '50',
        arvioitu_matomäärä: '100',
        toimitus: 'nouto',
      }),
      { now }
    );

    expectEqual(starterKitPayload.product.sku, 'starterkit-50');
    expectEqual(starterKitPayload.product.salesUnit, 'weight');
    expectEqual(starterKitPayload.product.weightGrams, 50);
    expectEqual(starterKitPayload.product.quantity, 100);
    expectEqual(starterKitPayload.pricing.itemPrice, 76);

    const legacyStarterKitPayload = normalizePublicOrderSubmission(
      createValidOrderFormData({
        tuote_avain: 'starterKit',
        sku: 'starterkit-200',
        maara: '200',
        myyntiyksikko: '',
        paino_grammoina: '',
        arvioitu_matomäärä: '',
        toimitus: 'nouto',
      }),
      { now }
    );

    expectEqual(legacyStarterKitPayload.product.sku, 'starterkit-200');
    expectEqual(legacyStarterKitPayload.product.salesUnit, 'worm_count');
    expectEqual(legacyStarterKitPayload.product.weightGrams, null);
    expectEqual(legacyStarterKitPayload.product.quantity, 200);
    expectEqual(legacyStarterKitPayload.pricing.itemPrice, 91);
  });

  test('normalizePublicOrderSubmission should normalize standalone cart upsells as order items', () => {
    const now = new Date('2026-05-02T10:00:00Z');
    const payload = normalizePublicOrderSubmission(
      createValidOrderFormData({
        sku: '',
        tuote_avain: '',
        cart_items_json: JSON.stringify([
          { sku: 'worms-25', quantity: 1 },
          { sku: 'chow-400', quantity: 1 },
        ]),
        toimitus: 'posti_noutopiste',
        osoite: 'Kompostikuja 1',
        postinumero: '00100',
        toimipaikka: 'Helsinki',
      }),
      { now }
    );

    expectDeepEqual(
      payload.items.map((item) => ({
        sku: item.sku,
        packageQuantity: item.packageQuantity,
        itemTotal: item.itemTotal,
      })),
      [
        {
          sku: 'worms-25',
          packageQuantity: 1,
          itemTotal: 20,
        },
        {
          sku: 'chow-400',
          packageQuantity: 1,
          itemTotal: 8.9,
        },
      ],
      'normalizePublicOrderSubmission should keep each standalone cart SKU in the forwarded items payload'
    );
    expectEqual(
      payload.product.sku,
      'worms-25',
      'normalizePublicOrderSubmission should keep the first cart line as the compatibility product payload'
    );
    expectEqual(
      payload.pricing.itemPrice,
      28.9,
      'normalizePublicOrderSubmission should subtotal standalone cart items'
    );
    expectEqual(
      payload.pricing.shippingPrice,
      8.9,
      'normalizePublicOrderSubmission should use shared cart shipping prices'
    );
    expectEqual(
      payload.pricing.total,
      37.8,
      'normalizePublicOrderSubmission should include standalone cart items and shipping in the total'
    );
    expectDeepEqual(
      payload.pricing.extraCharges,
      [],
      'normalizePublicOrderSubmission should not attach cart upsells as legacy extra charges'
    );
  });

  test('normalizePublicOrderSubmission should reject cart orders with more than two worm packages', () => {
    const now = new Date('2026-05-02T10:00:00Z');

    assert.throws(
      () =>
        normalizePublicOrderSubmission(
          createValidOrderFormData({
            sku: '',
            tuote_avain: '',
            cart_items_json: JSON.stringify([{ sku: 'worms-25', quantity: 3 }]),
            toimitus: 'nouto',
          }),
          { now }
        ),
      (error) => {
        assert.ok(
          error instanceof PublicOrderValidationError,
          'normalizePublicOrderSubmission should throw a PublicOrderValidationError for cart quantity limits'
        );
        assert.match(
          error.publicMessage,
          /enintään 1 matopaketti/,
          'normalizePublicOrderSubmission should explain the one-worm-package cart limit'
        );
        return true;
      }
    );
  });

  test('normalizePublicOrderSubmission should reject cart orders with more than two chow products', () => {
    const now = new Date('2026-05-02T10:00:00Z');

    assert.throws(
      () =>
        normalizePublicOrderSubmission(
          createValidOrderFormData({
            sku: '',
            tuote_avain: '',
            cart_items_json: JSON.stringify([{ sku: 'chow-400', quantity: 5 }]),
            toimitus: 'nouto',
          }),
          { now }
        ),
      (error) => {
        assert.ok(
          error instanceof PublicOrderValidationError,
          'normalizePublicOrderSubmission should throw a PublicOrderValidationError for chow quantity limits'
        );
        assert.match(
          error.publicMessage,
          /enintään 2 kuituseosta/,
          'normalizePublicOrderSubmission should explain the two-chow-product cart limit'
        );
        return true;
      }
    );
  });

  test('normalizePublicOrderSubmission should preserve the rendered earliest shipping date snapshot', () => {
    const scenario = findOrderScenario({ fulfillmentType: 'pickup_point' });

    if (!scenario) {
      return;
    }

    const payload = normalizePublicOrderSubmission(
      createValidOrderFormDataForScenario(scenario, {
        availability_earliest_shipping_date: '2026-05-04',
      }),
      {
        now: new Date('2026-04-05T10:00:00Z'),
      }
    );

    expectEqual(
      payload.availability.earliestShippingDate,
      '2026-05-04',
      'normalizePublicOrderSubmission should preserve the storefront-rendered earliest shipping date'
    );
  });

  test('normalizePublicOrderSubmission should ignore invalid availability snapshot dates', () => {
    const scenario = findOrderScenario({ fulfillmentType: 'pickup_point' });

    if (!scenario) {
      return;
    }

    const payload = normalizePublicOrderSubmission(
      createValidOrderFormDataForScenario(scenario, {
        availability_earliest_shipping_date: 'not-a-date',
      }),
      {
        now: new Date('2026-04-05T10:00:00Z'),
      }
    );

    expectEqual(
      payload.availability.earliestShippingDate,
      '',
      'normalizePublicOrderSubmission should not keep invalid availability snapshot dates'
    );
  });

  test('normalizePublicOrderSubmission should require the full address for Posti deliveries', () => {
    const scenario =
      findOrderScenario({ fulfillmentType: 'pickup_point' }) ??
      findOrderScenario({ fulfillmentType: 'home_delivery' });

    if (!scenario) {
      return;
    }

    assert.throws(
      () =>
        normalizePublicOrderSubmission(
          createValidOrderFormDataForScenario(scenario, {
            osoite: '',
            postinumero: '00100',
            toimipaikka: 'Helsinki',
          })
        ),
      (error) => {
        expectOk(
          error instanceof PublicOrderValidationError,
          'normalizePublicOrderSubmission should throw a PublicOrderValidationError when a Posti address is incomplete'
        );
        expectEqual(
          error.publicMessage,
          'Täytä kaikki pakolliset kentät ennen lähetystä.',
          'normalizePublicOrderSubmission should require the full address for Posti orders'
        );
        return true;
      },
      'normalizePublicOrderSubmission should reject pickup-point orders that are missing the street address'
    );
  });

  test('normalizePublicOrderSubmission should reject honeypot spam when the hidden field is filled', () => {
    assert.throws(
      () =>
        normalizePublicOrderSubmission(
          createValidOrderFormData({
            _gotcha: 'bot',
          })
        ),
      (error) => {
        expectOk(
          error instanceof PublicOrderValidationError,
          'normalizePublicOrderSubmission should throw a PublicOrderValidationError for honeypot spam'
        );
        expectEqual(
          error.code,
          'spam',
          'normalizePublicOrderSubmission should tag honeypot submissions with the spam error code'
        );
        expectEqual(
          error.statusCode,
          200,
          'normalizePublicOrderSubmission should soft-accept honeypot spam with HTTP 200 semantics'
        );
        return true;
      },
      'normalizePublicOrderSubmission should throw when the honeypot field is filled'
    );
  });

  test('normalizePublicOrderSubmission should reject submissions that arrive too quickly after the form render', () => {
    assert.throws(
      () =>
        normalizePublicOrderSubmission(createValidOrderFormData(), {
          now: new Date(Number('1700000000000') + 1000),
        }),
      (error) => {
        expectOk(
          error instanceof PublicOrderValidationError,
          'normalizePublicOrderSubmission should throw a PublicOrderValidationError for too-fast submissions'
        );
        expectEqual(
          error.code,
          'too_fast',
          'normalizePublicOrderSubmission should tag too-fast submissions with the too_fast error code'
        );
        return true;
      },
      'normalizePublicOrderSubmission should throw when the form is submitted suspiciously fast'
    );
  });

  test('normalizePublicOrderSubmission should reject product tampering when the product key and sku do not match', () => {
    const scenario = findOrderScenario();

    if (!scenario) {
      return;
    }

    assert.throws(
      () =>
        normalizePublicOrderSubmission(
          createValidOrderFormData({
            tuote_avain: 'tampered-product',
            sku: scenario.variant.sku,
          })
        ),
      (error) => {
        expectOk(
          error instanceof PublicOrderValidationError,
          'normalizePublicOrderSubmission should throw a PublicOrderValidationError for product tampering'
        );
        expectEqual(
          error.publicMessage,
          'Tilauksen tuotetietoja ei voitu varmistaa. Päivitä sivu ja yritä uudelleen.',
          'normalizePublicOrderSubmission should return the product-verification message when the product key and sku do not match'
        );
        return true;
      },
      'normalizePublicOrderSubmission should throw when the submitted product key and sku conflict'
    );
  });

  test('normalizePublicOrderSubmission should reject temporarily unavailable configured SKUs', () => {
    const scenario = findOrderScenario();

    if (!scenario) {
      return;
    }

    const unavailableSku = getRequiredProductSku(
      scenario.productKey,
      'normalizePublicOrderSubmission unavailable-SKU test needs at least one configured SKU'
    );

    withTemporaryProductAvailability(
      scenario.productKey,
      {
        unavailableSkus: [unavailableSku],
      },
      () => {
        assert.throws(
          () =>
            normalizePublicOrderSubmission(
              createValidOrderFormData({
                sku: unavailableSku,
              })
            ),
          (error) => {
            expectOk(
              error instanceof PublicOrderValidationError,
              'normalizePublicOrderSubmission should throw a PublicOrderValidationError for unavailable SKUs'
            );
            expectEqual(
              error.publicMessage,
              'Valittu pakkauskoko ei ole tällä hetkellä saatavilla. Päivitä sivu ja yritä uudelleen.',
              'normalizePublicOrderSubmission should return the unavailable-SKU message'
            );
            return true;
          },
          'normalizePublicOrderSubmission should throw when the selected SKU is unavailable'
        );
      }
    );
  });
});
