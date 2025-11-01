-- ============================================================================
-- ADD NOTES COLUMN TO CAMPAIGNS TABLE
-- Allows storing campaign notes/descriptions during CSV import
-- ============================================================================

ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS notes TEXT;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
