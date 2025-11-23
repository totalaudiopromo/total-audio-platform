/**
 * Music Industry Graph (MIG) - Logger Utility
 *
 * Simple logging utility for MIG operations.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class MIGLogger {
  private context: string;
  private enabled: boolean;

  constructor(context: string = 'MIG', enabled: boolean = true) {
    this.context = context;
    this.enabled = enabled;
  }

  private log(level: LogLevel, message: string, data?: any) {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.context}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, data || '');
        break;
      case 'info':
        console.info(prefix, message, data || '');
        break;
      case 'warn':
        console.warn(prefix, message, data || '');
        break;
      case 'error':
        console.error(prefix, message, data || '');
        break;
    }
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

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  createChild(childContext: string): MIGLogger {
    return new MIGLogger(`${this.context}:${childContext}`, this.enabled);
  }
}

// Export singleton instance
export const logger = new MIGLogger('MIG');

// Export class for custom instances
export { MIGLogger };
