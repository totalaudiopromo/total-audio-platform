/**
 * Google Sheets Sync Service
 * Handles two-way synchronization between Tracker campaigns and Google Sheets
 */

import { google, sheets_v4 } from 'googleapis';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { OAuthHandler } from './oauth-handler';

export interface SheetRow {
  campaignName: string;
  artistName: string;
  platform: string;
  status: string;
  startDate: string;
  budget?: number;
  targetReach?: number;
  actualReach?: number;
  notes?: string;
}

export class GoogleSheetsSync {
  private oauth = new OAuthHandler();
  private readonly integrationType = 'google_sheets';

  private async getSupabaseClient() {
    return await createClient();
  }

  /**
   * Sync campaigns from Tracker to Google Sheet
   */
  async syncToSheet(connectionId: string): Promise<{
    success: boolean;
    recordsUpdated: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let connection: any = null;

    try {
      const supabase = await this.getSupabaseClient();

      // Get connection and valid access token
      const accessToken = await this.oauth.getValidAccessToken(connectionId);

      // Get connection details
      const { data: fetchedConnection, error: connError } = await supabase
        .from('integration_connections')
        .select('*')
        .eq('id', connectionId)
        .single();

      if (connError || !fetchedConnection) {
        throw new Error('Connection not found');
      }
      connection = fetchedConnection;

      const { spreadsheet_id, sheet_name = 'Campaigns' } = connection.settings;

      if (!spreadsheet_id) {
        throw new Error('No spreadsheet configured');
      }

      // Initialize Google Sheets API
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const sheets = google.sheets({ version: 'v4', auth });

      // Fetch campaigns from Tracker
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', connection.user_id)
        .order('created_at', { ascending: false });

      if (campaignsError) {
        throw new Error(`Failed to fetch campaigns: ${campaignsError.message}`);
      }

      // Check if sheet exists, create if not
      await this.ensureSheetExists(sheets, spreadsheet_id, sheet_name);

      // Convert campaigns to rows
      const header = [
        'Campaign Name',
        'Artist Name',
        'Platform',
        'Status',
        'Start Date',
        'Budget',
        'Target Reach',
        'Actual Reach',
        'Notes',
        'Tracker ID', // Hidden column for syncing back
      ];

      const rows = (campaigns || []).map((c: any) => [
        c.name || '',
        c.artist_name || '',
        c.platform || '',
        c.status || 'draft',
        c.start_date || '',
        c.budget?.toString() || '',
        c.target_reach?.toString() || '',
        c.actual_reach?.toString() || '',
        c.notes || '',
        c.id, // Tracker ID for reference
      ]);

      // Write to sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheet_id,
        range: `${sheet_name}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [header, ...rows],
        },
      });

      // Log sync
      await supabase.from('integration_sync_logs').insert({
        connection_id: connectionId,
        direction: 'to_external',
        records_updated: rows.length,
        completed_at: new Date().toISOString(),
      });

      // Update last sync time
      await supabase
        .from('integration_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', connectionId);

      await this.logActivity({
        connectionId,
        userId: connection.user_id,
        activityType: 'export',
        status: 'success',
        message: `Exported ${rows.length} campaign${rows.length === 1 ? '' : 's'} to Google Sheet`,
        metadata: {
          spreadsheet_id,
          sheet_name,
          records_count: rows.length,
        },
      });

      return {
        success: true,
        recordsUpdated: rows.length,
        errors: [],
      };
    } catch (error: any) {
      errors.push(error.message);
      console.error('Error syncing to Google Sheets:', error);

      const supabaseError = await this.getSupabaseClient();

      // Update connection status
      await supabaseError
        .from('integration_connections')
        .update({
          status: 'error',
          error_message: error.message,
          error_count: 1,
        })
        .eq('id', connectionId);

      if (connection?.user_id) {
        await this.logActivity({
          connectionId,
          userId: connection.user_id,
          activityType: 'export',
          status: 'error',
          message: 'Failed to sync campaigns to Google Sheet',
          metadata: {
            error: error.message,
          },
        });
      }

      return {
        success: false,
        recordsUpdated: 0,
        errors,
      };
    }
  }

  /**
   * Sync campaigns from Google Sheet to Tracker
   */
  async syncFromSheet(connectionId: string): Promise<{
    success: boolean;
    recordsUpdated: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let connection: any = null;

    try {
      const supabase = await this.getSupabaseClient();

      const accessToken = await this.oauth.getValidAccessToken(connectionId);

      const { data: fetchedConnection, error: connError } = await supabase
        .from('integration_connections')
        .select('*')
        .eq('id', connectionId)
        .single();

      if (connError || !fetchedConnection) {
        throw new Error('Connection not found');
      }
      connection = fetchedConnection;

      const { spreadsheet_id, sheet_name = 'Campaigns' } = connection.settings;

      if (!spreadsheet_id) {
        throw new Error('No spreadsheet configured');
      }

      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const sheets = google.sheets({ version: 'v4', auth });

      // Read from sheet
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheet_id,
        range: `${sheet_name}!A2:J`, // Skip header row
      });

      const rows = response.data.values || [];
      let updated = 0;

      for (const row of rows) {
        try {
          const trackerId = row[9]; // Tracker ID column
          if (!trackerId) continue;

          const { error } = await supabase
            .from('campaigns')
            .update({
              name: row[0],
              artist_name: row[1],
              platform: row[2],
              status: row[3],
              start_date: row[4],
              budget: row[5] ? parseFloat(row[5]) : null,
              target_reach: row[6] ? parseInt(row[6]) : null,
              actual_reach: row[7] ? parseInt(row[7]) : null,
              notes: row[8],
            })
            .eq('id', trackerId)
            .eq('user_id', connection.user_id);

          if (error) {
            errors.push(
              `Failed to update campaign ${trackerId}: ${error.message}`
            );
          } else {
            updated++;
          }
        } catch (error: any) {
          errors.push(`Row error: ${error.message}`);
        }
      }

      // Log sync
      await supabase.from('integration_sync_logs').insert({
        connection_id: connectionId,
        direction: 'from_external',
        records_updated: updated,
        errors: errors.length > 0 ? JSON.stringify(errors) : null,
        completed_at: new Date().toISOString(),
      });

      await supabase
        .from('integration_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', connectionId);

      await this.logActivity({
        connectionId,
        userId: connection.user_id,
        activityType: 'import',
        status: errors.length > 0 ? 'warning' : 'success',
        message: `Imported ${updated} campaign${updated === 1 ? '' : 's'} from Google Sheet`,
        metadata: {
          spreadsheet_id,
          sheet_name,
          records_count: updated,
          errors: errors.length > 0 ? errors : undefined,
        },
      });

      return {
        success: true,
        recordsUpdated: updated,
        errors,
      };
    } catch (error: any) {
      errors.push(error.message);
      console.error('Error syncing from Google Sheets:', error);

      return {
        success: false,
        recordsUpdated: 0,
        errors,
      };
    }
  }

  private async ensureSheetExists(
    sheets: sheets_v4.Sheets,
    spreadsheetId: string,
    sheetName: string
  ): Promise<void> {
    try {
      const response = await sheets.spreadsheets.get({
        spreadsheetId,
      });

      const sheetExists = response.data.sheets?.some(
        sheet => sheet.properties?.title === sheetName
      );

      if (!sheetExists) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });
      }
    } catch (error) {
      console.error('Error ensuring sheet exists:', error);
      throw error;
    }
  }

  private async logActivity({
    connectionId,
    userId,
    activityType,
    status,
    message,
    metadata,
  }: {
    connectionId: string;
    userId: string;
    activityType: 'export' | 'import';
    status: 'success' | 'error' | 'warning';
    message: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      const supabase = await this.getSupabaseClient();
      const sanitizedMetadata = metadata ? { ...metadata } : {};

      if (
        'errors' in sanitizedMetadata &&
        sanitizedMetadata.errors === undefined
      ) {
        delete sanitizedMetadata.errors;
      }

      await supabase.from('integration_activity_log').insert({
        connection_id: connectionId,
        user_id: userId,
        integration_type: this.integrationType,
        activity_type: activityType,
        status,
        message,
        metadata: sanitizedMetadata,
      });
    } catch (logError) {
      const logMessage =
        logError instanceof Error ? logError.message : String(logError);
      console.error(
        'Failed to log Google Sheets integration activity:',
        logMessage
      );
    }
  }
}
