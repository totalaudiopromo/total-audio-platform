'use server';

import { revalidatePath } from 'next/cache';

export async function createWatchlist(data: {
  workspace_id: string;
  user_id: string;
  name: string;
  description?: string;
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/anr/watchlists`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to create watchlist');
    }

    const result = await res.json();

    revalidatePath('/anr/watchlists');

    return { success: true, watchlist: result.watchlist };
  } catch (error) {
    console.error('Error creating watchlist:', error);
    return { success: false, error: 'Failed to create watchlist' };
  }
}

export async function addToWatchlist(watchlistId: string, artistSlug: string, reason?: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/anr/watchlists/${watchlistId}/members`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artist_slug: artistSlug, reason }),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to add to watchlist');
    }

    revalidatePath(`/anr/watchlists/${watchlistId}`);
    revalidatePath('/anr/workbench');

    return { success: true };
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return { success: false, error: 'Failed to add to watchlist' };
  }
}

export async function removeFromWatchlist(watchlistId: string, artistSlug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/anr/watchlists/${watchlistId}/members?artist_slug=${artistSlug}`,
      {
        method: 'DELETE',
      }
    );

    if (!res.ok) {
      throw new Error('Failed to remove from watchlist');
    }

    revalidatePath(`/anr/watchlists/${watchlistId}`);

    return { success: true };
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return { success: false, error: 'Failed to remove from watchlist' };
  }
}
