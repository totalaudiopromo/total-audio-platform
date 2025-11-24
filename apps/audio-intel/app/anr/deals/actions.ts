'use server';

import { revalidatePath } from 'next/cache';

export async function updateDealStage(dealId: string, newStage: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/anr/deals/${dealId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to update deal stage');
    }

    revalidatePath('/anr/deals');
    revalidatePath('/anr/workbench');

    return { success: true };
  } catch (error) {
    console.error('Error updating deal stage:', error);
    return { success: false, error: 'Failed to update deal stage' };
  }
}

export async function createDeal(data: {
  workspace_id: string;
  artist_slug: string;
  roster_id?: string;
  owner_user_id?: string;
  priority?: string;
  notes?: string;
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/anr/deals`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to create deal');
    }

    const result = await res.json();

    revalidatePath('/anr/deals');
    revalidatePath('/anr/workbench');

    return { success: true, deal: result.deal };
  } catch (error) {
    console.error('Error creating deal:', error);
    return { success: false, error: 'Failed to create deal' };
  }
}

export async function logDealEvent(dealId: string, event_type: string, payload: Record<string, any>) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/anr/deals/${dealId}/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type, payload }),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to log event');
    }

    revalidatePath(`/anr/deals/${dealId}`);

    return { success: true };
  } catch (error) {
    console.error('Error logging deal event:', error);
    return { success: false, error: 'Failed to log event' };
  }
}
