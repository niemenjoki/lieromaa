import assert from 'node:assert/strict';
import { inspect } from 'node:util';

function formatValue(value) {
  return inspect(value, {
    depth: 6,
    breakLength: Infinity,
    compact: true,
  });
}

export function expectEqual(actual, expected, behavior) {
  assert.equal(
    actual,
    expected,
    `${behavior}. Expected ${formatValue(expected)}, but got ${formatValue(actual)} instead.`
  );
}

export function expectDeepEqual(actual, expected, behavior) {
  assert.deepEqual(
    actual,
    expected,
    `${behavior}. Expected ${formatValue(expected)}, but got ${formatValue(actual)} instead.`
  );
}

export function expectOk(value, behavior) {
  assert.ok(value, `${behavior}. Got ${formatValue(value)} instead.`);
}
