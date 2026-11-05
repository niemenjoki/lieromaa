import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

import safeRoutes from '@/generated/site/safeRoutes.json';

const require = createRequire(import.meta.url);
const nextConfig = require('../../next.config.js');

function decodePath(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getPathname(destination) {
  return destination.split('#')[0];
}

test('every redirect is permanent and lands on an existing route in one hop', async () => {
  const redirects = await nextConfig.redirects();
  const sources = new Set(redirects.map(({ source }) => decodePath(source)));

  assert.ok(redirects.length > 0, 'next.config.js should define redirects');

  for (const { source, destination, permanent } of redirects) {
    const destinationPath = getPathname(destination);

    assert.equal(permanent, true, `${source} should redirect permanently`);
    assert.notEqual(decodePath(source), destinationPath, `${source} redirects to itself`);
    assert.ok(
      safeRoutes.includes(destinationPath),
      `${source} redirects to ${destinationPath}, which is not a site route`
    );
    assert.equal(
      sources.has(destinationPath),
      false,
      `${source} redirects to ${destinationPath}, which redirects again`
    );
    assert.equal(
      encodeURI(destination).includes('%25'),
      false,
      `${destination} should be stored decoded so it is encoded only once`
    );
  }
});

test('retired guide URLs are no longer served as pages', async () => {
  const redirects = await nextConfig.redirects();

  for (const { source } of redirects) {
    const sourcePath = decodePath(source);

    if (!sourcePath.startsWith('/opas/')) {
      continue;
    }

    assert.equal(safeRoutes.includes(sourcePath), false, sourcePath);
  }
});
