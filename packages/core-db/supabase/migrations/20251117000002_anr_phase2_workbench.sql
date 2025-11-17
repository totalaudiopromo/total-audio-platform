-- ========================================
-- A&R Radar - Phase 2: Workbench & Deal Flow Manager
-- ========================================
-- Purpose: Upgrade A&R Radar to full workbench with roster management,
-- deal flow tracking, watchlists, showcases, and collaboration recommendations.
--
-- This migration adds 8 new tables on top of Phase 1 foundation.
-- ========================================

-- ========================================
-- Table 1: anr_rosters
-- ========================================
-- Represents a "roster" for a label/agency/workspace
CREATE TABLE IF NOT EXISTS anr_rosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anr_rosters_workspace ON anr_rosters(workspace_id);
CREATE INDEX IF NOT EXISTS idx_anr_rosters_created ON anr_rosters(created_at DESC);

COMMENT ON TABLE anr_rosters IS 'Rosters for labels, agencies, and management companies';
COMMENT ON COLUMN anr_rosters.workspace_id IS 'Workspace/organization owning this roster';

-- ========================================
-- Table 2: anr_roster_members
-- ========================================
-- Links artists to a roster
CREATE TABLE IF NOT EXISTS anr_roster_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roster_id UUID NOT NULL REFERENCES anr_rosters(id) ON DELETE CASCADE,
  artist_slug TEXT NOT NULL,
  role TEXT DEFAULT 'core' CHECK (role IN ('core', 'development', 'legacy', 'featured')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on_hold', 'inactive')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anr_roster_members_roster ON anr_roster_members(roster_id);
CREATE INDEX IF NOT EXISTS idx_anr_roster_members_artist ON anr_roster_members(artist_slug);
CREATE INDEX IF NOT EXISTS idx_anr_roster_members_status ON anr_roster_members(roster_id, status);

-- Unique constraint: artist can only be in roster once
CREATE UNIQUE INDEX IF NOT EXISTS idx_anr_roster_members_unique ON anr_roster_members(roster_id, artist_slug);

COMMENT ON TABLE anr_roster_members IS 'Artists on a roster with role and status';
COMMENT ON COLUMN anr_roster_members.role IS 'Artist role: core, development, legacy, featured';
COMMENT ON COLUMN anr_roster_members.status IS 'Current status: active, on_hold, inactive';

-- ========================================
-- Table 3: anr_deals
-- ========================================
-- Tracks deal flow entries
CREATE TABLE IF NOT EXISTS anr_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  artist_slug TEXT NOT NULL,
  roster_id UUID REFERENCES anr_rosters(id) ON DELETE SET NULL,
  stage TEXT NOT NULL DEFAULT 'none' CHECK (stage IN (
    'none',
    'light_interest',
    'serious',
    'offer_made',
    'negotiation',
    'signed',
    'lost'
  )),
  probability NUMERIC(5,4) CHECK (probability >= 0 AND probability <= 1),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  owner_user_id UUID,
  notes TEXT,
  last_update TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anr_deals_workspace ON anr_deals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_anr_deals_artist ON anr_deals(artist_slug);
CREATE INDEX IF NOT EXISTS idx_anr_deals_stage ON anr_deals(workspace_id, stage);
CREATE INDEX IF NOT EXISTS idx_anr_deals_owner ON anr_deals(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_anr_deals_probability ON anr_deals(probability DESC);
CREATE INDEX IF NOT EXISTS idx_anr_deals_last_update ON anr_deals(last_update DESC);

COMMENT ON TABLE anr_deals IS 'Deal flow tracking for A&R prospects';
COMMENT ON COLUMN anr_deals.stage IS 'Deal stage: none, light_interest, serious, offer_made, negotiation, signed, lost';
COMMENT ON COLUMN anr_deals.probability IS 'Probability of deal closing (0.0-1.0)';
COMMENT ON COLUMN anr_deals.priority IS 'Priority level: low, medium, high';

-- ========================================
-- Table 4: anr_deal_events
-- ========================================
-- Timeline of deal activities
CREATE TABLE IF NOT EXISTS anr_deal_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES anr_deals(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'note',
    'stage_change',
    'offer',
    'meeting',
    'showcase',
    'internal_discussion',
    'follow_up',
    'feedback'
  )),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anr_deal_events_deal ON anr_deal_events(deal_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_anr_deal_events_type ON anr_deal_events(event_type);
CREATE INDEX IF NOT EXISTS idx_anr_deal_events_created ON anr_deal_events(created_at DESC);

COMMENT ON TABLE anr_deal_events IS 'Timeline of deal activities and updates';
COMMENT ON COLUMN anr_deal_events.event_type IS 'Event type: note, stage_change, offer, meeting, etc.';
COMMENT ON COLUMN anr_deal_events.payload IS 'Event-specific data: notes, previous stage, meeting details, etc.';

-- ========================================
-- Table 5: anr_watchlists
-- ========================================
-- User-specific watchlists
CREATE TABLE IF NOT EXISTS anr_watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anr_watchlists_workspace ON anr_watchlists(workspace_id);
CREATE INDEX IF NOT EXISTS idx_anr_watchlists_user ON anr_watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_anr_watchlists_created ON anr_watchlists(created_at DESC);

COMMENT ON TABLE anr_watchlists IS 'User watchlists for monitoring artists of interest';

-- ========================================
-- Table 6: anr_watchlist_members
-- ========================================
-- Members of watchlists
CREATE TABLE IF NOT EXISTS anr_watchlist_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID NOT NULL REFERENCES anr_watchlists(id) ON DELETE CASCADE,
  artist_slug TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anr_watchlist_members_watchlist ON anr_watchlist_members(watchlist_id);
CREATE INDEX IF NOT EXISTS idx_anr_watchlist_members_artist ON anr_watchlist_members(artist_slug);

-- Unique constraint: artist can only be in watchlist once
CREATE UNIQUE INDEX IF NOT EXISTS idx_anr_watchlist_members_unique ON anr_watchlist_members(watchlist_id, artist_slug);

COMMENT ON TABLE anr_watchlist_members IS 'Artists on a watchlist with optional reason';

-- ========================================
-- Table 7: anr_showcases
-- ========================================
-- Showcase artifacts
CREATE TABLE IF NOT EXISTS anr_showcases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  context JSONB DEFAULT '{}'::jsonb,  -- e.g., 'festival_pitch', 'internal_meeting'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anr_showcases_workspace ON anr_showcases(workspace_id);
CREATE INDEX IF NOT EXISTS idx_anr_showcases_created ON anr_showcases(created_at DESC);

COMMENT ON TABLE anr_showcases IS 'Showcase artifacts for presenting artists';
COMMENT ON COLUMN anr_showcases.context IS 'Context metadata: purpose, audience, format preferences';

-- ========================================
-- Table 8: anr_showcase_members
-- ========================================
-- Artists included in a showcase
CREATE TABLE IF NOT EXISTS anr_showcase_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showcase_id UUID NOT NULL REFERENCES anr_showcases(id) ON DELETE CASCADE,
  artist_slug TEXT NOT NULL,
  position INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anr_showcase_members_showcase ON anr_showcase_members(showcase_id, position);
CREATE INDEX IF NOT EXISTS idx_anr_showcase_members_artist ON anr_showcase_members(artist_slug);

-- Unique constraint: artist can only be in showcase once
CREATE UNIQUE INDEX IF NOT EXISTS idx_anr_showcase_members_unique ON anr_showcase_members(showcase_id, artist_slug);

COMMENT ON TABLE anr_showcase_members IS 'Artists included in showcases with ordering and notes';

-- ========================================
-- Row Level Security (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE anr_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE anr_roster_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE anr_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE anr_deal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE anr_watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE anr_watchlist_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE anr_showcases ENABLE ROW LEVEL SECURITY;
ALTER TABLE anr_showcase_members ENABLE ROW LEVEL SECURITY;

-- anr_rosters: workspace members can view/manage
CREATE POLICY "Workspace members can view rosters" ON anr_rosters
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace admins can manage rosters" ON anr_rosters
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- anr_roster_members: same as roster
CREATE POLICY "Workspace members can view roster members" ON anr_roster_members
  FOR SELECT
  USING (
    roster_id IN (
      SELECT id FROM anr_rosters
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Workspace admins can manage roster members" ON anr_roster_members
  FOR ALL
  USING (
    roster_id IN (
      SELECT id FROM anr_rosters
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members
        WHERE user_id = auth.uid() AND role = 'admin'
      )
    )
  );

-- anr_deals: workspace members can view, owners can manage
CREATE POLICY "Workspace members can view deals" ON anr_deals
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Deal owners can update deals" ON anr_deals
  FOR UPDATE
  USING (owner_user_id = auth.uid() OR workspace_id IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Workspace members can create deals" ON anr_deals
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- anr_deal_events: readable by workspace members
CREATE POLICY "Workspace members can view deal events" ON anr_deal_events
  FOR SELECT
  USING (
    deal_id IN (
      SELECT id FROM anr_deals
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Workspace members can create deal events" ON anr_deal_events
  FOR INSERT
  WITH CHECK (
    deal_id IN (
      SELECT id FROM anr_deals
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      )
    )
  );

-- anr_watchlists: user-specific
CREATE POLICY "Users can view their watchlists" ON anr_watchlists
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their watchlists" ON anr_watchlists
  FOR ALL
  USING (user_id = auth.uid());

-- anr_watchlist_members: via watchlist access
CREATE POLICY "Users can view watchlist members" ON anr_watchlist_members
  FOR SELECT
  USING (
    watchlist_id IN (
      SELECT id FROM anr_watchlists
      WHERE user_id = auth.uid() OR workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage their watchlist members" ON anr_watchlist_members
  FOR ALL
  USING (
    watchlist_id IN (
      SELECT id FROM anr_watchlists WHERE user_id = auth.uid()
    )
  );

-- anr_showcases: workspace members can view/manage
CREATE POLICY "Workspace members can view showcases" ON anr_showcases
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can manage showcases" ON anr_showcases
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- anr_showcase_members: via showcase access
CREATE POLICY "Workspace members can view showcase members" ON anr_showcase_members
  FOR SELECT
  USING (
    showcase_id IN (
      SELECT id FROM anr_showcases
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Workspace members can manage showcase members" ON anr_showcase_members
  FOR ALL
  USING (
    showcase_id IN (
      SELECT id FROM anr_showcases
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      )
    )
  );

-- ========================================
-- Helper Functions
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_anr_phase2_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER anr_rosters_updated_at
  BEFORE UPDATE ON anr_rosters
  FOR EACH ROW
  EXECUTE FUNCTION update_anr_phase2_updated_at();

CREATE TRIGGER anr_showcases_updated_at
  BEFORE UPDATE ON anr_showcases
  FOR EACH ROW
  EXECUTE FUNCTION update_anr_phase2_updated_at();

-- ========================================
-- Example Queries (for reference)
-- ========================================

-- Get roster with members
-- SELECT r.*,
--   (SELECT json_agg(rm.*) FROM anr_roster_members rm WHERE rm.roster_id = r.id) as members
-- FROM anr_rosters r
-- WHERE r.id = 'roster-uuid';

-- Get deals in pipeline
-- SELECT d.*, c.display_name as artist_name
-- FROM anr_deals d
-- LEFT JOIN anr_candidates c ON c.artist_slug = d.artist_slug
-- WHERE d.workspace_id = 'workspace-uuid'
--   AND d.stage IN ('serious', 'offer_made', 'negotiation')
-- ORDER BY d.probability DESC, d.last_update DESC;

-- Get deal timeline
-- SELECT de.*
-- FROM anr_deal_events de
-- WHERE de.deal_id = 'deal-uuid'
-- ORDER BY de.created_at DESC;

-- ========================================
-- ROLLBACK SCRIPT (Run if migration needs to be reverted)
-- ========================================
-- DROP TRIGGER IF EXISTS anr_rosters_updated_at ON anr_rosters;
-- DROP TRIGGER IF EXISTS anr_showcases_updated_at ON anr_showcases;
-- DROP FUNCTION IF EXISTS update_anr_phase2_updated_at();
-- DROP TABLE IF EXISTS anr_showcase_members;
-- DROP TABLE IF EXISTS anr_showcases;
-- DROP TABLE IF EXISTS anr_watchlist_members;
-- DROP TABLE IF EXISTS anr_watchlists;
-- DROP TABLE IF EXISTS anr_deal_events;
-- DROP TABLE IF EXISTS anr_deals;
-- DROP TABLE IF EXISTS anr_roster_members;
-- DROP TABLE IF EXISTS anr_rosters;
-- ========================================
