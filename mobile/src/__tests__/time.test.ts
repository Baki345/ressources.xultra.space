import { fmtRelTime } from '../time';

test('formats seconds, minutes, hours, days, weeks, months and years, matching the site\'s thresholds', () => {
  const now = Date.now();
  const ago = (ms: number) => new Date(now - ms).toISOString();

  expect(fmtRelTime(ago(30 * 1000))).toBe('30s');
  expect(fmtRelTime(ago(5 * 60 * 1000))).toBe('5min');
  expect(fmtRelTime(ago(3 * 3600 * 1000))).toBe('3h');
  expect(fmtRelTime(ago(2 * 86400 * 1000))).toBe('2j');
  expect(fmtRelTime(ago(14 * 86400 * 1000))).toBe('2sem');
  expect(fmtRelTime(ago(70 * 86400 * 1000))).toBe('2mois');
  expect(fmtRelTime(ago(400 * 86400 * 1000))).toBe('1an');
});

test('returns an empty string for a missing date, never "NaN" or a crash', () => {
  expect(fmtRelTime(undefined)).toBe('');
  expect(fmtRelTime(null)).toBe('');
  expect(fmtRelTime('')).toBe('');
});
