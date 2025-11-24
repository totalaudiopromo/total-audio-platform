-- PR Autopilot Phase 3: Execution Hardening & Operational Excellence
-- Snapshots and Replay Engine

-- ============================================================================
-- TABLE: pr_mission_snapshots
-- ============================================================================

CREATE TABLE IF NOT EXISTS pr_mission_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES autopilot_missions(id) ON DELETE CASCADE,
  run_id UUID REFERENCES autopilot_runs(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_snapshots_mission ON pr_mission_snapshots(mission_id, created_at DESC);
CREATE INDEX idx_snapshots_run ON pr_mission_snapshots(run_id);

-- ============================================================================
-- TABLE: pr_mission_replays
-- ============================================================================

CREATE TABLE IF NOT EXISTS pr_mission_replays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES autopilot_missions(id) ON DELETE CASCADE,
  original_run_id UUID REFERENCES autopilot_runs(id) ON DELETE SET NULL,
  replay_run_id UUID REFERENCES autopilot_runs(id) ON DELETE SET NULL,
  context_snapshot JSONB NOT NULL,
  decisions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_replays_mission ON pr_mission_replays(mission_id, created_at DESC);
CREATE INDEX idx_replays_user ON pr_mission_replays(user_id);
CREATE INDEX idx_replays_original_run ON pr_mission_replays(original_run_id);

-- ============================================================================
-- RLS POLICIES - pr_mission_snapshots
-- ============================================================================

ALTER TABLE pr_mission_snapshots ENABLE ROW LEVEL SECURITY;

-- Users can read snapshots for their own missions
CREATE POLICY select_own_snapshots ON pr_mission_snapshots
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM autopilot_missions
      WHERE autopilot_missions.id = pr_mission_snapshots.mission_id
      AND autopilot_missions.user_id = auth.uid()
    )
  );

-- Users can create snapshots for their own missions
CREATE POLICY insert_own_snapshots ON pr_mission_snapshots
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM autopilot_missions
      WHERE autopilot_missions.id = pr_mission_snapshots.mission_id
      AND autopilot_missions.user_id = auth.uid()
    )
  );

-- Users can delete their own snapshots
CREATE POLICY delete_own_snapshots ON pr_mission_snapshots
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM autopilot_missions
      WHERE autopilot_missions.id = pr_mission_snapshots.mission_id
      AND autopilot_missions.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES - pr_mission_replays
-- ============================================================================

ALTER TABLE pr_mission_replays ENABLE ROW LEVEL SECURITY;

-- Users can read their own replays
CREATE POLICY select_own_replays ON pr_mission_replays
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can create replays for their own missions
CREATE POLICY insert_own_replays ON pr_mission_replays
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM autopilot_missions
      WHERE autopilot_missions.id = pr_mission_replays.mission_id
      AND autopilot_missions.user_id = auth.uid()
    )
  );

-- Users can delete their own replays
CREATE POLICY delete_own_replays ON pr_mission_replays
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

/**
 * Get snapshot diff between two snapshots
 */
CREATE OR REPLACE FUNCTION get_snapshot_diff(
  p_snapshot_id_old UUID,
  p_snapshot_id_new UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old JSONB;
  v_new JSONB;
  v_diff JSONB;
BEGIN
  SELECT snapshot INTO v_old FROM pr_mission_snapshots WHERE id = p_snapshot_id_old;
  SELECT snapshot INTO v_new FROM pr_mission_snapshots WHERE id = p_snapshot_id_new;

  IF v_old IS NULL OR v_new IS NULL THEN
    RETURN NULL;
  END IF;

  -- Simple diff: return both snapshots
  -- In production, you'd implement proper JSON diffing
  v_diff := jsonb_build_object(
    'old', v_old,
    'new', v_new,
    'timestamp_old', (SELECT created_at FROM pr_mission_snapshots WHERE id = p_snapshot_id_old),
    'timestamp_new', (SELECT created_at FROM pr_mission_snapshots WHERE id = p_snapshot_id_new)
  );

  RETURN v_diff;
END;
$$;

/**
 * Clean up old snapshots (keep last 10 per mission)
 */
CREATE OR REPLACE FUNCTION cleanup_old_snapshots()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  WITH ranked_snapshots AS (
    SELECT
      id,
      ROW_NUMBER() OVER (PARTITION BY mission_id ORDER BY created_at DESC) as rn
    FROM pr_mission_snapshots
  )
  DELETE FROM pr_mission_snapshots
  WHERE id IN (
    SELECT id FROM ranked_snapshots WHERE rn > 10
  );

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE pr_mission_snapshots IS 'Lightweight snapshots of mission state for replay and debugging';
COMMENT ON TABLE pr_mission_replays IS 'Mission replay metadata for reproducing runs with identical context';
COMMENT ON COLUMN pr_mission_snapshots.snapshot IS 'Full mission state including tasks, config, and intermediate results';
COMMENT ON COLUMN pr_mission_replays.context_snapshot IS 'Frozen context from original run';
COMMENT ON COLUMN pr_mission_replays.decisions IS 'Agent decisions made during original run';
