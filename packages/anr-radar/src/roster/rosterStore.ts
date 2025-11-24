/**
 * Roster Store
 *
 * Database access helpers for roster management.
 */

import { getClient } from '../anrStore.js';
import { logger } from '../utils/logger.js';

export interface Roster {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface RosterMember {
  id: string;
  roster_id: string;
  artist_slug: string;
  role: 'core' | 'development' | 'legacy' | 'featured';
  status: 'active' | 'on_hold' | 'inactive';
  metadata: Record<string, any>;
  created_at: string;
}

export interface RosterInput {
  workspace_id: string;
  name: string;
  description?: string;
}

export interface RosterMemberInput {
  roster_id: string;
  artist_slug: string;
  role?: 'core' | 'development' | 'legacy' | 'featured';
  status?: 'active' | 'on_hold' | 'inactive';
  metadata?: Record<string, any>;
}

/**
 * Create roster
 */
export async function createRoster(input: RosterInput): Promise<Roster | null> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_rosters')
      .insert(input)
      .select()
      .single();

    if (error) {
      logger.error('Failed to create roster', error, { workspace_id: input.workspace_id });
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to create roster', error, { workspace_id: input.workspace_id });
    return null;
  }
}

/**
 * Get roster by ID
 */
export async function getRosterById(rosterId: string): Promise<Roster | null> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_rosters')
      .select('*')
      .eq('id', rosterId)
      .single();

    if (error) {
      logger.error('Failed to get roster', error, { rosterId });
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to get roster', error, { rosterId });
    return null;
  }
}

/**
 * List rosters for workspace
 */
export async function listRostersForWorkspace(workspaceId: string): Promise<Roster[]> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_rosters')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to list rosters', error, { workspaceId });
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('Failed to list rosters', error, { workspaceId });
    return [];
  }
}

/**
 * Add member to roster
 */
export async function addRosterMember(input: RosterMemberInput): Promise<RosterMember | null> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_roster_members')
      .insert({
        ...input,
        role: input.role || 'core',
        status: input.status || 'active',
        metadata: input.metadata || {},
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to add roster member', error, { roster_id: input.roster_id });
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to add roster member', error, { roster_id: input.roster_id });
    return null;
  }
}

/**
 * Get roster members
 */
export async function getRosterMembers(rosterId: string): Promise<RosterMember[]> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_roster_members')
      .select('*')
      .eq('roster_id', rosterId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to get roster members', error, { rosterId });
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('Failed to get roster members', error, { rosterId });
    return [];
  }
}

/**
 * Remove member from roster
 */
export async function removeRosterMember(rosterId: string, artistSlug: string): Promise<boolean> {
  try {
    const client = getClient();

    const { error } = await client
      .from('anr_roster_members')
      .delete()
      .eq('roster_id', rosterId)
      .eq('artist_slug', artistSlug);

    if (error) {
      logger.error('Failed to remove roster member', error, { rosterId, artistSlug });
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Failed to remove roster member', error, { rosterId, artistSlug });
    return false;
  }
}

/**
 * Update roster member
 */
export async function updateRosterMember(
  rosterId: string,
  artistSlug: string,
  updates: Partial<Pick<RosterMember, 'role' | 'status' | 'metadata'>>
): Promise<RosterMember | null> {
  try {
    const client = getClient();

    const { data, error } = await client
      .from('anr_roster_members')
      .update(updates)
      .eq('roster_id', rosterId)
      .eq('artist_slug', artistSlug)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update roster member', error, { rosterId, artistSlug });
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Failed to update roster member', error, { rosterId, artistSlug });
    return null;
  }
}
