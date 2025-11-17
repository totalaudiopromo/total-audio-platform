/**
 * Awareness Store
 * Database & cache layer for Core Awareness data
 */

import type {
  AwarenessSnapshot,
  AwarenessEvent,
  AwarenessSignal,
  AwarenessRecommendation,
  SnapshotData,
  CacheEntry,
  TimeWindow,
} from './types';
import { logger } from './utils/logger';

// Supabase client interface
interface SupabaseClient {
  from(table: string): any;
}

let supabaseClient: SupabaseClient | null = null;

// In-memory cache
const cache = new Map<string, CacheEntry<any>>();

/**
 * Initialize awareness store with Supabase client
 */
export function initAwarenessStore(client: SupabaseClient): void {
  supabaseClient = client;
  logger.info('Awareness store initialized');
}

function getClient(): SupabaseClient {
  if (!supabaseClient) {
    throw new Error('Awareness store not initialized');
  }
  return supabaseClient;
}

// ============================================================================
// SNAPSHOTS
// ============================================================================

export async function createSnapshot(
  workspaceId: string | null,
  userId: string | null,
  data: SnapshotData
): Promise<AwarenessSnapshot> {
  const client = getClient();

  const { data: snapshot, error } = await client
    .from('awareness_snapshots')
    .insert({
      workspace_id: workspaceId,
      user_id: userId,
      data,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create snapshot: ${error.message}`);

  logger.info('Snapshot created', { id: snapshot.id });
  return mapSnapshotFromDB(snapshot);
}

export async function getLatestSnapshot(
  workspaceId: string | null,
  userId: string | null
): Promise<AwarenessSnapshot | null> {
  const client = getClient();

  const query = client
    .from('awareness_snapshots')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (workspaceId) {
    query.eq('workspace_id', workspaceId);
  } else if (userId) {
    query.eq('user_id', userId);
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to get snapshot: ${error.message}`);
  }

  return mapSnapshotFromDB(data);
}

export async function listSnapshots(
  workspaceId: string | null,
  userId: string | null,
  limit: number = 50
): Promise<AwarenessSnapshot[]> {
  const client = getClient();

  const query = client
    .from('awareness_snapshots')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (workspaceId) {
    query.eq('workspace_id', workspaceId);
  } else if (userId) {
    query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Failed to list snapshots: ${error.message}`);

  return (data || []).map(mapSnapshotFromDB);
}

// ============================================================================
// EVENTS
// ============================================================================

export async function ingestEvent(event: Omit<AwarenessEvent, 'id' | 'createdAt'>): Promise<AwarenessEvent> {
  const client = getClient();

  const { data, error } = await client
    .from('awareness_events')
    .insert({
      workspace_id: event.workspaceId,
      user_id: event.userId,
      event_type: event.eventType,
      source_system: event.sourceSystem,
      payload: event.payload,
      metadata: event.metadata || {},
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to ingest event: ${error.message}`);

  return mapEventFromDB(data);
}

export async function ingestEvents(events: Omit<AwarenessEvent, 'id' | 'createdAt'>[]): Promise<void> {
  const client = getClient();

  const records = events.map((event) => ({
    workspace_id: event.workspaceId,
    user_id: event.userId,
    event_type: event.eventType,
    source_system: event.sourceSystem,
    payload: event.payload,
    metadata: event.metadata || {},
  }));

  const { error } = await client.from('awareness_events').insert(records);

  if (error) throw new Error(`Failed to ingest events: ${error.message}`);

  logger.info(`Ingested ${events.length} events`);
}

export async function getRecentEvents(
  workspaceId: string | null,
  userId: string | null,
  window: TimeWindow = '24h'
): Promise<AwarenessEvent[]> {
  const client = getClient();

  const windowMs = parseTimeWindow(window);
  const since = new Date(Date.now() - windowMs);

  const query = client
    .from('awareness_events')
    .select('*')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: false });

  if (workspaceId) {
    query.eq('workspace_id', workspaceId);
  } else if (userId) {
    query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Failed to get recent events: ${error.message}`);

  return (data || []).map(mapEventFromDB);
}

// ============================================================================
// SIGNALS
// ============================================================================

export async function createSignal(
  signal: Omit<AwarenessSignal, 'id' | 'createdAt' | 'actionedAt'>
): Promise<AwarenessSignal> {
  const client = getClient();

  const { data, error } = await client
    .from('awareness_signals')
    .insert({
      workspace_id: signal.workspaceId,
      user_id: signal.userId,
      target_system: signal.targetSystem,
      signal_type: signal.signalType,
      payload: signal.payload,
      confidence: signal.confidence,
      status: signal.status || 'pending',
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create signal: ${error.message}`);

  logger.info('Signal created', {
    id: data.id,
    target: signal.targetSystem,
    type: signal.signalType,
  });

  return mapSignalFromDB(data);
}

