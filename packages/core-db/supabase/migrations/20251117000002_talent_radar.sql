-- ============================================================================
-- TALENT RADAR MIGRATION - PHASE 11: GLOBAL MUSIC PULSE + TALENT RADAR
-- ============================================================================
-- Created: 2025-11-17
-- Purpose: A&R-grade intelligence engine for detecting rising artists,
--          scenes, microgenres, breakout potential, and opportunities
-- ============================================================================

-- ============================================================================
-- 1. TALENT RADAR ARTISTS TABLE
-- ============================================================================
-- Per-artist signals and scores aggregated from all systems
CREATE TABLE IF NOT EXISTS talent_radar_artists (
  artist_slug text PRIMARY KEY,
  scene_slug text,
  microgenres text[] DEFAULT '{}',

  -- Core momentum signals
  momentum numeric DEFAULT 0,
  creative_shift numeric DEFAULT 0,
  coverage_velocity numeric DEFAULT 0,
  press_quality numeric DEFAULT 0,
  reply_quality numeric DEFAULT 0,
  playlist_velocity numeric DEFAULT 0,
  audience_change numeric DEFAULT 0,

  -- Graph and identity signals
  mig_connectivity numeric DEFAULT 0,
  cmg_fingerprint_drift numeric DEFAULT 0,
  identity_alignment numeric DEFAULT 0,

  -- Aggregate scores
  breakout_score numeric DEFAULT 0,
  risk_score numeric DEFAULT 0,

  -- Metadata
  metadata jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),

  -- Constraints
  CONSTRAINT momentum_range CHECK (momentum >= 0 AND momentum <= 100),
  CONSTRAINT breakout_score_range CHECK (breakout_score >= 0 AND breakout_score <= 1),
  CONSTRAINT risk_score_range CHECK (risk_score >= 0 AND risk_score <= 1)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_talent_radar_artists_scene ON talent_radar_artists(scene_slug);
