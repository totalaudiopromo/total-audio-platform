import Airtable from 'airtable';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  contactsTableId: string;
  campaignsTableId: string;
  interactionsTableId: string;
  emailsTableId: string;
}

interface AuditResult {
  summary: {
    totalRecords: number;
    duplicateCount: number;
    incompleteCount: number;
    inconsistentCount: number;
    fieldMapping: Record<string, any>;
  };
  duplicates: Array<{
    email: string;
    names: string[];
    records: any[];
    duplicateType: 'email' | 'name' | 'both';
  }>;
  incomplete: Array<{
    recordId: string;
    email: string;
    name: string;
    missingFields: string[];
    completenessScore: number;
  }>;
  inconsistencies: Array<{
    recordId: string;
    field: string;
    issue: string;
    value: any;
    expectedFormat?: string;
  }>;
  fieldAnalysis: {
    [fieldName: string]: {
      dataTypes: string[];
      uniqueValues: number;
      nullCount: number;
      sampleValues: any[];
      coverage: number;
    };
  };
  recommendations: string[];
}

export class AirtableAuditService {
  private base: Airtable.Base;
  private config: AirtableConfig;

  constructor(config: AirtableConfig) {
    this.config = config;
    Airtable.configure({
      apiKey: config.apiKey,
    });
    this.base = Airtable.base(config.baseId);
  }

  async performFullAudit(): Promise<AuditResult> {
    logger.info('Starting comprehensive Airtable data audit...');

    try {
      // Get all records from contacts table
      const records = await this.base(this.config.contactsTableId)
        .select({
          maxRecords: 10000, // Adjust based on your data size
        })
        .all();

      logger.info(`Analyzing ${records.length} contact records...`);

      // Convert Airtable Records to array for easier processing
      const recordsArray = records.map(record => ({
        id: record.id,
        fields: record.fields,
        createdTime: record._rawJson.createdTime,
      }));

      const auditResult: AuditResult = {
        summary: {
          totalRecords: recordsArray.length,
          duplicateCount: 0,
          incompleteCount: 0,
          inconsistentCount: 0,
          fieldMapping: {},
        },
        duplicates: [],
        incomplete: [],
        inconsistencies: [],
        fieldAnalysis: {},
        recommendations: [],
      };

      // 1. Field Mapping Analysis
      const fieldAnalysis = await this.analyzeFields(recordsArray);
      auditResult.fieldAnalysis = fieldAnalysis;

      // 2. Duplicate Detection
      const duplicateAnalysis = await this.findDuplicates(recordsArray);
      auditResult.duplicates = duplicateAnalysis.duplicates;
      auditResult.summary.duplicateCount = duplicateAnalysis.duplicateCount;

      // 3. Data Completeness Analysis
      const completenessAnalysis = await this.analyzeCompleteness(recordsArray);
      auditResult.incomplete = completenessAnalysis.incomplete;
      auditResult.summary.incompleteCount = completenessAnalysis.incompleteCount;

      // 4. Data Consistency Analysis
      const consistencyAnalysis = await this.analyzeConsistency(recordsArray);
      auditResult.inconsistencies = consistencyAnalysis.inconsistencies;
      auditResult.summary.inconsistentCount = consistencyAnalysis.inconsistentCount;

      // 5. Generate Recommendations
      auditResult.recommendations = this.generateRecommendations(auditResult);

      logger.info('Audit completed successfully');
      return auditResult;
    } catch (error) {
      logger.error('Audit failed:', error);
      throw error;
    }
  }

