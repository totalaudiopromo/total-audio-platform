import Airtable from 'airtable';
import { logger } from '../utils/logger';

interface DomainAnalysis {
  email: string;
  domain: string;
  extractedCompany: string;
  companyType: string;
  confidence: number;
  reasoning: string;
}

interface AnalysisResult {
  totalRecords: number;
  analyzedRecords: number;
  companyTypes: Map<string, number>;
  updates: DomainAnalysis[];
  dryRun: boolean;
  errors: string[];
}

interface MusicIndustryPattern {
  pattern: RegExp;
  companyName: string;
  companyType: string;
  confidence: number;
}

export class AirtableDomainAnalysis {
  private base: Airtable.Base;
  private config: {
    contactsTableId: string;
  };

  // Music industry domain patterns
  private musicIndustryPatterns: MusicIndustryPattern[] = [
    // Streaming platforms
    { pattern: /spotify\.com/i, companyName: 'Spotify', companyType: 'Playlist Curator', confidence: 0.95 },
    { pattern: /apple\.com|itunes\.com|music\.apple\.com/i, companyName: 'Apple Music', companyType: 'Playlist Curator', confidence: 0.95 },
    { pattern: /youtube\.com|youtu\.be/i, companyName: 'YouTube Music', companyType: 'Playlist Curator', confidence: 0.9 },
    { pattern: /deezer\.com/i, companyName: 'Deezer', companyType: 'Playlist Curator', confidence: 0.9 },
    { pattern: /tidal\.com/i, companyName: 'Tidal', companyType: 'Playlist Curator', confidence: 0.9 },
    { pattern: /amazon\.com|amazonmusic\.com/i, companyName: 'Amazon Music', companyType: 'Playlist Curator', confidence: 0.9 },
    { pattern: /pandora\.com/i, companyName: 'Pandora', companyType: 'Playlist Curator', confidence: 0.9 },
    { pattern: /soundcloud\.com/i, companyName: 'SoundCloud', companyType: 'Playlist Curator', confidence: 0.9 },
    { pattern: /bandcamp\.com/i, companyName: 'Bandcamp', companyType: 'Playlist Curator', confidence: 0.9 },
    
    // Radio stations
    { pattern: /radio|fm|am|broadcast/i, companyName: 'Radio Station', companyType: 'Radio DJ', confidence: 0.8 },
    { pattern: /kcrw\.com/i, companyName: 'KCRW', companyType: 'Radio DJ', confidence: 0.95 },
    { pattern: /kexp\.org/i, companyName: 'KEXP', companyType: 'Radio DJ', confidence: 0.95 },
    { pattern: /npr\.org/i, companyName: 'NPR', companyType: 'Radio DJ', confidence: 0.95 },
    { pattern: /bbc\.co\.uk|bbc\.com/i, companyName: 'BBC Radio', companyType: 'Radio DJ', confidence: 0.95 },
    
    // Music blogs and magazines
    { pattern: /pitchfork\.com/i, companyName: 'Pitchfork', companyType: 'Music Journalist', confidence: 0.95 },
    { pattern: /rollingstone\.com/i, companyName: 'Rolling Stone', companyType: 'Music Journalist', confidence: 0.95 },
    { pattern: /billboard\.com/i, companyName: 'Billboard', companyType: 'Music Journalist', confidence: 0.95 },
    { pattern: /nme\.com/i, companyName: 'NME', companyType: 'Music Journalist', confidence: 0.95 },
    { pattern: /spin\.com/i, companyName: 'Spin', companyType: 'Music Journalist', confidence: 0.95 },
    { pattern: /stereogum\.com/i, companyName: 'Stereogum', companyType: 'Music Journalist', confidence: 0.9 },
    { pattern: /consequence\.net/i, companyName: 'Consequence', companyType: 'Music Journalist', confidence: 0.9 },
    { pattern: /brooklynvegan\.com/i, companyName: 'BrooklynVegan', companyType: 'Music Journalist', confidence: 0.9 },
    { pattern: /blog|magazine|zine|press/i, companyName: 'Music Blog', companyType: 'Music Journalist', confidence: 0.7 },
    
    // Record labels
    { pattern: /records|recordings|music|label|entertainment/i, companyName: 'Record Label', companyType: 'A&R', confidence: 0.7 },
    { pattern: /universal|umg\.com/i, companyName: 'Universal Music Group', companyType: 'A&R', confidence: 0.95 },
    { pattern: /sony|sonymusic\.com/i, companyName: 'Sony Music', companyType: 'A&R', confidence: 0.95 },
    { pattern: /wmg\.com|warner/i, companyName: 'Warner Music Group', companyType: 'A&R', confidence: 0.95 },
    { pattern: /interscope\.com/i, companyName: 'Interscope Records', companyType: 'A&R', confidence: 0.95 },
    { pattern: /atlantic\.com/i, companyName: 'Atlantic Records', companyType: 'A&R', confidence: 0.95 },
    { pattern: /republic\.com/i, companyName: 'Republic Records', companyType: 'A&R', confidence: 0.95 },
    { pattern: /defjam\.com/i, companyName: 'Def Jam Recordings', companyType: 'A&R', confidence: 0.95 },
    { pattern: /columbia\.com/i, companyName: 'Columbia Records', companyType: 'A&R', confidence: 0.95 },
    
    // Music venues and festivals
    { pattern: /venue|theater|theatre|hall|arena|stadium/i, companyName: 'Music Venue', companyType: 'Venue Manager', confidence: 0.8 },
    { pattern: /festival|fest/i, companyName: 'Music Festival', companyType: 'Festival Organizer', confidence: 0.8 },
    { pattern: /coachella\.com/i, companyName: 'Coachella', companyType: 'Festival Organizer', confidence: 0.95 },
    { pattern: /lollapalooza\.com/i, companyName: 'Lollapalooza', companyType: 'Festival Organizer', confidence: 0.95 },
    { pattern: /bonnaroo\.com/i, companyName: 'Bonnaroo', companyType: 'Festival Organizer', confidence: 0.95 },
    
    // Music management and agencies
    { pattern: /management|mgmt|agency|talent/i, companyName: 'Music Management', companyType: 'Manager', confidence: 0.8 },
    { pattern: /booking|promoter/i, companyName: 'Booking Agency', companyType: 'Booking Agent', confidence: 0.8 },
    
    // Music production and studios
    { pattern: /studio|production|recording/i, companyName: 'Recording Studio', companyType: 'Producer', confidence: 0.8 },
    
    // Music licensing and sync
    { pattern: /sync|licensing|publishing/i, companyName: 'Music Licensing', companyType: 'Sync Agent', confidence: 0.8 },
    
    // Music technology
    { pattern: /tech|software|app|platform/i, companyName: 'Music Technology', companyType: 'Tech Platform', confidence: 0.7 },
  ];

