'use server';

import { revalidatePath } from 'next/cache';

export async function createShowcase(data: {
  workspace_id: string;
  name: string;
  description?: string;
  context?: Record<string, any>;
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/anr/showcases`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to create showcase');
    }

    const result = await res.json();

    revalidatePath('/anr/showcases');

    return { success: true, showcase: result.showcase };
  } catch (error) {
    console.error('Error creating showcase:', error);
    return { success: false, error: 'Failed to create showcase' };
  }
}

export async function addArtistToShowcase(
  showcaseId: string,
  artistSlug: string,
  position?: number,
  notes?: string
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/anr/showcases/${showcaseId}/members`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artist_slug: artistSlug, position, notes }),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to add artist to showcase');
    }

    revalidatePath(`/anr/showcases/${showcaseId}`);

    return { success: true };
  } catch (error) {
    console.error('Error adding artist to showcase:', error);
    return { success: false, error: 'Failed to add artist to showcase' };
  }
}
