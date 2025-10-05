-- MVP: Campaigns table with genre for intelligence
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('BBC Radio', 'Commercial Radio', 'Playlists', 'Blog', 'PR')),
  genre VARCHAR(50) NOT NULL CHECK (genre IN ('Electronic', 'Indie', 'Jazz', 'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Other')),
  start_date DATE NOT NULL,
  end_date DATE,
  budget DECIMAL(10,2) DEFAULT 0,
  target_reach INTEGER DEFAULT 0,
  actual_reach INTEGER DEFAULT 0,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete own campaigns" ON campaigns;

-- Users can only see their own campaigns
CREATE POLICY "Users can view own campaigns" ON campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns" ON campaigns
  FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Benchmarks table with industry intelligence
CREATE TABLE IF NOT EXISTS benchmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  avg_success_rate DECIMAL(5,2) NOT NULL,
  avg_cost_per_result DECIMAL(10,2) NOT NULL,
  best_day VARCHAR(20),
  best_month VARCHAR(20),
  optimal_budget_min DECIMAL(10,2),
  optimal_budget_max DECIMAL(10,2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(platform, genre)
);

-- Pre-populate with industry benchmark data
INSERT INTO benchmarks (platform, genre, avg_success_rate, avg_cost_per_result, best_day, best_month, optimal_budget_min, optimal_budget_max) VALUES
-- BBC Radio benchmarks
('BBC Radio', 'Electronic', 26.0, 80.0, 'Tuesday', 'January', 300, 500),
('BBC Radio', 'Indie', 20.0, 104.0, 'Tuesday', 'January', 300, 500),
('BBC Radio', 'Jazz', 16.0, 130.0, 'Tuesday', 'January', 300, 500),
('BBC Radio', 'Pop', 22.0, 95.0, 'Tuesday', 'January', 300, 500),
('BBC Radio', 'Rock', 18.0, 115.0, 'Tuesday', 'January', 300, 500),

-- Commercial Radio benchmarks
('Commercial Radio', 'Electronic', 19.5, 115.0, 'Wednesday', 'September', 500, 1000),
('Commercial Radio', 'Indie', 15.0, 150.0, 'Wednesday', 'September', 500, 1000),
('Commercial Radio', 'Jazz', 12.0, 190.0, 'Wednesday', 'September', 500, 1000),
('Commercial Radio', 'Pop', 16.5, 135.0, 'Wednesday', 'September', 500, 1000),
('Commercial Radio', 'Rock', 13.5, 165.0, 'Wednesday', 'September', 500, 1000),

-- Playlists benchmarks
('Playlists', 'Electronic', 45.5, 38.0, 'Friday', 'March', 100, 300),
('Playlists', 'Indie', 35.0, 50.0, 'Friday', 'March', 100, 300),
('Playlists', 'Jazz', 28.0, 63.0, 'Friday', 'March', 100, 300),
('Playlists', 'Pop', 38.5, 45.0, 'Friday', 'March', 100, 300),
('Playlists', 'Rock', 31.5, 55.0, 'Friday', 'March', 100, 300);
