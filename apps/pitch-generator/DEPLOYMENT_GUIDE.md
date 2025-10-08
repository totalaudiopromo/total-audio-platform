# Pitch Generator - Production Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Database Setup (Supabase)
- [x] Supabase project created: `ucncbighzqudaszewjrv`
- [x] All tables created and migrations run
- [x] User authentication configured
- [ ] Row Level Security (RLS) policies configured (see below)

### 2. Stripe Configuration
- [x] Test products created (PRO £14/mo, AGENCY £49/mo)
- [ ] Live products created with same pricing
- [ ] Webhook endpoint configured
- [ ] Stripe keys added to production environment

### 3. AI Service
- [x] Anthropic API key configured
- [ ] Production API key with higher rate limits

## 🚀 Vercel Deployment Steps

### Step 1: Connect Repository
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select `apps/pitch-generator` as the root directory
4. Framework preset: Next.js
5. Build command: `npm run build`
6. Output directory: `.next`

### Step 2: Environment Variables
Add these to Vercel project settings:

#### NextAuth
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate-new-secret-for-production>
```

Generate new secret:
```bash
openssl rand -base64 32
```

#### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://ucncbighzqudaszewjrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

#### Anthropic Claude AI
```
ANTHROPIC_API_KEY=<your-production-api-key>
```

#### Stripe (Production Keys)
```
STRIPE_SECRET_KEY=sk_live_<your-live-secret-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_<your-live-publishable-key>
STRIPE_WEBHOOK_SECRET=whsec_<your-webhook-secret>

# Production Price IDs (create these in Stripe dashboard)
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_<live-pro-monthly-id>
STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_<live-pro-annual-id>
STRIPE_PRICE_AGENCY_MONTHLY=price_<live-agency-monthly-id>
STRIPE_PRICE_AGENCY_ANNUAL=price_<live-agency-annual-id>
```

#### App Configuration
```
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### Step 3: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Test the deployment

## 🔒 Supabase Row Level Security (RLS)

Run these SQL commands in Supabase SQL Editor to secure your tables:

### Enable RLS on all tables
```sql
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitch_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pitch_settings ENABLE ROW LEVEL SECURITY;
```

### Contacts table policies
```sql
-- Users can only see their own contacts
CREATE POLICY "Users can view own contacts" ON contacts
  FOR SELECT USING (auth.uid()::text = user_id OR user_id = current_user);

-- Users can insert their own contacts
CREATE POLICY "Users can insert own contacts" ON contacts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id = current_user);

-- Users can update their own contacts
CREATE POLICY "Users can update own contacts" ON contacts
  FOR UPDATE USING (auth.uid()::text = user_id OR user_id = current_user);

-- Users can delete their own contacts
CREATE POLICY "Users can delete own contacts" ON contacts
  FOR DELETE USING (auth.uid()::text = user_id OR user_id = current_user);
```

### Pitches table policies
```sql
-- Users can only see their own pitches
CREATE POLICY "Users can view own pitches" ON pitches
  FOR SELECT USING (auth.uid()::text = user_id OR user_id = current_user);

-- Users can insert their own pitches
CREATE POLICY "Users can insert own pitches" ON pitches
  FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id = current_user);

-- Users can update their own pitches
CREATE POLICY "Users can update own pitches" ON pitches
  FOR UPDATE USING (auth.uid()::text = user_id OR user_id = current_user);

-- Users can delete their own pitches
CREATE POLICY "Users can delete own pitches" ON pitches
  FOR DELETE USING (auth.uid()::text = user_id OR user_id = current_user);
```

### User settings policies
```sql
-- Users can only see their own settings
CREATE POLICY "Users can view own settings" ON user_pitch_settings
  FOR SELECT USING (auth.uid()::text = user_id OR user_id = current_user);

-- Users can insert their own settings
CREATE POLICY "Users can insert own settings" ON user_pitch_settings
  FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id = current_user);

-- Users can update their own settings
CREATE POLICY "Users can update own settings" ON user_pitch_settings
  FOR UPDATE USING (auth.uid()::text = user_id OR user_id = current_user);
```

