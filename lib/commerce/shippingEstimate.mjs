import { adjustShippingDateForDeliveryBreak } from './deliveryBreak.mjs';

export const BUSINESS_TIME_ZONE = 'Europe/Helsinki';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const SUNDAY = 0;
const SATURDAY_CUTOFF_PRODUCT_KEYS = new Set(['worms', 'compostChow']);
const STARTER_KIT_PRODUCT_KEY = 'starterKit';
const STARTER_KIT_LAST_PRE_BREAK_ORDER_DATE = '2026-06-21';

function normalizeProductKeys(productKeys = []) {
  return [...new Set(productKeys.map((key) => String(key || '').trim()).filter(Boolean))];
}

export function parseIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return parsedDate.toISOString().slice(0, 10) === value ? parsedDate : null;
}

function normalizeDateInput(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(
      Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate())
    );
  }

  if (typeof value === 'string') {
    return parseIsoDate(value);
  }

  return null;
}

function normalizeBusinessDateInput(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return getTodayInBusinessTimeZone(value);
  }

  return normalizeDateInput(value);
}

export function formatIsoDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayInBusinessTimeZone(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(now);
  const valueByType = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return new Date(
    Date.UTC(
      Number(valueByType.year),
      Number(valueByType.month) - 1,
      Number(valueByType.day)
    )
  );
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

export function getFollowingMonday(date, weeksAhead = 1) {
  const day = date.getUTCDay();
  const daysUntilMonday = (8 - day) % 7 || 7;
  return addDays(date, daysUntilMonday + (weeksAhead - 1) * 7);
}

export function getMondayAfterSaturdayCutoff(date) {
  const day = date.getUTCDay();
  const firstFollowingMonday = getFollowingMonday(date, 1);

  return day === SUNDAY ? addDays(firstFollowingMonday, 7) : firstFollowingMonday;
}

export function getNextBusinessDay(date) {
  let nextDate = addDays(date, 1);

  while (nextDate.getUTCDay() === 0 || nextDate.getUTCDay() === 6) {
    nextDate = addDays(nextDate, 1);
  }

  return nextDate;
}

function hasSaturdayCutoffProduct(productKeys) {
  return productKeys.some((productKey) => SATURDAY_CUTOFF_PRODUCT_KEYS.has(productKey));
}

function getDeliveryBreakCutoffDate(productKeys) {
  return productKeys.includes(STARTER_KIT_PRODUCT_KEY)
    ? STARTER_KIT_LAST_PRE_BREAK_ORDER_DATE
    : undefined;
}

export function getBaseEstimatedShippingDate({ productKeys = [], orderDate }) {
  const normalizedProductKeys = normalizeProductKeys(productKeys);
  const normalizedOrderDate =
    normalizeBusinessDateInput(orderDate) ?? getTodayInBusinessTimeZone();

  if (normalizedProductKeys.includes(STARTER_KIT_PRODUCT_KEY)) {
    return getFollowingMonday(normalizedOrderDate, 2);
  }

  if (hasSaturdayCutoffProduct(normalizedProductKeys)) {
    return getMondayAfterSaturdayCutoff(normalizedOrderDate);
  }

  return getNextBusinessDay(normalizedOrderDate);
}

export function getEstimatedShippingDate({
  productKeys = [],
  availabilityDatesByProductKey = {},
  orderDate = getTodayInBusinessTimeZone(),
} = {}) {
  const normalizedProductKeys = normalizeProductKeys(productKeys);
  const normalizedOrderDate =
    normalizeBusinessDateInput(orderDate) ?? getTodayInBusinessTimeZone();
  let estimatedDate = getBaseEstimatedShippingDate({
    productKeys: normalizedProductKeys,
    orderDate: normalizedOrderDate,
  });

  for (const productKey of normalizedProductKeys) {
    const parsedDate = parseIsoDate(availabilityDatesByProductKey[productKey]);

    if (parsedDate && parsedDate.getTime() > estimatedDate.getTime()) {
      estimatedDate = parsedDate;
    }
  }

  return adjustShippingDateForDeliveryBreak({
    estimatedShippingDate: formatIsoDate(estimatedDate),
    orderDate: formatIsoDate(normalizedOrderDate),
    lastPreBreakOrderDate: getDeliveryBreakCutoffDate(normalizedProductKeys),
  });
}

export function getVisibleEarliestShippingDate({
  earliestShippingDate,
  normalHandlingWindowDays,
  now = new Date(),
}) {
  if (!earliestShippingDate) {
    return false;
  }

  if (!Number.isFinite(normalHandlingWindowDays) || normalHandlingWindowDays < 0) {
    return earliestShippingDate;
  }

  const referenceDate = normalizeBusinessDateInput(now) ?? getTodayInBusinessTimeZone();
  const targetDate = parseIsoDate(earliestShippingDate);
  if (!targetDate) {
    return false;
  }

  const daysUntilShipping = Math.round(
    (targetDate.getTime() - referenceDate.getTime()) / DAY_IN_MS
  );

  return daysUntilShipping > normalHandlingWindowDays ? earliestShippingDate : false;
}
