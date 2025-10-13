'use client';

import { useState } from 'react';
import { TrendingUp, DollarSign, Users, Target, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PredictiveRevenuePage() {
  const [isLoading] = useState(false);

  // Mock data - simple and clean like Audio Intel
  const metrics = {
    predictedMRR: 2400,
    confidenceScore: 87,
    averageCLV: 1850,
    churnRisk: 12,
    opportunities: 5,
    potentialRevenue: 8500
  };

  const forecasts = [
    { month: 'January 2025', revenue: 2400, confidence: 89 },
    { month: 'February 2025', revenue: 2680, confidence: 85 },
    { month: 'March 2025', revenue: 2950, confidence: 82 },
    { month: 'April 2025', revenue: 3200, confidence: 78 },
    { month: 'May 2025', revenue: 3480, confidence: 75 },
    { month: 'June 2025', revenue: 3750, confidence: 72 }
  ];

  if (isLoading) {
    return (
    <div className="postcraft-page intel-page">
        <div className="intel-loading">
          <div className="intel-spinner"></div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--intel-gray-700)' }}>
            Loading Predictive Revenue...
          </h2>
          <p style={{ color: 'var(--intel-gray-500)' }}>
            Analyzing revenue patterns and generating forecasts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="postcraft-container">
      {/* Header */}
      <div className="postcraft-section">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="postcraft-metric-icon bg-gradient-to-br from-green-500 to-blue-600">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Predictive Revenue
              </h1>
              <p className="text-gray-600">AI-powered revenue forecasting and analysis</p>
            </div>
          </div>

          <div className="postcraft-status">
            <div className="postcraft-status-dot"></div>
            <span style={{ color: 'var(--intel-gray-600)' }}>Live predictions</span>
          </div>
        </div>
      </div>

      <div className="intel-container">
        {/* Key Metrics */}
        <div className="intel-metrics">
          <div className="intel-metric">
            <div className="intel-metric-header">
              <div className="intel-metric-icon" style={{ background: '#dbeafe', color: '#1e40af' }}>
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="intel-metric-value">£{metrics.predictedMRR.toLocaleString()}</div>
            <div className="intel-metric-label">Predicted MRR</div>
          </div>

          <div className="intel-metric">
            <div className="intel-metric-header">
              <div className="intel-metric-icon" style={{ background: '#d1fae5', color: '#065f46' }}>
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="intel-metric-value">{metrics.confidenceScore}%</div>
            <div className="intel-metric-label">Confidence Score</div>
          </div>

          <div className="intel-metric">
            <div className="intel-metric-header">
              <div className="intel-metric-icon" style={{ background: '#fef3c7', color: '#92400e' }}>
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="intel-metric-value">£{metrics.averageCLV.toLocaleString()}</div>
            <div className="intel-metric-label">Average CLV</div>
          </div>

          <div className="intel-metric">
            <div className="intel-metric-header">
              <div className="intel-metric-icon" style={{ background: '#fee2e2', color: '#991b1b' }}>
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="intel-metric-value">{metrics.churnRisk}%</div>
            <div className="intel-metric-label">Churn Risk</div>
          </div>
        </div>

        {/* Revenue Forecast */}
        <div className="intel-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--intel-gray-900)' }}>
            6-Month Revenue Forecast
          </h2>
          
          <div className="intel-grid intel-grid-2">
            {forecasts.map((forecast, index) => (
              <div key={index} style={{
                padding: '1rem',
                border: '1px solid var(--intel-gray-200)',
                borderRadius: '0.5rem',
                background: 'var(--intel-gray-50)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--intel-gray-900)' }}>
                    {forecast.month}
                  </h3>
                  <span className={`intel-badge ${
                    forecast.confidence >= 80 ? 'intel-badge-green' :
                    forecast.confidence >= 70 ? 'intel-badge-blue' : 'intel-badge-orange'
                  }`}>
                    {forecast.confidence}% confidence
                  </span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--intel-blue)' }}>
                  £{forecast.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Opportunities */}
        <div className="intel-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--intel-gray-900)' }}>
            Revenue Opportunities
          </h2>
          
          <div className="intel-grid intel-grid-3">
            <div style={{
              padding: '1.5rem',
              border: '1px solid var(--intel-gray-200)',
              borderRadius: '0.75rem',
              textAlign: 'center',
              background: 'var(--intel-white)'
            }}>
              <div className="intel-metric-icon" style={{ 
                background: 'var(--intel-gradient)', 
                color: 'white',
                margin: '0 auto 1rem auto'
              }}>
                <Target className="w-5 h-5" />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {metrics.opportunities}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--intel-gray-600)' }}>
                Active Opportunities
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              border: '1px solid var(--intel-gray-200)',
              borderRadius: '0.75rem',
              textAlign: 'center',
              background: 'var(--intel-white)'
            }}>
              <div className="intel-metric-icon" style={{ 
                background: '#d1fae5', 
                color: '#065f46',
                margin: '0 auto 1rem auto'
              }}>
                <DollarSign className="w-5 h-5" />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                £{metrics.potentialRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--intel-gray-600)' }}>
                Potential Monthly Revenue
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              border: '1px solid var(--intel-gray-200)',
              borderRadius: '0.75rem',
              textAlign: 'center',
              background: 'var(--intel-white)'
            }}>
              <div className="intel-metric-icon" style={{ 
                background: '#fef3c7', 
                color: '#92400e',
                margin: '0 auto 1rem auto'
              }}>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                254%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--intel-gray-600)' }}>
                Projected ROI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}