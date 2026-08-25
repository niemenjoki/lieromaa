export const SALES_MILESTONES_SCHEMA_VERSION = 1;

function assertCount(value, fieldName) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(`${fieldName} must be a non-negative safe integer.`);
  }

  return value;
}

function normalizeGeneratedAt(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new TypeError('generatedAt must be a valid date.');
  }

  return date.toISOString();
}

export function roundSalesMilestoneDown(value) {
  const count = assertCount(value, 'Sales milestone count');
  const step =
    count >= 5000 ? 500 : count >= 1000 ? 100 : count >= 500 ? 50 : count >= 100 ? 10 : 5;

  return Math.floor(count / step) * step;
}

export function createAvailableSalesMilestonesSnapshot(
  responseData,
  { generatedAt = new Date() } = {}
) {
  if (!responseData || responseData.ok !== true || !responseData.totals) {
    throw new TypeError('Sales summary response is missing valid totals.');
  }

  const estimatedWormsSold = assertCount(
    responseData.totals.estimatedWormsSold,
    'totals.estimatedWormsSold'
  );
  const completedOrders = assertCount(
    responseData.totals.completedOrders,
    'totals.completedOrders'
  );

  return {
    schemaVersion: SALES_MILESTONES_SCHEMA_VERSION,
    available: true,
    generatedAt: normalizeGeneratedAt(generatedAt),
    milestones: {
      estimatedWormsSold: roundSalesMilestoneDown(estimatedWormsSold),
      completedOrders: roundSalesMilestoneDown(completedOrders),
    },
  };
}

export function createUnavailableSalesMilestonesSnapshot({
  generatedAt = new Date(),
} = {}) {
  return {
    schemaVersion: SALES_MILESTONES_SCHEMA_VERSION,
    available: false,
    generatedAt: normalizeGeneratedAt(generatedAt),
  };
}

export function parseSalesMilestonesSnapshot(value) {
  if (
    !value ||
    value.schemaVersion !== SALES_MILESTONES_SCHEMA_VERSION ||
    typeof value.available !== 'boolean'
  ) {
    throw new TypeError('Sales milestones snapshot has an invalid schema.');
  }

  const generatedAt = normalizeGeneratedAt(value.generatedAt);

  if (!value.available) {
    return {
      schemaVersion: SALES_MILESTONES_SCHEMA_VERSION,
      available: false,
      generatedAt,
    };
  }

  const estimatedWormsSold = assertCount(
    value.milestones?.estimatedWormsSold,
    'milestones.estimatedWormsSold'
  );
  const completedOrders = assertCount(
    value.milestones?.completedOrders,
    'milestones.completedOrders'
  );

  if (
    roundSalesMilestoneDown(estimatedWormsSold) !== estimatedWormsSold ||
    roundSalesMilestoneDown(completedOrders) !== completedOrders
  ) {
    throw new TypeError('Sales milestones snapshot contains unrounded counts.');
  }

  return {
    schemaVersion: SALES_MILESTONES_SCHEMA_VERSION,
    available: true,
    generatedAt,
    milestones: {
      estimatedWormsSold,
      completedOrders,
    },
  };
}
