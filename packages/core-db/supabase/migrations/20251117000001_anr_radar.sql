-- ========================================
-- A&R / Talent Discovery Radar System
-- ========================================
-- Purpose: Scouting and breakout probability system for PR agencies, labels,
-- managers, and advanced artists. Provides talent radar dashboard + scoring engine.
--
-- This migration creates NEW tables only - does NOT modify existing systems
-- (MIG, Scenes Engine, CMG, Fusion Layer, MAL, Autopilot, CoachOS, CIS)
-- ========================================

-- ========================================
-- Table 1: anr_candidates
-- ========================================
-- Represents an "artist candidate" in the radar system
CREATE TABLE IF NOT EXISTS anr_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_slug TEXT NOT NULL,           -- MIG artist node slug or internal artist ID alias
  display_name TEXT NOT NULL,
  primary_scene_slug TEXT,             -- from Scenes Engine
  microgenres TEXT[],                  -- from Scenes Engine / CMG
  country TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,  -- social links, basic info if available
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Unique index on artist_slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_anr_candidates_artist_slug ON anr_candidates(artist_slug);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_anr_candidates_scene ON anr_candidates(primary_scene_slug);
CREATE INDEX IF NOT EXISTS idx_anr_candidates_country ON anr_candidates(country);
CREATE INDEX IF NOT EXISTS idx_anr_candidates_microgenres ON anr_candidates USING GIN (microgenres);

COMMENT ON TABLE anr_candidates IS 'Artist candidates in the A&R Radar system';
COMMENT ON COLUMN anr_candidates.artist_slug IS 'MIG artist node slug or internal artist ID alias';
COMMENT ON COLUMN anr_candidates.primary_scene_slug IS 'Primary scene from Scenes Engine';
COMMENT ON COLUMN anr_candidates.microgenres IS 'Array of microgenres from Scenes Engine / CMG';
COMMENT ON COLUMN anr_candidates.metadata IS 'Social links, basic info, additional context';

