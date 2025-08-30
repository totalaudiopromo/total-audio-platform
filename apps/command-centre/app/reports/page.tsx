'use client';

import { useState, useEffect } from 'react';

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

  const downloadReport = (reportId: string) => {
    // In production, this would trigger a real download
    alert(`Downloading report: ${reportId}`);
  };

  const filteredReports = selectedType === 'all' 
    ? reports 
    : reports.filter(report => report.type === selectedType);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'business': return { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' };
      case 'technical': return { bg: '#f3e8ff', text: '#7c3aed', border: '#8b5cf6' };
      case 'user': return { bg: '#d1fae5', text: '#047857', border: '#10b981' };
      case 'financial': return { bg: '#fed7d7', text: '#c53030', border: '#f56565' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return { bg: '#d1fae5', text: '#047857' };
      case 'generating': return { bg: '#fef3c7', text: '#d97706' };
      case 'error': return { bg: '#fed7d7', text: '#c53030' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading Reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1a202c', margin: '0 0 0.5rem 0' }}>
              Business Reports
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Generate and download comprehensive business intelligence reports
            </p>
          </div>
          <button 
            onClick={() => window.history.back()}
            style={{
              background: '#047857',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'business', 'technical', 'user', 'financial'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                background: selectedType === type ? '#047857' : 'transparent',
                color: selectedType === type ? 'white' : '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}
            >
              {type === 'all' ? 'All Reports' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '2rem'
      }}>
        {filteredReports.map((report) => {
          const typeColors = getTypeColor(report.type);
          const statusColors = getStatusColor(report.status);
          
          return (
            <div key={report.id} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{
                  background: typeColors.bg,
                  color: typeColors.text,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {report.type}
                </div>
                <div style={{
                  background: statusColors.bg,
                  color: statusColors.text,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {report.status === 'generating' && (
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid currentColor',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  )}
                  {report.status}
                </div>
              </div>

              {/* Content */}
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1a202c',
                margin: '0 0 0.75rem 0',
                lineHeight: '1.3'
              }}>
                {report.title}
              </h3>
              
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: '0 0 1.5rem 0'
              }}>
                {report.description}
              </p>

              <div style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginBottom: '1.5rem'
              }}>
                Last generated: {new Date(report.lastGenerated).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => generateReport(report.id)}
                  disabled={report.status === 'generating'}
                  style={{
                    background: report.status === 'generating' ? '#9ca3af' : '#047857',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: report.status === 'generating' ? 'not-allowed' : 'pointer',
                    flex: 1,
                    transition: 'all 0.2s'
                  }}
                >
                  {report.status === 'generating' ? 'Generating...' : 'Regenerate'}
                </button>
                
                {report.status === 'ready' && (
                  <button
                    onClick={() => downloadReport(report.id)}
                    style={{
                      background: 'transparent',
                      color: '#047857',
                      border: '2px solid #047857',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Download
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
        }}>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            No reports found for the selected filter.
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}