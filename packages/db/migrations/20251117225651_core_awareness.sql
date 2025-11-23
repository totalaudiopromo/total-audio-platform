-- Core Awareness Layer Database Schema
-- Created: 2025-11-17
-- Purpose: Meta-intelligence layer that observes, reasons, predicts, and recommends across all Total Audio subsystems

-- ============================================================================
-- TABLE: awareness_snapshots
-- Description: System-wide snapshots capturing state across all subsystems
-- ============================================================================
CREATE TABLE IF NOT EXISTS awareness_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NULL,
  user_id UUID NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for snapshots
CREATE INDEX idx_awareness_snapshots_workspace ON awareness_snapshots(workspace_id) WHERE workspace_id IS NOT NULL;
CREATE INDEX idx_awareness_snapshots_user ON awareness_snapshots(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_awareness_snapshots_created ON awareness_snapshots(created_at DESC);

-- ============================================================================
-- TABLE: awareness_events
-- Description: Event ingestion for observer - all system events flow here
-- ============================================================================
CREATE TABLE IF NOT EXISTS awareness_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NULL,
  user_id UUID NULL,
  event_type TEXT NOT NULL,
  source_system TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for events
CREATE INDEX idx_awareness_events_workspace ON awareness_events(workspace_id) WHERE workspace_id IS NOT NULL;
CREATE INDEX idx_awareness_events_user ON awareness_events(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_awareness_events_type ON awareness_events(event_type);
CREATE INDEX idx_awareness_events_source ON awareness_events(source_system);
CREATE INDEX idx_awareness_events_created ON awareness_events(created_at DESC);

-- ============================================================================
-- TABLE: awareness_signals
-- Description: Signals generated for downstream systems (IDK, CMG, Scenes, Autopilot, MAL, Dashboard, CIS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS awareness_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NULL,
  user_id UUID NULL,
  target_system TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  confidence NUMERIC(3, 2) DEFAULT 0.5,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'actioned', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  actioned_at TIMESTAMPTZ NULL
);

-- Indexes for signals
CREATE INDEX idx_awareness_signals_workspace ON awareness_signals(workspace_id) WHERE workspace_id IS NOT NULL;
CREATE INDEX idx_awareness_signals_user ON awareness_signals(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_awareness_signals_target ON awareness_signals(target_system);
CREATE INDEX idx_awareness_signals_type ON awareness_signals(signal_type);
CREATE INDEX idx_awareness_signals_status ON awareness_signals(status);
CREATE INDEX idx_awareness_signals_created ON awareness_signals(created_at DESC);

-- ============================================================================
-- TABLE: awareness_recommendations
-- Description: Non-binding suggestions for humans & systems
-- ============================================================================
CREATE TABLE IF NOT EXISTS awareness_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NULL,
  user_id UUID NULL,
  target_system TEXT NOT NULL,
  recommendation_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  confidence NUMERIC(3, 2) DEFAULT 0.5,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'implemented')),
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ NULL
);

-- Indexes for recommendations
CREATE INDEX idx_awareness_recommendations_workspace ON awareness_recommendations(workspace_id) WHERE workspace_id IS NOT NULL;
CREATE INDEX idx_awareness_recommendations_user ON awareness_recommendations(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_awareness_recommendations_target ON awareness_recommendations(target_system);
CREATE INDEX idx_awareness_recommendations_type ON awareness_recommendations(recommendation_type);
CREATE INDEX idx_awareness_recommendations_status ON awareness_recommendations(status);
CREATE INDEX idx_awareness_recommendations_priority ON awareness_recommendations(priority);
CREATE INDEX idx_awareness_recommendations_created ON awareness_recommendations(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE awareness_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE awareness_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE awareness_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE awareness_recommendations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: awareness_snapshots
-- ============================================================================

CREATE POLICY awareness_snapshots_select_policy ON awareness_snapshots
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = awareness_snapshots.workspace_id
        AND workspace_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY awareness_snapshots_insert_policy ON awareness_snapshots
  FOR INSERT
  WITH CHECK (false); -- Only system can insert

CREATE POLICY awareness_snapshots_delete_policy ON awareness_snapshots
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = awareness_snapshots.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('owner', 'admin')
      )
    )
  );

-- ============================================================================
-- RLS POLICIES: awareness_events
-- ============================================================================

CREATE POLICY awareness_events_select_policy ON awareness_events
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = awareness_events.workspace_id
        AND workspace_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY awareness_events_insert_policy ON awareness_events
  FOR INSERT
  WITH CHECK (false); -- Only system can insert

CREATE POLICY awareness_events_delete_policy ON awareness_events
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = awareness_events.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('owner', 'admin')
      )
    )
  );

-- ============================================================================
-- RLS POLICIES: awareness_signals
-- ============================================================================

CREATE POLICY awareness_signals_select_policy ON awareness_signals
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = awareness_signals.workspace_id
        AND workspace_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY awareness_signals_insert_policy ON awareness_signals
  FOR INSERT
  WITH CHECK (false); -- Only system can insert

CREATE POLICY awareness_signals_update_policy ON awareness_signals
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = awareness_signals.workspace_id
        AND workspace_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY awareness_signals_delete_policy ON awareness_signals
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = awareness_signals.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('owner', 'admin')
      )
    )
  );

-- ============================================================================
-- RLS POLICIES: awareness_recommendations
-- ============================================================================

CREATE POLICY awareness_recommendations_select_policy ON awareness_recommendations
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = awareness_recommendations.workspace_id
        AND workspace_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY awareness_recommendations_insert_policy ON awareness_recommendations
  FOR INSERT
  WITH CHECK (false); -- Only system can insert

CREATE POLICY awareness_recommendations_update_policy ON awareness_recommendations
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = awareness_recommendations.workspace_id
        AND workspace_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY awareness_recommendations_delete_policy ON awareness_recommendations
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = awareness_recommendations.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('owner', 'admin')
      )
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE awareness_snapshots IS 'System-wide snapshots capturing state across all Total Audio subsystems';
COMMENT ON TABLE awareness_events IS 'Event ingestion for Core Awareness observer - all system events flow here';
COMMENT ON TABLE awareness_signals IS 'Signals generated for downstream systems (IDK, CMG, Scenes, Autopilot, MAL, Dashboard, CIS)';
COMMENT ON TABLE awareness_recommendations IS 'Non-binding suggestions for humans and systems';
