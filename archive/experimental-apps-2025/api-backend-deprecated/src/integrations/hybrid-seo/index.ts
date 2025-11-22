import { DataForSEOService } from '../dataforseo';
import { FreeSEOToolsService } from '../free-seo-tools';

interface HybridSEOConfig {
  dataForSEOUsername?: string;
  dataForSEOPassword?: string;
  useDataForSEO: boolean;
  useFreeTools: boolean;
  fallbackToFree: boolean;
}

interface HybridAnalysisResult {
  source: 'dataforseo' | 'free' | 'hybrid';
  success: boolean;
  data?: any;
  error?: string;
  cost?: number;
  performance?: {
    responseTime: number;
    dataQuality: 'high' | 'medium' | 'low';
  };
}

export class HybridSEOService {
  private dataForSEOService?: DataForSEOService;
  private freeSEOService: FreeSEOToolsService;
  private config: HybridSEOConfig;

  constructor(config: HybridSEOConfig) {
    this.config = config;
    this.freeSEOService = new FreeSEOToolsService();

    if (config.useDataForSEO && config.dataForSEOUsername && config.dataForSEOPassword) {
      this.dataForSEOService = new DataForSEOService(
        config.dataForSEOUsername,
        config.dataForSEOPassword
      );
    }
  }

  // Hybrid domain analysis
  async analyzeDomain(domain: string): Promise<HybridAnalysisResult> {
    const startTime = Date.now();

    try {
      // Try Data for SEO first if available
      if (this.dataForSEOService && this.config.useDataForSEO) {
        const dataForSEOResult = await this.dataForSEOService.analyzeDomain(domain);

        if (dataForSEOResult.success) {
          return {
            source: 'dataforseo',
            success: true,
            data: dataForSEOResult.analysis,
            cost: 1, // Data for SEO cost
            performance: {
              responseTime: Date.now() - startTime,
              dataQuality: 'high',
            },
          };
        }
      }

      // Fallback to free tools
      if (this.config.useFreeTools || this.config.fallbackToFree) {
        const freeResult = await this.freeSEOService.analyzeDomain(domain);

        if (freeResult.success) {
          return {
            source: 'free',
            success: true,
            data: freeResult.analysis,
            cost: 0,
            performance: {
              responseTime: Date.now() - startTime,
              dataQuality: 'medium',
            },
          };
        }
      }

      return {
        source: 'hybrid',
        success: false,
        error: 'Both Data for SEO and free tools failed',
        cost: this.config.useDataForSEO ? 1 : 0,
        performance: {
          responseTime: Date.now() - startTime,
          dataQuality: 'low',
        },
      };
    } catch (error) {
      return {
        source: 'hybrid',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cost: this.config.useDataForSEO ? 1 : 0,
        performance: {
          responseTime: Date.now() - startTime,
          dataQuality: 'low',
        },
      };
    }
  }

  // Hybrid keyword research
  async researchKeywords(seedKeyword: string): Promise<HybridAnalysisResult> {
    const startTime = Date.now();

    try {
      // Use free tools for keyword research (usually sufficient)
      if (this.config.useFreeTools) {
        const freeResult = await this.freeSEOService.researchKeywords(seedKeyword);

        if (freeResult.success) {
          return {
            source: 'free',
            success: true,
            data: freeResult.data,
            cost: 0,
            performance: {
              responseTime: Date.now() - startTime,
              dataQuality: 'medium',
            },
          };
        }
      }

      // Fallback to Data for SEO if free tools fail
      if (this.dataForSEOService && this.config.useDataForSEO) {
        const dataForSEOResult = await this.dataForSEOService.researchKeywords(seedKeyword);

        if (dataForSEOResult.success) {
          return {
            source: 'dataforseo',
            success: true,
            data: dataForSEOResult.keywords,
            cost: 1,
            performance: {
              responseTime: Date.now() - startTime,
              dataQuality: 'high',
            },
          };
        }
      }

      return {
        source: 'hybrid',
        success: false,
        error: 'Both keyword research methods failed',
        cost: this.config.useDataForSEO ? 1 : 0,
        performance: {
          responseTime: Date.now() - startTime,
          dataQuality: 'low',
        },
      };
    } catch (error) {
      return {
        source: 'hybrid',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cost: this.config.useDataForSEO ? 1 : 0,
        performance: {
          responseTime: Date.now() - startTime,
          dataQuality: 'low',
        },
      };
    }
  }

