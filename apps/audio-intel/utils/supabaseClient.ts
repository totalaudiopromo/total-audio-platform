/**
 * Supabase Client for Audio Intel
 *
 * Purpose: Logging enrichment batch operations to Supabase for analytics and debugging
 * Created: 2025-11-12
 *
 * Environment Variables Required:
 * - NEXT_PUBLIC_SUPABASE_URL: Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Service role key for backend operations
 *
 * Usage:
 * ```typescript
 * import { logEnrichmentBatch } from '@/utils/supabaseClient';
 *
 * await logEnrichmentBatch({
 *   batch_id: 'batch_123',
 *   total: 10,
 *   enriched: 8,
 *   failed: 2,
 *   cost: 0.05,
 *   avg_time_ms: 2500,
 *   model_used: 'claude-3.7-sonnet'
 * });
 * ```
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('[Supabase] Missing environment variables. Supabase logging disabled.');
}

export const supabase =
  supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

/**
 * Intel Log Entry Interface
 *
 * Matches the intel_logs table schema in Supabase
 */
export interface IntelLogEntry {
  batch_id: string;
  total: number;
  enriched: number;
  failed: number;
  retried?: number;
  timed_out?: number;
  cost: number;
  avg_time_ms: number;
  success_rate?: number;
  input_tokens?: number;
  output_tokens?: number;
  model_used?: string;
  ip_address?: string;
  metadata?: Record<string, any>;
}

/**
 * Log Enrichment Batch
 *
 * Logs enrichment batch operation to Supabase intel_logs table
 *
 * @param entry - The enrichment batch log entry
 * @throws Error if logging fails (only in production mode)
 */
export async function logEnrichmentBatch(entry: IntelLogEntry): Promise<void> {
  if (!supabase) {
    console.warn('[Supabase] Logging skipped - client not initialized');
    return;
  }

  try {
    // Calculate success rate if not provided
    const success_rate = entry.success_rate ?? (entry.enriched / entry.total) * 100;

    const { error } = await supabase.from('intel_logs').insert({
      ...entry,
      success_rate,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[Supabase] Failed to log enrichment batch:', error);
      // Only throw in production to avoid breaking dev environments
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    } else {
      console.log(
        `[Supabase] Logged batch ${entry.batch_id}: ${entry.enriched}/${entry.total} enriched (${success_rate.toFixed(1)}% success)`
      );
    }
  } catch (err) {
    console.error('[Supabase] Exception while logging batch:', err);
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }
  }
}

/**
 * Get Enrichment Metrics
 *
 * Retrieves enrichment metrics from Supabase intel_logs table
 *
 * @param since - Optional date filter (get logs since this date)
 * @param limit - Maximum number of results (default: 100)
 * @returns Array of intel log entries
 */
export async function getEnrichmentMetrics(
  since?: Date,
  limit: number = 100
): Promise<IntelLogEntry[]> {
  if (!supabase) {
    console.warn('[Supabase] Metrics fetch skipped - client not initialized');
    return [];
  }

  try {
    let query = supabase
      .from('intel_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (since) {
      query = query.gte('created_at', since.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Supabase] Failed to fetch metrics:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[Supabase] Exception while fetching metrics:', err);
    throw err;
  }
}

/**
 * Get Aggregated Metrics
 *
 * Calculates aggregated metrics across all enrichment batches
 *
 * @param since - Optional date filter
 * @returns Aggregated metrics object
 */
export async function getAggregatedMetrics(since?: Date) {
  const logs = await getEnrichmentMetrics(since);

  if (logs.length === 0) {
    return {
      total_batches: 0,
      total_contacts: 0,
      total_enriched: 0,
      total_failed: 0,
      avg_success_rate: 0,
      total_cost: 0,
      avg_time_ms: 0,
    };
  }

  const totals = logs.reduce(
    (acc, log) => ({
      total_batches: acc.total_batches + 1,
      total_contacts: acc.total_contacts + log.total,
      total_enriched: acc.total_enriched + log.enriched,
      total_failed: acc.total_failed + log.failed,
      total_cost: acc.total_cost + Number(log.cost),
      total_time_ms: acc.total_time_ms + log.avg_time_ms * log.total,
    }),
    {
      total_batches: 0,
      total_contacts: 0,
      total_enriched: 0,
      total_failed: 0,
      total_cost: 0,
      total_time_ms: 0,
    }
  );

  return {
    ...totals,
    avg_success_rate: (totals.total_enriched / totals.total_contacts) * 100,
    avg_time_ms: totals.total_time_ms / totals.total_contacts,
  };
}

/**
 * Check Supabase Health
 *
 * Verifies that Supabase connection is working
 *
 * @returns true if healthy, false otherwise
 */
export async function checkSupabaseHealth(): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  try {
    const { error } = await supabase.from('intel_logs').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}
