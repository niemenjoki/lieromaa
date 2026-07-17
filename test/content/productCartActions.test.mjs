import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

describe('product cart actions', () => {
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
