-- Add activity_date column for campaign activities
-- This column is used by the UI for sorting and display

ALTER TABLE campaign_activities
ADD COLUMN IF NOT EXISTS activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Backfill existing records with submitted_at or created_at
UPDATE campaign_activities
SET activity_date = COALESCE(submitted_at, created_at)
WHERE activity_date IS NULL;
