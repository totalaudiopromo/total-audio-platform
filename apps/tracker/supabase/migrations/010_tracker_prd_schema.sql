-- ============================================================================
-- TOTAL AUDIO TRACKER - PRD Schema Migration
-- Transforms basic tracker into intelligent campaign management system
-- ============================================================================

-- Drop old schema if exists (clean slate for PRD implementation)
DROP TABLE IF EXISTS campaign_insights CASCADE;
DROP TABLE IF EXISTS campaign_activities CASCADE;
DROP TABLE IF EXISTS benchmarks CASCADE;

-- ============================================================================
-- CAMPAIGNS TABLE - Core tracking with intelligence fields
-- ============================================================================
-- Add new intelligence fields to campaigns table
DO $$
BEGIN
  -- Add new columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='artist_name') THEN
    ALTER TABLE campaigns ADD COLUMN artist_name VARCHAR(255);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='genre') THEN
    ALTER TABLE campaigns ADD COLUMN genre VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='platform') THEN
    ALTER TABLE campaigns ADD COLUMN platform VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='target_type') THEN
    ALTER TABLE campaigns ADD COLUMN target_type VARCHAR(100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='target_reach') THEN
    ALTER TABLE campaigns ADD COLUMN target_reach INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='actual_reach') THEN
    ALTER TABLE campaigns ADD COLUMN actual_reach INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='streams') THEN
    ALTER TABLE campaigns ADD COLUMN streams INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='saves') THEN
    ALTER TABLE campaigns ADD COLUMN saves INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='social_engagement') THEN
    ALTER TABLE campaigns ADD COLUMN social_engagement INTEGER;
  END IF;

  -- Intelligence fields (auto-calculated)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='success_rate') THEN
    ALTER TABLE campaigns ADD COLUMN success_rate DECIMAL(5,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='cost_per_result') THEN
    ALTER TABLE campaigns ADD COLUMN cost_per_result DECIMAL(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='performance_score') THEN
    ALTER TABLE campaigns ADD COLUMN performance_score INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='percentile_rank') THEN
    ALTER TABLE campaigns ADD COLUMN percentile_rank INTEGER DEFAULT 0;
  END IF;
END $$;

-- Update constraints to be more flexible for MVP
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_platform_check;
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_genre_check;
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_status_check;

-- Add new flexible constraints
ALTER TABLE campaigns ADD CONSTRAINT campaigns_platform_check
  CHECK (platform IN ('BBC Radio', 'Commercial Radio', 'Playlists', 'Blogs', 'Social', 'PR'));

ALTER TABLE campaigns ADD CONSTRAINT campaigns_genre_check
  CHECK (genre IN ('Electronic', 'Indie', 'Jazz', 'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Folk', 'Classical', 'Other'));

ALTER TABLE campaigns ADD CONSTRAINT campaigns_status_check
  CHECK (status IN ('planning', 'active', 'completed', 'archived'));

-- Make fields nullable for flexible campaign creation
ALTER TABLE campaigns ALTER COLUMN platform DROP NOT NULL;
ALTER TABLE campaigns ALTER COLUMN genre DROP NOT NULL;
ALTER TABLE campaigns ALTER COLUMN start_date DROP NOT NULL;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_genre ON campaigns(genre);
CREATE INDEX IF NOT EXISTS idx_campaigns_performance ON campaigns(performance_score DESC);

-- ============================================================================
-- BENCHMARKS TABLE - Industry intelligence data
-- ============================================================================
CREATE TABLE IF NOT EXISTS benchmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  avg_success_rate DECIMAL(5,2) NOT NULL,
  avg_cost_per_result DECIMAL(10,2) NOT NULL,
  avg_response_time INTEGER, -- in days
  best_day VARCHAR(20),
  best_month VARCHAR(20),
  optimal_budget_min DECIMAL(10,2),
  optimal_budget_max DECIMAL(10,2),
  sample_size INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(platform, genre)
);

