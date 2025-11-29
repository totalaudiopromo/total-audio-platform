# Quick Environment Setup Guide - Campaign Tracker

## Critical: Missing Environment Variables

The application requires Supabase environment variables to function. Without them, you'll see a ZodError when trying to access any page.

---

## Step 1: Get Supabase Credentials

1. **Go to your Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select your project (or create a new one)

2. **Get Your Credentials**
   - Go to: **Settings**→ **API**
   - Copy these two values:
     - **Project URL**(e.g., `https://xxxxx.supabase.co`)
     - **anon/public key**(long string starting with `eyJ...`)

---

## Step 2: Create .env.local File

1. **Navigate to tracker directory:**

   ```bash
   cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/tracker
   ```

2. **Create .env.local file:**

   ```bash
   touch .env.local
   ```

3. **Add your Supabase credentials:**

   ```bash
   # Supabase Configuration (REQUIRED)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

   # Optional but recommended for full functionality
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # For AI features (if using Campaign Intelligence)
   ANTHROPIC_API_KEY=your-anthropic-key-here

   # For payments (if using Stripe)
   STRIPE_SECRET_KEY=your-stripe-secret-key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

4. **Save the file**

---

## Step 3: Restart Development Server

1. **Stop the current dev server**(Ctrl+C in terminal)

2. **Start it again:**

   ```bash
   npm run dev
   ```

3. **Verify it works:**
   - Visit: http://localhost:3000
   - You should see the landing page WITHOUT error overlay
   - Check browser console - no ZodError

---

## Step 4: Seed Demo Data (Optional but Recommended)

If you want Liberty demo data for testing:

1. **Create a user account first:**
   - Visit: http://localhost:3000/signup
   - Create an account
   - Note your user ID (from Supabase auth.users table)

2. **Run the seed script:**

   ```bash
   # Make sure env vars are set
   export NEXT_PUBLIC_SUPABASE_URL=your-url
   export NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

   # Run seed script
   npx ts-node scripts/seed-liberty-demo-data.ts
   ```

   Or manually run the SQL output in Supabase SQL Editor (the script will generate SQL for you).

---

## Step 5: Verify Everything Works

1. **Test Landing Page:**
   -  No error overlay
   -  Page loads completely
   -  Console has no red errors

2. **Test Authentication:**
   - Visit: http://localhost:3000/login
   - Should see login form (not error)
   - Try signing in with your account

3. **Test Dashboard:**
   - After login, should redirect to /dashboard
   - Should see campaign cards (if data seeded)
   - No console errors

---

## Troubleshooting

### Error: "ZodError: NEXT_PUBLIC_SUPABASE_URL is required"

**Solution:**Make sure `.env.local` file exists and has the correct variable names. Restart dev server after creating/editing the file.

### Error: "Invalid Supabase URL"

**Solution:**Check that your URL starts with `https://` and doesn't have trailing slashes.

### Error: "Invalid API key"

**Solution:**Make sure you copied the **anon/public**key, not the service_role key. The anon key is safe to use in client-side code.

### Page loads but shows "Failed to load campaigns"

**Solution:**

- Check database connection in Supabase dashboard
- Verify tables exist (campaigns, campaign_activities)
- Check RLS (Row Level Security) policies allow your user to read data

---

## Environment Variables Reference

### Required

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

### Optional (for full functionality)

- `SUPABASE_SERVICE_ROLE_KEY` - For admin operations (server-side only)
- `NEXT_PUBLIC_APP_URL` - Your app URL (defaults to http://localhost:3000)
- `ANTHROPIC_API_KEY` - For AI Campaign Intelligence features
- `STRIPE_SECRET_KEY` - For payment processing
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - For payment processing

---

## Next Steps After Setup

Once environment variables are configured:

1.  Run full browser test suite (see `BROWSER_TEST_REPORT.md`)
2.  Seed Liberty demo data
3.  Test all dashboard features
4.  Verify campaign detail pages work
5.  Test integration buttons (Pitch Generator, Audio Intel)
6.  Run through demo script

---

**Need Help?**Check `ENV_SETUP_INTEGRATIONS.md` for more detailed setup instructions.
