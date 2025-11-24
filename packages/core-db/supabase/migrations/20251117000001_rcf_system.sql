-- Real-Time Coverage Feed (RCF) System
-- Migration created: 2025-11-17

-- ============================================================================
-- 1. rcf_events - Raw ingested + generated events
-- ============================================================================

CREATE TABLE IF NOT EXISTS rcf_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  artist_slug text NULL,
  entity_slug text NULL,        -- playlist, blog, radio show, journalist, MIG node, scene slug, etc.
  scene_slug text NULL,
  metadata jsonb NOT NULL,      -- detailed info (playlist name, spin count, article title etc.)
  weight numeric DEFAULT 1.0,   -- importance score
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_rcf_events_created_at ON rcf_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rcf_events_event_type ON rcf_events(event_type);
CREATE INDEX IF NOT EXISTS idx_rcf_events_artist_slug ON rcf_events(artist_slug) WHERE artist_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rcf_events_scene_slug ON rcf_events(scene_slug) WHERE scene_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rcf_events_entity_slug ON rcf_events(entity_slug) WHERE entity_slug IS NOT NULL;

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_rcf_events_type_created ON rcf_events(event_type, created_at DESC);

-- Add comment
COMMENT ON TABLE rcf_events IS 'Real-time coverage feed events - aggregates music industry signals';
COMMENT ON COLUMN rcf_events.event_type IS 'Event type: playlist_add, press_feature, radio_spin, blog_post, tweet, journalist_activity, scene_pulse_change, scene_trend_spike, mig_connection, campaign_event, autopilot_event, tracker_event, coverage_spike, creative_breakthrough, community_activity';
COMMENT ON COLUMN rcf_events.weight IS 'Importance score (0.0-1.0+) - higher means more significant';

-- ============================================================================
-- 2. rcf_subscriptions - User subscription preferences
-- ============================================================================

CREATE TABLE IF NOT EXISTS rcf_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  workspace_id uuid NULL,
  subscribed_types text[] NOT NULL DEFAULT '{}',
  subscribed_artists text[] NULL DEFAULT '{}',
  subscribed_scenes text[] NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Foreign key to users (assuming users table exists)
-- ALTER TABLE rcf_subscriptions ADD CONSTRAINT fk_rcf_subscriptions_user
--   FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rcf_subscriptions_user_id ON rcf_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_rcf_subscriptions_workspace_id ON rcf_subscriptions(workspace_id) WHERE workspace_id IS NOT NULL;

-- Ensure one subscription per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_rcf_subscriptions_user_unique ON rcf_subscriptions(user_id);

COMMENT ON TABLE rcf_subscriptions IS 'User subscription preferences for RCF events';
COMMENT ON COLUMN rcf_subscriptions.subscribed_types IS 'Array of event types user wants to see';
COMMENT ON COLUMN rcf_subscriptions.subscribed_artists IS 'Array of artist slugs to filter by';
COMMENT ON COLUMN rcf_subscriptions.subscribed_scenes IS 'Array of scene slugs to filter by';

-- ============================================================================
-- 3. rcf_markers - User read position markers
-- ============================================================================

CREATE TABLE IF NOT EXISTS rcf_markers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  last_seen_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rcf_markers_user_id ON rcf_markers(user_id);

-- Ensure one marker per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_rcf_markers_user_unique ON rcf_markers(user_id);

COMMENT ON TABLE rcf_markers IS 'User read position markers for RCF feed';
COMMENT ON COLUMN rcf_markers.last_seen_at IS 'Timestamp of last event user has seen';

-- ============================================================================
-- 4. Row Level Security (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE rcf_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rcf_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rcf_markers ENABLE ROW LEVEL SECURITY;

-- rcf_events: readable by all authenticated users (nothing private)
DROP POLICY IF EXISTS "rcf_events_select_all" ON rcf_events;
CREATE POLICY "rcf_events_select_all" ON rcf_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow insert for authenticated users (for system/admin operations)
DROP POLICY IF EXISTS "rcf_events_insert_authenticated" ON rcf_events;
CREATE POLICY "rcf_events_insert_authenticated" ON rcf_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- rcf_subscriptions: user can only see/modify their own
DROP POLICY IF EXISTS "rcf_subscriptions_select_own" ON rcf_subscriptions;
CREATE POLICY "rcf_subscriptions_select_own" ON rcf_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "rcf_subscriptions_insert_own" ON rcf_subscriptions;
CREATE POLICY "rcf_subscriptions_insert_own" ON rcf_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "rcf_subscriptions_update_own" ON rcf_subscriptions;
CREATE POLICY "rcf_subscriptions_update_own" ON rcf_subscriptions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "rcf_subscriptions_delete_own" ON rcf_subscriptions;
CREATE POLICY "rcf_subscriptions_delete_own" ON rcf_subscriptions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- rcf_markers: user can only see/modify their own
DROP POLICY IF EXISTS "rcf_markers_select_own" ON rcf_markers;
CREATE POLICY "rcf_markers_select_own" ON rcf_markers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "rcf_markers_insert_own" ON rcf_markers;
CREATE POLICY "rcf_markers_insert_own" ON rcf_markers
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "rcf_markers_update_own" ON rcf_markers;
CREATE POLICY "rcf_markers_update_own" ON rcf_markers
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "rcf_markers_delete_own" ON rcf_markers;
CREATE POLICY "rcf_markers_delete_own" ON rcf_markers
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 5. Helper Functions
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for rcf_subscriptions
DROP TRIGGER IF EXISTS update_rcf_subscriptions_updated_at ON rcf_subscriptions;
CREATE TRIGGER update_rcf_subscriptions_updated_at
  BEFORE UPDATE ON rcf_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for rcf_markers
DROP TRIGGER IF EXISTS update_rcf_markers_updated_at ON rcf_markers;
CREATE TRIGGER update_rcf_markers_updated_at
  BEFORE UPDATE ON rcf_markers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. Default Subscriptions Helper
-- ============================================================================

-- Function to create default subscription for new users
CREATE OR REPLACE FUNCTION create_default_rcf_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO rcf_subscriptions (user_id, subscribed_types)
  VALUES (
    NEW.id,
    ARRAY[
      'playlist_add',
      'press_feature',
      'radio_spin',
      'campaign_event',
      'scene_pulse_change',
      'creative_breakthrough'
    ]
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Note: Uncomment if you want automatic subscription creation on user signup
-- DROP TRIGGER IF EXISTS create_rcf_subscription_on_signup ON auth.users;
-- CREATE TRIGGER create_rcf_subscription_on_signup
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION create_default_rcf_subscription();
