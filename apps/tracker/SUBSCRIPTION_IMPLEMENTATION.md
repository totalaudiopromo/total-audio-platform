# Subscription Enforcement Implementation

## Overview
This implementation adds full subscription checking and enforcement to Campaign Tracker, ensuring non-beta users are limited by their subscription tier while beta users have unlimited access.

## What Was Added

### 1. Database Schema (Migration 018)
**File**: `supabase/migrations/018_subscription_enforcement.sql`

Added columns to `user_profiles` table:
- `subscription_status` - Current Stripe subscription status
- `subscription_tier` - Current pricing tier (free, pro, agency_*)
- `campaigns_limit` - Maximum campaigns allowed (-1 for unlimited)
- `is_beta_user` - Boolean flag for beta access

**Database Functions**:
- `get_user_subscription_details(user_id)` - Returns subscription info + current usage
- `can_create_campaign(user_id)` - Checks if user can create new campaign
- `sync_subscription_to_profile()` - Trigger to sync Stripe webhooks to profile
- `handle_subscription_cancellation()` - Trigger for cancellation handling

### 2. Subscription Utilities
**File**: `lib/subscription.ts`

Key functions:
```typescript
// Check if user can create campaign
await canCreateCampaign(userId)

// Get detailed subscription info
await getUserSubscriptionDetails(userId)

// Get limits for UI display
await getSubscriptionLimits(userId)

// Check active subscription status
await hasActiveSubscription(userId)

// Get current tier
await getSubscriptionTier(userId)

// Admin: Mark user as beta
await setBetaUser(userId, true)
```

### 3. API Protection
**File**: `app/api/campaigns/route.ts`

Campaign creation now checks subscription limits:
```typescript
// Returns 403 if limit reached
const canCreate = await canCreateCampaign(user.id);
if (!canCreate) {
  return NextResponse.json({
    error: 'Campaign limit reached',
    requiresUpgrade: true,
    limits
  }, { status: 403 });
}
```

### 4. Billing Dashboard
**Files**:
- `app/billing/page.tsx` - Billing page route
- `components/billing/BillingDashboard.tsx` - Main billing UI
- `components/billing/UpgradePrompt.tsx` - Upgrade prompts

Features:
- Display current subscription status
- Show campaign usage (X/Y campaigns used)
- Pricing tier comparison
- Monthly/Yearly billing toggle
- Stripe checkout integration
- Billing portal access

### 5. Middleware Updates
**File**: `middleware.ts`

Added `/billing` and `/upgrade` to public routes so authenticated users can access billing pages.

## How It Works

### Flow 1: New User Signs Up
1. User creates account
2. Profile created with default values:
   - `subscription_status`: 'free'
   - `subscription_tier`: 'free'
   - `campaigns_limit`: 3
   - `is_beta_user`: false

### Flow 2: User Creates Campaign
1. POST request to `/api/campaigns`
2. API checks `can_create_campaign(user.id)`
3. If limit reached → 403 response with upgrade prompt
4. If allowed → Campaign created

### Flow 3: User Upgrades
1. User visits `/billing`
2. Selects pricing tier
3. Clicks "Upgrade" → Stripe checkout
4. After payment → Stripe webhook
5. Webhook updates `subscriptions` table
6. Trigger syncs to `user_profiles`:
   - Updates `subscription_status` to 'active'
   - Updates `subscription_tier` to selected plan
   - Updates `campaigns_limit` to -1 (unlimited)

### Flow 4: Beta User Access
1. Admin marks user as beta: `UPDATE user_profiles SET is_beta_user = true WHERE id = 'user-id'`
2. Beta users bypass all subscription checks
3. `can_create_campaign()` returns true immediately for beta users

## Testing Instructions

### 1. Run the Migration
```bash
# Apply migration to production database
PGPASSWORD='PostTracker123!' psql \
  -h aws-0-eu-west-2.pooler.supabase.com \
  -p 6543 \
  -U postgres.mjfhegawkusjlkcgfevp \
  -d postgres \
  -f supabase/migrations/018_subscription_enforcement.sql
```

### 2. Test Free User Limits
1. Create new test account
2. Create 3 campaigns (should succeed)
3. Try to create 4th campaign → Should see "Campaign limit reached" error
4. Visit `/billing` → Should see upgrade prompt

### 3. Test Beta User
```sql
-- Mark test user as beta
UPDATE user_profiles
SET is_beta_user = true
WHERE id = 'user-uuid-here';
```

Then test:
1. Create unlimited campaigns ✅
2. Visit `/billing` → Should see beta user badge
3. No upgrade prompts shown

### 4. Test Subscription Upgrade
1. Visit `/billing` as free user
2. Click "Upgrade to Pro" (£19/month)
3. Complete Stripe checkout (use test card: 4242 4242 4242 4242)
4. After webhook processes:
   - `subscription_status` → 'active'
   - `subscription_tier` → 'pro'
   - `campaigns_limit` → -1
5. Try creating campaigns → Unlimited ✅

### 5. Test Subscription Cancellation
1. Visit `/billing` → Click "Manage Billing in Stripe"
2. Cancel subscription in Stripe portal
3. After webhook:
   - `subscription_status` → 'canceled'
   - `subscription_tier` → 'free'
   - `campaigns_limit` → 3
4. Try creating 4th campaign → Blocked ✅

## Stripe Configuration Required

### 1. Environment Variables
```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=https://tracker.totalaudiopromo.com
```

