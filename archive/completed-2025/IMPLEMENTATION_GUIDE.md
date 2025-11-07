# Total Audio Unified Auth - Complete Implementation Guide

**Status**: Ready to Implement
**Estimated Time**: 2-3 hours
**Last Updated**: October 2025

## 🎯 What You're Building

A unified authentication system that allows users to sign in once and access all Total Audio apps:

- ✅ **Single Sign-On**: One login for all apps
- ✅ **Subscription Management**: Control access based on pricing tiers
- ✅ **Seamless Switching**: Move between apps without re-authenticating
- ✅ **Better UX**: Smooth customer experience = higher conversion rates

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] Supabase account (free tier is fine)
- [ ] Access to all Total Audio app code
- [ ] Environment file access for each app
- [ ] Terminal access for running commands
- [ ] ~2 hours of focused time

## 🚀 Implementation Phases

### Phase 1: Supabase Setup (30 minutes)

#### Step 1.1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: Total Audio Platform
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Europe West (London)
   - **Plan**: Free
4. Wait 2-3 minutes for setup

#### Step 1.2: Get Credentials

1. In your project, go to **Settings → API**
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGc...
   ```
3. Save them in a secure note (you'll need them multiple times)

#### Step 1.3: Run Database Migration

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Open `supabase/migrations/20251013000001_unified_auth_setup.sql`
4. Copy all contents and paste into SQL editor
5. Click **"Run"** (Cmd/Ctrl + Enter)
6. Verify "Success" message

#### Step 1.4: Verify Setup

1. Go to **Table Editor**
2. Confirm these tables exist:
   - `user_profiles`
   - `app_permissions`
   - `subscriptions`
3. Click each table to check structure

**✅ Phase 1 Complete** - Your database is ready!

---

### Phase 2: Update Environment Variables (10 minutes)

#### Step 2.1: Audio Intel

Edit `apps/audio-intel/.env.local`:

```bash
# Add these lines (keep existing variables)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
```

#### Step 2.2: Command Centre

Edit `apps/command-centre/.env.local`:

```bash
# Add these lines (keep existing variables)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
```

#### Step 2.3: Tracker

Edit `apps/tracker/.env.local`:

```bash
# Add these lines (keep existing variables)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
```

**CRITICAL**: Use the SAME credentials in all apps!

**✅ Phase 2 Complete** - All apps can now connect to Supabase!

---

### Phase 3: Install Dependencies (5 minutes)

```bash
# From monorepo root
cd /Users/chrisschofield/workspace/active/total-audio-platform

# Install dependencies for auth package
npm install

# Verify auth package built successfully
ls -la packages/auth/dist/
# You should see compiled .js and .d.ts files
```

If the build failed, run:

```bash
cd packages/auth
npm run build
cd ../..
```

**✅ Phase 3 Complete** - Auth package is ready!

---

### Phase 4: Implement in Audio Intel (45 minutes)

#### Step 4.1: Add Auth Dependency

Edit `apps/audio-intel/package.json`:

```json
{
  "dependencies": {
    "@total-audio/auth": "*"
    // ... other dependencies
  }
}
```

Run:

```bash
npm install
```

#### Step 4.2: Update Middleware

Replace `apps/audio-intel/middleware.ts`:

```typescript
import { createMiddleware } from '@total-audio/auth/middleware';