-- ========================================
-- Table 2: anr_scores
-- ========================================
-- Snapshot of scores for candidates over time
CREATE TABLE IF NOT EXISTS anr_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES anr_candidates(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,

  -- Individual dimension scores (0.0-1.0)
  breakout_score NUMERIC(5,4) NOT NULL CHECK (breakout_score >= 0 AND breakout_score <= 1),
  momentum_score NUMERIC(5,4) NOT NULL CHECK (momentum_score >= 0 AND momentum_score <= 1),
  scene_alignment_score NUMERIC(5,4) NOT NULL CHECK (scene_alignment_score >= 0 AND scene_alignment_score <= 1),
  creative_uniqueness_score NUMERIC(5,4) NOT NULL CHECK (creative_uniqueness_score >= 0 AND creative_uniqueness_score <= 1),
  campaign_efficiency_score NUMERIC(5,4) NOT NULL CHECK (campaign_efficiency_score >= 0 AND campaign_efficiency_score <= 1),
  engagement_quality_score NUMERIC(5,4) NOT NULL CHECK (engagement_quality_score >= 0 AND engagement_quality_score <= 1),
  risk_score NUMERIC(5,4) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 1),

  -- Composite score (0.0-1.0)
  composite_score NUMERIC(5,4) NOT NULL CHECK (composite_score >= 0 AND composite_score <= 1),

  -- Explanation, breakdown, model version
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for querying
CREATE INDEX IF NOT EXISTS idx_anr_scores_candidate ON anr_scores(candidate_id, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_anr_scores_date ON anr_scores(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_anr_scores_composite ON anr_scores(composite_score DESC);
CREATE INDEX IF NOT EXISTS idx_anr_scores_breakout ON anr_scores(breakout_score DESC);
CREATE INDEX IF NOT EXISTS idx_anr_scores_momentum ON anr_scores(momentum_score DESC);

COMMENT ON TABLE anr_scores IS 'Time-series snapshots of A&R scores for candidates';
COMMENT ON COLUMN anr_scores.breakout_score IS 'Breakout probability score (0.0-1.0)';
COMMENT ON COLUMN anr_scores.momentum_score IS 'Momentum/velocity score (0.0-1.0)';
COMMENT ON COLUMN anr_scores.scene_alignment_score IS 'Fit between artist sound and current high-pulse scenes (0.0-1.0)';
COMMENT ON COLUMN anr_scores.creative_uniqueness_score IS 'Creative uniqueness vs genre norms (0.0-1.0)';
COMMENT ON COLUMN anr_scores.campaign_efficiency_score IS 'Campaign outcome vs effort (0.0-1.0)';
COMMENT ON COLUMN anr_scores.engagement_quality_score IS 'Quality of engagement vs volume (0.0-1.0)';
COMMENT ON COLUMN anr_scores.risk_score IS 'Risk factors: volatility, overexposure, low diversity (0.0-1.0)';
COMMENT ON COLUMN anr_scores.composite_score IS 'Weighted composite score (0.0-1.0)';
COMMENT ON COLUMN anr_scores.metadata IS 'Explanation, breakdown, model version, weights used';

-- ========================================
-- Table 3: anr_events
-- ========================================
-- Important events derived from other systems
CREATE TABLE IF NOT EXISTS anr_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES anr_candidates(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'campaign_win',
    'playlist_add',
    'radio_play',
    'press_feature',
    'community_spike',
    'scene_crossover',
    'creative_breakthrough'
  )),
  event_date DATE NOT NULL,
  weight NUMERIC(5,2) NOT NULL DEFAULT 1.0,  -- Event importance weight
  source TEXT NOT NULL,                      -- 'tracker', 'mig', 'scenes', 'cmg', 'manual'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for querying
CREATE INDEX IF NOT EXISTS idx_anr_events_candidate ON anr_events(candidate_id, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_anr_events_type ON anr_events(event_type);
CREATE INDEX IF NOT EXISTS idx_anr_events_date ON anr_events(event_date);
CREATE INDEX IF NOT EXISTS idx_anr_events_source ON anr_events(source);

COMMENT ON TABLE anr_events IS 'Important events derived from other systems (Tracker, MIG, Scenes, CMG)';
COMMENT ON COLUMN anr_events.event_type IS 'Type of event: campaign_win, playlist_add, radio_play, etc.';
COMMENT ON COLUMN anr_events.weight IS 'Event importance weight for scoring calculations';
COMMENT ON COLUMN anr_events.source IS 'Source system: tracker, mig, scenes, cmg, manual';

-- ========================================
-- Table 4: anr_shortlists
-- ========================================
-- Saved scouting shortlists
CREATE TABLE IF NOT EXISTS anr_shortlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  workspace_id UUID,                    -- Optional workspace association
  name TEXT NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL,              -- { scene, country, min_score, etc. }
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anr_shortlists_user ON anr_shortlists(user_id);
CREATE INDEX IF NOT EXISTS idx_anr_shortlists_workspace ON anr_shortlists(workspace_id);
CREATE INDEX IF NOT EXISTS idx_anr_shortlists_created ON anr_shortlists(created_at DESC);

COMMENT ON TABLE anr_shortlists IS 'Saved scouting shortlists created by users';
COMMENT ON COLUMN anr_shortlists.criteria IS 'Filter criteria: scene, country, min_score, etc.';

-- ========================================
-- Table 5: anr_shortlist_members
-- ========================================
-- Members of a shortlist
CREATE TABLE IF NOT EXISTS anr_shortlist_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shortlist_id UUID NOT NULL REFERENCES anr_shortlists(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES anr_candidates(id) ON DELETE CASCADE,
  score NUMERIC(5,4),                   -- Snapshot of score when added
  position INTEGER,                      -- Order in shortlist
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anr_shortlist_members_shortlist ON anr_shortlist_members(shortlist_id, position);
CREATE INDEX IF NOT EXISTS idx_anr_shortlist_members_candidate ON anr_shortlist_members(candidate_id);

-- Unique constraint: candidate can only appear once per shortlist
CREATE UNIQUE INDEX IF NOT EXISTS idx_anr_shortlist_members_unique ON anr_shortlist_members(shortlist_id, candidate_id);

COMMENT ON TABLE anr_shortlist_members IS 'Candidates included in shortlists with notes and ordering';

-- ========================================
-- Table 6: anr_insights
-- ========================================
-- A&R insights generated by the engine
CREATE TABLE IF NOT EXISTS anr_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN (
    'scene_opportunity',
    'artist_to_watch',
    'roster_gap',
    'campaign_potential'
  )),
  content JSONB NOT NULL,               -- Insight details: title, description, recommendations
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anr_insights_user ON anr_insights(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_anr_insights_type ON anr_insights(insight_type);

COMMENT ON TABLE anr_insights IS 'A&R insights generated by the engine for users';
COMMENT ON COLUMN anr_insights.insight_type IS 'Type: scene_opportunity, artist_to_watch, roster_gap, campaign_potential';
COMMENT ON COLUMN anr_insights.content IS 'Insight details: title, description, recommendations, data';

-- ========================================
-- Row Level Security (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE anr_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE anr_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE anr_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE anr_shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE anr_shortlist_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE anr_insights ENABLE ROW LEVEL SECURITY;

-- anr_candidates: readable by all authenticated users (scene-wide radar)
CREATE POLICY "Authenticated users can view candidates" ON anr_candidates
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- anr_scores: readable by all authenticated users
CREATE POLICY "Authenticated users can view scores" ON anr_scores
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- anr_events: readable by all authenticated users
CREATE POLICY "Authenticated users can view events" ON anr_events
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- anr_shortlists: user can view their own or workspace shortlists
CREATE POLICY "Users can view their own shortlists" ON anr_shortlists
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create shortlists" ON anr_shortlists
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own shortlists" ON anr_shortlists
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own shortlists" ON anr_shortlists
  FOR DELETE
  USING (user_id = auth.uid());

-- anr_shortlist_members: can view if can view parent shortlist
CREATE POLICY "Users can view shortlist members" ON anr_shortlist_members
  FOR SELECT
  USING (
    shortlist_id IN (
      SELECT id FROM anr_shortlists
      WHERE user_id = auth.uid() OR
            workspace_id IN (
              SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
            )
    )
  );

CREATE POLICY "Users can manage their shortlist members" ON anr_shortlist_members
  FOR ALL
  USING (
    shortlist_id IN (
      SELECT id FROM anr_shortlists WHERE user_id = auth.uid()
    )
  );

-- anr_insights: user-specific
CREATE POLICY "Users can view their own insights" ON anr_insights
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own insights" ON anr_insights
  FOR DELETE
  USING (user_id = auth.uid());

-- ========================================
-- Helper Functions
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_anr_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER anr_candidates_updated_at
  BEFORE UPDATE ON anr_candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_anr_updated_at();

CREATE TRIGGER anr_shortlists_updated_at
  BEFORE UPDATE ON anr_shortlists
  FOR EACH ROW
  EXECUTE FUNCTION update_anr_updated_at();

-- ========================================
-- Service Role Permissions
-- ========================================
-- Allow service role to write to candidates, scores, events for ingestion

-- Grant INSERT/UPDATE to service role for data ingestion
-- (In production, these would be granted via Supabase service role permissions)

-- ========================================
-- Example Queries (for reference)
-- ========================================

-- Find top breakout candidates in a scene
-- SELECT c.*, s.composite_score, s.breakout_score, s.momentum_score
-- FROM anr_candidates c
-- JOIN anr_scores s ON c.id = s.candidate_id
-- WHERE c.primary_scene_slug = 'hyperpop-uk'
--   AND s.snapshot_date = (
--     SELECT MAX(snapshot_date) FROM anr_scores WHERE candidate_id = c.id
--   )
-- ORDER BY s.breakout_score DESC
-- LIMIT 20;

-- Find candidates with high momentum
-- SELECT c.*, s.momentum_score, s.composite_score
-- FROM anr_candidates c
-- JOIN anr_scores s ON c.id = s.candidate_id
-- WHERE s.snapshot_date = (
--     SELECT MAX(snapshot_date) FROM anr_scores WHERE candidate_id = c.id
--   )
--   AND s.momentum_score > 0.7
-- ORDER BY s.momentum_score DESC;

-- Get score history for a candidate
-- SELECT snapshot_date, composite_score, breakout_score, momentum_score
-- FROM anr_scores
-- WHERE candidate_id = 'candidate-uuid-here'
-- ORDER BY snapshot_date DESC;

-- Get recent events for a candidate
-- SELECT event_type, event_date, weight, source, metadata
-- FROM anr_events
-- WHERE candidate_id = 'candidate-uuid-here'
-- ORDER BY event_date DESC
-- LIMIT 50;

-- ========================================
-- ROLLBACK SCRIPT (Run if migration needs to be reverted)
-- ========================================
-- DROP TRIGGER IF EXISTS anr_candidates_updated_at ON anr_candidates;
-- DROP TRIGGER IF EXISTS anr_shortlists_updated_at ON anr_shortlists;
-- DROP FUNCTION IF EXISTS update_anr_updated_at();
-- DROP TABLE IF EXISTS anr_insights;
-- DROP TABLE IF EXISTS anr_shortlist_members;
-- DROP TABLE IF EXISTS anr_shortlists;
-- DROP TABLE IF EXISTS anr_events;
-- DROP TABLE IF EXISTS anr_scores;
-- DROP TABLE IF EXISTS anr_candidates;
-- ========================================
