import Airtable from 'airtable';
import { logger } from '../utils/logger';

interface DuplicateGroup {
  email: string;
  records: Airtable.Record<any>[];
  keepRecord: Airtable.Record<any>;
  deleteRecords: Airtable.Record<any>[];
  reason: string;
}

interface RemovalResult {
  totalDuplicates: number;
  recordsToDelete: number;
  backupData: any[];
  duplicateGroups: DuplicateGroup[];
  dryRun: boolean;
  errors: string[];
}

export class AirtableDuplicateRemoval {
  private base: Airtable.Base;
  private config: {
    contactsTableId: string;
  };

  constructor(apiKey: string, baseId: string, contactsTableId: string) {
    this.base = new Airtable({ apiKey }).base(baseId);
    this.config = { contactsTableId };
  }

  /**
   * Calculate completeness score for a record
   */
  private calculateCompleteness(record: Airtable.Record<any>): number {
    const fields = record.fields;
    const importantFields = [
      'Name',
      'Company',
      'Role',
      'Genre',
      'Location',
      'Email',
      'Phone',
      'Website',
      'Notes',
    ];

    let filledFields = 0;
    importantFields.forEach(field => {
      if (fields[field] && fields[field].toString().trim() !== '') {
        filledFields++;
      }
    });

    return filledFields / importantFields.length;
  }

  /**
   * Find all duplicate email addresses
   */
  private async findDuplicateEmails(): Promise<Map<string, Airtable.Record<any>[]>> {
    logger.info('🔍 Scanning for duplicate email addresses...');

    const records = await this.base(this.config.contactsTableId)
      .select({
        maxRecords: 10000,
      })
      .all();

    const emailGroups = new Map<string, Airtable.Record<any>[]>();

    records.forEach(record => {
      const email = record.fields.Email?.toString().toLowerCase().trim();
      if (email && email !== '') {
        if (!emailGroups.has(email)) {
          emailGroups.set(email, []);
        }
        emailGroups.get(email)!.push(record);
      }
    });

    // Filter to only groups with duplicates
    const duplicates = new Map<string, Airtable.Record<any>[]>();
    emailGroups.forEach((records, email) => {
      if (records.length > 1) {
        duplicates.set(email, records);
      }
    });

    logger.info(`📊 Found ${duplicates.size} duplicate email groups`);
    return duplicates;
  }

  /**
   * Determine which record to keep from a duplicate group
   */
  private selectRecordToKeep(records: Airtable.Record<any>[]): {
    keepRecord: Airtable.Record<any>;
    deleteRecords: Airtable.Record<any>[];
    reason: string;
  } {
    // Calculate completeness scores
    const recordsWithScores = records.map(record => ({
      record,
      completeness: this.calculateCompleteness(record),
      created: record._rawJson.createdTime,
    }));

    // Sort by completeness (descending), then by creation date (descending)
    recordsWithScores.sort((a, b) => {
      if (a.completeness !== b.completeness) {
        return b.completeness - a.completeness;
      }
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });

    const keepRecord = recordsWithScores[0]?.record;
    const deleteRecords = recordsWithScores.slice(1).map(r => r.record);

    if (!keepRecord || recordsWithScores.length < 2) {
      throw new Error('Invalid record selection');
    }

    const firstRecord = recordsWithScores[0];
    const secondRecord = recordsWithScores[1];

    const reason =
      (firstRecord?.completeness || 0) > (secondRecord?.completeness || 0)
        ? `Most complete record (${Math.round((firstRecord?.completeness || 0) * 100)}% vs ${Math.round((secondRecord?.completeness || 0) * 100)}%)`
        : `Most recently created (${new Date(firstRecord?.created || '').toLocaleDateString()})`;

    return { keepRecord, deleteRecords, reason };
  }

