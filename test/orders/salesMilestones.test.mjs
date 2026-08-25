import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, test } from 'node:test';

import {
  createAvailableSalesMilestonesSnapshot,
  createUnavailableSalesMilestonesSnapshot,
  parseSalesMilestonesSnapshot,
  roundSalesMilestoneDown,
} from '@/lib/commerce/salesMilestones.mjs';
import { readSalesMilestonesSnapshot } from '@/lib/commerce/salesMilestones.server.mjs';
import {
  buildSalesSummaryEndpoint,
  generateSalesMilestones,
} from '@/lib/prebuild/generateSalesMilestones.mjs';

const silentLogger = Object.freeze({
  log() {},
  warn() {},
});

describe('sales milestones', () => {
  test('rounds every count down using the configured threshold', () => {
    const cases = new Map([
      [0, 0],
      [4, 0],
      [5, 5],
      [39, 35],
      [99, 95],
      [100, 100],
      [499, 490],
      [500, 500],
      [999, 950],
      [1000, 1000],
      [4687, 4600],
      [4999, 4900],
      [5000, 5000],
      [5499, 5000],
    ]);

    for (const [value, expected] of cases) {
      assert.equal(roundSalesMilestoneDown(value), expected, String(value));
    }
  });

  test('rejects counts that cannot represent database totals', () => {
    for (const value of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, '39']) {
      assert.throws(() => roundSalesMilestoneDown(value), TypeError);
    }
  });

  test('validates and rounds the backend response before creating a public snapshot', () => {
    const snapshot = createAvailableSalesMilestonesSnapshot(
      {
        ok: true,
        totals: {
          estimatedWormsSold: 4687,
          completedOrders: 39,
        },
      },
      { generatedAt: '2026-08-25T12:00:00.000Z' }
    );

    assert.deepEqual(snapshot, {
      schemaVersion: 1,
      available: true,
      generatedAt: '2026-08-25T12:00:00.000Z',
      milestones: {
        estimatedWormsSold: 4600,
        completedOrders: 35,
      },
    });
  });

  test('rejects malformed backend responses', () => {
    const malformedResponses = [
      null,
      { ok: false },
      { ok: true },
      { ok: true, totals: { estimatedWormsSold: 100, completedOrders: -1 } },
      { ok: true, totals: { estimatedWormsSold: '100', completedOrders: 10 } },
      { ok: true, totals: { estimatedWormsSold: 100, completedOrders: 1.5 } },
    ];

    for (const response of malformedResponses) {
      assert.throws(() => createAvailableSalesMilestonesSnapshot(response), TypeError);
    }
  });

  test('accepts an unavailable snapshot without inventing zero totals', () => {
    const snapshot = createUnavailableSalesMilestonesSnapshot({
      generatedAt: '2026-08-25T12:00:00.000Z',
    });

    assert.deepEqual(parseSalesMilestonesSnapshot(snapshot), {
      schemaVersion: 1,
      available: false,
      generatedAt: '2026-08-25T12:00:00.000Z',
    });
    assert.equal('milestones' in snapshot, false);
  });

  test('rejects available artifacts with unrounded or invalid counts', () => {
    assert.throws(
      () =>
        parseSalesMilestonesSnapshot({
          schemaVersion: 1,
          available: true,
          generatedAt: '2026-08-25T12:00:00.000Z',
          milestones: { estimatedWormsSold: 4687, completedOrders: 35 },
        }),
      /unrounded/
    );
    assert.throws(
      () =>
        parseSalesMilestonesSnapshot({
          schemaVersion: 1,
          available: true,
          generatedAt: 'not-a-date',
          milestones: { estimatedWormsSold: 4600, completedOrders: 35 },
        }),
      /generatedAt/
    );
  });

  test('fetches authenticated totals and writes only their rounded values', async (context) => {
    const temporaryDirectory = await fs.mkdtemp(
      path.join(os.tmpdir(), 'lieromaa-sales-milestones-')
    );
    const outputFile = path.join(temporaryDirectory, 'sales-milestones.json');
    context.after(() => fs.rm(temporaryDirectory, { recursive: true, force: true }));

    let request;
    const snapshot = await generateSalesMilestones({
      environment: {
        ORDER_SERVICE_URL: 'https://orders.example.test/',
        ORDER_SERVICE_TOKEN: 'shared-secret',
        ORDER_SERVICE_TIMEOUT_MS: '2500',
      },
      generatedAt: '2026-08-25T12:00:00.000Z',
      outputFile,
      logger: silentLogger,
      fetchImplementation: async (url, options) => {
        request = { url, options };
        return new Response(
          JSON.stringify({
            ok: true,
            totals: { estimatedWormsSold: 4687, completedOrders: 39 },
          }),
          { status: 200 }
        );
      },
    });

    assert.equal(request.url, buildSalesSummaryEndpoint('https://orders.example.test/'));
    assert.equal(request.options.method, 'GET');
    assert.equal(request.options.cache, 'no-store');
    assert.equal(request.options.headers['X-Order-Token'], 'shared-secret');
    assert.deepEqual(snapshot.milestones, {
      estimatedWormsSold: 4600,
      completedOrders: 35,
    });

    const writtenSnapshot = JSON.parse(await fs.readFile(outputFile, 'utf8'));
    assert.deepEqual(writtenSnapshot, snapshot);
    assert.equal(JSON.stringify(writtenSnapshot).includes('4687'), false);
    assert.equal(JSON.stringify(writtenSnapshot).includes('39'), false);
    assert.deepEqual(readSalesMilestonesSnapshot(outputFile), snapshot);
  });

  test('writes an unavailable snapshot after a fetch failure', async (context) => {
    const temporaryDirectory = await fs.mkdtemp(
      path.join(os.tmpdir(), 'lieromaa-sales-milestones-')
    );
    const outputFile = path.join(temporaryDirectory, 'sales-milestones.json');
    context.after(() => fs.rm(temporaryDirectory, { recursive: true, force: true }));

    const snapshot = await generateSalesMilestones({
      environment: {
        ORDER_SERVICE_URL: 'https://orders.example.test',
        ORDER_SERVICE_TOKEN: 'shared-secret',
      },
      generatedAt: '2026-08-25T12:00:00.000Z',
      outputFile,
      logger: silentLogger,
      fetchImplementation: async () => {
        throw new Error('offline');
      },
    });

    assert.deepEqual(snapshot, {
      schemaVersion: 1,
      available: false,
      generatedAt: '2026-08-25T12:00:00.000Z',
    });
    assert.deepEqual(JSON.parse(await fs.readFile(outputFile, 'utf8')), snapshot);
    assert.equal(readSalesMilestonesSnapshot(outputFile)?.available, false);
  });

  test('treats missing and corrupt generated artifacts as unavailable', async (context) => {
    const temporaryDirectory = await fs.mkdtemp(
      path.join(os.tmpdir(), 'lieromaa-sales-milestones-')
    );
    const outputFile = path.join(temporaryDirectory, 'sales-milestones.json');
    context.after(() => fs.rm(temporaryDirectory, { recursive: true, force: true }));

    assert.equal(readSalesMilestonesSnapshot(outputFile), null);
    await fs.writeFile(outputFile, '{not json', 'utf8');
    assert.equal(readSalesMilestonesSnapshot(outputFile), null);
  });
});
