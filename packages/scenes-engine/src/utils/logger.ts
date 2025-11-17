/**
 * Scenes Engine Logger
 * Simple logging utility for the scenes engine
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: unknown;
}

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      data,
    };

    // In production, you might send this to a logging service
    // For now, use console with appropriate method
    const consoleMethod = level === 'debug' || level === 'info' ? 'log' : level;
    console[consoleMethod](`[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.context}] ${entry.message}`, data || '');
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }
}

/**
 * Create a logger instance for a specific context
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}

export { Logger };
