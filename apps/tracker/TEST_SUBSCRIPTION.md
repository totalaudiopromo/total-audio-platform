# Subscription Testing Checklist

## Quick Setup (5 minutes)

###  Step 1: Apply Migration

1. Open: https://supabase.com/dashboard/project/mjfhegawkusjlkcgfevp/sql
2. Copy contents of `supabase/migrations/018_subscription_enforcement.sql`
3. Paste and click **"Run"**
4. Verify: Run this query:
   ```sql
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'user_profiles'
   AND column_name IN ('subscription_status', 'subscription_tier', 'campaigns_limit', 'is_beta_user');
   ```
   **Expected**: 4 rows returned

###  Step 2: Mark Yourself as Beta User

1. Find your user ID:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   ```
2. Mark as beta:
   ```sql
   UPDATE user_profiles SET is_beta_user = true WHERE id = 'YOUR_UUID_HERE';
   ```
3. Verify:
   ```sql
   SELECT is_beta_user FROM user_profiles WHERE id = 'YOUR_UUID_HERE';
   ```
   **Expected**: `true`

###  Step 3: Test Beta User Can Create Unlimited Campaigns

1. Sign in to: https://tracker.totalaudiopromo.com
2. Create 5+ campaigns (should all succeed)
3. Visit: https://tracker.totalaudiopromo.com/billing
4. Should see **"Beta User"** badge
5. No upgrade prompts shown

---

## Full Test Suite (15 minutes)

### Test A: Free User Limits

**Setup:**

1. Create new test account at `/signup`
2. Get new user ID from database:
   ```sql
   SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 1;
   ```

**Test Steps:**

1.  Create Campaign #1 → **Success**
2.  Create Campaign #2 → **Success**
3.  Create Campaign #3 → **Success**
4.  Create Campaign #4 → **Should FAIL with error:**
   ```
   Campaign limit reached
   You've reached your campaign limit of 3. Upgrade your plan to create more campaigns.
   ```
5.  Visit `/billing` → Should show upgrade options

**Verify in Database:**

```sql
SELECT
  subscription_status,  -- Should be 'free'
  subscription_tier,    -- Should be 'free'
  campaigns_limit,      -- Should be 3
  (SELECT COUNT(*) FROM campaigns WHERE user_id = 'TEST_USER_UUID') as current_campaigns
FROM user_profiles
WHERE id = 'TEST_USER_UUID';
```

---

### Test B: Beta User Bypass

**Using your beta user account:**

**Test Steps:**

1.  Create 10+ campaigns → All succeed
2.  Visit `/billing` → Beta badge shown
3.  No limit warnings or upgrade prompts

**Verify in Database:**

```sql
SELECT can_create_campaign('YOUR_UUID') as can_create;  -- Should return true
```

---

### Test C: Stripe Integration (Test Mode)

**Prerequisites:**

1. Stripe account in Test Mode
2. Created products with Price IDs
3. Updated `pricing_tiers` table with Price IDs

**Test Steps:**

1.  Sign in as free test user (3 campaigns already created)
2.  Visit `/billing`
3.  Click **"Upgrade to Pro"**
4.  Redirected to Stripe Checkout
5.  Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
6.  Complete payment
7.  Redirected to `/billing?success=true`
8.  Page shows "Pro Plan" as active
9.  Create Campaign #4 → **Should succeed now**
10.  Create 10 more campaigns → All succeed

**Verify in Database:**

```sql
-- Check subscription created
SELECT status, plan_type FROM subscriptions WHERE user_id = 'TEST_USER_UUID';
-- Expected: status = 'active', plan_type = 'pro'

