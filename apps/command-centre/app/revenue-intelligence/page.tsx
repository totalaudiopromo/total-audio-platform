'use client';

import { useState, useEffect, useCallback } from 'react';

interface RevenuePrediction {
  userId: string;
  conversionScore: number;
  likelyTier: 'basic' | 'professional' | 'enterprise';
  timeToConversion: number;
  confidence: number;
  revenueImpact: number;
  topFactors: string[];
  recommendedActions: string[];
}

interface ContentPiece {
  id: string;
  title: string;
  type: string;
  totalROI: number;
  directRevenue: number;
  assistedRevenue: number;
  conversionRate: number;
  customerLifetimeValue: number;
}

interface JourneyAnalytics {
  averageJourneyLength: number;
  averageTouchPoints: number;
  conversionRate: number;
  mostInfluentialChannels: { channel: string; influence: number }[];
  optimalJourneyLength: number;
}

interface Alert {
  id: string;
  type: 'opportunity' | 'warning' | 'critical' | 'insight';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  impact: {
    revenue: number;
    users: number;
    confidence: number;
  };
  actions: {
    immediate: string[];
  };
  createdAt: string;
}

export default function RevenueIntelligencePage() {
  const [predictions, setPredictions] = useState<RevenuePrediction[]>([]);
  const [contentROI, setContentROI] = useState<ContentPiece[]>([]);
  const [journeyData, setJourneyData] = useState<JourneyAnalytics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('predictions');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [predictionsRes, contentRes, journeyRes, alertsRes] = await Promise.all([
        fetch('/api/revenue-prediction'),
        fetch('/api/content-roi'),
        fetch('/api/customer-journey'),
        fetch('/api/revenue-alerts')
      ]);

      if (predictionsRes.ok) {
        const data = await predictionsRes.json();
        setPredictions(data.predictions || []);
      }

      if (contentRes.ok) {
        const data = await contentRes.json();
        setContentROI(data.content || []);
      }

      if (journeyRes.ok) {
        const data = await journeyRes.json();
        setJourneyData(data.analytics);
      }

      if (alertsRes.ok) {
        const data = await alertsRes.json();
        setAlerts(data.alerts || []);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching revenue intelligence data:', err);
      setError('Failed to load revenue intelligence data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const getAlertPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-grey-100 text-grey-800 border-grey-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
      case 'critical':
        return <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>;
      case 'warning':
        return <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      default:
        return <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
  };

  const calculateROI = (content: ContentPiece) => {
    const totalRevenue = content.directRevenue + (content.assistedRevenue * 0.3);
    return Math.round(((totalRevenue - 100) / 100) * 100); // Assuming £100 average cost
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-grey-50 flex items-centre justify-centre">
        <div className="text-centre">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-bold text-grey-900 mt-4">Loading Revenue Intelligence...</h2>
          <p className="text-grey-600">Analysing conversion patterns and revenue opportunities</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-grey-50 flex items-centre justify-centre">
        <div className="text-centre bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-grey-900 mb-2">Intelligence System Error</h2>
          <p className="text-grey-600 mb-4">{error}</p>
          <button 
            onClick={fetchAllData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-centre justify-between">
            <div className="flex items-centre space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-centre justify-centre">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black text-grey-900">Revenue Intelligence</h1>
                <p className="text-grey-600 font-semibold">Predictive Analytics & Optimisation Centre</p>
              </div>
            </div>
            
            <div className="flex items-centre space-x-6">
              <div className="flex items-centre space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-grey-600 font-medium">Live Analysis</span>
              </div>
              <div className="text-sm text-grey-500">
                Updated {Math.floor((Date.now() - lastUpdated.getTime()) / 60000)}m ago
              </div>
              <button 
                onClick={fetchAllData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'predictions', label: 'Conversion Predictions' },
              { id: 'content', label: 'Content ROI' },
              { id: 'journey', label: 'Customer Journeys' },
              { id: 'alerts', label: 'Revenue Alerts' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-grey-500 hover:text-grey-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-centre">
              <div className="w-8 h-8 bg-green-100 rounded-md flex items-centre justify-centre">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-grey-500">High-Probability Conversions</p>
                <p className="text-2xl font-semibold text-grey-900">{predictions.filter(p => p.conversionScore >= 70).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-centre">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-centre justify-centre">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-grey-500">Predicted Revenue (30 days)</p>
                <p className="text-2xl font-semibold text-grey-900">£{predictions.reduce((sum, p) => sum + (p.timeToConversion <= 30 ? p.revenueImpact * (p.conversionScore / 100) : 0), 0).toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-centre">
              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-centre justify-centre">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-grey-500">Avg Journey Length</p>
                <p className="text-2xl font-semibold text-grey-900">{journeyData?.averageJourneyLength || 0} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-centre">
              <div className="w-8 h-8 bg-red-100 rounded-md flex items-centre justify-centre">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-grey-500">Active Alerts</p>
                <p className="text-2xl font-semibold text-grey-900">{alerts.filter(a => a.priority === 'urgent' || a.priority === 'high').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-grey-900 mb-4">High-Probability Conversion Candidates</h3>
              <div className="space-y-4">
                {predictions.slice(0, 10).map((prediction) => (
                  <div key={prediction.userId} className="border border-grey-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-centre space-x-3 mb-2">
                          <h4 className="font-medium text-grey-900">{prediction.userId}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            prediction.conversionScore >= 70 ? 'bg-green-100 text-green-800' :
                            prediction.conversionScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {prediction.conversionScore}% conversion probability
                          </span>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {prediction.likelyTier}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-grey-500">Expected conversion</p>
                            <p className="font-medium">{prediction.timeToConversion} days</p>
                          </div>
                          <div>
                            <p className="text-grey-500">Revenue impact</p>
                            <p className="font-medium">£{prediction.revenueImpact}/month</p>
                          </div>
                          <div>
                            <p className="text-grey-500">Confidence</p>
                            <p className="font-medium">{prediction.confidence}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium text-grey-700 mb-2">Top conversion factors:</p>
                        <ul className="space-y-1">
                          {prediction.topFactors.slice(0, 3).map((factor, idx) => (
                            <li key={idx} className="text-sm text-grey-600 flex items-centre">
                              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-grey-700 mb-2">Recommended actions:</p>
                        <ul className="space-y-1">
                          {prediction.recommendedActions.slice(0, 2).map((action, idx) => (
                            <li key={idx} className="text-sm text-blue-600">{action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-grey-900 mb-4">Content ROI Performance</h3>
              <div className="space-y-4">
                {contentROI.slice(0, 10).map((content) => (
                  <div key={content.id} className="border border-grey-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-grey-900 mb-2">{content.title}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-grey-500">ROI</p>
                            <p className={`font-bold ${calculateROI(content) > 100 ? 'text-green-600' : calculateROI(content) > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {calculateROI(content)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-grey-500">Direct Revenue</p>
                            <p className="font-medium">£{content.directRevenue}</p>
                          </div>
                          <div>
                            <p className="text-grey-500">Conversion Rate</p>
                            <p className="font-medium">{content.conversionRate}%</p>
                          </div>
                          <div>
                            <p className="text-grey-500">Customer LTV</p>
                            <p className="font-medium">£{content.customerLifetimeValue}</p>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-grey-100 text-grey-600 rounded">
                        {content.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'journey' && journeyData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-medium text-grey-900 mb-2">Average Journey</h4>
                <p className="text-3xl font-bold text-blue-600 mb-1">{journeyData.averageJourneyLength} days</p>
                <p className="text-sm text-grey-600">with {journeyData.averageTouchPoints} touchpoints</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-medium text-grey-900 mb-2">Conversion Rate</h4>
                <p className="text-3xl font-bold text-green-600 mb-1">{journeyData.conversionRate}%</p>
                <p className="text-sm text-grey-600">across all journeys</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-medium text-grey-900 mb-2">Optimal Length</h4>
                <p className="text-3xl font-bold text-purple-600 mb-1">{journeyData.optimalJourneyLength} days</p>
                <p className="text-sm text-grey-600">for highest conversion</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-grey-900 mb-4">Most Influential Channels</h3>
              <div className="space-y-3">
                {journeyData.mostInfluentialChannels.slice(0, 5).map((channel, idx) => (
                  <div key={idx} className="flex items-centre justify-between">
                    <span className="font-medium text-grey-900">{channel.channel}</span>
                    <div className="flex items-centre space-x-3">
                      <div className="w-32 bg-grey-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(channel.influence, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-grey-600 w-12 text-right">{channel.influence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`border rounded-lg p-6 ${getAlertPriorityColor(alert.priority)}`}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-centre justify-between mb-2">
                        <h4 className="font-semibold text-grey-900">{alert.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAlertPriorityColor(alert.priority)}`}>
                          {alert.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-grey-700 mb-4">{alert.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white bg-opacity-50 p-3 rounded">
                          <p className="text-sm font-medium text-grey-700">Revenue Impact</p>
                          <p className="text-lg font-bold text-grey-900">£{alert.impact.revenue}</p>
                        </div>
                        <div className="bg-white bg-opacity-50 p-3 rounded">
                          <p className="text-sm font-medium text-grey-700">Users Affected</p>
                          <p className="text-lg font-bold text-grey-900">{alert.impact.users}</p>
                        </div>
                        <div className="bg-white bg-opacity-50 p-3 rounded">
                          <p className="text-sm font-medium text-grey-700">Confidence</p>
                          <p className="text-lg font-bold text-grey-900">{alert.impact.confidence}%</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-grey-700 mb-2">Immediate Actions Required:</p>
                        <ul className="space-y-1">
                          {alert.actions.immediate.slice(0, 3).map((action, idx) => (
                            <li key={idx} className="text-sm text-grey-700 flex items-centre">
                              <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}