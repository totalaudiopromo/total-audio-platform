-- MIG Phase 3: Integrated Intelligence Layer
-- This migration creates tables for fusing MIG with all Total Audio intelligence systems

-- ============================================================================
-- TABLE: mig_influence_scores
-- Stores derived influence, authority, and relevance scores for entities
-- ============================================================================

CREATE TABLE IF NOT EXISTS mig_influence_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  entity_slug TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'artist', 'journalist', 'radio_host', 'playlist', 'blog', 'dj',
    'label', 'scene', 'microgenre', 'event', 'venue', 'festival',
    'radio_show', 'podcast'
  )),
  influence_score NUMERIC NOT NULL DEFAULT 0 CHECK (influence_score >= 0),
  authority_score NUMERIC NOT NULL DEFAULT 0 CHECK (authority_score >= 0),
  relevance_score NUMERIC NOT NULL DEFAULT 0 CHECK (relevance_score >= 0),
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(workspace_id, entity_slug)
);

CREATE INDEX idx_mig_influence_workspace ON mig_influence_scores(workspace_id);
CREATE INDEX idx_mig_influence_entity ON mig_influence_scores(entity_slug);
CREATE INDEX idx_mig_influence_type ON mig_influence_scores(entity_type);
CREATE INDEX idx_mig_influence_score ON mig_influence_scores(influence_score DESC);

COMMENT ON TABLE mig_influence_scores IS 'MIG-derived influence, authority, and relevance scores per entity';

-- ============================================================================
-- TABLE: mig_scene_alignment
-- Stores MIG-scene fusion results (artist ↔ scene alignment)
-- ============================================================================

CREATE TABLE IF NOT EXISTS mig_scene_alignment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  artist_slug TEXT NOT NULL,
  scene_slug TEXT NOT NULL,
  alignment NUMERIC NOT NULL CHECK (alignment >= 0 AND alignment <= 1),
  source JSONB NOT NULL DEFAULT '{}'::jsonb,
  reasoning TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(workspace_id, artist_slug, scene_slug)
);

CREATE INDEX idx_mig_scene_workspace ON mig_scene_alignment(workspace_id);
CREATE INDEX idx_mig_scene_artist ON mig_scene_alignment(artist_slug);
CREATE INDEX idx_mig_scene_scene ON mig_scene_alignment(scene_slug);
CREATE INDEX idx_mig_scene_alignment ON mig_scene_alignment(alignment DESC);

COMMENT ON TABLE mig_scene_alignment IS 'MIG + Scenes Engine fusion: artist-to-scene alignment scores';

-- ============================================================================
-- TABLE: mig_contact_fit
-- Stores MIG-based contact-artist alignment scores
-- ============================================================================

CREATE TABLE IF NOT EXISTS mig_contact_fit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  artist_slug TEXT NOT NULL,
  fit_score NUMERIC NOT NULL CHECK (fit_score >= 0 AND fit_score <= 1),
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  mig_paths JSONB DEFAULT '[]'::jsonb,
  graph_distance INTEGER,
  shared_scenes JSONB DEFAULT '[]'::jsonb,
  shared_microgenres JSONB DEFAULT '[]'::jsonb,
  mutual_connections INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(workspace_id, contact_id, artist_slug)
);

CREATE INDEX idx_mig_contact_fit_workspace ON mig_contact_fit(workspace_id);
CREATE INDEX idx_mig_contact_fit_contact ON mig_contact_fit(contact_id);
CREATE INDEX idx_mig_contact_fit_artist ON mig_contact_fit(artist_slug);
CREATE INDEX idx_mig_contact_fit_score ON mig_contact_fit(fit_score DESC);

COMMENT ON TABLE mig_contact_fit IS 'MIG-enhanced contact-artist fit scores with graph paths';

-- ============================================================================
-- TABLE: mig_coverage_events
-- Stores MIG + coverage timeline fusion
-- ============================================================================

