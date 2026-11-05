import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, before, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { obfuscateDiscountCode } from '@/lib/discounts/discountCode.mjs';

// prepareDiscounts.mjs runs on import and reads its files relative to the
// working directory. Each case runs the script in a child process inside a
// temporary directory, so the repository's own data is never read or written.
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const scriptPath = path.join(rootDir, 'lib', 'prebuild', 'prepareDiscounts.mjs');
const pricingSource = path.join(
  rootDir,
  'data',
  'operations',
  'commerce',
  'pricing.json'
);

let tempRoot;
let productSku;
let postageSku;

before(() => {
  tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lieromaa-prepare-discounts-'));
  const prices = JSON.parse(fs.readFileSync(pricingSource, 'utf8')).prices ?? {};
  productSku = Object.keys(prices).find((sku) => !sku.startsWith('postage-'));
  postageSku = Object.keys(prices).find((sku) => sku.startsWith('postage-'));
  assert.ok(productSku, 'the pricing file should contain at least one product SKU');
});

after(() => {
  fs.rmSync(tempRoot, { recursive: true, force: true });
});

let caseNumber = 0;

function runPrepare(discounts) {
  caseNumber += 1;
  const cwd = path.join(tempRoot, `case-${caseNumber}`);
  const commerceDir = path.join(cwd, 'data', 'operations', 'commerce');
  fs.mkdirSync(commerceDir, { recursive: true });
  // The real price list keeps the worm hunt discount (added by the script when
  // the hunt is on) valid; the tests pick their SKU from it at run time.
  fs.copyFileSync(pricingSource, path.join(commerceDir, 'pricing.json'));
  fs.writeFileSync(
    path.join(commerceDir, 'discounts.source.json'),
    JSON.stringify({ discounts }, null, 2)
  );

  const result = spawnSync(process.execPath, [scriptPath], { cwd, encoding: 'utf8' });
  const outputFile = path.join(cwd, 'generated', 'commerce', 'discounts.json');

  return {
    status: result.status,
    stderr: result.stderr,
    output: fs.existsSync(outputFile)
      ? JSON.parse(fs.readFileSync(outputFile, 'utf8'))
      : null,
  };
}

function validDiscount(overrides = {}) {
  return {
    id: 'test-discount',
    obfuscatedCode: obfuscateDiscountCode('TESTIKOODI'),
    type: 'percentage',
    value: 15,
    endsOn: '2026-12-31',
    appliesToSkus: [productSku],
    ...overrides,
  };
}

function assertRejected(result, fragment) {
  assert.equal(result.status, 1, `the script should fail: ${result.stderr}`);
  assert.ok(
    result.stderr.includes(fragment),
    `the error should mention ${JSON.stringify(fragment)}, got: ${result.stderr}`
  );
  assert.equal(result.output, null, 'no runtime file should be written');
}

describe('prepareDiscounts validation', () => {
  test('a valid discount is written to the runtime file without a plain code', () => {
    const result = runPrepare([validDiscount()]);

    assert.equal(result.status, 0, result.stderr);
    const written = result.output.discounts.find(({ id }) => id === 'test-discount');
    assert.ok(written);
    assert.equal(written.obfuscatedCode, obfuscateDiscountCode('TESTIKOODI'));
    assert.equal('code' in written, false);
  });

  test('all supported types are accepted', () => {
    const result = runPrepare([
      validDiscount({ id: 'p', type: 'percentage', value: 100 }),
      validDiscount({ id: 'f', type: 'fixed', value: 5 }),
      validDiscount({ id: 's', type: 'free_shipping', value: undefined }),
    ]);

    assert.equal(result.status, 0, result.stderr);
  });

  test('an unknown type is rejected', () => {
    assertRejected(runPrepare([validDiscount({ type: 'bogo' })]), 'invalid type "bogo"');
  });

  test('an unknown SKU is rejected', () => {
    assertRejected(
      runPrepare([validDiscount({ appliesToSkus: [productSku, 'no-such-sku'] })]),
      'invalid SKU "no-such-sku"'
    );
  });

  test('a postage SKU is not a valid discount target', (t) => {
    if (!postageSku) {
      t.skip('the price list has no postage SKU');
      return;
    }
    assertRejected(
      runPrepare([validDiscount({ appliesToSkus: [postageSku] })]),
      `invalid SKU "${postageSku}"`
    );
  });

  test('an empty SKU list is rejected', () => {
    assertRejected(runPrepare([validDiscount({ appliesToSkus: [] })]), 'appliesToSkus');
  });

  test('an end date in the wrong format or missing is rejected', () => {
    for (const endsOn of [
      '31.12.2026',
      '2026-12-31T23:59:59Z',
      '2026-1-5',
      '',
      undefined,
    ]) {
      assertRejected(runPrepare([validDiscount({ endsOn })]), 'endsOn');
    }
  });

  test('a plain-text code is rejected so it never reaches the repository output', () => {
    assertRejected(
      runPrepare([validDiscount({ code: 'TESTIKOODI' })]),
      'must not contain code'
    );
  });

  test('a missing obfuscated code is rejected', () => {
    assertRejected(
      runPrepare([validDiscount({ obfuscatedCode: '  ' })]),
      'must contain obfuscatedCode'
    );
  });

  test('a percentage outside 1-100 and a non-positive fixed amount are rejected', () => {
    assertRejected(runPrepare([validDiscount({ value: 101 })]), 'percentage value');
    assertRejected(runPrepare([validDiscount({ value: '10' })]), 'percentage value');
    assertRejected(
      runPrepare([validDiscount({ type: 'fixed', value: 0 })]),
      'fixed value'
    );
  });

  test('the error names the position of the invalid entry', () => {
    assertRejected(
      runPrepare([validDiscount({ id: 'ok' }), validDiscount({ id: 'bad', type: 'x' })]),
      '[discount 2]'
    );
  });

  test.todo(
    'two discounts that are valid at the same time cannot share a code (VIKA: ostoskori käyttää vain ensimmäistä)',
    () => {
      const result = runPrepare([
        validDiscount({ id: 'a' }),
        validDiscount({ id: 'b', value: 20 }),
      ]);

      assert.equal(result.status, 1);
    }
  );
});