export const middleware = createMiddleware({
  protectedRoutes: ['/dashboard', '/enrichments', '/settings', '/profile'],
  authRoutes: ['/signin', '/signup', '/auth'],
  signInPath: '/signin',
  defaultRedirect: '/dashboard',
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

#### Step 4.3: Create Sign-In Page

Create `apps/audio-intel/app/signin/page.tsx`:

```typescript
import { SignInForm } from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignInForm />
    </div>
  );
}
```

#### Step 4.4: Create Sign-Up Page

Create `apps/audio-intel/app/signup/page.tsx`:

```typescript
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUpForm />
    </div>
  );
}
```

#### Step 4.5: Add Auth Components

```bash
# Copy example components
mkdir -p apps/audio-intel/components/auth
cp examples/auth-components/*.tsx apps/audio-intel/components/auth/
```

#### Step 4.6: Create Auth Callback Handler

Create `apps/audio-intel/app/auth/callback/route.ts`:

```typescript
import { createServerClient } from '@total-audio/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
```

#### Step 4.7: Add User Menu to Layout

Update `apps/audio-intel/app/layout.tsx`:

```typescript
import { UserMenu } from '@/components/auth/UserMenu';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1>Audio Intel</h1>
            <UserMenu />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

#### Step 4.8: Test Audio Intel Auth

```bash
# Start Audio Intel
npm run dev:audio-intel

# Open http://localhost:3000
# Try:
# 1. Navigate to /signup
# 2. Create an account
# 3. Check your email
# 4. Confirm email
# 5. Sign in at /signin
# 6. Check you can access /dashboard
```

**✅ Phase 4 Complete** - Audio Intel has authentication!

---

### Phase 5: Implement in Command Centre (30 minutes)

Follow the same steps as Phase 4, but for Command Centre:

1. Add `@total-audio/auth` dependency
2. Update middleware
3. Create sign-in/sign-up pages
4. Copy auth components
5. Add callback handler
6. Add user menu to layout

```bash
# Test Command Centre
cd apps/command-centre
npm run dev

# Open http://localhost:3005
# Sign in with the SAME email you used for Audio Intel
# You should be signed in automatically!
```

**✅ Phase 5 Complete** - Single sign-on is working!

---

### Phase 6: Implement in Tracker (30 minutes)

Follow the same steps as Phase 4 and 5, but for Tracker.

**✅ Phase 6 Complete** - All apps have unified auth!

---

### Phase 7: Test Cross-App Authentication (15 minutes)

#### Test Scenario 1: Single Sign-On

1. Sign in to Audio Intel
2. Open Tracker in a new tab
3. You should already be signed in! ✅

#### Test Scenario 2: App Access Control

1. Sign in with a free tier account
2. Try to access Tracker
3. You should see an upgrade prompt ✅

#### Test Scenario 3: Subscription Upgrade

1. In Supabase, go to **Table Editor → user_profiles**
2. Find your test user
3. Change `subscription_tier` from `free` to `bundle`
4. Refresh Tracker
5. You should now have access! ✅

#### Test Scenario 4: Sign Out

1. Sign out from Audio Intel
2. Check Tracker - you should be signed out there too ✅

**✅ Phase 7 Complete** - Everything works!

---

## 🎨 Customisation

### Update Branding

Edit the auth components to match your brand:

```typescript
// In SignInForm.tsx
<h2 className="text-2xl font-bold">
  Sign In to Total Audio
</h2>

// Update button colors from blue to your brand color
<button className="bg-amber-500 hover:bg-amber-600">
  Sign In
</button>
```

### Add Your Logo

```typescript
// In UserMenu.tsx or SignInForm.tsx
<img src="/logo.svg" alt="Total Audio" className="h-8" />
```

### Customise Email Templates

1. In Supabase, go to **Authentication → Email Templates**
2. Customise:
   - Confirmation email
   - Magic link email
   - Password reset email
3. Add your branding and copy

---

## 🔧 Stripe Integration

### Step 1: Create Webhook Endpoint

Create `apps/audio-intel/app/api/webhooks/stripe/route.ts`:

```typescript
import { createServerClient } from '@total-audio/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createServerClient();

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;

      // Update user profile tier based on subscription
      const customerId = subscription.customer as string;
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (profile) {
        // Determine tier from price ID
        const priceId = subscription.items.data[0].price.id;
        let tier = 'free';

        if (priceId.includes('bundle')) tier = 'bundle';
        else if (priceId.includes('agency')) tier = 'agency';
        else if (priceId.includes('professional')) tier = 'pro';

        await supabase
          .from('user_profiles')
          .update({ subscription_tier: tier })
          .eq('id', profile.id);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (profile) {
        await supabase
          .from('user_profiles')
          .update({ subscription_tier: 'free' })
          .eq('id', profile.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

### Step 2: Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://intel.totalaudiopromo.com/api/webhooks/stripe`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
5. Copy signing secret

### Step 3: Add to Environment

```bash
# apps/audio-intel/.env.local
STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret
```

---

## 🐛 Troubleshooting

### Issue: Can't sign in

**Check:**

1. Supabase credentials are correct in `.env.local`
2. Email confirmation is enabled in Supabase
3. User exists in `auth.users` table
4. Browser console for errors

### Issue: User profile not created

**Fix:**

```sql
-- In Supabase SQL Editor
SELECT public.handle_new_user()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles);
```

### Issue: No access to apps after sign-up

**Fix:**

```sql
-- Grant default access
INSERT INTO public.app_permissions (user_id, app_name, has_access)
VALUES ('user_id_here', 'audio-intel', true);
```

### Issue: Session not persisting

**Check:**

1. All apps use the SAME Supabase credentials
2. Clear browser cookies
3. Middleware is configured correctly

---

## 🎉 Success Checklist

- [ ] Database migration ran successfully
- [ ] All apps have Supabase credentials
- [ ] Auth package built successfully
- [ ] Can sign up in Audio Intel
- [ ] Can sign in to Audio Intel
- [ ] User menu shows in header
- [ ] Can access dashboard
- [ ] Signing in to one app signs into all apps
- [ ] Signing out of one app signs out of all apps
- [ ] Free tier users can't access Tracker
- [ ] Bundle tier users can access all apps
- [ ] Subscription tier changes update permissions

---

## 📚 Next Steps

1. **Customise the UI** to match your brand
2. **Test on mobile** to ensure responsive design
3. **Add password reset** functionality
4. **Implement profile editing**
5. **Set up production environment** with Vercel
6. **Enable MFA** for agency users (optional)
7. **Monitor auth events** in Supabase dashboard

---

## 🔒 Security Best Practices

- ✅ Never commit `.env.local` files
- ✅ Use different credentials for dev/prod
- ✅ Rotate API keys regularly
- ✅ Monitor failed auth attempts
- ✅ Keep dependencies updated
- ✅ Enable email confirmation in production
- ✅ Use HTTPS in production

---

## 📞 Support

If you get stuck:

1. Check the `SUPABASE_SETUP_GUIDE.md`
2. Review `packages/auth/README.md`
3. Check Supabase logs: **Logs → Auth**
4. Test SQL queries directly in SQL Editor
5. Review example components in `examples/auth-components/`

---

**Congratulations!** 🎉

You now have unified authentication across all Total Audio apps. Users can sign in once and seamlessly switch between apps based on their subscription tier.

This will significantly improve customer experience and make your bundle pricing more attractive!
