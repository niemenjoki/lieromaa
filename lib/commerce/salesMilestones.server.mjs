import fs from 'node:fs';
import path from 'node:path';
import 'server-only';

import { parseSalesMilestonesSnapshot } from './salesMilestones.mjs';

export const SALES_MILESTONES_FILE = path.join(
  process.cwd(),
  'generated',
  'commerce',
  'sales-milestones.json'
);

export function readSalesMilestonesSnapshot(filePath = SALES_MILESTONES_FILE) {
  try {
    const value = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return parseSalesMilestonesSnapshot(value);
  } catch {
    return null;
  }
}