### 2. Create Products in Stripe
Create products for each tier:
- **Free**: No Stripe product needed
- **Pro**: £19/month, £190/year
- **Agency Starter**: £49/month, £490/year
- **Agency Pro**: £99/month, £990/year
- **Agency Enterprise**: £199/month, £1990/year

### 3. Update Pricing Tiers
After creating Stripe products, update the database:

```sql
-- Update with actual Stripe Price IDs
UPDATE pricing_tiers
SET
  stripe_price_id_monthly = 'price_xxx',
  stripe_price_id_yearly = 'price_yyy'
WHERE name = 'Pro' AND user_type = 'artist';

-- Repeat for each tier
```

### 4. Configure Webhooks
Add webhook endpoint in Stripe Dashboard:
- URL: `https://tracker.totalaudiopromo.com/api/webhooks/stripe`
- Events:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

### 5. Update Webhook Handler
The webhook handler should call `syncSubscriptionFromStripe()`:

```typescript
import { syncSubscriptionFromStripe } from '@/lib/subscription';

// In webhook handler
const subscription = event.data.object;
await syncSubscriptionFromStripe(userId, {
  stripe_subscription_id: subscription.id,
  status: subscription.status,
  price_id: subscription.items.data[0].price.id,
  plan_type: determinePlanType(subscription),
  current_period_start: new Date(subscription.current_period_start * 1000),
  current_period_end: new Date(subscription.current_period_end * 1000),
  cancel_at_period_end: subscription.cancel_at_period_end,
});
```

## Admin Functions

### Mark User as Beta
```sql
UPDATE user_profiles
SET is_beta_user = true
WHERE id = 'user-uuid';
```

### Check User's Subscription Status
```sql
SELECT * FROM get_user_subscription_details('user-uuid');
```

### Manually Set Subscription
```sql
UPDATE user_profiles
SET
  subscription_status = 'active',
  subscription_tier = 'pro',
  campaigns_limit = -1
WHERE id = 'user-uuid';
```

### View All Subscriptions
```sql
SELECT
  up.id,
  up.subscription_status,
  up.subscription_tier,
  up.campaigns_limit,
  up.is_beta_user,
  COUNT(c.id) as current_campaigns
FROM user_profiles up
LEFT JOIN campaigns c ON c.user_id = up.id AND c.deleted_at IS NULL
GROUP BY up.id;
```

## Frontend Integration Examples

### Show Upgrade Prompt on Campaign Create
```tsx
import { UpgradeModal } from '@/components/billing/UpgradePrompt';

function CreateCampaignButton() {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleCreate = async () => {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });

    if (res.status === 403) {
      const data = await res.json();
      if (data.requiresUpgrade) {
        setShowUpgrade(true);
        return;
      }
    }

    // Handle success
  };

  return (
    <>
      <button onClick={handleCreate}>Create Campaign</button>
      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        message="You've reached your campaign limit"
      />
    </>
  );
}
```

### Display Usage in Header
```tsx
import { getSubscriptionLimits } from '@/lib/subscription';

async function HeaderUsage() {
  const limits = await getSubscriptionLimits();

  return (
    <div>
      {limits?.isUnlimited ? (
        <span>Unlimited campaigns</span>
      ) : (
        <span>
          {limits?.campaignsUsed} / {limits?.campaignsLimit} campaigns
        </span>
      )}
    </div>
  );
}
```

## Troubleshooting

### Issue: Users can still create unlimited campaigns
**Check**:
1. Migration applied? `SELECT * FROM user_profiles LIMIT 1;`
2. RPC functions exist? `SELECT * FROM pg_proc WHERE proname = 'can_create_campaign';`
3. API check added? Review `app/api/campaigns/route.ts`

### Issue: Stripe checkout not working
**Check**:
1. Environment variables set? `echo $STRIPE_SECRET_KEY`
2. Price IDs correct? `SELECT * FROM pricing_tiers;`
3. Customer creation working? `SELECT * FROM customers;`

### Issue: Webhook not updating profile
**Check**:
1. Webhook endpoint configured in Stripe?
2. Trigger exists? `SELECT * FROM pg_trigger WHERE tgname = 'sync_subscription_status';`
3. Webhook handler calling `syncSubscriptionFromStripe()`?

### Issue: Beta users seeing limits
**Check**:
1. Beta flag set? `SELECT is_beta_user FROM user_profiles WHERE id = 'user-id';`
2. Function checking beta? Review `can_create_campaign()` logic

## Next Steps

### Phase 1: Launch (Completed)
- ✅ Database schema
- ✅ Subscription utilities
- ✅ API protection
- ✅ Billing dashboard
- ✅ Upgrade prompts

### Phase 2: Enhancement
- [ ] Add usage analytics to dashboard
- [ ] Email notifications when approaching limit
- [ ] Graceful downgrade handling
- [ ] Proration for upgrades/downgrades
- [ ] Team member limits for agencies

### Phase 3: Optimization
- [ ] Cache subscription checks (Redis)
- [ ] Optimistic UI updates
- [ ] A/B test pricing tiers
- [ ] Add annual discount banners

## Support

For issues or questions:
1. Check logs: `supabase logs`
2. Review Stripe events: Stripe Dashboard > Developers > Events
3. Check database state: Run diagnostic queries above
4. Review error messages in browser console

---

**Last Updated**: 2025-10-13
**Version**: 1.0
**Status**: ✅ Ready for deployment
