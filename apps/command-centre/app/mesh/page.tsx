/**
 * Agent Mesh OS Dashboard
 * Main entry point for mesh insight console
 */

import React from 'react';
import Link from 'next/link';

export default function MeshDashboardPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white/90 mb-2">Agent Mesh OS</h1>
          <p className="text-white/60">Multi-agent coordination and orchestration layer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/mesh/agents"
            className="
              bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20
              rounded-2xl p-6 transition-all duration-300
              hover:border-[#3AA9BE]/40 hover:shadow-lg hover:shadow-[#3AA9BE]/10
            "
          >
            <h3 className="text-xl font-semibold text-white/90 mb-2">🤖 Agents</h3>
            <p className="text-sm text-white/60">
              View registered agents, capabilities, and collaboration preferences
            </p>
          </Link>

          <Link
            href="/mesh/messages"
            className="
              bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20
              rounded-2xl p-6 transition-all duration-300
              hover:border-[#3AA9BE]/40 hover:shadow-lg hover:shadow-[#3AA9BE]/10
            "
          >
            <h3 className="text-xl font-semibold text-white/90 mb-2">💬 Messages</h3>
            <p className="text-sm text-white/60">
              Agent-to-agent message stream and communication logs
            </p>
          </Link>

          <Link
            href="/mesh/memory"
            className="
              bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20
              rounded-2xl p-6 transition-all duration-300
              hover:border-[#3AA9BE]/40 hover:shadow-lg hover:shadow-[#3AA9BE]/10
            "
          >
            <h3 className="text-xl font-semibold text-white/90 mb-2">🧠 Memory</h3>
            <p className="text-sm text-white/60">
              Shared workspace memory and episodic events
            </p>
          </Link>

          <Link
            href="/mesh/teams"
            className="
              bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20
              rounded-2xl p-6 transition-all duration-300
              hover:border-[#3AA9BE]/40 hover:shadow-lg hover:shadow-[#3AA9BE]/10
            "
          >
            <h3 className="text-xl font-semibold text-white/90 mb-2">👥 Teams</h3>
            <p className="text-sm text-white/60">
              Micro-teams and negotiation sessions
            </p>
          </Link>

          <Link
            href="/mesh/reasoning"
            className="
              bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20
              rounded-2xl p-6 transition-all duration-300
              hover:border-[#3AA9BE]/40 hover:shadow-lg hover:shadow-[#3AA9BE]/10
            "
          >
            <h3 className="text-xl font-semibold text-white/90 mb-2">🔮 Reasoning</h3>
            <p className="text-sm text-white/60">
              Cross-system reasoning cycles and opportunity detection
            </p>
          </Link>
        </div>

        <div className="mt-8 bg-[#3AA9BE]/10 border border-[#3AA9BE]/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white/90 mb-2">
            About Agent Mesh OS
          </h3>
          <p className="text-white/70 leading-relaxed mb-4">
            The Agent Mesh OS is a meta-coordination layer that sits above all intelligence
            subsystems (PR Autopilot, MAL, CoachOS, CIS, MIG, CMG, Identity Kernel, Scenes
            Engine, Core Awareness).
          </p>
          <p className="text-sm text-white/50">
            <strong>Key capabilities:</strong> Agent-to-agent messaging, shared memory,
            multi-agent teaming, negotiation, cross-system reasoning, opportunity detection,
            and non-binding action recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
