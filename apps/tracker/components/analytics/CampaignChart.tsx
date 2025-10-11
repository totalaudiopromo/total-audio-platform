"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CampaignChart({ data }: { data: { date: string; submissions: number; responses: number }[] }) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold mb-2">Campaign Performance Over Time</h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="submissions" stroke="#3b82f6" strokeWidth={2} dot={false} name="Submissions" />
            <Line type="monotone" dataKey="responses" stroke="#22c55e" strokeWidth={2} dot={false} name="Responses" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}







