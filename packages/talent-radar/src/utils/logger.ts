/**
 * Talent Radar Logger
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  constructor(private context: string) {}

  debug(message: string, data?: unknown): void {
    console.log(`[DEBUG] [${this.context}] ${message}`, data || '');
  }

  info(message: string, data?: unknown): void {
    console.log(`[INFO] [${this.context}] ${message}`, data || '');
  }

  warn(message: string, data?: unknown): void {
    console.warn(`[WARN] [${this.context}] ${message}`, data || '');
  }

  error(message: string, data?: unknown): void {
    console.error(`[ERROR] [${this.context}] ${message}`, data || '');
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context);
}

export { Logger };
