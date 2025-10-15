'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, Download } from 'lucide-react';
import type { Campaign } from '@/lib/types/tracker';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface EnhancedAnalyticsProps {
  campaigns: Campaign[];
}

export function EnhancedAnalytics({ campaigns }: EnhancedAnalyticsProps) {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [view, setView] = useState<'overview' | 'trends' | 'comparison'>('overview');

  // Calculate analytics
  const analytics = useMemo(() => {
    const completedCampaigns = campaigns.filter((c) => c.status === 'completed');
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
    const totalReach = campaigns.reduce((sum, c) => sum + (c.actual_reach || 0), 0);
    const avgSuccessRate =
      completedCampaigns.length > 0
        ? completedCampaigns.reduce((sum, c) => sum + c.success_rate, 0) / completedCampaigns.length
        : 0;

    // Cost per result
    const totalResults = campaigns.reduce((sum, c) => sum + (c.actual_reach || 0), 0);
    const costPerResult = totalResults > 0 ? totalBudget / totalResults : 0;

    // ROI calculation (assuming £1 per reach value)
    const totalValue = totalResults; // Simplified: 1 reach = £1 value
    const roi = totalBudget > 0 ? ((totalValue - totalBudget) / totalBudget) * 100 : 0;

    // Platform breakdown
    const platformStats = campaigns.reduce((acc, campaign) => {
      const platform = campaign.platform || 'Unknown';
      if (!acc[platform]) {
        acc[platform] = { count: 0, budget: 0, reach: 0 };
      }
      acc[platform].count++;
      acc[platform].budget += campaign.budget || 0;
      acc[platform].reach += campaign.actual_reach || 0;
      return acc;
    }, {} as Record<string, { count: number; budget: number; reach: number }>);

    // Trend data (last 90 days)
    const trendData = campaigns
      .filter((c) => c.start_date)
      .sort((a, b) => new Date(a.start_date!).getTime() - new Date(b.start_date!).getTime())
      .reduce((acc, campaign) => {
        const month = new Date(campaign.start_date!).toLocaleDateString('en-GB', {
          month: 'short',
          year: '2-digit',
        });
        const existing = acc.find((d) => d.month === month);
        if (existing) {
          existing.campaigns++;
          existing.budget += campaign.budget || 0;
          existing.reach += campaign.actual_reach || 0;
        } else {
          acc.push({
            month,
            campaigns: 1,
            budget: campaign.budget || 0,
            reach: campaign.actual_reach || 0,
          });
        }
        return acc;
      }, [] as Array<{ month: string; campaigns: number; budget: number; reach: number }>);

    return {
      totalBudget,
      totalReach,
      avgSuccessRate,
      costPerResult,
      roi,
      platformStats,
      trendData,
      totalCampaigns: campaigns.length,
      completedCampaigns: completedCampaigns.length,
    };
  }, [campaigns]);

  const exportAnalytics = () => {
    const csvContent = [
      ['Campaign Tracker Analytics Report', new Date().toLocaleDateString('en-GB')],
      [],
      ['Overview Metrics'],
      ['Total Campaigns', analytics.totalCampaigns],
      ['Completed Campaigns', analytics.completedCampaigns],
      ['Total Budget', `£${analytics.totalBudget.toFixed(2)}`],
      ['Total Reach', analytics.totalReach],
      ['Avg Success Rate', `${analytics.avgSuccessRate.toFixed(1)}%`],
      ['Cost Per Result', `£${analytics.costPerResult.toFixed(2)}`],
      ['ROI', `${analytics.roi.toFixed(1)}%`],
      [],
      ['Platform Breakdown'],
      ['Platform', 'Campaigns', 'Budget', 'Reach'],
      ...Object.entries(analytics.platformStats).map(([platform, stats]) => [
        platform,
        stats.count,
        `£${stats.budget.toFixed(2)}`,
        stats.reach,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const COLORS = ['#7c3aed', '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
            Campaign Analytics
          </h2>
          <p className="text-sm font-bold text-gray-600">
            Understand performance, trends, and ROI
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Selector */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            {[
              { value: 'overview', label: 'Overview' },
              { value: 'trends', label: 'Trends' },
              { value: 'comparison', label: 'Compare' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setView(tab.value as any)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  view === tab.value
                    ? 'bg-white text-amber-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            onClick={exportAnalytics}
            className="px-4 py-2 bg-white text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all border-2 border-gray-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      {view === 'overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* ROI Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 border-4 border-amber-500 shadow-brutal">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-black text-amber-700 uppercase tracking-wider">ROI</p>
                {analytics.roi >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </div>
              <p className="text-4xl font-black text-amber-600 mb-1">
                {analytics.roi >= 0 ? '+' : ''}
                {analytics.roi.toFixed(1)}%
              </p>
              <p className="text-xs font-bold text-amber-700">Return on investment</p>
            </div>

            {/* Cost Per Result */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-4 border-amber-500 shadow-brutal">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-black text-amber-700 uppercase tracking-wider">
                  Cost/Result
                </p>
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-4xl font-black text-amber-600 mb-1">
                £{analytics.costPerResult.toFixed(2)}
              </p>
              <p className="text-xs font-bold text-amber-700">Average cost per reach</p>
            </div>

            {/* Total Budget */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-4 border-green-500 shadow-brutal">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-black text-green-700 uppercase tracking-wider">
                  Total Budget
                </p>
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-4xl font-black text-green-600 mb-1">
                £{analytics.totalBudget.toLocaleString()}
              </p>
              <p className="text-xs font-bold text-green-700">Across all campaigns</p>
            </div>

            {/* Total Reach */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-4 border-orange-500 shadow-brutal">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-black text-orange-700 uppercase tracking-wider">
                  Total Reach
                </p>
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-4xl font-black text-orange-600 mb-1">
                {analytics.totalReach.toLocaleString()}
              </p>
              <p className="text-xs font-bold text-orange-700">Combined campaign reach</p>
            </div>
          </div>

          {/* Platform Performance */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border-4 border-black shadow-brutal">
            <h3 className="text-xl font-black text-gray-900 mb-6">Platform Performance</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(analytics.platformStats).map(([name, stats]) => ({
                        name,
                        value: stats.budget,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) =>
                        `${props.name} (${(props.percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.keys(analytics.platformStats).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `£${value.toFixed(2)}`}
                      contentStyle={{ borderRadius: '12px', border: '2px solid black' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Platform Stats Table */}
              <div className="space-y-3">
                {Object.entries(analytics.platformStats)
                  .sort((a, b) => b[1].budget - a[1].budget)
                  .map(([platform, stats]) => (
                    <div
                      key={platform}
                      className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-gray-900">{platform}</h4>
                        <span className="text-sm font-bold text-gray-600">
                          {stats.count} campaigns
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-bold">Budget</p>
                          <p className="text-gray-900 font-black">
                            £{stats.budget.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-bold">Reach</p>
                          <p className="text-gray-900 font-black">
                            {stats.reach.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Trends View */}
      {view === 'trends' && analytics.trendData.length > 0 && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border-4 border-black shadow-brutal">
          <h3 className="text-xl font-black text-gray-900 mb-6">Campaign Trends</h3>

          {/* Budget Trend */}
          <div className="mb-8">
            <h4 className="text-lg font-black text-gray-700 mb-4">Budget Over Time</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '2px solid black', fontWeight: 'bold' }}
                    formatter={(value: number) => `£${value.toLocaleString()}`}
                  />
                  <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                  <Line
                    type="monotone"
                    dataKey="budget"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ fill: '#7c3aed', r: 5 }}
                    name="Budget"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reach Trend */}
          <div>
            <h4 className="text-lg font-black text-gray-700 mb-4">Reach Over Time</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '2px solid black', fontWeight: 'bold' }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                  <Bar dataKey="reach" fill="#2563eb" name="Reach" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Comparison View */}
      {view === 'comparison' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border-4 border-black shadow-brutal">
          <h3 className="text-xl font-black text-gray-900 mb-6">
            Platform Comparison
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(analytics.platformStats).map(([platform, stats]) => ({
                  platform,
                  budget: stats.budget,
                  reach: stats.reach,
                  campaigns: stats.count,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="platform" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '2px solid black', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                <Bar dataKey="budget" fill="#7c3aed" name="Budget (£)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="reach" fill="#2563eb" name="Reach" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
