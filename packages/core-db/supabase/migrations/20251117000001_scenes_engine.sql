-- ============================================================================
-- SCENES ENGINE MIGRATION
-- ============================================================================
-- Created: 2025-11-17
-- Purpose: Create tables for the Scenes Engine - an analytics layer for
--          modeling scenes, microgenres, regions, and cultural movements
-- ============================================================================

-- ============================================================================
-- 1. SCENES TABLE
-- ============================================================================
-- High-level scenes (local/global cultural clusters)
CREATE TABLE IF NOT EXISTS scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  region text,
  country text,
  microgenres text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fast lookups by slug
CREATE INDEX IF NOT EXISTS idx_scenes_slug ON scenes(slug);
-- Index for region/country filtering
CREATE INDEX IF NOT EXISTS idx_scenes_region ON scenes(region);
CREATE INDEX IF NOT EXISTS idx_scenes_country ON scenes(country);
-- GIN index for array searches
CREATE INDEX IF NOT EXISTS idx_scenes_microgenres ON scenes USING GIN(microgenres);
CREATE INDEX IF NOT EXISTS idx_scenes_tags ON scenes USING GIN(tags);

COMMENT ON TABLE scenes IS 'High-level cultural scenes (e.g., london-uk-garage, berlin-techno)';
COMMENT ON COLUMN scenes.slug IS 'URL-friendly unique identifier (e.g., london-uk-garage)';
COMMENT ON COLUMN scenes.region IS 'Human-readable region (e.g., London, UK)';
COMMENT ON COLUMN scenes.country IS 'ISO country code (e.g., GB, DE)';
COMMENT ON COLUMN scenes.microgenres IS 'Array of microgenre slugs associated with this scene';

-- ============================================================================
-- 2. MICROGENRES TABLE
-- ============================================================================
-- More granular style classifications
CREATE TABLE IF NOT EXISTS microgenres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  parent_scene_slug text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_microgenres_slug ON microgenres(slug);
CREATE INDEX IF NOT EXISTS idx_microgenres_parent_scene ON microgenres(parent_scene_slug);
CREATE INDEX IF NOT EXISTS idx_microgenres_tags ON microgenres USING GIN(tags);

COMMENT ON TABLE microgenres IS 'Granular style classifications (e.g., dark-garage, lofi-drill)';
COMMENT ON COLUMN microgenres.parent_scene_slug IS 'Optional default scene this microgenre belongs to';

-- ============================================================================
-- 3. SCENE MEMBERSHIPS TABLE
-- ============================================================================
-- Link entities (artists, DJs, playlists, radio shows, etc) to scenes/microgenres
CREATE TABLE IF NOT EXISTS scene_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid,
  entity_slug text NOT NULL,
  scene_slug text NOT NULL,
  microgenre_slug text,
  confidence numeric NOT NULL DEFAULT 0.5,
  source text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for fast entity lookups
CREATE INDEX IF NOT EXISTS idx_scene_memberships_entity ON scene_memberships(entity_type, entity_slug);
CREATE INDEX IF NOT EXISTS idx_scene_memberships_scene ON scene_memberships(scene_slug);
CREATE INDEX IF NOT EXISTS idx_scene_memberships_microgenre ON scene_memberships(microgenre_slug);
CREATE INDEX IF NOT EXISTS idx_scene_memberships_entity_id ON scene_memberships(entity_id) WHERE entity_id IS NOT NULL;
-- Composite index for entity-scene lookup
CREATE INDEX IF NOT EXISTS idx_scene_memberships_entity_scene ON scene_memberships(entity_slug, scene_slug);

COMMENT ON TABLE scene_memberships IS 'Links entities (artists, DJs, playlists, etc.) to scenes and microgenres';
COMMENT ON COLUMN scene_memberships.entity_type IS 'Type: artist, dj, playlist, radio_show, label, event';
COMMENT ON COLUMN scene_memberships.entity_id IS 'Optional MIG node ID reference';
COMMENT ON COLUMN scene_memberships.entity_slug IS 'MIG or external slug';
COMMENT ON COLUMN scene_memberships.confidence IS 'Confidence score 0.0-1.0';
COMMENT ON COLUMN scene_memberships.source IS 'Source: mig, cmg, manual, ai_inference, etc.';

-- ============================================================================
-- 4. SCENE TRENDS TABLE
-- ============================================================================
-- Time-series metrics per scene
CREATE TABLE IF NOT EXISTS scene_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_slug text NOT NULL,
  microgenre_slug text,
  time_bucket date NOT NULL,
  metric text NOT NULL,
  value numeric NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Indexes for time-series queries
CREATE INDEX IF NOT EXISTS idx_scene_trends_scene ON scene_trends(scene_slug, time_bucket DESC);
CREATE INDEX IF NOT EXISTS idx_scene_trends_microgenre ON scene_trends(microgenre_slug, time_bucket DESC) WHERE microgenre_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_scene_trends_metric ON scene_trends(metric, time_bucket DESC);
-- Composite index for scene + metric queries
CREATE INDEX IF NOT EXISTS idx_scene_trends_scene_metric ON scene_trends(scene_slug, metric, time_bucket DESC);

