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
    potentialRevenue: 8500,
  };

  const forecasts = [
    { month: 'January 2025', revenue: 2400, confidence: 89 },
    { month: 'February 2025', revenue: 2680, confidence: 85 },
    { month: 'March 2025', revenue: 2950, confidence: 82 },
    { month: 'April 2025', revenue: 3200, confidence: 78 },
    { month: 'May 2025', revenue: 3480, confidence: 75 },
    { month: 'June 2025', revenue: 3750, confidence: 72 },
  ];

  if (isLoading) {
    return (
      <div className="postcraft-page flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <h2 className="postcraft-section-title">Loading Predictive Revenue...</h2>
          <p className="postcraft-text">Analyzing revenue patterns and generating forecasts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="postcraft-page">
      {/* Header */}
      <div className="postcraft-header mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="postcraft-title mb-1">Predictive Revenue</h1>
            <p className="postcraft-subtitle">AI-powered revenue forecasting and analysis</p>
          </div>
        </div>

        <div className="postcraft-status">
          <div className="postcraft-status-dot"></div>
          <span>Live predictions</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="postcraft-section mb-8">
        <div className="postcraft-metrics-grid">
          <div className="postcraft-metric-card">
            <div className="postcraft-metric-icon bg-gradient-to-br from-blue-500 to-cyan-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="postcraft-metric-value">£{metrics.predictedMRR.toLocaleString()}</div>
            <div className="postcraft-metric-label">Predicted MRR</div>
          </div>

          <div className="postcraft-metric-card">
            <div className="postcraft-metric-icon bg-gradient-to-br from-green-500 to-emerald-500">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="postcraft-metric-value">{metrics.confidenceScore}%</div>
            <div className="postcraft-metric-label">Confidence Score</div>
          </div>

          <div className="postcraft-metric-card">
            <div className="postcraft-metric-icon bg-gradient-to-br from-yellow-500 to-orange-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="postcraft-metric-value">£{metrics.averageCLV.toLocaleString()}</div>
            <div className="postcraft-metric-label">Average CLV</div>
          </div>

          <div className="postcraft-metric-card">
            <div className="postcraft-metric-icon bg-gradient-to-br from-red-500 to-pink-500">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="postcraft-metric-value">{metrics.churnRisk}%</div>
            <div className="postcraft-metric-label">Churn Risk</div>
          </div>
        </div>
      </div>

      {/* Revenue Forecast */}
      <div className="postcraft-section mb-8">
        <div className="postcraft-card">
          <h2 className="postcraft-section-title mb-6">6-Month Revenue Forecast</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forecasts.map((forecast, index) => (
              <div key={index} className="postcraft-card">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="postcraft-label">{forecast.month}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-black ${
                      forecast.confidence >= 80
                        ? 'bg-green-100 text-green-800'
                        : forecast.confidence >= 70
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {forecast.confidence}% confidence
                  </span>
                </div>
                <div className="text-3xl font-black text-blue-600">
                  £{forecast.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Opportunities */}
      <div className="postcraft-section">
        <div className="postcraft-card">
          <h2 className="postcraft-section-title mb-6">Revenue Opportunities</h2>

          <div className="postcraft-metrics-grid">
            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-purple-500 to-pink-500">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">{metrics.opportunities}</div>
              <div className="postcraft-metric-label">Active Opportunities</div>
            </div>

            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-green-500 to-emerald-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">
                £{metrics.potentialRevenue.toLocaleString()}
              </div>
              <div className="postcraft-metric-label">Potential Monthly Revenue</div>
            </div>

            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-yellow-500 to-amber-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">254%</div>
              <div className="postcraft-metric-label">Projected ROI</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
