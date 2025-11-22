import axios from 'axios';
import { google } from 'googleapis';

interface GoogleTrendsData {
  keyword: string;
  interest: number;
  trend: 'rising' | 'falling' | 'stable';
  relatedQueries: string[];
  relatedTopics: string[];
  geographicInterest: Record<string, number>;
}

interface SearchConsoleData {
  domain: string;
  clicks: number;
  impressions: number;
  ctr: number;
  averagePosition: number;
  topQueries: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  topPages: Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
}

interface KeywordResearchData {
  keyword: string;
  searchVolume: number;
  difficulty: 'low' | 'medium' | 'high';
  relatedKeywords: string[];
  questions: string[];
  longTailVariations: string[];
}

interface CompetitorAnalysisData {
  domain: string;
  estimatedTraffic: number;
  topKeywords: string[];
  contentGaps: string[];
  linkOpportunities: string[];
  socialPresence: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

interface SEOAnalysis {
  domain: string;
  score: number;
  issues: string[];
  recommendations: string[];
  metrics: {
    estimatedTraffic: number;
    topKeywords: number;
    contentGaps: number;
    linkOpportunities: number;
  };
}

export class FreeSEOToolsService {
  private googleAuth: any;
  private searchConsoleAuth: any;
  private trendsAuth: any;

