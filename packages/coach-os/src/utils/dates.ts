/**
 * CoachOS Date Utilities
 * Helper functions for date calculations and formatting
 */

/**
 * Get the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get the end of the week (Sunday) for a given date
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get week number of the year
 */
export function getWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d > new Date();
}

/**
 * Get days until a target date
 */
export function daysUntil(targetDate: Date | string): number {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const today = new Date();
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get a friendly relative date string
 */
export function getRelativeDateString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const days = daysUntil(d);

  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 1 && days <= 7) return `In ${days} days`;
  if (days < -1 && days >= -7) return `${Math.abs(days)} days ago`;
  if (days > 7) return `In ${Math.ceil(days / 7)} weeks`;
  if (days < -7) return `${Math.ceil(Math.abs(days) / 7)} weeks ago`;

  return formatDateISO(d);
}

/**
 * Check if two dates are in the same week
 */
export function isSameWeek(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

  const week1Start = formatDateISO(getWeekStart(d1));
  const week2Start = formatDateISO(getWeekStart(d2));

  return week1Start === week2Start;
}

/**
 * Get the current week start as ISO string
 */
export function getCurrentWeekStart(): string {
  return formatDateISO(getWeekStart());
}

/**
 * Get next week's start date
 */
export function getNextWeekStart(): string {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  return formatDateISO(getWeekStart(nextWeek));
}

/**
 * Parse ISO date string to Date
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString);
}
