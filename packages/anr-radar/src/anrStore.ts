/**
 * A&R Radar Store
 *
 * Database access helpers for A&R Radar tables.
 * Uses Supabase client for all database operations.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  ANRCandidate,
  ANRCandidateInput,
  ANRScoreSnapshot,
  ANRScoreInput,
  ANREvent,
  ANREventInput,
  ANRShortlist,
  ANRShortlistInput,
  ANRShortlistMember,
  ANRShortlistMemberInput,
  ANRInsight,
  ANRInsightInput,
  CandidateFilters,
  ScoreFilters,
  PaginatedResponse,
} from './types.js';
import { logger } from './utils/logger.js';
import { today } from './utils/dates.js';

// Initialize Supabase client (can be overridden via setSupabaseClient)
let supabase: SupabaseClient | null = null;

/**
 * Set Supabase client instance
 */
export function setSupabaseClient(client: SupabaseClient): void {
  supabase = client;
}

/**
 * Get Supabase client instance
 */
function getClient(): SupabaseClient {
  if (!supabase) {
    // Fallback: create from environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Supabase client not initialized and environment variables not found');
    }

    supabase = createClient(url, key);
  }

  return supabase;
}

// ========================================
// CANDIDATES
// ========================================

/**
 * Upsert a candidate
 */
export async function upsertCandidate(
  artistSlug: string,
  data: Partial<ANRCandidateInput>
): Promise<ANRCandidate | null> {
  try {
    const client = getClient();

    const candidateData: ANRCandidateInput = {
      artist_slug: artistSlug,
      display_name: data.display_name || artistSlug,
      ...data,
    };

    const { data: candidate, error } = await client
      .from('anr_candidates')
      .upsert(candidateData, { onConflict: 'artist_slug' })
      .select()
      .single();

    if (error) {
      logger.error('Failed to upsert candidate', error, { artistSlug });
      return null;
    }

    return candidate;
  } catch (error) {
    logger.error('Failed to upsert candidate', error, { artistSlug });
    return null;
  }
}

/**
 * Get candidate by artist slug
 */
export async function getCandidateBySlug(artistSlug: string): Promise<ANRCandidate | null> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_candidates')
      .select('*')
      .eq('artist_slug', artistSlug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      logger.error('Failed to get candidate', error, { artistSlug });
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to get candidate', error, { artistSlug });
    return null;
  }
}

/**
 * Get candidate by ID
 */
export async function getCandidateById(candidateId: string): Promise<ANRCandidate | null> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_candidates')
      .select('*')
      .eq('id', candidateId)
      .single();

    if (error) {
      logger.error('Failed to get candidate by ID', error, { candidateId });
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to get candidate by ID', error, { candidateId });
    return null;
  }
}

/**
 * List candidates with filters
 */
export async function listCandidates(
  filters?: CandidateFilters
): Promise<PaginatedResponse<ANRCandidate>> {
  try {
    const client = getClient();
    let query = client.from('anr_candidates').select('*', { count: 'exact' });

    // Apply filters
    if (filters?.countries && filters.countries.length > 0) {
      query = query.in('country', filters.countries);
    }

    if (filters?.scenes && filters.scenes.length > 0) {
      query = query.in('primary_scene_slug', filters.scenes);
    }

    if (filters?.microgenres && filters.microgenres.length > 0) {
      query = query.overlaps('microgenres', filters.microgenres);
    }

    // Pagination
    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;
    query = query.range(offset, offset + limit - 1);

    // Order by created_at desc
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      logger.error('Failed to list candidates', error);
      return {
        data: [],
        total: 0,
        limit,
        offset,
        has_more: false,
      };
    }

    return {
      data: data || [],
      total: count || 0,
      limit,
      offset,
      has_more: (count || 0) > offset + limit,
    };
  } catch (error) {
    logger.error('Failed to list candidates', error);
    return {
      data: [],
      total: 0,
      limit: filters?.limit || 50,
      offset: filters?.offset || 0,
      has_more: false,
    };
  }
}

// ========================================
// SCORES
// ========================================

/**
 * Save score snapshot
 */
export async function saveScoreSnapshot(
  candidateId: string,
  scores: Omit<ANRScoreInput, 'candidate_id'>
): Promise<ANRScoreSnapshot | null> {
  try {
    const client = getClient();

    const scoreData: ANRScoreInput = {
      candidate_id: candidateId,
      snapshot_date: scores.snapshot_date || today(),
      ...scores,
    };

    const { data, error } = await client
      .from('anr_scores')
      .insert(scoreData)
      .select()
      .single();

    if (error) {
      logger.error('Failed to save score snapshot', error, { candidateId });
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to save score snapshot', error, { candidateId });
    return null;
  }
}

/**
 * Get latest score for candidate
 */
export async function getLatestScore(candidateId: string): Promise<ANRScoreSnapshot | null> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_scores')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      logger.error('Failed to get latest score', error, { candidateId });
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to get latest score', error, { candidateId });
    return null;
  }
}

/**
 * Get score history for candidate
 */
export async function getScoreHistory(
  candidateId: string,
  limit: number = 30
): Promise<ANRScoreSnapshot[]> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_scores')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('snapshot_date', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error('Failed to get score history', error, { candidateId });
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('Failed to get score history', error, { candidateId });
    return [];
  }
}

// ========================================
// EVENTS
// ========================================

/**
 * Record an event
 */
