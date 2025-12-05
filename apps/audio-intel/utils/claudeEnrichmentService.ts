/**
 * Claude API Enrichment Service
 *
 * Production-ready contact enrichment using Claude Sonnet 4.5
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  buildContactEnrichmentPrompt,
  buildBatchEnrichmentPrompt,
  generateFallbackEnrichment,
  type EnrichmentContext,
} from './enrichmentPrompts';
import { enrichmentRateLimiter } from './rateLimiter';
import { googleSearch, GoogleSearchService } from './googleSearchService';

export interface Contact {
  name: string;
  email: string;
  company?: string;
  role?: string;
}

export interface EnrichedContact extends Contact {
  platform: string;
  format: string;
  coverage: string;
  genres: string[];
  contactMethod: string;
  bestTiming: string;
  submissionGuidelines: string;
  pitchTips: string[];
  confidence: 'High' | 'Medium' | 'Low';
  reasoning: string;
  enrichedAt: Date;
  source: 'claude' | 'cache' | 'fallback';
  cost?: number;
}

export interface EnrichmentProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
}

type ProgressCallback = (progress: EnrichmentProgress) => void;

export interface EnrichmentOptions {
  context?: EnrichmentContext;
  onProgress?: ProgressCallback;
  useCache?: boolean;
  cacheTTL?: number; // milliseconds
}

/**
 * In-memory cache for enrichment results
 */
class EnrichmentCache {
  private cache: Map<string, { data: EnrichedContact; expiresAt: number }> = new Map();
  private defaultTTL = 7 * 24 * 60 * 60 * 1000; // 7 days

  public get(email: string): EnrichedContact | null {
    const entry = this.cache.get(email.toLowerCase());
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(email.toLowerCase());
      return null;
    }

    return entry.data;
  }

  public set(email: string, data: EnrichedContact, ttl?: number): void {
    this.cache.set(email.toLowerCase(), {
      data,
      expiresAt: Date.now() + (ttl || this.defaultTTL),
    });
  }

  public has(email: string): boolean {
    const entry = this.cache.get(email.toLowerCase());
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(email.toLowerCase());
      return false;
    }

    return true;
  }

  public clear(): void {
    this.cache.clear();
  }
}

const enrichmentCache = new EnrichmentCache();

/**
 * Model pricing configuration
 */
const MODELS = {
  sonnet: {
    id: 'claude-sonnet-4-5-20250929',
    inputCost: 0.000003, // $3 per 1M tokens
    outputCost: 0.000015, // $15 per 1M tokens
    quality: 'high',
  },
  haiku: {
    id: 'claude-3-5-haiku-20241022',
    inputCost: 0.000001, // $1 per 1M tokens
    outputCost: 0.000005, // $5 per 1M tokens
    quality: 'good',
  },
} as const;

/**
 * Cost tracking for model selection
 */
class CostTracker {
  private totalCost = 0;
  private dailyCost = 0;
  private lastResetDate = new Date().toDateString();
  private dailyLimit = 5; // $5 per day soft limit
  private requestLimit = 0.05; // $0.05 per request hard limit

  public addCost(cost: number): void {
    this.totalCost += cost;
    this.dailyCost += cost;
    this.checkDailyReset();
  }

  public shouldUseCheaperModel(): boolean {
    this.checkDailyReset();
    // Switch to Haiku if approaching daily limit (80% threshold)
    return this.dailyCost >= this.dailyLimit * 0.8;
  }

  public getDailyCost(): number {
    this.checkDailyReset();
    return this.dailyCost;
  }

  public getTotalCost(): number {
    return this.totalCost;
  }

  public isWithinRequestLimit(estimatedCost: number): boolean {
    return estimatedCost <= this.requestLimit;
  }

  private checkDailyReset(): void {
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailyCost = 0;
      this.lastResetDate = today;
      console.log('[ClaudeEnrichment] Daily cost reset');
    }
  }
}

const costTracker = new CostTracker();

/**
 * Claude Enrichment Service with cost-aware model selection
 */
