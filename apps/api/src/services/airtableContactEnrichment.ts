import Airtable from 'airtable';
import { logger } from '../utils/logger';

export interface EnrichmentData {
  email: string;
  domain: string;
  stationName: string;
  websiteUrl: string;
  scrapedData: {
    format: string;
    genres: string[];
    submissionGuidelines: string;
    contactPreferences: string;
    djNames: string[];
    showInfo: string[];
    contactForms: string[];
    socialMedia: string[];
    additionalContacts: string[];
    rawContent: string;
  };
  confidence: number;
  errors: string[];
  contactIntelligence: string; // New field for the formatted summary
}

export interface EnrichmentResult {
  totalRecords: number;
  radioRecords: number;
  enrichedRecords: number;
  successfulScrapes: number;
  failedScrapes: number;
  dryRun: boolean;
  errors: string[];
  summary: Map<string, number>;
}

export interface UKRadioStation {
  domain: string;
  name: string;
  websiteUrl: string;
  expectedFormat: string;
}

type AirtableRecord = Airtable.Record<any>;

type ScrapedData = {
  extractedData?: string;
  markdown?: string;
  html?: string;
};

type ParsedData = {
  format: string;
  genres: string[];
  submissionGuidelines: string;
  contactPreferences: string;
  djNames: string[];
  showInfo: string[];
  contactForms: string[];
  socialMedia: string[];
  additionalContacts: string[];
};

export class AirtableContactEnrichment {
  private base: Airtable.Base;
  private config: { contactsTableId: string };
  private firecrawlApiKey: string;
  private ukRadioStations: UKRadioStation[];

