import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import { getProductCartAddOns, getProductVariants } from '@/lib/pricing/catalog';

describe('product cart actions', () => {
  test('keeps the small fibre mix as a worm add-on and only the large pack standalone', () => {
    assert.deepEqual(
      getProductVariants('compostChow').map((variant) => variant.sku),
      ['chow-500']
    );
    assert.deepEqual(
      getProductCartAddOns('worms')
        .map((addOn) => addOn.sku)
        .sort(),
      ['chow-150', 'worms-ready-bin-14l']
    );
  });

  test('keeps the primary post-add action on the button contrast color', () => {
    const productStyles = fs.readFileSync(
      path.join(process.cwd(), 'app', '(fi)', 'tuotteet', 'ProductPage.module.css'),
      'utf8'
    );

    assert.match(
      productStyles,
      /\.CartActionLink:not\(\.SecondaryButton\)\s*{\s*color: var\(--text-on-accent\) !important;/
    );
  });
});
