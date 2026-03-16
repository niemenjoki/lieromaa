const FINNISH_DATE_FORMATTERS = {
  long: new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }),
  numeric: new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }),
};

function parseISODate(date) {
  const [year, month, day] = date.split('-').map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}

export function formatFinnishDate(date, style = 'long') {
  const formatter = FINNISH_DATE_FORMATTERS[style] ?? FINNISH_DATE_FORMATTERS.long;

  return formatter.format(parseISODate(date));
}
