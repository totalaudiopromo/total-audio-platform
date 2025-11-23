'use client';

import React, { useEffect, useState } from 'react';

export default function MeshAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mesh/agents')
      .then((res) => res.json())
      .then((data) => {
        setAgents(data.agents || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black p-8 flex items-center justify-center">
      <div className="text-white/70">Loading agents...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white/90 mb-8">Mesh Agents</h1>

        <div className="grid gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-black/40 border border-[#3AA9BE]/20 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white/90">{agent.name}</h3>
                  <p className="text-sm text-[#3AA9BE]">{agent.profile.role}</p>
                </div>
                <span className="text-xs text-white/50">{agent.type}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/50 mb-1">Strengths</p>
                  <ul className="text-white/70 space-y-1">
                    {agent.profile.strengths.slice(0, 3).map((s: string, i: number) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-white/50 mb-1">Pairs Well With</p>
                  <ul className="text-white/70 space-y-1">
                    {agent.profile.collaborationPreferences.pairsWellWith.slice(0, 3).map((p: string, i: number) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
