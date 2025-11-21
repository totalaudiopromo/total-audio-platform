# Subscription Setup & Testing Guide

##  Step 1: Apply Migration

### Option A: Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard/project/mjfhegawkusjlkcgfevp/sql
2. Copy the entire contents of `supabase/migrations/018_subscription_enforcement.sql`
3. Paste into the SQL editor
4. Click **"Run"**

### Option B: Command Line (if psql is installed)

```bash
PGPASSWORD='PostTracker123!' psql \
  -h aws-0-eu-west-2.pooler.supabase.com \
  -p 6543 \
  -U postgres.mjfhegawkusjlkcgfevp \
  -d postgres \
  -f supabase/migrations/018_subscription_enforcement.sql
```

### Verify Migration Applied

Run this in Supabase SQL Editor:

```sql
-- Check columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
  AND column_name IN ('subscription_status', 'subscription_tier', 'campaigns_limit', 'is_beta_user')
ORDER BY column_name;

-- Check functions were created
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name IN (
  'get_user_subscription_details',
  'can_create_campaign',
  'sync_subscription_to_profile',
  'handle_subscription_cancellation'
)
ORDER BY routine_name;

-- Check triggers were created
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name IN ('sync_subscription_status', 'handle_subscription_cancel')
ORDER BY trigger_name;
```

**Expected Results:**

-  4 columns added to user_profiles
-  4 functions created
-  2 triggers created

---

##  Step 2: Configure Stripe Price IDs

### 2.1 Create Stripe Products (Test Mode)

Go to: https://dashboard.stripe.com/test/products

Create these products:

#### Product 1: Campaign Tracker Pro (Artist)

- Name: **Campaign Tracker Pro**
- Description: Unlimited campaigns, advanced analytics, priority support
- **Monthly Price**: £19.00 GBP
  - Copy the Price ID (starts with `price_`)
- **Yearly Price**: £190.00 GBP (save 20%)
  - Copy the Price ID

#### Product 2: Campaign Tracker Agency Starter

- Name: **Campaign Tracker Agency Starter**
- Description: Up to 5 clients, unlimited campaigns, team collaboration
- **Monthly Price**: £49.00 GBP
- **Yearly Price**: £490.00 GBP

#### Product 3: Campaign Tracker Agency Pro

- Name: **Campaign Tracker Agency Pro**
- Description: Up to 15 clients, advanced team tools, API access
- **Monthly Price**: £99.00 GBP
- **Yearly Price**: £990.00 GBP

#### Product 4: Campaign Tracker Agency Enterprise

- Name: **Campaign Tracker Agency Enterprise**
- Description: Unlimited clients, full API access, dedicated support
- **Monthly Price**: £199.00 GBP
- **Yearly Price**: £1990.00 GBP

### 2.2 Update Database with Price IDs

After creating products, run this SQL (replace with your actual Price IDs):

```sql
-- Update Pro tier (Artist)
UPDATE pricing_tiers
SET
  stripe_price_id_monthly = 'price_XXXXXXXXXXXXXXXXXX',  -- Replace with actual Price ID
  stripe_price_id_yearly = 'price_YYYYYYYYYYYYYYYYYY'   -- Replace with actual Price ID
WHERE name = 'Pro' AND user_type = 'artist';

-- Update Agency Starter
UPDATE pricing_tiers
SET
  stripe_price_id_monthly = 'price_XXXXXXXXXXXXXXXXXX',
  stripe_price_id_yearly = 'price_YYYYYYYYYYYYYYYYYY'
WHERE name = 'Agency Starter' AND user_type = 'agency';

-- Update Agency Pro
UPDATE pricing_tiers
SET
  stripe_price_id_monthly = 'price_XXXXXXXXXXXXXXXXXX',
  stripe_price_id_yearly = 'price_YYYYYYYYYYYYYYYYYY'
WHERE name = 'Agency Pro' AND user_type = 'agency';

-- Update Agency Enterprise
UPDATE pricing_tiers
SET
  stripe_price_id_monthly = 'price_XXXXXXXXXXXXXXXXXX',
  stripe_price_id_yearly = 'price_YYYYYYYYYYYYYYYYYY'
WHERE name = 'Agency Enterprise' AND user_type = 'agency';

-- Verify updates
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
```

