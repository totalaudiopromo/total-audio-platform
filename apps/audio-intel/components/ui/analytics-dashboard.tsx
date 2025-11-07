'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Zap,
  Clock,
  BarChart3,
  Download,
  Mail,
  Activity,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  PieChart,
  LineChart,
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalyticsData {
  metrics: {
    totalContacts: number;
    totalEnrichments: number;
    successRate: number;
    averageConfidence: number;
    averageDailyEnrichments: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
  };
  charts: {
    dailyEnrichments: Array<{ date: string; count: number }>;
    platformBreakdown: Array<{ platform: string; count: number; percentage: number }>;
    recentActivity: Array<{ timestamp: string; action: string; details: string }>;
  };
  performance: {
    averageProcessingTime: number;
    cacheHitRate: number;
    errorRate: number;
  };
}

const COLORS = [
  '#1E88E5',
  '#43A047',
  '#FF9800',
  '#E91E63',
  '#9C27B0',
  '#607D8B',
  '#795548',
  '#FF5722',
  '#00BCD4',
  '#8BC34A',
];

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics');
      const result = await response.json();

      if (result.success) {
        setAnalyticsData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to load analytics');
      }
    } catch (err) {
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg font-semibold text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600">Start enriching contacts to see your analytics dashboard.</p>
        </div>
      </div>
    );
  }

  const { metrics, charts, performance } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Real-time insights into your contact enrichment performance
          </p>
        </div>
        <Button onClick={fetchAnalytics} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {metrics.totalContacts.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {metrics.totalEnrichments} enrichments completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {metrics.successRate.toFixed(1)}%
            </div>
            <p className="text-xs text-green-600 mt-1">High confidence enrichments</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {metrics.averageConfidence.toFixed(0)}%
            </div>
            <p className="text-xs text-orange-600 mt-1">Research quality score</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Daily Average</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {metrics.averageDailyEnrichments.toFixed(1)}
            </div>
            <p className="text-xs text-blue-600 mt-1">Enrichments per day</p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Weekly Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span
                className={`text-2xl font-bold ${
                  metrics.weeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {metrics.weeklyGrowth >= 0 ? '+' : ''}
                {metrics.weeklyGrowth.toFixed(1)}%
              </span>
              {metrics.weeklyGrowth >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">vs previous week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Processing Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {performance.averageProcessingTime.toFixed(1)}s
            </div>
            <p className="text-sm text-gray-600 mt-1">Average per contact</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Enrichments Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LineChart className="h-5 w-5" />
              <span>Daily Enrichments</span>
            </CardTitle>
            <CardDescription>Contact enrichment volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={charts.dailyEnrichments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#666"
                    fontSize={12}
                    tickFormatter={value =>
                      new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                  />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    labelFormatter={value =>
                      new Date(value).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1E88E5"
                    strokeWidth={3}
                    dot={{ fill: '#1E88E5', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#1E88E5', strokeWidth: 2 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Platform Breakdown</span>
            </CardTitle>
            <CardDescription>Distribution of enriched contacts by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={charts.platformBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ platform, percentage }) => `${platform} (${percentage.toFixed(1)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {charts.platformBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value, name) => [value, 'Contacts']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Latest actions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {charts.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {activity.action.includes('Enrichment') && (
                    <Users className="h-4 w-4 text-blue-600" />
                  )}
                  {activity.action.includes('Export') && (
                    <Download className="h-4 w-4 text-green-600" />
                  )}
                  {activity.action.includes('Search') && <Eye className="h-4 w-4 text-blue-600" />}
                  {activity.action.includes('Promotion') && (
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            {charts.recentActivity.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
