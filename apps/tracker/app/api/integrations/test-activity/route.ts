/**
 * Test Activity Generator
 * Creates fake activity logs to demonstrate the feed
 * DELETE THIS BEFORE PRODUCTION
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient(cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's first connection
    const { data: connection } = await supabase
      .from('integration_connections')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (!connection) {
      return NextResponse.json(
        { error: 'No connections found' },
        { status: 404 }
      );
    }

    // Generate test activity logs
    const testActivities = [
      {
        connection_id: connection.id,
        user_id: user.id,
        integration_type: 'google_sheets',
        activity_type: 'sync_to_sheet',
        status: 'success',
        message: 'Synced 7 campaigns to Google Sheets',
        metadata: { records_synced: 7, spreadsheet_id: 'test123' },
      },
      {
        connection_id: connection.id,
        user_id: user.id,
        integration_type: 'gmail',
        activity_type: 'reply_detected',
        status: 'success',
        message: 'Reply detected from BBC Radio 1',
        metadata: { campaign_name: 'BBC Radio 1 - Future Sounds Pitch' },
      },
      {
        connection_id: connection.id,
        user_id: user.id,
        integration_type: 'google_sheets',
        activity_type: 'sync_from_sheet',
        status: 'success',
        message: 'Updated 2 campaigns from Google Sheets',
        metadata: { records_synced: 2 },
      },
      {
        connection_id: connection.id,
        user_id: user.id,
        integration_type: 'gmail',
        activity_type: 'reply_detected',
        status: 'success',
        message: 'Reply detected from Spotify Editorial',
        metadata: { campaign_name: 'Spotify UK Editorial Playlists' },
      },
    ];

    // Insert test activities
    const { error } = await supabase
      .from('integration_activity_log')
      .insert(testActivities);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Test activity generated',
      count: testActivities.length,
    });
  } catch (error: any) {
    console.error('Error generating test activity:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate test activity' },
      { status: 500 }
    );
  }
}
