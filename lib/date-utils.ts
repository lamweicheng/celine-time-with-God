const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const DEFAULT_APP_TIME_ZONE = 'America/New_York';

export function normalizeTimeZone(timeZone?: string | null) {
  if (!timeZone) {
    return DEFAULT_APP_TIME_ZONE;
  }

  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
    return timeZone;
  } catch {
    return DEFAULT_APP_TIME_ZONE;
  }
}

export function parseDateValue(value: Date | string) {
  if (typeof value === 'string' && DATE_ONLY_PATTERN.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 12);
  }

  return new Date(value);
}

export function getDateParts(value: Date | string, timeZone?: string | null) {
  const normalizedTimeZone = normalizeTimeZone(timeZone);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: normalizedTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(parseDateValue(value));

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value ?? '1970'),
    month: Number(parts.find((part) => part.type === 'month')?.value ?? '01'),
    day: Number(parts.find((part) => part.type === 'day')?.value ?? '01')
  };
}

export function getDateKey(value: Date | string, timeZone?: string | null) {
  const { year, month, day } = getDateParts(value, timeZone);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatDateWithTimeZone(
  value: Date | string,
  options: Intl.DateTimeFormatOptions,
  timeZone?: string | null
) {
  return new Intl.DateTimeFormat('en-US', {
    ...options,
    timeZone: normalizeTimeZone(timeZone)
  }).format(parseDateValue(value));
}

export function getDayOfYearInTimeZone(value = new Date(), timeZone?: string | null) {
  const { year, month, day } = getDateParts(value, timeZone);
  const current = Date.UTC(year, month - 1, day);
  const start = Date.UTC(year, 0, 0);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor((current - start) / oneDay);
}