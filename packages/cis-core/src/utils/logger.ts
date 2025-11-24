/**
 * Simple logger utility for CIS packages
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  package?: string;
  module?: string;
  userId?: string;
  projectId?: string;
  [key: string]: any;
}

class Logger {
  private context: LogContext = {};

  constructor(initialContext?: LogContext) {
    if (initialContext) {
      this.context = initialContext;
    }
  }

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      context: this.context,
      ...(data && { data }),
    };

    // In production, this would send to a logging service
    // For now, use console with structured output
    const consoleMethod = level === 'error' ? console.error : console.log;
    consoleMethod(JSON.stringify(logEntry, null, 2));
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error | any) {
    this.log('error', message, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    });
  }

  withContext(additionalContext: LogContext): Logger {
    return new Logger({
      ...this.context,
      ...additionalContext,
    });
  }
}

export const createLogger = (context?: LogContext) => new Logger(context);
export const logger = new Logger({ package: '@total-audio/cis-core' });
