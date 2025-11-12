/**
 * WARM Report Parser for Campaign Tracker
 * Parses WARM radio airplay reports (CSV and Excel formats)
 * Automatically creates activities and metrics from play data
 */

import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import Papa from 'papaparse';
import type {
  WarmReport,
  CampaignActivity,
  CampaignMetric,
  WarmIntegrationMeta,
} from '../db/types';

interface WarmPlay {
  stationName: string;
  country: string;
  playDate: string;
  trackName: string;
  artistName: string;
  showName?: string;
  showTime?: string;
}

interface WarmReportSummary {
  totalPlays: number;
  stationsCount: number;
  countriesCount: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  playsByCountry: Record<string, number>;
  playsByStation: Record<string, number>;
}

export class WarmReportParser {
  /**
   * Parse WARM report from CSV file
   */
  static async parseCSV(
    campaignId: string,
    fileContent: string,
    fileName: string,
    driveFileId?: string
  ): Promise<{
    success: boolean;
    summary?: WarmReportSummary;
    reportId?: string;
    error?: string;
  }> {
    try {
      // Parse CSV using papaparse
      const parseResult = Papa.parse<Record<string, string>>(fileContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
      });

      if (parseResult.errors.length > 0) {
        return {
          success: false,
          error: `CSV parsing errors: ${parseResult.errors.map((e) => e.message).join(', ')}`,
        };
      }

      const rows = parseResult.data;

      if (rows.length === 0) {
        return {
          success: false,
          error: 'CSV file is empty',
        };
      }

      // Detect column mapping (WARM reports can have different formats)
      const columnMapping = this.detectColumnMapping(parseResult.meta.fields || []);

      if (!columnMapping.station || !columnMapping.country || !columnMapping.date) {
        return {
          success: false,
          error: 'Could not detect required columns (station, country, date)',
        };
      }

      // Extract play data
      const plays: WarmPlay[] = rows
        .map((row) => ({
          stationName: row[columnMapping.station!] || 'Unknown Station',
          country: row[columnMapping.country!] || 'Unknown',
          playDate: row[columnMapping.date!] || new Date().toISOString(),
          trackName: row[columnMapping.track!] || '',
          artistName: row[columnMapping.artist!] || '',
          showName: columnMapping.show ? row[columnMapping.show] : undefined,
          showTime: columnMapping.time ? row[columnMapping.time] : undefined,
        }))
        .filter((play) => play.stationName && play.country);

      // Process the report
      return await this.processWarmReport(
        campaignId,
        plays,
        fileName,
        driveFileId
      );
    } catch (error: any) {
      console.error('Error parsing WARM CSV:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Parse WARM report from Excel file (using xlsx library)
   * Note: You'll need to install xlsx: npm install xlsx
   */
  static async parseExcel(
    campaignId: string,
    fileBuffer: Buffer,
    fileName: string,
    driveFileId?: string
  ): Promise<{
    success: boolean;
    summary?: WarmReportSummary;
    reportId?: string;
    error?: string;
  }> {
    try {
      // Import xlsx dynamically to avoid bundling issues
      const XLSX = await import('xlsx');

      // Read workbook
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

      // Get first sheet
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        return {
          success: false,
          error: 'Excel file has no sheets',
        };
      }

      const worksheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

      if (rows.length === 0) {
        return {
          success: false,
          error: 'Excel sheet is empty',
        };
      }

      // Detect column mapping
      const headers = Object.keys(rows[0]);
      const columnMapping = this.detectColumnMapping(headers);

      if (!columnMapping.station || !columnMapping.country || !columnMapping.date) {
        return {
          success: false,
          error: 'Could not detect required columns (station, country, date)',
        };
      }

      // Extract play data
      const plays: WarmPlay[] = rows
        .map((row) => ({
          stationName: row[columnMapping.station!] || 'Unknown Station',
          country: row[columnMapping.country!] || 'Unknown',
          playDate: this.parseExcelDate(row[columnMapping.date!]),
          trackName: row[columnMapping.track!] || '',
          artistName: row[columnMapping.artist!] || '',
          showName: columnMapping.show ? row[columnMapping.show] : undefined,
          showTime: columnMapping.time ? row[columnMapping.time] : undefined,
        }))
        .filter((play) => play.stationName && play.country);

      // Process the report
      return await this.processWarmReport(
        campaignId,
        plays,
        fileName,
        driveFileId
      );
    } catch (error: any) {
      console.error('Error parsing WARM Excel:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Process parsed WARM report data
   */
  private static async processWarmReport(
    campaignId: string,
    plays: WarmPlay[],
    fileName: string,
    driveFileId?: string
  ): Promise<{
    success: boolean;
    summary: WarmReportSummary;
    reportId: string;
    error?: string;
  }> {
    try {
      const supabase = await createServerClient(cookies());

      // Calculate summary stats
      const summary = this.calculateSummary(plays);

      // Create WARM report record
      const { data: warmReport, error: insertError } = await supabase
        .from('warm_reports')
        .insert({
          campaign_id: campaignId,
          filename: fileName,
          drive_file_id: driveFileId,
          total_plays: summary.totalPlays,
          stations_count: summary.stationsCount,
          countries_count: summary.countriesCount,
          date_range_start: summary.dateRangeStart,
          date_range_end: summary.dateRangeEnd,
          parsed: true,
          parsed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError || !warmReport) {
        throw new Error('Failed to create WARM report record');
      }

      // Create activities for each play
      const activities = plays.map((play) => ({
        campaign_id: campaignId,
        user_id: '', // Will be set by trigger
        activity_type: 'warm_play' as const,
        description: `${play.stationName} (${play.country}) played track`,
        integration_source: 'warm_report' as const,
        integration_id: warmReport.id,
        metadata: {
          stationName: play.stationName,
          country: play.country,
          playDate: play.playDate,
          showName: play.showName,
          showTime: play.showTime,
          reportId: warmReport.id,
        } as WarmIntegrationMeta,
        timestamp: play.playDate,
      }));

      // Batch insert activities (Supabase allows up to 1000 per batch)
      const batchSize = 1000;
      for (let i = 0; i < activities.length; i += batchSize) {
        const batch = activities.slice(i, i + batchSize);

        // Get user ID for activities
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || 'system';

        const activitiesWithUserId = batch.map(act => ({
          ...act,
          user_id: userId,
        }));

        await supabase.from('campaign_activities').insert(activitiesWithUserId);
      }

      // Create metrics record
      await supabase.from('campaign_metrics').insert({
        campaign_id: campaignId,
        metric_type: 'plays',
        value: summary.totalPlays,
        source: 'warm_report',
        source_file_id: driveFileId,
      });

      // Log milestone activity
      await this.logActivity(campaignId, {
        activity_type: 'milestone',
        description: `WARM report uploaded: ${summary.totalPlays} plays across ${summary.countriesCount} countries`,
        integration_source: 'warm_report',
        integration_id: warmReport.id,
        metadata: summary,
      });

      return {
        success: true,
        summary,
        reportId: warmReport.id,
      };
    } catch (error: any) {
      console.error('Error processing WARM report:', error);
      return {
        success: false,
        summary: this.calculateSummary(plays),
        reportId: '',
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Calculate summary statistics from plays
   */
  private static calculateSummary(plays: WarmPlay[]): WarmReportSummary {
    const countries = new Set<string>();
    const stations = new Set<string>();
    const playsByCountry: Record<string, number> = {};
    const playsByStation: Record<string, number> = {};
    let earliestDate = new Date();
    let latestDate = new Date(0);

    for (const play of plays) {
      countries.add(play.country);
      stations.add(play.stationName);

      playsByCountry[play.country] = (playsByCountry[play.country] || 0) + 1;
      playsByStation[play.stationName] =
        (playsByStation[play.stationName] || 0) + 1;

      const playDate = new Date(play.playDate);
      if (playDate < earliestDate) earliestDate = playDate;
      if (playDate > latestDate) latestDate = playDate;
    }

    return {
      totalPlays: plays.length,
      stationsCount: stations.size,
      countriesCount: countries.size,
      dateRangeStart: earliestDate.toISOString(),
      dateRangeEnd: latestDate.toISOString(),
      playsByCountry,
      playsByStation,
    };
  }

  /**
   * Detect column mapping from CSV/Excel headers
   * WARM reports can have varying column names
   */
  private static detectColumnMapping(headers: string[]): {
    station?: string;
    country?: string;
    date?: string;
    track?: string;
    artist?: string;
    show?: string;
    time?: string;
  } {
    const mapping: Record<string, string> = {};

    const headerLower = headers.map((h) => h.toLowerCase().trim());

    // Station
    mapping.station =
      headers[
        headerLower.findIndex(
          (h) => h.includes('station') || h.includes('outlet')
        )
      ];

    // Country
    mapping.country =
      headers[
        headerLower.findIndex(
          (h) => h.includes('country') || h.includes('territory')
        )
      ];

    // Date
    mapping.date =
      headers[
        headerLower.findIndex(
          (h) =>
            h.includes('date') || h.includes('played') || h.includes('broadcast')
        )
      ];

    // Track
    mapping.track =
      headers[
        headerLower.findIndex(
          (h) => h.includes('track') || h.includes('song') || h.includes('title')
        )
      ];

    // Artist
    mapping.artist =
      headers[headerLower.findIndex((h) => h.includes('artist'))];

    // Show
    mapping.show =
      headers[
        headerLower.findIndex(
          (h) => h.includes('show') || h.includes('programme')
        )
      ];

    // Time
    mapping.time =
      headers[
        headerLower.findIndex((h) => h.includes('time') || h.includes('hour'))
      ];

    return mapping;
  }

  /**
   * Parse Excel date formats (Excel stores dates as numbers)
   */
  private static parseExcelDate(value: any): string {
    if (typeof value === 'number') {
      // Excel date (days since 1900-01-01)
      const excelEpoch = new Date(1900, 0, 1);
      const date = new Date(
        excelEpoch.getTime() + (value - 1) * 24 * 60 * 60 * 1000
      );
      return date.toISOString();
    } else if (typeof value === 'string') {
      return new Date(value).toISOString();
    } else {
      return new Date().toISOString();
    }
  }

  /**
   * Helper: Log campaign activity
   */
  private static async logActivity(
    campaignId: string,
    activity: {
      activity_type: CampaignActivity['activity_type'];
      description: string;
      integration_source?: CampaignActivity['integration_source'];
      integration_id?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<void> {
    try {
      const supabase = await createServerClient(cookies());
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error('No user authenticated for activity logging');
        return;
      }

      await supabase.from('campaign_activities').insert({
        campaign_id: campaignId,
        user_id: user.id,
        activity_type: activity.activity_type,
        description: activity.description,
        integration_source: activity.integration_source || 'manual',
        integration_id: activity.integration_id,
        metadata: activity.metadata,
      });
    } catch (error) {
      console.error('Error logging campaign activity:', error);
    }
  }
}
