'use client';

import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface TrajectoryForecastProps {
  forecast: Record<string, any>;
  opportunityWindows: Array<{
    start: string;
    end: string;
    reason: string;
  }>;
  riskIndicators: string[];
  confidence: number;
}

export function TrajectoryForecast({ forecast, opportunityWindows, riskIndicators, confidence }: TrajectoryForecastProps) {
  const forecastData = Object.entries(forecast).map(([day, metrics]: [string, any]) => ({
    day: parseInt(day.replace('day_', '')),
    ...metrics,
  }));

  return (
    <div className="space-y-6">
      {/* Forecast Chart */}
      <Card>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-postcraft-black">
            90-Day Forecast
          </h3>
          <Badge variant="info">{(confidence * 100).toFixed(0)}% confidence</Badge>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={forecastData}>
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
            <Area
              type="monotone"
              dataKey="coverageEvents"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="replyRate"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.2}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Opportunity Windows */}
      <Card>
        <h3 className="text-lg font-bold text-postcraft-black mb-4">
          Opportunity Windows
        </h3>
        <div className="space-y-3">
          {opportunityWindows.map((window, i) => (
            <div
              key={i}
              className="p-4 bg-green-50 rounded-lg border-2 border-green-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs text-green-700 font-bold">
                  {window.start} → {window.end}
                </p>
              </div>
              <p className="text-sm text-postcraft-gray-900 font-medium">{window.reason}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Risk Indicators */}
      {riskIndicators.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold text-postcraft-black mb-4">
            Risk Indicators
          </h3>
          <ul className="space-y-2">
            {riskIndicators.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-postcraft-gray-900 font-medium">
                <span className="text-red-600 font-bold">!</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
