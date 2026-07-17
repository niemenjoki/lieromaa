import { assertLanguage, getFormattingLocale } from './config.mjs';

const DATE_STYLES = Object.freeze({
  long: Object.freeze({ day: 'numeric', month: 'long', year: 'numeric' }),
  numeric: Object.freeze({ day: 'numeric', month: 'numeric', year: 'numeric' }),
});

const BUSINESS_TIME_ZONE = 'Europe/Helsinki';

function parseDateValue(value) {
  if (value instanceof Date) {
    return value;
  }

  const stringValue = String(value || '');
  const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(stringValue);
  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  }

  return new Date(stringValue);
}

export function formatDate(value, language, style = 'long') {
  const locale = getFormattingLocale(assertLanguage(language));
  const date = parseDateValue(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Cannot format invalid date "${String(value)}".`);
  }

  return new Intl.DateTimeFormat(locale, {
    ...(DATE_STYLES[style] ?? DATE_STYLES.long),
    timeZone: BUSINESS_TIME_ZONE,
  }).format(date);
}

export function formatNumber(value, language, options = {}) {
  return Number(value || 0).toLocaleString(
    getFormattingLocale(assertLanguage(language)),
    options
  );
}

export function formatPrice(value, language) {
  const numericValue = Number(value) || 0;
  const options =
    numericValue % 1 === 0
      ? {}
      : {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        };

  return formatNumber(numericValue, language, options);
}

export function formatCurrency(value, language) {
  const normalizedLanguage = assertLanguage(language);
  const price = formatPrice(value, normalizedLanguage);
  return `${price} €`;
}

export function formatDistance(distanceInMeters, language) {
  const numericValue = Number(distanceInMeters);
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return '';
  }

  if (numericValue < 1000) {
    return `${Math.round(numericValue)} m`;
  }

  return `${formatNumber(numericValue / 1000, language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km`;
}
