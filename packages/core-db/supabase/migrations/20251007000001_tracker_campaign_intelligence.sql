-- ============================================================================
-- CAMPAIGN INTELLIGENCE TABLE - AI-Generated Autopsy Storage
-- Stores Claude-generated campaign analysis and recommendations
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- AI-generated content sections
  autopsy_text TEXT,
  next_move TEXT,
  brutal_honesty TEXT,
  quick_wins TEXT,
  full_response TEXT,

  -- Metadata
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  model_used VARCHAR(100) DEFAULT 'claude-sonnet-4-20250514',

  -- Ensure one autopsy per campaign
  UNIQUE(campaign_id)
);

-- Enable RLS
ALTER TABLE campaign_intelligence ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own campaign intelligence"
  ON campaign_intelligence
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own campaign intelligence"
  ON campaign_intelligence
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own campaign intelligence"
  ON campaign_intelligence
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own campaign intelligence"
  ON campaign_intelligence
  FOR DELETE
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_campaign_intelligence_campaign
  ON campaign_intelligence(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_intelligence_user
  ON campaign_intelligence(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_intelligence_generated
  ON campaign_intelligence(generated_at DESC);

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
