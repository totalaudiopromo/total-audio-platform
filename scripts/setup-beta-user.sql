-- SQL Script to Create Beta User Account for Jeremy Garrett-Cox
-- This is an alternative if the TypeScript script has dependency issues
--
-- Usage: psql -d total_audio_promo -f scripts/setup-beta-user.sql

-- Variables (you'll need to update these with actual values)
-- Password hash for: Streamer2024!BetaAccess
-- Generate with: bcrypt.hash('Streamer2024!BetaAccess', 10)

BEGIN;

-- Create the user
INSERT INTO users (
  id,
  email,
  name,
  "passwordHash",
  role,
  "agencyId",
  "createdAt",
  "updatedAt"
) VALUES (
  'beta-jeremy-' || gen_random_uuid()::text,
  'info@streamer.co.uk',
  'Jeremy Garrett-Cox',
  '$2a$10$YourHashedPasswordHere', -- Replace with actual bcrypt hash
  'ARTIST',
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (email)
DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  "updatedAt" = NOW()
RETURNING id AS user_id;

-- Store user_id for subsequent queries
WITH created_user AS (
  SELECT id FROM users WHERE email = 'info@streamer.co.uk'
)

-- Create artist profile for Streamer band
INSERT INTO artists (
  id,
  name,
  email,
  "userId",
  "agencyId",
  genre,
  "spotifyUrl",
  "instagramUrl",
  "websiteUrl",
  "createdAt",
  "updatedAt"
)
SELECT
  'artist-streamer-' || gen_random_uuid()::text,
  'Streamer',
  'info@streamer.co.uk',
  created_user.id,
  NULL,
  'Rock', -- Update with actual genre
  '', -- Add Spotify URL if available
  '', -- Add Instagram URL if available
  'https://streamer.co.uk',
  NOW(),
  NOW()
FROM created_user
ON CONFLICT DO NOTHING;

-- Create beta subscription (60-day trial, no cost)
WITH created_user AS (
  SELECT id FROM users WHERE email = 'info@streamer.co.uk'
)
INSERT INTO subscriptions (
  id,
  "userId",
  tier,
  status,
  "monthlyPrice",
  "setupFee",
  "currentPeriodEnd",
  "createdAt",
  "updatedAt"
)
SELECT
  'sub-jeremy-' || gen_random_uuid()::text,
  created_user.id,
  'ARTIST',
  'ACTIVE',
  0.00, -- Beta users get free access
  0.00, -- No setup fee
  NOW() + INTERVAL '60 days', -- 60-day beta period
  NOW(),
  NOW()
FROM created_user
ON CONFLICT ("userId")
DO UPDATE SET
  status = 'ACTIVE',
  "currentPeriodEnd" = NOW() + INTERVAL '60 days',
  "monthlyPrice" = 0.00,
  "setupFee" = 0.00,
  "updatedAt" = NOW();

COMMIT;

-- Verify the setup
SELECT
  u.id AS user_id,
  u.email,
  u.name,
  u.role,
  a.name AS band_name,
  a.genre,
  s.tier AS subscription_tier,
  s.status AS subscription_status,
  s."currentPeriodEnd" AS beta_expires
FROM users u
LEFT JOIN artists a ON a."userId" = u.id
LEFT JOIN subscriptions s ON s."userId" = u.id
WHERE u.email = 'info@streamer.co.uk';

-- Display setup summary
\echo ''
\echo '✅ Beta User Setup Complete!'
\echo ''
\echo '📊 User Details:'
\echo '   Email: info@streamer.co.uk'
\echo '   Name: Jeremy Garrett-Cox'
\echo '   Band: Streamer'
\echo '   Role: ARTIST'
\echo ''
\echo '💳 Subscription:'
\echo '   Tier: ARTIST (Beta)'
\echo '   Status: ACTIVE'
\echo '   Cost: £0/month (free during beta)'
\echo '   Expires: 60 days from now'
\echo ''
\echo '🔐 Login Credentials:'
\echo '   Email: info@streamer.co.uk'
\echo '   Password: Streamer2024!BetaAccess'
\echo '   ⚠️  User must change password on first login!'
\echo ''
\echo '🌐 Access URLs:'
\echo '   Audio Intel: https://intel.totalaudiopromo.com'
\echo '   Command Centre: https://command.totalaudiopromo.com'
\echo '   Pitch Generator: [URL TBD]'
\echo ''
\echo '📧 Next Steps:'
\echo '   1. Send welcome email to info@streamer.co.uk'
\echo '   2. Add to ConvertKit with "beta-user" tag'
\echo '   3. Monitor usage in Command Centre'
\echo '   4. Follow up after 7 days if no login'
\echo ''
