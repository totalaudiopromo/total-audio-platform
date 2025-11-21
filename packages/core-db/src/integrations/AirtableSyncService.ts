/**
 * Airtable Sync Service
 * Extends BaseIntegrationSync to provide bidirectional sync with Airtable
 *
 * Features:
 * - API key-based authentication (simpler than OAuth)
 * - Contact sync: Total Audio → Airtable
 * - Contact sync: Airtable → Total Audio
 * - Field mapping with genre tags support
 * - Deduplication by email
 *
 * Usage:
 *   const airtableSync = new AirtableSyncService(workspaceId);
 *   await airtableSync.loadConfig();
 *   const result = await airtableSync.syncToExternal(contacts);
 */

import * as AirtableLib from 'airtable';
import { BaseIntegrationSync, SyncResult } from './BaseIntegrationSync';
import type { IntegrationName } from './types';

const Airtable = AirtableLib.default || AirtableLib;

interface AirtableRecord {
  id?: string;
  fields: {
    Name?: string;
    Email?: string;
    Role?: string;
    Outlet?: string;
    Genres?: string[];
    City?: string;
    Source?: string;
    [key: string]: any;
  };
}

export class AirtableSyncService extends BaseIntegrationSync {
  private airtable: any | null = null;

  constructor(workspace_id: string, supabase: any) {
    super(workspace_id, supabase);
  }

  /**
   * Get integration name
   */
  getIntegrationName(): IntegrationName {
    return 'airtable';
  }

  /**
   * Validate Airtable API key by attempting to list bases
   * @returns true if API key is valid, false otherwise
   */
  async validateCredentials(): Promise<boolean> {
    try {
      if (!this.config?.credentials?.api_key) {
        console.error('No Airtable API key found in config');
        return false;
      }

      // Initialize Airtable client
      await this.connectToAirtable();

      if (!this.airtable) {
        return false;
      }

      // Test connection by fetching base metadata
      const baseId = this.config.settings?.base_id;
      if (!baseId) {
        console.error('No Airtable base_id found in settings');
        return false;
      }

      // Attempt to list records from the table (limit 1 for validation)
      const tableName = this.config.settings?.table_name || 'Contacts';
      const base = this.airtable.base(baseId);

      await base(tableName).select({ maxRecords: 1 }).firstPage();

      return true;
    } catch (error) {
      console.error('Airtable credential validation failed:', error);
      if (this.config) {
        await this.saveConfig({
          status: 'error',
          error_message:
            error instanceof Error ? error.message : 'Invalid API key or base configuration',
        });
      }
      return false;
    }
  }

