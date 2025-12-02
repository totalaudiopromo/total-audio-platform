'use client';

import { Card } from '../ui/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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
      <h3 className="text-lg font-bold text-foreground mb-4">90-Day Trajectory</h3>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No trajectory data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                borderRadius: '12px',
                color: '#1a1a2e',
                boxShadow: '4px 4px 0px rgba(0,0,0,1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="coverageEvents"
              stroke="#14b8a6"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="replyRate"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
