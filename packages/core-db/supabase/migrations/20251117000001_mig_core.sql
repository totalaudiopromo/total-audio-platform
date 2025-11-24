-- Music Industry Graph (MIG) Core Schema
-- This migration creates the foundational graph database layer for modelling
-- the entire UK/EU/global music ecosystem.

-- ============================================================================
-- TABLE: migraph_nodes
-- Represents all entities in the music ecosystem (artists, journalists,
-- radio hosts, playlists, blogs, DJs, labels, scenes, microgenres, events)
-- ============================================================================

CREATE TABLE IF NOT EXISTS migraph_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN (
    'artist',
    'journalist',
    'radio_host',
    'playlist',
    'blog',
    'dj',
    'label',
    'scene',
    'microgenre',
    'event',
    'venue',
    'festival',
    'radio_show',
    'podcast'
  )),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country TEXT NULL,
  metadata JSONB NULL DEFAULT '{}'::jsonb,
  external_ids JSONB NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups by slug
CREATE INDEX IF NOT EXISTS idx_migraph_nodes_slug ON migraph_nodes(slug);

-- Index for filtering by type
CREATE INDEX IF NOT EXISTS idx_migraph_nodes_type ON migraph_nodes(type);

-- Index for filtering by country
CREATE INDEX IF NOT EXISTS idx_migraph_nodes_country ON migraph_nodes(country) WHERE country IS NOT NULL;

-- Index for searching by name (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_migraph_nodes_name_trgm ON migraph_nodes USING gin(lower(name) gin_trgm_ops);

-- Full-text search index on name and metadata
CREATE INDEX IF NOT EXISTS idx_migraph_nodes_search ON migraph_nodes USING gin(
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(metadata::text, ''))
);

-- ============================================================================
-- TABLE: migraph_edges
-- Represents directional or undirected relationships between nodes
-- ============================================================================

CREATE TABLE IF NOT EXISTS migraph_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source UUID NOT NULL REFERENCES migraph_nodes(id) ON DELETE CASCADE,
  target UUID NOT NULL REFERENCES migraph_nodes(id) ON DELETE CASCADE,
  rel TEXT NOT NULL CHECK (rel IN (
    'influences',
    'supports',
    'covers',
    'follows',
    'writes_for',
    'programmes',
    'collaborates',
    'same_scene',
    'same_microgenre',
    'similar_audience',
    'scene_crossover',
    'trend_link',
    'plays_at',
    'books',
    'manages',
    'releases_on',
    'curates',
    'interviews',
    'reviews',
    'similar_to',
    'influenced_by',
    'remixes',
    'features',
    'part_of'
  )),
  weight NUMERIC NOT NULL DEFAULT 1.0 CHECK (weight >= 0),
  metadata JSONB NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate edges with same source, target, and relationship
  UNIQUE(source, target, rel)
);

-- Index for fast traversal from source
CREATE INDEX IF NOT EXISTS idx_migraph_edges_source ON migraph_edges(source);

-- Index for fast reverse traversal from target
CREATE INDEX IF NOT EXISTS idx_migraph_edges_target ON migraph_edges(target);

-- Index for filtering by relationship type
CREATE INDEX IF NOT EXISTS idx_migraph_edges_rel ON migraph_edges(rel);

-- Composite index for source + relationship queries
CREATE INDEX IF NOT EXISTS idx_migraph_edges_source_rel ON migraph_edges(source, rel);

-- Composite index for target + relationship queries
CREATE INDEX IF NOT EXISTS idx_migraph_edges_target_rel ON migraph_edges(target, rel);

-- Index for weight-based queries
CREATE INDEX IF NOT EXISTS idx_migraph_edges_weight ON migraph_edges(weight DESC);

-- ============================================================================
-- TABLE: migraph_metadata
-- Graph-wide typing, enrichment, and configuration storage
-- ============================================================================

CREATE TABLE IF NOT EXISTS migraph_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast key lookups
CREATE INDEX IF NOT EXISTS idx_migraph_metadata_key ON migraph_metadata(key);

-- ============================================================================
-- FUNCTIONS: Auto-update timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_migraph_nodes_updated_at
  BEFORE UPDATE ON migraph_nodes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_migraph_edges_updated_at
  BEFORE UPDATE ON migraph_edges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_migraph_metadata_updated_at
  BEFORE UPDATE ON migraph_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all MIG tables
ALTER TABLE migraph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE migraph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE migraph_metadata ENABLE ROW LEVEL SECURITY;

-- READ: All authenticated users can view MIG data
CREATE POLICY "Allow authenticated users to read nodes"
  ON migraph_nodes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read edges"
  ON migraph_edges
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read metadata"
  ON migraph_metadata
  FOR SELECT
  TO authenticated
  USING (true);

