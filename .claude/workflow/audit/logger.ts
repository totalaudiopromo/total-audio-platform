/**
 * Audit logger - logs tool executions to JSONL files
 */

import * as fs from 'fs';
import * as path from 'path';
import type { AuditEntry } from './types';

const AUDIT_LOGS_DIR = '.claude/audit-logs';

/**
 * Patterns to detect sensitive data
 */
const SENSITIVE_PATTERNS = [
  /api[_-]?key/i,
  /secret/i,
  /password/i,
  /token/i,
  /auth/i,
  /bearer/i,
  /credential/i,
  /private[_-]?key/i,
];

/**
 * Scrub sensitive data from parameters
 */
export function scrubSensitiveData(params: Record<string, any>): Record<string, any> {
  const scrubbed: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    // Check if key looks sensitive
    const isSensitiveKey = SENSITIVE_PATTERNS.some(pattern => pattern.test(key));

    if (isSensitiveKey) {
      scrubbed[key] = '[REDACTED]';
    } else if (typeof value === 'string') {
      // Check if value looks like a secret (long alphanumeric string)
      if (value.length > 20 && /^[a-zA-Z0-9_-]+$/.test(value)) {
        scrubbed[key] = '[REDACTED_TOKEN]';
      } else {
        scrubbed[key] = value;
      }
    } else if (typeof value === 'object' && value !== null) {
      // Recursively scrub nested objects
      scrubbed[key] = scrubSensitiveData(value);
    } else {
      scrubbed[key] = value;
    }
  }

  return scrubbed;
}

/**
 * Get log file path for a given date
 */
export function getLogPath(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const filename = `${year}-${month}-${day}.jsonl`;
  return path.join(AUDIT_LOGS_DIR, filename);
}

/**
 * Generate or retrieve session ID
 */
export function getSessionId(): string {
  // Try to get from environment
  if (process.env.CLAUDE_SESSION_ID) {
    return process.env.CLAUDE_SESSION_ID;
  }

  // Generate based on timestamp
  return `session-${Date.now()}`;
}

/**
 * Log a tool execution
 */
export function logToolExecution(entry: Partial<AuditEntry>): void {
  try {
    // Ensure logs directory exists
    if (!fs.existsSync(AUDIT_LOGS_DIR)) {
      fs.mkdirSync(AUDIT_LOGS_DIR, { recursive: true });
    }

    // Create complete entry
    const completeEntry: AuditEntry = {
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      tool: entry.tool || 'unknown',
      params: scrubSensitiveData(entry.params || {}),
      result: entry.result || 'success',
      duration: entry.duration,
      error: entry.error,
    };

    // Append to today's log file
    const logPath = getLogPath();
    const logLine = JSON.stringify(completeEntry) + '\n';

    fs.appendFileSync(logPath, logLine, 'utf-8');
  } catch (error) {
    // Fail silently - never crash audit logging
  }
}

/**
 * Read audit entries from a log file
 */
export function readAuditLog(date: string): AuditEntry[] {
  try {
    const logPath = path.join(AUDIT_LOGS_DIR, `${date}.jsonl`);

    if (!fs.existsSync(logPath)) {
      return [];
    }

    const content = fs.readFileSync(logPath, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);

    return lines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        // Skip invalid lines
        return null;
      }
    }).filter((entry): entry is AuditEntry => entry !== null);
  } catch (error) {
    return [];
  }
}
