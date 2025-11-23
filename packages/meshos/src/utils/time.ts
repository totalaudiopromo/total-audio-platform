/**
 * MeshOS Time Utilities
 * Time-related helper functions
 */

/**
 * Get current timestamp in ISO format
 */
export function now(): string {
  return new Date().toISOString();
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get date X days from now
 */
export function daysFromNow(days: number): Date {
  return addDays(new Date(), days);
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d > new Date();
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Get timeframe end date
 */
export function getTimeframeEnd(timeframe: '7d' | '30d' | '90d'): Date {
  const days = parseInt(timeframe);
  return daysFromNow(days);
}

/**
 * Check if timestamp is within quiet hours
 */
export function isQuietHours(
  timestamp: Date | string,
  quietHours?: { start: string; end: string; timezone: string }
): boolean {
  if (!quietHours) return false;

  const d = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const currentTime = hours * 60 + minutes;

  const [startHour, startMin] = quietHours.start.split(':').map(Number);
  const [endHour, endMin] = quietHours.end.split(':').map(Number);
  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  if (startTime < endTime) {
    return currentTime >= startTime && currentTime < endTime;
  } else {
    // Quiet hours cross midnight
    return currentTime >= startTime || currentTime < endTime;
  }
}
