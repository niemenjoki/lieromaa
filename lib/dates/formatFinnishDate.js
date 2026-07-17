import { formatDate } from '@/lib/i18n/formatters.mjs';

export function formatFinnishDate(date, style = 'long') {
  return formatDate(date, 'fi', style);
}
