/**
 * Airtable Sync Endpoint
 * POST /api/integrations/airtable/sync
 *
 * Triggers sync operation between Total Audio and Airtable
 * Supports bidirectional sync, to_airtable, and from_airtable
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { AirtableSyncService } from '@total-audio/core-db/integrations/airtable';

type SyncDirection = 'to_airtable' | 'from_airtable' | 'bidirectional';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient(cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const direction: SyncDirection = body.direction || 'bidirectional';

    // Validate direction
    if (!['to_airtable', 'from_airtable', 'bidirectional'].includes(direction)) {
      return NextResponse.json(
        { error: 'Invalid sync direction. Must be: to_airtable, from_airtable, or bidirectional' },
        { status: 400 }
      );
    }

    // Create Airtable sync service instance
    const airtableSync = new AirtableSyncService(user.id);
    const config = await airtableSync.loadConfig();

    if (!config) {
      return NextResponse.json(
        { error: 'Airtable integration not configured. Please connect first.' },
        { status: 400 }
      );
    }

    // Validate credentials
    const isValid = await airtableSync.validateCredentials();
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid Airtable credentials. Please reconnect.' },
        { status: 400 }
      );
    }

    // Execute sync based on direction
    let result;

    if (direction === 'bidirectional') {
      // Fetch workspace contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('workspace_contacts_registry')
        .select('*')
        .eq('workspace_id', user.id);

      if (contactsError) {
        throw new Error(`Failed to fetch contacts: ${contactsError.message}`);
      }

      // Sync to Airtable
      const toAirtableResult = await airtableSync.syncToExternal(contacts || []);

      // Sync from Airtable
      const fromAirtableResult = await airtableSync.syncFromExternal();

      result = {
        direction: 'bidirectional',
        to_airtable: {
          records_processed: toAirtableResult.recordsProcessed,
          records_synced: toAirtableResult.recordsSynced,
          errors: toAirtableResult.errors,
        },
        from_airtable: {
          records_processed: fromAirtableResult.recordsProcessed,
          records_synced: fromAirtableResult.recordsSynced,
          errors: fromAirtableResult.errors,
        },
        success: toAirtableResult.success && fromAirtableResult.success,
      };
    } else if (direction === 'to_airtable') {
      // Fetch workspace contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('workspace_contacts_registry')
        .select('*')
        .eq('workspace_id', user.id);

      if (contactsError) {
        throw new Error(`Failed to fetch contacts: ${contactsError.message}`);
      }

      // Sync to Airtable only
      const syncResult = await airtableSync.syncToExternal(contacts || []);

      result = {
        direction: 'to_airtable',
        records_processed: syncResult.recordsProcessed,
        records_synced: syncResult.recordsSynced,
        errors: syncResult.errors,
        success: syncResult.success,
      };
    } else {
      // from_airtable
      // Sync from Airtable only
      const syncResult = await airtableSync.syncFromExternal();

      result = {
        direction: 'from_airtable',
        records_processed: syncResult.recordsProcessed,
        records_synced: syncResult.recordsSynced,
        errors: syncResult.errors,
        success: syncResult.success,
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error syncing with Airtable:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to sync with Airtable',
      },
      { status: 500 }
    );
  }
}

/**
 * Get recent sync history
 * GET /api/integrations/airtable/sync
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient(cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get sync logs
    const airtableSync = new AirtableSyncService(user.id);
    await airtableSync.loadConfig();
    const logs = await airtableSync.getSyncLogs(20);

    return NextResponse.json({
      sync_history: logs,
      total_syncs: logs.length,
    });
  } catch (error) {
    console.error('Error fetching sync history:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch sync history',
      },
      { status: 500 }
    );
  }
}
