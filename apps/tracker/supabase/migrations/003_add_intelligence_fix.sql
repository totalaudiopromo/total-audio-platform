-- Check current structure and add intelligence fields
-- This migration works with the existing campaigns table structure

-- Add new columns if they don't exist
ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS genre VARCHAR(50) DEFAULT 'Other',
  ADD COLUMN IF NOT EXISTS target_reach INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS actual_reach INTEGER DEFAULT 0;

-- Add constraint for genre if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'campaigns_genre_check'
  ) THEN
    ALTER TABLE campaigns ADD CONSTRAINT campaigns_genre_check
      CHECK (genre IN ('Electronic', 'Indie', 'Jazz', 'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Other'));
  END IF;
END $$;

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

-- Pre-populate with industry benchmark data
INSERT INTO benchmarks (platform, genre, avg_success_rate, avg_cost_per_result, best_day, best_month, optimal_budget_min, optimal_budget_max) VALUES
('radio', 'Electronic', 26.0, 80.0, 'Tuesday', 'January', 300, 500),
('radio', 'Indie', 20.0, 104.0, 'Tuesday', 'January', 300, 500),
('radio', 'Jazz', 16.0, 130.0, 'Tuesday', 'January', 300, 500),
('radio', 'Pop', 22.0, 95.0, 'Tuesday', 'January', 300, 500),
('radio', 'Rock', 18.0, 115.0, 'Tuesday', 'January', 300, 500),
('playlist', 'Electronic', 45.5, 38.0, 'Friday', 'March', 100, 300),
('playlist', 'Indie', 35.0, 50.0, 'Friday', 'March', 100, 300),
('playlist', 'Jazz', 28.0, 63.0, 'Friday', 'March', 100, 300),
('playlist', 'Pop', 38.5, 45.0, 'Friday', 'March', 100, 300),
('playlist', 'Rock', 31.5, 55.0, 'Friday', 'March', 100, 300),
('blog', 'Electronic', 30.0, 60.0, 'Monday', 'February', 200, 400),
('blog', 'Indie', 25.0, 75.0, 'Monday', 'February', 200, 400),
('blog', 'Jazz', 20.0, 90.0, 'Monday', 'February', 200, 400),
('blog', 'Pop', 28.0, 65.0, 'Monday', 'February', 200, 400),
('blog', 'Rock', 23.0, 80.0, 'Monday', 'February', 200, 400),
('pr', 'Electronic', 35.0, 100.0, 'Thursday', 'March', 500, 1500),
('pr', 'Indie', 30.0, 120.0, 'Thursday', 'March', 500, 1500),
('pr', 'Jazz', 25.0, 140.0, 'Thursday', 'March', 500, 1500),
('pr', 'Pop', 33.0, 110.0, 'Thursday', 'March', 500, 1500),
('pr', 'Rock', 28.0, 130.0, 'Thursday', 'March', 500, 1500)
ON CONFLICT (platform, genre) DO NOTHING;
