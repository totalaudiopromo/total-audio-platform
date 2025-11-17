/**
 * PR Autopilot Overview Page
 *
 * Lists all missions for the current user/workspace.
 */

import Link from 'next/link';

export default async function AutopilotPage() {
  // TODO: Fetch missions from API
  // const missions = await fetch('/api/autopilot/missions').then(r => r.json());

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">PR Autopilot</h1>
            <p className="mt-2 text-slate-400">
              Multi-agent campaign orchestration
            </p>
          </div>
          <Link
            href="/autopilot/new"
            className="rounded-2xl bg-[#3AA9BE] px-6 py-3 font-semibold text-white transition-all duration-240 hover:bg-[#3AA9BE]/90"
          >
            New Mission
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <select className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-white">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Paused</option>
            <option>Completed</option>
          </select>
          <select className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-white">
            <option>All Modes</option>
            <option>Suggest</option>
            <option>Semi-auto</option>
            <option>Full-auto</option>
          </select>
        </div>

        {/* Missions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder mission cards */}
          <MissionCard
            id="mission-1"
            title="Album Launch Campaign"
            status="active"
            mode="suggest"
            lastRun="2 hours ago"
          />
          <MissionCard
            id="mission-2"
            title="Single Release Push"
            status="paused"
            mode="semi_auto"
            lastRun="1 day ago"
          />
        </div>

        {/* Empty State */}
        <div className="mt-12 text-center">
          <p className="text-slate-500">
            No missions yet.{' '}
            <Link href="/autopilot/new" className="text-[#3AA9BE] hover:underline">
              Create your first mission
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function MissionCard({
  id,
  title,
  status,
  mode,
  lastRun,
}: {
  id: string;
  title: string;
  status: string;
  mode: string;
  lastRun: string;
}) {
  const statusColors = {
    active: 'bg-green-500',
    paused: 'bg-yellow-500',
    completed: 'bg-blue-500',
    failed: 'bg-red-500',
  };

  return (
    <Link href={`/autopilot/${id}`}>
      <div className="cursor-pointer rounded-2xl border border-slate-700 bg-slate-800 p-6 transition-all duration-240 hover:border-[#3AA9BE]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <span
            className={`h-3 w-3 rounded-full ${
              statusColors[status as keyof typeof statusColors]
            }`}
          />
        </div>
        <div className="space-y-2 text-sm text-slate-400">
          <div className="flex justify-between">
            <span>Mode:</span>
            <span className="text-white">{mode}</span>
          </div>
          <div className="flex justify-between">
            <span>Last run:</span>
            <span className="text-white">{lastRun}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
