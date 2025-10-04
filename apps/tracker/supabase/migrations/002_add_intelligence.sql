-- Add intelligence fields to existing campaigns table
ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS genre VARCHAR(50) CHECK (genre IN ('Electronic', 'Indie', 'Jazz', 'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Other')),
  ADD COLUMN IF NOT EXISTS target_reach INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS actual_reach INTEGER DEFAULT 0;

-- Update platform constraint to match new values
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_platform_check;
ALTER TABLE campaigns ADD CONSTRAINT campaigns_platform_check
  CHECK (platform IN ('BBC Radio', 'Commercial Radio', 'Playlists', 'Blog', 'PR'));

-- Create benchmarks table
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

-- Pre-populate with industry benchmark data (with conflict handling)
INSERT INTO benchmarks (platform, genre, avg_success_rate, avg_cost_per_result, best_day, best_month, optimal_budget_min, optimal_budget_max) VALUES
('BBC Radio', 'Electronic', 26.0, 80.0, 'Tuesday', 'January', 300, 500),
('BBC Radio', 'Indie', 20.0, 104.0, 'Tuesday', 'January', 300, 500),
('BBC Radio', 'Jazz', 16.0, 130.0, 'Tuesday', 'January', 300, 500),
('BBC Radio', 'Pop', 22.0, 95.0, 'Tuesday', 'January', 300, 500),
('BBC Radio', 'Rock', 18.0, 115.0, 'Tuesday', 'January', 300, 500),
('Commercial Radio', 'Electronic', 19.5, 115.0, 'Wednesday', 'September', 500, 1000),
('Commercial Radio', 'Indie', 15.0, 150.0, 'Wednesday', 'September', 500, 1000),
('Commercial Radio', 'Jazz', 12.0, 190.0, 'Wednesday', 'September', 500, 1000),
('Commercial Radio', 'Pop', 16.5, 135.0, 'Wednesday', 'September', 500, 1000),
('Commercial Radio', 'Rock', 13.5, 165.0, 'Wednesday', 'September', 500, 1000),
('Playlists', 'Electronic', 45.5, 38.0, 'Friday', 'March', 100, 300),
('Playlists', 'Indie', 35.0, 50.0, 'Friday', 'March', 100, 300),
('Playlists', 'Jazz', 28.0, 63.0, 'Friday', 'March', 100, 300),
('Playlists', 'Pop', 38.5, 45.0, 'Friday', 'March', 100, 300),
('Playlists', 'Rock', 31.5, 55.0, 'Friday', 'March', 100, 300)
ON CONFLICT (platform, genre) DO NOTHING;
