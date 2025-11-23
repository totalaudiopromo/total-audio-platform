/**
 * Date Utilities for A&R Radar
 */

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export function today(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get date N days ago in ISO format
 */
export function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

/**
 * Get date N days from now in ISO format
 */
export function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Convert Date to ISO date string (YYYY-MM-DD)
 */
export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse ISO date string to Date
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Calculate days between two dates
 */
export function daysBetween(start: string | Date, end: string | Date): number {
  const startDate = typeof start === 'string' ? parseISODate(start) : start;
  const endDate = typeof end === 'string' ? parseISODate(end) : end;

  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get start of month in ISO format
 */
export function startOfMonth(date?: Date): string {
  const d = date || new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
}

/**
 * Get end of month in ISO format
 */
export function endOfMonth(date?: Date): string {
  const d = date || new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
}

/**
 * Get start of week (Monday) in ISO format
 */
export function startOfWeek(date?: Date): string {
  const d = date || new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust to Monday
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return monday.toISOString().split('T')[0];
}

/**
 * Get end of week (Sunday) in ISO format
 */
export function endOfWeek(date?: Date): string {
  const d = date || new Date();
  const day = d.getDay();
  const diff = day === 0 ? 0 : 7 - day; // Adjust to Sunday
  const sunday = new Date(d);
  sunday.setDate(d.getDate() + diff);
  return sunday.toISOString().split('T')[0];
}

/**
 * Get date range for last N days
 */
export function lastNDays(days: number): { start_date: string; end_date: string } {
  return {
    start_date: daysAgo(days),
    end_date: today(),
  };
}

/**
 * Get date range for last N months
 */
export function lastNMonths(months: number): { start_date: string; end_date: string } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return {
    start_date: toISODate(startDate),
    end_date: toISODate(endDate),
  };
}

/**
 * Format date for display (e.g., "Nov 17, 2025")
 */
export function formatDisplayDate(dateString: string): string {
  const date = parseISODate(dateString);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date range for display
 */
export function formatDateRange(startDate: string, endDate: string): string {
  return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
}

/**
 * Check if date is within range
 */
export function isDateInRange(
  date: string,
  startDate: string,
  endDate: string
): boolean {
  const d = parseISODate(date);
  const start = parseISODate(startDate);
  const end = parseISODate(endDate);

  return d >= start && d <= end;
}

/**
 * Get quarter number (1-4) for a date
 */
export function getQuarter(date?: Date): number {
  const d = date || new Date();
  return Math.floor(d.getMonth() / 3) + 1;
}

/**
 * Get start of quarter in ISO format
 */
export function startOfQuarter(date?: Date): string {
  const d = date || new Date();
  const quarter = getQuarter(d);
  const month = (quarter - 1) * 3;
  return new Date(d.getFullYear(), month, 1).toISOString().split('T')[0];
}

/**
 * Get end of quarter in ISO format
 */
export function endOfQuarter(date?: Date): string {
  const d = date || new Date();
  const quarter = getQuarter(d);
  const month = quarter * 3;
  return new Date(d.getFullYear(), month, 0).toISOString().split('T')[0];
}

/**
 * Generate array of dates between start and end (inclusive)
 */
export function dateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = parseISODate(startDate);
  const end = parseISODate(endDate);

  while (current <= end) {
    dates.push(toISODate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Group dates into buckets (daily, weekly, monthly)
 */
export function groupByPeriod(
  dates: string[],
  period: 'daily' | 'weekly' | 'monthly'
): Record<string, string[]> {
  const groups: Record<string, string[]> = {};

  dates.forEach(date => {
    let key: string;

    switch (period) {
      case 'daily':
        key = date;
        break;
      case 'weekly':
        key = startOfWeek(parseISODate(date));
        break;
      case 'monthly':
        key = startOfMonth(parseISODate(date));
        break;
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(date);
  });

  return groups;
}

/**
 * Check if date is today
 */
export function isToday(dateString: string): boolean {
  return dateString === today();
}

/**
 * Check if date is in the past
 */
export function isPast(dateString: string): boolean {
  return dateString < today();
}

/**
 * Check if date is in the future
 */
export function isFuture(dateString: string): boolean {
  return dateString > today();
}

/**
 * Get relative time description (e.g., "2 days ago", "in 3 days")
 */
export function relativeTime(dateString: string): string {
  const days = daysBetween(today(), dateString);

  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days === -1) return 'yesterday';
  if (days > 0) return `in ${days} days`;
  return `${Math.abs(days)} days ago`;
}
