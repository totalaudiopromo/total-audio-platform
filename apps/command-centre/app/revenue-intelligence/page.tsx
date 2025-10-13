'use client';

import { Brain, Zap, Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RevenueIntelligencePage() {
  // Mock data - simple and clean like Audio Intel
  const metrics = {
    aiAccuracy: 94.2,
    predictionsGenerated: 1247,
    revenueOptimized: 28500,
    automatedActions: 156,
    confidenceScore: 89,
    timesSaved: 124
  };

  const insights = [
    {
      type: 'opportunity',
      title: 'Beta User Conversion Opportunity',
      description: 'Audio Intel beta users ready for paid conversion',
      impact: '4 customers showing strong engagement signals',
      confidence: 87
    },
    {
      type: 'risk',
      title: 'Email Validation Service Load',
      description: 'Processing capacity approaching 80% utilization',
      impact: 'May need infrastructure scaling soon',
      confidence: 92
    },
    {
      type: 'optimization',
      title: 'Contact Enrichment Pricing',
      description: 'Current £45 pricing point performing well against £500 agency alternatives',
      impact: 'Strong competitive positioning validated',
      confidence: 84
    },
    {
      type: 'trend',
      title: 'PR Agency Market Demand',
      description: 'Increasing demand for automated contact research tools',
      impact: 'Market timing favorable for Audio Intel launch',
      confidence: 91
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Target className="w-5 h-5" />;
      case 'risk': return <AlertCircle className="w-5 h-5" />;
      case 'optimization': return <Zap className="w-5 h-5" />;
      case 'trend': return <TrendingUp className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-50 border-green-500 text-green-900';
      case 'risk': return 'bg-red-50 border-red-500 text-red-900';
      case 'optimization': return 'bg-blue-50 border-blue-500 text-blue-900';
      case 'trend': return 'bg-yellow-50 border-yellow-500 text-yellow-900';
      default: return 'bg-gray-50 border-gray-500 text-gray-900';
    }
  };

  return (
    <div className="postcraft-page">
      {/* Header */}
      <div className="postcraft-header">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="postcraft-title mb-1">Revenue Intelligence</h1>
            <p className="postcraft-subtitle">AI-powered insights and automated revenue optimization</p>
          </div>
        </div>

        <div className="postcraft-status-badge">
          <div className="postcraft-status-dot"></div>
          <span>AI analyzing</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="postcraft-metrics-grid mb-8">
        <div className="postcraft-metric-card">
          <div className="postcraft-metric-icon bg-gradient-to-br from-blue-500 to-cyan-500">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="postcraft-metric-value">{metrics.aiAccuracy}%</div>
          <div className="postcraft-metric-label">AI Accuracy</div>
        </div>

        <div className="postcraft-metric-card">
          <div className="postcraft-metric-icon bg-gradient-to-br from-green-500 to-emerald-500">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="postcraft-metric-value">{metrics.predictionsGenerated.toLocaleString()}</div>
          <div className="postcraft-metric-label">Predictions Generated</div>
        </div>

        <div className="postcraft-metric-card">
          <div className="postcraft-metric-icon bg-gradient-to-br from-yellow-500 to-orange-500">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="postcraft-metric-value">£{metrics.revenueOptimized.toLocaleString()}</div>
          <div className="postcraft-metric-label">Revenue Optimized</div>
        </div>

        <div className="postcraft-metric-card">
          <div className="postcraft-metric-icon bg-gradient-to-br from-red-500 to-pink-500">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="postcraft-metric-value">{metrics.automatedActions}</div>
          <div className="postcraft-metric-label">Automated Actions</div>
        </div>
      </div>

      {/* AI Performance Section */}
      <div className="postcraft-section mb-8">
        <h2 className="postcraft-section-title mb-6">AI Performance Metrics</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="postcraft-card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-black text-green-600 mb-2">
              {metrics.confidenceScore}%
            </div>
            <div className="postcraft-label">Confidence Score</div>
          </div>

          <div className="postcraft-card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-black text-blue-600 mb-2">
              {metrics.timesSaved}h
            </div>
            <div className="postcraft-label">Time Saved Monthly</div>
          </div>

          <div className="postcraft-card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-black text-purple-600 mb-2">
              47
            </div>
            <div className="postcraft-label">Active Models</div>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="postcraft-section">
        <h2 className="postcraft-section-title mb-6">Latest AI Insights</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <div key={index} className={`postcraft-card ${getInsightColor(insight.type)}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="text-white">
                    {getInsightIcon(insight.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black mb-2">
                    {insight.title}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-black text-white text-sm font-bold rounded-md">
                    {insight.confidence}% confidence
                  </span>
                </div>
              </div>

              <p className="postcraft-text mb-4">
                {insight.description}
              </p>

              <div className="postcraft-highlight">
                {insight.impact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
