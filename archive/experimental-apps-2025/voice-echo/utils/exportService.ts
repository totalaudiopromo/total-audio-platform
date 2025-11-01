import { exportToCsv } from './exportToCsv';
import { exportToExcel } from './exportToExcel';
import {
  exportAnalyticsToPdf,
  exportContactsToPdf,
  exportSearchResultsToPdf,
  exportAIAgentReportToPdf,
} from './exportToPdf';
import {
  generateContactExportEmail,
  generateAnalyticsExportEmail,
  generateSearchResultsEmail,
  generateAIAgentReportEmail,
} from './emailTemplates';

// Helper function to convert string arrays to CSV format
function arrayToCsv(data: string[][]): string {
  if (!data.length) return '';

  const escape = (val: string | undefined) => {
    if (val == null || val === undefined) return '';
    // Escape quotes by doubling them, wrap in quotes if contains comma, quote, or newline
    const needsQuotes = /[",\n]/.test(val);
    let out = val.replace(/"/g, '""');
    if (needsQuotes) out = `"${out}"`;
    return out;
  };

  const rows = data.map(row => row.map(escape).join(','));
  return rows.join('\r\n');
}

// Helper function to get display name with fallback
function getDisplayName(contact: ContactData): string {
  if (contact.name && contact.name.trim()) {
    return contact.name.trim();
  }

  // Extract name from email if available
  if (contact.email) {
    const emailName = contact.email.split('@')[0];
    if (emailName && emailName !== 'unknown' && emailName !== 'n/a') {
      // Convert email name to proper case
      return emailName
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .trim();
    }
  }

  return 'Contact Name Unavailable';
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  emailDelivery?: boolean;
  recipientEmail?: string;
  customMessage?: string;
  whiteLabel?: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
  };
  filename?: string;
  batchSize?: number;
  includeMetadata?: boolean;
  compression?: boolean;
}

export interface ExportProgress {
  current: number;
  total: number;
  percentage: number;
  stage: 'preparing' | 'processing' | 'formatting' | 'delivering' | 'complete';
  message: string;
}

export interface ContactData {
  name: string;
  email: string;
  contactIntelligence: string;
  researchConfidence?: string;
  lastResearched?: string;
  platform?: string;
  role?: string;
  company?: string;
  metadata?: {
    source?: string;
    tags?: string[];
    notes?: string;
    priority?: 'high' | 'medium' | 'low';
  };
}

export interface AnalyticsData {
  totalContacts: number;
  totalEnrichments: number;
  successRate: number;
  averageConfidence: number;
  platformBreakdown: Record<string, number>;
  dailyEnrichments: Array<{ date: string; count: number }>;
  topPlatforms: Array<{ platform: string; count: number; percentage: number }>;
  performanceMetrics: {
    averageProcessingTime: number;
    cacheHitRate: number;
    errorRate: number;
  };
  customMetrics?: Record<string, any>;
}

export interface SearchResultsData {
  query: string;
  results: Array<{
    platform: string;
    title: string;
    description: string;
    url: string;
    contact?: string;
    relevance: string;
    lastUpdated: string;
    metadata?: {
      tags?: string[];
      priority?: number;
      notes?: string;
    };
  }>;
  totalFound: number;
  filters?: Record<string, any>;
  searchMetadata?: {
    searchTime?: number;
    sources?: string[];
    confidence?: number;
  };
}

export interface AIAgentData {
  agentType: string;
  query: string;
  response: string;
  recommendations?: string[];
  nextSteps?: string[];
  dateGenerated: string;
  metadata?: {
    processingTime?: number;
    confidence?: number;
    sources?: string[];
    model?: string;
  };
}

export interface BatchExportConfig {
  contacts?: ContactData[];
  analytics?: AnalyticsData;
  searchResults?: SearchResultsData;
  aiAgentReport?: AIAgentData;
  options: ExportOptions;
  userName?: string;
  onProgress?: (progress: ExportProgress) => void;
}

export class ProfessionalExportService {
  private whiteLabelConfig: {
    companyName: string;
    logoUrl?: string;
    primaryColor: string;
  };

  constructor(whiteLabelConfig?: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
  }) {
    this.whiteLabelConfig = {
      companyName: whiteLabelConfig?.companyName || 'Audio Intel',
      logoUrl: whiteLabelConfig?.logoUrl,
      primaryColor: whiteLabelConfig?.primaryColor || '#1E88E5',
    };
  }

  /**
   * Enhanced one-click export for contacts with progress tracking
   */
  async exportContacts(
    contacts: ContactData[],
    options: ExportOptions,
    userName?: string,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<{ success: boolean; downloadUrl?: string; message: string; metadata?: any }> {
    try {
      onProgress?.({
        current: 0,
        total: contacts.length,
        percentage: 0,
        stage: 'preparing',
        message: 'Preparing contact export...',
      });

      // Validate and prepare data
      const validContacts = contacts.filter(contact => contact.email && contact.name);
      if (validContacts.length === 0) {
        throw new Error('No valid contacts found for export');
      }

      onProgress?.({
        current: validContacts.length,
        total: validContacts.length,
        percentage: 50,
        stage: 'processing',
        message: `Processing ${validContacts.length} contacts...`,
      });

      let result: { success: boolean; downloadUrl?: string; message: string };

      switch (options.format) {
        case 'csv':
          const csvContent = this.contactsToCsv(validContacts, options);
          result = {
            success: true,
            downloadUrl: this.createDownloadUrl(
              csvContent,
              options.filename || 'audio-intel-contacts.csv',
              'text/csv'
            ),
            message: `Successfully exported ${validContacts.length} contacts to CSV`,
          };
          break;

        case 'excel':
          this.contactsToExcel(validContacts, options.filename || 'audio-intel-contacts.xlsx');
          result = {
            success: true,
            message: `Successfully exported ${validContacts.length} contacts to Excel`,
          };
          break;

        case 'pdf':
          exportContactsToPdf(
            validContacts as any,
            options.filename || 'audio-intel-contacts.pdf',
            options.whiteLabel
          );
          result = {
            success: true,
            message: `Successfully exported ${validContacts.length} contacts to PDF`,
          };
          break;

        default:
          throw new Error('Unsupported export format');
      }

      onProgress?.({
        current: validContacts.length,
        total: validContacts.length,
        percentage: 100,
        stage: 'complete',
        message: 'Export completed successfully',
      });

      // Email delivery if requested
      if (options.emailDelivery && options.recipientEmail) {
        onProgress?.({
          current: validContacts.length,
          total: validContacts.length,
          percentage: 90,
          stage: 'delivering',
          message: 'Sending email delivery...',
        });

        await this.sendExportEmail({
          type: 'contacts',
          recipientEmail: options.recipientEmail,
          userName,
          contactsCount: validContacts.length,
          downloadUrl: result.downloadUrl,
          customMessage: options.customMessage,
          whiteLabel: this.whiteLabelConfig,
        });
      }

      return {
        ...result,
        metadata: {
          exportedCount: validContacts.length,
          format: options.format,
          timestamp: new Date().toISOString(),
          user: userName,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Enhanced analytics export with custom metrics support
   */
  async exportAnalytics(
    analyticsData: AnalyticsData,
    options: ExportOptions,
    userName?: string,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<{ success: boolean; downloadUrl?: string; message: string; metadata?: any }> {
    try {
      onProgress?.({
        current: 0,
        total: 1,
        percentage: 0,
        stage: 'preparing',
        message: 'Preparing analytics export...',
      });

      onProgress?.({
        current: 1,
        total: 1,
        percentage: 50,
        stage: 'processing',
        message: 'Processing analytics data...',
      });

      let result: { success: boolean; downloadUrl?: string; message: string };

      switch (options.format) {
        case 'csv':
          const csvContent = this.analyticsToCsv(analyticsData);
          result = {
            success: true,
            downloadUrl: this.createDownloadUrl(
              csvContent,
              options.filename || 'audio-intel-analytics.csv',
              'text/csv'
            ),
            message: 'Successfully exported analytics to CSV',
          };
          break;

        case 'excel':
          this.analyticsToExcel(analyticsData, options.filename || 'audio-intel-analytics.xlsx');
          result = {
            success: true,
            message: 'Successfully exported analytics to Excel',
          };
          break;

        case 'pdf':
          exportAnalyticsToPdf(
            analyticsData,
            options.filename || 'audio-intel-analytics.pdf',
            options.whiteLabel
          );
          result = {
            success: true,
            message: 'Successfully exported analytics to PDF',
          };
          break;

        default:
          throw new Error('Unsupported export format');
      }

      onProgress?.({
        current: 1,
        total: 1,
        percentage: 100,
        stage: 'complete',
        message: 'Analytics export completed',
      });

      // Email delivery if requested
      if (options.emailDelivery && options.recipientEmail) {
        await this.sendExportEmail({
          type: 'analytics',
          recipientEmail: options.recipientEmail,
          userName,
          analyticsData,
          downloadUrl: result.downloadUrl,
          customMessage: options.customMessage,
          whiteLabel: this.whiteLabelConfig,
        });
      }

      return {
        ...result,
        metadata: {
          totalContacts: analyticsData.totalContacts,
          successRate: analyticsData.successRate,
          format: options.format,
          timestamp: new Date().toISOString(),
          user: userName,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analytics export failed';
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Enhanced search results export with metadata support
   */
  async exportSearchResults(
    searchData: SearchResultsData,
    options: ExportOptions,
    userName?: string,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<{ success: boolean; downloadUrl?: string; message: string; metadata?: any }> {
    try {
      onProgress?.({
        current: 0,
        total: searchData.results.length,
        percentage: 0,
        stage: 'preparing',
        message: 'Preparing search results export...',
      });

      onProgress?.({
        current: searchData.results.length,
        total: searchData.results.length,
        percentage: 50,
        stage: 'processing',
        message: `Processing ${searchData.results.length} search results...`,
      });

      let result: { success: boolean; downloadUrl?: string; message: string };

      switch (options.format) {
        case 'csv':
          const csvContent = this.searchResultsToCsv(searchData);
          result = {
            success: true,
            downloadUrl: this.createDownloadUrl(
              csvContent,
              options.filename || 'audio-intel-search-results.csv',
              'text/csv'
            ),
            message: `Successfully exported ${searchData.results.length} search results to CSV`,
          };
          break;

        case 'excel':
          this.searchResultsToExcel(
            searchData,
            options.filename || 'audio-intel-search-results.xlsx'
          );
          result = {
            success: true,
            message: `Successfully exported ${searchData.results.length} search results to Excel`,
          };
          break;

        case 'pdf':
          exportSearchResultsToPdf(
            searchData.results,
            searchData.query,
            options.filename || 'audio-intel-search-results.pdf',
            options.whiteLabel
          );
          result = {
            success: true,
            message: `Successfully exported ${searchData.results.length} search results to PDF`,
          };
          break;

        default:
          throw new Error('Unsupported export format');
      }

      onProgress?.({
        current: searchData.results.length,
        total: searchData.results.length,
        percentage: 100,
        stage: 'complete',
        message: 'Search results export completed',
      });

      // Email delivery if requested
      if (options.emailDelivery && options.recipientEmail) {
        await this.sendExportEmail({
          type: 'search-results',
          recipientEmail: options.recipientEmail,
          userName,
          downloadUrl: result.downloadUrl,
          customMessage: options.customMessage,
          whiteLabel: this.whiteLabelConfig,
        });
      }

      return {
        ...result,
        metadata: {
          query: searchData.query,
          resultCount: searchData.results.length,
          totalFound: searchData.totalFound,
          format: options.format,
          timestamp: new Date().toISOString(),
          user: userName,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search results export failed';
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Enhanced AI agent report export with metadata
   */
  async exportAIAgentReport(
    agentData: AIAgentData,
    options: ExportOptions,
    userName?: string,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<{ success: boolean; downloadUrl?: string; message: string; metadata?: any }> {
    try {
      onProgress?.({
        current: 0,
        total: 1,
        percentage: 0,
        stage: 'preparing',
        message: 'Preparing AI agent report export...',
      });

      onProgress?.({
        current: 1,
        total: 1,
        percentage: 50,
        stage: 'processing',
        message: 'Processing AI agent report...',
      });

      let result: { success: boolean; downloadUrl?: string; message: string };

      switch (options.format) {
        case 'csv':
          const csvContent = this.aiAgentToCsv(agentData);
          result = {
            success: true,
            downloadUrl: this.createDownloadUrl(
              csvContent,
              options.filename || 'audio-intel-ai-report.csv',
              'text/csv'
            ),
            message: 'Successfully exported AI agent report to CSV',
          };
          break;

        case 'excel':
          this.aiAgentToExcel(agentData, options.filename || 'audio-intel-ai-report.xlsx');
          result = {
            success: true,
            message: 'Successfully exported AI agent report to Excel',
          };
          break;

        case 'pdf':
          exportAIAgentReportToPdf(
            agentData,
            options.filename || 'audio-intel-ai-report.pdf',
            options.whiteLabel
          );
          result = {
            success: true,
            message: 'Successfully exported AI agent report to PDF',
          };
          break;

        default:
          throw new Error('Unsupported export format');
      }

      onProgress?.({
        current: 1,
        total: 1,
        percentage: 100,
        stage: 'complete',
        message: 'AI agent report export completed',
      });

      // Email delivery if requested
      if (options.emailDelivery && options.recipientEmail) {
        await this.sendExportEmail({
          type: 'ai-agent-report',
          recipientEmail: options.recipientEmail,
          userName,
          agentData,
          downloadUrl: result.downloadUrl,
          customMessage: options.customMessage,
          whiteLabel: this.whiteLabelConfig,
        });
      }

      return {
        ...result,
        metadata: {
          agentType: agentData.agentType,
          query: agentData.query,
          recommendationsCount: agentData.recommendations?.length || 0,
          nextStepsCount: agentData.nextSteps?.length || 0,
          format: options.format,
          timestamp: new Date().toISOString(),
          user: userName,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'AI agent report export failed';
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Enhanced batch export with progress tracking and parallel processing
   */
  async batchExport(
    data: {
      contacts?: ContactData[];
      analytics?: AnalyticsData;
      searchResults?: SearchResultsData;
      aiAgentReport?: AIAgentData;
    },
    options: ExportOptions,
    userName?: string,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<{
    success: boolean;
    results: Array<{
      type: string;
      success: boolean;
      message: string;
      downloadUrl?: string;
      metadata?: any;
    }>;
    summary: {
      totalExports: number;
      successfulExports: number;
      failedExports: number;
      totalItems: number;
    };
  }> {
    const results: Array<{
      type: string;
      success: boolean;
      message: string;
      downloadUrl?: string;
      metadata?: any;
    }> = [];
    const exportTasks = [];
    let totalItems = 0;

    // Prepare export tasks
    if (data.contacts && data.contacts.length > 0) {
      totalItems += data.contacts.length;
      exportTasks.push({ type: 'contacts', data: data.contacts });
    }
    if (data.analytics) {
      totalItems += 1;
      exportTasks.push({ type: 'analytics', data: data.analytics });
    }
    if (data.searchResults && data.searchResults.results.length > 0) {
      totalItems += data.searchResults.results.length;
      exportTasks.push({ type: 'search-results', data: data.searchResults });
    }
    if (data.aiAgentReport) {
      totalItems += 1;
      exportTasks.push({ type: 'ai-agent-report', data: data.aiAgentReport });
    }

    if (exportTasks.length === 0) {
      return {
        success: false,
        results: [],
        summary: { totalExports: 0, successfulExports: 0, failedExports: 0, totalItems: 0 },
      };
    }

    onProgress?.({
      current: 0,
      total: exportTasks.length,
      percentage: 0,
      stage: 'preparing',
      message: `Preparing batch export of ${exportTasks.length} data types...`,
    });

    // Process exports with progress tracking
    for (let i = 0; i < exportTasks.length; i++) {
      const task = exportTasks[i];

      onProgress?.({
        current: i + 1,
        total: exportTasks.length,
        percentage: ((i + 1) / exportTasks.length) * 100,
        stage: 'processing',
        message: `Processing ${task.type} export...`,
      });

      try {
        let result;
        switch (task.type) {
          case 'contacts':
            result = await this.exportContacts(task.data as ContactData[], options, userName);
            break;
          case 'analytics':
            result = await this.exportAnalytics(task.data as AnalyticsData, options, userName);
            break;
          case 'search-results':
            result = await this.exportSearchResults(
              task.data as SearchResultsData,
              options,
              userName
            );
            break;
          case 'ai-agent-report':
            result = await this.exportAIAgentReport(task.data as AIAgentData, options, userName);
            break;
          default:
            throw new Error(`Unknown export type: ${task.type}`);
        }

        results.push({
          type: task.type,
          success: result.success,
          message: result.message,
          downloadUrl: result.downloadUrl,
          metadata: result.metadata,
        });
      } catch (error) {
        results.push({
          type: task.type,
          success: false,
          message: error instanceof Error ? error.message : 'Export failed',
          downloadUrl: undefined,
          metadata: undefined,
        });
      }
    }

    const successfulExports = results.filter(r => r.success).length;
    const failedExports = results.filter(r => !r.success).length;

    onProgress?.({
      current: exportTasks.length,
      total: exportTasks.length,
      percentage: 100,
      stage: 'complete',
      message: `Batch export completed: ${successfulExports} successful, ${failedExports} failed`,
    });

    return {
      success: failedExports === 0,
      results,
      summary: {
        totalExports: exportTasks.length,
        successfulExports,
        failedExports,
        totalItems,
      },
    };
  }

  /**
   * Convert analytics data to CSV format
   */
  private analyticsToCsv(analyticsData: AnalyticsData): string {
    const lines = [
      'Metric,Value',
      `Total Contacts,${analyticsData.totalContacts}`,
      `Total Enrichments,${analyticsData.totalEnrichments}`,
      `Success Rate,${analyticsData.successRate.toFixed(1)}%`,
      `Average Confidence,${analyticsData.averageConfidence.toFixed(1)}%`,
      `Average Processing Time,${analyticsData.performanceMetrics.averageProcessingTime.toFixed(2)}s`,
      `Cache Hit Rate,${analyticsData.performanceMetrics.cacheHitRate.toFixed(1)}%`,
      `Error Rate,${analyticsData.performanceMetrics.errorRate.toFixed(1)}%`,
      '',
      'Platform Breakdown',
      'Platform,Count,Percentage',
    ];

    // Add platform breakdown
    analyticsData.topPlatforms.forEach(platform => {
      lines.push(`${platform.platform},${platform.count},${platform.percentage.toFixed(1)}%`);
    });

    lines.push('', 'Daily Enrichments', 'Date,Count');
    analyticsData.dailyEnrichments.forEach(day => {
      lines.push(`${day.date},${day.count}`);
    });

    return lines.join('\r\n');
  }

  /**
   * Enhanced CSV conversion with metadata support
   */
  private contactsToCsv(contacts: ContactData[], options: ExportOptions): string {
    const headers = [
      'Name',
      'Email',
      'Contact Intelligence',
      'Research Confidence',
      'Last Researched',
      'Platform',
      'Role',
      'Company',
    ];

    if (options.includeMetadata) {
      headers.push('Source', 'Tags', 'Notes', 'Priority');
    }

    const rows = contacts.map(contact => {
      const baseRow = [
        getDisplayName(contact),
        contact.email,
        contact.contactIntelligence || '',
        contact.researchConfidence || '',
        contact.lastResearched ? new Date(contact.lastResearched).toLocaleDateString() : '',
        contact.platform || '',
        contact.role || '',
        contact.company || '',
      ];

      if (options.includeMetadata && contact.metadata) {
        baseRow.push(
          contact.metadata.source || '',
          contact.metadata.tags?.join(', ') || '',
          contact.metadata.notes || '',
          contact.metadata.priority || ''
        );
      }

      return baseRow;
    });

    return arrayToCsv([headers, ...rows]);
  }

  /**
   * Enhanced Excel export for contacts with metadata
   */
  private contactsToExcel(contacts: ContactData[], filename: string): void {
    const workbook = new (require('xlsx').Workbook)();

    // Main contacts sheet
    const contactsData = contacts.map(contact => ({
      Name: getDisplayName(contact),
      Email: contact.email,
      'Contact Intelligence': contact.contactIntelligence || '',
      'Research Confidence': contact.researchConfidence || '',
      'Last Researched': contact.lastResearched
        ? new Date(contact.lastResearched).toLocaleDateString()
        : '',
      Platform: contact.platform || '',
      Role: contact.role || '',
      Company: contact.company || '',
      Source: contact.metadata?.source || '',
      Tags: contact.metadata?.tags?.join(', ') || '',
      Notes: contact.metadata?.notes || '',
      Priority: contact.metadata?.priority || '',
    }));

    const contactsSheet = require('xlsx').utils.json_to_sheet(contactsData);
    workbook.SheetNames.push('Contacts');
    workbook.Sheets['Contacts'] = contactsSheet;

    // Platform summary sheet
    const platformSummary = this.getContactPlatformSummary(contacts);
    const platformSheet = require('xlsx').utils.json_to_sheet(platformSummary);
    workbook.SheetNames.push('Platform Summary');
    workbook.Sheets['Platform Summary'] = platformSheet;

    // Export summary sheet
    const exportSummary = [
      { Metric: 'Total Contacts', Value: contacts.length },
      { Metric: 'Export Date', Value: new Date().toLocaleDateString() },
      { Metric: 'Export Time', Value: new Date().toLocaleTimeString() },
      {
        Metric: 'High Priority',
        Value: contacts.filter(c => c.metadata?.priority === 'high').length,
      },
      {
        Metric: 'Medium Priority',
        Value: contacts.filter(c => c.metadata?.priority === 'medium').length,
      },
      {
        Metric: 'Low Priority',
        Value: contacts.filter(c => c.metadata?.priority === 'low').length,
      },
    ];

    const summarySheet = require('xlsx').utils.json_to_sheet(exportSummary);
    workbook.SheetNames.push('Export Summary');
    workbook.Sheets['Export Summary'] = summarySheet;

    require('xlsx').writeFile(workbook, filename);
  }

  /**
   * Convert search results to CSV format with metadata
   */
  private searchResultsToCsv(searchData: SearchResultsData): string {
    const headers = [
      'Platform',
      'Title',
      'Description',
      'URL',
      'Contact',
      'Relevance',
      'Last Updated',
      'Tags',
      'Priority',
      'Notes',
    ];

    const rows = searchData.results.map(result => [
      result.platform,
      result.title,
      result.description,
      result.url,
      result.contact || '',
      result.relevance,
      result.lastUpdated,
      result.metadata?.tags?.join(', ') || '',
      result.metadata?.priority?.toString() || '',
      result.metadata?.notes || '',
    ]);

    return arrayToCsv([headers, ...rows]);
  }

  /**
   * Convert AI agent data to CSV format
   */
  private aiAgentToCsv(agentData: AIAgentData): string {
    const lines = [
      'Agent Type,Value',
      `Agent Type,${agentData.agentType}`,
      `Query,${agentData.query}`,
      `Response,${agentData.response}`,
      `Date Generated,${agentData.dateGenerated}`,
      `Processing Time,${agentData.metadata?.processingTime || 'N/A'}s`,
      `Confidence,${agentData.metadata?.confidence || 'N/A'}%`,
      `Model,${agentData.metadata?.model || 'N/A'}`,
      '',
      'Recommendations',
      'Recommendation',
    ];

    if (agentData.recommendations) {
      agentData.recommendations.forEach(rec => lines.push(rec));
    }

    lines.push('', 'Next Steps', 'Step');
    if (agentData.nextSteps) {
      agentData.nextSteps.forEach(step => lines.push(step));
    }

    return lines.join('\r\n');
  }

  /**
   * Enhanced Excel export for analytics with charts
   */
  private analyticsToExcel(analyticsData: AnalyticsData, filename: string): void {
    const workbook = new (require('xlsx').Workbook)();

    // Main metrics sheet
    const metricsData = [
      { Metric: 'Total Contacts', Value: analyticsData.totalContacts },
      { Metric: 'Total Enrichments', Value: analyticsData.totalEnrichments },
      { Metric: 'Success Rate', Value: `${analyticsData.successRate.toFixed(1)}%` },
      { Metric: 'Average Confidence', Value: `${analyticsData.averageConfidence.toFixed(1)}%` },
      {
        Metric: 'Average Processing Time',
        Value: `${analyticsData.performanceMetrics.averageProcessingTime.toFixed(2)}s`,
      },
      {
        Metric: 'Cache Hit Rate',
        Value: `${analyticsData.performanceMetrics.cacheHitRate.toFixed(1)}%`,
      },
      { Metric: 'Error Rate', Value: `${analyticsData.performanceMetrics.errorRate.toFixed(1)}%` },
    ];

    const metricsSheet = require('xlsx').utils.json_to_sheet(metricsData);
    workbook.SheetNames.push('Performance Metrics');
    workbook.Sheets['Performance Metrics'] = metricsSheet;

    // Platform breakdown sheet
    const platformData = analyticsData.topPlatforms.map(p => ({
      Platform: p.platform,
      Count: p.count,
      Percentage: `${p.percentage.toFixed(1)}%`,
    }));

    const platformSheet = require('xlsx').utils.json_to_sheet(platformData);
    workbook.SheetNames.push('Platform Breakdown');
    workbook.Sheets['Platform Breakdown'] = platformSheet;

    // Daily activity sheet
    const dailyData = analyticsData.dailyEnrichments.map(d => ({
      Date: d.date,
      Enrichments: d.count,
    }));

    const dailySheet = require('xlsx').utils.json_to_sheet(dailyData);
    workbook.SheetNames.push('Daily Activity');
    workbook.Sheets['Daily Activity'] = dailySheet;

    require('xlsx').writeFile(workbook, filename);
  }

  /**
   * Enhanced Excel export for search results
   */
  private searchResultsToExcel(searchData: SearchResultsData, filename: string): void {
    const workbook = new (require('xlsx').Workbook)();

    // Main results sheet
    const resultsData = searchData.results.map(result => ({
      Platform: result.platform,
      Title: result.title,
      Description: result.description,
      URL: result.url,
      Contact: result.contact || '',
      Relevance: result.relevance,
      'Last Updated': result.lastUpdated,
      Tags: result.metadata?.tags?.join(', ') || '',
      Priority: result.metadata?.priority || '',
      Notes: result.metadata?.notes || '',
    }));

    const resultsSheet = require('xlsx').utils.json_to_sheet(resultsData);
    workbook.SheetNames.push('Search Results');
    workbook.Sheets['Search Results'] = resultsSheet;

    // Search summary sheet
    const summaryData = [
      { Metric: 'Search Query', Value: searchData.query },
      { Metric: 'Total Results', Value: searchData.results.length },
      { Metric: 'Total Found', Value: searchData.totalFound },
      { Metric: 'Search Time', Value: `${searchData.searchMetadata?.searchTime || 'N/A'}s` },
      { Metric: 'Confidence', Value: `${searchData.searchMetadata?.confidence || 'N/A'}%` },
    ];

    const summarySheet = require('xlsx').utils.json_to_sheet(summaryData);
    workbook.SheetNames.push('Search Summary');
    workbook.Sheets['Search Summary'] = summarySheet;

    // Platform summary
    const platformSummary = this.getSearchResultsPlatformSummary(searchData.results);
    const platformSheet = require('xlsx').utils.json_to_sheet(platformSummary);
    workbook.SheetNames.push('Platform Summary');
    workbook.Sheets['Platform Summary'] = platformSheet;

    require('xlsx').writeFile(workbook, filename);
  }

  /**
   * Enhanced Excel export for AI agent reports
   */
  private aiAgentToExcel(agentData: AIAgentData, filename: string): void {
    const workbook = new (require('xlsx').Workbook)();

    // Main report sheet
    const reportData = [
      { Field: 'Agent Type', Value: agentData.agentType },
      { Field: 'Query', Value: agentData.query },
      { Field: 'Response', Value: agentData.response },
      { Field: 'Date Generated', Value: agentData.dateGenerated },
      { Field: 'Processing Time', Value: `${agentData.metadata?.processingTime || 'N/A'}s` },
      { Field: 'Confidence', Value: `${agentData.metadata?.confidence || 'N/A'}%` },
      { Field: 'Model', Value: agentData.metadata?.model || 'N/A' },
    ];

    const reportSheet = require('xlsx').utils.json_to_sheet(reportData);
    workbook.SheetNames.push('AI Agent Report');
    workbook.Sheets['AI Agent Report'] = reportSheet;

    // Recommendations sheet
    if (agentData.recommendations && agentData.recommendations.length > 0) {
      const recommendationsData = agentData.recommendations.map((rec, index) => ({
        Number: index + 1,
        Recommendation: rec,
      }));

      const recommendationsSheet = require('xlsx').utils.json_to_sheet(recommendationsData);
      workbook.SheetNames.push('Recommendations');
      workbook.Sheets['Recommendations'] = recommendationsSheet;
    }

    // Next steps sheet
    if (agentData.nextSteps && agentData.nextSteps.length > 0) {
      const nextStepsData = agentData.nextSteps.map((step, index) => ({
        Number: index + 1,
        'Next Step': step,
      }));

      const nextStepsSheet = require('xlsx').utils.json_to_sheet(nextStepsData);
      workbook.SheetNames.push('Next Steps');
      workbook.Sheets['Next Steps'] = nextStepsSheet;
    }

    require('xlsx').writeFile(workbook, filename);
  }

  /**
   * Get platform summary for contacts
   */
  private getContactPlatformSummary(contacts: ContactData[]) {
    const platformCounts: Record<string, number> = {};

    contacts.forEach(contact => {
      if (contact.platform) {
        platformCounts[contact.platform] = (platformCounts[contact.platform] || 0) + 1;
      }
    });

    return Object.entries(platformCounts).map(([platform, count]) => ({
      Platform: platform,
      Count: count,
      Percentage: `${((count / contacts.length) * 100).toFixed(1)}%`,
    }));
  }

  /**
   * Get platform summary for search results
   */
  private getSearchResultsPlatformSummary(results: SearchResultsData['results']) {
    const platformCounts: Record<string, number> = {};

    results.forEach(result => {
      platformCounts[result.platform] = (platformCounts[result.platform] || 0) + 1;
    });

    return Object.entries(platformCounts).map(([platform, count]) => ({
      Platform: platform,
      Count: count,
      Percentage: `${((count / results.length) * 100).toFixed(1)}%`,
    }));
  }

  /**
   * Create download URL for file
   */
  private createDownloadUrl(content: string, filename: string, mimeType: string): string {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    // Create temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    return url;
  }

  /**
   * Send export email with professional templates
   */
  private async sendExportEmail(data: {
    type: 'contacts' | 'analytics' | 'search-results' | 'ai-agent-report';
    recipientEmail: string;
    userName?: string;
    contactsCount?: number;
    analyticsData?: AnalyticsData;
    agentData?: AIAgentData;
    downloadUrl?: string;
    customMessage?: string;
    whiteLabel: any;
  }): Promise<void> {
    try {
      let emailContent: string;
      let subject: string;

      switch (data.type) {
        case 'contacts':
          emailContent = generateContactExportEmail({
            userName: data.userName,
            contactsCount: data.contactsCount || 0,
            downloadUrl: data.downloadUrl,
            customMessage: data.customMessage,
            whiteLabel: data.whiteLabel,
          });
          subject = `${data.whiteLabel.companyName || 'Audio Intel'} - Contact Export (${data.contactsCount} contacts)`;
          break;

        case 'analytics':
          emailContent = generateAnalyticsExportEmail({
            userName: data.userName,
            analyticsData: data.analyticsData!,
            downloadUrl: data.downloadUrl,
            customMessage: data.customMessage,
            whiteLabel: data.whiteLabel,
          });
          subject = `${data.whiteLabel.companyName || 'Audio Intel'} - Analytics Report`;
          break;

        case 'search-results':
          emailContent = generateSearchResultsEmail({
            userName: data.userName,
            downloadUrl: data.downloadUrl,
            customMessage: data.customMessage,
            whiteLabel: data.whiteLabel,
          });
          subject = `${data.whiteLabel.companyName || 'Audio Intel'} - Search Results Export`;
          break;

        case 'ai-agent-report':
          emailContent = generateAIAgentReportEmail({
            userName: data.userName,
            agentData: data.agentData!,
            downloadUrl: data.downloadUrl,
            customMessage: data.customMessage,
            whiteLabel: data.whiteLabel,
          });
          subject = `${data.whiteLabel.companyName || 'Audio Intel'} - AI Agent Report`;
          break;

        default:
          throw new Error('Unknown export type');
      }

      // In a real implementation, you would send the email here
      // For now, we'll just log it
      console.log('Email would be sent:', {
        to: data.recipientEmail,
        subject,
        content: emailContent,
      });
    } catch (error) {
      console.error('Failed to send export email:', error);
      throw error;
    }
  }
}

/**
 * Factory function to create export service instance
 */
export const createExportService = (whiteLabelConfig?: {
  companyName?: string;
  logoUrl?: string;
  primaryColor?: string;
}) => new ProfessionalExportService(whiteLabelConfig);

export const exportService = new ProfessionalExportService();
