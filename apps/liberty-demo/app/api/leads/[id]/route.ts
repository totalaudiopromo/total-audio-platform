import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LEADS } from '@/lib/leads/mock-data';

// In-memory store (shared with main route)
let leadsStore = [...MOCK_LEADS];

/**
 * GET /api/leads/[id]
 * Fetch a single lead by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const lead = leadsStore.find(l => l.id === id);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('[Leads API] Error fetching lead:', error);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

/**
 * PATCH /api/leads/[id]
 * Update a lead
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await request.json();
    const leadIndex = leadsStore.findIndex(l => l.id === id);

    if (leadIndex === -1) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Update the lead
    leadsStore[leadIndex] = {
      ...leadsStore[leadIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(leadsStore[leadIndex]);
  } catch (error) {
    console.error('[Leads API] Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

/**
 * DELETE /api/leads/[id]
 * Delete a lead
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const leadIndex = leadsStore.findIndex(l => l.id === id);

    if (leadIndex === -1) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    leadsStore.splice(leadIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Leads API] Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
