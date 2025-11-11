/**
 * Google Custom Search API Service
 *
 * Free tier: 100 searches/day
 * Paid: $5 per 1,000 queries after free tier
 */

interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink?: string;
}

interface GoogleSearchResponse {
  items?: GoogleSearchResult[];
  searchInformation?: {
    totalResults: string;
  };
}

export interface SearchContext {
  query: string;
  results: GoogleSearchResult[];
  totalResults: number;
  source: 'google-custom-search';
  searchedAt: Date;
}

/**
 * Search quota tracker for free tier management
 */
class SearchQuotaTracker {
  private dailySearches = 0;
  private lastResetDate = new Date().toDateString();
  private freeLimit = 100; // Google Custom Search free tier

  public canSearch(): boolean {
    this.checkDailyReset();
    return this.dailySearches < this.freeLimit;
  }

  public recordSearch(): void {
    this.dailySearches++;
    this.checkDailyReset();
  }

  public getRemaining(): number {
    this.checkDailyReset();
    return Math.max(0, this.freeLimit - this.dailySearches);
  }

  public getUsage(): { used: number; limit: number; remaining: number } {
    this.checkDailyReset();
    return {
      used: this.dailySearches,
      limit: this.freeLimit,
      remaining: this.getRemaining(),
    };
  }

  private checkDailyReset(): void {
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailySearches = 0;
      this.lastResetDate = today;
      console.log('[GoogleSearch] Daily quota reset');
    }
  }
}

const searchQuota = new SearchQuotaTracker();

/**
 * Google Custom Search Service
 */
export class GoogleSearchService {
  private apiKey: string;
  private searchEngineId: string;
  private baseUrl = 'https://www.googleapis.com/customsearch/v1';

  constructor() {
    this.apiKey = process.env.GOOGLE_SEARCH_API_KEY || '';
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || '';

    if (!this.apiKey || !this.searchEngineId) {
      console.warn('[GoogleSearch] API credentials not configured, search will be disabled');
    }
  }

  /**
   * Search for contact information
   */
  public async searchContact(
    name: string,
    email: string,
    additionalContext?: string
  ): Promise<SearchContext | null> {
    // Check quota
    if (!searchQuota.canSearch()) {
      console.warn(
        `[GoogleSearch] Daily quota exceeded (${searchQuota.getUsage().used}/${searchQuota.getUsage().limit})`
      );
      return null;
    }

    // Check API credentials
    if (!this.apiKey || !this.searchEngineId) {
      console.warn('[GoogleSearch] API credentials not configured');
      return null;
    }

    try {
      // Build search query
      const emailDomain = email.split('@')[1] || '';
      const query = additionalContext
        ? `${name} ${email} ${additionalContext} music industry contact`
        : `${name} ${email} ${emailDomain} music industry role contact information`;

      console.log(`[GoogleSearch] Searching: "${query}"`);

      // Call Google Custom Search API
      const url = new URL(this.baseUrl);
      url.searchParams.set('key', this.apiKey);
      url.searchParams.set('cx', this.searchEngineId);
      url.searchParams.set('q', query);
      url.searchParams.set('num', '5'); // Return top 5 results

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Google Search API error: ${response.status} ${response.statusText}`);
      }

      const data: GoogleSearchResponse = await response.json();

      // Record search for quota tracking
      searchQuota.recordSearch();

      const results = data.items || [];
      const totalResults = parseInt(data.searchInformation?.totalResults || '0', 10);

      console.log(
        `[GoogleSearch] Found ${results.length} results (${totalResults} total, ` +
          `${searchQuota.getRemaining()} searches remaining today)`
      );

      return {
        query,
        results,
        totalResults,
        source: 'google-custom-search',
        searchedAt: new Date(),
      };
    } catch (error) {
      console.error('[GoogleSearch] Search failed:', error);
      return null;
    }
  }

  /**
   * Format search results for Claude enrichment
   */
  public static formatForEnrichment(searchContext: SearchContext): string {
    if (!searchContext.results.length) {
      return 'No search results found.';
    }

    return searchContext.results
      .map((result, i) => {
        return `
Result ${i + 1}:
Title: ${result.title}
URL: ${result.link}
Snippet: ${result.snippet}
${result.displayLink ? `Source: ${result.displayLink}` : ''}
`.trim();
      })
      .join('\n\n');
  }

  /**
   * Check if search is available (credentials configured and quota remaining)
   */
  public isAvailable(): boolean {
    return !!(this.apiKey && this.searchEngineId) && searchQuota.canSearch();
  }

  /**
   * Get current search quota status
   */
  public getQuotaStatus() {
    return searchQuota.getUsage();
  }
}

// Export singleton instance
export const googleSearch = new GoogleSearchService();
