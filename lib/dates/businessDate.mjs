export const BUSINESS_TIME_ZONE = 'Europe/Helsinki';

const businessDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: BUSINESS_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const businessOffsetFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: BUSINESS_TIME_ZONE,
  timeZoneName: 'longOffset',
});

function getPart(parts, type) {
  return parts.find((part) => part.type === type)?.value ?? '';
}

function isDateOnly(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
}

function getBusinessUtcOffset(dateOnly) {
  const offsetName = getPart(
    businessOffsetFormatter.formatToParts(new Date(`${dateOnly}T12:00:00Z`)),
    'timeZoneName'
  );
  const match = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(offsetName);

  if (!match) {
    throw new Error(`Could not resolve ${BUSINESS_TIME_ZONE} offset for ${dateOnly}`);
  }

  const [, sign, hours, minutes = '00'] = match;
  return `${sign}${hours.padStart(2, '0')}:${minutes}`;
}

export function getBusinessDateOnly(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const parts = businessDateFormatter.formatToParts(date);
  return `${getPart(parts, 'year')}-${getPart(parts, 'month')}-${getPart(parts, 'day')}`;
}

export function formatBusinessDateTime(dateOnly, time = '00:00:00') {
  if (!isDateOnly(dateOnly) || !/^\d{2}:\d{2}:\d{2}$/.test(time)) {
    return '';
  }

  return `${dateOnly}T${time}${getBusinessUtcOffset(dateOnly)}`;
}
