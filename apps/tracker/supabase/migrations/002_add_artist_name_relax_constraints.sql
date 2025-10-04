-- Add artist_name column and relax constraints for MVP flexibility
ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS artist_name VARCHAR(255);

-- Make platform, genre, start_date nullable for flexible campaign creation
ALTER TABLE campaigns
  ALTER COLUMN platform DROP NOT NULL,
  ALTER COLUMN genre DROP NOT NULL,
  ALTER COLUMN start_date DROP NOT NULL;

-- Update existing campaigns to have artist_name if missing
UPDATE campaigns
SET artist_name = name
WHERE artist_name IS NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_campaigns_artist_name ON campaigns(artist_name);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
