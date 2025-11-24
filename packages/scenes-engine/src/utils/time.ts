/**
 * Time Utilities for Scenes Engine
 * Date manipulation and time bucket helpers
 */

/**
 * Time bucket granularity
 */
export type TimeBucket = 'day' | 'week' | 'month' | 'quarter' | 'year';

/**
 * Format a date to YYYY-MM-DD string
 */
export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the start of a time bucket for a given date
 */
export function getTimeBucketStart(date: Date, bucket: TimeBucket): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  switch (bucket) {
    case 'day':
      // Already at start of day
      break;

    case 'week':
      // Move to Monday (start of week)
      const dayOfWeek = result.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust Sunday (0) to -6
      result.setDate(result.getDate() + diff);
      break;

    case 'month':
      result.setDate(1);
      break;

    case 'quarter':
      const currentMonth = result.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      result.setMonth(quarterStartMonth);
      result.setDate(1);
      break;

    case 'year':
      result.setMonth(0);
      result.setDate(1);
      break;
  }

  return result;
}

/**
 * Get the end of a time bucket for a given date
 */
export function getTimeBucketEnd(date: Date, bucket: TimeBucket): Date {
  const start = getTimeBucketStart(date, bucket);
  const result = new Date(start);

  switch (bucket) {
    case 'day':
      result.setDate(result.getDate() + 1);
      break;

    case 'week':
      result.setDate(result.getDate() + 7);
      break;

    case 'month':
      result.setMonth(result.getMonth() + 1);
      break;

    case 'quarter':
      result.setMonth(result.getMonth() + 3);
      break;

    case 'year':
      result.setFullYear(result.getFullYear() + 1);
      break;
  }

  // Subtract 1ms to get the end of the previous bucket
  result.setMilliseconds(-1);
  return result;
}

/**
 * Generate an array of time buckets between two dates
 */
export function generateTimeBuckets(
  startDate: Date,
  endDate: Date,
  bucket: TimeBucket
): Date[] {
  const buckets: Date[] = [];
  let current = getTimeBucketStart(startDate, bucket);
  const end = getTimeBucketStart(endDate, bucket);

  while (current <= end) {
    buckets.push(new Date(current));

    // Move to next bucket
    switch (bucket) {
      case 'day':
        current.setDate(current.getDate() + 1);
        break;
      case 'week':
        current.setDate(current.getDate() + 7);
        break;
      case 'month':
        current.setMonth(current.getMonth() + 1);
        break;
      case 'quarter':
        current.setMonth(current.getMonth() + 3);
        break;
      case 'year':
        current.setFullYear(current.getFullYear() + 1);
        break;
    }
  }

  return buckets;
}

/**
 * Get a date N buckets ago from now
 */
export function getBucketsAgo(n: number, bucket: TimeBucket): Date {
  const now = new Date();
  const result = getTimeBucketStart(now, bucket);

  switch (bucket) {
    case 'day':
      result.setDate(result.getDate() - n);
      break;
    case 'week':
      result.setDate(result.getDate() - n * 7);
      break;
    case 'month':
      result.setMonth(result.getMonth() - n);
      break;
    case 'quarter':
      result.setMonth(result.getMonth() - n * 3);
      break;
    case 'year':
      result.setFullYear(result.getFullYear() - n);
      break;
  }

  return result;
}

/**
 * Get date range for common time periods
 */
export function getDateRange(
  period: 'last7days' | 'last30days' | 'last90days' | 'lastYear' | 'ytd' | 'allTime'
): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  let start: Date;

  switch (period) {
    case 'last7days':
      start = new Date(now);
      start.setDate(start.getDate() - 7);
      break;

    case 'last30days':
      start = new Date(now);
      start.setDate(start.getDate() - 30);
      break;

    case 'last90days':
      start = new Date(now);
      start.setDate(start.getDate() - 90);
      break;

    case 'lastYear':
      start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      break;

    case 'ytd':
      start = new Date(now.getFullYear(), 0, 1);
      break;

    case 'allTime':
      start = new Date('2020-01-01'); // Reasonable earliest date
      break;
  }

  start.setHours(0, 0, 0, 0);

  return { start, end };
}

/**
 * Check if a date falls within a time bucket
 */
export function isDateInBucket(date: Date, bucketStart: Date, bucket: TimeBucket): boolean {
  const start = getTimeBucketStart(bucketStart, bucket);
  const end = getTimeBucketEnd(bucketStart, bucket);

  return date >= start && date <= end;
}

/**
 * Get a human-readable label for a time bucket
 */
export function getTimeBucketLabel(date: Date, bucket: TimeBucket): string {
  const start = getTimeBucketStart(date, bucket);

  switch (bucket) {
    case 'day':
      return formatDateString(start);

    case 'week':
      const weekEnd = new Date(start);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return `Week of ${formatDateString(start)}`;

    case 'month':
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[start.getMonth()]} ${start.getFullYear()}`;

    case 'quarter':
      const quarter = Math.floor(start.getMonth() / 3) + 1;
      return `Q${quarter} ${start.getFullYear()}`;

    case 'year':
      return `${start.getFullYear()}`;
  }
}

/**
 * Calculate the number of days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  return Math.floor((utc2 - utc1) / msPerDay);
}
