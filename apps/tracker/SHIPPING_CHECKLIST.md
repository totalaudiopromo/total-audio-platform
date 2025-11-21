#  TRACKER - SHIPPING CHECKLIST

**Target**: Ship to production tonight
**Timeline**: 2-3 hours total
**Domain**: tracker.totalaudiopromo.com

---

##  COMPLETED TONIGHT

- [x] **Stripe keys added** to .env.local (LIVE keys ready)
- [x] **Export button** added to dashboard
- [x] **Loading states** confirmed working on forms
- [x] **Seed data script** created for demo campaigns
- [x] **Database migration** review complete (010_tracker_prd_schema.sql is latest)

---

##  CRITICAL PATH (Must do before deploy)

### 1. Database Setup (30 minutes)

**A. Apply Latest Migration**

```bash
# Connect to Supabase and run:
# File: supabase/migrations/010_tracker_prd_schema.sql

# Via Supabase Dashboard:
# 1. Go to: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/sql/new
# 2. Copy entire contents of 010_tracker_prd_schema.sql
# 3. Click "Run"
# 4. Verify: SELECT * FROM benchmarks LIMIT 5;
```

**B. Disable Email Confirmation (CRITICAL)**

```bash
# 1. Go to: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/auth/providers
# 2. Click "Email" provider
# 3. Find "Confirm email" toggle
# 4. Turn it OFF
# 5. Save changes
```

**C. Create Test Account**

```bash
# 1. Visit http://localhost:3004/signup
# 2. Create: test@tracker.com / TestPass123!
# 3. Should auto-login (no email confirmation needed)
# 4. Verify dashboard loads
```

**D. Add Demo Data (Optional but recommended)**

```bash
# Run the seed script to create example campaigns
# This will show off intelligence features

# Via Supabase SQL Editor:
# Copy the INSERT statements from scripts/seed-demo-data.ts
# Replace YOUR_USER_ID with actual user ID from auth.users table
```

---

### 2. Local Testing (20 minutes)

**A. Test Core Flows**

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/tracker
npm run dev
```

- [ ] **Sign up** works (no email confirmation needed)
- [ ] **Dashboard** loads with empty state
- [ ] **Create campaign** works
  - Fill in: name, platform, genre, budget, dates, reach
  - Click "Create Campaign"
  - Verify appears in list
- [ ] **Intelligence shows** (if platform + genre match benchmarks)
  - Should see "X% above/below average"
  - Should see cost per result comparison
- [ ] **Edit campaign** works
- [ ] **Delete campaign** works
- [ ] **Export CSV** works
- [ ] **Sign out** works
- [ ] **Sign in** works with existing account

**B. Test Payment Flow (Optional - can test in production)**

```bash
# If you want to test Stripe locally:
# 1. Use test card: 4242 4242 4242 4242
# 2. Any future expiry date
# 3. Any CVC
# Note: Using LIVE keys so this will create real subscription
```

---

### 3. Production Build Test (10 minutes)

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/tracker

# Build for production
npm run build

# Should complete with no errors
# Look for: " Compiled successfully"
```

**Common build issues to watch for**:

- TypeScript errors → Fix types
- Missing dependencies → npm install
- Environment variables → Check .env.local
- Tailwind issues → Already fixed with v4

---

### 4. Vercel Deployment (45 minutes)

**A. Prepare Environment Variables**

Create `.env.production` file with:

```bash
# === Production URLs ===
NEXT_PUBLIC_BASE_URL=https://tracker.totalaudiopromo.com
NEXT_PUBLIC_APP_URL=https://tracker.totalaudiopromo.com

# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://ucncbighzqudaszewjrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmNiaWdoenF1ZGFzemV3anJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTU2MjEsImV4cCI6MjA3NDQ5MTYyMX0.byAFslDRcX_Peto69Z7jG90CoWnQRaqNGOzhxteAgCI

# === Stripe (LIVE KEYS) ===
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51Ro9faPqujcPv5fbSP4fCZd9JVDK7rp8Ik0KE2u2WQG0IwlVKW4YEL4LNONwyGaTygNh7n1gWFs1BrJj0sBffggc00ZICnui3t

# === Airtable (Optional) ===
AIRTABLE_API_KEY=patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1
AIRTABLE_BASE_ID=appx7uTQWRH8cIC20
```

**B. Push to GitHub**

```bash
git add .
git commit -m "feat: Tracker ready for production deployment

- Added Stripe LIVE keys for payments
- Implemented export CSV functionality
- Database migrations ready (010_tracker_prd_schema.sql)
- Seed data scripts for demo campaigns
- Loading states on all forms
- Professional brutalist design matching Audio Intel

Ship status: READY FOR PRODUCTION "

git push origin main
```

**C. Deploy on Vercel**