-- Pre-populate with comprehensive industry benchmark data
INSERT INTO benchmarks (platform, genre, avg_success_rate, avg_cost_per_result, avg_response_time, best_day, best_month, optimal_budget_min, optimal_budget_max, sample_size) VALUES
-- BBC Radio benchmarks
('BBC Radio', 'Electronic', 26.0, 80.0, 7, 'Tuesday', 'January', 300, 500, 150),
('BBC Radio', 'Indie', 20.0, 104.0, 7, 'Tuesday', 'January', 300, 500, 200),
('BBC Radio', 'Jazz', 16.0, 130.0, 7, 'Tuesday', 'January', 300, 500, 100),
('BBC Radio', 'Pop', 22.0, 95.0, 7, 'Tuesday', 'January', 300, 500, 180),
('BBC Radio', 'Rock', 18.0, 115.0, 7, 'Tuesday', 'January', 300, 500, 160),
('BBC Radio', 'Hip-Hop', 19.0, 110.0, 7, 'Tuesday', 'January', 300, 500, 120),
('BBC Radio', 'R&B', 17.0, 120.0, 7, 'Tuesday', 'January', 300, 500, 90),
('BBC Radio', 'Folk', 15.0, 140.0, 7, 'Tuesday', 'January', 300, 500, 70),

-- Commercial Radio benchmarks
('Commercial Radio', 'Electronic', 19.5, 115.0, 9, 'Wednesday', 'September', 500, 1000, 120),
('Commercial Radio', 'Indie', 15.0, 150.0, 9, 'Wednesday', 'September', 500, 1000, 140),
('Commercial Radio', 'Pop', 25.0, 90.0, 9, 'Wednesday', 'September', 500, 1000, 250),
('Commercial Radio', 'Rock', 13.5, 165.0, 9, 'Wednesday', 'September', 500, 1000, 110),
('Commercial Radio', 'Hip-Hop', 20.0, 112.0, 9, 'Wednesday', 'September', 500, 1000, 130),
('Commercial Radio', 'R&B', 18.0, 125.0, 9, 'Wednesday', 'September', 500, 1000, 95),

-- Playlists benchmarks (higher success rates, lower cost)
('Playlists', 'Electronic', 45.5, 38.0, 4, 'Friday', 'March', 100, 300, 300),
('Playlists', 'Indie', 35.0, 50.0, 4, 'Friday', 'March', 100, 300, 280),
('Playlists', 'Pop', 42.0, 42.0, 4, 'Friday', 'March', 100, 300, 350),
('Playlists', 'Rock', 31.5, 55.0, 4, 'Friday', 'March', 100, 300, 220),
('Playlists', 'Hip-Hop', 48.0, 36.0, 4, 'Friday', 'March', 100, 300, 320),
('Playlists', 'R&B', 40.0, 44.0, 4, 'Friday', 'March', 100, 300, 240),
('Playlists', 'Jazz', 28.0, 63.0, 4, 'Friday', 'March', 100, 300, 150),

-- Blogs benchmarks
('Blogs', 'Electronic', 32.0, 65.0, 5, 'Monday', 'April', 200, 400, 180),
('Blogs', 'Indie', 38.0, 55.0, 5, 'Monday', 'April', 200, 400, 240),
('Blogs', 'Rock', 28.0, 75.0, 5, 'Monday', 'April', 200, 400, 160),
('Blogs', 'Hip-Hop', 30.0, 70.0, 5, 'Monday', 'April', 200, 400, 140),
('Blogs', 'Jazz', 25.0, 85.0, 5, 'Monday', 'April', 200, 400, 100),

-- Social Media benchmarks (influencer campaigns)
('Social', 'Electronic', 40.0, 50.0, 3, 'Thursday', 'May', 200, 600, 200),
('Social', 'Indie', 35.0, 60.0, 3, 'Thursday', 'May', 200, 600, 180),
('Social', 'Pop', 45.0, 48.0, 3, 'Thursday', 'May', 200, 600, 250),
('Social', 'Hip-Hop', 50.0, 42.0, 3, 'Thursday', 'May', 200, 600, 280),
('Social', 'R&B', 42.0, 52.0, 3, 'Thursday', 'May', 200, 600, 160)
ON CONFLICT (platform, genre) DO UPDATE SET
  avg_success_rate = EXCLUDED.avg_success_rate,
  avg_cost_per_result = EXCLUDED.avg_cost_per_result,
  avg_response_time = EXCLUDED.avg_response_time,
  best_day = EXCLUDED.best_day,
  best_month = EXCLUDED.best_month,
  optimal_budget_min = EXCLUDED.optimal_budget_min,
  optimal_budget_max = EXCLUDED.optimal_budget_max,
  sample_size = EXCLUDED.sample_size,
  last_updated = NOW();

