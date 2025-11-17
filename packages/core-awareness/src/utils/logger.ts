/**
 * Core Awareness Logger
 * Contextual logging with awareness-specific metadata
 */

import type { Logger } from '../types';

export class AwarenessLogger implements Logger {
  private context: string;

  constructor(context: string = 'core-awareness') {
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

  withContext(additionalContext: string): AwarenessLogger {
    return new AwarenessLogger(`${this.context}:${additionalContext}`);
  }
}

export const logger = new AwarenessLogger();