  private async analyzeFields(records: any[]): Promise<AuditResult['fieldAnalysis']> {
    const fieldAnalysis: AuditResult['fieldAnalysis'] = {};

    if (records.length === 0) return fieldAnalysis;

    // Get all field names from the first record
    const fieldNames = Object.keys(records[0].fields);

    for (const fieldName of fieldNames) {
      const values = records
        .map(record => record.fields[fieldName])
        .filter(val => val !== undefined);
      const uniqueValues = new Set(values.map(val => String(val)));
      const nullCount = values.filter(
        val => val === null || val === undefined || val === ''
      ).length;

      fieldAnalysis[fieldName] = {
        dataTypes: this.detectDataTypes(values),
        uniqueValues: uniqueValues.size,
        nullCount,
        sampleValues: this.getSampleValues(values, 5),
        coverage: ((records.length - nullCount) / records.length) * 100,
      };
    }

    return fieldAnalysis;
  }

  private detectDataTypes(values: any[]): string[] {
    const types = new Set<string>();

    for (const value of values) {
      if (value === null || value === undefined) continue;

      if (typeof value === 'string') {
        if (this.isEmail(value)) types.add('email');
        else if (this.isDate(value)) types.add('date');
        else if (this.isPhone(value)) types.add('phone');
        else types.add('string');
      } else if (typeof value === 'number') {
        types.add('number');
      } else if (Array.isArray(value)) {
        types.add('array');
      } else if (typeof value === 'boolean') {
        types.add('boolean');
      } else {
        types.add('object');
      }
    }

    return Array.from(types);
  }

  private isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  private isDate(value: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{1,2}\/\d{1,2}\/\d{4}$/;
    return dateRegex.test(value) || !isNaN(Date.parse(value));
  }

  private isPhone(value: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
  }

  private getSampleValues(values: any[], count: number): any[] {
    const nonNullValues = values.filter(val => val !== null && val !== undefined && val !== '');
    return nonNullValues.slice(0, count);
  }

  private async findDuplicates(
    records: any[]
  ): Promise<{ duplicates: AuditResult['duplicates']; duplicateCount: number }> {
    const duplicates: AuditResult['duplicates'] = [];
    const emailMap = new Map<string, any[]>();
    const nameMap = new Map<string, any[]>();

    // Group by email
    for (const record of records) {
      const email = record.fields.Email?.toLowerCase().trim();
      if (email) {
        if (!emailMap.has(email)) {
          emailMap.set(email, []);
        }
        emailMap.get(email)!.push(record);
      }
    }

    // Group by name
    for (const record of records) {
      const name = record.fields.Name?.toLowerCase().trim();
      if (name) {
        if (!nameMap.has(name)) {
          nameMap.set(name, []);
        }
        nameMap.get(name)!.push(record);
      }
    }

    // Find email duplicates
    for (const [email, records] of emailMap.entries()) {
      if (records.length > 1) {
        const names = records.map(r => r.fields.Name || 'Unknown').filter(n => n !== 'Unknown');
        duplicates.push({
          email,
          names,
          records,
          duplicateType: 'email',
        });
      }
    }

    // Find name duplicates (but different emails)
    for (const [name, records] of nameMap.entries()) {
      if (records.length > 1) {
        const emails = records.map(r => r.fields.Email || '').filter(e => e);
        const uniqueEmails = new Set(emails);

        if (uniqueEmails.size > 1) {
          duplicates.push({
            email: emails[0],
            names: [name],
            records,
            duplicateType: 'name',
          });
        }
      }
    }

    return { duplicates, duplicateCount: duplicates.length };
  }

  private async analyzeCompleteness(
    records: any[]
  ): Promise<{ incomplete: AuditResult['incomplete']; incompleteCount: number }> {
    const incomplete: AuditResult['incomplete'] = [];
    const requiredFields = ['Email', 'Name']; // Add more as needed
    const importantFields = ['Company', 'Role', 'Genre', 'Location']; // Add more as needed

    for (const record of records) {
      const missingFields: string[] = [];
      let completenessScore = 100;

      // Check required fields
      for (const field of requiredFields) {
        if (!record.fields[field] || record.fields[field].toString().trim() === '') {
          missingFields.push(field);
          completenessScore -= 25; // 25% penalty for each missing required field
        }
      }

      // Check important fields
      for (const field of importantFields) {
        if (!record.fields[field] || record.fields[field].toString().trim() === '') {
          missingFields.push(field);
          completenessScore -= 10; // 10% penalty for each missing important field
        }
      }

      if (missingFields.length > 0) {
        incomplete.push({
          recordId: record.id,
          email: record.fields.Email || 'No Email',
          name: record.fields.Name || 'No Name',
          missingFields,
          completenessScore: Math.max(0, completenessScore),
        });
      }
    }

    return { incomplete, incompleteCount: incomplete.length };
  }

