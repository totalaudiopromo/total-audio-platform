/**
 * PR Autopilot Logger
 *
 * Logging utility that writes to autopilot_logs table and provides
 * structured logging for debugging and audit purposes.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AutopilotLogger, LogLevel, AgentRole } from '../types';

export interface LoggerConfig {
  missionId: string;
  taskId?: string;
  agentRole?: AgentRole;
  supabase: SupabaseClient;
  console?: boolean; // Also log to console
}

export class AutopilotLoggerImpl implements AutopilotLogger {
  private missionId: string;
  private taskId?: string;
  private agentRole?: AgentRole;
  private supabase: SupabaseClient;
  private enableConsole: boolean;

  constructor(config: LoggerConfig) {
    this.missionId = config.missionId;
    this.taskId = config.taskId;
    this.agentRole = config.agentRole;
    this.supabase = config.supabase;
    this.enableConsole = config.console ?? true;
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    this.log('error', message, metadata);
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, metadata);
  }

  /**
   * Create a child logger for a specific task
   */
  forTask(taskId: string, agentRole?: AgentRole): AutopilotLogger {
    return new AutopilotLoggerImpl({
      missionId: this.missionId,
      taskId,
      agentRole: agentRole || this.agentRole,
      supabase: this.supabase,
      console: this.enableConsole,
    });
  }

  /**
   * Core logging method
   */
  private async log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    // Console logging
    if (this.enableConsole) {
      const prefix = this.agentRole
        ? `[${this.agentRole.toUpperCase()}]`
        : '[AUTOPILOT]';
      const logFn = this.getConsoleMethod(level);
      logFn(`${prefix} ${message}`, metadata || '');
    }

    // Database logging (fire and forget)
    this.writeToDatabase(level, message, metadata).catch((err) => {
      if (this.enableConsole) {
        console.error('Failed to write log to database:', err);
      }
    });
  }

  /**
   * Write log entry to database
   */
  private async writeToDatabase(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.supabase.from('autopilot_logs').insert({
      mission_id: this.missionId,
      task_id: this.taskId || null,
      agent_role: this.agentRole || null,
      level,
      message,
      metadata: metadata || null,
    });
  }

  /**
   * Get appropriate console method for log level
   */
  private getConsoleMethod(level: LogLevel): (...args: unknown[]) => void {
    switch (level) {
      case 'error':
        return console.error;
      case 'warn':
        return console.warn;
      case 'debug':
        return console.debug;
      default:
        return console.log;
    }
  }
}

/**
 * Create a logger instance
 */
export function createLogger(config: LoggerConfig): AutopilotLogger {
  return new AutopilotLoggerImpl(config);
}

/**
 * Query logs from database
 */
export async function queryLogs(
  supabase: SupabaseClient,
  filter: {
    missionId?: string;
    taskId?: string;
    agentRole?: AgentRole;
    level?: LogLevel;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }
): Promise<unknown[]> {
  let query = supabase.from('autopilot_logs').select('*');

  if (filter.missionId) {
    query = query.eq('mission_id', filter.missionId);
  }

  if (filter.taskId) {
    query = query.eq('task_id', filter.taskId);
  }

  if (filter.agentRole) {
    query = query.eq('agent_role', filter.agentRole);
  }

  if (filter.level) {
    query = query.eq('level', filter.level);
  }

  if (filter.startDate) {
    query = query.gte('created_at', filter.startDate);
  }

  if (filter.endDate) {
    query = query.lte('created_at', filter.endDate);
  }

  query = query.order('created_at', { ascending: false });

  if (filter.limit) {
    query = query.limit(filter.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to query logs: ${error.message}`);
  }

  return data || [];
}
