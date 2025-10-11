'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, RefreshCw, Calendar, Filter, TrendingUp, BarChart3 } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'business' | 'technical' | 'user' | 'financial';
  lastGenerated: string;
  status: 'ready' | 'generating' | 'error';
  downloadUrl?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Mock reports data - in production this would come from an API
      const mockReports: Report[] = [
        {
          id: 'business-monthly',
          title: 'Monthly Business Report',
          description: 'Comprehensive business metrics, KPIs, and growth analysis for Audio Intel',
          type: 'business',
          lastGenerated: '2025-08-29T15:30:00Z',
          status: 'ready'
        },
        {
          id: 'user-activity',
          title: 'User Activity Report',
          description: 'Beta user engagement, feature usage, and behavioral insights',
          type: 'user',
          lastGenerated: '2025-08-29T12:00:00Z',
          status: 'ready'
        },
        {
          id: 'system-performance',
          title: 'System Performance Report',
          description: 'API performance, uptime metrics, and technical health indicators',
          type: 'technical',
          lastGenerated: '2025-08-29T10:15:00Z',
          status: 'ready'
        },
        {
          id: 'data-processing',
          title: 'Data Processing Report',
          description: 'Contact enrichment statistics, email validation results, and processing efficiency',
          type: 'technical',
          lastGenerated: '2025-08-29T08:45:00Z',
          status: 'ready'
        },
        {
          id: 'beta-feedback',
          title: 'Beta User Feedback Summary',
          description: 'Collected feedback, feature requests, and user satisfaction metrics',
          type: 'user',
          lastGenerated: '2025-08-28T16:20:00Z',
          status: 'ready'
        },
        {
          id: 'revenue-forecast',
          title: 'Revenue Forecast & Projections',
          description: 'Financial projections, pricing analysis, and revenue optimization recommendations',
          type: 'financial',
          lastGenerated: '2025-08-28T14:30:00Z',
          status: 'generating'
        }
      ];

      setReports(mockReports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: 'generating' as const }
        : report
    ));

    // Simulate report generation
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, status: 'ready' as const, lastGenerated: new Date().toISOString() }
          : report
      ));
    }, 3000);
  };

  const downloadReport = async (reportId: string, format: 'csv' | 'json' = 'csv') => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, format })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to generate report: ${error.error}`);
        return;
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `${reportId}-report.${format}`;

      // Create download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report');
    }
  };

  const filteredReports = selectedType === 'all' 
    ? reports 
    : reports.filter(report => report.type === selectedType);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'business': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'technical': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'user': return 'bg-green-100 text-green-800 border-green-200';
      case 'financial': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Reports...</h2>
          <p className="text-gray-600">Preparing business intelligence</p>
        </div>
      </div>
    );
  }

  return (
    <div className="postcraft-container">
      {/* Header */}
      <div className="postcraft-section text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Business Reports
        </h1>
        <p className="text-gray-600 text-lg mb-4">
          Generate and download comprehensive business intelligence reports
        </p>
        <div className="postcraft-status">
          <div className="postcraft-status-dot"></div>
          <span>{filteredReports.length} reports available</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="postcraft-section">
        <div className="postcraft-section-header">
          <Filter className="w-6 h-6 inline-block mr-2" />
          <h2 className="inline">Filter Reports</h2>
        </div>

        <div className="flex gap-3 flex-wrap">
          {['all', 'business', 'technical', 'user', 'financial'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedType === type
                  ? 'postcraft-button-gradient text-white'
                  : 'postcraft-button'
              }`}
            >
              {type === 'all' ? 'All Reports' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const getStatusIcon = (status: string) => {
            switch (status) {
              case 'ready': return <BarChart3 className="w-4 h-4 text-green-600" />;
              case 'generating': return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
              case 'error': return <FileText className="w-4 h-4 text-red-600" />;
              default: return <FileText className="w-4 h-4 text-gray-600" />;
            }
          };
          
          return (
            <div key={report.id} className="postcraft-card">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className={`postcraft-metric-badge ${getTypeColor(report.type)}`}>
                  {report.type.toUpperCase()}
                </div>
                <div className="postcraft-status">
                  {getStatusIcon(report.status)}
                  <span className="capitalize">{report.status}</span>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {report.title}
              </h3>

              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {report.description}
              </p>

              <div className="bg-gray-50 p-3 rounded-lg mb-6 border border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span>Last generated: {new Date(report.lastGenerated).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => generateReport(report.id)}
                  disabled={report.status === 'generating'}
                  className={`w-full px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    report.status === 'generating'
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'postcraft-button-gradient text-white'
                  }`}
                >
                  {report.status === 'generating' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </>
                  )}
                </button>

                {report.status === 'ready' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => downloadReport(report.id, 'csv')}
                      className="postcraft-button flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      CSV
                    </button>
                    <button
                      onClick={() => downloadReport(report.id, 'json')}
                      className="postcraft-button flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      JSON
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600">Try selecting a different filter to see available reports</p>
        </div>
      )}
    </div>
  );
}