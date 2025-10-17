"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ResponseRateChart({ data }: { data: { date: string; submissions: number; responses: number }[] }) {
  const points = data.map(d => ({ date: d.date, rate: d.submissions ? d.responses / d.submissions : 0 }));
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold mb-2">Response Rate Over Time</h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <AreaChart data={points} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} domain={[0, 1]} />
            <Tooltip formatter={(v: any) => `${Math.round((v as number) * 100)}%`} />
            <Area type="monotone" dataKey="rate" stroke="#22c55e" fillOpacity={1} fill="url(#colorRate)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}












