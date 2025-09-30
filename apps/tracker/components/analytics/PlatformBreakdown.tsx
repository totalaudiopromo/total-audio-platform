"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function PlatformBreakdown({ data }: { data: { platform: string; submissions: number; responses: number; acceptanceRate: number }[] }) {
  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#eab308'];
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold mb-2">Platform Effectiveness</h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="submissions" nameKey="platform" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any, name: any, props: any) => {
              const item = props?.payload as any;
              const rate = Math.round((item.acceptanceRate || 0) * 100);
              return [`${value} submissions`, `${item.platform} · ${rate}% accepted`];
            }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}




