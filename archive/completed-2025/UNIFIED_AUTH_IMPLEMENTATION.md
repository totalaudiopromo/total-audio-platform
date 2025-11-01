# Unified Authentication Implementation Plan

**Date**: October 2025
**Status**: Ready to Implement
**Approach**: Option 1 - Shared Supabase Project (RECOMMENDED)

## 🎯 Business Benefits

- **Single Sign-On**: Users log in once, access all Total Audio apps
- **Bundle Pricing Support**: One subscription = access to multiple tools
- **Better UX**: Seamless switching between Audio Intel, Tracker, Pitch Generator
- **Simplified Management**: One user database, one auth system
- **Customer Acquisition**: Lower friction = better conversion rates

## 📐 Architecture Design

### 1. Shared Supabase Project

**One Supabase instance for all apps:**

- `NEXT_PUBLIC_SUPABASE_URL` (shared across all apps)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (shared across all apps)

### 2. Database Schema

```sql
-- Shared users table (managed by Supabase Auth)
-- auth.users table (default Supabase)

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free', -- free, pro, agency, bundle
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- App permissions (controls which apps users can access)
CREATE TABLE public.app_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL, -- 'audio-intel', 'tracker', 'pitch-generator'
  has_access BOOLEAN DEFAULT false,
  granted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription tracking
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL, -- active, cancelled, past_due
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- App-specific tables use prefixes:
-- audio_intel_enrichments
-- tracker_campaigns
-- pitch_generator_pitches
```

### 3. Shared Auth Package Structure

```
packages/
  auth/
    package.json
    tsconfig.json
    src/
      client.ts              # Browser-side auth client
      server.ts              # Server-side auth client
      middleware.ts          # Shared middleware
      hooks/
        useAuth.ts           # React hook for auth state
        useUser.ts           # React hook for user data
        usePermissions.ts    # React hook for app permissions
      types/
        index.ts             # TypeScript types
      utils/
        subscription.ts      # Subscription helpers
        permissions.ts       # Permission checking
```

## 🚀 Implementation Steps

### Phase 1: Create Shared Auth Package (30 minutes)

1. ✅ Create `packages/auth/` directory
2. ✅ Set up TypeScript configuration
3. ✅ Implement client/server auth utilities
4. ✅ Create React hooks for auth state
5. ✅ Add subscription and permission helpers

### Phase 2: Set Up Supabase (15 minutes)

1. ✅ Create Supabase project (or use existing)
2. ✅ Run database migrations
3. ✅ Configure Row Level Security (RLS)
4. ✅ Set up authentication providers
5. ✅ Get credentials for `.env` files

### Phase 3: Update Audio Intel (30 minutes)

1. ✅ Replace local Supabase code with shared package
2. ✅ Update `.env.local` with shared credentials
3. ✅ Implement unified auth UI
4. ✅ Update middleware for cross-app auth
5. ✅ Test authentication flow

### Phase 4: Update Command Centre (20 minutes)

1. ✅ Add Supabase dependencies
2. ✅ Integrate shared auth package
3. ✅ Update `.env.local` with shared credentials
4. ✅ Add auth pages (sign in, sign up)
5. ✅ Test authentication flow

### Phase 5: Update Tracker (20 minutes)

1. ✅ Replace local Supabase code with shared package
2. ✅ Update `.env.local` with shared credentials
3. ✅ Implement unified auth UI
4. ✅ Test authentication flow

### Phase 6: Testing & Validation (30 minutes)

1. ✅ Test single sign-on across apps
2. ✅ Verify session persistence
3. ✅ Test subscription tier access
4. ✅ Validate app permissions
5. ✅ Mobile testing for auth flows

## 📋 Subscription Tier to App Access Mapping

```typescript
const APP_ACCESS_MATRIX = {
  free: ['audio-intel'], // 10 enrichments/month
  pro: ['audio-intel'], // Unlimited enrichments
  agency: ['audio-intel'], // Unlimited + team features
  bundle: ['audio-intel', 'tracker', 'pitch-generator'], // All apps
};
```

## 🔒 Security Considerations

1. **Row Level Security (RLS)**: All tables have RLS policies
2. **Secure Cookies**: HttpOnly, Secure, SameSite=Lax
3. **Session Refresh**: Automatic token refresh in middleware
4. **Permission Checks**: Server-side validation for all protected routes
5. **Audit Logging**: Track auth events for security monitoring

## 🎨 User Experience Flow

### New User Sign Up

1. User signs up on any app (e.g., Audio Intel)
2. Account created in shared Supabase
3. Default `free` tier assigned
4. Can immediately access Audio Intel
5. Tool switcher shows all apps (with upgrade prompts for locked apps)

### Existing User Sign In

1. User signs in on any app
2. Session token stored in shared cookie
3. All apps recognize the session
4. User can switch between apps without re-authenticating
5. Subscription status controls app access

### Subscription Upgrade

1. User upgrades to Bundle plan
2. Stripe webhook updates subscription status
3. `app_permissions` table updated automatically
4. All apps immediately unlock for user
5. Tool switcher shows full access

## 📱 Mobile Considerations

- Auth pages optimised for mobile (already tested)
- Session persistence works across mobile browsers
- Touch-friendly auth UI components
- Fast auth checks (< 100ms)

## 🚀 Deployment Strategy

1. **Development**: Test locally across all apps
2. **Staging**: Deploy to Vercel preview branches
3. **Production**: Gradual rollout
   - Start with Command Centre (lower traffic)
   - Then Tracker
   - Finally Audio Intel (customer-facing)

## 📊 Success Metrics

- **Auth Speed**: < 2 seconds for sign in/up
- **Session Persistence**: 99.9% success rate
- **Cross-App Access**: Instant (< 100ms)
- **Mobile Auth UX**: Zero reported issues
- **Customer Satisfaction**: Improved switching experience

## 🔄 Migration Path (If Needed)

If Audio Intel already has users:

1. Export existing user data
2. Import to shared Supabase
3. Send password reset emails
4. Maintain backward compatibility during transition

---

**Next Action**: Begin Phase 1 - Create Shared Auth Package

This implementation will provide a solid foundation for the unified Total Audio platform while maintaining security and great user experience.
