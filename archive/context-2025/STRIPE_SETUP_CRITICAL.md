# 🚨 CRITICAL: Stripe Checkout Setup for Revenue

**Status**: Checkout routes functional, need Stripe configuration
**Impact**: BLOCKING REVENUE - Sites can't accept payments until this is done
**Priority**: HIGHEST - Do this before ANY other work

---

## 🎯 CURRENT SITUATION

### What's Working ✅
- Audio Intel checkout route: `/api/checkout` functional
- Pitch Generator checkout route: `/api/checkout` functional
- Pricing pages all correct and linked
- Email collection modals working
- ConvertKit integration ready (Audio Intel)
- Beta founder discount logic in place (50% off first year)

### What's Missing ❌
- **Stripe Secret Keys** - No payment processing possible
- **Stripe Price IDs** - Products not configured in Stripe
- **Environment Variables** - Not set in production
- **Webhook Configuration** - Subscription updates won't sync

### Revenue Impact
**Current**: £0/month (can't process payments)
**Potential**: £500-1,000/month within 14 days if Stripe is configured

---

## 📋 STRIPE SETUP CHECKLIST

### Step 1: Create Stripe Account (If Not Done)
1. Go to https://stripe.com
2. Sign up with business email (chris@totalaudiopromo.com)
3. Verify business details
4. Add bank account for payouts (UK bank account)
5. Enable test mode for initial testing

### Step 2: Create Products in Stripe Dashboard

#### Audio Intel Products

**Product 1: Audio Intel Professional**
- Name: "Audio Intel Professional"
- Description: "200 contact enrichments per month, priority processing, professional exports"
- Price: £19/month
- Billing period: Monthly
- Trial period: 14 days
- **Copy Price ID**: `price_xxxxxxxxxxxxx` (starts with "price_")

**Product 2: Audio Intel Agency**
- Name: "Audio Intel Agency"
- Description: "Unlimited enrichments, white-label branding, instant processing, priority support"
- Price: £79/month
- Billing period: Monthly
- Trial period: 14 days
- **Copy Price ID**: `price_xxxxxxxxxxxxx`

---

#### Pitch Generator Products

**Product 1: Pitch Generator PRO**
- Name: "Pitch Generator PRO"
- Description: "Unlimited AI pitches, voice profile customisation, priority support"
- Price: £12/month (Monthly)
- Price: £120/year (Annual - save 2 months)
- **Copy Monthly Price ID**: `price_xxxxxxxxxxxxx`
- **Copy Annual Price ID**: `price_xxxxxxxxxxxxx`

**Product 2: Complete Workflow Bundle**
- Name: "Complete Workflow Bundle"
- Description: "Intel + Pitch + Tracker - Complete promotion workflow"
- Price: £19/month (Monthly)
- Price: £190/year (Annual - save £38)
- **Copy Monthly Price ID**: `price_xxxxxxxxxxxxx`
- **Copy Annual Price ID**: `price_xxxxxxxxxxxxx`

**Product 3: Pitch Generator Agency**
- Name: "Pitch Generator Agency"
- Description: "Complete Bundle + bulk generation, white-label, team collaboration"
- Price: £79/month (Monthly)
- Price: £790/year (Annual)
- **Copy Monthly Price ID**: `price_xxxxxxxxxxxxx`
- **Copy Annual Price ID**: `price_xxxxxxxxxxxxx`

---

#### Tracker Products (Future - Not Urgent)

**Product 1: Tracker Professional**
- Name: "Tracker Professional"
- Description: "Unlimited campaigns, professional exports, priority support"
- Price: £19/month
- **Copy Price ID**: `price_xxxxxxxxxxxxx`

**Product 2: Tracker Agency**
- Name: "Tracker Agency"
- Description: "Multi-artist tracking, white-label, team collaboration"
- Price: £79/month
- **Copy Price ID**: `price_xxxxxxxxxxxxx`

---

### Step 3: Create Beta Founder Coupon

**Coupon Details**:
- Name: "Beta Founders Discount"
- Discount: 50% off
- Duration: 12 months
- Applies to: All products
- Coupon ID: `qa5J5GRN` (already hardcoded in Audio Intel)
- **Important**: Create this exact coupon ID in Stripe dashboard

**How to Create**:
1. Go to Stripe Dashboard → Products → Coupons
2. Click "Create coupon"
3. Enter coupon ID: `qa5J5GRN`
4. Percent off: 50%
5. Duration: "Repeating" - 12 months
6. Save

---

### Step 4: Get API Keys

1. Go to Stripe Dashboard → Developers → API Keys
2. Copy **Secret Key** (starts with `sk_test_` for test mode or `sk_live_` for live)
3. Copy **Publishable Key** (starts with `pk_test_` or `pk_live_`)

**IMPORTANT**:
- Start with **Test Mode** keys
- Test thoroughly on localhost
- Switch to **Live Mode** only when ready for real payments

---

## 🔧 ENVIRONMENT VARIABLE CONFIGURATION

### Audio Intel (`apps/audio-intel/.env.local`)

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Price IDs (copy from Stripe Dashboard after creating products)
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_xxxxxxxxxxxxx  # £19/month
STRIPE_PRICE_AGENCY_MONTHLY=price_xxxxxxxxxxxxx       # £79/month

# Trial Configuration (optional - defaults to 14 days)
STRIPE_TRIAL_DAYS_PROFESSIONAL=14
STRIPE_TRIAL_DAYS_AGENCY=14

# Beta Founder Coupon (already hardcoded, but can override)
STRIPE_BETA_FOUNDER_COUPON=qa5J5GRN

# Base URL (for Stripe redirects)
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Change to https://intel.totalaudiopromo.com in production

# ConvertKit (already configured, verify these exist)
KIT_API_KEY=your_convertkit_api_key
CONVERTKIT_API_KEY=your_convertkit_api_key
```

---

### Pitch Generator (`apps/pitch-generator/.env.local`)

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Price IDs for PRO tier
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_xxxxxxxxxxxxx  # £12/month
STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_xxxxxxxxxxxxx   # £120/year

# Price IDs for Bundle (most popular)
STRIPE_PRICE_BUNDLE_MONTHLY=price_xxxxxxxxxxxxx        # £19/month
STRIPE_PRICE_BUNDLE_ANNUAL=price_xxxxxxxxxxxxx         # £190/year

# Price IDs for Agency tier
STRIPE_PRICE_AGENCY_MONTHLY=price_xxxxxxxxxxxxx        # £79/month
STRIPE_PRICE_AGENCY_ANNUAL=price_xxxxxxxxxxxxx         # £790/year

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3004  # Change to https://pitch.totalaudiopromo.com in production
```

---

### Tracker (`apps/tracker/.env.local`)

**Note**: Tracker doesn't have Stripe integration yet (uses direct signup), but here's the structure for when you add it:

```bash
# Stripe Configuration (Future)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Price IDs
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_xxxxxxxxxxxxx  # £19/month
STRIPE_PRICE_AGENCY_MONTHLY=price_xxxxxxxxxxxxx        # £79/month

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3001  # Change to https://tracker.totalaudiopromo.com in production
```

---

## 🧪 TESTING CHECKLIST

### Test Mode Testing (Do This First)

#### Audio Intel Test Flow
1. Navigate to http://localhost:3000/pricing
2. Click "Skip The Queue Today" (Professional tier)
3. Enter test email: `test@example.com`
4. Click "Continue to Payment"
5. Should redirect to Stripe Checkout
6. Use test card: `4242 4242 4242 4242`
7. Expiry: Any future date (e.g., 12/25)
8. CVC: Any 3 digits (e.g., 123)
9. Complete checkout
10. Should redirect to `/success?session_id=xxx`
11. Check Stripe Dashboard → Customers (should see test@example.com)
12. Check trial end date (should be 14 days from now)
13. Check coupon applied (50% off for 12 months)

#### Pitch Generator Test Flow
1. Navigate to http://localhost:3004/pricing
2. Select "Complete Workflow Bundle" (£19/month)
3. Enter test email: `test2@example.com`
4. Click "Proceed to checkout"
5. Should redirect to Stripe Checkout
6. Complete with test card (4242 4242 4242 4242)
7. Verify successful redirect
8. Check Stripe Dashboard for subscription

---

### Stripe Test Cards

**Successful Payment**:
- Card: `4242 4242 4242 4242`
- Any future expiry, any CVC, any postal code

**Payment Requires Authentication (3D Secure)**:
- Card: `4000 0025 0000 3155`
- Will show authentication modal

**Payment Declined**:
- Card: `4000 0000 0000 9995`
- Will decline with "insufficient funds"

**More test cards**: https://stripe.com/docs/testing

---

## 🚀 PRODUCTION DEPLOYMENT

### Vercel Environment Variables

For each app, go to Vercel Dashboard → Project → Settings → Environment Variables

#### Audio Intel (intel.totalaudiopromo.com)

```bash
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_AGENCY_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_BETA_FOUNDER_COUPON=qa5J5GRN
NEXT_PUBLIC_BASE_URL=https://intel.totalaudiopromo.com
```

#### Pitch Generator (pitch.totalaudiopromo.com)

```bash
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_xxxxxxxxxxxxx
STRIPE_PRICE_BUNDLE_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_BUNDLE_ANNUAL=price_xxxxxxxxxxxxx
STRIPE_PRICE_AGENCY_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_AGENCY_ANNUAL=price_xxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=https://pitch.totalaudiopromo.com
```

---

## 🔔 WEBHOOK CONFIGURATION (After Going Live)

### Setup Stripe Webhooks
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://intel.totalaudiopromo.com/api/webhooks/stripe`
4. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy webhook signing secret (starts with `whsec_`)
6. Add to Vercel env: `STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx`

**Repeat for Pitch Generator**:
- Endpoint URL: `https://pitch.totalaudiopromo.com/api/webhooks/stripe`

---

## ⚠️ CRITICAL WARNINGS

### DO NOT Do This ❌
- **Don't** use live keys in development
- **Don't** commit API keys to git (they're in `.env.local` which is gitignored)
- **Don't** skip test mode testing
- **Don't** go live without beta founder coupon configured
- **Don't** forget to switch URLs from localhost to production