  /**
   * Create backup data for records to be deleted
   */
  private createBackupData(duplicateGroups: DuplicateGroup[]): any[] {
    const backupData: any[] = [];

    duplicateGroups.forEach(group => {
      group.deleteRecords.forEach(record => {
        backupData.push({
          email: group.email,
          recordId: record.id,
          fields: record.fields,
          deletedAt: new Date().toISOString(),
          reason: `Duplicate of ${group.keepRecord.id} (${group.reason})`,
        });
      });
    });

    return backupData;
  }

  /**
   * Remove duplicates from Airtable
   */
  private async deleteRecords(records: Airtable.Record<any>[]): Promise<void> {
    const batchSize = 10; // Airtable recommends batching deletes

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const recordIds = batch.map(record => record.id);

      try {
        await this.base(this.config.contactsTableId).destroy(recordIds);
        logger.info(`🗑️ Deleted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} records`);
      } catch (error) {
        logger.error(`❌ Error deleting batch ${Math.floor(i / batchSize) + 1}:`, error);
        throw error;
      }
    }
  }

  /**
   * Main method to remove duplicates
   */
  async removeDuplicates(dryRun: boolean = true): Promise<RemovalResult> {
    const startTime = Date.now();
    const errors: string[] = [];

    try {
      logger.info(`🚀 Starting duplicate removal (${dryRun ? 'DRY RUN' : 'LIVE'})...`);

      // Find duplicates
      const duplicateGroups = await this.findDuplicateEmails();

      if (duplicateGroups.size === 0) {
        logger.info('✅ No duplicates found!');
        return {
          totalDuplicates: 0,
          recordsToDelete: 0,
          backupData: [],
          duplicateGroups: [],
          dryRun,
          errors: [],
        };
      }

      // Process each duplicate group
      const processedGroups: DuplicateGroup[] = [];
      let totalRecordsToDelete = 0;

      duplicateGroups.forEach((records, email) => {
        const { keepRecord, deleteRecords, reason } = this.selectRecordToKeep(records);

        processedGroups.push({
          email,
          records,
          keepRecord,
          deleteRecords,
          reason,
        });

        totalRecordsToDelete += deleteRecords.length;

        logger.info(
          `📧 ${email}: Keeping ${keepRecord.id}, deleting ${deleteRecords.length} duplicates (${reason})`
        );
      });

      // Create backup data
      const backupData = this.createBackupData(processedGroups);

      // Save backup to file
      const backupFilename = `duplicate-backup-${new Date().toISOString().split('T')[0]}.json`;
      const fs = require('fs');
      fs.writeFileSync(backupFilename, JSON.stringify(backupData, null, 2));
      logger.info(`💾 Backup saved to: ${backupFilename}`);

      // Delete records if not dry run
      if (!dryRun) {
        const allRecordsToDelete = processedGroups.flatMap(group => group.deleteRecords);
        await this.deleteRecords(allRecordsToDelete);
        logger.info(`✅ Successfully deleted ${allRecordsToDelete.length} duplicate records`);
      } else {
        logger.info(`🔍 DRY RUN: Would delete ${totalRecordsToDelete} duplicate records`);
      }

      const duration = Date.now() - startTime;
      logger.info(`⏱️ Duplicate removal completed in ${duration}ms`);

      return {
        totalDuplicates: duplicateGroups.size,
        recordsToDelete: totalRecordsToDelete,
        backupData,
        duplicateGroups: processedGroups,
        dryRun,
        errors,
      };
    } catch (error) {
      const errorMsg = `❌ Error during duplicate removal: ${error}`;
      logger.error(errorMsg);
      errors.push(errorMsg);

      return {
        totalDuplicates: 0,
        recordsToDelete: 0,
        backupData: [],
        duplicateGroups: [],
        dryRun,
        errors,
      };
    }
  }

  /**
   * Factory method to create service with user config
   */
  static getRemovalServiceForUser(userId: string): AirtableDuplicateRemoval {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;

    if (!apiKey || !baseId || !contactsTableId) {
      throw new Error('Missing required Airtable environment variables');
    }

    return new AirtableDuplicateRemoval(apiKey, baseId, contactsTableId);
  }
}
