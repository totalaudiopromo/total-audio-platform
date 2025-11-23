/**
 * Action Idempotency
 *
 * Ensures actions can be safely retried without side effects
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface IdempotencyKey {
  key: string;
  taskId: string;
  actionType: string;
  createdAt: string;
}

export interface IdempotencyCheck {
  isNew: boolean;
  existingResult?: unknown;
  key: string;
}

/**
 * Generate idempotency key for an action
 */
export function generateIdempotencyKey(
  taskId: string,
  actionType: string,
  attempt: number = 0
): string {
  // Format: taskId:actionType:attempt
  return `${taskId}:${actionType}:${attempt}`;
}

/**
 * Check if action has been executed before
 */
export async function checkIdempotency(
  supabase: SupabaseClient,
  key: string
): Promise<IdempotencyCheck> {
  // Check task metadata for idempotency tracking
  const taskId = key.split(':')[0];

  const { data: task } = await supabase
    .from('autopilot_tasks')
    .select('metadata, output')
    .eq('id', taskId)
    .single();

  if (!task) {
    return { isNew: true, key };
  }

  const metadata = (task.metadata as Record<string, unknown>) || {};
  const idempotencyKeys = (metadata.idempotencyKeys as Record<string, unknown>) || {};

  if (key in idempotencyKeys) {
    return {
      isNew: false,
      existingResult: idempotencyKeys[key],
      key,
    };
  }

  return { isNew: true, key };
}

/**
 * Record idempotent action execution
 */
export async function recordIdempotentAction(
  supabase: SupabaseClient,
  key: string,
  result: unknown
): Promise<void> {
  const taskId = key.split(':')[0];

  const { data: task } = await supabase
    .from('autopilot_tasks')
    .select('metadata')
    .eq('id', taskId)
    .single();

  if (!task) return;

  const metadata = (task.metadata as Record<string, unknown>) || {};
  const idempotencyKeys = (metadata.idempotencyKeys as Record<string, unknown>) || {};

  idempotencyKeys[key] = {
    result,
    timestamp: new Date().toISOString(),
  };

  metadata.idempotencyKeys = idempotencyKeys;

  await supabase.from('autopilot_tasks').update({ metadata }).eq('id', taskId);
}

/**
 * Execute action with idempotency guarantee
 */
export async function executeIdempotent<T>(
  supabase: SupabaseClient,
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  const check = await checkIdempotency(supabase, key);

  if (!check.isNew) {
    // Action already executed, return cached result
    return check.existingResult as T;
  }

  // Execute action
  const result = await fn();

  // Record execution
  await recordIdempotentAction(supabase, key, result);

  return result;
}

/**
 * Clear idempotency cache for a task
 */
export async function clearIdempotencyCache(
  supabase: SupabaseClient,
  taskId: string
): Promise<void> {
  const { data: task } = await supabase
    .from('autopilot_tasks')
    .select('metadata')
    .eq('id', taskId)
    .single();

  if (!task) return;

  const metadata = (task.metadata as Record<string, unknown>) || {};
  delete metadata.idempotencyKeys;

  await supabase.from('autopilot_tasks').update({ metadata }).eq('id', taskId);
}

/**
 * Idempotent email send wrapper
 */
export async function sendEmailIdempotent(
  supabase: SupabaseClient,
  taskId: string,
  sendFn: () => Promise<{ messageId: string }>
): Promise<{ messageId: string; wasCached: boolean }> {
  const key = generateIdempotencyKey(taskId, 'send_email', 0);
  const check = await checkIdempotency(supabase, key);

  if (!check.isNew) {
    return {
      messageId: (check.existingResult as { messageId: string }).messageId,
      wasCached: true,
    };
  }

  const result = await sendFn();
  await recordIdempotentAction(supabase, key, result);

  return {
    messageId: result.messageId,
    wasCached: false,
  };
}

/**
 * Batch idempotent operations
 */
export async function executeBatchIdempotent<T>(
  supabase: SupabaseClient,
  taskId: string,
  items: Array<{ id: string; fn: () => Promise<T> }>
): Promise<Array<{ id: string; result: T; wasCached: boolean }>> {
  const results: Array<{ id: string; result: T; wasCached: boolean }> = [];

  for (const item of items) {
    const key = generateIdempotencyKey(taskId, `batch_${item.id}`, 0);
    const check = await checkIdempotency(supabase, key);

    if (!check.isNew) {
      results.push({
        id: item.id,
        result: check.existingResult as T,
        wasCached: true,
      });
    } else {
      const result = await item.fn();
      await recordIdempotentAction(supabase, key, result);
      results.push({
        id: item.id,
        result,
        wasCached: false,
      });
    }
  }

  return results;
}