  constructor(
    apiKey: string,
    baseId: string,
    contactsTableId: string,
    firecrawlApiKey: string
  ) {
    this.base = new Airtable({ apiKey }).base(baseId);
    this.config = { contactsTableId };
    this.firecrawlApiKey = firecrawlApiKey;
    this.ukRadioStations = [
      // BBC National Stations
      { domain: 'bbc.co.uk', name: 'BBC Radio', websiteUrl: 'https://www.bbc.co.uk/sounds', expectedFormat: 'Public Service' },
      { domain: 'bbcradio1.co.uk', name: 'BBC Radio 1', websiteUrl: 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_one', expectedFormat: 'Public Service' },
      { domain: 'bbcradio2.co.uk', name: 'BBC Radio 2', websiteUrl: 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_two', expectedFormat: 'Public Service' },
      { domain: 'bbcradio3.co.uk', name: 'BBC Radio 3', websiteUrl: 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_three', expectedFormat: 'Public Service' },
      { domain: 'bbcradio4.co.uk', name: 'BBC Radio 4', websiteUrl: 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_four', expectedFormat: 'Public Service' },
      { domain: 'bbc6music.co.uk', name: 'BBC Radio 6 Music', websiteUrl: 'https://www.bbc.co.uk/sounds/play/live:bbc_6music', expectedFormat: 'Public Service' },
      // Commercial Major Networks
      { domain: 'capitalfm.com', name: 'Capital FM', websiteUrl: 'https://www.capitalfm.com', expectedFormat: 'Commercial' },
      { domain: 'heart.co.uk', name: 'Heart', websiteUrl: 'https://www.heart.co.uk', expectedFormat: 'Commercial' },
      { domain: 'kissfm.co.uk', name: 'Kiss FM', websiteUrl: 'https://www.kissfm.co.uk', expectedFormat: 'Commercial' },
      { domain: 'smoothradio.com', name: 'Smooth Radio', websiteUrl: 'https://www.smoothradio.com', expectedFormat: 'Commercial' },
      { domain: 'magic.co.uk', name: 'Magic', websiteUrl: 'https://www.magic.co.uk', expectedFormat: 'Commercial' },
      // Regional Commercial Stations
      { domain: 'lbc.co.uk', name: 'LBC', websiteUrl: 'https://www.lbc.co.uk', expectedFormat: 'Commercial' },
      { domain: 'key103.co.uk', name: 'Key 103', websiteUrl: 'https://www.key103.co.uk', expectedFormat: 'Commercial' },
      { domain: 'brum.co.uk', name: 'BRMB', websiteUrl: 'https://www.brum.co.uk', expectedFormat: 'Commercial' },
      { domain: 'radiocity.co.uk', name: 'Radio City', websiteUrl: 'https://www.radiocity.co.uk', expectedFormat: 'Commercial' },
      // Additional UK Radio Stations
      { domain: 'meridianradio.co.uk', name: 'Meridian Radio', websiteUrl: 'https://www.meridianradio.co.uk', expectedFormat: 'Community' },
      { domain: 'radioexe.co.uk', name: 'Radio Exe', websiteUrl: 'https://www.radioexe.co.uk', expectedFormat: 'Community' },
      { domain: 'radiofandango.co.uk', name: 'Radio Fandango', websiteUrl: 'https://www.radiofandango.co.uk', expectedFormat: 'Community' },
      { domain: 'capitalradio.co.uk', name: 'Capital Radio', websiteUrl: 'https://www.capitalfm.com', expectedFormat: 'Commercial' },
      { domain: 'heartradio.co.uk', name: 'Heart Radio', websiteUrl: 'https://www.heart.co.uk', expectedFormat: 'Commercial' },
      { domain: 'kissradio.co.uk', name: 'Kiss Radio', websiteUrl: 'https://www.kissfm.co.uk', expectedFormat: 'Commercial' },
      { domain: 'smoothradio.co.uk', name: 'Smooth Radio', websiteUrl: 'https://www.smoothradio.com', expectedFormat: 'Commercial' },
      { domain: 'magicradio.co.uk', name: 'Magic Radio', websiteUrl: 'https://www.magic.co.uk', expectedFormat: 'Commercial' }
    ];
  }

  private extractDomain(email: string): string {
    const parts: string[] = email.toLowerCase().trim().split('@');
    return parts.length === 2 ? parts[1] || '' : '';
  }

  private findRadioStation(domain: string): UKRadioStation | null {
    return this.ukRadioStations.find(
      (station: UKRadioStation) =>
        domain.includes(station.domain) || station.domain.includes(domain)
    ) || null;
  }

  private async scrapeWebsite(url: string): Promise<ScrapedData> {
    try {
      const response: Response = await fetch('https://api.firecrawl.dev/v0/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.firecrawlApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          pageOptions: {
            onlyMainContent: true,
            includeHtml: true,
            includeMarkdown: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Firecrawl API error: ${response.status} ${response.statusText}`);
      }

      const data: ScrapedData = await response.json();
      return data;
    } catch (error: any) {
      logger.error(`Firecrawl scraping error for ${url}:`, error);
      throw error;
    }
  }

  private parseScrapedContent(scrapedData: ScrapedData): ParsedData {
    try {
      let parsedData: ParsedData = {
        format: '',
        genres: [],
        submissionGuidelines: '',
        contactPreferences: '',
        djNames: [],
        showInfo: [],
        contactForms: [],
        socialMedia: [],
        additionalContacts: []
      };

      if (scrapedData.extractedData) {
        try {
          const extracted: Partial<ParsedData> = JSON.parse(scrapedData.extractedData);
          parsedData = { ...parsedData, ...extracted };
        } catch (e) {
          const content: string = scrapedData.markdown || scrapedData.html || '';
          parsedData = this.extractFromContent(content);
        }
      }

      return parsedData;
    } catch (error: any) {
      logger.error('Error parsing scraped content:', error);
      return {
        format: '',
        genres: [],
        submissionGuidelines: '',
        contactPreferences: '',
        djNames: [],
        showInfo: [],
        contactForms: [],
        socialMedia: [],
        additionalContacts: []
      };
    }
  }

  private extractFromContent(content: string): ParsedData {
    const data: ParsedData = {
      format: '',
      genres: [],
      submissionGuidelines: '',
      contactPreferences: '',
      djNames: [],
      showInfo: [],
      contactForms: [],
      socialMedia: [],
      additionalContacts: []
    };

    // Extract DJ names (common patterns)
    const djPatterns: RegExp[] = [
      /(?:DJ|Presenter|Host)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:DJ|Presenter|Host)/gi
    ];

    djPatterns.forEach((pattern: RegExp) => {
      const matches: RegExpMatchArray | null = content.match(pattern);
      if (matches) {
        data.djNames.push(...matches.map((match: string) => match.replace(/(?:DJ|Presenter|Host)\s+/i, '').trim()).filter(Boolean));
      }
    });

    // Extract genres
    const genrePatterns: RegExp[] = [
      /(?:playing|featuring|music)\s+(?:genres?|styles?)\s*:? a*([^.\n]+)/gi,
      /(?:format|style)\s*:? a*([^.\n]+)/gi
    ];

    genrePatterns.forEach((pattern: RegExp) => {
      const matches: RegExpMatchArray | null = content.match(pattern);
      if (matches && matches[1]) {
        const genres: string[] = matches[1].split(/[,&]/).map((g: string) => g.trim());
        data.genres.push(...genres);
      }
    });

    // Extract submission guidelines
    const submissionPatterns: RegExp[] = [
      /(?:submission|demo|music)\s+(?:guidelines?|policies?|requirements?)\s*:? a*([^.\n]+)/gi,
      /(?:send|submit)\s+(?:your|demo|music)\s+to\s*:? a*([^.\n]+)/gi
    ];

    submissionPatterns.forEach((pattern: RegExp) => {
      const matches: RegExpMatchArray | null = content.match(pattern);
      if (matches) {
        data.submissionGuidelines += matches[1] + ' ';
      }
    });

    // Extract social media links
    const socialPatterns: RegExp[] = [
      /(?:https?:\/\/)?(?:www\.)?(?:facebook|twitter|instagram|youtube|tiktok)\.com\/[^ \s]+/gi,
      /@[a-zA-Z0-9_]+/g
    ];

    socialPatterns.forEach((pattern: RegExp) => {
      const matches: RegExpMatchArray | null = content.match(pattern);
      if (matches) {
        data.socialMedia.push(...matches);
      }
    });

    // Extract contact forms
    const contactPatterns: RegExp[] = [
      /(?:contact|submit|demo)\s+(?:form|page|portal)\s*:? a*([^.\n]+)/gi,
      /(?:email|send)\s+(?:to|at)\s*:? a*([^\s]+@[^ \s]+)/gi
    ];

    contactPatterns.forEach((pattern: RegExp) => {
      const matches: RegExpMatchArray | null = content.match(pattern);
      if (matches) {
        data.contactForms.push(...matches);
      }
    });

    return data;
  }

  public async getRadioContacts(): Promise<AirtableRecord[]> {
    logger.info('📻 Fetching radio contacts from Airtable...');
    const records: ReadonlyArray<AirtableRecord> = await this.base(this.config.contactsTableId)
      .select({
        maxRecords: 10000,
        filterByFormula: "{Contact Type} = 'Radio'"
      })
      .all();
    logger.info(`📈 Found ${records.length} radio contacts`);
    return Array.from(records);
  }

  public async enrichRadioContacts(
    dryRun: boolean = true,
    maxRecords: number = 50
  ): Promise<EnrichmentResult> {
    try {
      logger.info(`🎵 Starting Contact Enrichment (${dryRun ? 'PREVIEW' : 'LIVE'} mode)...`);
      const records: AirtableRecord[] = await this.getRadioContacts();
      const limitedRecords: AirtableRecord[] = records.slice(0, maxRecords);
      const enrichments: EnrichmentData[] = [];
      const errors: string[] = [];
      const summary: Map<string, number> = new Map();
      logger.info(`📊 Analyzing ${limitedRecords.length} radio contacts (limited for testing)...`);
      for (const record of limitedRecords) {
        try {
          const email: string = record.fields.Email?.toString() || '';
          if (!email) {
            errors.push(`Record ${record.id}: No email found`);
            continue;
          }
          const domain: string = this.extractDomain(email);
          if (!domain) {
            errors.push(`Record ${record.id}: Invalid email format`);
            continue;
          }
          const radioStation: UKRadioStation | null = this.findRadioStation(domain);
          if (!radioStation) {
            logger.info(`Skipping ${domain} - no known radio station mapping`);
            continue;
          }
          logger.info(`🔍 Scraping ${radioStation.name} (${radioStation.websiteUrl})...`);
          const scrapedData: ScrapedData = await this.scrapeWebsite(radioStation.websiteUrl);
          const parsedData: ParsedData = this.parseScrapedContent(scrapedData);
          const enrichment: EnrichmentData = {
            email,
            domain,
            stationName: radioStation.name,
            websiteUrl: radioStation.websiteUrl,
            scrapedData: {
              format: parsedData.format || radioStation.expectedFormat,
              genres: parsedData.genres || [],
              submissionGuidelines: parsedData.submissionGuidelines || '',
              contactPreferences: parsedData.contactPreferences || '',
              djNames: parsedData.djNames || [],
              showInfo: parsedData.showInfo || [],
              contactForms: parsedData.contactForms || [],
              socialMedia: parsedData.socialMedia || [],
              additionalContacts: parsedData.additionalContacts || [],
              rawContent: scrapedData.markdown || ''
            },
            confidence: 0.8,
            errors: [],
            contactIntelligence: '' // Placeholder for now
          };
          enrichments.push(enrichment);
          const stationKey: string = radioStation.name;
          summary.set(stationKey, (summary.get(stationKey) || 0) + 1);
        } catch (error: any) {
          const errorMsg: string = `Record ${record.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          logger.error(errorMsg);
        }
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
      }
      if (!dryRun) {
        await this.updateEnrichedRecords(enrichments);
      }
      const result: EnrichmentResult = {
        totalRecords: records.length,
        radioRecords: limitedRecords.length,
        enrichedRecords: enrichments.length,
        successfulScrapes: enrichments.length,
        failedScrapes: errors.length,
        dryRun,
        errors,
        summary
      };
      logger.info(`✅ Contact enrichment completed: ${enrichments.length} records enriched`);
      return result;
    } catch (error: any) {
      logger.error('❌ Contact enrichment error:', error);
      throw error;
    }
  }

  private async updateEnrichedRecords(enrichments: EnrichmentData[]): Promise<void> {
    logger.info(`🔄 Updating ${enrichments.length} enriched records...`);
    const updateRecords = enrichments.map(async (enrichment: EnrichmentData) => {
      const records: AirtableRecord[] = Array.from(await this.base(this.config.contactsTableId)
        .select({
          filterByFormula: `{Email} = '${enrichment.email.replace(/'/g, "\\'")}'`
        })
        .all());
      if (records.length > 0 && records[0]) {
        return {
          id: records[0].id,
          fields: {
            'Contact Intelligence': enrichment.contactIntelligence
          }
        };
      }
      return null;
    });
    const resolvedRecords = await Promise.all(updateRecords);
    const validRecords = resolvedRecords.filter((record): record is NonNullable<typeof record> => record !== null);
    if (validRecords.length > 0) {
      const batchSize: number = 10;
      let updatedCount: number = 0;
      for (let i = 0; i < validRecords.length; i += batchSize) {
        const batch = validRecords.slice(i, i + batchSize);
        await this.base(this.config.contactsTableId).update(batch);
        updatedCount += batch.length;
        logger.info(`✅ Updated batch ${Math.floor(i / batchSize) + 1}: ${batch.length} records`);
      }
      logger.info(`✅ Completed: Updated ${updatedCount} enriched records in ${Math.ceil(validRecords.length / batchSize)} batches`);
    }
  }

  public generateReport(result: EnrichmentResult): string {
    let report: string = '\n🎵 CONTACT ENRICHMENT REPORT\n';
    report += '=============================\n\n';
    report += `📊 Summary:\n`;
    report += `Total Radio Records: ${result.radioRecords}\n`;
    report += `Enriched Records: ${result.enrichedRecords}\n`;
    report += `Successful Scrapes: ${result.successfulScrapes}\n`;
    report += `Failed Scrapes: ${result.failedScrapes}\n`;
    report += `Mode: ${result.dryRun ? 'PREVIEW' : 'LIVE'}\n\n`;
    report += `🏢 Stations Enriched:\n`;
    result.summary.forEach((count: number, station: string) => {
      report += `  ${station}: ${count} contacts\n`;
    });
    if (result.errors.length > 0) {
      report += `\n❌ Errors (${result.errors.length}):\n`;
      result.errors.slice(0, 10).forEach((error: string) => {
        report += `  - ${error}\n`;
      });
      if (result.errors.length > 10) {
        report += `  ... and ${result.errors.length - 10} more errors\n`;
      }
    }
    return report;
  }

  public static getEnrichmentServiceForUser(userId: string): AirtableContactEnrichment {
    const apiKey: string | undefined = process.env.AIRTABLE_API_KEY;
    const baseId: string | undefined = process.env.AIRTABLE_BASE_ID;
    const contactsTableId: string | undefined = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    const firecrawlApiKey: string | undefined = process.env.FIRECRAWL_API_KEY;
    if (!apiKey || !baseId || !contactsTableId || !firecrawlApiKey) {
      throw new Error('Missing required environment variables (AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_CONTACTS_TABLE_ID, FIRECRAWL_API_KEY)');
    }
    return new AirtableContactEnrichment(apiKey, baseId, contactsTableId, firecrawlApiKey);
  }
} 