## 🎯 Stripe Webhook Setup

### 1. Create Webhook Endpoint in Stripe
1. Go to https://dashboard.stripe.com/webhooks
2. Click "+ Add endpoint"
3. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret
6. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### 2. Create Production Products
Follow the same process as test mode:

**PRO Tier:**
- Name: "Pitch Generator PRO"
- Price: £14/month recurring
- Copy the price ID to `STRIPE_PRICE_PROFESSIONAL_MONTHLY`

**AGENCY Tier:**
- Name: "Pitch Generator AGENCY"
- Price: £49/month recurring
- Copy the price ID to `STRIPE_PRICE_AGENCY_MONTHLY`

## 🧪 Post-Deployment Testing

Test these user flows:

1. **Authentication**
   - [ ] Sign up new account
   - [ ] Sign in with existing account
   - [ ] Sign out

2. **Contact Management**
   - [ ] Add new contact
   - [ ] View contacts list
   - [ ] Edit contact
   - [ ] Delete contact

3. **Pitch Generation**
   - [ ] Generate pitch with contact
   - [ ] Review generated pitch
   - [ ] Edit pitch body
   - [ ] Copy to clipboard
   - [ ] View pitch history

4. **Pricing & Checkout**
   - [ ] View pricing page
   - [ ] Select PRO plan
   - [ ] Complete Stripe checkout
   - [ ] Verify subscription in Stripe dashboard
   - [ ] Confirm user access updated

5. **Dashboard**
   - [ ] View stats
   - [ ] View recent pitches
   - [ ] Navigation works correctly

## 📊 Monitoring

### Vercel Analytics
- Automatically enabled for all deployments
- View at https://vercel.com/your-project/analytics

### Supabase Logs
- View at https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/logs

### Stripe Dashboard
- Monitor payments at https://dashboard.stripe.com/payments
- Track subscriptions at https://dashboard.stripe.com/subscriptions

## 🔧 Common Issues

### Issue: "Invalid Stripe configuration"
**Solution**: Verify all 6 Stripe environment variables are set correctly in Vercel

### Issue: "Contact not found" errors
**Solution**: Check RLS policies are correctly configured in Supabase

### Issue: Pitch generation fails
**Solution**:
1. Check Anthropic API key is valid
2. Verify rate limits haven't been exceeded
3. Check server logs in Vercel

### Issue: Webhook not receiving events
**Solution**:
1. Verify webhook URL in Stripe dashboard
2. Check webhook secret matches Vercel environment variable
3. Test webhook with Stripe CLI: `stripe trigger checkout.session.completed`

## 🎉 Launch Ready

Once all checklist items are complete:
1. ✅ Update DNS to point to Vercel deployment
2. ✅ Enable custom domain in Vercel
3. ✅ Test all flows with real card (Stripe test mode)
4. ✅ Switch to live Stripe keys
5. ✅ Announce launch! 🚀

## 📝 Production Stripe Products

You'll need to create these in live mode (same as test):

```bash
# PRO Product (£14/month)
curl https://api.stripe.com/v1/products \
  -u YOUR_LIVE_SECRET_KEY: \
  -d name="Pitch Generator PRO" \
  -d description="Unlimited AI-powered pitch generation"

# PRO Monthly Price
curl https://api.stripe.com/v1/prices \
  -u YOUR_LIVE_SECRET_KEY: \
  -d product="prod_xxx" \
  -d unit_amount=1400 \
  -d currency=gbp \
  -d "recurring[interval]"=month

# AGENCY Product (£49/month)
curl https://api.stripe.com/v1/products \
  -u YOUR_LIVE_SECRET_KEY: \
  -d name="Pitch Generator AGENCY" \
  -d description="Unlimited pitch generation with team features"

# AGENCY Monthly Price
curl https://api.stripe.com/v1/prices \
  -u YOUR_LIVE_SECRET_KEY: \
  -d product="prod_xxx" \
  -d unit_amount=4900 \
  -d currency=gbp \
  -d "recurring[interval]"=month
```
