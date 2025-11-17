/**
 * Mission Tasks Page
 *
 * Kanban-style view of tasks grouped by status.
 */

export default async function TasksPage({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  const { missionId } = await params;

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Tasks</h1>

        <div className="grid gap-6 md:grid-cols-4">
          <TaskColumn
            title="Pending"
            tasks={[
              {
                id: 'task-1',
                agent: 'scheduler',
                type: 'propose_send_schedule',
                priority: 10,
              },
            ]}
          />
          <TaskColumn
            title="In Progress"
            tasks={[
              {
                id: 'task-2',
                agent: 'contact',
                type: 'build_contact_pool',
                priority: 10,
              },
            ]}
          />
          <TaskColumn
            title="Waiting Approval"
            tasks={[
              {
                id: 'task-3',
                agent: 'scheduler',
                type: 'execute_send_schedule',
                priority: 15,
              },
            ]}
          />
          <TaskColumn title="Completed" tasks={[]} />
        </div>
      </div>
    </div>
  );
}

function TaskColumn({
  title,
  tasks,
}: {
  title: string;
  tasks: Array<{
    id: string;
    agent: string;
    type: string;
    priority: number;
  }>;
}) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({
  task,
}: {
  task: {
    id: string;
    agent: string;
    type: string;
    priority: number;
  };
}) {
  return (
    <div className="cursor-pointer rounded-xl border border-slate-700 bg-slate-800 p-4 transition-all duration-240 hover:border-[#3AA9BE]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-[#3AA9BE]">
          {task.agent}
        </span>
        <span className="text-xs text-slate-500">P{task.priority}</span>
      </div>
      <div className="text-sm text-white">{task.type}</div>
      <div className="mt-2 text-xs text-slate-400">{task.id}</div>
    </div>
  );
}