  // Hybrid competitor analysis
  async analyzeCompetitors(domain: string): Promise<HybridAnalysisResult> {
    const startTime = Date.now();

    try {
      // Use Data for SEO for competitor analysis (more comprehensive)
      if (this.dataForSEOService && this.config.useDataForSEO) {
        const dataForSEOResult = await this.dataForSEOService.analyzeCompetitors(domain);

        if (dataForSEOResult.success) {
          return {
            source: 'dataforseo',
            success: true,
            data: dataForSEOResult.competitors,
            cost: 1,
            performance: {
              responseTime: Date.now() - startTime,
              dataQuality: 'high',
            },
          };
        }
      }

      // Fallback to free tools
      if (this.config.useFreeTools || this.config.fallbackToFree) {
        const freeResult = await this.freeSEOService.analyzeCompetitors(domain);

        if (freeResult.success) {
          return {
            source: 'free',
            success: true,
            data: freeResult.data,
            cost: 0,
            performance: {
              responseTime: Date.now() - startTime,
              dataQuality: 'medium',
            },
          };
        }
      }

      return {
        source: 'hybrid',
        success: false,
        error: 'Both competitor analysis methods failed',
        cost: this.config.useDataForSEO ? 1 : 0,
        performance: {
          responseTime: Date.now() - startTime,
          dataQuality: 'low',
        },
      };
    } catch (error) {
      return {
        source: 'hybrid',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cost: this.config.useDataForSEO ? 1 : 0,
        performance: {
          responseTime: Date.now() - startTime,
          dataQuality: 'low',
        },
      };
    }
  }

  // Hybrid SERP analysis
  async getSERPResults(keyword: string): Promise<HybridAnalysisResult> {
    const startTime = Date.now();

    try {
      // Use Data for SEO for SERP (more accurate)
      if (this.dataForSEOService && this.config.useDataForSEO) {
        const dataForSEOResult = await this.dataForSEOService.getSERPResults(keyword);

        if (dataForSEOResult.success) {
          return {
            source: 'dataforseo',
            success: true,
            data: dataForSEOResult.results,
            cost: 1,
            performance: {
              responseTime: Date.now() - startTime,
              dataQuality: 'high',
            },
          };
        }
      }

      // For SERP, we don't have a free alternative, so return error
      return {
        source: 'hybrid',
        success: false,
        error: 'SERP analysis requires Data for SEO or similar paid service',
        cost: 0,
        performance: {
          responseTime: Date.now() - startTime,
          dataQuality: 'low',
        },
      };
    } catch (error) {
      return {
        source: 'hybrid',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cost: 0,
        performance: {
          responseTime: Date.now() - startTime,
          dataQuality: 'low',
        },
      };
    }
  }

  // Hybrid trends analysis
  async getTrendsData(keyword: string): Promise<HybridAnalysisResult> {
    const startTime = Date.now();

    try {
      // Use free Google Trends for trends data
      const freeResult = await this.freeSEOService.getTrendsData(keyword);

      if (freeResult.success) {
        return {
          source: 'free',
          success: true,
          data: freeResult.data,
          cost: 0,
          performance: {
            responseTime: Date.now() - startTime,
            dataQuality: 'high', // Google Trends is actually high quality
          },
        };
      }

      return {
        source: 'hybrid',
        success: false,
        error: 'Trends analysis failed',
        cost: 0,
        performance: {
          responseTime: Date.now() - startTime,
          dataQuality: 'low',
        },
      };
    } catch (error) {
      return {
        source: 'hybrid',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cost: 0,
        performance: {
          responseTime: Date.now() - startTime,
          dataQuality: 'low',
        },
      };
    }
  }

