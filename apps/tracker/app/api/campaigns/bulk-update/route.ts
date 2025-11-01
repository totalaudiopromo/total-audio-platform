import { createServerClient } from '@total-audio/core-db/server'
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient(cookies());

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const { campaignIds, updates } = await request.json();

    if (!Array.isArray(campaignIds) || campaignIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid campaign IDs' },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Invalid updates object' },
        { status: 400 }
      );
    }

    // Only allow updating specific fields
    const allowedFields = ['status', 'notes'];
    const sanitizedUpdates: any = {};

    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        sanitizedUpdates[key] = updates[key];
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update campaigns (only user's own campaigns)
    const { error: updateError } = await supabase
      .from('campaigns')
      .update(sanitizedUpdates)
      .in('id', campaignIds)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Bulk update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update campaigns' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      updatedCount: campaignIds.length,
      updates: sanitizedUpdates,
    });
  } catch (error) {
    console.error('Bulk update route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