---

##  Step 3: Mark Beta Users

### Get Your User ID

First, find your user ID. Visit the app and sign in, then check the browser console or run:

```sql
-- Find user by email
SELECT id, email, created_at
FROM auth.users
WHERE email = 'your-email@example.com';  -- Replace with your email
```

### Mark as Beta User

```sql
-- Replace with your actual user ID
UPDATE user_profiles
SET is_beta_user = true
WHERE id = 'USER_UUID_HERE';

-- Verify
SELECT
  id,
  user_type,
  subscription_status,
  subscription_tier,
  campaigns_limit,
  is_beta_user
FROM user_profiles
WHERE is_beta_user = true;
```

---

##  Step 4: Testing Checklist

### Test 1: Free User Limits

Create a **new test account** (or use an existing non-beta user):

```sql
-- Create test user profile (after signup via UI)
INSERT INTO user_profiles (id, user_type, full_name)
VALUES (
  'NEW_USER_UUID_FROM_AUTH',  -- Get from auth.users after signup
  'artist',
  'Test Free User'
);

-- Verify free tier settings
SELECT
  id,
  subscription_status,  -- Should be 'free'
  subscription_tier,    -- Should be 'free'
  campaigns_limit,      -- Should be 3
  is_beta_user          -- Should be false
FROM user_profiles
WHERE id = 'NEW_USER_UUID_FROM_AUTH';
```

**Test Steps:**

1.  Sign up with test account
2.  Create campaign 1 → Should succeed
3.  Create campaign 2 → Should succeed
4.  Create campaign 3 → Should succeed
5.  Try to create campaign 4 → Should see error:
   ```
   Error: Campaign limit reached
   Message: You've reached your campaign limit of 3. Upgrade your plan to create more campaigns.
   ```
6.  Visit `/billing` → Should see upgrade options

### Test 2: Beta User Unlimited Access

Using your beta user account:

```sql
-- Verify beta status
SELECT
  id,
  is_beta_user,           -- Should be true
  campaigns_limit         -- Any value, will be bypassed
FROM user_profiles
WHERE id = 'YOUR_USER_UUID';

-- Test the function directly
SELECT can_create_campaign('YOUR_USER_UUID');  -- Should return true
```

**Test Steps:**

1.  Sign in as beta user
2.  Create 10+ campaigns → All should succeed
3.  Visit `/billing` → Should see beta user badge
4.  No upgrade prompts shown

### Test 3: Subscription Upgrade Flow

Using your free test account:

**Test Steps:**

1.  Visit `/billing` as free user
2.  Click "Upgrade to Pro"
3.  Should redirect to Stripe Checkout
4.  Use test card: **4242 4242 4242 4242**
   - Any future expiry date
   - Any 3-digit CVC
   - Any 5-digit postal code
5.  Complete checkout
6.  Should redirect back to `/billing?success=true`

**Verify in Database:**

```sql
-- Check subscription was created
SELECT
  id,
  user_id,
  stripe_subscription_id,
  status,
  plan_type,
  current_period_start,
  current_period_end
FROM subscriptions
WHERE user_id = 'TEST_USER_UUID';

-- Check profile was updated
SELECT
  id,
  subscription_status,  -- Should be 'active' or 'trialing'
  subscription_tier,    -- Should be 'pro'
  campaigns_limit       -- Should be -1 (unlimited)
FROM user_profiles
WHERE id = 'TEST_USER_UUID';
```

7.  Try creating campaigns → Should be unlimited
8.  Visit `/billing` → Should show "Pro Plan" as current

### Test 4: Stripe Billing Portal

**Test Steps:**

1.  Visit `/billing` as paid user
2.  Click "Manage Billing in Stripe"
3.  Should open Stripe Customer Portal
4.  View subscription details
5.  Try cancelling subscription
6.  After webhook processes, verify:

```sql
SELECT
  subscription_status,  -- Should be 'canceled'
  subscription_tier,    -- Should be 'free'
  campaigns_limit       -- Should be 3
FROM user_profiles
WHERE id = 'TEST_USER_UUID';
```

---

##  Debugging Queries

### Check All Users' Subscription Status

