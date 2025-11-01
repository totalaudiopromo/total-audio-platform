import Airtable from 'airtable';
import { logger } from '../utils/logger';

interface RadioEnhancement {
  email: string;
  domain: string;
  stationName: string;
  location: string;
  market: string;
  format: string;
  marketSize: string;
  classification: string;
  confidence: number;
  reasoning: string;
}

interface EnhancementResult {
  totalRecords: number;
  radioRecords: number;
  enhancedRecords: number;
  classifications: Map<string, number>;
  dryRun: boolean;
  errors: string[];
}

interface UKRadioPattern {
  pattern: RegExp;
  stationName: string;
  location: string;
  market: string;
  format: string;
  marketSize: string;
  classification: string;
  confidence: number;
}

export class AirtableRadioEnhancement {
  private base: Airtable.Base;
  private config: {
    contactsTableId: string;
  };

  // UK Radio station patterns
  private ukRadioPatterns: UKRadioPattern[] = [
    // BBC National Stations
    {
      pattern: /bbc\.co\.uk|bbc\.com/i,
      stationName: 'BBC Radio',
      location: 'National',
      market: 'National',
      format: 'Public Service',
      marketSize: 'National',
      classification: 'BBC National',
      confidence: 0.95,
    },
    {
      pattern: /bbcradio1\.co\.uk|radio1\.bbc\.co\.uk/i,
      stationName: 'BBC Radio 1',
      location: 'National',
      market: 'National',
      format: 'Public Service',
      marketSize: 'National',
      classification: 'BBC National',
      confidence: 0.98,
    },
    {
      pattern: /bbcradio2\.co\.uk|radio2\.bbc\.co\.uk/i,
      stationName: 'BBC Radio 2',
      location: 'National',
      market: 'National',
      format: 'Public Service',
      marketSize: 'National',
      classification: 'BBC National',
      confidence: 0.98,
    },
    {
      pattern: /bbcradio3\.co\.uk|radio3\.bbc\.co\.uk/i,
      stationName: 'BBC Radio 3',
      location: 'National',
      market: 'National',
      format: 'Public Service',
      marketSize: 'National',
      classification: 'BBC National',
      confidence: 0.98,
    },
    {
      pattern: /bbcradio4\.co\.uk|radio4\.bbc\.co\.uk/i,
      stationName: 'BBC Radio 4',
      location: 'National',
      market: 'National',
      format: 'Public Service',
      marketSize: 'National',
      classification: 'BBC National',
      confidence: 0.98,
    },
    {
      pattern: /bbc6music\.co\.uk|6music\.bbc\.co\.uk/i,
      stationName: 'BBC Radio 6 Music',
      location: 'National',
      market: 'National',
      format: 'Public Service',
      marketSize: 'National',
      classification: 'BBC National',
      confidence: 0.98,
    },

    // BBC Regional Stations
    {
      pattern: /bbc\.co\.uk\/scotland|bbcscotland\.co\.uk/i,
      stationName: 'BBC Radio Scotland',
      location: 'Scotland',
      market: 'Regional',
      format: 'Public Service',
      marketSize: 'Regional',
      classification: 'BBC Regional',
      confidence: 0.95,
    },
    {
      pattern: /bbc\.co\.uk\/wales|bbcwales\.co\.uk/i,
      stationName: 'BBC Radio Wales',
      location: 'Wales',
      market: 'Regional',
      format: 'Public Service',
      marketSize: 'Regional',
      classification: 'BBC Regional',
      confidence: 0.95,
    },
    {
      pattern: /bbc\.co\.uk\/northernireland|bbcnorthernireland\.co\.uk/i,
      stationName: 'BBC Radio Ulster',
      location: 'Northern Ireland',
      market: 'Regional',
      format: 'Public Service',
      marketSize: 'Regional',
      classification: 'BBC Regional',
      confidence: 0.95,
    },

    // Commercial Radio - Major Networks
    {
      pattern: /capitalfm\.com|capital\.co\.uk/i,
      stationName: 'Capital FM',
      location: 'London',
      market: 'Major Market',
      format: 'Commercial',
      marketSize: 'National',
      classification: 'Commercial Major',
      confidence: 0.95,
    },
    {
      pattern: /heart\.co\.uk|heartfm\.com/i,
      stationName: 'Heart',
      location: 'London',
      market: 'Major Market',
      format: 'Commercial',
      marketSize: 'National',
      classification: 'Commercial Major',
      confidence: 0.95,
    },
    {
      pattern: /kissfm\.co\.uk|kiss\.com/i,
      stationName: 'Kiss FM',
      location: 'London',
      market: 'Major Market',
      format: 'Commercial',
      marketSize: 'National',
      classification: 'Commercial Major',
      confidence: 0.95,
    },
    {
      pattern: /smoothradio\.com|smooth\.co\.uk/i,
      stationName: 'Smooth Radio',
      location: 'London',
      market: 'Major Market',
      format: 'Commercial',
      marketSize: 'National',
      classification: 'Commercial Major',
      confidence: 0.95,
    },
    {
      pattern: /magic\.co\.uk|magicfm\.com/i,
      stationName: 'Magic',
      location: 'London',
      market: 'Major Market',
      format: 'Commercial',
      marketSize: 'National',
      classification: 'Commercial Major',
      confidence: 0.95,
    },

    // Regional Commercial Stations
    {
      pattern: /realradio\.co\.uk|real\.com/i,
      stationName: 'Real Radio',
      location: 'Regional',
      market: 'Regional',
      format: 'Commercial',
      marketSize: 'Regional',
      classification: 'Commercial Regional',
      confidence: 0.9,
    },
    {
      pattern: /century\.co\.uk|centuryradio\.com/i,
      stationName: 'Century Radio',
      location: 'Regional',
      market: 'Regional',
      format: 'Commercial',
      marketSize: 'Regional',
      classification: 'Commercial Regional',
      confidence: 0.9,
    },

    // London Stations
    {
      pattern: /london\.co\.uk|londonradio\.com/i,
      stationName: 'London Radio',
      location: 'London',
      market: 'London',
      format: 'Commercial',
      marketSize: 'Local',
      classification: 'Commercial Local',
      confidence: 0.85,
    },
    {
      pattern: /lbc\.co\.uk|lbcradio\.com/i,
      stationName: 'LBC',
      location: 'London',
      market: 'London',
      format: 'Commercial',
      marketSize: 'Local',
      classification: 'Commercial Local',
      confidence: 0.95,
    },

    // Manchester Stations
    {
      pattern: /manchester\.co\.uk|manchesterradio\.com/i,
      stationName: 'Manchester Radio',
      location: 'Manchester',
      market: 'Manchester',
      format: 'Commercial',
      marketSize: 'Local',
      classification: 'Commercial Local',
      confidence: 0.85,
    },
    {
      pattern: /key103\.co\.uk|key103\.com/i,
      stationName: 'Key 103',
      location: 'Manchester',
      market: 'Manchester',
      format: 'Commercial',
      marketSize: 'Local',
      classification: 'Commercial Local',
      confidence: 0.9,
    },

    // Birmingham Stations
    {
      pattern: /birmingham\.co\.uk|birminghamradio\.com/i,
      stationName: 'Birmingham Radio',
      location: 'Birmingham',
      market: 'Birmingham',
      format: 'Commercial',
      marketSize: 'Local',
      classification: 'Commercial Local',
      confidence: 0.85,
    },
    {
      pattern: /brum\.co\.uk|brumradio\.com/i,
      stationName: 'BRMB',
      location: 'Birmingham',
      market: 'Birmingham',
      format: 'Commercial',
      marketSize: 'Local',
      classification: 'Commercial Local',
      confidence: 0.9,
    },

    // Liverpool Stations
    {
      pattern: /liverpool\.co\.uk|liverpoolradio\.com/i,
      stationName: 'Liverpool Radio',
      location: 'Liverpool',
      market: 'Liverpool',
      format: 'Commercial',
      marketSize: 'Local',
      classification: 'Commercial Local',
      confidence: 0.85,
    },
    {
      pattern: /radio-city\.co\.uk|radiocity\.com/i,
      stationName: 'Radio City',
      location: 'Liverpool',
      market: 'Liverpool',
      format: 'Commercial',
      marketSize: 'Local',
      classification: 'Commercial Local',
      confidence: 0.9,
    },

    // Student Radio
    {
      pattern: /studentradio\.co\.uk|studentradio\.com/i,
      stationName: 'Student Radio',
      location: 'University',
      market: 'Student',
      format: 'Student',
      marketSize: 'Local',
      classification: 'Student Radio',
      confidence: 0.9,
    },
    {
      pattern: /\.ac\.uk|university\.co\.uk/i,
      stationName: 'University Radio',
      location: 'University',
      market: 'Student',
      format: 'Student',
      marketSize: 'Local',
      classification: 'Student Radio',
      confidence: 0.8,
    },

    // Community Radio
    {
      pattern: /communityradio\.co\.uk|communityradio\.com/i,
      stationName: 'Community Radio',
      location: 'Local',
      market: 'Community',
      format: 'Community',
      marketSize: 'Local',
      classification: 'Community Radio',
      confidence: 0.9,
    },
    {
      pattern: /localradio\.co\.uk|localradio\.com/i,
      stationName: 'Local Radio',
      location: 'Local',
      market: 'Local',
      format: 'Community',
      marketSize: 'Local',
      classification: 'Community Radio',
      confidence: 0.85,
    },

    // Generic Radio Patterns
    {
      pattern: /radio\.co\.uk|radio\.com/i,
      stationName: 'Radio Station',
      location: 'Unknown',
      market: 'Unknown',
      format: 'Unknown',
      marketSize: 'Unknown',
      classification: 'Unknown Radio',
      confidence: 0.7,
    },
  ];

