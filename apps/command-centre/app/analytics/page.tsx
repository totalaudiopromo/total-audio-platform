'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  revenue: {
    totalRevenue: number;
    growthRate: number;
    projectedMonthly: number;
    revenueBySource: { name: string; value: number; percentage: number }[];
  };
  users: {
    totalUsers: number;
    activeUsers: number;
    userGrowth: number;
    retentionRate: number;
    churnRate: number;
  };
  product: {
    contactsEnriched: number;
    emailsValidated: number;
    apiCalls: number;
    successRate: number;
    avgProcessingTime: number;
    featureUsage: { feature: string; usage: number }[];
  };
  performance: {
    systemUptime: number;
    averageResponseTime: number;
    errorRate: number;
    dataProcessingVolume: number;
  };
}

export default function AdvancedAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // In real implementation, this would fetch from your analytics API
      // For now, we'll generate realistic data based on the business metrics
      const mockAnalytics: AnalyticsData = {
        revenue: {
          totalRevenue: 0, // Beta phase
          growthRate: 0,
          projectedMonthly: 2000, // Target
          revenueBySource: [
            { name: 'Pro Subscriptions', value: 0, percentage: 0 },
            { name: 'Enterprise', value: 0, percentage: 0 },
            { name: 'API Usage', value: 0, percentage: 0 }
          ]
        },
        users: {
          totalUsers: 4,
          activeUsers: 2,
          userGrowth: 100, // Growing from beta
          retentionRate: 100, // Perfect beta retention
          churnRate: 0
        },
        product: {
          contactsEnriched: 3672,
          emailsValidated: 12847,
          apiCalls: 24530,
          successRate: 97.4,
          avgProcessingTime: 1.8,
          featureUsage: [
            { feature: 'Contact Enrichment', usage: 85 },
            { feature: 'Email Validation', usage: 92 },
            { feature: 'Data Export', usage: 78 },
            { feature: 'API Access', usage: 45 }
          ]
        },
        performance: {
          systemUptime: 99.7,
          averageResponseTime: 245, // ms
          errorRate: 2.6,
          dataProcessingVolume: 16419 // Total records processed
        }
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          <p>Loading Advanced Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              Advanced Analytics
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Deep insights into Audio Intel performance and business metrics
            </p>
          </div>
          <button 
            onClick={() => window.history.back()}
            style={{
              background: '#4299e1',
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

        {/* Timeframe Selector */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['7d', '30d', '90d', '1y'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              style={{
                background: timeframe === period ? '#4299e1' : 'transparent',
                color: timeframe === period ? 'white' : '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {/* Revenue Analytics */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a202c', marginBottom: '1.5rem' }}>
            Revenue Analytics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Current Revenue</p>
              <p style={{ fontSize: '2rem', fontWeight: '900', color: '#059669', margin: 0 }}>
                £{analytics?.revenue.totalRevenue.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Monthly Target</p>
              <p style={{ fontSize: '2rem', fontWeight: '900', color: '#dc2626', margin: 0 }}>
                £{analytics?.revenue.projectedMonthly.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
              Revenue by Source (Beta Phase)
            </h4>
            {analytics?.revenue.revenueBySource.map((source, index) => (
              <div key={index} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{source.name}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>£{source.value}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${source.percentage}%`,
                    height: '100%',
                    background: `hsl(${index * 60}, 70%, 50%)`,
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Analytics */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a202c', marginBottom: '1.5rem' }}>
            User Analytics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Total Users</p>
              <p style={{ fontSize: '2rem', fontWeight: '900', color: '#3b82f6', margin: 0 }}>
                {analytics?.users.totalUsers}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Active Users</p>
              <p style={{ fontSize: '2rem', fontWeight: '900', color: '#059669', margin: 0 }}>
                {analytics?.users.activeUsers}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Retention Rate</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#059669', margin: 0 }}>
                {analytics?.users.retentionRate}%
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Churn Rate</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626', margin: 0 }}>
                {analytics?.users.churnRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Product Usage Analytics */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a202c', marginBottom: '1.5rem' }}>
            Product Usage
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Contacts Enriched</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#8b5cf6', margin: 0 }}>
                {analytics?.product.contactsEnriched.toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Emails Validated</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#059669', margin: 0 }}>
                {analytics?.product.emailsValidated.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
              Feature Usage
            </h4>
            {analytics?.product.featureUsage.map((feature, index) => (
              <div key={index} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{feature.feature}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{feature.usage}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${feature.usage}%`,
                    height: '100%',
                    background: '#8b5cf6',
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Performance */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a202c', marginBottom: '1.5rem' }}>
            System Performance
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Uptime</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#059669', margin: 0 }}>
                {analytics?.performance.systemUptime}%
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Avg Response</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#3b82f6', margin: 0 }}>
                {analytics?.performance.averageResponseTime}ms
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Success Rate</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#059669', margin: 0 }}>
                {analytics?.product.successRate}%
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Processing Time</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f59e0b', margin: 0 }}>
                {analytics?.product.avgProcessingTime}s
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}