CREATE TABLE IF NOT EXISTS mig_coverage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  artist_slug TEXT NOT NULL,
  mig_node_slug TEXT NOT NULL,
  mig_node_type TEXT NOT NULL,
  coverage_type TEXT NOT NULL CHECK (coverage_type IN (
    'press', 'playlist_add', 'radio_play', 'interview', 'review',
    'feature', 'mention', 'social', 'event', 'other'
  )),
  mig_impact_score NUMERIC DEFAULT 0,
  connected_nodes JSONB DEFAULT '[]'::jsonb,
  influence_delta NUMERIC DEFAULT 0,
  timestamp TIMESTAMPTZ NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mig_coverage_workspace ON mig_coverage_events(workspace_id);
CREATE INDEX idx_mig_coverage_artist ON mig_coverage_events(artist_slug);
CREATE INDEX idx_mig_coverage_node ON mig_coverage_events(mig_node_slug);
CREATE INDEX idx_mig_coverage_type ON mig_coverage_events(coverage_type);
CREATE INDEX idx_mig_coverage_timestamp ON mig_coverage_events(timestamp DESC);
CREATE INDEX idx_mig_coverage_impact ON mig_coverage_events(mig_impact_score DESC);

COMMENT ON TABLE mig_coverage_events IS 'MIG + Coverage timeline fusion with impact scoring';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE mig_influence_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE mig_scene_alignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE mig_contact_fit ENABLE ROW LEVEL SECURITY;
ALTER TABLE mig_coverage_events ENABLE ROW LEVEL SECURITY;

-- Policies: workspace-bound access

CREATE POLICY "Users can view influence scores in their workspace"
  ON mig_influence_scores
  FOR SELECT
  TO authenticated
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view scene alignments in their workspace"
  ON mig_scene_alignment
  FOR SELECT
  TO authenticated
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view contact fit in their workspace"
  ON mig_contact_fit
  FOR SELECT
  TO authenticated
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view coverage events in their workspace"
  ON mig_coverage_events
  FOR SELECT
  TO authenticated
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE user_id = auth.uid()
  ));

-- Write policies (service role only for now)

CREATE POLICY "Service role can insert influence scores"
  ON mig_influence_scores
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update influence scores"
  ON mig_influence_scores
  FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert scene alignments"
  ON mig_scene_alignment
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update scene alignments"
  ON mig_scene_alignment
  FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert contact fit"
  ON mig_contact_fit
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update contact fit"
  ON mig_contact_fit
  FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert coverage events"
  ON mig_coverage_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to compute contact fit score using MIG
CREATE OR REPLACE FUNCTION compute_mig_contact_fit(
  p_contact_id UUID,
  p_artist_slug TEXT,
  p_workspace_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
  fit_score NUMERIC := 0;
  graph_distance INTEGER;
  shared_count INTEGER;
BEGIN
  -- This is a placeholder - actual implementation would:
  -- 1. Get artist node from MIG
  -- 2. Get contact's associated MIG nodes
  -- 3. Calculate graph distance
  -- 4. Find shared scenes/microgenres
  -- 5. Compute weighted fit score

  RETURN fit_score;
END;
$$ LANGUAGE plpgsql;

-- Function to update influence scores for an entity
CREATE OR REPLACE FUNCTION update_mig_influence_score(
  p_workspace_id UUID,
  p_entity_slug TEXT,
  p_entity_type TEXT,
  p_influence_score NUMERIC,
  p_authority_score NUMERIC,
  p_relevance_score NUMERIC
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO mig_influence_scores (
    workspace_id,
    entity_slug,
    entity_type,
    influence_score,
    authority_score,
    relevance_score
  )
  VALUES (
    p_workspace_id,
    p_entity_slug,
    p_entity_type,
    p_influence_score,
    p_authority_score,
    p_relevance_score
  )
  ON CONFLICT (workspace_id, entity_slug)
  DO UPDATE SET
    influence_score = EXCLUDED.influence_score,
    authority_score = EXCLUDED.authority_score,
    relevance_score = EXCLUDED.relevance_score,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_mig_influence_scores_updated_at
  BEFORE UPDATE ON mig_influence_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mig_scene_alignment_updated_at
  BEFORE UPDATE ON mig_scene_alignment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mig_contact_fit_updated_at
  BEFORE UPDATE ON mig_contact_fit
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
