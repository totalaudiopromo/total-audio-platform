'use client';

/**
 * Cohorts Dashboard
 * Interactive cohort retention analysis with heatmap and charts
 */

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

interface CohortData {
  cohortDate: string;
  totalUsers: number;
  retention: {
    day1: number;
    day7: number;
    day14: number;
    day30: number;
    week1: number;
    week2: number;
    week4: number;
    week8: number;
    week12: number;
    month1: number;
    month2: number;
    month3: number;
    month6: number;
    month12: number;
  };
  revenue: {
    total: number;
    perUser: number;
    byMonth: Array<{ month: string; amount: number }>;
  };
}

interface CohortsResponse {
  cohorts: CohortData[];
  summary: {
    totalCohorts: number;
    totalUsers: number;
    averageRetention: {
      day7: number;
      day30: number;
      month3: number;
    };
    totalRevenue: number;
  };
}

export default function CohortsPage() {
  const [data, setData] = useState<CohortsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodType, setPeriodType] = useState<'day' | 'week' | 'month' | 'all'>('week');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCohortData();
  }, [periodType]);

  const fetchCohortData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/cohorts?periodType=${periodType}&limit=12`);

      if (!response.ok) {
        throw new Error('Failed to fetch cohort data');
      }

      const cohortData: CohortsResponse = await response.json();
      setData(cohortData);
    } catch (err: any) {
      setError(err.message);
      console.error('Cohort fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRetentionColour = (rate: number): string => {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 60) return 'bg-green-400';
    if (rate >= 40) return 'bg-orange-400';
    if (rate >= 20) return 'bg-orange-500';
    if (rate > 0) return 'bg-red-400';
    return 'bg-gray-200';
  };

  const getRetentionTextColour = (rate: number): string => {
    return rate > 50 ? 'text-white' : 'text-gray-900';
  };

  const exportToCSV = () => {
    if (!data) return;

    const headers = [
      'Cohort Date',
      'Total Users',
      'Day 1',
      'Day 7',
      'Day 30',
      'Week 1',
      'Week 4',
      'Month 1',
      'Month 3',
      'Revenue Total',
      'Revenue Per User',
    ];

    const rows = data.cohorts.map(cohort => [
      cohort.cohortDate,
      cohort.totalUsers,
      cohort.retention.day1 || 0,
      cohort.retention.day7 || 0,
      cohort.retention.day30 || 0,
      cohort.retention.week1 || 0,
      cohort.retention.week4 || 0,
      cohort.retention.month1 || 0,
      cohort.retention.month3 || 0,
      (cohort.revenue.total / 100).toFixed(2),
      (cohort.revenue.perUser / 100).toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cohort-retention-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Cohort Data</h2>
            <p className="text-gray-600">{error}</p>
            <Button onClick={fetchCohortData} className="mt-4">
              Retry
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!data || data.cohorts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">No Cohort Data Available</h2>
            <p className="text-gray-600">
              Cohort data will appear once users have been assigned to cohorts.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Run{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                npx tsx scripts/cohort-refresh.ts
              </code>{' '}
              to generate cohort metrics.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cohort Retention</h1>
            <p className="text-gray-600 mt-1">User retention analysis by signup cohort</p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={periodType}
              onChange={e => setPeriodType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="day">Daily View</option>
              <option value="week">Weekly View</option>
              <option value="month">Monthly View</option>
              <option value="all">All Periods</option>
            </select>

            <Button onClick={exportToCSV} variant="outline">
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-gray-600">Total Cohorts</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{data.summary.totalCohorts}</div>
          </Card>

          <Card className="p-4">
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {data.summary.totalUsers.toLocaleString()}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm text-gray-600">Avg 30-Day Retention</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {data.summary.averageRetention.day30.toFixed(1)}%
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              £{(data.summary.totalRevenue / 100).toLocaleString()}
            </div>
          </Card>
        </div>

        {/* Retention Heatmap */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Retention Heatmap</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b-2 border-gray-300 bg-gray-50">Cohort</th>
                  <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">Users</th>
                  {periodType === 'day' || periodType === 'all' ? (
                    <>
                      <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">D1</th>
                      <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">D7</th>
                      <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">D14</th>
                      <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">D30</th>
                    </>
                  ) : null}
                  {periodType === 'week' || periodType === 'all' ? (
                    <>
                      <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">W1</th>
                      <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">W2</th>
                      <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">W4</th>
                      <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">W8</th>
                    </>
                  ) : null}
                  {periodType === 'month' || periodType === 'all' ? (
                    <>
                      <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">M1</th>
                      <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">M2</th>
                      <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">M3</th>
                      <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">M6</th>
                    </>
                  ) : null}
                  <th className="text-center p-2 border-b-2 border-gray-300 bg-gray-50">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.cohorts.map(cohort => (
                  <tr key={cohort.cohortDate} className="hover:bg-gray-50">
                    <td className="p-2 border-b border-gray-200 font-medium">
                      {new Date(cohort.cohortDate).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-2 border-b border-gray-200 text-center">
                      {cohort.totalUsers}
                    </td>

                    {/* Day retention cells */}
                    {(periodType === 'day' || periodType === 'all') && (
                      <>
                        <td className="p-2 border-b border-gray-200">
                          <div
                            className={`${getRetentionColour(cohort.retention.day1)} ${getRetentionTextColour(cohort.retention.day1)} px-2 py-1 rounded text-center font-semibold`}
                          >
                            {cohort.retention.day1.toFixed(0)}%
                          </div>
                        </td>
                        <td className="p-2 border-b border-gray-200">
                          <div
                            className={`${getRetentionColour(cohort.retention.day7)} ${getRetentionTextColour(cohort.retention.day7)} px-2 py-1 rounded text-center font-semibold`}
                          >
                            {cohort.retention.day7.toFixed(0)}%
                          </div>
                        </td>
                        <td className="p-2 border-b border-gray-200">
                          <div
                            className={`${getRetentionColour(cohort.retention.day14)} ${getRetentionTextColour(cohort.retention.day14)} px-2 py-1 rounded text-center font-semibold`}
                          >
                            {cohort.retention.day14.toFixed(0)}%
                          </div>
                        </td>
                        <td className="p-2 border-b border-gray-200">
                          <div
                            className={`${getRetentionColour(cohort.retention.day30)} ${getRetentionTextColour(cohort.retention.day30)} px-2 py-1 rounded text-center font-semibold`}
                          >
                            {cohort.retention.day30.toFixed(0)}%
                          </div>
                        </td>
                      </>
                    )}

                    {/* Week retention cells */}
                    {(periodType === 'week' || periodType === 'all') && (
                      <>
                        <td className="p-2 border-b border-gray-200">
                          <div
                            className={`${getRetentionColour(cohort.retention.week1)} ${getRetentionTextColour(cohort.retention.week1)} px-2 py-1 rounded text-center font-semibold`}
                          >
                            {cohort.retention.week1.toFixed(0)}%
                          </div>
                        </td>
                        <td className="p-2 border-b border-gray-200">
                          <div
                            className={`${getRetentionColour(cohort.retention.week2)} ${getRetentionTextColour(cohort.retention.week2)} px-2 py-1 rounded text-center font-semibold`}
                          >
                            {cohort.retention.week2.toFixed(0)}%
                          </div>
                        </td>
                        <td className="p-2 border-b border-gray-200">
                          <div
                            className={`${getRetentionColour(cohort.retention.week4)} ${getRetentionTextColour(cohort.retention.week4)} px-2 py-1 rounded text-center font-semibold`}
                          >
                            {cohort.retention.week4.toFixed(0)}%
                          </div>
                        </td>
                        <td className="p-2 border-b border-gray-200">
                          <div
                            className={`${getRetentionColour(cohort.retention.week8)} ${getRetentionTextColour(cohort.retention.week8)} px-2 py-1 rounded text-center font-semibold`}
                          >
                            {cohort.retention.week8.toFixed(0)}%
                          </div>
                        </td>
                      </>
                    )}

                    {/* Month retention cells */}
                    {(periodType === 'month' || periodType === 'all') && (
                      <>
                        <td className="p-2 border-b border-gray-200">
                          <div
                            className={`${getRetentionColour(cohort.retention.month1)} ${getRetentionTextColour(cohort.retention.month1)} px-2 py-1 rounded text-center font-semibold`}
                          >
                            {cohort.retention.month1.toFixed(0)}%
                          </div>
                        </td>
                        <td className="p-2 border-b border-gray-200">
                          <div
                            className={`${getRetentionColour(cohort.retention.month2)} ${getRetentionTextColour(cohort.retention.month2)} px-2 py-1 rounded text-center font-semibold`}
                          >
                            {cohort.retention.month2.toFixed(0)}%
                          </div>
                        </td>
                        <td className="p-2 border-b border-gray-200">
                          <div
                            className={`${getRetentionColour(cohort.retention.month3)} ${getRetentionTextColour(cohort.retention.month3)} px-2 py-1 rounded text-center font-semibold`}
                          >
                            {cohort.retention.month3.toFixed(0)}%
                          </div>
                        </td>
                        <td className="p-2 border-b border-gray-200">
                          <div
                            className={`${getRetentionColour(cohort.retention.month6)} ${getRetentionTextColour(cohort.retention.month6)} px-2 py-1 rounded text-center font-semibold`}
                          >
                            {cohort.retention.month6.toFixed(0)}%
                          </div>
                        </td>
                      </>
                    )}

                    <td className="p-2 border-b border-gray-200 text-center font-medium">
                      £{(cohort.revenue.total / 100).toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="font-medium text-gray-700">Retention Rate:</div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
              <span>80%+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-400 rounded"></div>
              <span>60-79%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-400 rounded"></div>
              <span>40-59%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded"></div>
              <span>20-39%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-400 rounded"></div>
              <span>&lt;20%</span>
            </div>
          </div>
        </Card>

        {/* Revenue by Cohort Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Revenue by Cohort</h2>

          <div className="space-y-3">
            {data.cohorts.map(cohort => {
              const maxRevenue = Math.max(...data.cohorts.map(c => c.revenue.total));
              const widthPercentage =
                maxRevenue > 0 ? (cohort.revenue.total / maxRevenue) * 100 : 0;

              return (
                <div key={cohort.cohortDate} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-gray-700">
                    {new Date(cohort.cohortDate).toLocaleDateString('en-GB', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="bg-blue-500 h-8 flex items-center justify-end pr-3 text-white text-sm font-semibold transition-all duration-500"
                      style={{ width: `${widthPercentage}%` }}
                    >
                      {widthPercentage > 15 && `£${(cohort.revenue.total / 100).toFixed(0)}`}
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm text-gray-600">
                    £{(cohort.revenue.perUser / 100).toFixed(2)}/user
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
