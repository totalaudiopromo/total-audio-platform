/**
 * Airtable Status Endpoint
 * GET /api/integrations/airtable/status
 *
 * Returns connection status, last sync details, and record counts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { AirtableSyncService } from '@total-audio/core-db/integrations/airtable';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient(cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Airtable sync service instance
    const airtableSync = new AirtableSyncService(user.id, supabase);
    const config = await airtableSync.loadConfig();

    if (!config) {
      return NextResponse.json({
        connected: false,
        message: 'Airtable integration not configured',
      });
    }

    // Validate credentials
    const isValid = await airtableSync.validateCredentials();

    // Get workspace contact count
    const { count: workspaceContactCount, error: countError } = await supabase
      .from('workspace_contacts_registry')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', user.id);

    if (countError) {
      console.error('Error fetching workspace contact count:', countError);
    }

    // Get recent sync logs
    const syncLogs = await airtableSync.getSyncLogs(5);
    const lastSync = syncLogs.length > 0 ? syncLogs[0] : null;

    // Calculate sync stats from recent logs
    const syncStats = {
      total_syncs: syncLogs.length,
      last_sync: lastSync
        ? {
            started_at: lastSync.started_at,
            completed_at: lastSync.completed_at,
            status: lastSync.status,
            records_processed: lastSync.records_processed,
            records_synced: lastSync.records_synced,
            sync_type: lastSync.sync_type,
          }
        : null,
      recent_errors: syncLogs
        .filter((log: any) => log.status === 'error')
        .slice(0, 3)
        .map((log: any) => ({
          timestamp: log.started_at,
          error: log.error_message,
        })),
    };

    return NextResponse.json({
      connected: isValid,
      status: config.status,
      last_sync_at: config.last_sync_at,
      config: {
        base_id: config.settings?.base_id,
        table_name: config.settings?.table_name || 'Contacts',
        view_name: config.settings?.view_name || 'Grid view',
        sync_direction: config.settings?.sync_direction || 'bidirectional',
      },
      record_counts: {
        workspace_contacts: workspaceContactCount || 0,
      },
      sync_stats: syncStats,
      error_message: config.error_message || null,
    });
  } catch (error) {
    console.error('Error fetching Airtable status:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch Airtable status',
      },
      { status: 500 }
    );
  }
}
