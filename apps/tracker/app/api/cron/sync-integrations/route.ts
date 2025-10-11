/**
 * Background Integration Sync Worker
 * Runs every 15 minutes via Vercel Cron
 * GET /api/cron/sync-integrations
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleSheetsSync } from '@/lib/integrations/google-sheets-sync';
import { GmailReplyTracker } from '@/lib/integrations/gmail-reply-tracker';

export const maxDuration = 300; // 5 minutes max execution

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Get all active connections that need syncing
    const { data: connections } = await supabase
      .from('integration_connections')
      .select('*')
      .eq('status', 'active')
      .eq('sync_enabled', true);

    if (!connections || connections.length === 0) {
      return NextResponse.json({
        message: 'No active connections to sync',
        synced: 0,
      });
    }

    const results: any[] = [];

    // Sync each connection
    for (const connection of connections) {
      try {
        let result = null;

        switch (connection.integration_type) {
          case 'google_sheets':
            const sheetsSync = new GoogleSheetsSync();
            const toSheet = await sheetsSync.syncToSheet(connection.id);
            const fromSheet = await sheetsSync.syncFromSheet(connection.id);
            result = { type: 'google_sheets', toSheet, fromSheet };
            break;

          case 'gmail':
            const gmailTracker = new GmailReplyTracker();
            const gmailResult = await gmailTracker.checkForReplies(connection.id);
            result = { type: 'gmail', ...gmailResult };
            break;

          // Add other integration types here
          case 'airtable':
            // TODO: Implement Airtable sync
            break;

          case 'mailchimp':
            // TODO: Implement Mailchimp sync
            break;
        }

        if (result) {
          results.push({
            connection_id: connection.id,
            integration_type: connection.integration_type,
            success: true,
            result,
          });
        }
      } catch (error: any) {
        console.error(`Sync failed for ${connection.id}:`, error);
        results.push({
          connection_id: connection.id,
          integration_type: connection.integration_type,
          success: false,
          error: error.message,
        });

        // Update error count
        await supabase
          .from('integration_connections')
          .update({
            error_count: supabase.raw('error_count + 1'),
            error_message: error.message,
          })
          .eq('id', connection.id);
      }
    }

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      message: 'Sync complete',
      synced: successCount,
      total: connections.length,
      results,
    });
  } catch (error: any) {
    console.error('Error in sync cron job:', error);
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 500 }
    );
  }
}