-- WRITE: Restricted to service role (admin-level permissions)
-- This ensures MIG is shared intelligence, not user-specific
CREATE POLICY "Allow service role to insert nodes"
  ON migraph_nodes
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Allow service role to insert edges"
  ON migraph_edges
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Allow service role to insert metadata"
  ON migraph_metadata
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- UPDATE: Restricted to service role
CREATE POLICY "Allow service role to update nodes"
  ON migraph_nodes
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role to update edges"
  ON migraph_edges
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role to update metadata"
  ON migraph_metadata
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- DELETE: Restricted to service role
CREATE POLICY "Allow service role to delete nodes"
  ON migraph_nodes
  FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to delete edges"
  ON migraph_edges
  FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to delete metadata"
  ON migraph_metadata
  FOR DELETE
  TO service_role
  USING (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get node neighbors with relationship filtering
CREATE OR REPLACE FUNCTION get_node_neighbors(
  node_id UUID,
  relationship_filter TEXT[] DEFAULT NULL,
  depth_limit INTEGER DEFAULT 1
)
RETURNS TABLE (
  neighbor_id UUID,
  neighbor_name TEXT,
  neighbor_type TEXT,
  relationship TEXT,
  weight NUMERIC,
  path_length INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE graph_traversal AS (
    -- Base case: direct neighbors
    SELECT
      CASE
        WHEN e.source = node_id THEN e.target
        ELSE e.source
      END AS neighbor_id,
      e.rel AS relationship,
      e.weight,
      1 AS path_length
    FROM migraph_edges e
    WHERE (e.source = node_id OR e.target = node_id)
      AND (relationship_filter IS NULL OR e.rel = ANY(relationship_filter))

    UNION

    -- Recursive case: traverse deeper
    SELECT
      CASE
        WHEN e.source = gt.neighbor_id THEN e.target
        ELSE e.source
      END AS neighbor_id,
      e.rel AS relationship,
      e.weight,
      gt.path_length + 1 AS path_length
    FROM graph_traversal gt
    JOIN migraph_edges e ON (e.source = gt.neighbor_id OR e.target = gt.neighbor_id)
    WHERE gt.path_length < depth_limit
      AND (relationship_filter IS NULL OR e.rel = ANY(relationship_filter))
  )
  SELECT DISTINCT
    gt.neighbor_id,
    n.name AS neighbor_name,
    n.type AS neighbor_type,
    gt.relationship,
    gt.weight,
    gt.path_length
  FROM graph_traversal gt
  JOIN migraph_nodes n ON n.id = gt.neighbor_id
  ORDER BY gt.path_length ASC, gt.weight DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to compute influence score for a node
CREATE OR REPLACE FUNCTION compute_influence_score(node_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  influence_score NUMERIC;
BEGIN
  SELECT
    COALESCE(
      SUM(
        CASE
          WHEN e.rel IN ('influences', 'supports') THEN e.weight * 2.0
          WHEN e.rel IN ('collaborates', 'features') THEN e.weight * 1.5
          ELSE e.weight
        END
      ),
      0
    )
  INTO influence_score
  FROM migraph_edges e
  WHERE e.source = node_id;

  RETURN influence_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INITIAL METADATA SETUP
-- ============================================================================

INSERT INTO migraph_metadata (key, value) VALUES
  ('version', '"1.0.0"'::jsonb),
  ('last_sync', to_jsonb(NOW())),
  ('node_types', '["artist","journalist","radio_host","playlist","blog","dj","label","scene","microgenre","event","venue","festival","radio_show","podcast"]'::jsonb),
  ('relationship_types', '["influences","supports","covers","follows","writes_for","programmes","collaborates","same_scene","same_microgenre","similar_audience","scene_crossover","trend_link","plays_at","books","manages","releases_on","curates","interviews","reviews","similar_to","influenced_by","remixes","features","part_of"]'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE migraph_nodes IS 'Core entity table for the Music Industry Graph - represents all entities in the music ecosystem';
COMMENT ON TABLE migraph_edges IS 'Relationship table for the Music Industry Graph - represents connections between entities';
COMMENT ON TABLE migraph_metadata IS 'Graph-wide configuration and metadata storage';

COMMENT ON COLUMN migraph_nodes.type IS 'Entity type: artist, journalist, radio_host, playlist, blog, dj, label, scene, microgenre, event, venue, festival, radio_show, podcast';
COMMENT ON COLUMN migraph_nodes.slug IS 'URL-safe unique identifier for the entity';
COMMENT ON COLUMN migraph_nodes.metadata IS 'Flexible JSONB storage for entity-specific data';
COMMENT ON COLUMN migraph_nodes.external_ids IS 'External platform IDs (Spotify, Apple Music, Discogs, etc.)';

COMMENT ON COLUMN migraph_edges.rel IS 'Relationship type between source and target nodes';
COMMENT ON COLUMN migraph_edges.weight IS 'Relationship strength/importance (0+, default 1.0)';
COMMENT ON COLUMN migraph_edges.metadata IS 'Flexible JSONB storage for relationship-specific data';
