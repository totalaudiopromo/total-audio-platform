-- Fix Campaign Limit for Demo
-- Run this in your Supabase SQL Editor to unlock unlimited campaigns

-- Option 1: Mark yourself as beta user (RECOMMENDED for demo)
-- Replace 'your-user-id-here' with your actual user ID from the auth.users table
UPDATE user_profiles
SET is_beta_user = true
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'chrisschofield@libertymusicpr.com' -- or your email
  LIMIT 1
);

-- Option 2: If user_profiles doesn't exist yet, check auth.users
-- First, find your user ID:
SELECT id, email FROM auth.users WHERE email LIKE '%chris%';

-- Then update with the ID:
-- UPDATE user_profiles SET is_beta_user = true WHERE id = 'paste-user-id-here';

-- Verify it worked:
SELECT
  up.id,
  up.is_beta_user,
  up.subscription_tier,
  (SELECT COUNT(*) FROM campaigns WHERE user_id = up.id) as campaign_count
FROM user_profiles up
WHERE up.id = (SELECT id FROM auth.users WHERE email = 'chrisschofield@libertymusicpr.com' LIMIT 1);
