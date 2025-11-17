/**
 * Unified Dashboard - Main Page
 *
 * Single-screen view of all Total Audio data powered by Fusion Layer
 */

import { createClient } from '@total-audio/core-db/server';
import { buildFusionContext } from '@total-audio/fusion-layer';
import { suggestNextActions, detectPatterns } from '@total-audio/ai-skills';
import { OverviewCards } from './components/OverviewCards';
import { AIInsightsPanel } from './components/AIInsightsPanel';
import { NextActionsWidget } from './components/NextActionsWidget';
import { PatternHighlights } from './components/PatternHighlights';
import { RealtimeFeed } from './components/RealtimeFeed';
import { QuickActions } from './components/QuickActions';

export const dynamic = 'force-dynamic';

export default async function UnifiedDashboardPage() {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Please sign in to view dashboard</p>
      </div>
    );
  }

  // Build fusion context (loads ALL data in parallel)
  const fusionContext = await buildFusionContext(supabase, user.id);

  // Run AI skills
  const [nextActionsResult, patternsResult] = await Promise.all([
    suggestNextActions({
      context: fusionContext,
      params: { limit: 10 },
      userId: user.id,
    }),
    detectPatterns({
      context: fusionContext,
      params: {},
      userId: user.id,
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Unified Dashboard</h1>
              <p className="mt-1 text-sm text-zinc-400">
                AI-powered intelligence across all Total Audio apps
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>Load time: {fusionContext.metadata.loadTime}ms</span>
              <span>•</span>
              <span>{fusionContext.metadata.sources.length} sources</span>
              {fusionContext.metadata.errors.length > 0 && (
                <>
                  <span>•</span>
                  <span className="text-amber-500">
                    {fusionContext.metadata.errors.length} errors
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Overview Cards */}
        <OverviewCards context={fusionContext} />

        {/* AI Insights & Next Actions Row */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <AIInsightsPanel patterns={patternsResult.data} />
          <NextActionsWidget actions={nextActionsResult.data?.actions || []} />
        </div>

        {/* Pattern Highlights */}
        {patternsResult.data && patternsResult.data.patterns.length > 0 && (
          <div className="mt-8">
            <PatternHighlights patterns={patternsResult.data.patterns} />
          </div>
        )}

        {/* Quick Actions & Realtime Feed */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <QuickActions context={fusionContext} />
          </div>
          <div className="lg:col-span-2">
            <RealtimeFeed context={fusionContext} />
          </div>
        </div>

        {/* Feature Links */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-white">All Features</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Community Hub', href: '/dashboard/community', color: 'cyan' },
              { name: 'Asset Drop', href: '/dashboard/assets', color: 'blue' },
              { name: 'Email Campaigns', href: '/dashboard/email', color: 'purple' },
              { name: 'List Builder', href: '/dashboard/lists', color: 'pink' },
              { name: 'Release Planner', href: '/dashboard/releases', color: 'green' },
              { name: 'Contact Intel', href: '/dashboard/contact-intel', color: 'amber' },
              { name: 'Press Kit Intel', href: '/dashboard/presskit-intel', color: 'orange' },
              { name: 'Writer\'s Room', href: '/dashboard/writers-room', color: 'red' },
              { name: 'Reply Intel', href: '/dashboard/reply-intel', color: 'indigo' },
              { name: 'Campaign Simulator', href: '/dashboard/simulator', color: 'violet' },
              { name: 'Industry Calendar', href: '/dashboard/calendar', color: 'teal' },
              { name: 'Coverage Map', href: '/dashboard/coverage', color: 'emerald' },
            ].map((feature) => (
              <a
                key={feature.name}
                href={feature.href}
                className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-[#3AA9BE] hover:bg-zinc-900"
              >
                <h3 className="font-medium text-white group-hover:text-[#3AA9BE]">
                  {feature.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  →
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