export async function getPendingSignals(
  targetSystem: string,
  workspaceId: string | null,
  userId: string | null
): Promise<AwarenessSignal[]> {
  const client = getClient();

  const query = client
    .from('awareness_signals')
    .select('*')
    .eq('target_system', targetSystem)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (workspaceId) {
    query.eq('workspace_id', workspaceId);
  } else if (userId) {
    query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Failed to get pending signals: ${error.message}`);

  return (data || []).map(mapSignalFromDB);
}

export async function acknowledgeSignal(signalId: string): Promise<void> {
  const client = getClient();

  const { error } = await client
    .from('awareness_signals')
    .update({ status: 'acknowledged' })
    .eq('id', signalId);

  if (error) throw new Error(`Failed to acknowledge signal: ${error.message}`);

  logger.info('Signal acknowledged', { id: signalId });
}

// ============================================================================
// RECOMMENDATIONS
// ============================================================================

export async function createRecommendation(
  rec: Omit<AwarenessRecommendation, 'id' | 'createdAt' | 'resolvedAt'>
): Promise<AwarenessRecommendation> {
  const client = getClient();

  const { data, error } = await client
    .from('awareness_recommendations')
    .insert({
      workspace_id: rec.workspaceId,
      user_id: rec.userId,
      target_system: rec.targetSystem,
      recommendation_type: rec.recommendationType,
      title: rec.title,
      description: rec.description,
      data: rec.data,
      confidence: rec.confidence,
      priority: rec.priority,
      status: rec.status || 'pending',
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create recommendation: ${error.message}`);

  logger.info('Recommendation created', {
    id: data.id,
    target: rec.targetSystem,
    type: rec.recommendationType,
  });

  return mapRecommendationFromDB(data);
}

export async function listRecommendations(
  workspaceId: string | null,
  userId: string | null,
  options?: {
    status?: string;
    priority?: string;
    targetSystem?: string;
    limit?: number;
  }
): Promise<AwarenessRecommendation[]> {
  const client = getClient();

  const query = client
    .from('awareness_recommendations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(options?.limit || 50);

  if (workspaceId) {
    query.eq('workspace_id', workspaceId);
  } else if (userId) {
    query.eq('user_id', userId);
  }

  if (options?.status) query.eq('status', options.status);
  if (options?.priority) query.eq('priority', options.priority);
  if (options?.targetSystem) query.eq('target_system', options.targetSystem);

  const { data, error } = await query;

  if (error) throw new Error(`Failed to list recommendations: ${error.message}`);

  return (data || []).map(mapRecommendationFromDB);
}

export async function updateRecommendationStatus(
  recId: string,
  status: string
): Promise<void> {
  const client = getClient();

  const updates: any = { status };
  if (status !== 'pending') {
    updates.resolved_at = new Date().toISOString();
  }

  const { error } = await client
    .from('awareness_recommendations')
    .update(updates)
    .eq('id', recId);

  if (error) throw new Error(`Failed to update recommendation: ${error.message}`);

  logger.info('Recommendation status updated', { id: recId, status });
}

// ============================================================================
// CACHE OPERATIONS
// ============================================================================

export function cacheGet<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (new Date() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

export function cacheSet<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, {
    data,
    cachedAt: new Date(),
    expiresAt: new Date(Date.now() + ttlMs),
  });
}

export function cacheClear(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// ============================================================================
// MAPPERS
// ============================================================================

function mapSnapshotFromDB(data: any): AwarenessSnapshot {
  return {
    id: data.id,
    workspaceId: data.workspace_id,
    userId: data.user_id,
    data: data.data,
    createdAt: new Date(data.created_at),
  };
}

function mapEventFromDB(data: any): AwarenessEvent {
  return {
    id: data.id,
    workspaceId: data.workspace_id,
    userId: data.user_id,
    eventType: data.event_type,
    sourceSystem: data.source_system,
    payload: data.payload,
    metadata: data.metadata,
    createdAt: new Date(data.created_at),
  };
}

function mapSignalFromDB(data: any): AwarenessSignal {
  return {
    id: data.id,
    workspaceId: data.workspace_id,
    userId: data.user_id,
    targetSystem: data.target_system,
    signalType: data.signal_type,
    payload: data.payload,
    confidence: parseFloat(data.confidence),
    status: data.status,
    createdAt: new Date(data.created_at),
    actionedAt: data.actioned_at ? new Date(data.actioned_at) : null,
  };
}

function mapRecommendationFromDB(data: any): AwarenessRecommendation {
  return {
    id: data.id,
    workspaceId: data.workspace_id,
    userId: data.user_id,
    targetSystem: data.target_system,
    recommendationType: data.recommendation_type,
    title: data.title,
    description: data.description,
    data: data.data,
    confidence: parseFloat(data.confidence),
    priority: data.priority,
    status: data.status,
    createdAt: new Date(data.created_at),
    resolvedAt: data.resolved_at ? new Date(data.resolved_at) : null,
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

function parseTimeWindow(window: TimeWindow): number {
  const map: Record<TimeWindow, number> = {
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
  };
  return map[window];
}
