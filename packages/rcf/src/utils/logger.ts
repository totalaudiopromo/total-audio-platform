/**
 * RCF Logger Utility
 *
 * Structured logging for RCF pipeline operations
 */

import type { RCFLogger } from '../types';

class RCFLoggerImpl implements RCFLogger {
  private prefix: string;

  constructor(prefix: string = '[RCF]') {
    this.prefix = prefix;
  }

  info(message: string, data?: Record<string, unknown>): void {
    console.log(`${this.prefix} ℹ️  ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }

  warn(message: string, data?: Record<string, unknown>): void {
    console.warn(`${this.prefix} ⚠️  ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }

  error(message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    console.error(`${this.prefix} ❌ ${message}`);
    if (error instanceof Error) {
      console.error(`  Error: ${error.message}`);
      console.error(`  Stack: ${error.stack}`);
    } else if (error) {
      console.error(`  Error:`, error);
    }
    if (data) {
      console.error(`  Data:`, JSON.stringify(data, null, 2));
    }
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development' || process.env.RCF_DEBUG === 'true') {
      console.debug(`${this.prefix} 🐛 ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }
}

// Singleton instance
let logger: RCFLogger | null = null;

export function getLogger(prefix?: string): RCFLogger {
  if (!logger) {
    logger = new RCFLoggerImpl(prefix || '[RCF]');
  }
  return logger;
}

export function createLogger(prefix: string): RCFLogger {
  return new RCFLoggerImpl(prefix);
}

export default getLogger();