### DO Do This ✅
- **Do** test thoroughly with test cards in test mode
- **Do** verify trial periods work correctly (14 days)
- **Do** check beta founder discount applies automatically
- **Do** test both monthly and annual billing (Pitch Generator)
- **Do** verify redirect URLs work after checkout
- **Do** check Stripe Dashboard shows correct customer data

---

## 🎯 IMMEDIATE ACTION PLAN

### Today (Critical)
1. **Create Stripe account** (if not done)
2. **Create all products** in Stripe Dashboard
3. **Copy Price IDs** into `.env.local` files
4. **Create beta founder coupon** (`qa5J5GRN`)
5. **Test Audio Intel checkout** with test card
6. **Test Pitch Generator checkout** with test card

### Tomorrow (High Priority)
1. **Deploy to Vercel** with test keys
2. **Test on production URLs** (still test mode)
3. **Switch to live keys** in Vercel
4. **Create live products** in Stripe (live mode)
5. **Final test with real card** (your own, small amount)

### This Week (Medium Priority)
1. **Configure webhooks** for subscription updates
2. **Set up Stripe billing portal** (customer self-service)
3. **Create cancellation flow** (if not already done)
4. **Monitor first real payments**
5. **Track conversion rates** from pricing pages

---

## 📊 SUCCESS METRICS

