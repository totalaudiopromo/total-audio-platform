-- Creative Intelligence Studio Phase 2 Database Schema
-- Migration: 20251117_cis_phase2.sql
-- Purpose: Add real-time collaboration, autosave, identity signals, and context linking

-- =============================================================================
-- EXTEND cis_projects TABLE
-- =============================================================================
-- Add columns for linking projects to Fusion Layer entities
ALTER TABLE cis_projects ADD COLUMN IF NOT EXISTS artist_slug TEXT;
ALTER TABLE cis_projects ADD COLUMN IF NOT EXISTS campaign_id UUID;
ALTER TABLE cis_projects ADD COLUMN IF NOT EXISTS release_id UUID;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cis_projects_artist_slug ON cis_projects(artist_slug);
CREATE INDEX IF NOT EXISTS idx_cis_projects_campaign_id ON cis_projects(campaign_id);

-- =============================================================================
-- TABLE: cis_project_sessions
-- Description: Tracks live editing sessions for autosave and recovery
-- =============================================================================
CREATE TABLE IF NOT EXISTS cis_project_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES cis_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('active', 'closed', 'crashed')) DEFAULT 'active',
  last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cis_sessions_project ON cis_project_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_cis_sessions_user ON cis_project_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_cis_sessions_status ON cis_project_sessions(status);
CREATE INDEX IF NOT EXISTS idx_cis_sessions_heartbeat ON cis_project_sessions(last_heartbeat DESC);

-- RLS policies
ALTER TABLE cis_project_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON cis_project_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON cis_project_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON cis_project_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- TABLE: cis_autosave_snapshots
-- Description: Stores autosave states for crash recovery
-- =============================================================================
CREATE TABLE IF NOT EXISTS cis_autosave_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES cis_projects(id) ON DELETE CASCADE,
  session_id UUID REFERENCES cis_project_sessions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  size_bytes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cis_autosave_project ON cis_autosave_snapshots(project_id);
CREATE INDEX IF NOT EXISTS idx_cis_autosave_user ON cis_autosave_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_cis_autosave_session ON cis_autosave_snapshots(session_id);
CREATE INDEX IF NOT EXISTS idx_cis_autosave_created ON cis_autosave_snapshots(created_at DESC);

-- RLS policies
ALTER TABLE cis_autosave_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own autosaves"
  ON cis_autosave_snapshots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own autosaves"
  ON cis_autosave_snapshots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Auto-cleanup policy: delete autosaves older than 30 days
CREATE POLICY "Auto-cleanup old autosaves"
  ON cis_autosave_snapshots FOR DELETE
  USING (created_at < now() - interval '30 days');

-- =============================================================================
-- TABLE: cis_identity_signals
-- Description: Signals from CIS into Identity Kernel
-- =============================================================================
CREATE TABLE IF NOT EXISTS cis_identity_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES cis_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_slug TEXT NOT NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN (
    'palette',
    'tagline',
    'visual_motif',
    'narrative',
    'tone',
    'archetype',
    'brand_element'
  )),
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cis_identity_artist ON cis_identity_signals(artist_slug);
CREATE INDEX IF NOT EXISTS idx_cis_identity_type ON cis_identity_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_cis_identity_processed ON cis_identity_signals(processed);
CREATE INDEX IF NOT EXISTS idx_cis_identity_created ON cis_identity_signals(created_at DESC);

-- RLS policies
ALTER TABLE cis_identity_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own identity signals"
  ON cis_identity_signals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create identity signals"
  ON cis_identity_signals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- TABLE: cis_moment_markers
-- Description: Markers for key creative decisions (versions, milestones)
-- =============================================================================
CREATE TABLE IF NOT EXISTS cis_moment_markers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES cis_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  snapshot_id UUID REFERENCES cis_autosave_snapshots(id) ON DELETE SET NULL,
  artifact_id UUID REFERENCES cis_artifacts(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cis_markers_project ON cis_moment_markers(project_id);
CREATE INDEX IF NOT EXISTS idx_cis_markers_snapshot ON cis_moment_markers(snapshot_id);
CREATE INDEX IF NOT EXISTS idx_cis_markers_artifact ON cis_moment_markers(artifact_id);
CREATE INDEX IF NOT EXISTS idx_cis_markers_created ON cis_moment_markers(created_at DESC);

-- RLS policies
ALTER TABLE cis_moment_markers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view markers from own projects"
  ON cis_moment_markers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cis_projects
      WHERE cis_projects.id = cis_moment_markers.project_id
      AND cis_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create markers for own projects"
  ON cis_moment_markers FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM cis_projects
      WHERE cis_projects.id = cis_moment_markers.project_id
      AND cis_projects.user_id = auth.uid()
    )
  );

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function: Update session heartbeat
CREATE OR REPLACE FUNCTION update_session_heartbeat(session_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE cis_project_sessions
  SET last_heartbeat = now(),
      updated_at = now()
  WHERE id = session_id
    AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Close stale sessions (no heartbeat for > 5 minutes)
CREATE OR REPLACE FUNCTION close_stale_sessions()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE cis_project_sessions
  SET status = 'crashed',
      updated_at = now()
  WHERE status = 'active'
    AND last_heartbeat < now() - interval '5 minutes';

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function: Get latest autosave for project
CREATE OR REPLACE FUNCTION get_latest_autosave(p_project_id UUID, p_user_id UUID)
RETURNS cis_autosave_snapshots AS $$
  SELECT *
  FROM cis_autosave_snapshots
  WHERE project_id = p_project_id
    AND user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function: Cleanup old autosaves (keep last 10 per project)
CREATE OR REPLACE FUNCTION cleanup_old_autosaves(p_project_id UUID)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM cis_autosave_snapshots
  WHERE project_id = p_project_id
    AND id NOT IN (
      SELECT id
      FROM cis_autosave_snapshots
      WHERE project_id = p_project_id
      ORDER BY created_at DESC
      LIMIT 10
    );

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-update updated_at for sessions
CREATE OR REPLACE FUNCTION update_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_updated_at
  BEFORE UPDATE ON cis_project_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_updated_at();

-- =============================================================================
-- COMMENTS
-- =============================================================================
COMMENT ON TABLE cis_project_sessions IS 'Live editing sessions for real-time autosave and collaboration';
COMMENT ON TABLE cis_autosave_snapshots IS 'Autosave states for crash recovery and version history';
COMMENT ON TABLE cis_identity_signals IS 'Signals from CIS into Identity Kernel for brand evolution';
COMMENT ON TABLE cis_moment_markers IS 'Key creative decision points and milestones';

COMMENT ON FUNCTION update_session_heartbeat IS 'Updates heartbeat timestamp for active session';
COMMENT ON FUNCTION close_stale_sessions IS 'Marks sessions as crashed if no heartbeat for 5+ minutes';
COMMENT ON FUNCTION get_latest_autosave IS 'Retrieves most recent autosave for project recovery';
COMMENT ON FUNCTION cleanup_old_autosaves IS 'Removes old autosaves, keeping last 10 per project';
