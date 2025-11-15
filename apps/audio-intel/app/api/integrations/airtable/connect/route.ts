/**
 * Airtable Connection Endpoint (API Key-Based)
 * POST /api/integrations/airtable/connect
 *
 * Saves Airtable API key and base configuration to the database
 * Validates credentials before saving
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { AirtableSyncService } from '@total-audio/core-db/integrations/airtable';

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
    const { api_key, base_id, table_name, view_name, field_mapping } = body;

    // Validate required fields
    if (!api_key || !base_id) {
      return NextResponse.json(
        { error: 'Missing required fields: api_key, base_id' },
        { status: 400 }
      );
    }

    // Create Airtable sync service instance
    const airtableSync = new AirtableSyncService(user.id);

    // Save configuration
    const configSaved = await airtableSync.saveConfig({
      workspace_id: user.id,
      integration_name: 'airtable',
      credentials: {
        api_key,
      },
      settings: {
        base_id,
        table_name: table_name || 'Contacts',
        view_name: view_name || 'Grid view',
        field_mapping: field_mapping || {},
        sync_direction: 'bidirectional',
      },
      status: 'active',
    });

    if (!configSaved) {
      return NextResponse.json({ error: 'Failed to save Airtable configuration' }, { status: 500 });
    }

    // Validate credentials
    await airtableSync.loadConfig();
    const isValid = await airtableSync.validateCredentials();

    if (!isValid) {
      return NextResponse.json(
        {
          error:
            'Invalid Airtable credentials or base configuration. Please check your API key and base ID.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Airtable integration connected successfully',
      config: {
        base_id,
        table_name: table_name || 'Contacts',
        view_name: view_name || 'Grid view',
      },
    });
  } catch (error) {
    console.error('Error connecting Airtable:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to connect Airtable integration',
      },
      { status: 500 }
    );
  }
}

/**
 * Get Airtable connection status
 * GET /api/integrations/airtable/connect
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

    // Load Airtable configuration
    const airtableSync = new AirtableSyncService(user.id);
    const config = await airtableSync.loadConfig();

    if (!config) {
      return NextResponse.json({
        connected: false,
        message: 'No Airtable integration configured',
      });
    }

    // Check if credentials are valid
    const isValid = await airtableSync.validateCredentials();

    return NextResponse.json({
      connected: isValid,
      config: {
        base_id: config.settings?.base_id,
        table_name: config.settings?.table_name || 'Contacts',
        view_name: config.settings?.view_name || 'Grid view',
        status: config.status,
        last_sync_at: config.last_sync_at,
      },
    });
  } catch (error) {
    console.error('Error fetching Airtable connection status:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Airtable connection status',
      },
      { status: 500 }
    );
  }
}

/**
 * Disconnect Airtable integration
 * DELETE /api/integrations/airtable/connect
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerClient(cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Disconnect Airtable integration
    const airtableSync = new AirtableSyncService(user.id);
    await airtableSync.loadConfig();
    const disconnected = await airtableSync.disconnect();

    if (!disconnected) {
      return NextResponse.json(
        { error: 'Failed to disconnect Airtable integration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Airtable integration disconnected successfully',
    });
  } catch (error) {
    console.error('Error disconnecting Airtable:', error);
    return NextResponse.json(
      {
        error: 'Failed to disconnect Airtable integration',
      },
      { status: 500 }
    );
  }
}
