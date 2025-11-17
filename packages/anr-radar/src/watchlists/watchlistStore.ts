/**
 * Watchlist Store
 */

import { getClient } from '../anrStore.js';
import { logger } from '../utils/logger.js';

export interface Watchlist {
  id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface WatchlistMember {
  id: string;
  watchlist_id: string;
  artist_slug: string;
  reason?: string;
  created_at: string;
}

export async function createWatchlist(
  workspaceId: string,
  userId: string,
  name: string,
  description?: string
): Promise<Watchlist | null> {
  try {
    const client = getClient();
    const { data, error } = await client
      .from('anr_watchlists')
      .insert({ workspace_id: workspaceId, user_id: userId, name, description })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create watchlist', error);
      return null;
    }
    return data;
  } catch (error) {
    logger.error('Failed to create watchlist', error);
    return null;
  }
}

export async function listWatchlistsForUser(userId: string): Promise<Watchlist[]> {
  try {
    const client = getClient();
    const { data, error } = await client
      .from('anr_watchlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to list watchlists', error);
      return [];
    }
    return data || [];
  } catch (error) {
    logger.error('Failed to list watchlists', error);
    return [];
  }
}

export async function addToWatchlist(
  watchlistId: string,
  artistSlug: string,
  reason?: string
): Promise<WatchlistMember | null> {
  try {
    const client = getClient();
    const { data, error } = await client
      .from('anr_watchlist_members')
      .insert({ watchlist_id: watchlistId, artist_slug: artistSlug, reason })
      .select()
      .single();

    if (error) {
      logger.error('Failed to add to watchlist', error);
      return null;
    }
    return data;
  } catch (error) {
    logger.error('Failed to add to watchlist', error);
    return null;
  }
}

export async function removeFromWatchlist(
  watchlistId: string,
  artistSlug: string
): Promise<boolean> {
  try {
    const client = getClient();
    const { error } = await client
      .from('anr_watchlist_members')
      .delete()
      .eq('watchlist_id', watchlistId)
      .eq('artist_slug', artistSlug);

    if (error) {
      logger.error('Failed to remove from watchlist', error);
      return false;
    }
    return true;
  } catch (error) {
    logger.error('Failed to remove from watchlist', error);
    return false;
  }
}

export async function listWatchlistMembers(watchlistId: string): Promise<WatchlistMember[]> {
  try {
    const client = getClient();
    const { data, error } = await client
      .from('anr_watchlist_members')
      .select('*')
      .eq('watchlist_id', watchlistId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to list watchlist members', error);
      return [];
    }
    return data || [];
  } catch (error) {
    logger.error('Failed to list watchlist members', error);
    return [];
  }
}
