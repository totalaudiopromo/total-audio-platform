/**
 * Telemetry Engine
 *
 * Real-time metrics tracking and reporting for PR Autopilot
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AgentRole } from '../types';

export type MetricType =
  | 'latency'
  | 'confidence'
  | 'approval_rate'
  | 'success_rate'
  | 'retry_count'
  | 'error_rate'
  | 'throughput'
  | 'resource_usage'
  | 'api_calls'
  | 'custom';

export interface TelemetryEntry {
  id?: string;
  mission_id: string;
  run_id?: string;
  task_id?: string;
  agent_role?: AgentRole;
  metric_type: MetricType;
  value: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

export interface TelemetryFilters {
  agent_role?: AgentRole;
  metric_type?: MetricType;
  startDate?: Date;
  endDate?: Date;
  run_id?: string;
  task_id?: string;
}

export interface TelemetrySummary {
  total_events: number;
  avg_latency_ms?: number;
  avg_confidence?: number;
  approval_rate?: number;
  success_rate?: number;
  total_errors: number;
  agents_used: string[];
}

export interface AgentTelemetrySummary {
  total_tasks: number;
  avg_latency_ms?: number;
  avg_confidence?: number;
  success_rate?: number;
  missions_count: number;
}

export class TelemetryEngine {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Log a telemetry event
   */
  async log(
    missionId: string,
    metricType: MetricType,
    value: Record<string, unknown>,
    options?: {
      runId?: string;
      taskId?: string;
      agentRole?: AgentRole;
      metadata?: Record<string, unknown>;
    }
  ): Promise<void> {
    try {
      const entry: TelemetryEntry = {
        mission_id: missionId,
        metric_type: metricType,
        value,
        run_id: options?.runId,
        task_id: options?.taskId,
        agent_role: options?.agentRole,
        metadata: options?.metadata || {},
      };

      const { error } = await this.supabase
        .from('autopilot_telemetry')
        .insert(entry);

      if (error) {
        console.error('Failed to log telemetry:', error);
      }
    } catch (err) {
      console.error('Telemetry logging error:', err);
      // Silently fail - telemetry should not break the main flow
    }
  }

  /**
   * Log task latency
   */
  async logLatency(
    missionId: string,
    taskId: string,
    agentRole: AgentRole,
    durationMs: number,
    options?: {
      runId?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<void> {
    await this.log(missionId, 'latency', { duration_ms: durationMs }, {
      taskId,
      agentRole,
      runId: options?.runId,
      metadata: options?.metadata,
    });
  }

  /**
   * Log confidence score
   */
  async logConfidence(
    missionId: string,
    taskId: string,
    agentRole: AgentRole,
    score: number,
    breakdown?: Record<string, number>,
    options?: {
      runId?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<void> {
    await this.log(
      missionId,
      'confidence',
      {
        score,
        breakdown: breakdown || {},
      },
      {
        taskId,
        agentRole,
        runId: options?.runId,
        metadata: options?.metadata,
      }
    );
  }

  /**
   * Log approval event
   */
  async logApproval(
    missionId: string,
    taskId: string,
    approved: boolean,
    options?: {
      runId?: string;
      agentRole?: AgentRole;
      reason?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<void> {
    await this.log(
      missionId,
      'approval_rate',
      {
        approved,
        reason: options?.reason || '',
      },
      {
        taskId,
        agentRole: options?.agentRole,
        runId: options?.runId,
        metadata: options?.metadata,
      }
    );
  }

  /**
   * Log task success/failure
   */
  async logTaskResult(
    missionId: string,
    taskId: string,
    agentRole: AgentRole,
    success: boolean,
    options?: {
      runId?: string;
      error?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<void> {
    await this.log(
      missionId,
      'success_rate',
      {
        success,
        error: options?.error || null,
      },
      {
        taskId,
        agentRole,
        runId: options?.runId,
        metadata: options?.metadata,
      }
    );
  }

  /**
   * Log retry attempt
   */
  async logRetry(
    missionId: string,
    taskId: string,
    agentRole: AgentRole,
    attemptNumber: number,
    options?: {
      runId?: string;
      reason?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<void> {
    await this.log(
      missionId,
      'retry_count',
      {
        attempt: attemptNumber,
        reason: options?.reason || '',
      },
      {
        taskId,
        agentRole,
        runId: options?.runId,
        metadata: options?.metadata,
      }
    );
  }

  /**
   * Log error
   */
  async logError(
    missionId: string,
    error: string,
    options?: {
      runId?: string;
      taskId?: string;
      agentRole?: AgentRole;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      metadata?: Record<string, unknown>;
    }
  ): Promise<void> {
    await this.log(
      missionId,
      'error_rate',
      {
        error,
        severity: options?.severity || 'medium',
      },
      {
        runId: options?.runId,
        taskId: options?.taskId,
        agentRole: options?.agentRole,
        metadata: options?.metadata,
      }
    );
  }

  /**
   * Log API call
   */
  async logApiCall(
    missionId: string,
    apiName: string,
    durationMs: number,
    success: boolean,
    options?: {
      runId?: string;
      taskId?: string;
      agentRole?: AgentRole;
      statusCode?: number;
      metadata?: Record<string, unknown>;
    }
  ): Promise<void> {
    await this.log(
      missionId,
      'api_calls',
      {
        api: apiName,
        duration_ms: durationMs,
        success,
        status_code: options?.statusCode,
      },
      {
        runId: options?.runId,
        taskId: options?.taskId,
        agentRole: options?.agentRole,
        metadata: options?.metadata,
      }
    );
  }

  /**
   * Get telemetry metrics for a mission with filters
   */
  async getMetrics(
    missionId: string,
    filters?: TelemetryFilters
  ): Promise<TelemetryEntry[]> {
    let query = this.supabase
      .from('autopilot_telemetry')
      .select('*')
      .eq('mission_id', missionId)
      .order('timestamp', { ascending: false });

    if (filters) {
      if (filters.agent_role) {
        query = query.eq('agent_role', filters.agent_role);
      }
      if (filters.metric_type) {
        query = query.eq('metric_type', filters.metric_type);
      }
      if (filters.run_id) {
        query = query.eq('run_id', filters.run_id);
      }
      if (filters.task_id) {
        query = query.eq('task_id', filters.task_id);
      }
      if (filters.startDate) {
        query = query.gte('timestamp', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        query = query.lte('timestamp', filters.endDate.toISOString());
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get metrics: ${error.message}`);
    }

    return (data || []) as TelemetryEntry[];
  }

  /**
   * Get summary statistics for a mission
   */
  async getMissionSummary(missionId: string): Promise<TelemetrySummary> {
    const { data, error } = await this.supabase.rpc('get_mission_telemetry_summary', {
      p_mission_id: missionId,
    });

    if (error) {
      throw new Error(`Failed to get mission summary: ${error.message}`);
    }

    return data as TelemetrySummary;
  }

  /**
   * Get summary statistics for a specific agent
   */
  async getAgentSummary(
    agentRole: AgentRole,
    userId: string
  ): Promise<AgentTelemetrySummary> {
    const { data, error } = await this.supabase.rpc('get_agent_telemetry_summary', {
      p_agent_role: agentRole,
      p_user_id: userId,
    });

    if (error) {
      throw new Error(`Failed to get agent summary: ${error.message}`);
    }

    return data as AgentTelemetrySummary;
  }

  /**
   * Generate detailed report for a mission over a time range
   */
  async generateReport(
    missionId: string,
    timeRange?: { start: Date; end: Date }
  ): Promise<{
    summary: TelemetrySummary;
    latencyStats: {
      min: number;
      max: number;
      avg: number;
      p50: number;
      p95: number;
      p99: number;
    };
    agentBreakdown: Record<
      string,
      {
        tasks: number;
        avgLatency: number;
        avgConfidence: number;
        successRate: number;
      }
    >;
    timeSeriesData: Array<{
      timestamp: string;
      latency: number;
      confidence: number;
      throughput: number;
    }>;
  }> {
    // Get all metrics for the time range
    const filters: TelemetryFilters = {};
    if (timeRange) {
      filters.startDate = timeRange.start;
      filters.endDate = timeRange.end;
    }

    const metrics = await this.getMetrics(missionId, filters);
    const summary = await this.getMissionSummary(missionId);

    // Calculate latency statistics
    const latencies = metrics
      .filter((m) => m.metric_type === 'latency')
      .map((m) => (m.value.duration_ms as number) || 0)
      .sort((a, b) => a - b);

    const latencyStats = {
      min: latencies.length > 0 ? latencies[0] : 0,
      max: latencies.length > 0 ? latencies[latencies.length - 1] : 0,
      avg:
        latencies.length > 0
          ? latencies.reduce((a, b) => a + b, 0) / latencies.length
          : 0,
      p50: latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.5)] : 0,
      p95: latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.95)] : 0,
      p99: latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.99)] : 0,
    };

    // Agent breakdown
    const agentBreakdown: Record<string, any> = {};
    summary.agents_used.forEach((agent) => {
      const agentMetrics = metrics.filter((m) => m.agent_role === agent);
      const agentLatencies = agentMetrics
        .filter((m) => m.metric_type === 'latency')
        .map((m) => (m.value.duration_ms as number) || 0);
      const agentConfidences = agentMetrics
        .filter((m) => m.metric_type === 'confidence')
        .map((m) => (m.value.score as number) || 0);
      const agentSuccesses = agentMetrics.filter(
        (m) => m.metric_type === 'success_rate' && m.value.success === true
      );

      agentBreakdown[agent] = {
        tasks: agentMetrics.length,
        avgLatency:
          agentLatencies.length > 0
            ? agentLatencies.reduce((a, b) => a + b, 0) / agentLatencies.length
            : 0,
        avgConfidence:
          agentConfidences.length > 0
            ? agentConfidences.reduce((a, b) => a + b, 0) / agentConfidences.length
            : 0,
        successRate:
          agentMetrics.length > 0 ? agentSuccesses.length / agentMetrics.length : 0,
      };
    });

    // Time series data (group by hour)
    const timeSeriesMap = new Map<string, { latency: number[]; confidence: number[] }>();
    metrics.forEach((m) => {
      const hour = new Date(m.timestamp!).toISOString().slice(0, 13);
      if (!timeSeriesMap.has(hour)) {
        timeSeriesMap.set(hour, { latency: [], confidence: [] });
      }
      const data = timeSeriesMap.get(hour)!;
      if (m.metric_type === 'latency') {
        data.latency.push((m.value.duration_ms as number) || 0);
      }
      if (m.metric_type === 'confidence') {
        data.confidence.push((m.value.score as number) || 0);
      }
    });

    const timeSeriesData = Array.from(timeSeriesMap.entries())
      .map(([timestamp, data]) => ({
        timestamp,
        latency:
          data.latency.length > 0
            ? data.latency.reduce((a, b) => a + b, 0) / data.latency.length
            : 0,
        confidence:
          data.confidence.length > 0
            ? data.confidence.reduce((a, b) => a + b, 0) / data.confidence.length
            : 0,
        throughput: data.latency.length,
      }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    return {
      summary,
      latencyStats,
      agentBreakdown,
      timeSeriesData,
    };
  }

  /**
   * Clean up old telemetry data (older than 90 days)
   */
  async cleanup(): Promise<number> {
    const { data, error } = await this.supabase.rpc('cleanup_old_telemetry');

    if (error) {
      throw new Error(`Failed to cleanup telemetry: ${error.message}`);
    }

    return data as number;
  }
}

/**
 * Create a telemetry engine instance
 */
export function createTelemetryEngine(supabase: SupabaseClient): TelemetryEngine {
  return new TelemetryEngine(supabase);
}
