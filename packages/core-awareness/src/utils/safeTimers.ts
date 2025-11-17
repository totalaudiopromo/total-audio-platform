/**
 * Safe Timers
 * Manages intervals and timeouts with proper cleanup
 */

import { logger } from './logger';

export class SafeTimer {
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Set a safe interval that can be cleaned up
   */
  setInterval(name: string, callback: () => void | Promise<void>, ms: number): void {
    // Clear existing interval if present
    this.clearInterval(name);

    const wrappedCallback = async () => {
      try {
        await callback();
      } catch (error) {
        logger.error(`Interval "${name}" error:`, error);
      }
    };

    const intervalId = setInterval(wrappedCallback, ms);
    this.intervals.set(name, intervalId);
    logger.debug(`Interval "${name}" started (${ms}ms)`);
  }

  /**
   * Clear a specific interval
   */
  clearInterval(name: string): void {
    const intervalId = this.intervals.get(name);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(name);
      logger.debug(`Interval "${name}" cleared`);
    }
  }

  /**
   * Set a safe timeout
   */
  setTimeout(name: string, callback: () => void | Promise<void>, ms: number): void {
    // Clear existing timeout if present
    this.clearTimeout(name);

    const wrappedCallback = async () => {
      try {
        await callback();
      } catch (error) {
        logger.error(`Timeout "${name}" error:`, error);
      } finally {
        this.timers.delete(name);
      }
    };

    const timerId = setTimeout(wrappedCallback, ms);
    this.timers.set(name, timerId);
    logger.debug(`Timeout "${name}" started (${ms}ms)`);
  }

  /**
   * Clear a specific timeout
   */
  clearTimeout(name: string): void {
    const timerId = this.timers.get(name);
    if (timerId) {
      clearTimeout(timerId);
      this.timers.delete(name);
      logger.debug(`Timeout "${name}" cleared`);
    }
  }

  /**
   * Clear all timers and intervals
   */
  clearAll(): void {
    this.intervals.forEach((intervalId, name) => {
      clearInterval(intervalId);
      logger.debug(`Interval "${name}" cleared (clearAll)`);
    });
    this.intervals.clear();

    this.timers.forEach((timerId, name) => {
      clearTimeout(timerId);
      logger.debug(`Timeout "${name}" cleared (clearAll)`);
    });
    this.timers.clear();
  }

  /**
   * Get active timer count
   */
  getActiveCount(): { intervals: number; timeouts: number } {
    return {
      intervals: this.intervals.size,
      timeouts: this.timers.size,
    };
  }
}

// Global instance
export const safeTimers = new SafeTimer();

/**
 * Cleanup on process exit
 */
if (typeof process !== 'undefined') {
  process.on('beforeExit', () => {
    safeTimers.clearAll();
  });
}