```sql
SELECT
  up.id,
  au.email,
  up.user_type,
  up.subscription_status,
  up.subscription_tier,
  up.campaigns_limit,
  up.is_beta_user,
  COUNT(c.id) as campaign_count,
  can_create_campaign(up.id) as can_create_more
FROM user_profiles up
JOIN auth.users au ON au.id = up.id
LEFT JOIN campaigns c ON c.user_id = up.id AND c.deleted_at IS NULL
GROUP BY up.id, au.email
ORDER BY up.created_at DESC;
```

### Test Subscription Details Function

```sql
-- Replace with any user ID
SELECT * FROM get_user_subscription_details('USER_UUID_HERE');
```

### Check Campaign Creation Permission

```sql
-- Replace with any user ID
SELECT can_create_campaign('USER_UUID_HERE') as can_create;
```

### View All Subscriptions

```sql
SELECT
  s.id,
  au.email,
  s.status,
  s.plan_type,
  s.stripe_subscription_id,
  s.current_period_end,
  s.cancel_at_period_end,
  s.created_at
FROM subscriptions s
JOIN auth.users au ON au.id = s.user_id
ORDER BY s.created_at DESC;
```

### Reset User to Free Tier (for testing)

```sql
-- Reset a user back to free tier
UPDATE user_profiles
SET
  subscription_status = 'free',
  subscription_tier = 'free',
  campaigns_limit = 3,
  is_beta_user = false
WHERE id = 'USER_UUID_HERE';

-- Delete their test campaigns (optional)
DELETE FROM campaigns
WHERE user_id = 'USER_UUID_HERE';
```

---

##  Quick Reference

### Beta User Management

```sql
-- Mark as beta
UPDATE user_profiles SET is_beta_user = true WHERE id = 'UUID';

-- Remove beta status
UPDATE user_profiles SET is_beta_user = false WHERE id = 'UUID';

-- List all beta users
SELECT id, email FROM auth.users WHERE id IN (
  SELECT id FROM user_profiles WHERE is_beta_user = true
);
```

### Subscription Status Values

- `free` - No active subscription
- `trialing` - In trial period (treated as active)
- `active` - Paid and active
- `past_due` - Payment failed, grace period
- `canceled` - Subscription cancelled
- `unpaid` - Payment failed, no access

### Subscription Tiers

- `free` - 3 campaigns
- `pro` - Unlimited campaigns (£19/month)
- `agency_starter` - Unlimited campaigns + 5 clients (£49/month)
- `agency_pro` - Unlimited campaigns + 15 clients (£99/month)
- `agency_enterprise` - Unlimited everything (£199/month)

---

##  Troubleshooting

### Issue: Migration fails with "column already exists"

**Solution:** Run this to check and manually add missing columns:

```sql
-- Check which columns exist
SELECT column_name FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND column_name IN ('subscription_status', 'subscription_tier', 'campaigns_limit', 'is_beta_user');

-- Add only missing columns (adjust as needed)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
-- etc.
```

### Issue: Stripe checkout not redirecting

**Check:**

1. `NEXT_PUBLIC_APP_URL` environment variable set correctly
2. Stripe Price IDs configured in database
3. Browser console for errors
4. Network tab for API response

### Issue: Webhook not updating profile

**Check:**

1. Webhook endpoint configured in Stripe Dashboard
2. Webhook secret configured in environment variables
3. Check Stripe Dashboard > Developers > Events for webhook delivery status
4. Review application logs for webhook processing errors

### Issue: Beta user still seeing limits

**Check:**

```sql
-- Verify beta status
SELECT id, is_beta_user FROM user_profiles WHERE id = 'UUID';

-- Test function directly
SELECT can_create_campaign('UUID');  -- Should return true

-- Check function definition
SELECT routine_definition FROM information_schema.routines
WHERE routine_name = 'can_create_campaign';
```

---

##  Next Steps After Setup

1. **Test in Production**: Follow test checklist with real money (small amount)
2. **Monitor Webhooks**: Watch Stripe Dashboard for webhook deliveries
3. **Add Monitoring**: Set up alerts for failed payments/webhooks
4. **User Communication**: Email templates for subscription changes
5. **Analytics**: Track conversion rates from free to paid

---

**Setup Complete!** 

Your subscription enforcement is now ready to use. Users will be limited by their tier, and you can mark trusted users as beta testers for unlimited access.