-- ============================================================================
-- CAMPAIGN ACTIVITIES TABLE - Real-time activity tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaign_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activity_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  contact_name VARCHAR(255),
  contact_org VARCHAR(255),
  platform VARCHAR(50),
  metric VARCHAR(50),
  value INTEGER,
  importance VARCHAR(20) DEFAULT 'medium' CHECK (importance IN ('low', 'medium', 'high')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity type constraint
ALTER TABLE campaign_activities ADD CONSTRAINT campaign_activities_type_check
  CHECK (activity_type IN (
    'email_open', 'email_reply', 'track_download', 'playlist_add',
    'radio_play', 'social_share', 'stream_milestone', 'contact_engaged',
    'pitch_sent', 'response_received', 'campaign_started', 'campaign_completed'
  ));

-- Enable RLS
ALTER TABLE campaign_activities ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view campaign activities" ON campaign_activities
  FOR SELECT USING (
    campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create campaign activities" ON campaign_activities
  FOR INSERT WITH CHECK (
    campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_activities_campaign ON campaign_activities(campaign_id);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON campaign_activities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activities_importance ON campaign_activities(importance);

-- ============================================================================
-- CAMPAIGN INSIGHTS TABLE - AI-generated insights and patterns
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaign_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  insight_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  confidence INTEGER DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 100),
  metadata JSONB,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Insight type constraint
ALTER TABLE campaign_insights ADD CONSTRAINT insights_type_check
  CHECK (insight_type IN (
    'pattern', 'recommendation', 'warning', 'success',
    'genre_performance', 'platform_effectiveness', 'budget_optimization', 'timing_pattern'
  ));

-- Enable RLS
ALTER TABLE campaign_insights ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own insights" ON campaign_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create insights" ON campaign_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own insights" ON campaign_insights
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_insights_user ON campaign_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_insights_type ON campaign_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_insights_confidence ON campaign_insights(confidence DESC);

-- ============================================================================
-- FUNCTIONS - Auto-calculate intelligence metrics
-- ============================================================================

-- Function to calculate campaign intelligence metrics
CREATE OR REPLACE FUNCTION calculate_campaign_intelligence()
RETURNS TRIGGER AS $$
DECLARE
  benchmark RECORD;
  success_diff DECIMAL;
  cost_efficiency DECIMAL;
BEGIN
  -- Calculate success rate
  IF NEW.target_reach > 0 THEN
    NEW.success_rate := (NEW.actual_reach::DECIMAL / NEW.target_reach::DECIMAL) * 100;
  ELSE
    NEW.success_rate := 0;
  END IF;

  -- Calculate cost per result
  IF NEW.actual_reach > 0 THEN
    NEW.cost_per_result := NEW.budget / NEW.actual_reach;
  ELSE
    NEW.cost_per_result := 0;
  END IF;

  -- Get benchmark for performance comparison
  IF NEW.platform IS NOT NULL AND NEW.genre IS NOT NULL THEN
    SELECT * INTO benchmark
    FROM benchmarks
    WHERE platform = NEW.platform AND genre = NEW.genre
    LIMIT 1;

    IF FOUND THEN
      -- Calculate performance score (0-100)
      success_diff := (NEW.success_rate - benchmark.avg_success_rate) / benchmark.avg_success_rate;

      IF NEW.cost_per_result > 0 THEN
        cost_efficiency := (benchmark.avg_cost_per_result - NEW.cost_per_result) / benchmark.avg_cost_per_result;
      ELSE
        cost_efficiency := 0;
      END IF;

      NEW.performance_score := GREATEST(0, LEAST(100,
        50 + (success_diff * 25) + (cost_efficiency * 25)
      ))::INTEGER;

      -- Calculate percentile rank (simplified)
      IF NEW.performance_score >= 80 THEN
        NEW.percentile_rank := 90;
      ELSIF NEW.performance_score >= 60 THEN
        NEW.percentile_rank := 70;
      ELSIF NEW.performance_score >= 40 THEN
        NEW.percentile_rank := 50;
      ELSE
        NEW.percentile_rank := 30;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate intelligence on campaign update
DROP TRIGGER IF EXISTS trigger_calculate_intelligence ON campaigns;
CREATE TRIGGER trigger_calculate_intelligence
  BEFORE INSERT OR UPDATE OF target_reach, actual_reach, budget, platform, genre
  ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION calculate_campaign_intelligence();

-- ============================================================================
-- NOTIFY PostgREST to reload schema cache
-- ============================================================================
NOTIFY pgrst, 'reload schema';
