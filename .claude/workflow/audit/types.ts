/**
 * Type definitions for audit logging system
 */

export interface AuditEntry {
  timestamp: string; // ISO 8601
  sessionId: string;
  tool: string;
  params: Record<string, any>; // Scrubbed of sensitive data
  duration?: number; // milliseconds
  result: 'success' | 'error' | 'blocked';
  error?: string;
}

export interface AuditSummary {
  date: string;
  totalExecutions: number;
  toolCounts: Record<string, number>;
  errorCount: number;
  blockedCount: number;
  sessions: string[];
  topTools: Array<{ tool: string; count: number }>;
}

export interface AuditFilter {
  date?: string; // YYYY-MM-DD
  tool?: string;
  session?: string;
  result?: 'success' | 'error' | 'blocked';
}
