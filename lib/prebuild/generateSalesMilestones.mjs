import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  createAvailableSalesMilestonesSnapshot,
  createUnavailableSalesMilestonesSnapshot,
} from '../commerce/salesMilestones.mjs';

const OUTPUT_FILE = path.join(
  process.cwd(),
  'generated',
  'commerce',
  'sales-milestones.json'
);
const DEFAULT_TIMEOUT_MS = 10000;

async function loadProjectEnvironment() {
  const { default: nextEnvironment } = await import('@next/env');
  const isDevelopment = process.argv.includes('--development');
  const isProduction = process.argv.includes('--production');

  if (isDevelopment && isProduction) {
    throw new Error('Choose either --development or --production, not both.');
  }

  nextEnvironment.loadEnvConfig(process.cwd(), isDevelopment, {
    info() {},
    error(message, error) {
      console.error(message, error);
    },
  });
}

function getRequiredEnvironmentValue(environment, name) {
  const value = String(environment[name] || '').trim();

  if (!value) {
    throw new Error(`Missing required environment variable "${name}".`);
  }

  return value;
}

function getTimeout(environment) {
  const timeout = Number(environment.ORDER_SERVICE_TIMEOUT_MS);
  return Number.isFinite(timeout) && timeout > 0 ? timeout : DEFAULT_TIMEOUT_MS;
}

export function buildSalesSummaryEndpoint(baseUrl) {
  return `${String(baseUrl).replace(/\/+$/, '')}/api/public/sales-summary`;
}

export async function fetchSalesMilestones({
  environment = process.env,
  fetchImplementation = globalThis.fetch,
  generatedAt = new Date(),
} = {}) {
  const serviceUrl = getRequiredEnvironmentValue(environment, 'ORDER_SERVICE_URL');
  const serviceToken = getRequiredEnvironmentValue(environment, 'ORDER_SERVICE_TOKEN');

  if (typeof fetchImplementation !== 'function') {
    throw new Error('A fetch implementation is required.');
  }

  const response = await fetchImplementation(buildSalesSummaryEndpoint(serviceUrl), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-Order-Token': serviceToken,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(getTimeout(environment)),
  });
  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Sales summary request failed with status ${response.status}.`);
  }

  return createAvailableSalesMilestonesSnapshot(responseData, { generatedAt });
}

async function writeSnapshot(snapshot, outputFile = OUTPUT_FILE) {
  await fs.mkdir(path.dirname(outputFile), { recursive: true });

  const temporaryFile = `${outputFile}.${process.pid}.tmp`;
  await fs.writeFile(temporaryFile, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  await fs.rename(temporaryFile, outputFile);
}

export async function generateSalesMilestones({
  environment = process.env,
  fetchImplementation = globalThis.fetch,
  generatedAt = new Date(),
  outputFile = OUTPUT_FILE,
  logger = console,
} = {}) {
  let snapshot;

  try {
    snapshot = await fetchSalesMilestones({
      environment,
      fetchImplementation,
      generatedAt,
    });
    logger.log('Sales milestones snapshot generated.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn(`Sales milestones are unavailable; the site will hide them. ${message}`);
    snapshot = createUnavailableSalesMilestonesSnapshot({ generatedAt });
  }

  await writeSnapshot(snapshot, outputFile);
  return snapshot;
}

const entryFile = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (entryFile && fileURLToPath(import.meta.url) === entryFile) {
  loadProjectEnvironment()
    .then(() => generateSalesMilestones())
    .catch((error) => {
      console.error('Could not write the sales milestones snapshot:', error);
      process.exitCode = 1;
    });
}
