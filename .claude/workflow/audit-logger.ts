#!/usr/bin/env npx tsx
/**
 * Audit Logger
 *
 * Structured audit logging for the IndyDevDan workflow system.
 * Provides consistent logging across all hooks and processors.
 *
 * Features:
 * - Daily JSONL files for easy grep/analysis
 * - Sensitive data scrubbing
 * - Session tracking
 * - Worktree context
 * - Log rotation/cleanup
 *
 * Usage:
 *   import { AuditLogger } from './audit-logger';
 *   const logger = new AuditLogger();
 *   logger.log('dropzone', 'file-moved', { from, to });
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// Configuration
const PROJECT_ROOT = '/Users/chrisschofield/workspace/active/total-audio-platform';
const CLAUDE_DIR = path.join(PROJECT_ROOT, '.claude');
const LOGS_DIR = path.join(CLAUDE_DIR, 'logs');
const AUDIT_DIR = path.join(LOGS_DIR, 'audit');
const DECISIONS_DIR = path.join(LOGS_DIR, 'decisions');
const TMP_DIR = path.join(CLAUDE_DIR, 'tmp');

// Log retention (days)
const LOG_RETENTION_DAYS = 30;

// Sensitive data patterns
const SCRUB_PATTERNS = [
  { pattern: /[a-zA-Z0-9_]*_KEY[=:]\s*["']?[^"'\s]+["']?/gi, replacement: 'KEY=***REDACTED***' },
  {
    pattern: /[a-zA-Z0-9_]*_SECRET[=:]\s*["']?[^"'\s]+["']?/gi,
    replacement: 'SECRET=***REDACTED***',
  },
  {
    pattern: /[a-zA-Z0-9_]*_TOKEN[=:]\s*["']?[^"'\s]+["']?/gi,
    replacement: 'TOKEN=***REDACTED***',
  },
  {
    pattern: /[a-zA-Z0-9_]*_PASSWORD[=:]\s*["']?[^"'\s]+["']?/gi,
    replacement: 'PASSWORD=***REDACTED***',
  },
  { pattern: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, replacement: 'Bearer ***REDACTED***' },
  { pattern: /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi, replacement: '***@$2' },
];

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 'hook' | 'dropzone' | 'processor' | 'watcher' | 'safety' | 'workflow';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  event: string;
  data?: Record<string, unknown>;
  session_id?: string;
  worktree?: string;
  dry_run?: boolean;
}

export interface LogQueryOptions {
  date?: string; // YYYY-MM-DD
  category?: LogCategory;
  level?: LogLevel;
  event?: string;
  limit?: number;
}

export class AuditLogger {
  private scrubEnabled: boolean;
  private sessionId: string | undefined;
  private worktree: string | undefined;

  constructor(options?: { scrubSensitive?: boolean }) {
    this.scrubEnabled = options?.scrubSensitive !== false;
    this.sessionId = this.loadSessionId();
    this.worktree = this.loadWorktree();
  }

  private loadSessionId(): string | undefined {
    try {
      const sessionFile = path.join(TMP_DIR, 'current-session-id.txt');
      if (fs.existsSync(sessionFile)) {
        return fs.readFileSync(sessionFile, 'utf-8').trim();
      }
    } catch {
      // No session
    }
    return undefined;
  }

  private loadWorktree(): string | undefined {
    try {
      const worktreeFile = path.join(TMP_DIR, 'active-worktree');
      if (fs.existsSync(worktreeFile)) {
        return fs.readFileSync(worktreeFile, 'utf-8').trim();
      }
    } catch {
      // No worktree
    }
    return undefined;
  }

  private generateId(): string {
    return crypto.randomBytes(8).toString('hex');
  }

  private getDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private ensureDir(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private scrub(data: unknown): unknown {
    if (!this.scrubEnabled) return data;

    if (typeof data === 'string') {
      let scrubbed = data;
      for (const { pattern, replacement } of SCRUB_PATTERNS) {
        scrubbed = scrubbed.replace(pattern, replacement);
      }
      return scrubbed;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.scrub(item));
    }

    if (data && typeof data === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes('password') ||
          lowerKey.includes('secret') ||
          lowerKey.includes('token') ||
          lowerKey.includes('key') ||
          lowerKey.includes('credential') ||
          lowerKey.includes('auth')
        ) {
          result[key] = '***REDACTED***';
        } else {
          result[key] = this.scrub(value);
        }
      }
      return result;
    }

    return data;
  }

  private isDryRun(): boolean {
    return process.env.DROPZONE_LIVE !== '1';
  }

  /**
   * Log an event to the audit trail
   */
  log(
    category: LogCategory,
    event: string,
    data?: Record<string, unknown>,
    level: LogLevel = 'info'
  ): LogEntry {
    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level,
      category,
      event,
      data: data ? (this.scrub(data) as Record<string, unknown>) : undefined,
      session_id: this.sessionId,
      worktree: this.worktree,
      dry_run: this.isDryRun(),
    };

    this.writeToAudit(entry);
    return entry;
  }

  /**
   * Convenience methods for different log levels
   */
  debug(category: LogCategory, event: string, data?: Record<string, unknown>): LogEntry {
    return this.log(category, event, data, 'debug');
  }

  info(category: LogCategory, event: string, data?: Record<string, unknown>): LogEntry {
    return this.log(category, event, data, 'info');
  }

  warn(category: LogCategory, event: string, data?: Record<string, unknown>): LogEntry {
    return this.log(category, event, data, 'warn');
  }

  error(category: LogCategory, event: string, data?: Record<string, unknown>): LogEntry {
    return this.log(category, event, data, 'error');
  }

  /**
   * Log a decision (for debugging complex workflows)
   */
  decision(summary: string, context?: Record<string, unknown>): void {
    const entry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      summary,
      context: context ? this.scrub(context) : undefined,
      session_id: this.sessionId,
      worktree: this.worktree,
    };

    this.writeToDecisions(entry);
  }

  private writeToAudit(entry: LogEntry): void {
    const date = this.getDate();
    const auditFile = path.join(AUDIT_DIR, `${date}.jsonl`);

    try {
      this.ensureDir(AUDIT_DIR);
      fs.appendFileSync(auditFile, JSON.stringify(entry) + '\n');
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }

  private writeToDecisions(entry: Record<string, unknown>): void {
    const date = this.getDate();
    const decisionsFile = path.join(DECISIONS_DIR, `${date}.jsonl`);

    try {
      this.ensureDir(DECISIONS_DIR);
      fs.appendFileSync(decisionsFile, JSON.stringify(entry) + '\n');
    } catch (err) {
      console.error('Failed to write decision log:', err);
    }
  }

  /**
   * Query audit logs
   */
  query(options: LogQueryOptions = {}): LogEntry[] {
    const date = options.date || this.getDate();
    const auditFile = path.join(AUDIT_DIR, `${date}.jsonl`);

    if (!fs.existsSync(auditFile)) {
      return [];
    }

    try {
      const lines = fs.readFileSync(auditFile, 'utf-8').split('\n').filter(Boolean);
      let entries: LogEntry[] = lines.map(line => JSON.parse(line));

      // Apply filters
      if (options.category) {
        entries = entries.filter(e => e.category === options.category);
      }
      if (options.level) {
        entries = entries.filter(e => e.level === options.level);
      }
      if (options.event) {
        entries = entries.filter(e => e.event.includes(options.event));
      }

      // Apply limit
      if (options.limit) {
        entries = entries.slice(-options.limit);
      }

      return entries;
    } catch (err) {
      console.error('Failed to query audit logs:', err);
      return [];
    }
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit = 10): LogEntry[] {
    return this.query({ level: 'error', limit });
  }

  /**
   * Clean up old logs
   */
  cleanup(): { deleted: string[]; errors: string[] } {
    const deleted: string[] = [];
    const errors: string[] = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - LOG_RETENTION_DAYS);

    for (const dir of [AUDIT_DIR, DECISIONS_DIR]) {
      if (!fs.existsSync(dir)) continue;

      for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith('.jsonl')) continue;

        // Extract date from filename (YYYY-MM-DD.jsonl)
        const dateStr = file.replace('.jsonl', '');
        const fileDate = new Date(dateStr);

        if (fileDate < cutoffDate) {
          try {
            fs.unlinkSync(path.join(dir, file));
            deleted.push(file);
          } catch (err) {
            errors.push(`Failed to delete ${file}: ${err}`);
          }
        }
      }
    }

    return { deleted, errors };
  }

  /**
   * Get summary stats for a date
   */
  getSummary(date?: string): Record<string, number> {
    const entries = this.query({ date });
    const summary: Record<string, number> = {
      total: entries.length,
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
    };

    for (const entry of entries) {
      summary[entry.level]++;
    }

    return summary;
  }
}