1. **Go to**: https://vercel.com/dashboard
2. **Click**: "Add New Project"
3. **Import Git Repository**:
   - Repository: `total-audio-platform`
   - Root Directory: `apps/tracker`
4. **Framework Preset**: Next.js (auto-detected)
5. **Build Command**: `npm run build`
6. **Output Directory**: `.next`
7. **Install Command**: `npm install`

8. **Environment Variables** (Add all from .env.production above)

9. **Deploy**

**D. Configure Custom Domain**

1. **In Vercel Project Settings**:
   - Go to "Domains"
   - Add: `tracker.totalaudiopromo.com`

2. **In Your DNS Provider** (wherever totalaudiopromo.com is hosted):
   - Type: `CNAME`
   - Name: `tracker`
   - Value: `cname.vercel-dns.com`
   - TTL: `Auto` or `3600`

3. **Wait for DNS** (5-15 minutes)

4. **Verify SSL** (auto-issued by Vercel)

---

### 5. Production Testing (15 minutes)

**Once deployed to tracker.totalaudiopromo.com**:

- [ ] **Homepage** loads correctly
- [ ] **Sign up** creates account
- [ ] **Dashboard** shows empty state
- [ ] **Create campaign** works
- [ ] **Intelligence features** show benchmarks
- [ ] **Export CSV** downloads file
- [ ] **Stripe checkout** redirects correctly
- [ ] **Mobile responsive** (test on phone)

---

### 6. Post-Launch Setup (30 minutes)

**A. Stripe Webhook Configuration**

1. **Go to**: https://dashboard.stripe.com/webhooks
2. **Add endpoint**:
   - URL: `https://tracker.totalaudiopromo.com/api/stripe/webhook`
   - Events: Select all `customer.subscription.*` events
3. **Copy signing secret** (starts with `whsec_`)
4. **Add to Vercel** environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
5. **Redeploy** to apply webhook secret

**B. Update Audio Intel Cross-Links**

Add "Try Tracker" link to Audio Intel:

- apps/audio-intel/app/page.tsx footer
- "Complete your campaign workflow" messaging

**C. Social Media Announcement**

Tweet/Post:

```
 NEW: Tracker by Total Audio Promo

Stop wasting 15 hours/week tracking campaigns in spreadsheets.

 AI-powered intelligence
 Industry benchmarks (BBC, Spotify, etc.)
 Pattern recognition
 Built for UK artists & promoters

FREE to start, £19/month for unlimited.

tracker.totalaudiopromo.com
```

---

##  FINAL CHECKLIST SUMMARY

**Before deploying**:

- [ ] Database migration applied (010_tracker_prd_schema.sql)
- [ ] Email confirmation disabled in Supabase
- [ ] Local testing complete (sign up → create → intelligence → export)
- [ ] Production build successful (`npm run build`)
- [ ] GitHub repo pushed with latest code

**During deployment**:

- [ ] Vercel project created
- [ ] Root directory set to `apps/tracker`
- [ ] All environment variables added
- [ ] Custom domain configured (tracker.totalaudiopromo.com)
- [ ] DNS CNAME record added

**After deployment**:

- [ ] Production site loads (tracker.totalaudiopromo.com)
- [ ] Sign up flow works
- [ ] Campaigns creation works
- [ ] Intelligence features show
- [ ] Stripe webhook configured
- [ ] Mobile testing complete
- [ ] Social announcement ready

---

##  SUCCESS CRITERIA

**READY TO SHIP when**:
 Local testing passes all flows
 Production build completes without errors
 Deployed to tracker.totalaudiopromo.com
 Can create account and campaign
 Intelligence shows benchmark comparisons
 Export CSV works
 Stripe checkout redirects (payment can be tested with first customer)

**READY FOR CUSTOMERS when**:
 All above + Stripe webhook configured
 Cross-linking with Audio Intel complete
 Social announcement posted
 Demo campaigns seeded for new users to explore

---

##  ROLLBACK PLAN

If something breaks in production:

1. **Vercel Dashboard** → Click "Rollback to previous deployment"
2. **Or**: Update environment variable and redeploy
3. **Or**: Fix code locally, commit, auto-deploys

Vercel keeps all previous deployments, can rollback instantly.

---

##  POST-LAUNCH

**Week 1**:

- Monitor Vercel analytics for errors
- Check Stripe dashboard for payment issues
- Collect user feedback
- Fix any critical bugs

**Week 2**:

- Add missing "nice-to-have" features
- Implement activity logging
- Create automated insights
- Build agency features if demand

**Month 1 Goal**: 10 paying customers @ £19/month = £190 MRR

---

**Built by**: Chris + Claude
**Status**: READY TO SHIP 
**Time to production**: ~3 hours if following this checklist

Let's go! 
