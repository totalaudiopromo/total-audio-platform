'use client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ========================================
// Types
// ========================================

export interface ResponseRateDataPoint {
  date: string;
  submissions: number;
  responses: number;
}

export interface ResponseRateChartProps {
  data: ResponseRateDataPoint[];
}

interface RatePoint {
  date: string;
  rate: number;
}

// ========================================
// Component
// ========================================

export default function ResponseRateChart({ data }: ResponseRateChartProps) {
  // Empty state handling
  if (!data || data.length === 0) {
    return (
      <div
        className="bg-white rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        role="region"
        aria-label="Response rate chart"
      >
        <h3 className="text-lg font-black text-gray-900 mb-4">
          Response Rate Over Time
        </h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 font-medium text-center">
            No response data available yet.
            <br />
            <span className="text-sm">
              Track submissions to see response rates.
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Transform data to rate points
  const points: RatePoint[] = data.map(d => ({
    date: d.date,
    rate: d.submissions > 0 ? d.responses / d.submissions : 0,
  }));

  // Calculate average rate for aria-label
  const avgRate =
    points.length > 0
      ? points.reduce((sum, p) => sum + p.rate, 0) / points.length
      : 0;

  // Format rate for tooltip
  const formatRate = (value: number): string => {
    return `${Math.round(value * 100)}%`;
  };

  return (
    <div
      className="bg-white rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      role="region"
      aria-label="Response rate chart"
    >
      <h3 className="text-lg font-black text-gray-900 mb-4">
        Response Rate Over Time
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <AreaChart
            data={points}
            margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
            role="img"
            aria-label={`Area chart showing response rate over ${points.length} periods, averaging ${formatRate(avgRate)}`}
          >
            <defs>
              <linearGradient id="colourRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <YAxis
              tickFormatter={formatRate}
              domain={[0, 1]}
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '2px solid black',
                fontWeight: 'bold',
              }}
              formatter={(value: number) => formatRate(value)}
              labelFormatter={(label: string) => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#0d9488"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colourRate)"
              name="Response Rate"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Screen reader accessible data table */}
      <table className="sr-only" aria-label="Response rate data">
        <thead>
          <tr>
            <th>Date</th>
            <th>Response Rate</th>
          </tr>
        </thead>
        <tbody>
          {points.map(item => (
            <tr key={item.date}>
              <td>{item.date}</td>
              <td>{formatRate(item.rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
