'use client';

import { useState, useEffect, useCallback } from 'react';

interface BusinessMetrics {
  revenue: {
    mrr: number;
    arr: number;
    customerLtv: number;
    churnRate: number;
    revenuePerCustomer: number;
    growth: number;
    projection: number;
  };
  customers: {
    total: number;
    activeUsers: number;
    newSignups: number;
    trialConversions: number;
    satisfaction: number;
    nps: number;
    retentionRate: number;
  };
  product: {
    audioIntelUsers: number;
    emailsValidated: number;
    contactsEnriched: number;
    apiCalls: number;
    successRate: number;
    averageProcessingTime: number;
  };
  competition: {
    marketShare: number;
    competitorGap: string[];
    pricingAdvantage: number;
  };
  agents: {
    activeAgents: number;
    tasksCompleted: number;
    automationSavings: number;
    aiInsights: number;
  };
  goals: {
    mrrTarget: number;
    customersTarget: number;
    mrrProgress: number;
    customersProgress: number;
  };
}

interface CompetitorData {
  name: string;
  category: string;
  pricing: {
    basic?: number;
    premium?: number;
    enterprise?: number;
  };
  features: {
    emailValidation?: boolean;
    contactEnrichment?: boolean;
    playlistSubmission?: boolean;
    analytics?: boolean;
    apiAccess?: boolean;
    whiteLabel?: boolean;
  };
  marketPosition: {
    strength: number;
    weakness: string[];
    opportunity: string;
  };
  traffic: {
    monthly: number;
    growth: number;
  };
  revenue: {
    estimated: number;
    model: string;
  };
}

export default function BusinessDashboard() {
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch business metrics
  const fetchBusinessMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/business-metrics');
      if (!response.ok) throw new Error('Failed to fetch business metrics');
      const data = await response.json();
      setBusinessMetrics(data);
    } catch (err) {
      console.error('Error fetching business metrics:', err);
      setError('Failed to load business metrics');
    }
  }, []);

  // Fetch competitor analysis
  const fetchCompetitorData = useCallback(async () => {
    try {
      const response = await fetch('/api/competitors');
      if (!response.ok) throw new Error('Failed to fetch competitor data');
      const data = await response.json();
      setCompetitors(data.competitors);
    } catch (err) {
      console.error('Error fetching competitor data:', err);
      setError('Failed to load competitor analysis');
    }
  }, []);

  // Load all data
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchBusinessMetrics(),
        fetchCompetitorData()
      ]);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchBusinessMetrics, fetchCompetitorData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    loadAllData();
    
    const interval = setInterval(() => {
      fetchBusinessMetrics();
      setLastUpdated(new Date());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [loadAllData, fetchBusinessMetrics]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-bold text-gray-900 mt-4">Loading Business Intelligence...</h2>
          <p className="text-gray-600">Fetching real-time data and competitor analysis</p>
        </div>
      </div>
    );
  }

  if (error || !businessMetrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadAllData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Total Audio Promo</h1>
                <p className="text-gray-600 font-semibold">Business Intelligence Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 font-medium">Live</span>
              </div>
              <div className="text-sm text-gray-500">
                Updated {Math.floor((Date.now() - lastUpdated.getTime()) / 1000)}s ago
              </div>
              <button 
                onClick={loadAllData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {['overview', 'revenue', 'competitors', 'agents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Monthly Recurring Revenue</dt>
                      <dd className="text-lg font-semibold text-gray-900">£{businessMetrics.revenue.mrr.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="text-green-600 text-sm font-medium">+{businessMetrics.revenue.growth.toFixed(1)}%</span>
                    <span className="text-gray-500 text-sm ml-2">vs last month</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                      <dd className="text-lg font-semibold text-gray-900">{businessMetrics.customers.total}</dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="text-green-600 text-sm font-medium">+{businessMetrics.customers.newSignups} this month</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Contacts Enriched</dt>
                      <dd className="text-lg font-semibold text-gray-900">{businessMetrics.product.contactsEnriched.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="text-blue-600 text-sm font-medium">{businessMetrics.product.successRate.toFixed(1)}% success rate</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active AI Agents</dt>
                      <dd className="text-lg font-semibold text-gray-900">{businessMetrics.agents.activeAgents}</dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="text-orange-600 text-sm font-medium">{businessMetrics.agents.automationSavings}hrs saved/week</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals Progress */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress to Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">MRR Goal</span>
                    <span className="text-sm text-gray-500">£{businessMetrics.revenue.mrr} / £{businessMetrics.goals.mrrTarget}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(businessMetrics.goals.mrrProgress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{businessMetrics.goals.mrrProgress.toFixed(1)}% complete</p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Customer Goal</span>
                    <span className="text-sm text-gray-500">{businessMetrics.customers.total} / {businessMetrics.goals.customersTarget}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(businessMetrics.goals.customersProgress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{businessMetrics.goals.customersProgress.toFixed(1)}% complete</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitors' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitor Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {competitors.map((competitor) => (
                  <div key={competitor.name} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-gray-900">{competitor.name}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {competitor.category}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Pricing</p>
                        <div className="text-sm text-gray-600">
                          {competitor.pricing.basic && `Basic: £${competitor.pricing.basic}`}
                          {competitor.pricing.premium && ` | Premium: £${competitor.pricing.premium}`}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Strength</p>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${competitor.marketPosition.strength * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{competitor.marketPosition.strength}/10</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Monthly Traffic</p>
                        <p className="text-sm text-gray-600">{competitor.traffic.monthly.toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Our Opportunity</p>
                        <p className="text-xs text-gray-600">{competitor.marketPosition.opportunity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitive Advantages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Our Unique Position</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {businessMetrics.competition.competitorGap.map((gap, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Pricing Advantage</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{businessMetrics.competition.pricingAdvantage}%</p>
                    <p className="text-sm text-green-700">cheaper than nearest competitor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Agent Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{businessMetrics.agents.activeAgents}</div>
                  <p className="text-gray-600">Active Agents</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{businessMetrics.agents.tasksCompleted}</div>
                  <p className="text-gray-600">Tasks Completed Today</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{businessMetrics.agents.automationSavings}hrs</div>
                  <p className="text-gray-600">Time Saved This Week</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Status</h3>
              <div className="space-y-4">
                {[
                  { name: "Contact Enrichment Agent", status: "Active", tasks: 45 },
                  { name: "Email Validation Agent", status: "Active", tasks: 89 },
                  { name: "Analytics Agent", status: "Active", tasks: 23 },
                  { name: "Music Industry Strategist", status: "Standby", tasks: 12 },
                  { name: "Competition Monitor", status: "Active", tasks: 8 },
                ].map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        agent.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="font-medium text-gray-900">{agent.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {agent.tasks} tasks today
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