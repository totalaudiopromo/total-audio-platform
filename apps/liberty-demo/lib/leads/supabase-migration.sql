-- ============================================================================
-- Lead Generation System - Supabase Migration
-- Run this in Supabase SQL Editor to create the lead tables
-- ============================================================================

-- Lead sources we crawl
CREATE TABLE IF NOT EXISTS lead_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'hype_machine', 'bandcamp', 'submithub', 'spotify_playlist', etc.
  crawl_frequency TEXT DEFAULT 'daily', -- 'hourly', 'daily', 'weekly'
  last_crawled_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discovered artists (raw from crawl)
CREATE TABLE IF NOT EXISTS discovered_artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  source_id UUID REFERENCES lead_sources(id) ON DELETE CASCADE,
  source_url TEXT,
  source_rank INTEGER,
  raw_data JSONB DEFAULT '{}',
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  processed BOOLEAN DEFAULT false,
  UNIQUE(name, source_id)
);

-- Enriched leads (after AI processing)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES discovered_artists(id) ON DELETE SET NULL,

  -- Basic info
  artist_name TEXT NOT NULL,
  genre TEXT,
  location TEXT,
  bio TEXT,
  image_url TEXT,

  -- Links
  spotify_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  bandcamp_url TEXT,
  youtube_url TEXT,

  -- Stats (nullable - not all artists have all platforms)
  spotify_monthly_listeners INTEGER,
  spotify_followers INTEGER,
  instagram_followers INTEGER,
  twitter_followers INTEGER,

  -- Release info
  upcoming_release_date DATE,
  upcoming_release_title TEXT,
  latest_release_date DATE,
  latest_release_title TEXT,

  -- PR Intelligence
  has_pr_agency BOOLEAN DEFAULT false,
  pr_agency_name TEXT,
  pr_confidence TEXT DEFAULT 'unknown', -- 'confirmed', 'likely', 'unlikely', 'unknown'

  -- Signals (array of qualifying factors)
  signals JSONB DEFAULT '[]',

  -- AI Analysis
  ai_insight TEXT,
  ai_generated_at TIMESTAMPTZ,

  -- Scoring
  score INTEGER DEFAULT 0, -- 0-100
  score_breakdown JSONB DEFAULT '{"timing": 0, "momentum": 0, "fit": 0, "availability": 0}',

  -- Source tracking
  source_name TEXT,
  source_type TEXT,
  source_rank INTEGER,

  -- Status
  status TEXT DEFAULT 'new', -- 'new', 'pipeline', 'dismissed', 'contacted'
  status_updated_at TIMESTAMPTZ,
  status_updated_by TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log for leads
CREATE TABLE IF NOT EXISTS lead_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'discovered', 'enriched', 'scored', 'added_to_pipeline', 'dismissed', 'contacted'
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source_type ON leads(source_type);
CREATE INDEX IF NOT EXISTS idx_leads_pr_confidence ON leads(pr_confidence);
CREATE INDEX IF NOT EXISTS idx_discovered_artists_processed ON discovered_artists(processed);
CREATE INDEX IF NOT EXISTS idx_lead_activity_lead_id ON lead_activity(lead_id);

-- RLS Policies (service role access for API routes)
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovered_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activity ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access on lead_sources" ON lead_sources FOR ALL USING (true);
CREATE POLICY "Service role full access on discovered_artists" ON discovered_artists FOR ALL USING (true);
CREATE POLICY "Service role full access on leads" ON leads FOR ALL USING (true);
CREATE POLICY "Service role full access on lead_activity" ON lead_activity FOR ALL USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lead_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_updated_at();

-- Insert default lead sources
INSERT INTO lead_sources (name, url, source_type, crawl_frequency, is_active) VALUES
  ('Hype Machine - Popular', 'https://hypem.com/popular', 'hype_machine', 'daily', true),
  ('Hype Machine - Latest', 'https://hypem.com/latest', 'hype_machine', 'daily', true),
  ('Bandcamp - New & Notable', 'https://bandcamp.com/tag/new', 'bandcamp', 'daily', true),
  ('SubmitHub - Hot or Not', 'https://www.submithub.com/hot-or-not', 'submithub', 'daily', true),
  ('Spotify - New Music Friday', 'spotify:playlist:37i9dQZF1DX4JAvHpjipBk', 'spotify_playlist', 'weekly', true),
  ('Spotify - Fresh Finds', 'spotify:playlist:37i9dQZF1DWWjGdmeTyeJ6', 'spotify_playlist', 'weekly', true),
  ('Spotify - Indie Pop', 'spotify:playlist:37i9dQZF1DWWEcRhUVtL8n', 'spotify_playlist', 'weekly', true)
ON CONFLICT DO NOTHING;
