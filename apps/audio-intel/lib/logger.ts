/**
 * Production-Ready Logger Service
 * Eliminates console.log in production while maintaining dev functionality
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`🐛 ${message}`, context ? context : '');
    }
  }

  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`ℹ️ ${message}`, context ? context : '');
    }
  }

  warn(message: string, context?: LogContext) {
    console.warn(`⚠️ ${message}`, context ? context : '');
  }

  error(message: string, error?: Error | LogContext) {
    console.error(`❌ ${message}`, error ? error : '');
  }

  success(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`✅ ${message}`, context ? context : '');
    }
  }

  // For API monitoring (always logs)
  api(endpoint: string, method: string, status: number, duration?: number) {
    const emoji = status >= 400 ? '🔴' : status >= 300 ? '🟡' : '🟢';
    const durationText = duration ? ` (${duration}ms)` : '';
    console.log(`${emoji} ${method} ${endpoint} ${status}${durationText}`);
  }
}

export const logger = new Logger();

// Convenience exports for common patterns
export const logApiCall = (endpoint: string, method: string, status: number, duration?: number) =>
  logger.api(endpoint, method, status, duration);

export const logError = (message: string, error?: Error) =>
  logger.error(message, error);

export const logSuccess = (message: string, context?: LogContext) =>
  logger.success(message, context);