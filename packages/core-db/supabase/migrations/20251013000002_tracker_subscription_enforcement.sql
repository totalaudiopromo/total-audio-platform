-- Add subscription tracking columns to user_profiles
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'agency_starter', 'agency_pro', 'agency_enterprise')),
  ADD COLUMN IF NOT EXISTS campaigns_limit INTEGER DEFAULT 3,
  ADD COLUMN IF NOT EXISTS is_beta_user BOOLEAN DEFAULT false;

-- Create index for subscription queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_status ON user_profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON user_profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_beta_user ON user_profiles(is_beta_user);

-- Function to get user's subscription details
CREATE OR REPLACE FUNCTION get_user_subscription_details(user_id_param UUID)
RETURNS TABLE (
  subscription_status TEXT,
  subscription_tier TEXT,
  campaigns_limit INTEGER,
  is_beta_user BOOLEAN,
  current_campaigns_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    up.subscription_status,
    up.subscription_tier,
    up.campaigns_limit,
    up.is_beta_user,
    COUNT(c.id) as current_campaigns_count
  FROM user_profiles up
  LEFT JOIN campaigns c ON c.user_id = up.id AND c.deleted_at IS NULL
  WHERE up.id = user_id_param
  GROUP BY up.id, up.subscription_status, up.subscription_tier, up.campaigns_limit, up.is_beta_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can create campaign
CREATE OR REPLACE FUNCTION can_create_campaign(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_details RECORD;
BEGIN
  SELECT * INTO user_details FROM get_user_subscription_details(user_id_param);

  -- Beta users have unlimited campaigns
  IF user_details.is_beta_user THEN
    RETURN TRUE;
  END IF;

  -- Active/trialing subscribers with unlimited campaigns (-1)
  IF user_details.subscription_status IN ('active', 'trialing')
     AND user_details.campaigns_limit = -1 THEN
    RETURN TRUE;
  END IF;

  -- Check if under campaign limit
  IF user_details.current_campaigns_count < user_details.campaigns_limit THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sync subscription status from subscriptions table
CREATE OR REPLACE FUNCTION sync_subscription_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user profile with subscription details
  UPDATE user_profiles
  SET
    subscription_status = NEW.status,
    subscription_tier = COALESCE(NEW.plan_type, 'free'),
    campaigns_limit = CASE
      WHEN NEW.plan_type = 'free' THEN 3
      WHEN NEW.plan_type = 'pro' THEN -1
      WHEN NEW.plan_type IN ('agency_starter', 'agency_pro', 'agency_enterprise') THEN -1
      ELSE 3
    END,
    updated_at = NOW()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync subscription changes to profile
DROP TRIGGER IF EXISTS sync_subscription_status ON subscriptions;
CREATE TRIGGER sync_subscription_status
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION sync_subscription_to_profile();

-- Function to handle subscription cancellation
CREATE OR REPLACE FUNCTION handle_subscription_cancellation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('canceled', 'unpaid') AND OLD.status NOT IN ('canceled', 'unpaid') THEN
    UPDATE user_profiles
    SET
      subscription_status = 'free',
      subscription_tier = 'free',
      campaigns_limit = 3,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to handle cancellations
DROP TRIGGER IF EXISTS handle_subscription_cancel ON subscriptions;
CREATE TRIGGER handle_subscription_cancel
  AFTER UPDATE ON subscriptions
  FOR EACH ROW
  WHEN (NEW.status IN ('canceled', 'unpaid') AND OLD.status NOT IN ('canceled', 'unpaid'))
  EXECUTE FUNCTION handle_subscription_cancellation();

-- Set default beta users (you can update this list)
-- Example: UPDATE user_profiles SET is_beta_user = true WHERE id = 'user-uuid-here';

-- Comments for documentation
COMMENT ON COLUMN user_profiles.subscription_status IS 'Current subscription status from Stripe';
COMMENT ON COLUMN user_profiles.subscription_tier IS 'Current pricing tier';
COMMENT ON COLUMN user_profiles.campaigns_limit IS 'Maximum campaigns allowed (-1 for unlimited)';
COMMENT ON COLUMN user_profiles.is_beta_user IS 'Beta users bypass all subscription checks';
COMMENT ON FUNCTION get_user_subscription_details IS 'Returns subscription details and current campaign count';
COMMENT ON FUNCTION can_create_campaign IS 'Checks if user can create a new campaign based on subscription';
COMMENT ON FUNCTION sync_subscription_to_profile IS 'Syncs subscription table changes to user profile';
