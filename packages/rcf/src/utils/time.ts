/**
 * RCF Time Utilities
 *
 * Helpers for time-based operations and formatting
 */

/**
 * Get current timestamp in ISO format
 */
export function now(): string {
  return new Date().toISOString();
}

/**
 * Parse ISO timestamp to Date
 */
export function parseTimestamp(timestamp: string): Date {
  return new Date(timestamp);
}

/**
 * Get timestamp N minutes ago
 */
export function minutesAgo(minutes: number): string {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
}

/**
 * Get timestamp N hours ago
 */
export function hoursAgo(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

/**
 * Get timestamp N days ago
 */
export function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

/**
 * Check if timestamp is within last N minutes
 */
export function isWithinMinutes(timestamp: string, minutes: number): boolean {
  const date = parseTimestamp(timestamp);
  const cutoff = new Date();
  cutoff.setMinutes(cutoff.getMinutes() - minutes);
  return date >= cutoff;
}

/**
 * Format duration in milliseconds to human readable
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  if (ms < 3600000) {
    return `${(ms / 60000).toFixed(2)}m`;
  }
  return `${(ms / 3600000).toFixed(2)}h`;
}

/**
 * Get relative time string (e.g., "2 minutes ago", "1 hour ago")
 */
export function getRelativeTime(timestamp: string): string {
  const date = parseTimestamp(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  }
  if (seconds > 0) {
    return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
  }
  return 'just now';
}

/**
 * Measure execution time of a function
 */
export async function measureTime<T>(
  fn: () => Promise<T>
): Promise<{ result: T; duration_ms: number }> {
  const start = Date.now();
  const result = await fn();
  const duration_ms = Date.now() - start;
  return { result, duration_ms };
}

/**
 * Measure execution time of a sync function
 */
export function measureTimeSync<T>(fn: () => T): { result: T; duration_ms: number } {
  const start = Date.now();
  const result = fn();
  const duration_ms = Date.now() - start;
  return { result, duration_ms };
}