  private async analyzeConsistency(
    records: any[]
  ): Promise<{ inconsistencies: AuditResult['inconsistencies']; inconsistentCount: number }> {
    const inconsistencies: AuditResult['inconsistencies'] = [];

    for (const record of records) {
      // Check email format consistency
      if (record.fields.Email) {
        if (!this.isEmail(record.fields.Email)) {
          inconsistencies.push({
            recordId: record.id,
            field: 'Email',
            issue: 'Invalid email format',
            value: record.fields.Email,
            expectedFormat: 'valid email address',
          });
        }
      }

      // Check for inconsistent data types in the same field
      // This would require comparing across records, so we'll focus on individual record issues

      // Check for unusually long or short values
      if (
        record.fields.Name &&
        (record.fields.Name.length < 2 || record.fields.Name.length > 100)
      ) {
        inconsistencies.push({
          recordId: record.id,
          field: 'Name',
          issue: 'Name length outside normal range',
          value: record.fields.Name,
          expectedFormat: '2-100 characters',
        });
      }

      // Check for empty strings that should be null
      for (const [field, value] of Object.entries(record.fields)) {
        if (value === '') {
          inconsistencies.push({
            recordId: record.id,
            field,
            issue: 'Empty string should be null or removed',
            value: value,
            expectedFormat: 'null or meaningful value',
          });
        }
      }
    }

    return { inconsistencies, inconsistentCount: inconsistencies.length };
  }

  private generateRecommendations(auditResult: AuditResult): string[] {
    const recommendations: string[] = [];

    // Duplicate recommendations
    if (auditResult.summary.duplicateCount > 0) {
      recommendations.push(
        `Found ${auditResult.summary.duplicateCount} duplicate records. Review and merge or remove duplicates.`
      );
    }

    // Completeness recommendations
    if (auditResult.summary.incompleteCount > 0) {
      recommendations.push(
        `Found ${auditResult.summary.incompleteCount} incomplete records. Consider adding missing information for better data quality.`
      );
    }

    // Consistency recommendations
    if (auditResult.summary.inconsistentCount > 0) {
      recommendations.push(
        `Found ${auditResult.summary.inconsistentCount} inconsistent records. Review and standardize data formats.`
      );
    }

    // Field coverage recommendations
    for (const [fieldName, analysis] of Object.entries(auditResult.fieldAnalysis)) {
      if (analysis.coverage < 50) {
        recommendations.push(
          `Field '${fieldName}' has low coverage (${analysis.coverage.toFixed(1)}%). Consider if this field is necessary or needs better data collection.`
        );
      }
    }

    // Data type recommendations
    for (const [fieldName, analysis] of Object.entries(auditResult.fieldAnalysis)) {
      if (analysis.dataTypes.length > 1) {
        recommendations.push(
          `Field '${fieldName}' contains mixed data types: ${analysis.dataTypes.join(', ')}. Consider standardizing the data type.`
        );
      }
    }

    return recommendations;
  }

  static async getAuditServiceForUser(userId: string): Promise<AirtableAuditService | null> {
    try {
      const integration = await prisma.integration.findUnique({
        where: {
          userId_type: {
            userId,
            type: 'AIRTABLE',
          },
        },
      });

      if (!integration || integration.status !== 'CONNECTED') {
        return null;
      }

      const config = integration.config as unknown as AirtableConfig;
      return new AirtableAuditService(config);
    } catch (error) {
      logger.error('Failed to get Airtable audit service:', error);
      return null;
    }
  }
}
