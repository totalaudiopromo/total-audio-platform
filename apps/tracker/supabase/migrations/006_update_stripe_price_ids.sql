-- Update pricing tiers with actual Stripe price IDs from total-audio-platform apps
-- These are the same price IDs used across audio-intel, voice-echo, and other apps

-- Update Artist Free tier (no Stripe price IDs needed for free tier)
UPDATE pricing_tiers 
SET stripe_price_id_monthly = NULL, stripe_price_id_yearly = NULL
WHERE name = 'Free' AND user_type = 'artist';

-- Update Artist Pro tier
UPDATE pricing_tiers 
SET stripe_price_id_monthly = 'price_1Ro9yEPqujcPv5fbZKpcLIFT',
    stripe_price_id_yearly = 'price_1Ro9xiPqujcPv5fbutj97L7C'
WHERE name = 'Pro' AND user_type = 'artist';

-- Update Agency Starter tier
UPDATE pricing_tiers 
SET stripe_price_id_monthly = 'price_1Ro9x2PqujcPv5fbMFNSIqq1',
    stripe_price_id_yearly = 'price_1Ro9x2PqujcPv5fbjvdTBDvE'
WHERE name = 'Agency Starter' AND user_type = 'agency';

-- Update Agency Pro tier
UPDATE pricing_tiers 
SET stripe_price_id_monthly = 'price_1Ro9zrPqujcPv5fbmjN7bph6',
    stripe_price_id_yearly = 'price_1Ro9yePqujcPv5fb4PBXlwVb'
WHERE name = 'Agency Pro' AND user_type = 'agency';

-- Update Agency Enterprise tier (using same price IDs as Pro for now)
UPDATE pricing_tiers 
SET stripe_price_id_monthly = 'price_1Ro9zrPqujcPv5fbmjN7bph6',
    stripe_price_id_yearly = 'price_1Ro9yePqujcPv5fb4PBXlwVb'
WHERE name = 'Agency Enterprise' AND user_type = 'agency';





