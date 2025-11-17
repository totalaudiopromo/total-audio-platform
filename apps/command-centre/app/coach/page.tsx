/**
 * CoachOS Dashboard
 * Main coaching dashboard page
 */

import React from 'react';
import Link from 'next/link';

export default function CoachDashboardPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white/90 mb-2">CoachOS</h1>
          <p className="text-white/60">Your intelligent coaching environment</p>
        </div>

        {/* Quick Nav */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/coach/weekly"
            className="
              bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20
              rounded-2xl p-6 transition-all duration-300
              hover:border-[#3AA9BE]/40 hover:shadow-lg hover:shadow-[#3AA9BE]/10
            "
          >
            <h3 className="text-xl font-semibold text-white/90 mb-2">📅 Weekly Plan</h3>
            <p className="text-sm text-white/60">
              View and manage your current week's coaching plan
            </p>
          </Link>

          <Link
            href="/coach/goals"
            className="
              bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20
              rounded-2xl p-6 transition-all duration-300
              hover:border-[#3AA9BE]/40 hover:shadow-lg hover:shadow-[#3AA9BE]/10
            "
          >
            <h3 className="text-xl font-semibold text-white/90 mb-2">🎯 Goals</h3>
            <p className="text-sm text-white/60">
              Set and track your long-term and short-term goals
            </p>
          </Link>

          <Link
            href="/coach/insights"
            className="
              bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20
              rounded-2xl p-6 transition-all duration-300
              hover:border-[#3AA9BE]/40 hover:shadow-lg hover:shadow-[#3AA9BE]/10
            "
          >
            <h3 className="text-xl font-semibold text-white/90 mb-2">💡 Insights</h3>
            <p className="text-sm text-white/60">
              AI-generated insights for your growth and development
            </p>
          </Link>

          <Link
            href="/coach/history"
            className="
              bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20
              rounded-2xl p-6 transition-all duration-300
              hover:border-[#3AA9BE]/40 hover:shadow-lg hover:shadow-[#3AA9BE]/10
            "
          >
            <h3 className="text-xl font-semibold text-white/90 mb-2">📊 Progress</h3>
            <p className="text-sm text-white/60">
              View your progress history and growth trends
            </p>
          </Link>

          <Link
            href="/coach/settings"
            className="
              bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20
              rounded-2xl p-6 transition-all duration-300
              hover:border-[#3AA9BE]/40 hover:shadow-lg hover:shadow-[#3AA9BE]/10
            "
          >
            <h3 className="text-xl font-semibold text-white/90 mb-2">⚙️ Settings</h3>
            <p className="text-sm text-white/60">
              Configure your coaching profile and preferences
            </p>
          </Link>
        </div>

        {/* Info */}
        <div className="bg-[#3AA9BE]/10 border border-[#3AA9BE]/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white/90 mb-2">
            Welcome to CoachOS
          </h3>
          <p className="text-white/70 leading-relaxed mb-4">
            CoachOS is your intelligent coaching environment for artists, PR agencies, and
            managers. It provides weekly plans, progress tracking, goal-setting frameworks,
            and personalized insights to help you grow.
          </p>
          <p className="text-sm text-white/50">
            <strong>Note:</strong> CoachOS provides guidance only. It does not send emails,
            manage contacts, or perform automations - it focuses purely on coaching and
            planning.
          </p>
        </div>
      </div>
    </div>
  );
}