COMMENT ON TABLE scene_trends IS 'Time-series metrics for scenes and microgenres';
COMMENT ON COLUMN scene_trends.time_bucket IS 'Time period (day/week/month)';
COMMENT ON COLUMN scene_trends.metric IS 'Metric: campaign_volume, coverage, playlist_adds, radio_plays, community_mentions';

-- ============================================================================
-- 5. SCENE RELATIONSHIPS TABLE
-- ============================================================================
-- Scene-to-scene relationships
CREATE TABLE IF NOT EXISTS scene_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_scene_slug text NOT NULL,
  target_scene_slug text NOT NULL,
  relation_type text NOT NULL,
  weight numeric NOT NULL DEFAULT 1.0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),

  -- Prevent duplicate relationships
  CONSTRAINT unique_scene_relationship UNIQUE (source_scene_slug, target_scene_slug, relation_type)
);

-- Indexes for graph traversal
CREATE INDEX IF NOT EXISTS idx_scene_relationships_source ON scene_relationships(source_scene_slug);
CREATE INDEX IF NOT EXISTS idx_scene_relationships_target ON scene_relationships(target_scene_slug);
CREATE INDEX IF NOT EXISTS idx_scene_relationships_type ON scene_relationships(relation_type);
-- Bidirectional lookup
CREATE INDEX IF NOT EXISTS idx_scene_relationships_bidirectional ON scene_relationships(target_scene_slug, source_scene_slug);

COMMENT ON TABLE scene_relationships IS 'Scene-to-scene relationships and influence patterns';
COMMENT ON COLUMN scene_relationships.relation_type IS 'Type: influences, shares_audience, crossover, adjacent, emerging_from';
COMMENT ON COLUMN scene_relationships.weight IS 'Relationship strength (0.0-1.0+)';

-- ============================================================================
-- 6. SCENE RECOMMENDATIONS CACHE TABLE
-- ============================================================================
-- Cached recommendations per user/artist
CREATE TABLE IF NOT EXISTS scene_recommendations_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  artist_slug text,
  recommendations jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,

  -- One recommendation set per user/artist combo
  CONSTRAINT unique_user_artist_recommendation UNIQUE (user_id, artist_slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scene_recommendations_user ON scene_recommendations_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_scene_recommendations_artist ON scene_recommendations_cache(artist_slug) WHERE artist_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_scene_recommendations_expires ON scene_recommendations_cache(expires_at);

COMMENT ON TABLE scene_recommendations_cache IS 'Cached scene/microgenre recommendations per user';
COMMENT ON COLUMN scene_recommendations_cache.recommendations IS 'JSON: { scenes: [...], microgenres: [...], rationale: ... }';
COMMENT ON COLUMN scene_recommendations_cache.expires_at IS 'Cache expiry timestamp (typically 24 hours)';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE microgenres ENABLE ROW LEVEL SECURITY;
ALTER TABLE scene_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE scene_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE scene_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE scene_recommendations_cache ENABLE ROW LEVEL SECURITY;

-- Public read access for shared analytics data
CREATE POLICY "scenes_read_all" ON scenes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "microgenres_read_all" ON microgenres
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "scene_memberships_read_all" ON scene_memberships
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "scene_trends_read_all" ON scene_trends
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "scene_relationships_read_all" ON scene_relationships
  FOR SELECT
  TO authenticated
  USING (true);

-- Recommendations cache - restricted to user's own data
CREATE POLICY "scene_recommendations_read_own" ON scene_recommendations_cache
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admin write policies (to be refined with proper role checks if needed)
-- For now, allow authenticated users to insert/update (can be restricted later)
CREATE POLICY "scenes_write_authenticated" ON scenes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "microgenres_write_authenticated" ON microgenres
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "scene_memberships_write_authenticated" ON scene_memberships
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "scene_trends_write_authenticated" ON scene_trends
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "scene_relationships_write_authenticated" ON scene_relationships
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "scene_recommendations_write_own" ON scene_recommendations_cache
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_scenes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER scenes_updated_at
  BEFORE UPDATE ON scenes
  FOR EACH ROW
  EXECUTE FUNCTION update_scenes_updated_at();

CREATE TRIGGER microgenres_updated_at
  BEFORE UPDATE ON microgenres
  FOR EACH ROW
  EXECUTE FUNCTION update_scenes_updated_at();

-- ============================================================================
-- INITIAL SEED DATA (Optional - can be uncommented if needed)
-- ============================================================================

-- Example scenes (commented out - can be populated later)
-- INSERT INTO scenes (slug, name, description, region, country, tags) VALUES
--   ('london-uk-garage', 'London UK Garage', 'The UK Garage scene in London', 'London, UK', 'GB', ARRAY['electronic', 'bass', 'uk']),
--   ('berlin-techno', 'Berlin Techno', 'Berlin''s underground techno scene', 'Berlin, DE', 'DE', ARRAY['electronic', 'techno', 'underground']),
--   ('manchester-alt-rap', 'Manchester Alternative Rap', 'Alternative rap and grime scene in Manchester', 'Manchester, UK', 'GB', ARRAY['rap', 'grime', 'alternative'])
-- ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Tables created:
--   1. scenes
--   2. microgenres
--   3. scene_memberships
--   4. scene_trends
--   5. scene_relationships
--   6. scene_recommendations_cache
--
-- All tables have RLS enabled with appropriate policies
-- Indexes created for optimal query performance
-- ============================================================================
