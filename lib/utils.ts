import { clsx } from 'clsx';
import { formatDateWithTimeZone, getDateKey, parseDateValue } from '@/lib/date-utils';

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function formatLongDate(value: Date | string, timeZone?: string | null) {
  return formatDateWithTimeZone(value, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }, timeZone);
}

export function formatDateLabel(value: Date | string, timeZone?: string | null) {
  return formatLongDate(value, timeZone);
}

export function formatShortDate(value: Date | string, timeZone?: string | null) {
  return formatDateWithTimeZone(value, {
    month: 'short',
    day: 'numeric'
  }, timeZone);
}

export function truncateText(value: string, maxLength = 140) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export function toDateInputValue(value: Date | string, timeZone?: string | null) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return getDateKey(value, timeZone);
}

export function fromDateInputValue(value: string) {
  return parseDateValue(value);
}