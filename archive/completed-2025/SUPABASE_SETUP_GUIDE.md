# Supabase Setup Guide - Total Audio Unified Auth

**Date**: October 2025
**Purpose**: Set up unified authentication across all Total Audio apps

## Prerequisites

- Supabase account (free tier works fine)
- Access to all Total Audio app repositories
- Terminal access for running migrations

## Step 1: Create Supabase Project

### Option A: Create New Project (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - **Name**: Total Audio Platform
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Europe West (London) - closest to UK market
   - **Pricing Plan**: Free (can upgrade later)
4. Wait 2-3 minutes for project creation

### Option B: Use Existing Project

If you already have a Supabase project for Audio Intel, you can use that one. Just run the new migrations to add the additional tables.

## Step 2: Get Your Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
3. Save them for the next step

## Step 3: Run Database Migrations

### Using Supabase SQL Editor (Easiest)

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/20251013000001_unified_auth_setup.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Wait for "Success" message

### Using Supabase CLI (Advanced)

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your_project_ref

# Run migrations
supabase db push
```

## Step 4: Verify Database Setup

In the Supabase dashboard:

1. Go to **Table Editor**
2. You should see these new tables:
   - `user_profiles`
   - `app_permissions`
   - `subscriptions`
3. Click on each table to verify the structure

## Step 5: Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email templates (optional but recommended):
   - Confirmation email
   - Magic link email
   - Password reset email

### Recommended Email Template Settings

**From Email**: noreply@totalaudiopromo.com (configure in **Settings** → **Auth**)

**Email Templates**:

- Use the default templates initially
- Customise later with your branding

## Step 6: Update Environment Variables

### For Audio Intel

Edit `apps/audio-intel/.env.local`:

```bash
# Add these lines (keep existing variables)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key_here
```

### For Command Centre

Edit `apps/command-centre/.env.local`:

```bash
# Add these lines (keep existing variables)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key_here
```

### For Tracker

Edit `apps/tracker/.env.local`:

```bash
# Add these lines (keep existing variables)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key_here
```

**IMPORTANT**: Use the SAME credentials for all apps!

## Step 7: Install Dependencies

From the root of the monorepo:

```bash
# Install all dependencies (including new auth package)
npm install

# Build the auth package
cd packages/auth
npm run build
cd ../..
```

## Step 8: Test Authentication Flow

### Test in Audio Intel

```bash
# Start Audio Intel
npm run dev:audio-intel

# Open browser to http://localhost:3000
# Try signing up with a test email
# Check Supabase dashboard for new user in auth.users table
# Verify user_profiles and app_permissions tables were populated
```

### Test in Command Centre

```bash
# Start Command Centre
cd apps/command-centre
npm run dev

# Open browser to http://localhost:3005
# Sign in with the same email you used in Audio Intel
# You should be signed in automatically (single sign-on!)
```

## Step 9: Configure Stripe Webhooks (For Subscriptions)

### Create Webhook Endpoint

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter URL: `https://intel.totalaudiopromo.com/api/webhooks/stripe`
5. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
6. Copy the **Signing secret** (starts with `whsec_`)

### Add Webhook Secret to Environment

```bash
# Add to apps/audio-intel/.env.local
STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret_here
```

## Step 10: Security Checklist

✅ Row Level Security (RLS) enabled on all tables
✅ Appropriate RLS policies created
✅ Service role reserved for webhooks only
✅ Email confirmation enabled (optional but recommended)
✅ Password requirements configured
✅ Rate limiting enabled in Supabase

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Double-check that both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in ALL app `.env.local` files.

### Issue: "User profile not created after signup"

**Solution**: Check that the `on_auth_user_created` trigger is working:

```sql
-- In Supabase SQL Editor
SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;
SELECT * FROM public.user_profiles ORDER BY created_at DESC LIMIT 5;
```

If users exist but profiles don't, manually run:

```sql
SELECT public.handle_new_user() FROM auth.users WHERE id NOT IN (SELECT id FROM public.user_profiles);
```

### Issue: "Can't access app after signup"

**Solution**: Check app permissions:

```sql
-- In Supabase SQL Editor
SELECT * FROM public.app_permissions WHERE user_id = 'user_id_here';
```

If no permissions exist, manually grant:

```sql
INSERT INTO public.app_permissions (user_id, app_name, has_access)
VALUES ('user_id_here', 'audio-intel', true);
```

### Issue: "Session not persisting across apps"

**Solution**:

1. Check that all apps use the SAME Supabase credentials
2. Clear browser cookies and try again
3. Verify middleware is set up correctly in each app

## Next Steps

1. ✅ Test single sign-on across all apps
2. ✅ Verify subscription tier changes update permissions
3. ✅ Test app access restrictions
4. ✅ Implement auth UI components in each app
5. ✅ Set up user profile pages
6. ✅ Test Stripe webhook integration

## Production Deployment

### Before Going Live

1. **Update email templates** with Total Audio branding
2. **Configure custom domain** for auth emails
3. **Set up monitoring** for auth failures
4. **Test subscription flows** end-to-end
5. **Enable MFA** (optional but recommended for agencies)
6. **Set up audit logging** for security compliance

### Environment Variables for Production

Add the same Supabase credentials to your production environment:

- Vercel: Add to each app's environment variables
- Make sure they're set to the same values across all apps

## Support

If you encounter issues:

1. Check the Supabase logs in **Logs** → **Auth**
2. Review the RLS policies in **Authentication** → **Policies**
3. Test SQL queries directly in the SQL Editor
4. Check the auth package README for API documentation

## Security Best Practices

- ✅ Never commit `.env.local` files to Git
- ✅ Use different credentials for development and production
- ✅ Rotate API keys regularly
- ✅ Monitor auth events in Supabase dashboard
- ✅ Keep Supabase and dependencies updated

---

**Last Updated**: October 2025
**Status**: Ready for Implementation
**Estimated Setup Time**: 30-45 minutes

Your unified authentication system is now ready! All Total Audio apps will share the same user database and authentication state.
