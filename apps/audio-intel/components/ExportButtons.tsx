'use client';

import React, { useState } from 'react';
import {
  Download,
  Mail,
  FileText,
  BarChart3,
  Users,
  Search,
  Settings,
  CheckCircle,
  AlertCircle,
  Zap,
  Brain,
  Activity,
} from 'lucide-react';
import {
  ProfessionalExportService,
  ExportOptions,
  ContactData,
  AnalyticsData,
  SearchResultsData,
  AIAgentData,
  ExportProgress,
} from '../utils/exportService';
import { trackExport, trackFunnelProgression } from '../utils/analytics';

interface ExportButtonsProps {
  contacts?: ContactData[];
  analytics?: AnalyticsData;
  searchResults?: SearchResultsData;
  aiAgentReport?: AIAgentData;
  userName?: string;
  whiteLabel?: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
  };
  userTier?: 'free' | 'professional' | 'agency';
  onExportComplete?: (result: { success: boolean; message: string; metadata?: any }) => void;
  onProgress?: (progress: ExportProgress) => void;
}

export default function ExportButtons({
  contacts,
  analytics,
  searchResults,
  aiAgentReport,
  userName,
  whiteLabel,
  userTier = 'free',
  onExportComplete,
  onProgress,
}: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('excel');
  const [emailDelivery, setEmailDelivery] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [lastExportResult, setLastExportResult] = useState<{
    success: boolean;
    message: string;
    metadata?: any;
  } | null>(null);
  const [customFilename, setCustomFilename] = useState('');
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [whiteLabelConfig, setWhiteLabelConfig] = useState({
    companyName: whiteLabel?.companyName || '',
    logoUrl: whiteLabel?.logoUrl || '',
    primaryColor: whiteLabel?.primaryColor || '#1E88E5',
  });

  const exportService = new ProfessionalExportService(whiteLabelConfig);

  const handleExport = async (
    type: 'contacts' | 'analytics' | 'search-results' | 'ai-agent-report' | 'batch'
  ) => {
    setIsExporting(true);
    setLastExportResult(null);
    setExportProgress(null);

    try {
      const options: ExportOptions = {
        format: exportFormat,
        emailDelivery,
        recipientEmail: emailDelivery ? recipientEmail : undefined,
        customMessage: customMessage || undefined,
        whiteLabel: whiteLabelConfig,
        filename: customFilename || undefined,
        includeMetadata: true,
        compression: false,
      };

      const progressHandler = (progress: ExportProgress) => {
        setExportProgress(progress);
        onProgress?.(progress);
      };

      let result;

      switch (type) {
        case 'contacts':
          if (!contacts || contacts.length === 0) {
            throw new Error('No contacts available for export');
          }
          result = await exportService.exportContacts(contacts, options, userName, progressHandler);
          break;

        case 'analytics':
          if (!analytics) {
            throw new Error('No analytics data available for export');
          }
          result = await exportService.exportAnalytics(
            analytics,
            options,
            userName,
            progressHandler
          );
          break;

        case 'search-results':
          if (!searchResults || searchResults.results.length === 0) {
            throw new Error('No search results available for export');
          }
          result = await exportService.exportSearchResults(
            searchResults,
            options,
            userName,
            progressHandler
          );
          break;

        case 'ai-agent-report':
          if (!aiAgentReport) {
            throw new Error('No AI agent report available for export');
          }
          result = await exportService.exportAIAgentReport(
            aiAgentReport,
            options,
            userName,
            progressHandler
          );
          break;

        case 'batch':
          const data: any = {};
          if (contacts) data.contacts = contacts;
          if (analytics) data.analytics = analytics;
          if (searchResults) data.searchResults = searchResults;
          if (aiAgentReport) data.aiAgentReport = aiAgentReport;

          if (Object.keys(data).length === 0) {
            throw new Error('No data available for batch export');
          }

          const batchResult = await exportService.batchExport(
            data,
            options,
            userName,
            progressHandler
          );
          result = {
            success: batchResult.success,
            message: batchResult.success
              ? `Successfully exported ${batchResult.summary.successfulExports} data types`
              : `Batch export completed with ${batchResult.summary.failedExports} errors`,
            metadata: batchResult.summary,
          };
          break;

        default:
          throw new Error('Invalid export type');
      }

      setLastExportResult(result);

      // Track export analytics
      if (result.success) {
        const contactCount = contacts?.length || 0;
        const fields = ['name', 'email', 'contactIntelligence']; // Default fields for tracking
        trackExport(exportFormat, contactCount, fields);
        trackFunnelProgression('EXPORT', { format: exportFormat, contactCount, type });
      }

      onExportComplete?.(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      const result = { success: false, message: errorMessage };
      setLastExportResult(result);
      onExportComplete?.(result);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const getDataCount = () => {
    let count = 0;
    if (contacts) count += contacts.length;
    if (analytics) count += 1;
    if (searchResults) count += searchResults.results.length;
    if (aiAgentReport) count += 1;
    return count;
  };

  const hasData = getDataCount() > 0;

  const getDataTypes = () => {
    const types = [];
    if (contacts && contacts.length > 0) types.push('Contacts');
    if (analytics) types.push('Analytics');
    if (searchResults && searchResults.results.length > 0) types.push('Search Results');
    if (aiAgentReport) types.push('AI Agent Report');
    return types;
  };

  const getProgressColor = (stage: string) => {
    switch (stage) {
      case 'preparing':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'formatting':
        return 'text-blue-600';
      case 'delivering':
        return 'text-green-600';
      case 'complete':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            Professional Export System
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Export your data in multiple formats with optional email delivery
          </p>
          {getDataTypes().length > 0 && (
            <p className="text-xs text-gray-500 mt-1">Available: {getDataTypes().join(', ')}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{getDataCount()}</div>
          <div className="text-xs text-gray-500">Items Available</div>
        </div>
      </div>

      {/* Export Progress */}
      {exportProgress && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-3 mb-2">
            <Activity className={`w-4 h-4 ${getProgressColor(exportProgress.stage)}`} />
            <span className={`text-sm font-medium ${getProgressColor(exportProgress.stage)}`}>
              {exportProgress.stage.charAt(0).toUpperCase() + exportProgress.stage.slice(1)}
            </span>
            <span className="text-sm text-gray-600">
              {exportProgress.current} / {exportProgress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress.percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{exportProgress.message}</p>
        </div>
      )}

      {/* Export Status */}
      {lastExportResult && !exportProgress && (
        <div
          className={`mb-4 p-3 rounded-md flex items-center gap-2 ${
            lastExportResult.success
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {lastExportResult.success ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">{lastExportResult.message}</span>
        </div>
      )}

      {/* Format Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Export Format
          {userTier === 'free' && (
            <span className="text-xs text-gray-500 ml-2">(CSV only for Free tier)</span>
          )}
        </label>
        <div className="flex gap-2">
          {[
            {
              value: 'csv',
              label: 'CSV',
              icon: FileText,
              description: 'Simple data export',
              available: true,
            },
            {
              value: 'excel',
              label: 'Excel',
              icon: BarChart3,
              description: 'Multi-sheet reports',
              available: userTier !== 'free',
            },
            {
              value: 'pdf',
              label: 'PDF',
              icon: FileText,
              description: 'Professional reports',
              available: userTier !== 'free',
            },
          ].map(format => (
            <button
              key={format.value}
              onClick={() => format.available && setExportFormat(format.value as any)}
              disabled={!format.available}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                !format.available
                  ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                  : exportFormat === format.value
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <format.icon className="w-4 h-4" />
              <span>{format.label}</span>
              <span className="text-xs opacity-75">{format.description}</span>
              {!format.available && <span className="text-xs text-red-500">Upgrade required</span>}
            </button>
          ))}
        </div>
      </div>

      {/* White Label Options - Agency Tier Only */}
      {userTier === 'agency' && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            White Label Options (Agency Tier)
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-blue-700 mb-1">Company Name</label>
              <input
                type="text"
                value={whiteLabelConfig.companyName}
                onChange={e =>
                  setWhiteLabelConfig({ ...whiteLabelConfig, companyName: e.target.value })
                }
                placeholder="Your company name"
                className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-700 mb-1">Logo URL</label>
              <input
                type="url"
                value={whiteLabelConfig.logoUrl}
                onChange={e =>
                  setWhiteLabelConfig({ ...whiteLabelConfig, logoUrl: e.target.value })
                }
                placeholder="https://your-logo.png"
                className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-700 mb-1">Primary Color</label>
              <input
                type="color"
                value={whiteLabelConfig.primaryColor}
                onChange={e =>
                  setWhiteLabelConfig({ ...whiteLabelConfig, primaryColor: e.target.value })
                }
                className="w-full h-8 border border-blue-300 rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Email Delivery Toggle */}
      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={emailDelivery}
            onChange={e => setEmailDelivery(e.target.checked)}
            disabled={userTier === 'free'}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
          />
          <Mail className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Email delivery with professional templates
            {userTier === 'free' && (
              <span className="text-xs text-red-500 ml-2">(Professional+ required)</span>
            )}
          </span>
        </label>
      </div>

      {/* Email Configuration */}
      {emailDelivery && (
        <div className="mb-4 space-y-3 p-4 bg-gray-50 rounded-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={e => setRecipientEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Message (Optional)
            </label>
            <textarea
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              placeholder="Add a personal message to your export email..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Advanced Options Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Advanced Options
        </button>
      </div>

      {/* Advanced Options */}
      {showAdvancedOptions && (
        <div className="mb-4 p-4 bg-gray-50 rounded-md space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Filename</label>
            <input
              type="text"
              value={customFilename}
              onChange={e => setCustomFilename(e.target.value)}
              placeholder="Leave empty for auto-generated names"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              White Label Configuration
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Company Name"
                value={whiteLabelConfig.companyName}
                onChange={e =>
                  setWhiteLabelConfig(prev => ({ ...prev, companyName: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Logo URL"
                value={whiteLabelConfig.logoUrl}
                onChange={e => setWhiteLabelConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="color"
                value={whiteLabelConfig.primaryColor}
                onChange={e =>
                  setWhiteLabelConfig(prev => ({ ...prev, primaryColor: e.target.value }))
                }
                className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Individual Export Buttons */}
        {contacts && contacts.length > 0 && (
          <button
            onClick={() => handleExport('contacts')}
            disabled={isExporting || !hasData}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Users className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-blue-900">Export Contacts</span>
            <span className="text-xs text-blue-700">{contacts.length} contacts</span>
          </button>
        )}

        {analytics && (
          <button
            onClick={() => handleExport('analytics')}
            disabled={isExporting || !hasData}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg hover:from-green-100 hover:to-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BarChart3 className="w-6 h-6 text-green-600" />
            <span className="font-medium text-green-900">Export Analytics</span>
            <span className="text-xs text-green-700">Performance report</span>
          </button>
        )}

        {searchResults && searchResults.results.length > 0 && (
          <button
            onClick={() => handleExport('search-results')}
            disabled={isExporting || !hasData}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-blue-900">Export Search Results</span>
            <span className="text-xs text-blue-700">{searchResults.results.length} results</span>
          </button>
        )}

        {aiAgentReport && (
          <button
            onClick={() => handleExport('ai-agent-report')}
            disabled={isExporting || !hasData}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Brain className="w-6 h-6 text-orange-600" />
            <span className="font-medium text-orange-900">Export AI Report</span>
            <span className="text-xs text-orange-700">Strategic analysis</span>
          </button>
        )}

        {/* Batch Export Button */}
        {hasData && (
          <button
            onClick={() => handleExport('batch')}
            disabled={isExporting}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-blue-900">Batch Export All</span>
            <span className="text-xs text-blue-700">{getDataCount()} items</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {isExporting && !exportProgress && (
        <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Processing export...</span>
        </div>
      )}

      {/* No Data State */}
      {!hasData && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md text-center">
          <p className="text-gray-600 text-sm">
            No data available for export. Please load contacts, analytics, search results, or AI
            agent reports first.
          </p>
        </div>
      )}

      {/* Export Features */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Export Features:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            One-click export for all data types
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            Professional email templates
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            CSV, Excel, and PDF formats
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            White-label branding support
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            Automated email delivery
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            Agency-ready reporting
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            AI agent strategic reports
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            Multi-platform search exports
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            Real-time progress tracking
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            Enhanced metadata support
          </div>
        </div>
      </div>
    </div>
  );
}
