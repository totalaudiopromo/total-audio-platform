import Anthropic from '@anthropic-ai/sdk';
import { EventEmitter } from 'events';

/**
 * Batch Contact Processor
 *
 * Handles bulk contact enrichment using Anthropic's Batch API
 * for 50% cost reduction and improved throughput.
 *
 * Use Cases:
 * - New customer onboarding (bulk contact import)
 * - Weekly database refresh (re-enrich stale contacts)
 * - Large campaign contact discovery (100+ contacts)
 *
 * Benefits:
 * - 50% cost reduction vs individual API calls
 * - Parallel processing (10-15 minutes vs 50+ minutes)
 * - Better for overnight/background jobs
 *
 * @example
 * const processor = new BatchContactProcessor();
 * await processor.enrichContactsBatch(['contact-1', 'contact-2', ...]);
 */
export class BatchContactProcessor extends EventEmitter {
  private client: Anthropic;
  private maxBatchSize: number = 100; // API limit
  private pollInterval: number = 10000; // 10 seconds

  constructor() {
    super();
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  /**
   * Enrich multiple contacts in batch
   *
   * @param contactIds - Array of contact IDs to enrich
   * @param options - Batch processing options
   * @returns Promise that resolves when all batches complete
   */
  async enrichContactsBatch(
    contactIds: string[],
    options: {
      onProgress?: (completed: number, total: number) => void;
      onBatchComplete?: (batchId: string, results: any[]) => void;
      systemPrompt?: string;
    } = {}
  ): Promise<void> {
    // Split into batches of 100 (API limit)
    const batches = this.chunkArray(contactIds, this.maxBatchSize);

    this.emit('batch_start', {
      totalContacts: contactIds.length,
      totalBatches: batches.length,
      timestamp: new Date()
    });

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];

      this.emit('batch_creating', {
        batchNumber: i + 1,
        totalBatches: batches.length,
        contactsInBatch: batch.length,
        timestamp: new Date()
      });

      await this.processBatch(batch, i + 1, batches.length, options);

      if (options.onProgress) {
        const completed = (i + 1) * batch.length;
        options.onProgress(completed, contactIds.length);
      }
    }

