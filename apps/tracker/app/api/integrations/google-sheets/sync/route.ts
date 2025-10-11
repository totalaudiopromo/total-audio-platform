/**
 * Google Sheets Manual Sync Endpoint
 * POST /api/integrations/google-sheets/sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleSheetsSync } from '@/lib/integrations/google-sheets-sync';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's Google Sheets connection
    const { data: connection } = await supabase
      .from('integration_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('integration_type', 'google_sheets')
      .single();

    if (!connection) {
      return NextResponse.json(
        { error: 'Google Sheets not connected' },
        { status: 404 }
      );
    }

    // Perform bidirectional sync
    const sheetsSync = new GoogleSheetsSync();

    // Sync to sheet
    const toSheetResult = await sheetsSync.syncToSheet(connection.id);

    // Sync from sheet
    const fromSheetResult = await sheetsSync.syncFromSheet(connection.id);

    return NextResponse.json({
      success: toSheetResult.success && fromSheetResult.success,
      toSheet: toSheetResult,
      fromSheet: fromSheetResult,
    });
  } catch (error: any) {
    console.error('Error in Google Sheets sync:', error);
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 500 }
    );
  }
}
