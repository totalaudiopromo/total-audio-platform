import axios from 'axios';

interface DataForSEOConfig {
  username: string;
  password: string;
  baseUrl: string;
}

interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  competition: string;
}

interface CompetitorData {
  domain: string;
  organicKeywords: number;
  organicTraffic: number;
  backlinks: number;
  domainAuthority: number;
}

interface SEOAnalysis {
  domain: string;
  score: number;
  issues: string[];
  recommendations: string[];
  metrics: {
    organicKeywords: number;
    organicTraffic: number;
    backlinks: number;
    domainAuthority: number;
  };
}

interface SERPData {
  keyword: string;
  results: Array<{
    position: number;
    title: string;
    url: string;
    snippet: string;
    domain: string;
  }>;
}

export class DataForSEOService {
  private config: DataForSEOConfig;

  constructor(username: string, password: string) {
    this.config = {
      username,
      password,
      baseUrl: 'https://api.dataforseo.com/v3',
    };
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.config.baseUrl}${endpoint}`, [data], {
        auth: {
          username: this.config.username,
          password: this.config.password,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async analyzeDomain(domain: string): Promise<{
    success: boolean;
    analysis?: SEOAnalysis;
    error?: string;
  }> {
    try {
      const data = {
        target: domain,
        location_code: 2840, // US
        language_code: 'en',
      };

      const response = await this.makeRequest('/domain_analytics/overview', data);

      if (!response.tasks?.[0]?.result?.[0]) {
        return {
          success: false,
          error: 'No analysis data available',
        };
      }

      const result = response.tasks[0].result[0];

      const analysis: SEOAnalysis = {
        domain,
        score: this.calculateSEOScore(result),
        issues: this.identifyIssues(result),
        recommendations: this.generateRecommendations(result),
        metrics: {
          organicKeywords: result.organic_keywords || 0,
          organicTraffic: result.organic_traffic || 0,
          backlinks: result.backlinks || 0,
          domainAuthority: result.domain_authority || 0,
        },
      };

      return {
        success: true,
        analysis,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async researchKeywords(
    seedKeyword: string,
    location?: string
  ): Promise<{
    success: boolean;
    keywords?: KeywordData[];
    error?: string;
  }> {
    try {
      const data = {
        keyword: seedKeyword,
        location_code: location ? this.getLocationCode(location) : 2840,
        language_code: 'en',
        depth: 10,
      };

      const response = await this.makeRequest('/keywords_data/google/keyword_suggestions', data);

      if (!response.tasks?.[0]?.result?.[0]?.items) {
        return {
          success: false,
          error: 'No keyword data available',
        };
      }

      const keywords: KeywordData[] = response.tasks[0].result[0].items.map((item: any) => ({
        keyword: item.keyword,
        searchVolume: item.search_volume || 0,
        difficulty: item.keyword_difficulty || 0,
        cpc: item.cpc || 0,
        competition: item.competition || 'low',
      }));

      return {
        success: true,
        keywords,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async analyzeCompetitors(domain: string): Promise<{
    success: boolean;
    competitors?: CompetitorData[];
    error?: string;
  }> {
    try {
      const data = {
        target: domain,
        location_code: 2840,
        language_code: 'en',
      };

      const response = await this.makeRequest('/domain_analytics/competitors', data);

      if (!response.tasks?.[0]?.result?.[0]?.items) {
        return {
          success: false,
          error: 'No competitor data available',
        };
      }

      const competitors: CompetitorData[] = response.tasks[0].result[0].items.map((item: any) => ({
        domain: item.domain,
        organicKeywords: item.organic_keywords || 0,
        organicTraffic: item.organic_traffic || 0,
        backlinks: item.backlinks || 0,
        domainAuthority: item.domain_authority || 0,
      }));

      return {
        success: true,
        competitors,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getSERPResults(
    keyword: string,
    location?: string
  ): Promise<{
    success: boolean;
    results?: SERPData;
    error?: string;
  }> {
    try {
      const data = {
        keyword: keyword,
        location_code: location ? this.getLocationCode(location) : 2840,
        language_code: 'en',
        depth: 100,
      };

      const response = await this.makeRequest('/serp/google/organic/live/regular', data);

      if (!response.tasks?.[0]?.result?.[0]?.items) {
        return {
          success: false,
          error: 'No SERP data available',
        };
      }

      const results: SERPData = {
        keyword,
        results: response.tasks[0].result[0].items.map((item: any, index: number) => ({
          position: index + 1,
          title: item.title || '',
          url: item.link || '',
          snippet: item.snippet || '',
          domain: this.extractDomain(item.link || ''),
        })),
      };

      return {
        success: true,
        results,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generateSEOReport(domain: string): Promise<{
    success: boolean;
    report?: {
      summary: string;
      analysis: SEOAnalysis;
      keywords: KeywordData[];
      competitors: CompetitorData[];
      recommendations: string[];
    };
    error?: string;
  }> {
    try {
      const [analysisResult, keywordsResult, competitorsResult] = await Promise.all([
        this.analyzeDomain(domain),
        this.researchKeywords(domain),
        this.analyzeCompetitors(domain),
      ]);

      if (!analysisResult.success) {
        return {
          success: false,
          error: analysisResult.error || 'Analysis failed',
        };
      }

      const report = {
        summary: this.generateSummary(analysisResult.analysis!),
        analysis: analysisResult.analysis!,
        keywords: keywordsResult.keywords || [],
        competitors: competitorsResult.competitors || [],
        recommendations: this.generateComprehensiveRecommendations(
          analysisResult.analysis!,
          keywordsResult.keywords || [],
          competitorsResult.competitors || []
        ),
      };

      return {
        success: true,
        report,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private calculateSEOScore(data: any): number {
    // Calculate a simple SEO score based on various metrics
    let score = 0;

    if (data.organic_keywords) score += Math.min(data.organic_keywords / 100, 30);
    if (data.organic_traffic) score += Math.min(data.organic_traffic / 1000, 30);
    if (data.backlinks) score += Math.min(data.backlinks / 1000, 20);
    if (data.domain_authority) score += Math.min(data.domain_authority, 20);

    return Math.round(score);
  }

  private identifyIssues(data: any): string[] {
    const issues: string[] = [];

    if (!data.organic_keywords || data.organic_keywords < 10) {
      issues.push('Low number of organic keywords');
    }

    if (!data.organic_traffic || data.organic_traffic < 1000) {
      issues.push('Low organic traffic');
    }

    if (!data.backlinks || data.backlinks < 100) {
      issues.push('Limited backlink profile');
    }

    if (!data.domain_authority || data.domain_authority < 20) {
      issues.push('Low domain authority');
    }

    return issues;
  }

  private generateRecommendations(data: any): string[] {
    const recommendations: string[] = [];

    if (!data.organic_keywords || data.organic_keywords < 10) {
      recommendations.push('Focus on keyword research and content creation');
    }

    if (!data.organic_traffic || data.organic_traffic < 1000) {
      recommendations.push('Improve on-page SEO and content quality');
    }

    if (!data.backlinks || data.backlinks < 100) {
      recommendations.push('Develop link building strategy');
    }

    if (!data.domain_authority || data.domain_authority < 20) {
      recommendations.push('Build quality backlinks and improve site authority');
    }

    return recommendations;
  }

  private generateComprehensiveRecommendations(
    analysis: SEOAnalysis,
    keywords: KeywordData[],
    competitors: CompetitorData[]
  ): string[] {
    const recommendations: string[] = [];

    // Add analysis-based recommendations
    recommendations.push(...analysis.recommendations);

    // Add keyword-based recommendations
    if (keywords.length > 0) {
      const highVolumeKeywords = keywords.filter(k => k.searchVolume > 1000);
      if (highVolumeKeywords.length > 0) {
        recommendations.push(
          `Target high-volume keywords: ${highVolumeKeywords
            .slice(0, 3)
            .map(k => k.keyword)
            .join(', ')}`
        );
      }
    }

    // Add competitor-based recommendations
    if (competitors.length > 0) {
      const topCompetitor = competitors[0];
      if (topCompetitor) {
        recommendations.push(`Analyze competitor strategies from ${topCompetitor.domain}`);
      }
    }

    return recommendations;
  }

  private generateSummary(analysis: SEOAnalysis): string {
    return `${analysis.domain} has an SEO score of ${analysis.score}/100. 
    The site has ${analysis.metrics.organicKeywords} organic keywords, 
    ${analysis.metrics.organicTraffic} monthly organic traffic, 
    ${analysis.metrics.backlinks} backlinks, and a domain authority of ${analysis.metrics.domainAuthority}. 
    ${analysis.issues.length > 0 ? `Key issues: ${analysis.issues.join(', ')}` : 'No major issues identified.'}`;
  }

  private getLocationCode(location: string): number {
    const locationMap: Record<string, number> = {
      US: 2840,
      UK: 2826,
      CA: 2124,
      AU: 2036,
      DE: 2276,
      FR: 2250,
      ES: 2724,
      IT: 2380,
      JP: 2392,
      BR: 2076,
    };

    return locationMap[location.toUpperCase()] || 2840;
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }
}
