/**
 * Showcase Store
 */

import { getClient } from '../anrStore.js';
import { logger } from '../utils/logger.js';

export interface Showcase {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  context: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ShowcaseMember {
  id: string;
  showcase_id: string;
  artist_slug: string;
  position?: number;
  notes?: string;
  created_at: string;
}

export async function createShowcase(
  workspaceId: string,
  name: string,
  description?: string,
  context?: Record<string, any>
): Promise<Showcase | null> {
  try {
    const client = getClient();
    const { data, error } = await client
      .from('anr_showcases')
      .insert({
        workspace_id: workspaceId,
        name,
        description,
        context: context || {},
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create showcase', error);
      return null;
    }
    return data;
  } catch (error) {
    logger.error('Failed to create showcase', error);
    return null;
  }
}

export async function getShowcaseById(showcaseId: string): Promise<Showcase | null> {
  try {
    const client = getClient();
    const { data, error } = await client
      .from('anr_showcases')
      .select('*')
      .eq('id', showcaseId)
      .single();

    if (error) {
      logger.error('Failed to get showcase', error);
      return null;
    }
    return data;
  } catch (error) {
    logger.error('Failed to get showcase', error);
    return null;
  }
}

export async function listShowcasesForWorkspace(workspaceId: string): Promise<Showcase[]> {
  try {
    const client = getClient();
    const { data, error } = await client
      .from('anr_showcases')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to list showcases', error);
      return [];
    }
    return data || [];
  } catch (error) {
    logger.error('Failed to list showcases', error);
    return [];
  }
}

export async function addArtistToShowcase(
  showcaseId: string,
  artistSlug: string,
  position?: number,
  notes?: string
): Promise<ShowcaseMember | null> {
  try {
    const client = getClient();
    const { data, error } = await client
      .from('anr_showcase_members')
      .insert({
        showcase_id: showcaseId,
        artist_slug: artistSlug,
        position,
        notes,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to add artist to showcase', error);
      return null;
    }
    return data;
  } catch (error) {
    logger.error('Failed to add artist to showcase', error);
    return null;
  }
}

export async function listShowcaseMembers(showcaseId: string): Promise<ShowcaseMember[]> {
  try {
    const client = getClient();
    const { data, error } = await client
      .from('anr_showcase_members')
      .select('*')
      .eq('showcase_id', showcaseId)
      .order('position', { ascending: true, nullsFirst: false });

    if (error) {
      logger.error('Failed to list showcase members', error);
      return [];
    }
    return data || [];
  } catch (error) {
    logger.error('Failed to list showcase members', error);
    return [];
  }
}
