'use client';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

// ========================================
// Types
// ========================================

export interface PlatformData {
  platform: string;
  submissions: number;
  responses: number;
  acceptanceRate: number;
  [key: string]: string | number;
}

export interface PlatformBreakdownProps {
  data: PlatformData[];
}

// ========================================
// Constants
// ========================================

const COLOURS = [
  '#0d9488', // teal
  '#f97316', // orange
  '#2563eb', // blue
  '#7c3aed', // purple
  '#ec4899', // pink
  '#eab308', // yellow
  '#10b981', // emerald
  '#6366f1', // indigo
  '#14b8a6', // cyan
  '#f43f5e', // rose
] as const;

// ========================================
// Component
// ========================================

export default function PlatformBreakdown({ data }: PlatformBreakdownProps) {
  // Empty state handling
  if (!data || data.length === 0) {
    return (
      <div
        className="bg-white rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        role="region"
        aria-label="Platform effectiveness chart"
      >
        <h3 className="text-lg font-black text-gray-900 mb-4">
          Platform Effectiveness
        </h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 font-medium text-center">
            No platform data available yet.
            <br />
            <span className="text-sm">
              Add submissions to see platform breakdown.
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Custom label renderer with proper types
  const renderLabel = (props: PieLabelRenderProps): string => {
    const { name, percent } = props;
    const percentValue = typeof percent === 'number' ? percent : 0;
    return `${name} (${(percentValue * 100).toFixed(0)}%)`;
  };

  // Custom tooltip formatter
  const formatTooltip = (value: number): string => {
    return `${value} submissions`;
  };

  return (
    <div
      className="bg-white rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      role="region"
      aria-label="Platform effectiveness chart"
    >
      <h3 className="text-lg font-black text-gray-900 mb-4">
        Platform Effectiveness
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart
            role="img"
            aria-label="Pie chart showing submissions by platform"
          >
            <Pie
              data={data}
              dataKey="submissions"
              nameKey="platform"
              outerRadius={80}
              label={renderLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.platform}-${index}`}
                  fill={COLOURS[index % COLOURS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '2px solid black',
                fontWeight: 'bold',
              }}
              formatter={formatTooltip}
            />
            <Legend wrapperStyle={{ fontWeight: 'bold' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Screen reader accessible data table */}
      <table className="sr-only" aria-label="Platform breakdown data">
        <thead>
          <tr>
            <th>Platform</th>
            <th>Submissions</th>
            <th>Responses</th>
            <th>Acceptance Rate</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.platform}>
              <td>{item.platform}</td>
              <td>{item.submissions}</td>
              <td>{item.responses}</td>
              <td>{Math.round(item.acceptanceRate * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
