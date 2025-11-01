'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

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
          status: 'ready',
        },
        {
          id: 'user-activity',
          title: 'User Activity Report',
          description: 'Beta user engagement, feature usage, and behavioral insights',
          type: 'user',
          lastGenerated: '2025-08-29T12:00:00Z',
          status: 'ready',
        },
        {
          id: 'system-performance',
          title: 'System Performance Report',
          description: 'API performance, uptime metrics, and technical health indicators',
          type: 'technical',
          lastGenerated: '2025-08-29T10:15:00Z',
          status: 'ready',
        },
        {
          id: 'data-processing',
          title: 'Data Processing Report',
          description:
            'Contact enrichment statistics, email validation results, and processing efficiency',
          type: 'technical',
          lastGenerated: '2025-08-29T08:45:00Z',
          status: 'ready',
        },
        {
          id: 'beta-feedback',
          title: 'Beta User Feedback Summary',
          description: 'Collected feedback, feature requests, and user satisfaction metrics',
          type: 'user',
          lastGenerated: '2025-08-28T16:20:00Z',
          status: 'ready',
        },
        {
          id: 'revenue-forecast',
          title: 'Revenue Forecast & Projections',
          description:
            'Financial projections, pricing analysis, and revenue optimization recommendations',
          type: 'financial',
          lastGenerated: '2025-08-28T14:30:00Z',
          status: 'generating',
        },
      ];

      setReports(mockReports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportId: string) => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId ? { ...report, status: 'generating' as const } : report
      )
    );

    // Simulate report generation
    setTimeout(() => {
      setReports(prev =>
        prev.map(report =>
          report.id === reportId
            ? { ...report, status: 'ready' as const, lastGenerated: new Date().toISOString() }
            : report
        )
      );
    }, 3000);
  };

  const downloadReport = async (reportId: string, format: 'csv' | 'json' = 'csv') => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, format }),
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

  const filteredReports =
    selectedType === 'all' ? reports : reports.filter(report => report.type === selectedType);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'business':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'technical':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'financial':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="postcraft-page flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <h2 className="postcraft-section-title">Loading Reports...</h2>
          <p className="postcraft-text">Preparing business intelligence</p>
        </div>
      </div>
    );
  }

  return (
    <div className="postcraft-page">
      {/* Header */}
      <div className="postcraft-header mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="postcraft-title mb-1">Business Reports</h1>
            <p className="postcraft-subtitle">
              Generate and download comprehensive business intelligence reports
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-blue-100 rounded-xl border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-w-fit">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-gray-900">
            {filteredReports.length} reports available
          </span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="postcraft-section mb-8">
        <h2 className="postcraft-section-title mb-6">Filter Reports</h2>

        <div className="flex gap-3 flex-wrap">
          {['all', 'business', 'technical', 'user', 'financial'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`postcraft-button ${selectedType === type ? 'bg-black text-white' : ''}`}
            >
              {type === 'all' ? 'All Reports' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map(report => {
          const getTypeColorBadge = (type: string) => {
            switch (type) {
              case 'business':
                return 'bg-blue-500';
              case 'technical':
                return 'bg-purple-500';
              case 'user':
                return 'bg-green-500';
              case 'financial':
                return 'bg-red-500';
              default:
                return 'bg-gray-500';
            }
          };

          const getStatusBadge = (status: string) => {
            switch (status) {
              case 'ready':
                return {
                  color: 'bg-green-500',
                  icon: <BarChart3 className="w-4 h-4 text-white" />,
                };
              case 'generating':
                return {
                  color: 'bg-yellow-500',
                  icon: <RefreshCw className="w-4 h-4 text-white animate-spin" />,
                };
              case 'error':
                return { color: 'bg-red-500', icon: <FileText className="w-4 h-4 text-white" /> };
              default:
                return { color: 'bg-gray-500', icon: <FileText className="w-4 h-4 text-white" /> };
            }
          };

          const statusBadge = getStatusBadge(report.status);

          return (
            <div key={report.id} className="postcraft-card">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`${getTypeColorBadge(report.type)} text-white px-3 py-1 rounded-lg font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                >
                  {report.type.toUpperCase()}
                </div>
                <div
                  className={`${statusBadge.color} px-3 py-1 rounded-lg flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                >
                  {statusBadge.icon}
                  <span className="text-white font-bold text-xs capitalize">{report.status}</span>
                </div>
              </div>

              {/* Content */}
              <h3 className="postcraft-label mb-3">{report.title}</h3>

              <p className="postcraft-text mb-4">{report.description}</p>

              <div className="bg-gray-100 p-3 rounded-xl mb-6 border-3 border-black">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Last:{' '}
                    {new Date(report.lastGenerated).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => generateReport(report.id)}
                  disabled={report.status === 'generating'}
                  className={`w-full postcraft-button flex items-center justify-center gap-2 ${
                    report.status === 'generating'
                      ? 'opacity-50 cursor-not-allowed'
                      : 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
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
        <div className="postcraft-card text-center">
          <div className="w-16 h-16 bg-gray-500 rounded-xl mx-auto mb-4 flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h3 className="postcraft-section-title mb-2">No reports found</h3>
          <p className="postcraft-text">
            Try selecting a different filter to see available reports
          </p>
        </div>
      )}
    </div>
  );
}
