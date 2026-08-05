import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

import safeRoutes from '@/generated/site/safeRoutes.json';

const require = createRequire(import.meta.url);
const nextConfig = require('../../next.config.js');

const OLD_PATH =
  '/opas/kompostorin-perustaminen/voiko-kompostimadot-laittaa-lampokompostoriin';
const NEW_PATH = '/opas/lämpökompostointi/voiko-kompostimadot-laittaa-lampokompostoriin';

test('permanently redirects the former guide category URL to its canonical route', async () => {
  const redirects = await nextConfig.redirects();
  const matchingRedirects = redirects.filter(({ source }) => source === OLD_PATH);

  assert.deepEqual(matchingRedirects, [
    {
      source: OLD_PATH,
      destination: NEW_PATH,
      permanent: true,
    },
  ]);
  assert.equal(
    encodeURI(matchingRedirects[0].destination),
    '/opas/l%C3%A4mp%C3%B6kompostointi/voiko-kompostimadot-laittaa-lampokompostoriin'
  );
  assert.equal(safeRoutes.includes(OLD_PATH), false);
  assert.equal(safeRoutes.includes(NEW_PATH), true);
});