-- Check profile updated
SELECT subscription_status, subscription_tier, campaigns_limit
FROM user_profiles WHERE id = 'TEST_USER_UUID';
-- Expected: status = 'active', tier = 'pro', limit = -1
```

---

### Test D: Billing Portal

**Test Steps:**

1.  Sign in as paid user (from Test C)
2.  Visit `/billing`
3.  Click **"Manage Billing in Stripe"**
4.  Opens Stripe Customer Portal
5.  View subscription details
6.  (Optional) Cancel subscription
7.  If cancelled, verify downgrade:
   ```sql
   SELECT subscription_status, subscription_tier, campaigns_limit
   FROM user_profiles WHERE id = 'TEST_USER_UUID';
   -- Expected: status = 'canceled', tier = 'free', limit = 3
   ```

---

## Quick Verification Queries

### Check All Users' Status

```sql
SELECT
  au.email,
  up.subscription_tier,
  up.campaigns_limit,
  up.is_beta_user,
  COUNT(c.id) as campaigns
FROM user_profiles up
JOIN auth.users au ON au.id = up.id
LEFT JOIN campaigns c ON c.user_id = up.id
GROUP BY au.email, up.subscription_tier, up.campaigns_limit, up.is_beta_user;
```

### Test Function Directly

```sql
-- Check if user can create campaign
SELECT
  can_create_campaign('USER_UUID') as can_create,
  (SELECT campaigns_limit FROM user_profiles WHERE id = 'USER_UUID') as limit,
  (SELECT COUNT(*) FROM campaigns WHERE user_id = 'USER_UUID') as current
;
```

### Get Subscription Details

```sql
SELECT * FROM get_user_subscription_details('USER_UUID');
```

---

## Common Issues & Solutions

###  Issue: Campaign creation still allows unlimited for free users

**Check:**

```sql
-- Verify API is calling the check
SELECT can_create_campaign('USER_UUID');

-- Check current count
SELECT COUNT(*) FROM campaigns WHERE user_id = 'USER_UUID' AND deleted_at IS NULL;
```

**Solution:** Ensure migration applied and app restarted

###  Issue: Beta user seeing limits

**Check:**

```sql
SELECT is_beta_user FROM user_profiles WHERE id = 'USER_UUID';
```

**Solution:** Run the UPDATE query to set `is_beta_user = true`

###  Issue: Stripe checkout not working

**Check:**

1. Price IDs configured? `SELECT stripe_price_id_monthly FROM pricing_tiers WHERE name = 'Pro';`
2. Environment variable set? `STRIPE_SECRET_KEY`
3. Test mode enabled in Stripe Dashboard

---

## Reset Scripts (For repeated testing)

### Reset User to Free Tier

```sql
UPDATE user_profiles
SET
  subscription_status = 'free',
  subscription_tier = 'free',
  campaigns_limit = 3,
  is_beta_user = false
WHERE id = 'USER_UUID';
```

### Delete Test Campaigns

```sql
DELETE FROM campaigns WHERE user_id = 'USER_UUID';
```

### Delete Test Subscription

```sql
DELETE FROM subscriptions WHERE user_id = 'USER_UUID';
```

---

## Success Criteria 

Your subscription system is working correctly when:

- [x] Free users limited to 3 campaigns
- [x] 4th campaign creation fails with clear error message
- [x] Beta users can create unlimited campaigns
- [x] Stripe checkout redirects properly
- [x] Test payment succeeds with test card
- [x] Profile updates to 'pro' tier after payment
- [x] Pro users can create unlimited campaigns
- [x] Billing portal accessible
- [x] `/billing` page shows correct plan and usage

---

## Next Steps After Testing

1. **Production Stripe Setup**
   - Switch to Live Mode in Stripe Dashboard
   - Create production products
   - Update environment variables with live keys
   - Update Price IDs in database

2. **User Communication**
   - Draft emails for:
     - Payment failed
     - Subscription cancelled
     - Approaching campaign limit
     - Welcome to Pro

3. **Monitoring**
   - Set up Stripe webhook monitoring
   - Alert on failed payments
   - Track conversion rates

4. **Beta User Management**
   - Document who has beta access
   - Create process for granting/removing beta status
   - Consider time-limited beta access

---

**Ready to Launch!** 

Once all tests pass, your subscription enforcement is production-ready.
