/**
 * Mission Runs History Page
 */

export default async function RunsPage({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  const { missionId } = await params;

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Run History</h1>

        <div className="rounded-2xl border border-slate-700 bg-slate-800">
          <table className="w-full">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                  Run ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                  Trigger
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                  Started
                </th>
              </tr>
            </thead>
            <tbody>
              <RunRow
                id="run-123"
                trigger="Manual"
                status="succeeded"
                duration="2m 34s"
                started="2 hours ago"
              />
              <RunRow
                id="run-122"
                trigger="Schedule"
                status="partial"
                duration="1m 12s"
                started="1 day ago"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RunRow({
  id,
  trigger,
  status,
  duration,
  started,
}: {
  id: string;
  trigger: string;
  status: string;
  duration: string;
  started: string;
}) {
  const statusColors = {
    succeeded: 'text-green-400',
    failed: 'text-red-400',
    partial: 'text-yellow-400',
    running: 'text-blue-400',
  };

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-700/50">
      <td className="px-6 py-4 text-sm font-mono text-white">{id}</td>
      <td className="px-6 py-4 text-sm text-slate-300">{trigger}</td>
      <td className="px-6 py-4 text-sm">
        <span className={statusColors[status as keyof typeof statusColors]}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-300">{duration}</td>
      <td className="px-6 py-4 text-sm text-slate-400">{started}</td>
    </tr>
  );
}
