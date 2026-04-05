import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  PublicOrderValidationError,
  normalizePublicOrderSubmission,
} from '@/lib/orders/normalizePublicOrder';

import { expectDeepEqual, expectEqual, expectOk } from '../helpers/assertions.mjs';
import { createValidOrderFormData } from '../helpers/orderForm.mjs';

describe('frontend public order normalization', () => {
  test('normalizePublicOrderSubmission should build the server payload when the public order form is valid', () => {
    const now = new Date('2026-01-15T10:00:00Z');
    const formData = createValidOrderFormData({
      toimitus: 'postitus',
      osoite: 'Kompostikuja 1',
      postinumero: '00100',
      toimipaikka: 'Helsinki',
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
      'postitus',
      'normalizePublicOrderSubmission should keep the selected fulfillment method'
    );
    expectDeepEqual(
      payload.fulfillment.address,
      {
        line1: 'Kompostikuja 1',
        postalCode: '00100',
        city: 'Helsinki',
      },
      'normalizePublicOrderSubmission should map the postal address into the server payload'
    );
    expectEqual(
      payload.product.key,
      'worms',
      'normalizePublicOrderSubmission should keep the product key'
    );
    expectEqual(
      payload.product.sku,
      'worms-100',
      'normalizePublicOrderSubmission should keep the selected SKU'
    );
    expectEqual(
      payload.pricing.shippingPrice,
      8.9,
      'normalizePublicOrderSubmission should calculate the worm postal shipping price as 8.9 EUR'
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
      38.9,
      'normalizePublicOrderSubmission should produce a 38.9 EUR total for the winter postal worm order'
    );
  });

  test('normalizePublicOrderSubmission should keep frost protection selected but uncharged outside the configured season', () => {
    const payload = normalizePublicOrderSubmission(
      createValidOrderFormData({
        toimitus: 'postitus',
        osoite: 'Kompostikuja 1',
        postinumero: '00100',
        toimipaikka: 'Helsinki',
        pakkastoimituslisa: 'maksan',
        alennuskoodi: 'ei-ole',
      }),
      {
        now: new Date('2026-06-15T10:00:00Z'),
      }
    );

    expectEqual(
      payload.pricing.frostProtectionSelected,
      true,
      'normalizePublicOrderSubmission should preserve the frost protection selection outside the active season'
    );
    expectEqual(
      payload.pricing.frostProtectionPrice,
      0,
      'normalizePublicOrderSubmission should charge 0 EUR for frost protection outside the configured season'
    );
    expectEqual(
      payload.pricing.discount,
      null,
      'normalizePublicOrderSubmission should not attach an invalid discount code to pricing'
    );
    expectEqual(
      payload.pricing.total,
      35.9,
      'normalizePublicOrderSubmission should keep the summer postal worm total at 35.9 EUR'
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
});
