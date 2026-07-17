import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

import skuDiscounts from '@/lib/commerce/skuDiscountsSource.mjs';
import { formatBusinessDateTime } from '@/lib/dates/businessDate.mjs';
import { getBasePriceForSku } from '@/lib/pricing/catalog';
import { getScheduledSkuDiscount } from '@/lib/pricing/skuDiscounts.mjs';

const merchantFeedPath = path.join(process.cwd(), 'public', 'google-merchant-feed.xml');

test('Merchant feed includes configured sale prices and effective dates', () => {
  const feed = fs.readFileSync(merchantFeedPath, 'utf8');

  for (const sku of Object.keys(skuDiscounts)) {
    const discount = getScheduledSkuDiscount({
      sku,
      basePrice: getBasePriceForSku(sku),
    });
    if (!discount) {
      continue;
    }

    const itemStart = feed.indexOf(`<g:id>${sku}</g:id>`);
    assert.notEqual(itemStart, -1, `Merchant feed should contain SKU "${sku}"`);

    const itemEnd = feed.indexOf('</item>', itemStart);
    const item = feed.slice(itemStart, itemEnd);
    assert.ok(
      item.includes(
        `<g:sale_price>${discount.discountedPrice.toFixed(2)} EUR</g:sale_price>`
      ),
      `Merchant feed should contain the scheduled sale price for "${sku}"`
    );

    if (discount.validFrom) {
      const expectedRange = `${formatBusinessDateTime(discount.validFrom)}/${formatBusinessDateTime(discount.validUntil, '23:59:59')}`;
      assert.ok(
        item.includes(
          `<g:sale_price_effective_date>${expectedRange}</g:sale_price_effective_date>`
        ),
        `Merchant feed should contain the scheduled sale dates for "${sku}"`
      );
    }
  }
});

test('Merchant feed remains Finnish-only with Finnish product URLs and FI shipping', () => {
  const feed = fs.readFileSync(merchantFeedPath, 'utf8');

  assert.match(feed, /Tuotefeed Lieromaan Google Merchant Centeria varten\./);
  assert.match(feed, /<g:country>FI<\/g:country>/);
  assert.match(feed, /https:\/\/www\.lieromaa\.fi\/tuotteet\/madot/);
  assert.match(feed, /https:\/\/www\.lieromaa\.fi\/tuotteet\/kompostorin-kuituseos/);
  assert.match(feed, /Kompostimadot|kompostorin kuituseos/);
  assert.doesNotMatch(feed, /https:\/\/www\.lieromaa\.fi\/en(?:\/|<)/);
});
