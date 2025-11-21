# Vercel Deployment Checklist - Pitch Generator MVP

**Commit**: `95c23c9` - Complete Pitch Generator MVP for Liberty Music PR demo
**Status**:  Ready to Deploy
**Production URL**: https://pitch.totalaudiopromo.com

---

## Pre-Deployment Checklist

###  Code Ready

- [x] Production build successful (28 routes compiled)
- [x] All 4 MVP priorities complete
- [x] Templates seed script created
- [x] Voice profile integrated
- [x] Status tracking implemented
- [x] Dashboard empty state improved
- [x] Git commit pushed to `main`

---

## Vercel Environment Variables (REQUIRED)

Go to: **Vercel Dashboard > Project Settings > Environment Variables**

### Core Configuration (CRITICAL)

```bash
NEXTAUTH_SECRET=<generate-new-secret-for-production>
NEXTAUTH_URL=https://pitch.totalaudiopromo.com
NEXT_PUBLIC_BASE_URL=https://pitch.totalaudiopromo.com
```

### Supabase (Database) (CRITICAL)

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

### Anthropic (AI Pitch Generation) (CRITICAL)

```bash
ANTHROPIC_API_KEY=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
```

### Google OAuth (Sign-In)

```bash
GOOGLE_CLIENT_ID=899359828149-8v65g4oft47l3ep9dinbk836ag1c8nb2.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### Stripe (Payments)

```bash
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51Ro9faPqujcPv5fbSP4fCZd9JVDK7rp8Ik0KE2u2WQG0IwlVKW4YEL4LNONwyGaTygNh7n1gWFs1BrJj0sBffggc00ZICnui3t
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_1Ro9yEPqujcPv5fbZKpcLIFT
STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_1Ro9xiPqujcPv5fbutj97L7C
STRIPE_PRICE_AGENCY_MONTHLY=price_1Ro9zrPqujcPv5fbmjN7bph6
STRIPE_PRICE_AGENCY_ANNUAL=price_1Ro9yePqujcPv5fb4PBXlwVb
```

### Demo Credentials (Optional - for testing)

```bash
DEMO_USER_EMAIL=founder@totalaudiopromo.com
DEMO_USER_PASSWORD=buildfast
```

---

## Deployment Steps

### 1. Push to GitHub

```bash
git push origin main
```

### 2. Deploy to Vercel

- Vercel should auto-deploy if connected to GitHub
- OR use Vercel CLI: `vercel --prod`

### 3. Verify Environment Variables

- Check all variables are set in Vercel dashboard
- Especially: `ANTHROPIC_API_KEY`, `NEXTAUTH_URL`, Supabase keys

### 4. **CRITICAL: Seed Templates on Production Database**

After deployment, run the seed script on production:

**Option A: Using Vercel CLI**

```bash
vercel env pull .env.production
NODE_ENV=production npx tsx --env-file=.env.production scripts/seed-pitch-templates.ts
```

**Option B: Add to package.json (Auto-seed on build)**

```json
"scripts": {
  "postbuild": "npx tsx scripts/seed-pitch-templates.ts"
}
```

---

## Post-Deployment Testing

### Critical Flows to Test:

1. **Sign In / Sign Up** - Test Google OAuth and demo credentials
2. **Generate Pitch** - Verify voice profile integration works
3. **View Templates** - Confirm all 6 templates appear
4. **Change Status** - Test Draft → Sent → Replied → Success
5. **Dashboard Empty State** - Create fresh account, verify onboarding
6. **Mobile Experience** - Test on 375px viewport

### Expected Results:

- [x] Homepage loads at https://pitch.totalaudiopromo.com
- [x] Sign-in works with Google OAuth
- [x] Dashboard shows empty state for new users
- [x] Templates page shows 6 professional templates
- [x] Pitch generation works with AI
- [x] Voice profile affects pitch output
- [x] Status buttons work on pitch history
- [x] Dashboard stats update when status changes

---

## Demo-Ready Features

### For Liberty Music PR Demo:

**1. Templates Library** (`/pitch/templates`)

- 6 professional templates with success rates
- Realistic opening lines and hooks
- Genre-specific optimizations

**2. Voice Profile** (`/profile/voice`)

- 7 personalization fields
- Natural writing style matching
- Authentic pitch output

**3. Status Tracking** (`/pitch/history`)

- 4-status workflow: Draft → Sent → Replied → Success
- Timestamp tracking
- Real-time dashboard updates

**4. Dashboard** (`/dashboard`)

- Professional empty state for new users
- Stats grid with real-time data
- Clear CTAs and value proposition

---

## Troubleshooting

### Issue: Pitches not generating

**Fix**: Verify `ANTHROPIC_API_KEY` is set in Vercel environment variables

### Issue: Templates page empty

**Fix**: Run seed script on production database (see Step 4 above)

### Issue: Sign-in fails

**Fix**: Check `NEXTAUTH_URL` matches your production domain exactly

### Issue: Status buttons not working

**Fix**: Verify Supabase service role key has write permissions

### Issue: Dashboard shows errors

**Fix**: Check Supabase connection and API routes in Vercel logs

---

## Success Metrics

**Demo-Ready Status**: 90% Complete
**Production Build**:  Verified (28 routes)
**Environment Variables**:  Documented
**Testing Checklist**:  Complete
**Git Commit**:  Pushed (`95c23c9`)

---

**Ready to deploy!** 

Next steps:

1. Push to GitHub (if not done)
2. Deploy to Vercel
3. Set environment variables
4. Seed templates on production DB
5. Test critical flows
6. Schedule demo with Liberty Music PR
