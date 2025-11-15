/**
 * Centralized error logging utility for Total Audio Platform
 * Provides standardised error categorisation, logging, and workspace context support
 */

export type ErrorCategory = 'network' | 'auth' | 'validation' | 'integration' | 'unknown';

export interface ErrorLogEntry {
  category: ErrorCategory;
  message: string;
  code?: string;
  context?: Record<string, any>;
  timestamp: Date;
  isDevelopment: boolean;
}

/**
 * Categorise errors based on type and message patterns
 */
function categoriseError(error: Error | string): ErrorCategory {
  const message = typeof error === 'string' ? error : error.message.toLowerCase();

  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'network';
  }

  if (
    message.includes('unauthorized') ||
    message.includes('forbidden') ||
    message.includes('auth')
  ) {
    return 'auth';
  }

  if (message.includes('validation') || message.includes('invalid')) {
    return 'validation';
  }

  if (message.includes('integration') || message.includes('sync') || message.includes('oauth')) {
    return 'integration';
  }

  return 'unknown';
}

/**
 * Get user-friendly error message
 * Translates technical errors into clear, UK English messages for end users
 */
function getUserFriendlyMessage(error: Error | string, category: ErrorCategory): string {
  const message = typeof error === 'string' ? error : error.message;

  const messages: Record<ErrorCategory, string> = {
    network: 'Connection error. Please check your internet and try again.',
    auth: 'Authentication failed. Please log in again.',
    validation: 'Invalid input. Please check your data and try again.',
    integration: 'Service integration failed. Please try again or contact support.',
    unknown: 'An unexpected error occurred. Please try again or contact support.',
  };

  // Return specific message if available
  if (message.includes('refresh token')) {
    return 'Your authentication has expired. Please log in again.';
  }

  if (message.includes('rate limit')) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  if (message.includes('not found')) {
    return 'The requested item was not found.';
  }

  return messages[category];
}

/**
 * Logger class for centralised error handling
 */
export class ErrorLogger {
  private isDevelopment: boolean;
  private workspaceId?: string;

  constructor(options?: { isDevelopment?: boolean; workspaceId?: string }) {
    this.isDevelopment = options?.isDevelopment ?? process.env.NODE_ENV === 'development';
    this.workspaceId = options?.workspaceId;
  }

  /**
   * Log an error with categorisation and context
   */
  log(error: Error | string, context?: Record<string, any>): ErrorLogEntry {
    const category = categoriseError(error);
    const message = typeof error === 'string' ? error : error.message;
    const code = typeof error === 'object' && 'code' in error ? (error as any).code : undefined;

    const entry: ErrorLogEntry = {
      category,
      message,
      code,
      context: {
        ...context,
        workspace_id: this.workspaceId,
      },
      timestamp: new Date(),
      isDevelopment: this.isDevelopment,
    };

    // Log to console in development
    if (this.isDevelopment) {
      this.logToConsole(entry);
    }

    // Log to external service in production (future implementation)
    if (!this.isDevelopment) {
      this.logToService(entry);
    }

    return entry;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error: Error | string): string {
    const category = categoriseError(error);
    return getUserFriendlyMessage(error, category);
  }

  /**
   * Log network error with retry context
   */
  logNetworkError(
    error: Error | string,
    options?: { url?: string; method?: string; retryCount?: number }
  ): ErrorLogEntry {
    return this.log(error, {
      type: 'network_error',
      url: options?.url,
      method: options?.method,
      retryCount: options?.retryCount,
    });
  }

  /**
   * Log authentication error
   */
  logAuthError(error: Error | string, options?: { endpoint?: string }): ErrorLogEntry {
    return this.log(error, {
      type: 'auth_error',
      endpoint: options?.endpoint,
    });
  }

  /**
   * Log validation error
   */
  logValidationError(
    error: Error | string,
    options?: { field?: string; value?: any }
  ): ErrorLogEntry {
    return this.log(error, {
      type: 'validation_error',
      field: options?.field,
      value: options?.value,
    });
  }

  /**
   * Log integration error
   */
  logIntegrationError(
    error: Error | string,
    options?: { integrationName?: string; action?: string; recordId?: string }
  ): ErrorLogEntry {
    return this.log(error, {
      type: 'integration_error',
      integration_name: options?.integrationName,
      action: options?.action,
      record_id: options?.recordId,
    });
  }

  /**
   * Log to browser console with formatting
   */
  private logToConsole(entry: ErrorLogEntry): void {
    const style = this.getCategoryStyle(entry.category);
    const timestamp = entry.timestamp.toISOString();

    console.group(`%c[${entry.category.toUpperCase()}] ${timestamp}`, style);
    console.error(`Message: ${entry.message}`);

    if (entry.code) {
      console.log(`Code: ${entry.code}`);
    }

    if (entry.context && Object.keys(entry.context).length > 0) {
      console.table(entry.context);
    }

    console.groupEnd();
  }

  /**
   * Log to external service (Sentry, LogRocket, etc.)
   * Implementation depends on chosen logging service
   */
  private logToService(entry: ErrorLogEntry): void {
    // TODO: Implement external logging service
    // Examples:
    // - Sentry.captureException(error, { tags: { category: entry.category } })
    // - LogRocket.captureException(error)
    // - Custom logging API endpoint

    try {
      // Placeholder for external logging
      // fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) })
    } catch {
      // Fail silently to prevent logging from breaking app
    }
  }

  /**
   * Get console style based on error category
   */
  private getCategoryStyle(category: ErrorCategory): string {
    const styles: Record<ErrorCategory, string> = {
      network: 'color: #ff9800; font-weight: bold; font-size: 12px;',
      auth: 'color: #f44336; font-weight: bold; font-size: 12px;',
      validation: 'color: #ff5722; font-weight: bold; font-size: 12px;',
      integration: 'color: #e91e63; font-weight: bold; font-size: 12px;',
      unknown: 'color: #9c27b0; font-weight: bold; font-size: 12px;',
    };

    return styles[category];
  }

  /**
   * Update workspace context
   */
  setWorkspaceId(workspaceId: string): void {
    this.workspaceId = workspaceId;
  }

  /**
   * Create instance with workspace context
   */
  withWorkspaceId(workspaceId: string): ErrorLogger {
    return new ErrorLogger({
      isDevelopment: this.isDevelopment,
      workspaceId,
    });
  }
}

/**
 * Create default error logger instance
 */
export function createErrorLogger(options?: {
  isDevelopment?: boolean;
  workspaceId?: string;
}): ErrorLogger {
  return new ErrorLogger(options);
}

/**
 * Default global logger instance
 */
export const errorLogger = createErrorLogger();
