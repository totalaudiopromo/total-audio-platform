/**
 * Logger utility for Marketing Automation Layer
 * Wraps the @total-audio/logger package with automation-specific context
 */

import type { Logger } from '../types';

export class AutomationLogger implements Logger {
  private context: string;

  constructor(context: string = 'automations-engine') {
    this.context = context;
  }

  info(message: string, meta?: any): void {
    console.log(`[${this.context}] INFO: ${message}`, meta || '');
  }

  error(message: string, error?: any): void {
    console.error(`[${this.context}] ERROR: ${message}`, error || '');
  }

  warn(message: string, meta?: any): void {
    console.warn(`[${this.context}] WARN: ${message}`, meta || '');
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${this.context}] DEBUG: ${message}`, meta || '');
    }
  }

  withContext(additionalContext: string): AutomationLogger {
    return new AutomationLogger(`${this.context}:${additionalContext}`);
  }
}

export const logger = new AutomationLogger();
