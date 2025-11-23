-- Real-Time Coverage Feed (RCF) - Phase 2
-- Migration created: 2025-11-17
-- Adds: Trends, Alerts, Rules, Digests, Velocity tracking

-- ============================================================================
-- 1. rcf_trends - Trending entities (artists, scenes, publications, playlists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS rcf_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,        -- artist, scene, playlist, publication, blog, station
  entity_slug text NOT NULL,
  window text NOT NULL,             -- 1h, 6h, 24h, 7d, 30d
  score numeric NOT NULL DEFAULT 0, -- trend score (0-100)
  velocity numeric NOT NULL DEFAULT 0, -- events per hour
  acceleration numeric NOT NULL DEFAULT 0, -- velocity change rate
  change numeric NOT NULL DEFAULT 0, -- % change from previous window
  event_count integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_rcf_trends_entity ON rcf_trends(entity_type, entity_slug);
CREATE INDEX IF NOT EXISTS idx_rcf_trends_window ON rcf_trends(window);
CREATE INDEX IF NOT EXISTS idx_rcf_trends_score ON rcf_trends(score DESC);
CREATE INDEX IF NOT EXISTS idx_rcf_trends_created_at ON rcf_trends(created_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_rcf_trends_lookup ON rcf_trends(entity_type, window, created_at DESC);

COMMENT ON TABLE rcf_trends IS 'Trending entities computed from RCF event streams';
COMMENT ON COLUMN rcf_trends.score IS 'Trend score (0-100) - higher means more trending';
COMMENT ON COLUMN rcf_trends.velocity IS 'Event frequency (events per hour)';
COMMENT ON COLUMN rcf_trends.acceleration IS 'Rate of velocity change';
COMMENT ON COLUMN rcf_trends.change IS 'Percentage change from previous window';

-- ============================================================================
-- 2. rcf_alerts - Anomaly detection and threshold alerts
-- ============================================================================

CREATE TABLE IF NOT EXISTS rcf_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NULL,
  user_id uuid NULL,
  artist_slug text NULL,
  scene_slug text NULL,
  entity_slug text NULL,
  alert_type text NOT NULL,         -- spike, threshold, anomaly, first_event, high_cred
  severity text NOT NULL,           -- info, warning, critical
  title text NOT NULL,
  message text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  acknowledged boolean DEFAULT false,
  acknowledged_at timestamptz NULL,
  acknowledged_by uuid NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rcf_alerts_workspace ON rcf_alerts(workspace_id) WHERE workspace_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rcf_alerts_user ON rcf_alerts(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rcf_alerts_artist ON rcf_alerts(artist_slug) WHERE artist_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rcf_alerts_scene ON rcf_alerts(scene_slug) WHERE scene_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rcf_alerts_type ON rcf_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_rcf_alerts_severity ON rcf_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_rcf_alerts_acknowledged ON rcf_alerts(acknowledged, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rcf_alerts_created_at ON rcf_alerts(created_at DESC);

COMMENT ON TABLE rcf_alerts IS 'RCF alerts for spikes, anomalies, and threshold breaches';
COMMENT ON COLUMN rcf_alerts.alert_type IS 'Alert type: spike, threshold, anomaly, first_event, high_cred';
COMMENT ON COLUMN rcf_alerts.severity IS 'Alert severity: info, warning, critical';

-- ============================================================================
-- 3. rcf_rules - Ingestion rules for filtering and weighting
-- ============================================================================

CREATE TABLE IF NOT EXISTS rcf_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  rule_type text NOT NULL,          -- block_source, prioritise_source, downweight_type, upweight_type, block_type
  value text NOT NULL,              -- source slug or event type
  weight_modifier numeric NULL,     -- multiplier for weight (0.0-2.0)
  enabled boolean DEFAULT true,
  priority integer DEFAULT 0,       -- higher priority rules execute first
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rcf_rules_workspace ON rcf_rules(workspace_id);
CREATE INDEX IF NOT EXISTS idx_rcf_rules_type ON rcf_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_rcf_rules_enabled ON rcf_rules(enabled) WHERE enabled = true;
CREATE INDEX IF NOT EXISTS idx_rcf_rules_priority ON rcf_rules(priority DESC);

-- Unique constraint: one rule per workspace + type + value
CREATE UNIQUE INDEX IF NOT EXISTS idx_rcf_rules_unique ON rcf_rules(workspace_id, rule_type, value);

COMMENT ON TABLE rcf_rules IS 'Workspace-level rules for RCF event filtering and weighting';
COMMENT ON COLUMN rcf_rules.rule_type IS 'Rule type: block_source, prioritise_source, downweight_type, upweight_type, block_type';
COMMENT ON COLUMN rcf_rules.weight_modifier IS 'Weight multiplier (0.0-2.0) - NULL for block rules';

-- ============================================================================
-- 4. rcf_digests - Daily/weekly summaries
-- ============================================================================

CREATE TABLE IF NOT EXISTS rcf_digests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  period text NOT NULL,             -- daily, weekly
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  summary jsonb NOT NULL DEFAULT '{}',
  top_events jsonb DEFAULT '[]',
  top_artists jsonb DEFAULT '[]',
  top_scenes jsonb DEFAULT '[]',
  top_sources jsonb DEFAULT '[]',
  biggest_movers jsonb DEFAULT '[]',
  stats jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rcf_digests_workspace ON rcf_digests(workspace_id);
CREATE INDEX IF NOT EXISTS idx_rcf_digests_period ON rcf_digests(period);
CREATE INDEX IF NOT EXISTS idx_rcf_digests_dates ON rcf_digests(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_rcf_digests_created_at ON rcf_digests(created_at DESC);

-- Unique constraint: one digest per workspace + period + date range
CREATE UNIQUE INDEX IF NOT EXISTS idx_rcf_digests_unique ON rcf_digests(workspace_id, period, start_date);

COMMENT ON TABLE rcf_digests IS 'RCF digest summaries for daily/weekly reporting';
COMMENT ON COLUMN rcf_digests.summary IS 'High-level summary and insights';
COMMENT ON COLUMN rcf_digests.top_events IS 'Top 10 events for the period';
COMMENT ON COLUMN rcf_digests.biggest_movers IS 'Artists/scenes with biggest trend changes';

-- ============================================================================
-- 5. rcf_velocity_snapshots - Historical velocity tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS rcf_velocity_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,        -- artist, scene, publication, playlist
  entity_slug text NOT NULL,
  window text NOT NULL,             -- 1h, 6h, 24h
  velocity numeric NOT NULL DEFAULT 0,
  acceleration numeric NOT NULL DEFAULT 0,
  event_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rcf_velocity_entity ON rcf_velocity_snapshots(entity_type, entity_slug);
CREATE INDEX IF NOT EXISTS idx_rcf_velocity_window ON rcf_velocity_snapshots(window);
CREATE INDEX IF NOT EXISTS idx_rcf_velocity_created_at ON rcf_velocity_snapshots(created_at DESC);

-- Composite index for time series queries
CREATE INDEX IF NOT EXISTS idx_rcf_velocity_timeseries ON rcf_velocity_snapshots(entity_type, entity_slug, window, created_at DESC);

COMMENT ON TABLE rcf_velocity_snapshots IS 'Historical velocity snapshots for trend analysis';

-- ============================================================================
-- 6. rcf_media_graph_nodes - Media ecosystem graph nodes
-- ============================================================================

CREATE TABLE IF NOT EXISTS rcf_media_graph_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_type text NOT NULL,          -- publication, playlist, station, blog, influencer
  node_slug text NOT NULL,
  name text NOT NULL,
  category text NULL,               -- tier1, tier2, tier3, indie, community
  metadata jsonb DEFAULT '{}',
  credibility_score numeric DEFAULT 0.5,
  influence_score numeric DEFAULT 0.5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_rcf_media_graph_nodes_unique ON rcf_media_graph_nodes(node_type, node_slug);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rcf_media_graph_nodes_type ON rcf_media_graph_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_rcf_media_graph_nodes_credibility ON rcf_media_graph_nodes(credibility_score DESC);
CREATE INDEX IF NOT EXISTS idx_rcf_media_graph_nodes_influence ON rcf_media_graph_nodes(influence_score DESC);

COMMENT ON TABLE rcf_media_graph_nodes IS 'Media ecosystem graph nodes (publications, playlists, stations, etc.)';

-- ============================================================================
-- 7. rcf_media_graph_edges - Media ecosystem relationships
-- ============================================================================

CREATE TABLE IF NOT EXISTS rcf_media_graph_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_node_id uuid NOT NULL REFERENCES rcf_media_graph_nodes(id) ON DELETE CASCADE,
  target_node_id uuid NOT NULL REFERENCES rcf_media_graph_nodes(id) ON DELETE CASCADE,
  edge_type text NOT NULL,          -- shared_artist, shared_scene, co_occurrence, similar_category
  weight numeric DEFAULT 1.0,
  co_occurrence_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_rcf_media_graph_edges_unique ON rcf_media_graph_edges(source_node_id, target_node_id, edge_type);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rcf_media_graph_edges_source ON rcf_media_graph_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_rcf_media_graph_edges_target ON rcf_media_graph_edges(target_node_id);
CREATE INDEX IF NOT EXISTS idx_rcf_media_graph_edges_type ON rcf_media_graph_edges(edge_type);
CREATE INDEX IF NOT EXISTS idx_rcf_media_graph_edges_weight ON rcf_media_graph_edges(weight DESC);

COMMENT ON TABLE rcf_media_graph_edges IS 'Relationships between media ecosystem nodes';

-- ============================================================================
-- 8. Row Level Security (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE rcf_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE rcf_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rcf_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rcf_digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rcf_velocity_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE rcf_media_graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rcf_media_graph_edges ENABLE ROW LEVEL SECURITY;

-- rcf_trends: readable by all authenticated users
DROP POLICY IF EXISTS "rcf_trends_select_all" ON rcf_trends;
CREATE POLICY "rcf_trends_select_all" ON rcf_trends
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "rcf_trends_insert_authenticated" ON rcf_trends;
CREATE POLICY "rcf_trends_insert_authenticated" ON rcf_trends
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- rcf_alerts: workspace-scoped or user-scoped
DROP POLICY IF EXISTS "rcf_alerts_select_own" ON rcf_alerts;
CREATE POLICY "rcf_alerts_select_own" ON rcf_alerts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR workspace_id IS NULL);

DROP POLICY IF EXISTS "rcf_alerts_insert_authenticated" ON rcf_alerts;
CREATE POLICY "rcf_alerts_insert_authenticated" ON rcf_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "rcf_alerts_update_own" ON rcf_alerts;
CREATE POLICY "rcf_alerts_update_own" ON rcf_alerts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR workspace_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR workspace_id IS NULL);

-- rcf_rules: workspace-scoped
DROP POLICY IF EXISTS "rcf_rules_select_workspace" ON rcf_rules;
CREATE POLICY "rcf_rules_select_workspace" ON rcf_rules
  FOR SELECT
  TO authenticated
  USING (true); -- TODO: Add workspace membership check

DROP POLICY IF EXISTS "rcf_rules_insert_workspace" ON rcf_rules;
CREATE POLICY "rcf_rules_insert_workspace" ON rcf_rules
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- TODO: Add workspace membership check

DROP POLICY IF EXISTS "rcf_rules_update_workspace" ON rcf_rules;
CREATE POLICY "rcf_rules_update_workspace" ON rcf_rules
  FOR UPDATE
  TO authenticated
  USING (true) -- TODO: Add workspace membership check
  WITH CHECK (true);

DROP POLICY IF EXISTS "rcf_rules_delete_workspace" ON rcf_rules;
CREATE POLICY "rcf_rules_delete_workspace" ON rcf_rules
  FOR DELETE
  TO authenticated
  USING (true); -- TODO: Add workspace membership check

-- rcf_digests: workspace-scoped
DROP POLICY IF EXISTS "rcf_digests_select_workspace" ON rcf_digests;
CREATE POLICY "rcf_digests_select_workspace" ON rcf_digests
  FOR SELECT
  TO authenticated
  USING (true); -- TODO: Add workspace membership check

DROP POLICY IF EXISTS "rcf_digests_insert_authenticated" ON rcf_digests;
CREATE POLICY "rcf_digests_insert_authenticated" ON rcf_digests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- rcf_velocity_snapshots: readable by all authenticated users
DROP POLICY IF EXISTS "rcf_velocity_snapshots_select_all" ON rcf_velocity_snapshots;
CREATE POLICY "rcf_velocity_snapshots_select_all" ON rcf_velocity_snapshots
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "rcf_velocity_snapshots_insert_authenticated" ON rcf_velocity_snapshots;
CREATE POLICY "rcf_velocity_snapshots_insert_authenticated" ON rcf_velocity_snapshots
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- rcf_media_graph_nodes: readable by all authenticated users
DROP POLICY IF EXISTS "rcf_media_graph_nodes_select_all" ON rcf_media_graph_nodes;
CREATE POLICY "rcf_media_graph_nodes_select_all" ON rcf_media_graph_nodes
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "rcf_media_graph_nodes_modify_authenticated" ON rcf_media_graph_nodes;
CREATE POLICY "rcf_media_graph_nodes_modify_authenticated" ON rcf_media_graph_nodes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- rcf_media_graph_edges: readable by all authenticated users
DROP POLICY IF EXISTS "rcf_media_graph_edges_select_all" ON rcf_media_graph_edges;
CREATE POLICY "rcf_media_graph_edges_select_all" ON rcf_media_graph_edges
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "rcf_media_graph_edges_modify_authenticated" ON rcf_media_graph_edges;
CREATE POLICY "rcf_media_graph_edges_modify_authenticated" ON rcf_media_graph_edges
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 9. Triggers for updated_at timestamps
-- ============================================================================

DROP TRIGGER IF EXISTS update_rcf_rules_updated_at ON rcf_rules;
CREATE TRIGGER update_rcf_rules_updated_at
  BEFORE UPDATE ON rcf_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rcf_media_graph_nodes_updated_at ON rcf_media_graph_nodes;
CREATE TRIGGER update_rcf_media_graph_nodes_updated_at
  BEFORE UPDATE ON rcf_media_graph_nodes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rcf_media_graph_edges_updated_at ON rcf_media_graph_edges;
CREATE TRIGGER update_rcf_media_graph_edges_updated_at
  BEFORE UPDATE ON rcf_media_graph_edges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
