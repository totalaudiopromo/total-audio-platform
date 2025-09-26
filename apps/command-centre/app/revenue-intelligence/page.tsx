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

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return { bg: '#d1fae5', color: '#065f46' };
      case 'risk': return { bg: '#fee2e2', color: '#991b1b' };
      case 'optimization': return { bg: '#dbeafe', color: '#1e40af' };
      case 'trend': return { bg: '#fef3c7', color: '#92400e' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div className="intel-page">
      {/* Header */}
      <div className="intel-header">
        <div className="intel-header-content">
          <div className="intel-header-title">
            <div className="intel-header-icon">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1>Revenue Intelligence</h1>
              <p>AI-powered insights and automated revenue optimization</p>
            </div>
          </div>
          
          <div className="intel-status">
            <div className="intel-status-dot"></div>
            <span style={{ color: 'var(--intel-gray-600)' }}>AI analyzing</span>
          </div>
        </div>
      </div>

      <div className="intel-container">
        {/* Key Metrics */}
        <div className="intel-metrics">
          <div className="intel-metric">
            <div className="intel-metric-header">
              <div className="intel-metric-icon" style={{ background: '#dbeafe', color: '#1e40af' }}>
                <Brain className="w-5 h-5" />
              </div>
            </div>
            <div className="intel-metric-value">{metrics.aiAccuracy}%</div>
            <div className="intel-metric-label">AI Accuracy</div>
          </div>

          <div className="intel-metric">
            <div className="intel-metric-header">
              <div className="intel-metric-icon" style={{ background: '#d1fae5', color: '#065f46' }}>
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="intel-metric-value">{metrics.predictionsGenerated.toLocaleString()}</div>
            <div className="intel-metric-label">Predictions Generated</div>
          </div>

          <div className="intel-metric">
            <div className="intel-metric-header">
              <div className="intel-metric-icon" style={{ background: '#fef3c7', color: '#92400e' }}>
                <Target className="w-5 h-5" />
              </div>
            </div>
            <div className="intel-metric-value">£{metrics.revenueOptimized.toLocaleString()}</div>
            <div className="intel-metric-label">Revenue Optimized</div>
          </div>

          <div className="intel-metric">
            <div className="intel-metric-header">
              <div className="intel-metric-icon" style={{ background: '#fee2e2', color: '#991b1b' }}>
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="intel-metric-value">{metrics.automatedActions}</div>
            <div className="intel-metric-label">Automated Actions</div>
          </div>
        </div>

        {/* AI Performance */}
        <div className="intel-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--intel-gray-900)' }}>
            AI Performance Metrics
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
                background: '#d1fae5', 
                color: '#065f46',
                margin: '0 auto 1rem auto'
              }}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#065f46' }}>
                {metrics.confidenceScore}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--intel-gray-600)' }}>
                Confidence Score
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
                background: '#dbeafe', 
                color: '#1e40af',
                margin: '0 auto 1rem auto'
              }}>
                <Zap className="w-5 h-5" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e40af' }}>
                {metrics.timesSaved}h
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--intel-gray-600)' }}>
                Time Saved Monthly
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
                background: 'var(--intel-gradient)', 
                color: 'white',
                margin: '0 auto 1rem auto'
              }}>
                <Target className="w-5 h-5" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                47
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--intel-gray-600)' }}>
                Active Models
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="intel-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--intel-gray-900)' }}>
            Latest AI Insights
          </h2>
          
          <div className="intel-grid intel-grid-2">
            {insights.map((insight, index) => {
              const colors = getInsightColor(insight.type);
              return (
                <div key={index} style={{
                  padding: '1.5rem',
                  border: '1px solid var(--intel-gray-200)',
                  borderRadius: '0.75rem',
                  background: 'var(--intel-white)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div className="intel-metric-icon" style={{ 
                      background: colors.bg, 
                      color: colors.color,
                      marginRight: '0.75rem',
                      width: '2rem',
                      height: '2rem'
                    }}>
                      {insight.type === 'opportunity' && <Target className="w-4 h-4" />}
                      {insight.type === 'risk' && <AlertCircle className="w-4 h-4" />}
                      {insight.type === 'optimization' && <Zap className="w-4 h-4" />}
                      {insight.type === 'trend' && <TrendingUp className="w-4 h-4" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--intel-gray-900)' }}>
                        {insight.title}
                      </h3>
                      <span className="intel-badge intel-badge-blue">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '0.875rem', color: 'var(--intel-gray-600)', marginBottom: '0.75rem' }}>
                    {insight.description}
                  </p>
                  
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.color,
                    background: colors.bg,
                    padding: '0.5rem',
                    borderRadius: '0.375rem'
                  }}>
                    {insight.impact}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}