  /**
   * Sync Total Audio contacts → Airtable
   * Creates or updates Airtable records based on email deduplication
   *
   * @param contacts Array of workspace contacts to sync
   * @returns Sync statistics
   */
  async syncToExternal(contacts: any[]): Promise<SyncResult> {
    const startTime = Date.now();
    const started_at = new Date();
    const result: SyncResult = {
      success: true,
      direction: 'to_external',
      records_synced: 0,
      records_created: 0,
      records_updated: 0,
      records_failed: 0,
      errors: [],
      duration_ms: 0,
      started_at,
      completed_at: started_at,
      metadata: {},
    };

    let recordsProcessed = 0;

    try {
      // Validate credentials first
      const isValid = await this.validateCredentials();
      if (!isValid) {
        throw new Error('Invalid Airtable credentials');
      }

      if (!this.airtable || !this.config) {
        throw new Error('Airtable client not initialized');
      }

      const baseId = this.config.settings?.base_id;
      const tableName = this.config.settings?.table_name || 'Contacts';
      const base = this.airtable.base(baseId);

      // Fetch existing Airtable records to check for duplicates
      const existingRecords = await this.fetchAllAirtableRecords();
      const existingEmails = new Map<string, string>(); // email -> record ID

      for (const record of existingRecords) {
        const email = record.fields.Email;
        if (email) {
          existingEmails.set(email.toLowerCase(), record.id!);
        }
      }

      // Process contacts
      for (const contact of contacts) {
        recordsProcessed++;

        try {
          const airtableRecord = this.mapContactToAirtable(contact);

          // Check if record exists by email
          const existingId = existingEmails.get(contact.email?.toLowerCase());

          if (existingId) {
            // Update existing record
            await base(tableName).update(existingId, airtableRecord.fields);
            result.records_synced++;
            result.records_updated = (result.records_updated || 0) + 1;
          } else {
            // Create new record
            await base(tableName).create(airtableRecord.fields);
            result.records_synced++;
            result.records_created = (result.records_created || 0) + 1;
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          result.errors.push(`Failed to sync ${contact.email}: ${errorMsg}`);
          result.records_failed = (result.records_failed || 0) + 1;
          console.error(`Error syncing contact ${contact.email}:`, error);
        }
      }

      result.success = result.errors.length === 0;
      result.completed_at = new Date();
      result.duration_ms = result.completed_at.getTime() - started_at.getTime();
      result.metadata = {
        records_processed: recordsProcessed,
        base_id: baseId,
        table_name: tableName,
      };

      // Log sync
      await this.logSyncActivity(result);

      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      result.success = false;
      result.errors.push(errorMsg);
      result.completed_at = new Date();
      result.duration_ms = result.completed_at.getTime() - started_at.getTime();

      await this.logSyncActivity(result);

      return result;
    }
  }

  /**
   * Sync Airtable → Total Audio contacts
   * Fetches all Airtable records and upserts into workspace_contacts_registry
   *
   * @returns Sync statistics
   */
  async syncFromExternal(): Promise<SyncResult> {
    const started_at = new Date();
    const result: SyncResult = {
      success: true,
      direction: 'from_external',
      records_synced: 0,
      records_created: 0,
      records_updated: 0,
      records_failed: 0,
      errors: [],
      duration_ms: 0,
      started_at,
      completed_at: started_at,
      metadata: {},
    };

    let recordsProcessed = 0;

    try {
      // Validate credentials first
      const isValid = await this.validateCredentials();
      if (!isValid) {
        throw new Error('Invalid Airtable credentials');
      }

      // Fetch all Airtable records
      const airtableRecords = await this.fetchAllAirtableRecords();
      recordsProcessed = airtableRecords.length;

      // Upsert each record into workspace_contacts_registry
      for (const record of airtableRecords) {
        try {
          const contact = this.mapAirtableToContact(record);

          // Skip if no email (required field)
          if (!contact.email) {
            result.errors.push(`Skipped Airtable record ${record.id}: No email`);
            result.records_failed = (result.records_failed || 0) + 1;
            continue;
          }

          // Upsert into workspace
          await this.upsertWorkspaceContact(contact);
          result.records_synced++;
          result.records_created = (result.records_created || 0) + 1;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          result.errors.push(`Failed to import Airtable record ${record.id}: ${errorMsg}`);
          result.records_failed = (result.records_failed || 0) + 1;
          console.error(`Error importing Airtable record ${record.id}:`, error);
        }
      }

      result.success = result.errors.length === 0;
      result.completed_at = new Date();
      result.duration_ms = result.completed_at.getTime() - started_at.getTime();
      result.metadata = {
        records_processed: recordsProcessed,
        base_id: this.config?.settings?.base_id,
        table_name: this.config?.settings?.table_name || 'Contacts',
      };

      // Log sync
      await this.logSyncActivity(result);

      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      result.success = false;
      result.errors.push(errorMsg);
      result.completed_at = new Date();
      result.duration_ms = result.completed_at.getTime() - started_at.getTime();

      await this.logSyncActivity(result);

      return result;
    }
  }

  // ========================================
  // Private Helper Methods
  // ========================================

  /**
   * Initialize Airtable client with API key from config
   */
  private async connectToAirtable(): Promise<void> {
    if (!this.config?.credentials?.api_key) {
      throw new Error('No Airtable API key found in config');
    }

    this.airtable = new Airtable({
      apiKey: this.config.credentials.api_key,
    });
  }

  /**
   * Fetch all records from configured Airtable base/table
   */
  private async fetchAllAirtableRecords(): Promise<AirtableRecord[]> {
    if (!this.airtable || !this.config) {
      throw new Error('Airtable client not initialized');
    }

    const baseId = this.config.settings?.base_id;
    const tableName = this.config.settings?.table_name || 'Contacts';

    if (!baseId) {
      throw new Error('No Airtable base_id configured');
    }

    const base = this.airtable.base(baseId);
    const records: AirtableRecord[] = [];

    return new Promise((resolve, reject) => {
      base(tableName)
        .select({
          // Fetch all records (Airtable auto-paginates)
          view: this.config?.settings?.view_name || 'Grid view',
        })
        .eachPage(
          (pageRecords: any, fetchNextPage: any) => {
            // Process each page
            for (const record of pageRecords) {
              records.push({
                id: record.id,
                fields: record.fields as AirtableRecord['fields'],
              });
            }

            // Fetch next page
            fetchNextPage();
          },
          (error: any) => {
            if (error) {
              console.error('Error fetching Airtable records:', error);
              reject(error);
            } else {
              resolve(records);
            }
          }
        );
    });
  }

  /**
   * Upsert contact into workspace_contacts_registry
   * Handles deduplication by email
   */
  private async upsertWorkspaceContact(contact: {
    email: string;
    name?: string;
    role?: string;
    outlet?: string;
    genre_tags?: string[];
    location_city?: string;
    enrichment_source?: string;
    [key: string]: any;
  }): Promise<void> {
    try {
      // Check for existing contact by email
      const { data: existing, error: selectError } = await this.supabase
        .from('workspace_contacts_registry')
        .select('id')
        .eq('email', contact.email.toLowerCase())
        .eq('workspace_id', this.workspace_id)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        // PGRST116 = not found (OK), other errors are problems
        throw selectError;
      }

      const contactData = {
        email: contact.email.toLowerCase(),
        name: contact.name,
        company: contact.outlet,
        job_title: contact.role,
        tags: contact.genre_tags || [],
        metadata: {
          location_city: contact.location_city,
          enrichment_source: contact.enrichment_source || 'airtable',
          airtable_synced_at: new Date().toISOString(),
        },
      };

      if (existing) {
        // Update existing contact
        const { error: updateError } = await this.supabase
          .from('workspace_contacts_registry')
          .update(contactData)
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // Insert new contact
        const { error: insertError } = await this.supabase
          .from('workspace_contacts_registry')
          .insert({
            ...contactData,
            workspace_id: this.workspace_id,
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Failed to upsert workspace contact:', error);
      throw error;
    }
  }

  /**
   * Map Total Audio contact → Airtable record format
   */
  private mapContactToAirtable(contact: any): AirtableRecord {
    const fieldMapping = this.config?.settings?.field_mapping || {};

    // Default mapping (can be overridden by config)
    const defaultMapping = {
      name: 'Name',
      email: 'Email',
      role: 'Role',
      outlet: 'Outlet',
      genre_tags: 'Genres',
      location_city: 'City',
      enrichment_source: 'Source',
    };

    const mapping = { ...defaultMapping, ...fieldMapping };

    const fields: AirtableRecord['fields'] = {};

    // Map fields
    if (contact.name) fields[mapping.name] = contact.name;
    if (contact.email) fields[mapping.email] = contact.email;
    if (contact.role) fields[mapping.role] = contact.role;
    if (contact.company || contact.outlet)
      fields[mapping.outlet] = contact.company || contact.outlet;
    if (contact.tags || contact.genre_tags) {
      const genres = contact.tags || contact.genre_tags;
      fields[mapping.genre_tags] = Array.isArray(genres) ? genres : [genres];
    }
    if (contact.metadata?.location_city || contact.location_city)
      fields[mapping.location_city] = contact.metadata?.location_city || contact.location_city;
    if (contact.metadata?.enrichment_source || contact.enrichment_source)
      fields[mapping.enrichment_source] =
        contact.metadata?.enrichment_source || contact.enrichment_source;

    return { fields };
  }

  /**
   * Map Airtable record → Total Audio contact format
   */
  private mapAirtableToContact(record: AirtableRecord): {
    email: string;
    name?: string;
    role?: string;
    outlet?: string;
    genre_tags?: string[];
    location_city?: string;
    enrichment_source?: string;
  } {
    const fieldMapping = this.config?.settings?.field_mapping || {};

    // Default mapping (inverted)
    const defaultMapping = {
      Name: 'name',
      Email: 'email',
      Role: 'role',
      Outlet: 'outlet',
      Genres: 'genre_tags',
      City: 'location_city',
      Source: 'enrichment_source',
    };

    const mapping = { ...defaultMapping, ...fieldMapping };

    const contact: any = {};

    // Map fields
    for (const [airtableField, workspaceField] of Object.entries(mapping)) {
      const value = record.fields[airtableField as keyof typeof record.fields];
      if (value !== undefined && value !== null) {
        contact[workspaceField as keyof typeof contact] = value;
      }
    }

    // Ensure email is lowercase
    if (contact.email) {
      contact.email = contact.email.toLowerCase();
    }

    // Ensure genre_tags is an array
    if (contact.genre_tags && !Array.isArray(contact.genre_tags)) {
      contact.genre_tags = [contact.genre_tags];
    }

    return contact;
  }
}
