'use client';

import { useEffect, useState } from 'react';

interface MetricsData {
  period: string;
  metrics: {
    revenue: {
      mrr_gbp: string;
      arr_gbp: string;
      activeSubscriptions: number;
    };
    users: {
      total: number;
      new: number;
      active: number;
      activeRate: string;
    };
    enrichments: {
      total: number;
      successful: number;
      successRate: string;
      avgContactsPerEnrichment: string;
      totalContactsEnriched: number;
    };
    engagement: {
      dau: number;
      wau: number;
      stickinessRatio: string;
    };
  };
  topUsers: Array<{
    userId: string;
    email: string;
    enrichments: number;
    exports: number;
  }>;
  recentPayments: Array<{
    id: string;
    userEmail: string;
    amount: string;
    planName: string;
    status: string;
    paidAt: string;
  }>;
  generatedAt: string;
}

export default function AdminMetricsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchMetrics();
  }, [days]);

  async function fetchMetrics() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/metrics?days=${days}`);
      const data = await response.json();

      if (data.success) {
        setMetrics(data);
      } else {
        setError(data.error || 'Failed to fetch metrics');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Metrics Dashboard</h1>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Metrics Dashboard</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold">Error loading metrics</p>
            <p className="text-red-500 text-sm mt-2">{error}</p>
            <button
              onClick={fetchMetrics}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Metrics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {metrics.period} • Generated: {new Date(metrics.generatedAt).toLocaleString()}
            </p>
          </div>

          {/* Period selector */}
          <select
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">
              Monthly Recurring Revenue
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              £{metrics.metrics.revenue.mrr_gbp}
            </p>
            <p className="text-sm text-gray-500 mt-1">ARR: £{metrics.metrics.revenue.arr_gbp}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Active Subscriptions</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {metrics.metrics.revenue.activeSubscriptions}
            </p>
            <p className="text-sm text-gray-500 mt-1">Paying customers</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total Revenue</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              £{(parseFloat(metrics.metrics.revenue.mrr_gbp) * (days / 30)).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">For selected period</p>
          </div>
        </div>

        {/* User Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.metrics.users.total}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">New Users</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{metrics.metrics.users.new}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Active Users</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{metrics.metrics.users.active}</p>
            <p className="text-sm text-gray-500 mt-1">
              {metrics.metrics.users.activeRate} of total
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Stickiness (DAU/WAU)</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {metrics.metrics.engagement.stickinessRatio}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              DAU: {metrics.metrics.engagement.dau} / WAU: {metrics.metrics.engagement.wau}
            </p>
          </div>
        </div>

        {/* Enrichment Metrics */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Enrichment Performance</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase">Total Enrichments</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {metrics.metrics.enrichments.total}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase">Success Rate</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {metrics.metrics.enrichments.successRate}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {metrics.metrics.enrichments.successful} successful
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase">
                Avg Contacts/Enrichment
              </h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {metrics.metrics.enrichments.avgContactsPerEnrichment}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase">
                Total Contacts Enriched
              </h3>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {metrics.metrics.enrichments.totalContactsEnriched}
              </p>
            </div>
          </div>
        </div>

        {/* Two column layout for tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Users */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Top Users by Activity</h2>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500">
                    <th className="pb-3">User</th>
                    <th className="pb-3 text-right">Enrichments</th>
                    <th className="pb-3 text-right">Exports</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {metrics.topUsers.map((user, idx) => (
                    <tr key={user.userId} className="border-t border-gray-100">
                      <td className="py-3 font-medium text-gray-900">{user.email}</td>
                      <td className="py-3 text-right text-gray-600">{user.enrichments}</td>
                      <td className="py-3 text-right text-gray-600">{user.exports}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {metrics.recentPayments.map((payment, idx) => (
                    <tr key={payment.id} className="border-t border-gray-100">
                      <td className="py-3 font-medium text-gray-900">{payment.userEmail}</td>
                      <td className="py-3 text-gray-600">{payment.planName}</td>
                      <td className="py-3 text-right font-semibold text-green-600">
                        {payment.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Refresh button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchMetrics}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Metrics
          </button>
        </div>
      </div>
    </div>
  );
}
