/**
 * Deal Store
 *
 * Database access for deal flow management.
 */

import { getClient } from '../anrStore.js';
import { logger } from '../utils/logger.js';

export type DealStage =
  | 'none'
  | 'light_interest'
  | 'serious'
  | 'offer_made'
  | 'negotiation'
  | 'signed'
  | 'lost';

export type DealPriority = 'low' | 'medium' | 'high';

export type DealEventType =
  | 'note'
  | 'stage_change'
  | 'offer'
  | 'meeting'
  | 'showcase'
  | 'internal_discussion'
  | 'follow_up'
  | 'feedback';

export interface Deal {
  id: string;
  workspace_id: string;
  artist_slug: string;
  roster_id?: string;
  stage: DealStage;
  probability?: number;
  priority: DealPriority;
  owner_user_id?: string;
  notes?: string;
  last_update: string;
  created_at: string;
}

export interface DealEvent {
  id: string;
  deal_id: string;
  event_type: DealEventType;
  payload: Record<string, any>;
  created_at: string;
}

export interface DealInput {
  workspace_id: string;
  artist_slug: string;
  roster_id?: string;
  stage?: DealStage;
  probability?: number;
  priority?: DealPriority;
  owner_user_id?: string;
  notes?: string;
}

export interface DealEventInput {
  deal_id: string;
  event_type: DealEventType;
  payload: Record<string, any>;
}

/**
 * Create deal
 */
export async function createDeal(input: DealInput): Promise<Deal | null> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_deals')
      .insert({
        ...input,
        stage: input.stage || 'light_interest',
        priority: input.priority || 'medium',
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create deal', error);
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to create deal', error);
    return null;
  }
}

/**
 * Get deal by ID
 */
export async function getDealById(dealId: string): Promise<Deal | null> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_deals')
      .select('*')
      .eq('id', dealId)
      .single();

    if (error) {
      logger.error('Failed to get deal', error, { dealId });
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to get deal', error, { dealId });
    return null;
  }
}

/**
 * List deals for workspace
 */
export async function listDealsForWorkspace(
  workspaceId: string,
  filters?: {
    stage?: DealStage;
    owner_user_id?: string;
    priority?: DealPriority;
  }
): Promise<Deal[]> {
  try {
    const client = getClient();

    let query = client
      .from('anr_deals')
      .select('*')
      .eq('workspace_id', workspaceId);

    if (filters?.stage) {
      query = query.eq('stage', filters.stage);
    }

    if (filters?.owner_user_id) {
      query = query.eq('owner_user_id', filters.owner_user_id);
    }

    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }

    query = query.order('last_update', { ascending: false });

    const { data, error } = await query;

    if (error) {
      logger.error('Failed to list deals', error, { workspaceId });
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('Failed to list deals', error, { workspaceId });
    return [];
  }
}

/**
 * Update deal
 */
export async function updateDeal(
  dealId: string,
  updates: Partial<Pick<Deal, 'stage' | 'probability' | 'priority' | 'notes' | 'roster_id'>>
): Promise<Deal | null> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_deals')
      .update({ ...updates, last_update: new Date().toISOString() })
      .eq('id', dealId)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update deal', error, { dealId });
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to update deal', error, { dealId });
    return null;
  }
}

/**
 * Log deal event
 */
export async function logDealEvent(input: DealEventInput): Promise<DealEvent | null> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_deal_events')
      .insert(input)
      .select()
      .single();

    if (error) {
      logger.error('Failed to log deal event', error, { deal_id: input.deal_id });
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to log deal event', error, { deal_id: input.deal_id });
    return null;
  }
}

/**
 * Get deal events
 */
export async function getDealEvents(dealId: string): Promise<DealEvent[]> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_deal_events')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to get deal events', error, { dealId });
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('Failed to get deal events', error, { dealId });
    return [];
  }
}
