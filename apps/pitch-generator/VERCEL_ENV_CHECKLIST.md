# Vercel Environment Variables Checklist

**Production URL:** https://pitch.totalaudiopromo.com

##  Required Environment Variables

###  Authentication (NextAuth.js)

```bash
NEXTAUTH_SECRET=<random-secret-string>
NEXTAUTH_URL=https://pitch.totalaudiopromo.com

# Google OAuth (Optional but shown in UI)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Demo user credentials (for email/password login)
DEMO_USER_EMAIL=founder@totalaudiopromo.com
DEMO_USER_PASSWORD=buildfast
```

###  Supabase Database

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

###  AI Provider (Claude)

```bash
ANTHROPIC_API_KEY=<your-anthropic-api-key>
```

###  Stripe (Payment Processing)

```bash
STRIPE_SECRET_KEY=<your-stripe-secret-key>

# Stripe Price IDs for subscription plans
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_xxx
STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_xxx
STRIPE_PRICE_AGENCY_MONTHLY=price_xxx
STRIPE_PRICE_AGENCY_ANNUAL=price_xxx
```

###  Base URL

```bash
NEXT_PUBLIC_BASE_URL=https://pitch.totalaudiopromo.com
```

---

##  How to Verify in Vercel

### Via Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your `pitch-generator` project
3. Go to **Settings** → **Environment Variables**
4. Check that all the variables above are set for **Production** environment

### Via Vercel CLI:

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Pull environment variables
vercel env pull .env.production.local
```

---

##  Critical Variables for Production

### Minimum Required (site will work but features limited):

-  `NEXT_PUBLIC_SUPABASE_URL`
-  `NEXT_PUBLIC_SUPABASE_ANON_KEY`
-  `NEXTAUTH_SECRET`
-  `NEXTAUTH_URL`
-  `ANTHROPIC_API_KEY` (for pitch generation)

### For Full Functionality:

-  `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` (Google OAuth login)
-  `STRIPE_SECRET_KEY` + Price IDs (payment processing)
-  `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

---

##  Setting Variables in Vercel

```bash
# Via CLI
vercel env add ANTHROPIC_API_KEY production
# Then paste your key when prompted

# Or via dashboard
# Settings → Environment Variables → Add New
# Name: ANTHROPIC_API_KEY
# Value: sk-ant-xxx...
# Environment: Production
```

---

##  Test After Setting Variables

After adding/updating environment variables:

1. **Redeploy** - Vercel needs to rebuild for env vars to take effect
2. **Test the live site** - Try signing in, generating a pitch
3. **Check logs** - Vercel Dashboard → Deployments → View Function Logs

---

##  Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- All other variables are server-side only
- Changes require redeployment to take effect
- Use Vercel's encrypted storage - never commit secrets to git
