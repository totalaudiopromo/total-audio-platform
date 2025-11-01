-- Create agent_logs table for tracking agent executions
-- This table stores telemetry for all agent runs

create table if not exists public.agent_logs (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null,
  success boolean not null default true,
  latency_ms integer not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for common queries
create index if not exists agent_logs_agent_name_idx on public.agent_logs(agent_name);
create index if not exists agent_logs_created_at_idx on public.agent_logs(created_at desc);
create index if not exists agent_logs_success_idx on public.agent_logs(success);

-- Add RLS policies (adjust based on your auth setup)
alter table public.agent_logs enable row level security;

-- Allow authenticated users to insert logs
create policy "Users can insert agent logs"
  on public.agent_logs
  for insert
  to authenticated
  with check (true);

-- Allow authenticated users to read their own logs
create policy "Users can read agent logs"
  on public.agent_logs
  for select
  to authenticated
  using (true);

-- Create view for agent performance metrics
create or replace view public.agent_performance as
select
  agent_name,
  count(*) as total_runs,
  sum(case when success then 1 else 0 end) as successful_runs,
  sum(case when not success then 1 else 0 end) as failed_runs,
  round(avg(latency_ms)) as avg_latency_ms,
  max(created_at) as last_run_at,
  round(
    100.0 * sum(case when success then 1 else 0 end) / count(*),
    2
  ) as success_rate_percent
from public.agent_logs
group by agent_name;

-- Grant access to the view
grant select on public.agent_performance to authenticated;

-- Add comment documentation
comment on table public.agent_logs is 'Logs all agent execution telemetry for monitoring and analytics';
comment on column public.agent_logs.agent_name is 'Name of the agent that was executed';
comment on column public.agent_logs.success is 'Whether the agent execution succeeded';
comment on column public.agent_logs.latency_ms is 'Execution time in milliseconds';
comment on column public.agent_logs.metadata is 'Additional execution metadata (version, error details, etc.)';
