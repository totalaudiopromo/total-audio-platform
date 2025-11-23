/**
 * CoachOS Progress Engine
 * Track and analyze user progress over time
 */

import { createClient } from '@total-audio/core-db/server';
import type {
  StoreMetricInput,
  CoachProgressRecord,
  MetricHistory,
  GrowthArea,
} from './types';
import { logger } from './utils/logger';

/**
 * Store a metric data point
 */
export async function storeMetric(input: StoreMetricInput): Promise<CoachProgressRecord> {
  try {
    const supabase = createClient();

    const progressData = {
      user_id: input.userId,
      metric: input.metric,
      value: input.value,
      metadata: input.metadata || {},
      goal_id: input.goalId,
      session_id: input.sessionId,
    };

    const { data, error } = await supabase
      .from('coach_progress')
      .insert(progressData)
      .select()
      .single();

    if (error) throw error;

    logger.debug('Stored metric', {
      userId: input.userId,
      metric: input.metric,
      value: input.value,
    });

    return data;
  } catch (error) {
    logger.error('Failed to store metric', error);
    throw error;
  }
}

/**
 * Store multiple metrics at once
 */
export async function storeMetrics(
  inputs: StoreMetricInput[]
): Promise<CoachProgressRecord[]> {
  try {
    const supabase = createClient();

    const progressData = inputs.map((input) => ({
      user_id: input.userId,
      metric: input.metric,
      value: input.value,
      metadata: input.metadata || {},
      goal_id: input.goalId,
      session_id: input.sessionId,
    }));

    const { data, error } = await supabase
      .from('coach_progress')
      .insert(progressData)
      .select();

    if (error) throw error;

    logger.info('Stored multiple metrics', {
      userId: inputs[0]?.userId,
      count: inputs.length,
    });

    return data || [];
  } catch (error) {
    logger.error('Failed to store metrics', error);
    throw error;
  }
}

/**
 * Get history for a specific metric
 */
export async function getMetricHistory(
  userId: string,
  metric: string,
  limit: number = 30
): Promise<MetricHistory> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_progress')
      .select('value, created_at')
      .eq('user_id', userId)
      .eq('metric', metric)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;

    const history: MetricHistory = {
      metric,
      data: (data || []).map((record) => ({
        value: record.value,
        timestamp: record.created_at,
      })),
      trend: calculateTrend(data || []),
    };

    return history;
  } catch (error) {
    logger.error('Failed to get metric history', error);
    throw error;
  }
}

/**
 * Get all metrics for a user
 */
export async function getAllMetrics(
  userId: string,
  limit: number = 100
): Promise<CoachProgressRecord[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Failed to get all metrics', error);
    throw error;
  }
}

/**
 * Get metrics for a specific goal
 */
export async function getGoalMetrics(goalId: string): Promise<CoachProgressRecord[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_progress')
      .select('*')
      .eq('goal_id', goalId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Failed to get goal metrics', error);
    throw error;
  }
}

/**
 * Get metrics for a specific session
 */
export async function getSessionMetrics(sessionId: string): Promise<CoachProgressRecord[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_progress')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Failed to get session metrics', error);
    throw error;
  }
}

/**
 * Highlight growth areas based on progress data
 */
export async function highlightGrowthAreas(userId: string): Promise<GrowthArea[]> {
  try {
    logger.info('Highlighting growth areas', { userId });

    // Get all recent metrics
    const recentMetrics = await getAllMetrics(userId, 100);

    // Group by metric
    const metricGroups = groupByMetric(recentMetrics);

    // Calculate improvement for each metric
    const growthAreas: GrowthArea[] = [];

    for (const [metric, records] of Object.entries(metricGroups)) {
      if (records.length < 3) continue; // Need at least 3 data points

      const sorted = records.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      const first = sorted[0].value;
      const last = sorted[sorted.length - 1].value;
      const improvement = ((last - first) / first) * 100;

      if (Math.abs(improvement) > 5) {
        // Significant change
        growthAreas.push({
          area: metric,
          improvement: Math.round(improvement),
          confidence: calculateConfidence(records),
        });
      }
    }

    // Sort by absolute improvement
    growthAreas.sort((a, b) => Math.abs(b.improvement) - Math.abs(a.improvement));

    logger.info('Highlighted growth areas', {
      userId,
      count: growthAreas.length,
    });

    return growthAreas;
  } catch (error) {
    logger.error('Failed to highlight growth areas', error);
    throw error;
  }
}

/**
 * Get progress summary for a time period
 */
export async function getProgressSummary(
  userId: string,
  startDate: string,
  endDate: string
): Promise<{
  totalMetrics: number;
  uniqueMetrics: number;
  averageValue: number;
  topMetrics: string[];
}> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_progress')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) throw error;

    const records = data || [];
    const uniqueMetrics = new Set(records.map((r) => r.metric));

    const metricCounts = records.reduce((acc, record) => {
      acc[record.metric] = (acc[record.metric] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topMetrics = Object.entries(metricCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([metric]) => metric);

    const totalValue = records.reduce((sum, r) => sum + r.value, 0);
    const averageValue = records.length > 0 ? totalValue / records.length : 0;

    return {
      totalMetrics: records.length,
      uniqueMetrics: uniqueMetrics.size,
      averageValue: Math.round(averageValue * 100) / 100,
      topMetrics,
    };
  } catch (error) {
    logger.error('Failed to get progress summary', error);
    throw error;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateTrend(
  data: Array<{ value: number; created_at: string }>
): 'improving' | 'stable' | 'declining' {
  if (data.length < 3) return 'stable';

  const sorted = data.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
  const secondHalf = sorted.slice(Math.floor(sorted.length / 2));

  const firstAvg =
    firstHalf.reduce((sum, r) => sum + r.value, 0) / firstHalf.length;
  const secondAvg =
    secondHalf.reduce((sum, r) => sum + r.value, 0) / secondHalf.length;

  const change = ((secondAvg - firstAvg) / firstAvg) * 100;

  if (change > 10) return 'improving';
  if (change < -10) return 'declining';
  return 'stable';
}

function groupByMetric(
  records: CoachProgressRecord[]
): Record<string, CoachProgressRecord[]> {
  return records.reduce((acc, record) => {
    if (!acc[record.metric]) {
      acc[record.metric] = [];
    }
    acc[record.metric].push(record);
    return acc;
  }, {} as Record<string, CoachProgressRecord[]>);
}

function calculateConfidence(
  records: CoachProgressRecord[]
): 'low' | 'medium' | 'high' {
  // More data points = higher confidence
  if (records.length >= 10) return 'high';
  if (records.length >= 5) return 'medium';
  return 'low';
}

/**
 * Delete all progress records for a user
 */
export async function deleteUserProgress(userId: string): Promise<void> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('coach_progress')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    logger.info('Deleted user progress', { userId });
  } catch (error) {
    logger.error('Failed to delete user progress', error);
    throw error;
  }
}
