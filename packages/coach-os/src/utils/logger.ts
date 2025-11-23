/**
 * CoachOS Logger
 * Simple logging utility for debugging and monitoring
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  userId?: string;
  sessionId?: string;
  goalId?: string;
  [key: string]: any;
}

class Logger {
  private context: LogContext = {};

  setContext(context: LogContext) {
    this.context = { ...this.context, ...context };
  }

  clearContext() {
    this.context = {};
  }

  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      context: this.context,
      ...(meta && { meta }),
    };

    // In production, send to monitoring service
    // For now, console output
    if (process.env.NODE_ENV === 'development') {
      console.log(`[CoachOS] ${level.toUpperCase()}:`, message, logData);
    }

    // TODO: Integrate with monitoring service (e.g., Sentry, LogRocket)
  }

  debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
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
}

export const logger = new Logger();
