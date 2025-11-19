-- Migration: Add coverage_items to campaigns table for Coveragebook export
-- Created: 2025-11-17
-- Purpose: Enable Coveragebook-compatible CSV exports for Liberty Music PR demo

-- Add coverage_items JSONB column to campaigns table
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS coverage_items JSONB DEFAULT '[]'::jsonb;

-- Add index for faster coverage_items queries
CREATE INDEX IF NOT EXISTS idx_campaigns_coverage_items
ON campaigns USING GIN (coverage_items);

-- Add comment explaining coverage_items structure
COMMENT ON COLUMN campaigns.coverage_items IS
'Array of coverage items for Coveragebook export. Structure:
[{
  "title": "BBC Radio 6 Music Playlist Add",
  "url": "https://bbc.co.uk/6music/playlist",
  "outlet": "BBC Radio 6 Music",
  "date": "2025-11-15",
  "reach": 280000,
  "impressions": 700000,
  "type": "Radio",
  "sentiment": "positive",
  "author": "Lauren Laverne",
  "category": "Music",
  "tags": "indie,playlist"
}]';

-- Example: Insert sample coverage data for demo
-- This is commented out - run manually if needed for demo
/*
UPDATE campaigns
SET coverage_items = '[
  {
    "title": "BBC Radio 6 Music Playlist Add",
    "url": "https://bbc.co.uk/6music/playlist",
    "outlet": "BBC Radio 6 Music",
    "date": "2025-11-15",
    "reach": 280000,
    "impressions": 700000,
    "type": "Radio",
    "sentiment": "positive",
    "author": "Lauren Laverne",
    "category": "Music",
    "tags": "indie,playlist"
  },
  {
    "title": "BBC Radio 1 Introducing Airplay",
    "url": "https://bbc.co.uk/radio1/introducing",
    "outlet": "BBC Radio 1",
    "date": "2025-11-16",
    "reach": 450000,
    "impressions": 1200000,
    "type": "Radio",
    "sentiment": "positive",
    "author": "Jack Saunders",
    "category": "Music",
    "tags": "new music,indie"
  }
]'::jsonb
WHERE id = 'YOUR_CAMPAIGN_ID_HERE';
*/