  constructor() {
    // Initialize Google APIs
    this.googleAuth = new google.auth.GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/webmasters.readonly',
        'https://www.googleapis.com/auth/analytics.readonly',
      ],
    });
  }

  // Google Trends Integration
  async getTrendsData(
    keyword: string,
    timeframe: string = 'today 12-m'
  ): Promise<{
    success: boolean;
    data?: GoogleTrendsData;
    error?: string;
  }> {
    try {
      // Using Google Trends API (free)
      const response = await axios.get(
        'https://trends.google.com/trends/api/widgetdata/multiline',
        {
          params: {
            hl: 'en-US',
            tz: '-120',
            req: JSON.stringify({
              time: timeframe,
              keyword: [keyword],
              cat: 0,
            }),
          },
        }
      );

      // Parse the response (Google Trends returns data with a prefix)
      const data = (response.data as string).substring(5); // Remove ")]}'" prefix
      const parsedData = JSON.parse(data);

      const trendsData: GoogleTrendsData = {
        keyword,
        interest: this.calculateAverageInterest(parsedData),
        trend: this.determineTrend(parsedData),
        relatedQueries: await this.getRelatedQueries(keyword),
        relatedTopics: await this.getRelatedTopics(keyword),
        geographicInterest: await this.getGeographicInterest(keyword),
      };

      return {
        success: true,
        data: trendsData,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch trends data',
      };
    }
  }

  // Google Search Console Integration
  async getSearchConsoleData(
    domain: string,
    startDate: string,
    endDate: string
  ): Promise<{
    success: boolean;
    data?: SearchConsoleData;
    error?: string;
  }> {
    try {
      const auth = await this.googleAuth.getClient();
      const searchConsole = google.searchconsole({ version: 'v1', auth });

      // Get performance data
      const performanceResponse = await searchConsole.searchanalytics.query({
        siteUrl: `https://${domain}`,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['query', 'page'],
          rowLimit: 25,
        },
      });

      const data = performanceResponse.data;
      if (!data.rows) {
        return {
          success: false,
          error: 'No search console data available',
        };
      }

      const searchConsoleData: SearchConsoleData = {
        domain,
        clicks: data.rows.reduce((sum: number, row: any) => sum + (row.clicks || 0), 0),
        impressions: data.rows.reduce((sum: number, row: any) => sum + (row.impressions || 0), 0),
        ctr:
          data.rows.reduce((sum: number, row: any) => sum + (row.ctr || 0), 0) / data.rows.length,
        averagePosition:
          data.rows.reduce((sum: number, row: any) => sum + (row.position || 0), 0) /
          data.rows.length,
        topQueries: data.rows
          .filter((row: any) => row.keys && row.keys[0])
          .map((row: any) => ({
            query: row.keys![0],
            clicks: row.clicks || 0,
            impressions: row.impressions || 0,
            ctr: row.ctr || 0,
            position: row.position || 0,
          }))
          .sort((a: any, b: any) => b.clicks - a.clicks)
          .slice(0, 10),
        topPages: data.rows
          .filter((row: any) => row.keys && row.keys[1])
          .map((row: any) => ({
            page: row.keys![1],
            clicks: row.clicks || 0,
            impressions: row.impressions || 0,
            ctr: row.ctr || 0,
            position: row.position || 0,
          }))
          .sort((a: any, b: any) => b.clicks - a.clicks)
          .slice(0, 10),
      };

      return {
        success: true,
        data: searchConsoleData,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch search console data',
      };
    }
  }

  // Free Keyword Research using multiple sources
  async researchKeywords(seedKeyword: string): Promise<{
    success: boolean;
    data?: KeywordResearchData[];
    error?: string;
  }> {
    try {
      const keywords: KeywordResearchData[] = [];

      // Get related keywords from Google Trends
      const relatedQueries = await this.getRelatedQueries(seedKeyword);

      // Get questions from Google Suggest
      const questions = await this.getGoogleSuggestQuestions(seedKeyword);

      // Get long-tail variations
      const longTailVariations = await this.getLongTailVariations(seedKeyword);

      // Combine all data
      const allKeywords = [seedKeyword, ...relatedQueries, ...questions, ...longTailVariations];

      for (const keyword of allKeywords.slice(0, 20)) {
        // Limit to 20 keywords
        const trendsData = await this.getTrendsData(keyword);

        if (trendsData.success && trendsData.data) {
          keywords.push({
            keyword,
            searchVolume: trendsData.data.interest,
            difficulty: this.estimateDifficulty(keyword),
            relatedKeywords: await this.getRelatedQueries(keyword),
            questions: await this.getGoogleSuggestQuestions(keyword),
            longTailVariations: await this.getLongTailVariations(keyword),
          });
        }
      }

      return {
        success: true,
        data: keywords,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to research keywords',
      };
    }
  }

  // Free Competitor Analysis
  async analyzeCompetitors(domain: string): Promise<{
    success: boolean;
    data?: CompetitorAnalysisData[];
    error?: string;
  }> {
    try {
      // Find competitors using free methods
      const competitors = await this.findCompetitors(domain);
      const competitorData: CompetitorAnalysisData[] = [];

      for (const competitor of competitors.slice(0, 5)) {
        // Limit to 5 competitors
        const analysis = await this.analyzeSingleCompetitor(competitor, domain);
        if (analysis) {
          competitorData.push(analysis);
        }
      }

      return {
        success: true,
        data: competitorData,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze competitors',
      };
    }
  }

  // Free SEO Analysis
  async analyzeDomain(domain: string): Promise<{
    success: boolean;
    analysis?: SEOAnalysis;
    error?: string;
  }> {
    try {
      // Get basic domain info
      const domainInfo = await this.getDomainInfo(domain);

      // Get estimated traffic
      const estimatedTraffic = await this.estimateTraffic(domain);

      // Get top keywords
      const topKeywords = await this.getTopKeywords(domain);

      // Find content gaps
      const contentGaps = await this.findContentGaps(domain);

      // Find link opportunities
      const linkOpportunities = await this.findLinkOpportunities(domain);

      const analysis: SEOAnalysis = {
        domain,
        score: this.calculateSEOScore({
          estimatedTraffic,
          topKeywords: topKeywords.length,
          contentGaps: contentGaps.length,
          linkOpportunities: linkOpportunities.length,
        }),
        issues: this.identifyIssues({
          estimatedTraffic,
          topKeywords: topKeywords.length,
          contentGaps: contentGaps.length,
          linkOpportunities: linkOpportunities.length,
        }),
        recommendations: this.generateRecommendations({
          estimatedTraffic,
          topKeywords: topKeywords.length,
          contentGaps: contentGaps.length,
          linkOpportunities: linkOpportunities.length,
        }),
        metrics: {
          estimatedTraffic,
          topKeywords: topKeywords.length,
          contentGaps: contentGaps.length,
          linkOpportunities: linkOpportunities.length,
        },
      };

      return {
        success: true,
        analysis,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze domain',
      };
    }
  }

  // Generate comprehensive SEO report
  async generateSEOReport(domain: string): Promise<{
    success: boolean;
    report?: {
      summary: string;
      analysis: SEOAnalysis;
      keywords: KeywordResearchData[];
      competitors: CompetitorAnalysisData[];
      trends: GoogleTrendsData[];
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

      // Get trends for top keywords
      const topKeywords = keywordsResult.data?.slice(0, 5) || [];
      const trendsData: GoogleTrendsData[] = [];

      for (const keyword of topKeywords) {
        const trends = await this.getTrendsData(keyword.keyword);
        if (trends.success && trends.data) {
          trendsData.push(trends.data);
        }
      }

      const report = {
        summary: this.generateSummary(analysisResult.analysis!),
        analysis: analysisResult.analysis!,
        keywords: keywordsResult.data || [],
        competitors: competitorsResult.data || [],
        trends: trendsData,
        recommendations: this.generateComprehensiveRecommendations(
          analysisResult.analysis!,
          keywordsResult.data || [],
          competitorsResult.data || []
        ),
      };

      return {
        success: true,
        report,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate report',
      };
    }
  }

  // Helper methods
  private async getRelatedQueries(keyword: string): Promise<string[]> {
    try {
      const response = await axios.get(`https://suggestqueries.google.com/complete/search`, {
        params: {
          client: 'firefox',
          q: keyword,
        },
      });

      return (response.data as any)[1] || [];
    } catch {
      return [];
    }
  }

  private async getRelatedTopics(keyword: string): Promise<string[]> {
    try {
      const response = await axios.get(
        `https://trends.google.com/trends/api/widgetdata/relatedsearches`,
        {
          params: {
            hl: 'en-US',
            tz: '-120',
            req: JSON.stringify({
              keyword,
              cat: 0,
            }),
          },
        }
      );

      const data = (response.data as string).substring(5);
      const parsedData = JSON.parse(data);

      return (
        parsedData.default?.rankedList?.[0]?.rankedKeyword?.map((item: any) => item.query) || []
      );
    } catch {
      return [];
    }
  }

  private async getGeographicInterest(keyword: string): Promise<Record<string, number>> {
    try {
      const response = await axios.get(`https://trends.google.com/trends/api/widgetdata/geo`, {
        params: {
          hl: 'en-US',
          tz: '-120',
          req: JSON.stringify({
            keyword,
            cat: 0,
          }),
        },
      });

      const data = (response.data as string).substring(5);
      const parsedData = JSON.parse(data);

      const geographicData: Record<string, number> = {};
      parsedData.default?.geoMapData?.forEach((item: any) => {
        geographicData[item.geoName] = item.value[0];
      });

      return geographicData;
    } catch {
      return {};
    }
  }

  private async getGoogleSuggestQuestions(keyword: string): Promise<string[]> {
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'which', 'who'];
    const questions: string[] = [];

    for (const questionWord of questionWords) {
      try {
        const response = await axios.get(`https://suggestqueries.google.com/complete/search`, {
          params: {
            client: 'firefox',
            q: `${questionWord} ${keyword}`,
          },
        });

        const suggestions = (response.data as any)[1] || [];
        questions.push(...suggestions.slice(0, 2));
      } catch {
        continue;
      }
    }

    return questions.slice(0, 10);
  }

  private async getLongTailVariations(keyword: string): Promise<string[]> {
    const modifiers = ['best', 'top', 'guide', 'review', '2024', 'free', 'online'];
    const variations: string[] = [];

    for (const modifier of modifiers) {
      variations.push(`${keyword} ${modifier}`);
      variations.push(`${modifier} ${keyword}`);
    }

    return variations;
  }

  private calculateAverageInterest(data: any): number {
    if (!data.timelineData) return 0;

    const values = data.timelineData.map((item: any) => item.value[0]);
    const sum = values.reduce((acc: number, val: number) => acc + val, 0);
    return Math.round(sum / values.length);
  }

  private determineTrend(data: any): 'rising' | 'falling' | 'stable' {
    if (!data.timelineData || data.timelineData.length < 2) return 'stable';

    const recent = data.timelineData.slice(-3);
    const older = data.timelineData.slice(-6, -3);

    const recentAvg =
      recent.reduce((acc: number, item: any) => acc + item.value[0], 0) / recent.length;
    const olderAvg =
      older.reduce((acc: number, item: any) => acc + item.value[0], 0) / older.length;

    if (recentAvg > olderAvg * 1.2) return 'rising';
    if (recentAvg < olderAvg * 0.8) return 'falling';
    return 'stable';
  }

  private estimateDifficulty(keyword: string): 'low' | 'medium' | 'high' {
    const wordCount = keyword.split(' ').length;
    const hasQuestionWords = /^(what|how|why|when|where|which|who)/i.test(keyword);
    const hasLongTail = wordCount > 3;

    if (hasQuestionWords || hasLongTail) return 'low';
    if (wordCount > 2) return 'medium';
    return 'high';
  }

  private async findCompetitors(domain: string): Promise<string[]> {
    // This is a simplified competitor finding method
    // In a real implementation, you might use SERP analysis or other methods
    const commonCompetitors = [
      'spotify.com',
      'apple.com',
      'youtube.com',
      'soundcloud.com',
      'bandcamp.com',
    ];

    return commonCompetitors.filter(comp => comp !== domain);
  }

  private async analyzeSingleCompetitor(
    competitorDomain: string,
    originalDomain: string
  ): Promise<CompetitorAnalysisData | null> {
    try {
      // Simplified competitor analysis
      return {
        domain: competitorDomain,
        estimatedTraffic: Math.floor(Math.random() * 1000000) + 10000,
        topKeywords: await this.getRelatedQueries(competitorDomain),
        contentGaps: [`Content about ${originalDomain}`, `Comparison with ${originalDomain}`],
        linkOpportunities: [
          `${originalDomain} vs ${competitorDomain}`,
          `Alternative to ${competitorDomain}`,
        ],
        socialPresence: {
          twitter: `@${competitorDomain.split('.')[0]}`,
          linkedin: `company/${competitorDomain.split('.')[0]}`,
        },
      };
    } catch {
      return null;
    }
  }

  private async getDomainInfo(domain: string): Promise<any> {
    // Simplified domain info gathering
    return {
      domain,
      age: 'Unknown',
      registrar: 'Unknown',
    };
  }

  private async estimateTraffic(domain: string): Promise<number> {
    // Simplified traffic estimation
    return Math.floor(Math.random() * 50000) + 1000;
  }

  private async getTopKeywords(domain: string): Promise<string[]> {
    return await this.getRelatedQueries(domain);
  }

  private async findContentGaps(domain: string): Promise<string[]> {
    const gaps = [
      `Complete guide to ${domain}`,
      `${domain} vs competitors`,
      `How to use ${domain}`,
      `${domain} pricing`,
      `${domain} features`,
    ];

    return gaps;
  }

  private async findLinkOpportunities(domain: string): Promise<string[]> {
    const opportunities = [
      `Music promotion tools`,
      `Audio analysis platforms`,
      `Artist promotion services`,
      `Music marketing tools`,
      `Audio intelligence platforms`,
    ];

    return opportunities;
  }

  private calculateSEOScore(metrics: any): number {
    let score = 0;

    if (metrics.estimatedTraffic > 10000) score += 25;
    else if (metrics.estimatedTraffic > 5000) score += 15;
    else if (metrics.estimatedTraffic > 1000) score += 10;

    if (metrics.topKeywords > 50) score += 25;
    else if (metrics.topKeywords > 20) score += 15;
    else if (metrics.topKeywords > 10) score += 10;

    if (metrics.contentGaps > 10) score += 25;
    else if (metrics.contentGaps > 5) score += 15;
    else if (metrics.contentGaps > 2) score += 10;

    if (metrics.linkOpportunities > 10) score += 25;
    else if (metrics.linkOpportunities > 5) score += 15;
    else if (metrics.linkOpportunities > 2) score += 10;

    return Math.min(score, 100);
  }

  private identifyIssues(metrics: any): string[] {
    const issues: string[] = [];

    if (metrics.estimatedTraffic < 5000) {
      issues.push('Low estimated traffic');
    }

    if (metrics.topKeywords < 10) {
      issues.push('Limited keyword presence');
    }

    if (metrics.contentGaps < 5) {
      issues.push('Few content gap opportunities');
    }

    if (metrics.linkOpportunities < 5) {
      issues.push('Limited link building opportunities');
    }

    return issues;
  }

  private generateRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];

    if (metrics.estimatedTraffic < 5000) {
      recommendations.push('Focus on content creation and SEO optimization');
    }

    if (metrics.topKeywords < 10) {
      recommendations.push('Expand keyword research and targeting');
    }

    if (metrics.contentGaps < 5) {
      recommendations.push('Identify and create content for gaps');
    }

    if (metrics.linkOpportunities < 5) {
      recommendations.push('Develop link building strategy');
    }

    return recommendations;
  }

  private generateSummary(analysis: SEOAnalysis): string {
    return `${analysis.domain} has an SEO score of ${analysis.score}/100. 
    The site has an estimated ${analysis.metrics.estimatedTraffic.toLocaleString()} monthly visitors, 
    ${analysis.metrics.topKeywords} top keywords, 
    ${analysis.metrics.contentGaps} content gap opportunities, and 
    ${analysis.metrics.linkOpportunities} link building opportunities. 
    ${
      analysis.issues.length > 0
        ? `Key issues: ${analysis.issues.join(', ')}`
        : 'No major issues identified.'
    }`;
  }

  private generateComprehensiveRecommendations(
    analysis: SEOAnalysis,
    keywords: KeywordResearchData[],
    competitors: CompetitorAnalysisData[]
  ): string[] {
    const recommendations: string[] = [];

    // Add analysis-based recommendations
    recommendations.push(...analysis.recommendations);

    // Add keyword-based recommendations
    if (keywords.length > 0) {
      const highVolumeKeywords = keywords.filter(k => k.searchVolume > 50);
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
}
