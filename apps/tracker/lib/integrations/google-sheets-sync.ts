/**
 * Google Sheets Sync Service
 * Handles two-way synchronization between Tracker campaigns and Google Sheets
 */

import { google, sheets_v4 } from 'googleapis';
import { createClient } from '@/lib/supabase/server';
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
  private supabase = createClient();

  /**
   * Sync campaigns from Tracker to Google Sheet
   */
  async syncToSheet(connectionId: string): Promise<{
    success: boolean;
    recordsUpdated: number;
    errors: string[];
  }> {
    const errors: string[] = [];

    try {
      // Get connection and valid access token
      const accessToken = await this.oauth.getValidAccessToken(connectionId);

      // Get connection details
      const { data: connection, error: connError } = await this.supabase
        .from('integration_connections')
        .select('*')
        .eq('id', connectionId)
        .single();

      if (connError || !connection) {
        throw new Error('Connection not found');
      }

      const { spreadsheet_id, sheet_name = 'Campaigns' } = connection.settings;

      if (!spreadsheet_id) {
        throw new Error('No spreadsheet configured');
      }

      // Initialize Google Sheets API
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const sheets = google.sheets({ version: 'v4', auth });

      // Fetch campaigns from Tracker
      const { data: campaigns, error: campaignsError } = await this.supabase
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

      const rows = (campaigns || []).map((c) => [
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

      // Update sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheet_id,
        range: `${sheet_name}!A1:J${rows.length + 1}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [header, ...rows],
        },
      });

      // Format header row
      await this.formatHeaderRow(sheets, spreadsheet_id, sheet_name);

      // Log sync
      await this.supabase.from('integration_sync_logs').insert({
        connection_id: connectionId,
        direction: 'to_external',
        records_updated: rows.length,
        completed_at: new Date().toISOString(),
      });

      // Update last sync time
      await this.supabase
        .from('integration_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', connectionId);

      return {
        success: true,
        recordsUpdated: rows.length,
        errors,
      };
    } catch (error: any) {
      errors.push(error.message);
      console.error('Error syncing to Google Sheets:', error);

      // Update connection status
      await this.supabase
        .from('integration_connections')
        .update({
          status: 'error',
          error_message: error.message,
          error_count: this.supabase.raw('error_count + 1'),
        })
        .eq('id', connectionId);

      return {
        success: false,
        recordsUpdated: 0,
        errors,
      };
    }
  }

  /**
   * Sync changes from Google Sheet back to Tracker
   */
  async syncFromSheet(connectionId: string): Promise<{
    success: boolean;
    recordsUpdated: number;
    errors: string[];
  }> {
    const errors: string[] = [];

    try {
      const accessToken = await this.oauth.getValidAccessToken(connectionId);

      const { data: connection } = await this.supabase
        .from('integration_connections')
        .select('*')
        .eq('id', connectionId)
        .single();

      if (!connection) throw new Error('Connection not found');

      const { spreadsheet_id, sheet_name = 'Campaigns' } = connection.settings;

      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const sheets = google.sheets({ version: 'v4', auth });

      // Read sheet data
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheet_id,
        range: `${sheet_name}!A2:J1000`, // Skip header, read up to 1000 rows
      });

      const rows = response.data.values || [];
      let updatedCount = 0;

      for (const row of rows) {
        const [
          name,
          artistName,
          platform,
          status,
          startDate,
          budget,
          targetReach,
          actualReach,
          notes,
          trackerId,
        ] = row;

        if (!trackerId) continue; // Skip rows without Tracker ID

        // Update campaign in Tracker
        const { error } = await this.supabase
          .from('campaigns')
          .update({
            name,
            artist_name: artistName,
            platform,
            status,
            start_date: startDate,
            budget: budget ? parseInt(budget) : null,
            target_reach: targetReach ? parseInt(targetReach) : null,
            actual_reach: actualReach ? parseInt(actualReach) : null,
            notes,
          })
          .eq('id', trackerId)
          .eq('user_id', connection.user_id);

        if (!error) {
          updatedCount++;
        } else {
          errors.push(`Failed to update campaign ${trackerId}: ${error.message}`);
        }
      }

      // Log sync
      await this.supabase.from('integration_sync_logs').insert({
        connection_id: connectionId,
        direction: 'from_external',
        records_updated: updatedCount,
        errors: errors.length > 0 ? JSON.stringify(errors) : null,
        completed_at: new Date().toISOString(),
      });

      return {
        success: errors.length === 0,
        recordsUpdated: updatedCount,
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

  /**
   * Ensure sheet exists in spreadsheet
   */
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
        (sheet) => sheet.properties?.title === sheetName
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

  /**
   * Format header row with bold text and background color
   */
  private async formatHeaderRow(
    sheets: sheets_v4.Sheets,
    spreadsheetId: string,
    sheetName: string
  ): Promise<void> {
    try {
      const response = await sheets.spreadsheets.get({
        spreadsheetId,
      });

      const sheet = response.data.sheets?.find(
        (s) => s.properties?.title === sheetName
      );

      if (!sheet?.properties?.sheetId) return;

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: sheet.properties.sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.6,
                      green: 0.4,
                      blue: 0.8,
                    },
                    textFormat: {
                      foregroundColor: {
                        red: 1,
                        green: 1,
                        blue: 1,
                      },
                      bold: true,
                    },
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error formatting header row:', error);
      // Don't throw - formatting is optional
    }
  }

  /**
   * List user's spreadsheets
   */
  async listSpreadsheets(connectionId: string): Promise<any[]> {
    try {
      const accessToken = await this.oauth.getValidAccessToken(connectionId);

      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const drive = google.drive({ version: 'v3', auth });

      const response = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
        fields: 'files(id, name, modifiedTime)',
        orderBy: 'modifiedTime desc',
        pageSize: 50,
      });

      return response.data.files || [];
    } catch (error) {
      console.error('Error listing spreadsheets:', error);
      throw error;
    }
  }

  /**
   * Create a new spreadsheet for campaigns
   */
  async createSpreadsheet(
    connectionId: string,
    title: string = 'Campaign Tracker'
  ): Promise<string> {
    try {
      const accessToken = await this.oauth.getValidAccessToken(connectionId);

      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const sheets = google.sheets({ version: 'v4', auth });

      const response = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title,
          },
        },
      });

      return response.data.spreadsheetId || '';
    } catch (error) {
      console.error('Error creating spreadsheet:', error);
      throw error;
    }
  }
}