  constructor(apiKey: string, baseId: string, contactsTableId: string) {
    this.base = new Airtable({ apiKey }).base(baseId);
    this.config = {
      contactsTableId,
    };
  }

  /**
   * Extract domain from email address
   */
  private extractDomain(email: string): string {
    const parts = email.toLowerCase().trim().split('@');
    return parts.length === 2 ? parts[1] || '' : '';
  }

  /**
   * Analyze domain and extract radio station information
   */
  private analyzeRadioDomain(domain: string): RadioEnhancement | null {
    for (const pattern of this.ukRadioPatterns) {
      if (pattern.pattern.test(domain)) {
        return {
          email: '', // Will be set by caller
          domain,
          stationName: pattern.stationName,
          location: pattern.location,
          market: pattern.market,
          format: pattern.format,
          marketSize: pattern.marketSize,
          classification: pattern.classification,
          confidence: pattern.confidence,
          reasoning: `Matched pattern: ${pattern.pattern.source}`,
        };
      }
    }

    return null;
  }

  /**
   * Get all radio contacts from Airtable
   */
  private async getRadioContacts(): Promise<Airtable.Record<any>[]> {
    logger.info('📻 Fetching radio contacts from Airtable...');

    const records = await this.base(this.config.contactsTableId)
      .select({
        maxRecords: 10000,
        filterByFormula: "{Contact Type} = 'Radio'",
      })
      .all();

    logger.info(`📈 Found ${records.length} radio contacts`);
    return Array.from(records);
  }