    this.emit('batch_complete', {
      totalContacts: contactIds.length,
      totalBatches: batches.length,
      timestamp: new Date()
    });
  }

  /**
   * Process a single batch
   */
  private async processBatch(
    contactIds: string[],
    batchNumber: number,
    totalBatches: number,
    options: {
      onBatchComplete?: (batchId: string, results: any[]) => void;
      systemPrompt?: string;
    }
  ): Promise<void> {
    // Build batch requests
    const requests = contactIds.map((contactId, index) => ({
      custom_id: `contact-${contactId}`,
      params: {
        model: 'claude-sonnet-4-20250514' as const,
        max_tokens: 2048,
        system: options.systemPrompt || this.getDefaultSystemPrompt(),
        messages: [{
          role: 'user' as const,
          content: `Enrich contact data for contact ID: ${contactId}

Please provide:
1. Social media profile discovery (Twitter, Instagram, LinkedIn)
2. Current outlet/organization verification
3. Genre/coverage area analysis
4. Email deliverability check
5. Activity level assessment (active/inactive)

Return structured JSON with enrichment data.`
        }]
      }
    }));

    // Create batch job
    const batchJob = await this.client.batches.create({ requests });

    this.emit('batch_created', {
      batchId: batchJob.id,
      batchNumber,
      totalBatches,
      contactCount: contactIds.length,
      estimatedCostSavings: '50%',
      timestamp: new Date()
    });

    console.log(`✅ Batch ${batchNumber}/${totalBatches} created: ${batchJob.id}`);
    console.log(`   Processing ${contactIds.length} contacts`);
    console.log(`   Cost: 50% reduction vs individual requests`);

    // Poll for completion
    const results = await this.pollBatchCompletion(batchJob.id, batchNumber, totalBatches);

    if (options.onBatchComplete) {
      options.onBatchComplete(batchJob.id, results);
    }
  }

  /**
   * Poll batch job until completion
   */
  private async pollBatchCompletion(
    batchId: string,
    batchNumber: number,
    totalBatches: number
  ): Promise<any[]> {
    let isComplete = false;
    const results: any[] = [];

    while (!isComplete) {
      const status = await this.client.batches.retrieve(batchId);

      const progress = {
        batchId,
        batchNumber,
        totalBatches,
        status: status.processing_status,
        succeeded: status.request_counts.succeeded,
        failed: status.request_counts.failed,
        total: status.request_counts.total,
        percentComplete: (status.request_counts.succeeded / status.request_counts.total) * 100
      };

      this.emit('batch_progress', progress);

      console.log(`📊 Batch ${batchNumber}/${totalBatches} (${batchId})`);
      console.log(`   Status: ${status.processing_status}`);
      console.log(`   Progress: ${status.request_counts.succeeded}/${status.request_counts.total} (${progress.percentComplete.toFixed(1)}%)`);
      console.log(`   Failed: ${status.request_counts.failed}`);

      if (status.processing_status === 'ended') {
        isComplete = true;

        this.emit('batch_ended', {
          batchId,
          batchNumber,
          totalBatches,
          succeeded: status.request_counts.succeeded,
          failed: status.request_counts.failed,
          timestamp: new Date()
        });

        // Retrieve and process results
        const resultsStream = await this.client.batches.results(batchId);

        console.log(`✅ Batch ${batchNumber}/${totalBatches} complete. Processing results...`);

        for await (const result of resultsStream) {
          results.push(result);
          await this.processResult(result);
        }
      } else if (status.processing_status === 'failed' || status.processing_status === 'expired' || status.processing_status === 'canceled') {
        const error = new Error(`Batch ${batchId} ${status.processing_status}`);

        this.emit('batch_error', {
          batchId,
          batchNumber,
          totalBatches,
          error: error.message,
          timestamp: new Date()
        });

        throw error;
      } else {
        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, this.pollInterval));
      }
    }

    return results;
  }

  /**
   * Process individual result from batch
   */
  private async processResult(result: any): Promise<void> {
    try {
      // Extract contact ID from custom_id
      const contactId = result.custom_id.replace('contact-', '');

      // Extract enrichment data from response
      if (result.result && result.result.type === 'succeeded') {
        const message = result.result.message;
        const enrichmentData = this.extractEnrichmentData(message);

        this.emit('contact_enriched', {
          contactId,
          enrichmentData,
          success: true,
          timestamp: new Date()
        });

        // Here you would save to database
        // await this.saveEnrichedContact(contactId, enrichmentData);

        console.log(`   ✅ Enriched contact: ${contactId}`);
      } else if (result.result && result.result.type === 'errored') {
        this.emit('contact_error', {
          contactId,
          error: result.result.error,
          success: false,
          timestamp: new Date()
        });

        console.error(`   ❌ Failed to enrich contact: ${contactId}`, result.result.error);
      }
    } catch (error: any) {
      console.error('Error processing batch result:', error);
      this.emit('processing_error', {
        error: error.message,
        result,
        timestamp: new Date()
      });
    }
  }

  /**
   * Extract enrichment data from Claude response
   */
  private extractEnrichmentData(message: any): any {
    try {
      // Get text content from response
      const textContent = message.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('\n');

      // Try to parse as JSON
      // Look for JSON block in markdown code fence or raw JSON
      const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) ||
                        textContent.match(/```\n([\s\S]*?)\n```/) ||
                        textContent.match(/(\{[\s\S]*\})/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }

      // If no JSON found, return raw text
      return { rawResponse: textContent };
    } catch (error) {
      console.error('Error extracting enrichment data:', error);
      return { error: 'Failed to parse enrichment data', rawResponse: message };
    }
  }

  /**
   * Save enriched contact to database
   * Override this method in your implementation
   */
  protected async saveEnrichedContact(contactId: string, enrichmentData: any): Promise<void> {
    // This should be implemented with actual Prisma logic
    // Example:
    /*
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        enrichedData: JSON.stringify(enrichmentData),
        enrichedAt: new Date(),
        isEnriched: true,
        twitter: enrichmentData.socialMedia?.twitter,
        instagram: enrichmentData.socialMedia?.instagram,
        linkedin: enrichmentData.socialMedia?.linkedin
      }
    });
    */
  }

  /**
   * Get default system prompt for enrichment
   */
  private getDefaultSystemPrompt(): string {
    return `You are a contact enrichment specialist for the UK music industry.

Your task is to enrich contact data for music industry professionals including:
- Radio DJs and producers
- Music journalists and writers
- Playlist curators
- PR professionals
- Music bloggers and influencers

For each contact, provide:
1. Social media profiles (Twitter, Instagram, LinkedIn)
2. Current outlet/organization verification
3. Genre/coverage area (indie, electronic, hip-hop, etc.)
4. Geographic location (London, Manchester, UK-wide, etc.)
5. Activity level (active, inactive, changed roles)

Return structured JSON in this format:
{
  "socialMedia": {
    "twitter": "@username or null",
    "instagram": "@username or null",
    "linkedin": "profile-url or null"
  },
  "outlet": {
    "name": "BBC Radio 1",
    "verified": true,
    "notes": "Still at outlet as of [date]"
  },
  "coverage": {
    "genres": ["indie", "alternative"],
    "location": "London",
    "tier": "national"
  },
  "activity": {
    "status": "active",
    "lastSeen": "2025-10-01",
    "notes": "Recently posted about new music"
  },
  "confidence": 0.95
}`;
  }

  /**
   * Chunk array into smaller batches
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Get cost estimate for batch job
   */
  getCostEstimate(contactCount: number): {
    individualCost: number;
    batchCost: number;
    savings: number;
    savingsPercent: number;
  } {
    // Assuming ~4,000 tokens per contact enrichment
    const tokensPerContact = 4000;
    const inputTokensPerContact = 2500;
    const outputTokensPerContact = 1500;

    // Claude Sonnet 4 pricing
    const inputCostPerMTok = 3; // $3 per million tokens
    const outputCostPerMTok = 15; // $15 per million tokens

    // Individual API call cost
    const individualInputCost = (inputTokensPerContact * contactCount * inputCostPerMTok) / 1000000;
    const individualOutputCost = (outputTokensPerContact * contactCount * outputCostPerMTok) / 1000000;
    const individualCost = individualInputCost + individualOutputCost;

    // Batch API cost (50% discount)
    const batchCost = individualCost * 0.5;

    const savings = individualCost - batchCost;
    const savingsPercent = (savings / individualCost) * 100;

    return {
      individualCost: parseFloat(individualCost.toFixed(4)),
      batchCost: parseFloat(batchCost.toFixed(4)),
      savings: parseFloat(savings.toFixed(4)),
      savingsPercent: parseFloat(savingsPercent.toFixed(1))
    };
  }

  /**
   * Set custom poll interval (for testing)
   */
  setPollInterval(milliseconds: number): void {
    this.pollInterval = milliseconds;
  }

  /**
   * Set custom max batch size (for testing)
   */
  setMaxBatchSize(size: number): void {
    if (size > 100) {
      throw new Error('Max batch size cannot exceed 100 (API limit)');
    }
    this.maxBatchSize = size;
  }
}

/**
 * Batch Processor Event Types
 */
export interface BatchStartEvent {
  totalContacts: number;
  totalBatches: number;
  timestamp: Date;
}

export interface BatchCreatingEvent {
  batchNumber: number;
  totalBatches: number;
  contactsInBatch: number;
  timestamp: Date;
}

export interface BatchCreatedEvent {
  batchId: string;
  batchNumber: number;
  totalBatches: number;
  contactCount: number;
  estimatedCostSavings: string;
  timestamp: Date;
}

export interface BatchProgressEvent {
  batchId: string;
  batchNumber: number;
  totalBatches: number;
  status: string;
  succeeded: number;
  failed: number;
  total: number;
  percentComplete: number;
}

export interface ContactEnrichedEvent {
  contactId: string;
  enrichmentData: any;
  success: boolean;
  timestamp: Date;
}
