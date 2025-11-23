/**
 * Mission Cockpit Page
 *
 * Main control center for a mission.
 */

import Link from 'next/link';

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  const { missionId } = await params;

  // TODO: Fetch mission data
  // const mission = await fetch(`/api/autopilot/missions/${missionId}`).then(r => r.json());

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/autopilot"
            className="mb-4 inline-flex items-center text-sm text-slate-400 hover:text-[#3AA9BE]"
          >
            ← Back to missions
          </Link>
          <h1 className="text-3xl font-bold text-white">Album Launch Campaign</h1>
          <div className="mt-2 flex gap-3">
            <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
              Active
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400">
              Suggest Mode
            </span>
          </div>
        </div>

        {/* Main Actions */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <button className="rounded-xl bg-[#3AA9BE] px-6 py-4 font-semibold text-white transition-all duration-240 hover:bg-[#3AA9BE]/90">
            Run Autopilot
          </button>
          <button className="rounded-xl border border-slate-700 px-6 py-4 text-white transition-all duration-240 hover:bg-slate-700">
            Simulate
          </button>
          <button className="rounded-xl border border-slate-700 px-6 py-4 text-white transition-all duration-240 hover:bg-slate-700">
            Pause
          </button>
          <Link
            href={`/autopilot/${missionId}/tasks`}
            className="flex items-center justify-center rounded-xl border border-slate-700 px-6 py-4 text-white transition-all duration-240 hover:bg-slate-700"
          >
            View Tasks
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Status Panel */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Mission Status</h2>
            <div className="space-y-3">
              <StatusRow label="Pending Tasks" value="3" />
              <StatusRow label="Completed Tasks" value="12" />
              <StatusRow label="Last Run" value="2 hours ago" />
              <StatusRow label="Next Scheduled" value="In 4 hours" />
            </div>
          </div>

          {/* Latest Analysis */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Latest Analysis</h2>
            <div className="space-y-3 text-sm text-slate-300">
              <p>✓ Contact pool validated (247 contacts)</p>
              <p>✓ Pitch variations generated (3 variants)</p>
              <p>⏳ Awaiting approval for send schedule</p>
            </div>
          </div>

          {/* Policy & Safety */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Policy & Safety
            </h2>
            <div className="space-y-3">
              <PolicyRow label="Max emails/day" value="50" />
              <PolicyRow label="Quiet hours" value="22:00 - 08:00" />
              <PolicyRow label="Contact fatigue" value="14 days" />
            </div>
          </div>

          {/* Upcoming Actions */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Upcoming Actions
            </h2>
            <div className="space-y-3">
              <ActionItem
                action="Schedule 50 emails"
                status="Awaiting approval"
                time="Ready now"
              />
              <ActionItem
                action="Follow-up wave"
                status="Scheduled"
                time="In 3 days"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

function PolicyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function ActionItem({
  action,
  status,
  time,
}: {
  action: string;
  status: string;
  time: string;
}) {
  return (
    <div className="border-l-2 border-[#3AA9BE] pl-4">
      <div className="text-sm font-medium text-white">{action}</div>
      <div className="mt-1 text-xs text-slate-400">
        {status} · {time}
      </div>
    </div>
  );
}