export async function recordEvent(
  candidateId: string,
  event: Omit<ANREventInput, 'candidate_id'>
): Promise<ANREvent | null> {
  try {
    const client = getClient();

    const eventData: ANREventInput = {
      candidate_id: candidateId,
      ...event,
    };

    const { data, error } = await client
      .from('anr_events')
      .insert(eventData)
      .select()
      .single();

    if (error) {
      logger.error('Failed to record event', error, { candidateId, event_type: event.event_type });
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to record event', error, { candidateId });
    return null;
  }
}

/**
 * List events for candidate
 */
export async function listEvents(
  candidateId: string,
  limit: number = 100
): Promise<ANREvent[]> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_events')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('event_date', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error('Failed to list events', error, { candidateId });
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('Failed to list events', error, { candidateId });
    return [];
  }
}

// ========================================
// SHORTLISTS
// ========================================

/**
 * Create shortlist
 */
export async function createShortlist(
  userId: string,
  data: Omit<ANRShortlistInput, 'user_id'>
): Promise<ANRShortlist | null> {
  try {
    const client = getClient();

    const shortlistData: ANRShortlistInput = {
      user_id: userId,
      ...data,
    };

    const { data: shortlist, error } = await client
      .from('anr_shortlists')
      .insert(shortlistData)
      .select()
      .single();

    if (error) {
      logger.error('Failed to create shortlist', error, { userId });
      return null;
    }

    return shortlist;
  } catch (error) {
    logger.error('Failed to create shortlist', error, { userId });
    return null;
  }
}

/**
 * Add candidate to shortlist
 */
export async function addCandidateToShortlist(
  shortlistId: string,
  candidateId: string,
  data?: Partial<Omit<ANRShortlistMemberInput, 'shortlist_id' | 'candidate_id'>>
): Promise<ANRShortlistMember | null> {
  try {
    const client = getClient();

    const memberData: ANRShortlistMemberInput = {
      shortlist_id: shortlistId,
      candidate_id: candidateId,
      ...data,
    };

    const { data: member, error } = await client
      .from('anr_shortlist_members')
      .insert(memberData)
      .select()
      .single();

    if (error) {
      logger.error('Failed to add candidate to shortlist', error, { shortlistId, candidateId });
      return null;
    }

    return member;
  } catch (error) {
    logger.error('Failed to add candidate to shortlist', error, { shortlistId, candidateId });
    return null;
  }
}

/**
 * List shortlists for user
 */
export async function listShortlistsForUser(userId: string): Promise<ANRShortlist[]> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_shortlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to list shortlists', error, { userId });
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('Failed to list shortlists', error, { userId });
    return [];
  }
}

/**
 * Get shortlist with members
 */
export async function getShortlist(shortlistId: string): Promise<{
  shortlist: ANRShortlist | null;
  members: Array<ANRShortlistMember & { candidate?: ANRCandidate }>;
}> {
  try {
    const client = getClient();

    // Get shortlist
    const { data: shortlist, error: shortlistError } = await client
      .from('anr_shortlists')
      .select('*')
      .eq('id', shortlistId)
      .single();

    if (shortlistError) {
      logger.error('Failed to get shortlist', shortlistError, { shortlistId });
      return { shortlist: null, members: [] };
    }

    // Get members with candidate data
    const { data: members, error: membersError } = await client
      .from('anr_shortlist_members')
      .select(`
        *,
        candidate:anr_candidates(*)
      `)
      .eq('shortlist_id', shortlistId)
      .order('position', { ascending: true, nullsFirst: false });

    if (membersError) {
      logger.error('Failed to get shortlist members', membersError, { shortlistId });
      return { shortlist, members: [] };
    }

    return {
      shortlist,
      members: members || [],
    };
  } catch (error) {
    logger.error('Failed to get shortlist', error, { shortlistId });
    return { shortlist: null, members: [] };
  }
}

// ========================================
// INSIGHTS
// ========================================

/**
 * Save insight
 */
export async function saveInsight(
  userId: string,
  insight: Omit<ANRInsightInput, 'user_id'>
): Promise<ANRInsight | null> {
  try {
    const client = getClient();

    const insightData: ANRInsightInput = {
      user_id: userId,
      ...insight,
    };

    const { data, error } = await client
      .from('anr_insights')
      .insert(insightData)
      .select()
      .single();

    if (error) {
      logger.error('Failed to save insight', error, { userId, insight_type: insight.insight_type });
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to save insight', error, { userId });
    return null;
  }
}

/**
 * List insights for user
 */
export async function listInsights(userId: string, limit: number = 20): Promise<ANRInsight[]> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error('Failed to list insights', error, { userId });
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('Failed to list insights', error, { userId });
    return [];
  }
}

/**
 * Delete old insights for user (keep only latest N)
 */
export async function cleanupOldInsights(userId: string, keepLatest: number = 50): Promise<void> {
  try {
    const client = getClient();

    // Get IDs of insights to keep
    const { data: insightsToKeep } = await client
      .from('anr_insights')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(keepLatest);

    if (!insightsToKeep || insightsToKeep.length === 0) {
      return;
    }

    const idsToKeep = insightsToKeep.map(i => i.id);

    // Delete insights not in the keep list
    const { error } = await client
      .from('anr_insights')
      .delete()
      .eq('user_id', userId)
      .not('id', 'in', `(${idsToKeep.join(',')})`);

    if (error) {
      logger.error('Failed to cleanup old insights', error, { userId });
    }
  } catch (error) {
    logger.error('Failed to cleanup old insights', error, { userId });
  }
}
