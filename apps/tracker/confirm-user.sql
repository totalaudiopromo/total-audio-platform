-- Run this in Supabase SQL Editor to confirm test user
-- https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/sql/new

UPDATE auth.users
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'test@tracker.com';

-- Verify it worked
SELECT email, email_confirmed_at, confirmed_at
FROM auth.users
WHERE email = 'test@tracker.com';