  /**
   * Enhance radio station information
   */
  async enhanceRadioStations(dryRun: boolean = true): Promise<EnhancementResult> {
    try {
      logger.info(`🎵 Starting Radio Station Enhancement (${dryRun ? 'PREVIEW' : 'LIVE'} mode)...`);

      const records = await this.getRadioContacts();
      const enhancements: RadioEnhancement[] = [];
      const classifications = new Map<string, number>();
      const errors: string[] = [];

      logger.info(`📊 Analyzing ${records.length} radio contacts...`);

      for (const record of records) {
        try {
          const email = record.fields.Email?.toString() || '';
          if (!email) {
            errors.push(`Record ${record.id}: No email found`);
            continue;
          }

          const domain = this.extractDomain(email);
          if (!domain) {
            errors.push(`Record ${record.id}: Invalid email format`);
            continue;
          }

          const enhancement = this.analyzeRadioDomain(domain);
          if (enhancement) {
            enhancement.email = email;
            enhancements.push(enhancement);

            // Count classifications
            const currentCount = classifications.get(enhancement.classification) || 0;
            classifications.set(enhancement.classification, currentCount + 1);
          }
        } catch (error) {
          errors.push(
            `Record ${record.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      if (!dryRun) {
        await this.updateRadioRecords(enhancements);
      }

      const result: EnhancementResult = {
        totalRecords: records.length,
        radioRecords: records.length,
        enhancedRecords: enhancements.length,
        classifications,
        dryRun,
        errors,
      };

      logger.info(`✅ Radio enhancement completed: ${enhancements.length} records enhanced`);
      return result;
    } catch (error) {
      logger.error('❌ Radio enhancement error:', error);
      throw error;
    }
  }

  /**
   * Update Airtable records with radio enhancement data
   */
  private async updateRadioRecords(enhancements: RadioEnhancement[]): Promise<void> {
    logger.info(`🔄 Updating ${enhancements.length} radio records...`);

    const updateRecords = enhancements.map(async update => {
      const records = await this.base(this.config.contactsTableId)
        .select({
          filterByFormula: `{Email} = '${update.email.replace(/'/g, "\\'")}'`,
        })
        .all();

      if (records.length > 0 && records[0]) {
        return {
          id: records[0].id,
          fields: {
            Station: update.stationName,
            'Reply Notes': `Radio enhancement: ${update.stationName} - ${update.classification} | Location: ${update.location} | Market: ${update.market} | Format: ${update.format} | Market Size: ${update.marketSize} | Classification: ${update.classification} (${update.reasoning})`,
          },
        };
      }
      return null;
    });

    const resolvedRecords = await Promise.all(updateRecords);
    const validRecords = resolvedRecords.filter(
      (record): record is NonNullable<typeof record> => record !== null
    );

    if (validRecords.length > 0) {
      // Process in batches of 10 (Airtable limit)
      const batchSize = 10;
      let updatedCount = 0;

      for (let i = 0; i < validRecords.length; i += batchSize) {
        const batch = validRecords.slice(i, i + batchSize);
        await this.base(this.config.contactsTableId).update(batch);
        updatedCount += batch.length;
        logger.info(`✅ Updated batch ${Math.floor(i / batchSize) + 1}: ${batch.length} records`);
      }

      logger.info(
        `✅ Completed: Updated ${updatedCount} radio records in ${Math.ceil(validRecords.length / batchSize)} batches`
      );
    }
  }

  /**
   * Generate enhancement report
   */
  generateReport(result: EnhancementResult): string {
    let report = '\n🎵 RADIO STATION ENHANCEMENT REPORT\n';
    report += '=====================================\n\n';

    report += `📊 Summary:\n`;
    report += `Total Radio Records: ${result.radioRecords}\n`;
    report += `Enhanced Records: ${result.enhancedRecords}\n`;
    report += `Mode: ${result.dryRun ? 'PREVIEW' : 'LIVE'}\n\n`;

    report += `🏢 Classifications Found:\n`;
    result.classifications.forEach((count, classification) => {
      const percentage = ((count / result.enhancedRecords) * 100).toFixed(1);
      report += `  ${classification}: ${count} (${percentage}%)\n`;
    });

    if (result.errors.length > 0) {
      report += `\n❌ Errors (${result.errors.length}):\n`;
      result.errors.slice(0, 10).forEach(error => {
        report += `  - ${error}\n`;
      });
      if (result.errors.length > 10) {
        report += `  ... and ${result.errors.length - 10} more errors\n`;
      }
    }

    return report;
  }

  /**
   * Static factory method for user-specific configuration
   */
  static getEnhancementServiceForUser(userId: string): AirtableRadioEnhancement {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;

    if (!apiKey || !baseId || !contactsTableId) {
      throw new Error('Missing required Airtable environment variables');
    }

    return new AirtableRadioEnhancement(apiKey, baseId, contactsTableId);
  }
}
