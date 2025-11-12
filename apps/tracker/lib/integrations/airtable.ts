/**
 * Airtable Integration for Campaign Tracker
 * Bi-directional sync between Tracker and Airtable for contact management
 */

import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import type {
  CampaignContact,
  CampaignActivity,
  AirtableIntegrationMeta,
  CreateContactPayload,
} from '../db/types';

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

export class AirtableIntegration {
  /**
   * Link campaign to Airtable base/table
   */
  static async linkCampaignToAirtable(
    campaignId: string,
    config: AirtableConfig
  ): Promise<{ success: boolean; recordCount?: number; error?: string }> {
    try {
      // Update campaign with Airtable details
      const supabase = await createServerClient(cookies());
      await supabase
        .from('campaigns')
        .update({
          airtable_base_id: config.baseId,
          airtable_table_id: config.tableName,
        })
        .eq('id', campaignId);

      // Count existing records
      const records = await this.fetchAirtableRecords(config);

      // Log activity
      await this.logActivity(campaignId, {
        activity_type: 'milestone',
        description: `Airtable base "${config.tableName}" linked with ${records.length} contacts`,
        integration_source: 'airtable',
        integration_id: config.baseId,
        metadata: {
          baseId: config.baseId,
          tableId: config.tableName,
        },
      });

      return { success: true, recordCount: records.length };
    } catch (error: any) {
      console.error('Error linking Airtable:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Import contacts from Airtable to Tracker
   */
  static async importContactsFromAirtable(
    campaignId: string,
    config: AirtableConfig,
    fieldMapping: {
      nameField: string;
      emailField?: string;
      outletField?: string;
      statusField?: string;
      notesField?: string;
    }
  ): Promise<{
    success: boolean;
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let imported = 0;
    let skipped = 0;

    try {
      // Fetch records from Airtable
      const records = await this.fetchAirtableRecords(config);

      if (records.length === 0) {
        return { success: true, imported: 0, skipped: 0, errors: [] };
      }

      const supabase = await createServerClient(cookies());

      // Import each record
      for (const record of records) {
        try {
          const fields = record.fields;

          // Extract mapped fields
          const contactName = fields[fieldMapping.nameField];
          if (!contactName) {
            skipped++;
            errors.push(`Record ${record.id}: Missing name field`);
            continue;
          }

          const contactEmail = fieldMapping.emailField
            ? fields[fieldMapping.emailField]
            : null;
          const outlet = fieldMapping.outletField
            ? fields[fieldMapping.outletField]
            : null;
          const notes = fieldMapping.notesField
            ? fields[fieldMapping.notesField]
            : null;

          // Check if contact already exists (by Airtable record ID)
          const { data: existing } = await supabase
            .from('campaign_contacts')
            .select('id')
            .eq('campaign_id', campaignId)
            .eq('airtable_record_id', record.id)
            .maybeSingle();

          if (existing) {
            // Update existing contact
            await supabase
              .from('campaign_contacts')
              .update({
                contact_name: contactName,
                contact_email: contactEmail,
                outlet,
                notes,
                synced_to_airtable: true,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existing.id);

            imported++;
          } else {
            // Create new contact
            await supabase.from('campaign_contacts').insert({
              campaign_id: campaignId,
              contact_name: contactName,
              contact_email: contactEmail,
              outlet,
              notes,
              airtable_record_id: record.id,
              synced_to_airtable: true,
              status: 'pending',
            });

            imported++;
          }
        } catch (error: any) {
          skipped++;
          errors.push(`Record ${record.id}: ${error.message}`);
        }
      }

      // Log activity
      await this.logActivity(campaignId, {
        activity_type: 'milestone',
        description: `Imported ${imported} contacts from Airtable (${skipped} skipped)`,
        integration_source: 'airtable',
        integration_id: config.baseId,
        metadata: {
          imported,
          skipped,
          totalRecords: records.length,
        },
      });

      return { success: true, imported, skipped, errors };
    } catch (error: any) {
      console.error('Error importing from Airtable:', error);
      return {
        success: false,
        imported,
        skipped,
        errors: [...errors, error.message],
      };
    }
  }

  /**
   * Sync contact back to Airtable (update existing record)
   */
  static async syncContactToAirtable(
    contactId: string,
    config: AirtableConfig,
    fieldMapping: {
      nameField: string;
      emailField?: string;
      outletField?: string;
      statusField?: string;
      notesField?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await createServerClient(cookies());

      // Get contact details
      const { data: contact } = await supabase
        .from('campaign_contacts')
        .select('*')
        .eq('id', contactId)
        .single();

      if (!contact) {
        return { success: false, error: 'Contact not found' };
      }

      if (!contact.airtable_record_id) {
        return {
          success: false,
          error: 'Contact not linked to Airtable record',
        };
      }

      // Build fields object
      const fields: Record<string, any> = {
        [fieldMapping.nameField]: contact.contact_name,
      };

      if (fieldMapping.emailField && contact.contact_email) {
        fields[fieldMapping.emailField] = contact.contact_email;
      }

      if (fieldMapping.outletField && contact.outlet) {
        fields[fieldMapping.outletField] = contact.outlet;
      }

      if (fieldMapping.statusField && contact.status) {
        fields[fieldMapping.statusField] = contact.status;
      }

      if (fieldMapping.notesField && contact.notes) {
        fields[fieldMapping.notesField] = contact.notes;
      }

      // Update Airtable record
      const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}/${contact.airtable_record_id}`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Airtable API error');
      }

      // Mark as synced
      await supabase
        .from('campaign_contacts')
        .update({ synced_to_airtable: true })
        .eq('id', contactId);

      return { success: true };
    } catch (error: any) {
      console.error('Error syncing to Airtable:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Create new Airtable record from Tracker contact
   */
  static async createAirtableRecord(
    contactId: string,
    config: AirtableConfig,
    fieldMapping: {
      nameField: string;
      emailField?: string;
      outletField?: string;
      statusField?: string;
      notesField?: string;
    }
  ): Promise<{ success: boolean; recordId?: string; error?: string }> {
    try {
      const supabase = await createServerClient(cookies());

      // Get contact details
      const { data: contact } = await supabase
        .from('campaign_contacts')
        .select('*')
        .eq('id', contactId)
        .single();

      if (!contact) {
        return { success: false, error: 'Contact not found' };
      }

      // Build fields object
      const fields: Record<string, any> = {
        [fieldMapping.nameField]: contact.contact_name,
      };

      if (fieldMapping.emailField && contact.contact_email) {
        fields[fieldMapping.emailField] = contact.contact_email;
      }

      if (fieldMapping.outletField && contact.outlet) {
        fields[fieldMapping.outletField] = contact.outlet;
      }

      if (fieldMapping.statusField && contact.status) {
        fields[fieldMapping.statusField] = contact.status;
      }

      if (fieldMapping.notesField && contact.notes) {
        fields[fieldMapping.notesField] = contact.notes;
      }

      // Create Airtable record
      const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Airtable API error');
      }

      const result = await response.json();
      const recordId = result.id;

      // Link contact to Airtable record
      await supabase
        .from('campaign_contacts')
        .update({
          airtable_record_id: recordId,
          synced_to_airtable: true,
        })
        .eq('id', contactId);

      return { success: true, recordId };
    } catch (error: any) {
      console.error('Error creating Airtable record:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Bi-directional sync: Tracker → Airtable and Airtable → Tracker
   */
  static async bidirectionalSync(
    campaignId: string,
    config: AirtableConfig,
    fieldMapping: {
      nameField: string;
      emailField?: string;
      outletField?: string;
      statusField?: string;
      notesField?: string;
    }
  ): Promise<{
    success: boolean;
    trackerToAirtable: number;
    airtableToTracker: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let trackerToAirtable = 0;
    let airtableToTracker = 0;

    try {
      const supabase = await createServerClient(cookies());

      // Step 1: Sync Tracker contacts to Airtable (create/update)
      const { data: trackerContacts } = await supabase
        .from('campaign_contacts')
        .select('*')
        .eq('campaign_id', campaignId);

      if (trackerContacts) {
        for (const contact of trackerContacts) {
          try {
            if (contact.airtable_record_id) {
              // Update existing Airtable record
              await this.syncContactToAirtable(contact.id, config, fieldMapping);
            } else {
              // Create new Airtable record
              await this.createAirtableRecord(contact.id, config, fieldMapping);
            }
            trackerToAirtable++;
          } catch (error: any) {
            errors.push(`Tracker→Airtable sync failed for ${contact.contact_name}: ${error.message}`);
          }
        }
      }

      // Step 2: Import new contacts from Airtable to Tracker
      const importResult = await this.importContactsFromAirtable(
        campaignId,
        config,
        fieldMapping
      );

      airtableToTracker = importResult.imported;
      errors.push(...importResult.errors);

      // Log activity
      await this.logActivity(campaignId, {
        activity_type: 'milestone',
        description: `Bi-directional sync complete: ${trackerToAirtable} to Airtable, ${airtableToTracker} from Airtable`,
        integration_source: 'airtable',
        integration_id: config.baseId,
        metadata: {
          trackerToAirtable,
          airtableToTracker,
          errors: errors.length,
        },
      });

      return {
        success: true,
        trackerToAirtable,
        airtableToTracker,
        errors,
      };
    } catch (error: any) {
      console.error('Error during bi-directional sync:', error);
      return {
        success: false,
        trackerToAirtable,
        airtableToTracker,
        errors: [...errors, error.message],
      };
    }
  }

  /**
   * Fetch all records from Airtable
   */
  private static async fetchAirtableRecords(
    config: AirtableConfig
  ): Promise<AirtableRecord[]> {
    const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}`;
    const records: AirtableRecord[] = [];
    let offset: string | undefined;

    do {
      const fetchUrl = offset ? `${url}?offset=${offset}` : url;

      const response = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Airtable API error');
      }

      const data = await response.json();
      records.push(...data.records);
      offset = data.offset;
    } while (offset);

    return records;
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
