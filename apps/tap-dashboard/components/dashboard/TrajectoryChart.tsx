'use client';

import { Card } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrajectoryChartProps {
  data: Array<{
    day: number;
    coverageEvents: number;
    replyRate: number;
  }>;
}

export function TrajectoryChart({ data }: TrajectoryChartProps) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-postcraft-black mb-4">
        90-Day Trajectory
      </h3>
      {data.length === 0 ? (
        <p className="text-sm text-postcraft-gray-600">No trajectory data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontFamily: 'Inter', fontWeight: 600 }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px', fontFamily: 'Inter', fontWeight: 600 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '3px solid #000000',
                borderRadius: '12px',
                color: '#000000',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="coverageEvents"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="replyRate"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