// Singleton instance for convenience
let defaultLogger: AuditLogger | null = null;

export function getLogger(): AuditLogger {
  if (!defaultLogger) {
    defaultLogger = new AuditLogger();
  }
  return defaultLogger;
}

// CLI interface
function main(): void {
  const command = process.argv[2];
  const logger = new AuditLogger();

  switch (command) {
    case 'summary':
      const date = process.argv[3];
      console.log(JSON.stringify(logger.getSummary(date), null, 2));
      break;

    case 'errors':
      const limit = parseInt(process.argv[3]) || 10;
      console.log(JSON.stringify(logger.getRecentErrors(limit), null, 2));
      break;

    case 'query':
      const queryDate = process.argv[3] || undefined;
      const category = (process.argv[4] as LogCategory) || undefined;
      console.log(JSON.stringify(logger.query({ date: queryDate, category }), null, 2));
      break;

    case 'cleanup':
      const result = logger.cleanup();
      console.log(`Deleted ${result.deleted.length} files`);
      if (result.errors.length > 0) {
        console.error('Errors:', result.errors);
      }
      break;

    case 'test':
      logger.info('workflow', 'test-event', { test: true });
      logger.warn('safety', 'test-warning', { reason: 'testing' });
      logger.error('processor', 'test-error', { error: 'test failure' });
      logger.decision('Test decision logged', { context: 'CLI test' });
      console.log('Test entries written to audit log');
      break;

    default:
      console.log('Usage: npx tsx audit-logger.ts <command>');
      console.log('');
      console.log('Commands:');
      console.log('  summary [date]       Show summary for date (default: today)');
      console.log('  errors [limit]       Show recent errors (default: 10)');
      console.log('  query [date] [cat]   Query logs by date and category');
      console.log('  cleanup              Delete logs older than 30 days');
      console.log('  test                 Write test entries to audit log');
  }
}

// Only run main if executed directly
if (import.meta.url.endsWith(process.argv[1].replace(/^file:\/\//, ''))) {
  main();
}
