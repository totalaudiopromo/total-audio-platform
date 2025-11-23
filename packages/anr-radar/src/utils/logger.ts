/**
 * Logger Utilities for A&R Radar
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private context: LogContext = {};
  private level: LogLevel = 'info';

  constructor(defaultContext?: LogContext) {
    if (defaultContext) {
      this.context = defaultContext;
    }

    // Set log level from environment variable
    const envLevel = process.env.ANR_LOG_LEVEL?.toLowerCase() as LogLevel;
    if (envLevel && ['debug', 'info', 'warn', 'error'].includes(envLevel)) {
      this.level = envLevel;
    }
  }

  /**
   * Set default context for all logs
   */
  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Check if level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentIndex = levels.indexOf(this.level);
    const messageIndex = levels.indexOf(level);
    return messageIndex >= currentIndex;
  }

  /**
   * Format log message
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const fullContext = { ...this.context, ...context };
    const contextStr = Object.keys(fullContext).length > 0
      ? ` ${JSON.stringify(fullContext)}`
      : '';

    return `[${timestamp}] [${level.toUpperCase()}] [ANR] ${message}${contextStr}`;
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, context));
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const errorContext = {
        ...context,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : error,
      };
      console.error(this.formatMessage('error', message, errorContext));
    }
  }

  /**
   * Create child logger with additional context
   */
  child(context: LogContext): Logger {
    const childLogger = new Logger({ ...this.context, ...context });
    childLogger.setLevel(this.level);
    return childLogger;
  }

  /**
   * Time a function execution
   */
  async time<T>(
    label: string,
    fn: () => Promise<T> | T,
    context?: LogContext
  ): Promise<T> {
    const start = Date.now();
    this.debug(`${label} started`, context);

    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.debug(`${label} completed`, { ...context, duration_ms: duration });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.error(`${label} failed`, error, { ...context, duration_ms: duration });
      throw error;
    }
  }
}

// Default logger instance
export const logger = new Logger({ module: 'anr-radar' });

// Export Logger class for custom instances
export { Logger };
export type { LogLevel, LogContext };
