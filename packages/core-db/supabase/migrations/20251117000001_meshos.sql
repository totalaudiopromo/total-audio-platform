-- MeshOS: Universal Multi-Agent Coordination Layer
-- Phase 12 - MeshOS Implementation
-- Created: 2025-11-17
--
-- MeshOS is the orchestration/coordination layer that sits ABOVE all agents and systems.
-- It provides: cross-agent messaging, multi-agent negotiation, long-range planning,
-- drift detection, insight routing, policy enforcement, and global context awareness.
--
-- NON-NEGOTIABLE: MeshOS only READS from other systems (via adapters).
-- It only WRITES to its own mesh_* tables.

-- ============================================================================
-- TABLE: mesh_messages
-- Cross-system messaging backbone
-- ============================================================================
CREATE TABLE IF NOT EXISTS mesh_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  source TEXT NOT NULL, -- e.g. 'autopilot', 'talentRadar', 'coachOS', 'scenesEngine'
  target TEXT NOT NULL, -- e.g. 'meshOS', 'planning', 'negotiation', 'insight'
  type TEXT NOT NULL, -- e.g. 'request', 'response', 'notification', 'negotiation'
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  result JSONB, -- result of processing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,

  -- Indexes for performance
  CONSTRAINT mesh_messages_workspace_id_idx CHECK (workspace_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_mesh_messages_workspace ON mesh_messages(workspace_id);
CREATE INDEX IF NOT EXISTS idx_mesh_messages_source ON mesh_messages(source);
CREATE INDEX IF NOT EXISTS idx_mesh_messages_target ON mesh_messages(target);
CREATE INDEX IF NOT EXISTS idx_mesh_messages_status ON mesh_messages(status);
CREATE INDEX IF NOT EXISTS idx_mesh_messages_created_at ON mesh_messages(created_at DESC);

-- RLS Policies
ALTER TABLE mesh_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mesh messages in their workspace"
  ON mesh_messages
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create mesh messages in their workspace"
  ON mesh_messages
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update mesh messages in their workspace"
  ON mesh_messages
  FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TABLE: mesh_state
-- Global mesh state (key-value store per workspace)
-- ============================================================================
CREATE TABLE IF NOT EXISTS mesh_state (
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (workspace_id, key)
);

CREATE INDEX IF NOT EXISTS idx_mesh_state_updated_at ON mesh_state(updated_at DESC);

-- RLS Policies
ALTER TABLE mesh_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mesh state in their workspace"
  ON mesh_state
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage mesh state in their workspace"
  ON mesh_state
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TABLE: mesh_negotiations
-- Multi-agent negotiation records
-- ============================================================================
CREATE TABLE IF NOT EXISTS mesh_negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  participants TEXT[] NOT NULL, -- array of agent/system names
  context JSONB NOT NULL DEFAULT '{}', -- negotiation context (goals, constraints, data)
  strategy TEXT NOT NULL DEFAULT 'consensus', -- 'consensus', 'weighted', 'risk-adjusted', 'opportunity'
  result JSONB, -- negotiation outcome
  confidence NUMERIC(5,4) CHECK (confidence >= 0 AND confidence <= 1), -- 0.0 to 1.0
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- At least 2 participants required
  CONSTRAINT mesh_negotiations_min_participants CHECK (array_length(participants, 1) >= 2)
);

CREATE INDEX IF NOT EXISTS idx_mesh_negotiations_workspace ON mesh_negotiations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_mesh_negotiations_status ON mesh_negotiations(status);
CREATE INDEX IF NOT EXISTS idx_mesh_negotiations_created_at ON mesh_negotiations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mesh_negotiations_participants ON mesh_negotiations USING GIN(participants);

-- RLS Policies
ALTER TABLE mesh_negotiations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mesh negotiations in their workspace"
  ON mesh_negotiations
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create mesh negotiations in their workspace"
  ON mesh_negotiations
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update mesh negotiations in their workspace"
  ON mesh_negotiations
  FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TABLE: mesh_plans
-- Long-range plans (7-day, 30-day, 90-day)
-- ============================================================================
CREATE TABLE IF NOT EXISTS mesh_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  timeframe TEXT NOT NULL, -- '7d', '30d', '90d'
  plan JSONB NOT NULL, -- structured plan with objectives, actions, timelines, dependencies
  confidence NUMERIC(5,4) CHECK (confidence >= 0 AND confidence <= 1),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ, -- when this plan expires/needs refresh
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'superseded', 'archived'

  CONSTRAINT mesh_plans_valid_timeframe CHECK (timeframe IN ('7d', '30d', '90d'))
);

CREATE INDEX IF NOT EXISTS idx_mesh_plans_workspace ON mesh_plans(workspace_id);
CREATE INDEX IF NOT EXISTS idx_mesh_plans_timeframe ON mesh_plans(timeframe);
CREATE INDEX IF NOT EXISTS idx_mesh_plans_status ON mesh_plans(status);
CREATE INDEX IF NOT EXISTS idx_mesh_plans_generated_at ON mesh_plans(generated_at DESC);

-- RLS Policies
ALTER TABLE mesh_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mesh plans in their workspace"
  ON mesh_plans
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create mesh plans in their workspace"
  ON mesh_plans
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update mesh plans in their workspace"
  ON mesh_plans
  FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TABLE: mesh_insight_routes
