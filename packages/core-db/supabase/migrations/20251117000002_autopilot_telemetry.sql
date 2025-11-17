-- Telemetry Layer for PR Autopilot
-- Tracks real-time metrics for agents, tasks, and missions

-- ============================================================================
-- TABLE: autopilot_telemetry
-- ============================================================================

CREATE TABLE IF NOT EXISTS autopilot_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES autopilot_missions(id) ON DELETE CASCADE,
  run_id UUID REFERENCES autopilot_runs(id) ON DELETE CASCADE,
  task_id UUID REFERENCES autopilot_tasks(id) ON DELETE CASCADE,
  agent_role TEXT,
  metric_type TEXT NOT NULL CHECK (
    metric_type IN (
      'latency',           -- Task execution time
      'confidence',        -- Confidence score
      'approval_rate',     -- Approval/rejection rates
      'success_rate',      -- Task success/failure rates
      'retry_count',       -- Number of retries
      'error_rate',        -- Error frequency
      'throughput',        -- Tasks processed per hour
      'resource_usage',    -- Memory/CPU usage
      'api_calls',         -- External API call counts
      'custom'             -- Custom metrics
    )
  ),
  value JSONB NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT now(),

  -- Indexes for fast filtering
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_telemetry_mission ON autopilot_telemetry(mission_id, timestamp DESC);
CREATE INDEX idx_telemetry_agent ON autopilot_telemetry(agent_role, timestamp DESC);
CREATE INDEX idx_telemetry_metric ON autopilot_telemetry(metric_type, timestamp DESC);
CREATE INDEX idx_telemetry_run ON autopilot_telemetry(run_id, timestamp DESC);
CREATE INDEX idx_telemetry_task ON autopilot_telemetry(task_id);

-- Composite index for common query patterns
CREATE INDEX idx_telemetry_mission_agent_metric ON autopilot_telemetry(
  mission_id,
  agent_role,
  metric_type,
  timestamp DESC
);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE autopilot_telemetry ENABLE ROW LEVEL SECURITY;

-- Users can read telemetry for their own missions
CREATE POLICY select_own_telemetry ON autopilot_telemetry
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM autopilot_missions
      WHERE autopilot_missions.id = autopilot_telemetry.mission_id
      AND autopilot_missions.user_id = auth.uid()
    )
  );

-- System can insert telemetry (service role)
CREATE POLICY insert_telemetry ON autopilot_telemetry
  FOR INSERT
  WITH CHECK (true);

-- Users can delete old telemetry for their missions
CREATE POLICY delete_own_telemetry ON autopilot_telemetry
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM autopilot_missions
      WHERE autopilot_missions.id = autopilot_telemetry.mission_id
      AND autopilot_missions.user_id = auth.uid()
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

/**
 * Get telemetry summary for a mission
 */
CREATE OR REPLACE FUNCTION get_mission_telemetry_summary(p_mission_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_summary JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_events', COUNT(*),
    'avg_latency_ms', AVG((value->>'duration_ms')::numeric) FILTER (WHERE metric_type = 'latency'),
    'avg_confidence', AVG((value->>'score')::numeric) FILTER (WHERE metric_type = 'confidence'),
    'approval_rate',
      COUNT(*) FILTER (WHERE metric_type = 'approval_rate' AND (value->>'approved')::boolean = true)::float /
      NULLIF(COUNT(*) FILTER (WHERE metric_type = 'approval_rate'), 0),
    'success_rate',
      COUNT(*) FILTER (WHERE metric_type = 'success_rate' AND (value->>'success')::boolean = true)::float /
      NULLIF(COUNT(*) FILTER (WHERE metric_type = 'success_rate'), 0),
    'total_errors', COUNT(*) FILTER (WHERE metric_type = 'error_rate'),
    'agents_used', jsonb_agg(DISTINCT agent_role) FILTER (WHERE agent_role IS NOT NULL)
  ) INTO v_summary
  FROM autopilot_telemetry
  WHERE mission_id = p_mission_id;

  RETURN v_summary;
END;
$$;

/**
 * Get telemetry for a specific agent across all missions
 */
CREATE OR REPLACE FUNCTION get_agent_telemetry_summary(p_agent_role TEXT, p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_summary JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_tasks', COUNT(*),
    'avg_latency_ms', AVG((value->>'duration_ms')::numeric) FILTER (WHERE metric_type = 'latency'),
    'avg_confidence', AVG((value->>'score')::numeric) FILTER (WHERE metric_type = 'confidence'),
    'success_rate',
      COUNT(*) FILTER (WHERE metric_type = 'success_rate' AND (value->>'success')::boolean = true)::float /
      NULLIF(COUNT(*) FILTER (WHERE metric_type = 'success_rate'), 0),
    'missions_count', COUNT(DISTINCT mission_id)
  ) INTO v_summary
  FROM autopilot_telemetry t
  WHERE t.agent_role = p_agent_role
  AND EXISTS (
    SELECT 1 FROM autopilot_missions m
    WHERE m.id = t.mission_id
    AND m.user_id = p_user_id
  );

  RETURN v_summary;
END;
$$;

/**
 * Clean up old telemetry data (older than 90 days)
 */
CREATE OR REPLACE FUNCTION cleanup_old_telemetry()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM autopilot_telemetry
  WHERE timestamp < NOW() - INTERVAL '90 days';

  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  RETURN v_deleted;
END;
$$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE autopilot_telemetry IS 'Real-time telemetry data for PR Autopilot missions, runs, tasks, and agents';
COMMENT ON COLUMN autopilot_telemetry.metric_type IS 'Type of metric being tracked (latency, confidence, approval_rate, etc.)';
COMMENT ON COLUMN autopilot_telemetry.value IS 'Metric value as JSONB (flexible schema for different metric types)';
COMMENT ON COLUMN autopilot_telemetry.metadata IS 'Additional context about the metric (tags, labels, etc.)';
