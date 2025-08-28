'use client';

import { useState, useEffect, useCallback } from 'react';

interface RevenueForecast {
  period: string;
  predictedRevenue: number;
  confidence: number;
  components: {
    newCustomerRevenue: number;
    existingCustomerRevenue: number;
    upgradeRevenue: number;
    churnImpact: number;
  };
}

interface CLVPrediction {
  userId: string;
  predictedCLV: number;
  confidence: number;
  breakdown: {
    currentValue: number;
    upgradePotential: number;
    crossSellValue: number;
    referralValue: number;
    partnershipValue: number;
  };
  retentionStrategy: {
    priority: 'low' | 'medium' | 'high' | 'critical';
    recommendedActions: string[];
  };
}

interface CustomerRiskProfile {
  userId: string;
  riskScore: number;
  churnProbability: number;
  daysToChurn: number;
  riskCategory: 'low' | 'medium' | 'high' | 'critical';
  customerValue: {
    lifetimeValue: number;
    monthlyValue: number;
    retentionROI: number;
  };
  interventionPlan: {
    urgency: 'immediate' | 'within_week' | 'within_month' | 'monitor';
    recommendedActions: string[];
  };
}

interface RevenueOpportunity {
  id: string;
  title: string;
  category: string;
  opportunityScore: number;
  revenueImpact: {
    monthly: number;
    annual: number;
  };
  metrics: {
    investmentRequired: number;
    timeToROI: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export default function PredictiveRevenuePage() {
  const [forecasts, setForecasts] = useState<RevenueForecast[]>([]);
  const [clvPredictions, setCLVPredictions] = useState<CLVPrediction[]>([]);
  const [churnRisks, setChurnRisks] = useState<CustomerRiskProfile[]>([]);
  const [opportunities, setOpportunities] = useState<RevenueOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('forecasting');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [forecastRes, clvRes, churnRes, oppRes] = await Promise.all([
        fetch('/api/revenue-forecasting'),
        fetch('/api/clv-prediction'),
        fetch('/api/churn-prevention'),
        fetch('/api/revenue-opportunities')
      ]);

      if (forecastRes.ok) {
        const data = await forecastRes.json();
        setForecasts(data.forecasts || []);
      }

      if (clvRes.ok) {
        const data = await clvRes.json();
        setCLVPredictions(data.predictions || []);
      }

      if (churnRes.ok) {
        const data = await churnRes.json();
        setChurnRisks(data.atRiskCustomers || []);
      }

      if (oppRes.ok) {
        const data = await oppRes.json();
        setOpportunities(data.opportunities || []);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching predictive revenue data:', err);
      setError('Failed to load predictive revenue data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 10 minutes for predictive data
    const interval = setInterval(fetchAllData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-grey-600 bg-grey-100';
    }
  };

  const formatCurrency = (amount: number) => `£${amount.toLocaleString()}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-grey-50 flex items-centre justify-centre">
        <div className="text-centre">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <h2 className="text-xl font-bold text-grey-900 mt-4">Loading Predictive Analytics...</h2>
          <p className="text-grey-600">Analysing revenue patterns and generating predictions</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-grey-50 flex items-centre justify-centre">
        <div className="text-centre bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-grey-900 mb-2">Predictive System Error</h2>
          <p className="text-grey-600 mb-4">{error}</p>
          <button 
            onClick={fetchAllData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-centre justify-centre">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black text-grey-900">Predictive Revenue Management</h1>
                <p className="text-grey-600 font-semibold">AI-Powered Revenue Intelligence & Automation</p>
              </div>
            </div>
            
            <div className="flex items-centre space-x-6">
              <div className="flex items-centre space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-grey-600 font-medium">AI Active</span>
              </div>
              <div className="text-sm text-grey-500">
                Updated {Math.floor((Date.now() - lastUpdated.getTime()) / 60000)}m ago
              </div>
              <button 
                onClick={fetchAllData}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Refresh Predictions
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
              { id: 'forecasting', label: 'Revenue Forecasting' },
              { id: 'clv', label: 'Customer Lifetime Value' },
              { id: 'churn', label: 'Churn Prevention' },
              { id: 'opportunities', label: 'Revenue Opportunities' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
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
        {/* Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-centre">
              <div className="w-8 h-8 bg-green-100 rounded-md flex items-centre justify-centre">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-grey-500">6-Month Forecast</p>
                <p className="text-2xl font-semibold text-grey-900">
                  {formatCurrency(forecasts[forecasts.length - 1]?.predictedRevenue || 0)}
                </p>
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
                <p className="text-sm font-medium text-grey-500">Average CLV</p>
                <p className="text-2xl font-semibold text-grey-900">
                  {formatCurrency(clvPredictions.reduce((sum, p) => sum + p.predictedCLV, 0) / clvPredictions.length || 0)}
                </p>
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
                <p className="text-sm font-medium text-grey-500">At-Risk Revenue</p>
                <p className="text-2xl font-semibold text-grey-900">
                  {formatCurrency(churnRisks.reduce((sum, r) => sum + r.customerValue.lifetimeValue, 0))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-centre">
              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-centre justify-centre">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-grey-500">Top Opportunity</p>
                <p className="text-2xl font-semibold text-grey-900">
                  {formatCurrency(opportunities[0]?.revenueImpact.annual || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'forecasting' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-grey-900 mb-4">AI Revenue Forecasting Model</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {forecasts.slice(0, 6).map((forecast, index) => (
                  <div key={forecast.period} className="border border-grey-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-grey-900">{forecast.period}</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(forecast.predictedRevenue)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        forecast.confidence >= 80 ? 'bg-green-100 text-green-800' :
                        forecast.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {forecast.confidence}% confidence
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-grey-600">New Customers:</span>
                        <span className="font-medium">{formatCurrency(forecast.components.newCustomerRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-grey-600">Existing:</span>
                        <span className="font-medium">{formatCurrency(forecast.components.existingCustomerRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-grey-600">Upgrades:</span>
                        <span className="font-medium text-green-600">{formatCurrency(forecast.components.upgradeRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-grey-600">Churn Impact:</span>
                        <span className="font-medium text-red-600">{formatCurrency(forecast.components.churnImpact)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clv' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-grey-900 mb-4">Customer Lifetime Value Predictions</h3>
              <div className="space-y-4">
                {clvPredictions.slice(0, 10).map((prediction) => (
                  <div key={prediction.userId} className="border border-grey-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-centre space-x-3 mb-2">
                          <h4 className="font-medium text-grey-900">{prediction.userId}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            prediction.retentionStrategy.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            prediction.retentionStrategy.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            prediction.retentionStrategy.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {prediction.retentionStrategy.priority} priority
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-grey-500">Predicted CLV</p>
                            <p className="text-lg font-bold text-blue-600">{formatCurrency(prediction.predictedCLV)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-grey-500">Confidence</p>
                            <p className="text-lg font-semibold">{prediction.confidence}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-grey-500">Upgrade Potential</p>
                            <p className="text-lg font-semibold text-green-600">{formatCurrency(prediction.breakdown.upgradePotential)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-grey-700 mb-2">Recommended Actions:</p>
                      <ul className="space-y-1">
                        {prediction.retentionStrategy.recommendedActions.slice(0, 2).map((action, idx) => (
                          <li key={idx} className="text-sm text-grey-600 flex items-centre">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'churn' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-grey-900 mb-4">Churn Prevention - 30-Day Early Warning</h3>
              <div className="space-y-4">
                {churnRisks.slice(0, 15).map((risk) => (
                  <div key={risk.userId} className={`border-l-4 ${
                    risk.riskCategory === 'critical' ? 'border-red-500 bg-red-50' :
                    risk.riskCategory === 'high' ? 'border-orange-500 bg-orange-50' :
                    risk.riskCategory === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  } p-4 rounded-r-lg`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-centre space-x-3 mb-2">
                          <h4 className="font-medium text-grey-900">{risk.userId}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(risk.riskCategory)}`}>
                            {risk.riskCategory} risk
                          </span>
                          <span className="px-2 py-1 text-xs bg-grey-100 text-grey-600 rounded">
                            {risk.daysToChurn} days to churn
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-grey-500">Churn Probability</p>
                            <p className="text-lg font-bold text-red-600">{risk.churnProbability}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-grey-500">Risk Score</p>
                            <p className="text-lg font-semibold">{risk.riskScore}/100</p>
                          </div>
                          <div>
                            <p className="text-sm text-grey-500">Monthly Value</p>
                            <p className="text-lg font-semibold">{formatCurrency(risk.customerValue.monthlyValue)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-grey-500">Retention ROI</p>
                            <p className="text-lg font-semibold text-green-600">{formatCurrency(risk.customerValue.retentionROI)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-centre">
                      <div>
                        <p className="text-sm font-medium text-grey-700 mb-1">Immediate Actions:</p>
                        <ul className="text-sm text-grey-600">
                          {risk.interventionPlan.recommendedActions.slice(0, 2).map((action, idx) => (
                            <li key={idx}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                          risk.interventionPlan.urgency === 'immediate' ? 'bg-red-100 text-red-800' :
                          risk.interventionPlan.urgency === 'within_week' ? 'bg-orange-100 text-orange-800' :
                          risk.interventionPlan.urgency === 'within_month' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {risk.interventionPlan.urgency.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-grey-900 mb-4">Revenue Opportunity Scoring</h3>
              <div className="space-y-4">
                {opportunities.slice(0, 10).map((opportunity) => (
                  <div key={opportunity.id} className="border border-grey-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-centre space-x-3 mb-2">
                          <h4 className="font-semibold text-grey-900">{opportunity.title}</h4>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {opportunity.category.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-grey-500">Opportunity Score</p>
                            <p className="text-xl font-bold text-purple-600">{opportunity.opportunityScore}/100</p>
                          </div>
                          <div>
                            <p className="text-sm text-grey-500">Annual Revenue</p>
                            <p className="text-xl font-bold text-green-600">{formatCurrency(opportunity.revenueImpact.annual)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-grey-500">Investment</p>
                            <p className="text-xl font-semibold">{formatCurrency(opportunity.metrics.investmentRequired)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-grey-500">ROI Timeline</p>
                            <p className="text-xl font-semibold">{opportunity.metrics.timeToROI} days</p>
                          </div>
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                        opportunity.metrics.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                        opportunity.metrics.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {opportunity.metrics.riskLevel} risk
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-centre">
                      <div>
                        <p className="text-sm text-grey-600 mb-2">Monthly Impact: {formatCurrency(opportunity.revenueImpact.monthly)}</p>
                        <p className="text-sm text-grey-600">
                          ROI: {Math.round((opportunity.revenueImpact.annual / opportunity.metrics.investmentRequired) * 100)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}