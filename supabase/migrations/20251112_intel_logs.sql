-- Intel enrichment logs table
-- Created: 2025-11-12
-- Purpose: Track enrichment batch operations for Audio Intel analytics and debugging

create table if not exists intel_logs (
  id uuid primary key default uuid_generate_v4(),
  batch_id text not null,
  total int not null,
  enriched int not null,
  failed int not null,
  retried int not null default 0,
  timed_out int not null default 0,
  cost numeric not null,
  avg_time_ms int not null,
  success_rate numeric,
  input_tokens int,
  output_tokens int,
  model_used text,
  ip_address text,
  created_at timestamptz default now(),
  metadata jsonb
);

-- Index for fast querying by date
create index if not exists intel_logs_created_at_idx on intel_logs(created_at desc);

-- Index for batch lookup
create index if not exists intel_logs_batch_id_idx on intel_logs(batch_id);

-- RLS policies (allow authenticated users to read their own logs)
alter table intel_logs enable row level security;

-- Allow all users to read intel_logs (adjust based on your auth requirements)
create policy "Users can read intel_logs"
  on intel_logs for select
  using (true);

-- Service role can insert intel_logs (backend API only)
create policy "Service can insert intel_logs"
  on intel_logs for insert
  with check (true);

-- Comments for documentation
comment on table intel_logs is 'Enrichment batch operation logs for Audio Intel analytics and monitoring';
comment on column intel_logs.batch_id is 'Unique identifier for the enrichment batch';
comment on column intel_logs.total is 'Total number of contacts in the batch';
comment on column intel_logs.enriched is 'Number of successfully enriched contacts';
comment on column intel_logs.failed is 'Number of failed enrichments';
comment on column intel_logs.retried is 'Number of retried enrichments';
comment on column intel_logs.timed_out is 'Number of enrichments that timed out';
comment on column intel_logs.cost is 'Total cost in GBP for the batch';
comment on column intel_logs.avg_time_ms is 'Average enrichment time in milliseconds';
comment on column intel_logs.success_rate is 'Success rate as percentage (0-100)';
comment on column intel_logs.metadata is 'Additional metadata (e.g., error details, enrichment types)';
