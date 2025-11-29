# Vercel Environment Variables - Copy These Names

Copy these variable names and add them to Vercel with values from your vault.

## Required for Core Functionality

### Authentication (NextAuth)

```
NEXTAUTH_SECRET
NEXTAUTH_URL
```

**Value for NEXTAUTH_URL:**`https://pitch.totalaudiopromo.com`

### Supabase Database

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### AI Provider (Anthropic/Claude) - CRITICAL for pitch generation

```
ANTHROPIC_API_KEY
```

### Base URL

```
NEXT_PUBLIC_BASE_URL
```

**Value:**`https://pitch.totalaudiopromo.com`

---

## Optional but Recommended

### Google OAuth (for Google sign-in)

```
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

### Demo User Credentials (for email/password login)

```
DEMO_USER_EMAIL
DEMO_USER_PASSWORD
```

**Suggested values:**

- Email: `founder@totalaudiopromo.com`
- Password: `buildfast` (or your preferred password)

### Stripe Payment Processing

```
STRIPE_SECRET_KEY
STRIPE_PRICE_PROFESSIONAL_MONTHLY
STRIPE_PRICE_PROFESSIONAL_ANNUAL
STRIPE_PRICE_AGENCY_MONTHLY
STRIPE_PRICE_AGENCY_ANNUAL
```

---

## Copy-Paste Format for Vercel CLI

If you want to use Vercel CLI to add them all at once:

```bash
# Critical
NEXTAUTH_SECRET=<from-vault>
NEXTAUTH_URL=https://pitch.totalaudiopromo.com
NEXT_PUBLIC_SUPABASE_URL=<from-vault>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-vault>
SUPABASE_SERVICE_ROLE_KEY=<from-vault>
ANTHROPIC_API_KEY=<from-vault>
NEXT_PUBLIC_BASE_URL=https://pitch.totalaudiopromo.com

# Optional
GOOGLE_CLIENT_ID=<from-vault>
GOOGLE_CLIENT_SECRET=<from-vault>
DEMO_USER_EMAIL=founder@totalaudiopromo.com
DEMO_USER_PASSWORD=buildfast
STRIPE_SECRET_KEY=<from-vault>
STRIPE_PRICE_PROFESSIONAL_MONTHLY=<from-vault>
STRIPE_PRICE_PROFESSIONAL_ANNUAL=<from-vault>
STRIPE_PRICE_AGENCY_MONTHLY=<from-vault>
STRIPE_PRICE_AGENCY_ANNUAL=<from-vault>
```

---

## Priority Order

**Add these first (site won't work without them):**

1.  `ANTHROPIC_API_KEY` - For AI pitch generation
2.  `NEXT_PUBLIC_SUPABASE_URL`
3.  `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4.  `SUPABASE_SERVICE_ROLE_KEY`
5.  `NEXTAUTH_SECRET`
6.  `NEXTAUTH_URL` = `https://pitch.totalaudiopromo.com`

**Add these second (for full functionality):**7. `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` (Google OAuth) 8. `DEMO_USER_EMAIL` + `DEMO_USER_PASSWORD` (Demo login) 9. `NEXT_PUBLIC_BASE_URL` = `https://pitch.totalaudiopromo.com`

**Add these last (for payments):**10. `STRIPE_SECRET_KEY` 11. `STRIPE_PRICE_*` (all 4 price IDs)

---

## How to Add in Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your `pitch-generator` project
3. Go to: **Settings**→ **Environment Variables**
4. For each variable:
   - Click **Add New**
   - Paste variable name
   - Paste value from your vault
   - Select environment: **Production**(and Preview + Development if you want)
   - Click **Save**
5. After adding all variables, go to **Deployments**→ **Redeploy**

---

## Check Your Vault For These Keys

Look for entries named like:

- `total-audio-supabase-url`
- `total-audio-supabase-anon-key`
- `total-audio-supabase-service-key`
- `anthropic-api-key` or `claude-api-key`
- `nextauth-secret`
- `google-oauth-client-id`
- `google-oauth-client-secret`
- `stripe-secret-key`
- `stripe-price-professional-monthly`
- `stripe-price-professional-annual`
- `stripe-price-agency-monthly`
- `stripe-price-agency-annual`

---

## After Adding

1. **Redeploy**in Vercel (required for changes to take effect)
2. Test the site: https://pitch.totalaudiopromo.com
3. Try signing in and generating a pitch
4. Check Vercel function logs for any errors
