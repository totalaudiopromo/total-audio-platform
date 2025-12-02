'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// ========================================
// Types
// ========================================

export interface CampaignDataPoint {
  date: string;
  submissions: number;
  responses: number;
}

export interface CampaignChartProps {
  data: CampaignDataPoint[];
}

// ========================================
// Component
// ========================================

export default function CampaignChart({ data }: CampaignChartProps) {
  // Empty state handling
  if (!data || data.length === 0) {
    return (
      <div
        className="bg-white rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        role="region"
        aria-label="Campaign performance chart"
      >
        <h3 className="text-lg font-black text-gray-900 mb-4">
          Campaign Performance Over Time
        </h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 font-medium text-center">
            No performance data available yet.
            <br />
            <span className="text-sm">
              Start tracking campaigns to see trends.
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Calculate totals for summary
  const totalSubmissions = data.reduce((sum, d) => sum + d.submissions, 0);
  const totalResponses = data.reduce((sum, d) => sum + d.responses, 0);

  return (
    <div
      className="bg-white rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      role="region"
      aria-label="Campaign performance chart"
    >
      <h3 className="text-lg font-black text-gray-900 mb-4">
        Campaign Performance Over Time
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
            role="img"
            aria-label={`Line chart showing ${totalSubmissions} submissions and ${totalResponses} responses over ${data.length} data points`}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <YAxis
              allowDecimals={false}
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '2px solid black',
                fontWeight: 'bold',
              }}
            />
            <Legend wrapperStyle={{ fontWeight: 'bold' }} />
            <Line
              type="monotone"
              dataKey="submissions"
              stroke="#0d9488"
              strokeWidth={3}
              dot={{ fill: '#0d9488', r: 4 }}
              name="Submissions"
            />
            <Line
              type="monotone"
              dataKey="responses"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ fill: '#f97316', r: 4 }}
              name="Responses"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Screen reader accessible data table */}
      <table className="sr-only" aria-label="Campaign performance data">
        <thead>
          <tr>
            <th>Date</th>
            <th>Submissions</th>
            <th>Responses</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.date}>
              <td>{item.date}</td>
              <td>{item.submissions}</td>
              <td>{item.responses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
