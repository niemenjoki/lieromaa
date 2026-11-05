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

// Helsingin poikkeama UTC:sta minuutteina annettuna hetkenä.
function getBusinessOffsetMinutesAt(instant) {
  const offsetName = getPart(
    businessOffsetFormatter.formatToParts(instant),
    'timeZoneName'
  );
  if (offsetName === 'GMT') {
    return 0;
  }

  const match = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(offsetName);
  if (!match) {
    throw new Error(
      `Could not resolve ${BUSINESS_TIME_ZONE} offset for ${instant.toISOString()}`
    );
  }

  const [, sign, hours, minutes = '00'] = match;
  return (sign === '-' ? -1 : 1) * (Number(hours) * 60 + Number(minutes));
}

function formatOffset(offsetMinutes) {
  const sign = offsetMinutes < 0 ? '-' : '+';
  const absolute = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, '0');
  const minutes = String(absolute % 60).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
}

// Poikkeama, joka on voimassa Helsingin paikallisena aikana dateOnly time. Kesäajan
// vaihtopäivinä poikkeama vaihtuu kesken päivän, joten se lasketaan juuri tälle hetkelle.
function getBusinessUtcOffset(dateOnly, time) {
  const wallClockAsUtc = new Date(`${dateOnly}T${time}Z`);
  if (Number.isNaN(wallClockAsUtc.getTime())) {
    throw new Error(`Could not resolve ${BUSINESS_TIME_ZONE} offset for ${dateOnly}`);
  }

  const firstGuess = getBusinessOffsetMinutesAt(wallClockAsUtc);
  const offsetMinutes = getBusinessOffsetMinutesAt(
    new Date(wallClockAsUtc.getTime() - firstGuess * 60_000)
  );
  return formatOffset(offsetMinutes);
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

  return `${dateOnly}T${time}${getBusinessUtcOffset(dateOnly, time)}`;
}