-- Insight routing rules (where insights should go)
-- ============================================================================
CREATE TABLE IF NOT EXISTS mesh_insight_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- e.g. 'opportunity', 'threat', 'drift', 'momentum', 'coverage'
  destination TEXT NOT NULL, -- e.g. 'dashboard', 'autopilot', 'coachOS', 'talentRadar', 'operatorOS'
  rule JSONB NOT NULL DEFAULT '{}', -- routing rule (conditions, priority, filters)
  priority INTEGER NOT NULL DEFAULT 5, -- 1-10, higher = more important
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mesh_insight_routes_workspace ON mesh_insight_routes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_mesh_insight_routes_type ON mesh_insight_routes(insight_type);
CREATE INDEX IF NOT EXISTS idx_mesh_insight_routes_destination ON mesh_insight_routes(destination);
CREATE INDEX IF NOT EXISTS idx_mesh_insight_routes_enabled ON mesh_insight_routes(enabled);
CREATE INDEX IF NOT EXISTS idx_mesh_insight_routes_priority ON mesh_insight_routes(priority DESC);

-- RLS Policies
ALTER TABLE mesh_insight_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mesh insight routes in their workspace"
  ON mesh_insight_routes
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage mesh insight routes in their workspace"
  ON mesh_insight_routes
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TABLE: mesh_drift_reports
-- Drift detection reports (contradictions, misalignments)
-- ============================================================================
CREATE TABLE IF NOT EXISTS mesh_drift_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  drift_type TEXT NOT NULL, -- 'creative_vs_campaign', 'scene_vs_pitch', 'segment_vs_autopilot', etc.
  systems_involved TEXT[] NOT NULL, -- systems that are drifting
  drift_score NUMERIC(5,4) CHECK (drift_score >= 0 AND drift_score <= 1), -- 0.0 (aligned) to 1.0 (max drift)
  analysis JSONB NOT NULL, -- detailed drift analysis
  recommended_corrections JSONB, -- suggested resolution steps
  status TEXT NOT NULL DEFAULT 'detected', -- 'detected', 'acknowledged', 'correcting', 'resolved', 'ignored'
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_mesh_drift_workspace ON mesh_drift_reports(workspace_id);
CREATE INDEX IF NOT EXISTS idx_mesh_drift_type ON mesh_drift_reports(drift_type);
CREATE INDEX IF NOT EXISTS idx_mesh_drift_status ON mesh_drift_reports(status);
CREATE INDEX IF NOT EXISTS idx_mesh_drift_score ON mesh_drift_reports(drift_score DESC);
CREATE INDEX IF NOT EXISTS idx_mesh_drift_detected_at ON mesh_drift_reports(detected_at DESC);

-- RLS Policies
ALTER TABLE mesh_drift_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view drift reports in their workspace"
  ON mesh_drift_reports
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create drift reports in their workspace"
  ON mesh_drift_reports
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update drift reports in their workspace"
  ON mesh_drift_reports
  FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get latest plan for a timeframe
CREATE OR REPLACE FUNCTION get_latest_mesh_plan(
  p_workspace_id UUID,
  p_timeframe TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan JSONB;
BEGIN
  SELECT plan INTO v_plan
  FROM mesh_plans
  WHERE workspace_id = p_workspace_id
    AND timeframe = p_timeframe
    AND status = 'active'
  ORDER BY generated_at DESC
  LIMIT 1;

  RETURN COALESCE(v_plan, '{}'::JSONB);
END;
$$;

-- Function to get active drift reports
CREATE OR REPLACE FUNCTION get_active_drift_reports(
  p_workspace_id UUID
)
RETURNS TABLE (
  id UUID,
  drift_type TEXT,
  drift_score NUMERIC,
  systems_involved TEXT[],
  detected_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.drift_type,
    d.drift_score,
    d.systems_involved,
    d.detected_at
  FROM mesh_drift_reports d
  WHERE d.workspace_id = p_workspace_id
    AND d.status IN ('detected', 'acknowledged', 'correcting')
  ORDER BY d.drift_score DESC, d.detected_at DESC;
END;
$$;

-- Function to update mesh state
CREATE OR REPLACE FUNCTION upsert_mesh_state(
  p_workspace_id UUID,
  p_key TEXT,
  p_value JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO mesh_state (workspace_id, key, value, updated_at)
  VALUES (p_workspace_id, p_key, p_value, NOW())
  ON CONFLICT (workspace_id, key)
  DO UPDATE SET
    value = p_value,
    updated_at = NOW();
END;
$$;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE mesh_messages IS 'Cross-system messaging backbone for MeshOS';
COMMENT ON TABLE mesh_state IS 'Global mesh state key-value store';
COMMENT ON TABLE mesh_negotiations IS 'Multi-agent negotiation records';
COMMENT ON TABLE mesh_plans IS 'Long-range plans (7d, 30d, 90d)';
COMMENT ON TABLE mesh_insight_routes IS 'Insight routing rules';
COMMENT ON TABLE mesh_drift_reports IS 'Drift detection and correction reports';

-- ============================================================================
-- GRANTS
-- ============================================================================
GRANT SELECT, INSERT, UPDATE ON mesh_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON mesh_state TO authenticated;
GRANT SELECT, INSERT, UPDATE ON mesh_negotiations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON mesh_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON mesh_insight_routes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON mesh_drift_reports TO authenticated;

-- ============================================================================
-- COMPLETE
-- ============================================================================
-- MeshOS migration complete.
-- Tables: mesh_messages, mesh_state, mesh_negotiations, mesh_plans, mesh_insight_routes, mesh_drift_reports
-- All tables have RLS policies and proper indexes.
-- Helper functions created for common operations.