  // Common personal email domains to exclude from company extraction
  private personalDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
    'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com',
    'mail.com', 'yandex.com', 'zoho.com', 'fastmail.com', 'gmx.com'
  ];

  constructor(apiKey: string, baseId: string, contactsTableId: string) {
    this.base = new Airtable({ apiKey }).base(baseId);
    this.config = { contactsTableId };
  }

  /**
   * Extract domain from email address
   */
  private extractDomain(email: string): string {
    const parts = email.toLowerCase().trim().split('@');
    return parts.length === 2 ? parts[1] || '' : '';
  }

  /**
   * Check if domain is a personal email domain
   */
  private isPersonalDomain(domain: string): boolean {
    return this.personalDomains.includes(domain.toLowerCase());
  }

  /**
   * Extract company name from domain
   */
  private extractCompanyFromDomain(domain: string): string {
    // Remove common TLDs and subdomains
    let companyName = domain
      .replace(/^www\./, '')
      .replace(/\.(com|org|net|co|io|me|tv|fm|am)$/i, '')
      .replace(/\.(co\.uk|com\.au|co\.nz|co\.za)$/i, '');

    // Handle common patterns
    if (companyName.includes('.')) {
      // For domains like "music.spotify.com", extract "spotify"
      const parts = companyName.split('.');
      companyName = parts[parts.length - 1] || companyName;
    }

    // Convert to title case
    companyName = companyName
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return companyName;
  }

  /**
   * Analyze domain and determine company type
   */
  private analyzeDomain(domain: string): {
    companyName: string;
    companyType: string;
    confidence: number;
    reasoning: string;
  } {
    // Check against music industry patterns
    for (const pattern of this.musicIndustryPatterns) {
      if (pattern.pattern.test(domain)) {
        return {
          companyName: pattern.companyName,
          companyType: pattern.companyType,
          confidence: pattern.confidence,
          reasoning: `Matched pattern: ${pattern.pattern.source}`
        };
      }
    }

    // If no specific pattern matched, try to extract company name
    const extractedCompany = this.extractCompanyFromDomain(domain);
    
    // Check for generic music industry keywords
    const musicKeywords = ['music', 'audio', 'sound', 'tone', 'melody', 'rhythm', 'beat', 'tune'];
    const hasMusicKeyword = musicKeywords.some(keyword => 
      domain.toLowerCase().includes(keyword)
    );

    if (hasMusicKeyword) {
      return {
        companyName: extractedCompany,
        companyType: 'Music Company',
        confidence: 0.6,
        reasoning: 'Contains music-related keyword'
      };
    }

    // Default case - unknown company type
    return {
      companyName: extractedCompany,
      companyType: 'Unknown',
      confidence: 0.3,
      reasoning: 'No specific pattern matched'
    };
  }

  /**
   * Map company type to valid Airtable select option
   */
  private mapCompanyTypeToSelectOption(companyType: string): string {
    const typeMapping: { [key: string]: string } = {
      'Radio DJ': 'Radio',
      'Music Journalist': 'Press',
      'A&R': 'Producer',
      'Manager': 'Producer',
      'Booking Agent': 'Producer',
      'Producer': 'Producer',
      'Sync Agent': 'Producer',
      'Tech Platform': 'Producer',
      'Playlist Curator': 'Producer',
      'Venue Manager': 'Producer',
      'Festival Organizer': 'Producer',
      'Music Company': 'Producer',
      'Unknown': 'Producer'
    };
    
    return typeMapping[companyType] || 'Producer';
  }

  /**
   * Get all contacts from Airtable
   */
  private async getAllContacts(): Promise<Airtable.Record<any>[]> {
    logger.info('📊 Fetching all contacts from Airtable...');
    
    const records = await this.base(this.config.contactsTableId)
      .select({
        maxRecords: 10000,
      })
      .all();

    logger.info(`📈 Found ${records.length} contacts`);
    return Array.from(records);
  }

  /**
   * Analyze email domains for all contacts
   */
  async analyzeDomains(dryRun: boolean = true): Promise<AnalysisResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const companyTypes = new Map<string, number>();
    const updates: DomainAnalysis[] = [];

    try {
      logger.info(`🚀 Starting domain analysis (${dryRun ? 'DRY RUN' : 'LIVE'})...`);
      
      const records = await this.getAllContacts();
      let analyzedCount = 0;

      for (const record of records) {
        const email = record.fields.Email?.toString().trim();
        
        if (!email) {
          continue;
        }

        const domain = this.extractDomain(email);
        
        if (!domain || this.isPersonalDomain(domain)) {
          continue;
        }

        const analysis = this.analyzeDomain(domain);
        
        // Only include if we have a reasonable confidence level
        if (analysis.confidence >= 0.3) {
          updates.push({
            email,
            domain,
            extractedCompany: analysis.companyName,
            companyType: analysis.companyType,
            confidence: analysis.confidence,
            reasoning: analysis.reasoning
          });

          // Count company types
          const currentCount = companyTypes.get(analysis.companyType) || 0;
          companyTypes.set(analysis.companyType, currentCount + 1);
        }

        analyzedCount++;
      }

      // Update Airtable records if not dry run
      if (!dryRun && updates.length > 0) {
        await this.updateAirtableRecords(updates);
        logger.info(`✅ Successfully updated ${updates.length} records in Airtable`);
      } else if (dryRun) {
        logger.info(`🔍 DRY RUN: Would update ${updates.length} records in Airtable`);
      }

      const duration = Date.now() - startTime;
      logger.info(`⏱️ Domain analysis completed in ${duration}ms`);

      return {
        totalRecords: records.length,
        analyzedRecords: analyzedCount,
        companyTypes,
        updates,
        dryRun,
        errors
      };

    } catch (error) {
      const errorMsg = `❌ Error during domain analysis: ${error}`;
      logger.error(errorMsg);
      errors.push(errorMsg);
      
      return {
        totalRecords: 0,
        analyzedRecords: 0,
        companyTypes: new Map(),
        updates: [],
        dryRun,
        errors
      };
    }
  }

  /**
   * Update Airtable records with extracted company information
   */
  private async updateAirtableRecords(updates: DomainAnalysis[]): Promise<void> {
    const batchSize = 10; // Airtable recommends batching updates
    
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      
      const updateRecords = batch.map(update => {
        // Find the record by email
        return this.base(this.config.contactsTableId)
          .select({
            filterByFormula: `{Email} = '${update.email}'`,
            maxRecords: 1
          })
          .firstPage()
          .then(records => {
            if (records.length > 0 && records[0]) {
              return {
                id: records[0].id,
                fields: {
                  'Station': update.extractedCompany,
                  'Contact Type': this.mapCompanyTypeToSelectOption(update.companyType),
                  'Reply Notes': `Auto-extracted from domain: ${update.domain} (${update.reasoning})`
                }
              };
            }
            return null;
          });
      });

      const resolvedRecords = await Promise.all(updateRecords);
      const validRecords = resolvedRecords.filter((record): record is NonNullable<typeof record> => record !== null);

      if (validRecords.length > 0) {
        try {
          await this.base(this.config.contactsTableId).update(validRecords);
          logger.info(`📝 Updated batch ${Math.floor(i / batchSize) + 1}: ${validRecords.length} records`);
        } catch (error) {
          logger.error(`❌ Error updating batch ${Math.floor(i / batchSize) + 1}:`, error);
          throw error;
        }
      }
    }
  }

  /**
   * Generate a detailed report of the analysis
   */
  generateReport(result: AnalysisResult): string {
    let report = '\n📊 DOMAIN ANALYSIS REPORT\n';
    report += '='.repeat(50) + '\n\n';
    
    report += `📈 Summary:\n`;
    report += `- Total records: ${result.totalRecords}\n`;
    report += `- Analyzed records: ${result.analyzedRecords}\n`;
    report += `- Records to update: ${result.updates.length}\n`;
    report += `- Mode: ${result.dryRun ? 'DRY RUN' : 'LIVE'}\n\n`;

    if (result.companyTypes.size > 0) {
      report += `🏢 Company Types Identified:\n`;
      report += '-'.repeat(30) + '\n';
      
      const sortedTypes = Array.from(result.companyTypes.entries())
        .sort((a, b) => b[1] - a[1]);
      
      sortedTypes.forEach(([type, count]) => {
        report += `- ${type}: ${count} contacts\n`;
      });
      report += '\n';
    }

    if (result.updates.length > 0) {
      report += `📝 Sample Updates (first 10):\n`;
      report += '-'.repeat(30) + '\n';
      
      result.updates.slice(0, 10).forEach(update => {
        report += `📧 ${update.email}\n`;
        report += `   Domain: ${update.domain}\n`;
        report += `   Company: ${update.extractedCompany}\n`;
        report += `   Type: ${update.companyType}\n`;
        report += `   Confidence: ${Math.round(update.confidence * 100)}%\n`;
        report += `   Reason: ${update.reasoning}\n\n`;
      });

      if (result.updates.length > 10) {
        report += `... and ${result.updates.length - 10} more updates\n\n`;
      }
    }

    if (result.errors.length > 0) {
      report += `❌ Errors:\n`;
      report += '-'.repeat(30) + '\n';
      result.errors.forEach(error => {
        report += `- ${error}\n`;
      });
      report += '\n';
    }

    return report;
  }

  /**
   * Factory method to create service with user config
   */
  static getAnalysisServiceForUser(userId: string): AirtableDomainAnalysis {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;

    if (!apiKey || !baseId || !contactsTableId) {
      throw new Error('Missing required Airtable environment variables');
    }

    return new AirtableDomainAnalysis(apiKey, baseId, contactsTableId);
  }
} 