  // Hybrid comprehensive report
  async generateSEOReport(domain: string): Promise<HybridAnalysisResult> {
    const startTime = Date.now();
    let totalCost = 0;

    try {
      // Use Data for SEO for comprehensive reports if available
      if (this.dataForSEOService && this.config.useDataForSEO) {
        const dataForSEOResult = await this.dataForSEOService.generateSEOReport(domain);

        if (dataForSEOResult.success) {
          totalCost += 3; // Comprehensive report costs more
          return {
            source: 'dataforseo',
            success: true,
            data: dataForSEOResult.report,
            cost: totalCost,
            performance: {
              responseTime: Date.now() - startTime,
              dataQuality: 'high',
            },
          };
        }
      }

      // Fallback to free tools
      if (this.config.useFreeTools || this.config.fallbackToFree) {
        const freeResult = await this.freeSEOService.generateSEOReport(domain);

        if (freeResult.success) {
          return {
            source: 'free',
            success: true,
            data: freeResult.report,
            cost: 0,
            performance: {
              responseTime: Date.now() - startTime,
              dataQuality: 'medium',
            },
          };
        }
      }

      return {
        source: 'hybrid',
        success: false,
        error: 'Both report generation methods failed',
        cost: totalCost,
        performance: {
          responseTime: Date.now() - startTime,
          dataQuality: 'low',
        },
      };
    } catch (error) {
      return {
        source: 'hybrid',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cost: totalCost,
        performance: {
          responseTime: Date.now() - startTime,
          dataQuality: 'low',
        },
      };
    }
  }

  // Get cost analysis
  getCostAnalysis(): {
    dataForSEOCost: number;
    freeToolsCost: number;
    totalCost: number;
    recommendations: string[];
  } {
    const dataForSEOCost = this.config.useDataForSEO ? 5 : 0; // Estimated monthly cost
    const freeToolsCost = 0;
    const totalCost = dataForSEOCost + freeToolsCost;

    const recommendations: string[] = [];

    if (this.config.useDataForSEO && !this.config.useFreeTools) {
      recommendations.push('Consider using free tools for basic research to reduce costs');
    }

    if (!this.config.useDataForSEO && this.config.useFreeTools) {
      recommendations.push('Consider adding Data for SEO for advanced features when budget allows');
    }

    if (this.config.useDataForSEO && this.config.useFreeTools) {
      recommendations.push(
        'Hybrid approach is optimal - using free tools for basic research and Data for SEO for advanced analysis'
      );
    }

    return {
      dataForSEOCost,
      freeToolsCost,
      totalCost,
      recommendations,
    };
  }

  // Get service status
  getServiceStatus(): {
    dataForSEOAvailable: boolean;
    freeToolsAvailable: boolean;
    hybridMode: boolean;
    features: string[];
  } {
    const dataForSEOAvailable = !!this.dataForSEOService;
    const freeToolsAvailable = this.config.useFreeTools;
    const hybridMode = dataForSEOAvailable && freeToolsAvailable;

    const features: string[] = [];

    if (dataForSEOAvailable) {
      features.push(
        'Advanced domain analysis',
        'Comprehensive competitor analysis',
        'Detailed SERP data'
      );
    }

    if (freeToolsAvailable) {
      features.push(
        'Google Trends integration',
        'Keyword research',
        'Basic competitor analysis',
        'Free domain analysis'
      );
    }

    if (hybridMode) {
      features.push('Intelligent fallback system', 'Cost optimization', 'Best of both worlds');
    }

    return {
      dataForSEOAvailable,
      freeToolsAvailable,
      hybridMode,
      features,
    };
  }
}
