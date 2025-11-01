-- ============================================================================
-- MULTI-CLIENT SUPPORT - Agency Features (TIER 1)
-- Enables PR agencies to manage multiple client campaigns
-- ============================================================================

-- Add client fields to campaigns table
DO $$
BEGIN
  -- Add client_name field
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='campaigns' AND column_name='client_name') THEN
    ALTER TABLE campaigns ADD COLUMN client_name VARCHAR(255);
  END IF;

  -- Add client_company field (for formal company name if different from client_name)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='campaigns' AND column_name='client_company') THEN
    ALTER TABLE campaigns ADD COLUMN client_company VARCHAR(255);
  END IF;

  -- Add client_billing_code field (for invoice tracking)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='campaigns' AND column_name='client_billing_code') THEN
    ALTER TABLE campaigns ADD COLUMN client_billing_code VARCHAR(100);
  END IF;

  -- Add client_email field (for client reporting)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='campaigns' AND column_name='client_email') THEN
    ALTER TABLE campaigns ADD COLUMN client_email VARCHAR(255);
  END IF;
END $$;

-- Create indexes for client filtering performance
CREATE INDEX IF NOT EXISTS idx_campaigns_client_name ON campaigns(client_name);
CREATE INDEX IF NOT EXISTS idx_campaigns_client_company ON campaigns(client_company);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_client ON campaigns(user_id, client_name);

-- Create a view for client stats (agency dashboard)
CREATE OR REPLACE VIEW client_campaign_stats AS
SELECT
  user_id,
  client_name,
  client_company,
  COUNT(*) as total_campaigns,
  COUNT(*) FILTER (WHERE status = 'active') as active_campaigns,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_campaigns,
  SUM(budget) as total_budget,
  SUM(CASE WHEN actual_reach > 0 THEN budget ELSE 0 END) as spent_budget,
  AVG(CASE WHEN actual_reach > 0 THEN success_rate ELSE NULL END) as avg_success_rate,
  AVG(CASE WHEN actual_reach > 0 THEN performance_score ELSE NULL END) as avg_performance_score,
  MIN(start_date) as first_campaign_date,
  MAX(updated_at) as last_activity_date
FROM campaigns
WHERE client_name IS NOT NULL
GROUP BY user_id, client_name, client_company;

-- Grant access to authenticated users
GRANT SELECT ON client_campaign_stats TO authenticated;

-- Create RLS policy for the view
ALTER VIEW client_campaign_stats SET (security_invoker = on);

-- ============================================================================
-- NOTIFY PostgREST to reload schema cache
-- ============================================================================
NOTIFY pgrst, 'reload schema';