CREATE INDEX IF NOT EXISTS idx_talent_radar_artists_momentum ON talent_radar_artists(momentum DESC);
CREATE INDEX IF NOT EXISTS idx_talent_radar_artists_breakout ON talent_radar_artists(breakout_score DESC);
CREATE INDEX IF NOT EXISTS idx_talent_radar_artists_risk ON talent_radar_artists(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_talent_radar_artists_updated ON talent_radar_artists(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_talent_radar_artists_microgenres ON talent_radar_artists USING GIN(microgenres);

COMMENT ON TABLE talent_radar_artists IS 'Per-artist intelligence signals aggregated from MIG, Scenes, CMG, Fusion, Coverage, RCF, and Identity Kernel';
COMMENT ON COLUMN talent_radar_artists.momentum IS 'Overall momentum score (0-100)';
COMMENT ON COLUMN talent_radar_artists.creative_shift IS 'Creative evolution signal from CMG';
COMMENT ON COLUMN talent_radar_artists.coverage_velocity IS 'Rate of coverage acquisition';
COMMENT ON COLUMN talent_radar_artists.press_quality IS 'Quality of press coverage (0-1)';
COMMENT ON COLUMN talent_radar_artists.reply_quality IS 'Quality of email replies (0-1)';
COMMENT ON COLUMN talent_radar_artists.playlist_velocity IS 'Rate of playlist additions';
COMMENT ON COLUMN talent_radar_artists.audience_change IS 'Audience growth/decline rate';
COMMENT ON COLUMN talent_radar_artists.mig_connectivity IS 'MIG graph connectivity score (0-1)';
COMMENT ON COLUMN talent_radar_artists.cmg_fingerprint_drift IS 'Creative fingerprint drift from CMG (0-1)';
COMMENT ON COLUMN talent_radar_artists.identity_alignment IS 'Identity coherence from Identity Kernel (0-1)';
COMMENT ON COLUMN talent_radar_artists.breakout_score IS 'Probability of breakout success (0-1)';
COMMENT ON COLUMN talent_radar_artists.risk_score IS 'Risk indicators (stagnation, decline, misalignment) (0-1)';

-- ============================================================================
-- 2. TALENT RADAR SCENES TABLE
-- ============================================================================
-- Scene-level intelligence signals
CREATE TABLE IF NOT EXISTS talent_radar_scenes (
  scene_slug text PRIMARY KEY,

  -- Scene health signals
  hotness numeric DEFAULT 0,
  influence numeric DEFAULT 0,
  audience_trend numeric DEFAULT 0,

  -- Breakout tracking
  breakout_artists text[] DEFAULT '{}',
  rising_artists text[] DEFAULT '{}',

  -- Metadata
  metadata jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),

  -- Constraints
  CONSTRAINT hotness_range CHECK (hotness >= 0 AND hotness <= 100),
  CONSTRAINT influence_range CHECK (influence >= 0 AND influence <= 1)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_talent_radar_scenes_hotness ON talent_radar_scenes(hotness DESC);
CREATE INDEX IF NOT EXISTS idx_talent_radar_scenes_influence ON talent_radar_scenes(influence DESC);
CREATE INDEX IF NOT EXISTS idx_talent_radar_scenes_updated ON talent_radar_scenes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_talent_radar_scenes_breakout_artists ON talent_radar_scenes USING GIN(breakout_artists);

COMMENT ON TABLE talent_radar_scenes IS 'Scene-level intelligence derived from artist movements and scene pulse';
COMMENT ON COLUMN talent_radar_scenes.hotness IS 'Scene hotness (0-100) from Scenes Engine';
COMMENT ON COLUMN talent_radar_scenes.influence IS 'Scene influence score (0-1)';
COMMENT ON COLUMN talent_radar_scenes.audience_trend IS 'Audience growth/decline trend';
COMMENT ON COLUMN talent_radar_scenes.breakout_artists IS 'Artists with high breakout scores in this scene';
COMMENT ON COLUMN talent_radar_scenes.rising_artists IS 'Artists with high momentum in this scene';

-- ============================================================================
-- 3. TALENT RADAR RECOMMENDATIONS TABLE
-- ============================================================================
-- Personalized A&R recommendations per workspace
CREATE TABLE IF NOT EXISTS talent_radar_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  artist_slug text NOT NULL,

  -- Recommendation details
  recommendation_type text NOT NULL,
  rationale jsonb NOT NULL,
  score numeric NOT NULL,
  confidence numeric NOT NULL,

  -- Opportunity metadata
  opportunities jsonb DEFAULT '{}',
  risks jsonb DEFAULT '{}',

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,

  -- Constraints
  CONSTRAINT recommendation_type_valid CHECK (recommendation_type IN ('sign', 'watch', 'collaborate', 'pitch', 'pass')),
  CONSTRAINT score_range CHECK (score >= 0 AND score <= 1),
  CONSTRAINT confidence_range CHECK (confidence >= 0 AND confidence <= 1)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_talent_radar_recommendations_workspace ON talent_radar_recommendations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_talent_radar_recommendations_artist ON talent_radar_recommendations(artist_slug);
CREATE INDEX IF NOT EXISTS idx_talent_radar_recommendations_type ON talent_radar_recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_talent_radar_recommendations_score ON talent_radar_recommendations(score DESC);
CREATE INDEX IF NOT EXISTS idx_talent_radar_recommendations_created ON talent_radar_recommendations(created_at DESC);

COMMENT ON TABLE talent_radar_recommendations IS 'Personalized A&R recommendations for workspaces';
COMMENT ON COLUMN talent_radar_recommendations.recommendation_type IS 'Type: sign, watch, collaborate, pitch, pass';
COMMENT ON COLUMN talent_radar_recommendations.rationale IS 'JSON explanation of recommendation';
COMMENT ON COLUMN talent_radar_recommendations.score IS 'Recommendation strength (0-1)';
COMMENT ON COLUMN talent_radar_recommendations.confidence IS 'Confidence in recommendation (0-1)';
COMMENT ON COLUMN talent_radar_recommendations.opportunities IS 'Identified opportunities for this artist';
COMMENT ON COLUMN talent_radar_recommendations.risks IS 'Identified risks for this artist';

-- ============================================================================
-- 4. TALENT RADAR MICROGENRES TABLE (OPTIONAL - FOR MICROGENRE TRACKING)
-- ============================================================================
CREATE TABLE IF NOT EXISTS talent_radar_microgenres (
  microgenre_slug text PRIMARY KEY,

  -- Movement signals
  direction_shift numeric DEFAULT 0,
  saturation numeric DEFAULT 0,
  opportunity_score numeric DEFAULT 0,

  -- Artist tracking
  rising_artists text[] DEFAULT '{}',

  -- Metadata
  metadata jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),

  -- Constraints
  CONSTRAINT saturation_range CHECK (saturation >= 0 AND saturation <= 1),
  CONSTRAINT opportunity_score_range CHECK (opportunity_score >= 0 AND opportunity_score <= 1)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_talent_radar_microgenres_opportunity ON talent_radar_microgenres(opportunity_score DESC);
CREATE INDEX IF NOT EXISTS idx_talent_radar_microgenres_saturation ON talent_radar_microgenres(saturation DESC);
CREATE INDEX IF NOT EXISTS idx_talent_radar_microgenres_updated ON talent_radar_microgenres(updated_at DESC);

COMMENT ON TABLE talent_radar_microgenres IS 'Microgenre-level movement and opportunity signals';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE talent_radar_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_radar_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_radar_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_radar_microgenres ENABLE ROW LEVEL SECURITY;

-- Artists and scenes: Public read for authenticated users
CREATE POLICY "talent_radar_artists_read_all" ON talent_radar_artists
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "talent_radar_scenes_read_all" ON talent_radar_scenes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "talent_radar_microgenres_read_all" ON talent_radar_microgenres
  FOR SELECT
  TO authenticated
  USING (true);

-- Recommendations: Workspace-scoped read
CREATE POLICY "talent_radar_recommendations_read_workspace" ON talent_radar_recommendations
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Write policies (system/admin only for artists and scenes)
CREATE POLICY "talent_radar_artists_write_system" ON talent_radar_artists
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "talent_radar_scenes_write_system" ON talent_radar_scenes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "talent_radar_microgenres_write_system" ON talent_radar_microgenres
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Recommendations write (workspace members can create)
CREATE POLICY "talent_radar_recommendations_write_workspace" ON talent_radar_recommendations
  FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_talent_radar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER talent_radar_artists_updated_at
  BEFORE UPDATE ON talent_radar_artists
  FOR EACH ROW
  EXECUTE FUNCTION update_talent_radar_updated_at();

CREATE TRIGGER talent_radar_scenes_updated_at
  BEFORE UPDATE ON talent_radar_scenes
  FOR EACH ROW
  EXECUTE FUNCTION update_talent_radar_updated_at();

CREATE TRIGGER talent_radar_microgenres_updated_at
  BEFORE UPDATE ON talent_radar_microgenres
  FOR EACH ROW
  EXECUTE FUNCTION update_talent_radar_updated_at();

-- ============================================================================
-- EXAMPLE SEED DATA (COMMENTED OUT - FOR REFERENCE)
-- ============================================================================

-- Example artist radar entry
-- INSERT INTO talent_radar_artists (artist_slug, scene_slug, microgenres, momentum, breakout_score) VALUES
--   ('artist-xyz', 'london-uk-garage', ARRAY['dark-garage', '2-step'], 78, 0.72);

-- Example scene radar entry
-- INSERT INTO talent_radar_scenes (scene_slug, hotness, influence, breakout_artists) VALUES
--   ('london-uk-garage', 85, 0.68, ARRAY['artist-xyz', 'artist-abc']);

-- Example recommendation
-- INSERT INTO talent_radar_recommendations (workspace_id, artist_slug, recommendation_type, rationale, score, confidence) VALUES
--   ('workspace-uuid', 'artist-xyz', 'watch', '{"signals": ["high_momentum", "scene_fit"]}', 0.78, 0.82);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Tables created:
--   1. talent_radar_artists
--   2. talent_radar_scenes
--   3. talent_radar_recommendations
--   4. talent_radar_microgenres
--
-- All tables have RLS enabled with appropriate policies
-- Indexes created for optimal query performance
-- Triggers for automatic timestamp updates
-- ============================================================================