export class ClaudeEnrichmentService {
  private client: Anthropic;
  private preferredModel = MODELS.sonnet;
  private fallbackModel = MODELS.haiku;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn('[ClaudeEnrichment] ANTHROPIC_API_KEY not configured, using fallback mode');
    }
    this.client = new Anthropic({
      apiKey: apiKey || 'dummy-key-for-fallback',
    });
  }

  /**
   * Select model based on cost constraints
   */
  private selectModel(): typeof MODELS.sonnet | typeof MODELS.haiku {
    if (costTracker.shouldUseCheaperModel()) {
      console.log(
        `[ClaudeEnrichment] Switching to Haiku due to cost (daily: $${costTracker.getDailyCost().toFixed(2)})`
      );
      return this.fallbackModel;
    }
    return this.preferredModel;
  }

  /**
   * Enrich a single contact
   */
  public async enrichContact(
    contact: Contact,
    options?: EnrichmentOptions
  ): Promise<EnrichedContact> {
    // Check cache first
    if (options?.useCache !== false && enrichmentCache.has(contact.email)) {
      const cached = enrichmentCache.get(contact.email);
      if (cached) {
        console.log(`[ClaudeEnrichment] Using cached result for ${contact.email}`);
        return { ...cached, source: 'cache' };
      }
    }

    // Check rate limit
    if (!enrichmentRateLimiter.isAllowed('enrichment')) {
      const resetTime = enrichmentRateLimiter.getResetTime('enrichment');
      console.warn(
        `[ClaudeEnrichment] Rate limit exceeded, resets in ${Math.ceil(resetTime / 1000)}s`
      );
      return this.getFallbackEnrichment(contact);
    }

    try {
      const prompt = buildContactEnrichmentPrompt(contact.name, contact.email, options?.context);

      // Select model based on cost constraints
      const selectedModel = this.selectModel();

      const response = await this.client.messages.create({
        model: selectedModel.id,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // P1 Fix: Safe JSON extraction with validation
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('[ClaudeEnrichment] No JSON found in Claude response, using fallback');
        return this.getFallbackEnrichment(contact);
      }

      let enrichmentData: any;
      try {
        enrichmentData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.warn('[ClaudeEnrichment] JSON parse failed, using fallback:', parseError);
        return this.getFallbackEnrichment(contact);
      }

      // Validate required fields exist
      if (!enrichmentData || typeof enrichmentData !== 'object') {
        console.warn('[ClaudeEnrichment] Invalid response structure, using fallback');
        return this.getFallbackEnrichment(contact);
      }

      // Calculate cost with selected model pricing
      const cost =
        response.usage.input_tokens * selectedModel.inputCost +
        response.usage.output_tokens * selectedModel.outputCost;

      // Track cost for future model selection
      costTracker.addCost(cost);

      console.log(
        `[ClaudeEnrichment] Enriched ${contact.email} with ${selectedModel.quality === 'high' ? 'Sonnet' : 'Haiku'} ` +
          `(cost: $${cost.toFixed(4)}, tokens: ${response.usage.input_tokens} in / ${response.usage.output_tokens} out, ` +
          `daily total: $${costTracker.getDailyCost().toFixed(2)}, confidence: ${enrichmentData.confidence})`
      );

      const enriched: EnrichedContact = {
        ...contact,
        ...enrichmentData,
        enrichedAt: new Date(),
        source: 'claude',
        cost,
      };

      // DEBUG: Log enrichment data
      console.log(`[ClaudeEnrichment] DEBUG for ${contact.email}:`, {
        confidence: enriched.confidence,
        platform: enriched.platform,
        role: enriched.role,
        googleAvailable: googleSearch.isAvailable(),
        willTriggerWebSearch: enriched.confidence === 'Low' && googleSearch.isAvailable(),
      });

      // Conditional web search: if confidence is Low, search and retry with Haiku
      if (enriched.confidence === 'Low' && googleSearch.isAvailable()) {
        console.log(
          `[ClaudeEnrichment] Low confidence for ${contact.email}, attempting web search`
        );

        try {
          const searchContext = await googleSearch.searchContact(
            contact.name,
            contact.email,
            options?.context?.genre
          );

          if (searchContext && searchContext.results.length > 0) {
            // Retry enrichment with web search results using Haiku (cheaper + faster)
            const searchPrompt = buildContactEnrichmentPrompt(contact.name, contact.email, {
              ...options?.context,
              webSearchResults: GoogleSearchService.formatForEnrichment(searchContext),
            });

            const searchResponse = await this.client.messages.create({
              model: MODELS.haiku.id, // Use Haiku for web search enrichment
              max_tokens: 1024,
              messages: [{ role: 'user', content: searchPrompt }],
            });

            const searchContent = searchResponse.content[0];
            if (searchContent.type === 'text') {
              const searchJsonMatch = searchContent.text.match(/\{[\s\S]*\}/);
              if (searchJsonMatch) {
                // P1 Fix: Safe JSON parsing for web search enrichment
                let searchEnrichmentData: any;
                try {
                  searchEnrichmentData = JSON.parse(searchJsonMatch[0]);

                  // Calculate additional cost (Haiku is cheaper)
                  const searchCost =
                    searchResponse.usage.input_tokens * MODELS.haiku.inputCost +
                    searchResponse.usage.output_tokens * MODELS.haiku.outputCost;

                  costTracker.addCost(searchCost);

                  console.log(
                    `[ClaudeEnrichment] Web search enrichment for ${contact.email} with Haiku ` +
                      `(cost: $${searchCost.toFixed(4)}, total: $${(cost + searchCost).toFixed(4)}, ` +
                      `confidence improved: ${enriched.confidence} → ${searchEnrichmentData.confidence})`
                  );

                  // Return improved enrichment
                  const improvedEnriched: EnrichedContact = {
                    ...contact,
                    ...searchEnrichmentData,
                    enrichedAt: new Date(),
                    source: 'claude-with-search',
                    cost: cost + searchCost,
                  };

                  enrichmentCache.set(contact.email, improvedEnriched, options?.cacheTTL);
                  return improvedEnriched;
                } catch {
                  console.warn(
                    `[ClaudeEnrichment] Web search JSON parse failed for ${contact.email}`
                  );
                  // Continue with original enrichment (fall through)
                }
              }
            }
          }
        } catch (searchError) {
          console.warn(`[ClaudeEnrichment] Web search failed for ${contact.email}:`, searchError);
          // Continue with original enrichment
        }
      }

      // Cache result
      enrichmentCache.set(contact.email, enriched, options?.cacheTTL);

      return enriched;
    } catch (error) {
      console.error(`[ClaudeEnrichment] Error enriching ${contact.email}:`, error);
      return this.getFallbackEnrichment(contact);
    }
  }

  /**
   * Enrich multiple contacts in batches
   */
  public async enrichBatch(
    contacts: Contact[],
    options?: EnrichmentOptions
  ): Promise<EnrichedContact[]> {
    const batchSize = 10; // Process 10 at a time
    const results: EnrichedContact[] = [];
    const progress: EnrichmentProgress = {
      total: contacts.length,
      completed: 0,
      failed: 0,
      inProgress: 0,
    };

    // Check cache for all contacts first
    const uncachedContacts: Contact[] = [];
    for (const contact of contacts) {
      if (options?.useCache !== false && enrichmentCache.has(contact.email)) {
        const cached = enrichmentCache.get(contact.email);
        if (cached) {
          results.push({ ...cached, source: 'cache' });
          progress.completed++;
          options?.onProgress?.(progress);
          continue;
        }
      }
      uncachedContacts.push(contact);
    }

    // Process uncached contacts in batches
    for (let i = 0; i < uncachedContacts.length; i += batchSize) {
      const batch = uncachedContacts.slice(i, i + batchSize);
      progress.inProgress = batch.length;
      options?.onProgress?.(progress);

      // Process batch contacts individually (could optimize with batch API in future)
      const batchResults = await Promise.allSettled(
        batch.map(contact => this.enrichContact(contact, { ...options, onProgress: undefined }))
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
          progress.completed++;
        } else {
          progress.failed++;
          console.error('[ClaudeEnrichment] Batch enrichment failed:', result.reason);
        }
      }

      progress.inProgress = 0;
      options?.onProgress?.(progress);

      // Small delay between batches to respect rate limits
      if (i + batchSize < uncachedContacts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Get fallback enrichment data
   */
  private getFallbackEnrichment(contact: Contact): EnrichedContact {
    const fallbackData = generateFallbackEnrichment(contact.email, contact.name);

    return {
      ...contact,
      ...fallbackData,
      enrichedAt: new Date(),
      source: 'fallback',
    };
  }

  /**
   * Validate API key
   */
  public async validateApiKey(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: this.preferredModel.id,
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: 'Test',
          },
        ],
      });
      return true;
    } catch (error) {
      console.error('[ClaudeEnrichment] API key validation failed:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { size: number } {
    return {
      size: enrichmentCache['cache'].size,
    };
  }

  /**
   * Clear enrichment cache
   */
  public clearCache(): void {
    enrichmentCache.clear();
  }
}