### Revenue Targets (First 14 Days)
- **Goal**: 5-10 paying customers
- **Expected Revenue**: £100-300/month
- **Average Order Value**: £19/month (Professional tier most popular)

### Conversion Tracking
- **Pricing Page Views** → Track via analytics
- **Checkout Started** → Track via console logs
- **Checkout Completed** → Track via Stripe Dashboard
- **Trial to Paid Conversion** → Track after 14 days

### Key Indicators
- **Checkout abandonment rate** (target: <30%)
- **Trial start rate** (target: >50% of checkouts complete)
- **Trial to paid conversion** (target: >40% after 14 days)

---

## 🆘 TROUBLESHOOTING

### "Invalid priceId configured"
**Cause**: Environment variable not set or incorrect format
**Fix**: Check `.env.local` has correct `STRIPE_PRICE_xxx` variables

### "Stripe not configured in production"
**Cause**: `STRIPE_SECRET_KEY` not set in Vercel
**Fix**: Add to Vercel environment variables, redeploy

### "Checkout failed"
**Cause**: Various Stripe API errors
**Fix**: Check Vercel logs for specific error, verify API key validity

### Redirect to `/pricing` instead of Stripe
**Cause**: Checkout endpoint not receiving correct parameters
**Fix**: Check browser console for errors, verify email is provided

### Trial not showing in Stripe
**Cause**: Trial days not configured correctly
**Fix**: Check `STRIPE_TRIAL_DAYS_PROFESSIONAL` env var or remove to use defaults

---

## 🎯 BOTTOM LINE

**What You Need Right Now**:
1. Stripe account with products created
2. Price IDs copied into `.env.local` files
3. Beta founder coupon (`qa5J5GRN`) created in Stripe
4. Test mode testing complete
5. Production deployment with live keys

**Expected Time**:
- Stripe setup: 30 minutes
- Testing: 30 minutes
- Production deployment: 15 minutes
- **Total: ~75 minutes to start accepting payments**

**Revenue Impact**:
- Currently: £0/month (can't process payments)
- After setup: £100-300/month potential within 14 days
- After 3 months: £500-1,000/month with proper marketing

**CRITICAL**: This is THE revenue blocker. Everything else is secondary until payment processing works.

---

**Next Steps**:
1. Open Stripe Dashboard
2. Create products and copy Price IDs
3. Paste into `.env.local` files
4. Test checkout flow
5. Deploy to production
6. Start making money! 💰
