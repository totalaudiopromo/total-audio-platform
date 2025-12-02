import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LEADS } from '@/lib/leads/mock-data';
import type { LeadStatus } from '@/lib/leads/types';

// In-memory store (shared with parent routes)
let leadsStore = [...MOCK_LEADS];

/**
 * PATCH /api/leads/[id]/status
 * Update lead status (pipeline, dismissed, contacted)
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status, updatedBy } = body as { status: LeadStatus; updatedBy?: string };

    if (!status || !['new', 'pipeline', 'dismissed', 'contacted'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: new, pipeline, dismissed, contacted' },
        { status: 400 }
      );
    }

    const leadIndex = leadsStore.findIndex(l => l.id === id);

    if (leadIndex === -1) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const previousStatus = leadsStore[leadIndex].status;

    // Update the lead status
    leadsStore[leadIndex] = {
      ...leadsStore[leadIndex],
      status,
      statusUpdatedAt: new Date().toISOString(),
      statusUpdatedBy: updatedBy || null,
      updatedAt: new Date().toISOString(),
    };

    // Log the activity (in production, this would be stored in lead_activity table)
    const activity = {
      id: `activity-${Date.now()}`,
      leadId: id,
      action: getActionFromStatusChange(previousStatus, status),
      details: {
        previousStatus,
        newStatus: status,
        updatedBy,
      },
      createdAt: new Date().toISOString(),
    };

    console.log('[Leads API] Activity logged:', activity);

    return NextResponse.json({
      lead: leadsStore[leadIndex],
      activity,
    });
  } catch (error) {
    console.error('[Leads API] Error updating lead status:', error);
    return NextResponse.json({ error: 'Failed to update lead status' }, { status: 500 });
  }
}

function getActionFromStatusChange(from: LeadStatus, to: LeadStatus): string {
  if (to === 'pipeline') return 'added_to_pipeline';
  if (to === 'dismissed') return 'dismissed';
  if (to === 'contacted') return 'contacted';
  return 'status_changed';
}
