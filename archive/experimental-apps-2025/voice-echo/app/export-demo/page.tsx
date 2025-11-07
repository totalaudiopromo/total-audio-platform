'use client';

import React, { useState } from 'react';
import ExportButtons from '../../components/ExportButtons';
import {
  ContactData,
  AnalyticsData,
  SearchResultsData,
  AIAgentData,
  ExportProgress,
} from '../../utils/exportService';
import {
  Activity,
  CheckCircle,
  AlertCircle,
  Zap,
  Users,
  BarChart3,
  Search,
  Brain,
  Mail,
  Settings,
} from 'lucide-react';

export default function ExportDemoPage() {
  const [userName, setUserName] = useState('John Doe');
  const [whiteLabelConfig, setWhiteLabelConfig] = useState({
    companyName: 'Audio Intel',
    primaryColor: '#1E88E5',
  });
  const [exportHistory, setExportHistory] = useState<
    Array<{
      type: string;
      success: boolean;
      message: string;
      timestamp: string;
      metadata?: any;
    }>
  >([]);
  const [currentProgress, setCurrentProgress] = useState<ExportProgress | null>(null);

  // Enhanced sample data with metadata
  const sampleContacts: ContactData[] = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@bbc.co.uk',
      contactIntelligence:
        'BBC Radio 1 DJ, specializes in indie and alternative music. Best contact time: Tuesday-Thursday 10am-2pm. Prefers personalized pitches with streaming links.',
      researchConfidence: '95%',
      lastResearched: '2024-01-15',
      platform: 'BBC Radio 1',
      role: 'DJ',
      company: 'BBC',
      metadata: {
        source: 'BBC Directory',
        tags: ['radio', 'indie', 'alternative'],
        notes: 'Responds well to emerging artists',
        priority: 'high' as const,
      },
    },
    {
      name: 'Mike Chen',
      email: 'mike.chen@spotify.com',
      contactIntelligence:
        'Spotify playlist curator for "Indie Discoveries" and "New Music Friday". Loves discovering emerging artists. Submit through Spotify for Artists portal.',
      researchConfidence: '92%',
      lastResearched: '2024-01-14',
      platform: 'Spotify',
      role: 'Playlist Curator',
      company: 'Spotify',
      metadata: {
        source: 'Spotify for Artists',
        tags: ['playlist', 'discovery', 'emerging'],
        notes: 'Prefers high-quality audio files',
        priority: 'high' as const,
      },
    },
    {
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@kexp.org',
      contactIntelligence:
        'KEXP radio host and music blogger. Passionate about supporting independent artists. Responds well to artists with compelling stories.',
      researchConfidence: '88%',
      lastResearched: '2024-01-13',
      platform: 'KEXP',
      role: 'Radio Host',
      company: 'KEXP',
      metadata: {
        source: 'KEXP Directory',
        tags: ['radio', 'independent', 'blog'],
        notes: 'Loves artist stories and background',
        priority: 'medium' as const,
      },
    },
  ];

  const sampleAnalytics: AnalyticsData = {
    totalContacts: 1250,
    totalEnrichments: 1180,
    successRate: 94.4,
    averageConfidence: 87.2,
    platformBreakdown: {
      Spotify: 450,
      'BBC Radio': 320,
      KEXP: 280,
      Other: 200,
    },
    dailyEnrichments: [
      { date: '2024-01-10', count: 45 },
      { date: '2024-01-11', count: 52 },
      { date: '2024-01-12', count: 38 },
      { date: '2024-01-13', count: 61 },
      { date: '2024-01-14', count: 48 },
      { date: '2024-01-15', count: 55 },
    ],
    topPlatforms: [
      { platform: 'Spotify', count: 450, percentage: 36.0 },
      { platform: 'BBC Radio', count: 320, percentage: 25.6 },
      { platform: 'KEXP', count: 280, percentage: 22.4 },
      { platform: 'Other', count: 200, percentage: 16.0 },
    ],
    performanceMetrics: {
      averageProcessingTime: 2.3,
      cacheHitRate: 78.5,
      errorRate: 1.2,
    },
    customMetrics: {
      'High Priority Contacts': 320,
      'Medium Priority Contacts': 580,
      'Low Priority Contacts': 350,
      'Average Response Rate': 12.5,
    },
  };

  const sampleSearchResults: SearchResultsData = {
    query: 'indie rock playlist curators',
    results: [
      {
        platform: 'Spotify',
        title: 'Indie Rock Discoveries Playlist',
        description:
          'Curated playlist featuring the best indie rock discoveries. Updated weekly with fresh tracks from emerging artists.',
        url: 'https://open.spotify.com/playlist/example',
        contact: 'curator@spotify.com',
        relevance: 'High',
        lastUpdated: '2024-01-15',
        metadata: {
          tags: ['indie rock', 'discovery', 'weekly'],
          priority: 9,
          notes: 'Very active curator, responds quickly',
        },
      },
      {
        platform: 'Apple Music',
        title: 'Alternative Rock Essentials',
        description:
          'Essential alternative and indie rock tracks. Perfect for discovering new artists in the genre.',
        url: 'https://music.apple.com/playlist/example',
        contact: 'alt.rock@apple.com',
        relevance: 'Medium',
        lastUpdated: '2024-01-14',
        metadata: {
          tags: ['alternative', 'essentials', 'curated'],
          priority: 7,
          notes: 'Prefers established artists',
        },
      },
      {
        platform: 'YouTube Music',
        title: 'Indie Rock Mix',
        description:
          'Dynamic mix of indie rock tracks. Great for background listening and discovering new music.',
        url: 'https://music.youtube.com/playlist/example',
        contact: 'indie.mix@youtube.com',
        relevance: 'Medium',
        lastUpdated: '2024-01-13',
        metadata: {
          tags: ['mix', 'background', 'dynamic'],
          priority: 6,
          notes: 'Algorithm-driven playlist',
        },
      },
    ],
    totalFound: 3,
    filters: {
      platform: 'spotify',
      genre: 'indie rock',
      role: 'curator',
    },
    searchMetadata: {
      searchTime: 2.1,
      sources: ['Spotify API', 'Apple Music API', 'YouTube Data API'],
      confidence: 85.5,
    },
  };

  const sampleAIAgentReport: AIAgentData = {
    agentType: 'music-industry-strategist',
    query: 'How should I approach playlist curators for indie rock promotion?',
    response:
      "Based on your query about indie rock promotion, here's a strategic approach for playlist curators. The indie rock scene is highly competitive, so you need to stand out with authentic storytelling and high-quality production. Focus on curators who specifically work with emerging artists and have a track record of supporting independent musicians.",
    recommendations: [
      "Research each curator's specific taste and submission preferences",
      'Create personalized pitches that reference their recent playlist additions',
      'Ensure your audio quality meets professional standards',
      'Include compelling artist bio and story elements',
      'Follow up respectfully after 2-3 weeks if no response',
    ],
    nextSteps: [
      'Compile a list of 20-30 relevant playlist curators',
      'Create personalized pitch templates for each curator type',
      'Prepare high-quality audio files and press materials',
      'Set up tracking system for submission responses',
      'Plan follow-up strategy for non-responders',
    ],
    dateGenerated: '2024-01-15T10:30:00Z',
    metadata: {
      processingTime: 3.2,
      confidence: 92.5,
      sources: ['Playlist curator database', 'Industry reports', 'Success case studies'],
      model: 'Claude-3.5-Sonnet',
    },
  };

  const handleExportComplete = (result: { success: boolean; message: string; metadata?: any }) => {
    console.log('Export completed:', result);
    setExportHistory(prev => [
      {
        type: 'Export',
        success: result.success,
        message: result.message,
        timestamp: new Date().toLocaleString(),
        metadata: result.metadata,
      },
      ...prev.slice(0, 9),
    ]); // Keep last 10 exports
  };

  const handleProgress = (progress: ExportProgress) => {
    setCurrentProgress(progress);
  };

  const getProgressColor = (stage: string) => {
    switch (stage) {
      case 'preparing':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'formatting':
        return 'text-purple-600';
      case 'delivering':
        return 'text-green-600';
      case 'complete':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Enhanced Export System Demo</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the complete export system with real-time progress tracking, enhanced
            metadata support, and professional email delivery for agencies.
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User Name</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter user name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name (White Label)
              </label>
              <input
                type="text"
                value={whiteLabelConfig.companyName}
                onChange={e =>
                  setWhiteLabelConfig(prev => ({ ...prev, companyName: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter company name"
              />
            </div>
          </div>
        </div>

        {/* Data Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sample Contacts</p>
                <p className="text-2xl font-bold text-blue-600">{sampleContacts.length}</p>
                <p className="text-xs text-gray-500">With metadata</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Analytics Data</p>
                <p className="text-2xl font-bold text-green-600">
                  {sampleAnalytics.totalContacts.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Enhanced metrics</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Search Results</p>
                <p className="text-2xl font-bold text-purple-600">
                  {sampleSearchResults.results.length}
                </p>
                <p className="text-xs text-gray-500">With metadata</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Agent Report</p>
                <p className="text-2xl font-bold text-orange-600">1</p>
                <p className="text-xs text-gray-500">Strategic analysis</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Current Progress */}
        {currentProgress && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Export Progress
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${getProgressColor(currentProgress.stage)}`}>
                  {currentProgress.stage.charAt(0).toUpperCase() + currentProgress.stage.slice(1)}
                </span>
                <span className="text-sm text-gray-600">
                  {currentProgress.current} / {currentProgress.total} (
                  {currentProgress.percentage.toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${currentProgress.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{currentProgress.message}</p>
            </div>
          </div>
        )}

        {/* Export System */}
        <ExportButtons
          contacts={sampleContacts}
          analytics={sampleAnalytics}
          searchResults={sampleSearchResults}
          aiAgentReport={sampleAIAgentReport}
          userName={userName}
          whiteLabel={whiteLabelConfig}
          onExportComplete={handleExportComplete}
          onProgress={handleProgress}
        />

        {/* Export History */}
        {exportHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Export History</h2>
            <div className="space-y-3">
              {exportHistory.map((export_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    {export_.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{export_.type}</p>
                      <p className="text-xs text-gray-600">{export_.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{export_.timestamp}</p>
                    {export_.metadata && (
                      <p className="text-xs text-blue-600">
                        {export_.metadata.exportedCount || export_.metadata.totalExports} items
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Features Overview */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Enhanced Export Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                Real-Time Progress
              </h3>
              <p className="text-sm text-gray-600">
                Live progress tracking with detailed stage information and percentage completion.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                Enhanced Metadata
              </h3>
              <p className="text-sm text-gray-600">
                Rich metadata support including tags, priorities, notes, and source information.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                Multi-Format Export
              </h3>
              <p className="text-sm text-gray-600">
                Export in CSV, Excel, or PDF formats with professional formatting and branding.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-600" />
                Email Delivery
              </h3>
              <p className="text-sm text-gray-600">
                Automated email delivery with professional templates and customizable messaging.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-600" />
                White Label Support
              </h3>
              <p className="text-sm text-gray-600">
                Customize branding, colors, and company information for agency use.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Brain className="w-4 h-4 text-red-600" />
                AI Agent Reports
              </h3>
              <p className="text-sm text-gray-600">
                Export strategic AI agent reports with recommendations and next steps.
              </p>
            </div>
          </div>
        </div>

        {/* Sample Data Preview */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Data Preview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampleContacts.map((contact, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.platform}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          contact.metadata?.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : contact.metadata?.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {contact.metadata?.priority || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.metadata?.tags?.join(', ') || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
