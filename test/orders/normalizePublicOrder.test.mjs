import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  PublicOrderValidationError,
  normalizePublicOrderSubmission,
} from '@/lib/orders/normalizePublicOrder';

import { expectDeepEqual, expectEqual, expectOk } from '../helpers/assertions.mjs';
import { createValidOrderFormData } from '../helpers/orderForm.mjs';

describe('frontend public order normalization', () => {
  test('normalizePublicOrderSubmission should build the server payload for a pickup-point worm order', () => {
    const now = new Date('2026-01-15T10:00:00Z');
    const formData = createValidOrderFormData({
      toimitus: 'posti_noutopiste',
      osoite: 'Kompostikuja 1',
      postinumero: '00100',
      toimipaikka: 'Helsinki',
      pickup_point_id: 'POSTI-001',
      pickup_point_name: 'Posti Pasila',
      pickup_point_street: 'Ratapihantie 6',
      pickup_point_postal_code: '00520',
      pickup_point_city: 'Helsinki',
      pickup_point_specific_location: '1. kerros',
      pickup_point_parcel_locker: 'true',
      pakkastoimituslisa: 'maksan',
    });

    const payload = normalizePublicOrderSubmission(formData, { now });

    expectEqual(
      payload.source,
      'website',
      'normalizePublicOrderSubmission should label website orders with source=website'
    );
    expectEqual(
      payload.sourceRequestId,
      'submission-123',
      'normalizePublicOrderSubmission should preserve the submission id as the source request id'
    );
    expectEqual(
      payload.customer.email,
      'testi@example.com',
      'normalizePublicOrderSubmission should include the customer email in the server payload'
    );
    expectEqual(
      payload.fulfillment.method,
      'posti_noutopiste',
      'normalizePublicOrderSubmission should keep the selected fulfillment method'
    );
    expectDeepEqual(
      payload.fulfillment.address,
      {
        line1: 'Kompostikuja 1',
        postalCode: '00100',
        city: 'Helsinki',
      },
      'normalizePublicOrderSubmission should keep the customer home address in the server payload for pickup-point orders'
    );
    expectDeepEqual(
      payload.fulfillment.searchAddress,
      {
        line1: 'Kompostikuja 1',
        postalCode: '00100',
        city: 'Helsinki',
      },
      'normalizePublicOrderSubmission should preserve the search address for manual handling'
    );
    expectEqual(
      payload.fulfillment.pickupPoint?.name,
      'Posti Pasila',
      'normalizePublicOrderSubmission should include the selected pickup point details'
    );
    expectEqual(
      payload.product.key,
      'worms',
      'normalizePublicOrderSubmission should keep the product key'
    );
    expectEqual(
      payload.product.sku,
      'worms-50',
      'normalizePublicOrderSubmission should keep the selected SKU'
    );
    expectEqual(
      payload.pricing.shippingPrice,
      8.9,
      'normalizePublicOrderSubmission should calculate the worm pickup-point shipping price as 8.9 EUR'
    );
    expectEqual(
      payload.pricing.frostProtectionSelected,
      true,
      'normalizePublicOrderSubmission should mark frost protection as selected when the customer opts in'
    );
    expectEqual(
      payload.pricing.frostProtectionPrice,
      3,
      'normalizePublicOrderSubmission should include the 3 EUR frost surcharge during winter'
    );
    expectEqual(
      payload.pricing.total,
      29.9,
      'normalizePublicOrderSubmission should produce a 29.9 EUR total for the winter pickup-point worm order'
    );
  });

  test('normalizePublicOrderSubmission should allow pickup-point shipping without a selected pickup point', () => {
    const payload = normalizePublicOrderSubmission(
      createValidOrderFormData({
        toimitus: 'posti_noutopiste',
        osoite: 'Kompostikuja 1',
        postinumero: '00100',
        toimipaikka: 'Helsinki',
        lisatiedot: '',
        pakkastoimituslisa: 'maksan',
        alennuskoodi: 'ei-ole',
      }),
      {
        now: new Date('2026-06-15T10:00:00Z'),
      }
    );

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
      26.9,
      'normalizePublicOrderSubmission should keep the summer pickup-point worm total at 26.9 EUR'
    );
  });

  test('normalizePublicOrderSubmission should require the full address for Posti deliveries', () => {
    assert.throws(
      () =>
        normalizePublicOrderSubmission(
          createValidOrderFormData({
            toimitus: 'posti_noutopiste',
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

  test('normalizePublicOrderSubmission should build a starter-kit home-delivery order', () => {
    const payload = normalizePublicOrderSubmission(
      createValidOrderFormData({
        tuote: 'Matokompostorin aloituspakkaus',
        tuote_avain: 'starterKit',
        sku: 'starterkit-50',
        sivu_polku: '/tuotteet/matokompostin-aloituspakkaus',
        toimitus: 'posti_kotiinkuljetus',
        osoite: 'Kompostikuja 1',
        postinumero: '00100',
        toimipaikka: 'Helsinki',
        lisatiedot: '',
      }),
      {
        now: new Date('2026-04-05T10:00:00Z'),
      }
    );

    expectEqual(
      payload.fulfillment.method,
      'posti_kotiinkuljetus',
      'normalizePublicOrderSubmission should support the starter-kit home-delivery method'
    );
    expectDeepEqual(
      payload.fulfillment.address,
      {
        line1: 'Kompostikuja 1',
        postalCode: '00100',
        city: 'Helsinki',
      },
      'normalizePublicOrderSubmission should keep the customer home address for home-delivery orders'
    );
    expectEqual(
      payload.pricing.shippingPrice,
      14.9,
      'normalizePublicOrderSubmission should calculate the starter-kit home-delivery price as 14.9 EUR'
    );
    expectEqual(
      payload.pricing.total,
      78.9,
      'normalizePublicOrderSubmission should produce a 78.9 EUR total for the starter-kit home-delivery order'
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
    assert.throws(
      () =>
        normalizePublicOrderSubmission(
          createValidOrderFormData({
            tuote_avain: 'starterKit',
            sku: 'worms-100',
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

  test('normalizePublicOrderSubmission should reject unavailable worm SKUs', () => {
    assert.throws(
      () =>
        normalizePublicOrderSubmission(
          createValidOrderFormData({
            sku: 'worms-100',
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
      'normalizePublicOrderSubmission should throw when the selected worm SKU is unavailable'
    );
  });
});
