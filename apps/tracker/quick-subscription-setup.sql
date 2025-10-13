-- =============================================================================
-- QUICK SUBSCRIPTION SETUP
-- Copy and paste these sections into Supabase SQL Editor one at a time
-- https://supabase.com/dashboard/project/mjfhegawkusjlkcgfevp/sql
-- =============================================================================

-- SECTION 1: VERIFY MIGRATION APPLIED
-- Run this first to check if the migration worked
-- =============================================================================
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
  AND column_name IN ('subscription_status', 'subscription_tier', 'campaigns_limit', 'is_beta_user')
ORDER BY column_name;

-- Expected: Should return 4 rows (one for each column)


-- SECTION 2: CHECK PRICING TIERS
-- Verify pricing tiers exist and are ready for Price IDs
-- =============================================================================
SELECT
  name,
  user_type,
  price_monthly,
  price_yearly,
  stripe_price_id_monthly,
  stripe_price_id_yearly,
  is_active
FROM pricing_tiers
ORDER BY user_type, price_monthly;

-- Expected: Should show 5 tiers (1 Free + 1 Pro for artists, 3 agency tiers)


-- SECTION 3: UPDATE STRIPE PRICE IDS (After creating Stripe products)
-- Replace 'price_XXXX' with actual Price IDs from Stripe Dashboard
-- =============================================================================

-- Pro Tier (Artist)
UPDATE pricing_tiers
SET
  stripe_price_id_monthly = 'price_XXXXXXXXXXXXXXXXXX',  -- ← Replace with actual Price ID
  stripe_price_id_yearly = 'price_YYYYYYYYYYYYYYYYYY'   -- ← Replace with actual Price ID
WHERE name = 'Pro' AND user_type = 'artist';

-- Agency Starter
UPDATE pricing_tiers
SET
  stripe_price_id_monthly = 'price_XXXXXXXXXXXXXXXXXX',
  stripe_price_id_yearly = 'price_YYYYYYYYYYYYYYYYYY'
WHERE name = 'Agency Starter' AND user_type = 'agency';

-- Agency Pro
UPDATE pricing_tiers
SET
  stripe_price_id_monthly = 'price_XXXXXXXXXXXXXXXXXX',
  stripe_price_id_yearly = 'price_YYYYYYYYYYYYYYYYYY'
WHERE name = 'Agency Pro' AND user_type = 'agency';

-- Agency Enterprise
UPDATE pricing_tiers
SET
  stripe_price_id_monthly = 'price_XXXXXXXXXXXXXXXXXX',
  stripe_price_id_yearly = 'price_YYYYYYYYYYYYYYYYYY'
WHERE name = 'Agency Enterprise' AND user_type = 'agency';


-- SECTION 4: FIND YOUR USER ID
-- Find your user account to mark as beta
-- =============================================================================
SELECT
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'your-email@example.com'  -- ← Replace with your email
ORDER BY created_at DESC
LIMIT 5;

-- Copy the 'id' value from the result


-- SECTION 5: MARK AS BETA USER
-- Replace USER_UUID_HERE with the ID from Section 4
-- =============================================================================
UPDATE user_profiles
SET is_beta_user = true
WHERE id = 'USER_UUID_HERE';  -- ← Replace with your user ID

-- Verify it worked
SELECT
  id,
  user_type,
  subscription_status,
  subscription_tier,
  campaigns_limit,
  is_beta_user
FROM user_profiles
WHERE id = 'USER_UUID_HERE';  -- ← Same user ID

-- Expected: is_beta_user should be 'true'


-- SECTION 6: TEST SUBSCRIPTION FUNCTIONS
-- Test that the subscription checking functions work
-- =============================================================================

-- Test get subscription details
SELECT * FROM get_user_subscription_details('USER_UUID_HERE');

-- Test can create campaign (should return true for beta users)
SELECT can_create_campaign('USER_UUID_HERE') as can_create;

-- Expected: can_create should be 'true'


-- SECTION 7: VIEW ALL USERS STATUS
-- See subscription status for all users
-- =============================================================================
SELECT
  up.id,
  au.email,
  up.user_type,
  up.subscription_status,
  up.subscription_tier,
  up.campaigns_limit,
  up.is_beta_user,
  COUNT(c.id) as campaign_count
FROM user_profiles up
JOIN auth.users au ON au.id = up.id
LEFT JOIN campaigns c ON c.user_id = up.id AND c.deleted_at IS NULL
GROUP BY up.id, au.email, up.user_type, up.subscription_status,
         up.subscription_tier, up.campaigns_limit, up.is_beta_user
ORDER BY up.created_at DESC;


-- =============================================================================
-- TESTING QUERIES
-- Use these to test different scenarios
-- =============================================================================

-- Create a test free user (run after signup via UI)
-- Get the new user's ID from auth.users first
INSERT INTO user_profiles (id, user_type, full_name)
VALUES (
  'NEW_USER_UUID',  -- ← Replace with new test user's ID
  'artist',
  'Test Free User'
)
ON CONFLICT (id) DO NOTHING;

-- Reset a user to free tier (for testing)
UPDATE user_profiles
SET
  subscription_status = 'free',
  subscription_tier = 'free',
  campaigns_limit = 3,
  is_beta_user = false
WHERE id = 'USER_UUID_HERE';

-- Simulate a pro subscription
UPDATE user_profiles
SET
  subscription_status = 'active',
  subscription_tier = 'pro',
  campaigns_limit = -1
WHERE id = 'USER_UUID_HERE';

-- Check if user can create more campaigns
SELECT
  up.id,
  au.email,
  COUNT(c.id) as current_campaigns,
  up.campaigns_limit,
  can_create_campaign(up.id) as can_create_more
FROM user_profiles up
JOIN auth.users au ON au.id = up.id
LEFT JOIN campaigns c ON c.user_id = up.id AND c.deleted_at IS NULL
WHERE up.id = 'USER_UUID_HERE'
GROUP BY up.id, au.email, up.campaigns_limit;


-- =============================================================================
-- CLEANUP QUERIES (Use carefully!)
-- =============================================================================

-- Remove all campaigns for a test user
-- DELETE FROM campaigns WHERE user_id = 'USER_UUID_HERE';

-- Remove beta status
-- UPDATE user_profiles SET is_beta_user = false WHERE id = 'USER_UUID_HERE';

-- =============================================================================
-- DONE!
-- Your subscription enforcement is now configured and ready to test
-- =============================================================================
