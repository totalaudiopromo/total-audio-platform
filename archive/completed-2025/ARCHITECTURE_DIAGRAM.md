# Total Audio Unified Auth - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SUPABASE (Single Project)                     │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     Authentication Layer                      │  │
│  │                                                               │  │
│  │  ┌────────────┐    ┌────────────┐    ┌────────────┐        │  │
│  │  │ auth.users │───▶│   user_    │───▶│    app_    │        │  │
│  │  │ (Supabase) │    │  profiles  │    │ permissions│        │  │
│  │  └────────────┘    └────────────┘    └────────────┘        │  │
│  │                           │                                  │  │
│  │                           ▼                                  │  │
│  │                    ┌────────────┐                           │  │
│  │                    │subscriptions│                          │  │
│  │                    └─────┬──────┘                           │  │
│  │                          │                                  │  │
│  └──────────────────────────┼───────────────────────────────────┘  │
│                             │                                       │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                              │ Stripe Webhooks
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         │                    │                    │
    ┌────▼─────┐         ┌───▼──────┐       ┌────▼─────┐
    │  Audio   │         │ Command  │       │ Tracker  │
    │  Intel   │         │  Centre  │       │          │
    │          │         │          │       │          │
    │  Port    │         │  Port    │       │  Port    │
    │  :3000   │         │  :3005   │       │  :3001   │
    └──────────┘         └──────────┘       └──────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                    @total-audio/auth
                   (Shared Auth Package)
```

## Authentication Flow

### 1. User Sign-Up

```
User                  App              Supabase           Database
  │                    │                   │                 │
  │  Fill Sign-Up Form │                   │                 │
  ├───────────────────▶│                   │                 │
  │                    │  createUser()     │                 │
  │                    ├──────────────────▶│                 │
  │                    │                   │  INSERT INTO    │
  │                    │                   │  auth.users     │
  │                    │                   ├────────────────▶│
  │                    │                   │                 │
  │                    │                   │  TRIGGER:       │
  │                    │                   │  create_profile │
  │                    │                   │◀────────────────│
  │                    │                   │                 │
  │                    │                   │  INSERT INTO    │
  │                    │                   │  user_profiles  │
  │                    │                   ├────────────────▶│
  │                    │                   │                 │
  │                    │                   │  INSERT INTO    │
  │                    │                   │  app_permissions│
  │                    │                   ├────────────────▶│
  │                    │                   │                 │
  │  Confirmation Email│◀──────────────────│                 │
  │◀───────────────────│                   │                 │
  │                    │                   │                 │
```

### 2. Cross-App Sign-In

```
User                Audio Intel      Supabase         Command Centre
  │                      │               │                   │
  │  Sign In             │               │                   │
  ├─────────────────────▶│               │                   │
  │                      │  signIn()     │                   │
  │                      ├──────────────▶│                   │
  │                      │               │                   │
  │                      │  Set Cookie   │                   │
  │◀─────────────────────┤               │                   │
  │  (sb-auth-token)     │               │                   │
  │                      │               │                   │
  │  Open Command Centre │               │                   │
  ├──────────────────────┼───────────────┼──────────────────▶│
  │                      │               │                   │
  │                      │               │  Read Cookie      │
  │                      │               │◀──────────────────│
  │                      │               │                   │
  │                      │               │  getUser()        │
  │                      │               ├──────────────────▶│
  │                      │               │                   │
  │  Already Signed In!  │               │                   │
  │◀─────────────────────┴───────────────┴───────────────────┤
  │                                                          │
```

### 3. Subscription Upgrade

```
User             Stripe         Webhook Handler    Database
  │                 │                  │              │
  │  Upgrade Plan   │                  │              │
  ├────────────────▶│                  │              │
  │                 │                  │              │
  │  Payment OK     │                  │              │
  │◀────────────────│                  │              │
  │                 │                  │              │
  │                 │  Webhook Event   │              │
  │                 ├─────────────────▶│              │
  │                 │                  │              │
  │                 │                  │  UPDATE      │
  │                 │                  │  subscription│
  │                 │                  │  _tier       │
  │                 │                  ├─────────────▶│
  │                 │                  │              │
  │                 │                  │  TRIGGER:    │
  │                 │                  │  update_     │
  │                 │                  │  permissions │
  │                 │                  │◀─────────────│
  │                 │                  │              │
  │                 │                  │  UPDATE      │
  │                 │                  │  app_        │
  │                 │                  │  permissions │
  │                 │                  ├─────────────▶│
  │                 │                  │              │
  │  Access Granted │                  │              │
  │◀────────────────┴──────────────────┴──────────────│
  │                                                   │
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                       auth.users                             │
│  (Managed by Supabase Auth)                                 │
│                                                              │
│  • id (uuid, PK)                                            │
│  • email (text)                                             │
│  • encrypted_password (text)                                │
│  • email_confirmed_at (timestamptz)                         │
│  • created_at (timestamptz)                                 │
│  • updated_at (timestamptz)                                 │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ 1:1
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    user_profiles                             │
│  (Extended user data)                                        │
│                                                              │
│  • id (uuid, PK, FK → auth.users.id)                       │
│  • email (text, unique)                                     │
│  • full_name (text)                                         │
│  • subscription_tier (text) ─── 'free', 'pro',             │
│  • stripe_customer_id (text)     'agency', 'bundle'         │
│  • created_at (timestamptz)                                 │
│  • updated_at (timestamptz)                                 │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ 1:N
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   app_permissions                            │
│  (Controls which apps users can access)                     │
│                                                              │
│  • id (uuid, PK)                                            │
│  • user_id (uuid, FK → auth.users.id)                      │
│  • app_name (text) ──── 'audio-intel', 'tracker',          │
│  • has_access (boolean)  'pitch-generator', 'command-centre'│
│  • granted_at (timestamptz)                                 │
│                                                              │
│  UNIQUE (user_id, app_name)                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    subscriptions                             │
│  (Tracks Stripe subscriptions)                              │
│                                                              │
│  • id (uuid, PK)                                            │
│  • user_id (uuid, FK → auth.users.id)                      │
│  • stripe_subscription_id (text, unique)                    │
│  • status (text) ──── 'active', 'cancelled', 'past_due',   │
│  • plan_id (text)      'trialing', etc.                     │
│  • plan_name (text)                                         │
│  • current_period_end (timestamptz)                         │
│  • created_at (timestamptz)                                 │
│  • updated_at (timestamptz)                                 │
└─────────────────────────────────────────────────────────────┘
```

## Package Structure

```
@total-audio/auth
├── src/
│   ├── client.ts              # Browser Supabase client
│   ├── server.ts              # Server Supabase client
│   ├── middleware.ts          # Next.js middleware
│   │
│   ├── hooks/
│   │   ├── useAuth.ts         # Main auth hook
│   │   ├── useUser.ts         # User profile hook
│   │   └── usePermissions.ts  # Permission checking hook
│   │
│   ├── types/
│   │   ├── index.ts           # Shared types
│   │   └── database.ts        # Database types
│   │
│   └── utils/
│       ├── permissions.ts     # Permission helpers
│       └── subscription.ts    # Subscription helpers
│
└── dist/                      # Compiled output
    ├── index.js
    ├── index.d.ts
    └── ...
```

## Component Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        App Layout                            │
│                                                              │
│  ┌────────────┐                                             │
│  │ UserMenu   │◀──── useAuth() hook                         │
│  └────────────┘      (from @total-audio/auth)               │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Main Content                       │   │
│  │                                                      │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │       AppAccessGate                         │    │   │
│  │  │       (checks subscription tier)            │    │   │
│  │  │                                             │    │   │
│  │  │  usePermissions() → checkAccess(app_name)  │    │   │
│  │  │                                             │    │   │
│  │  │  ┌──────────────────────────────────────┐ │    │   │
│  │  │  │  Has Access?                          │ │    │   │
│  │  │  │                                       │ │    │   │
│  │  │  │  ✅ YES → Show app content           │ │    │   │
│  │  │  │  ❌ NO  → Show upgrade prompt        │ │    │   │
│  │  │  └──────────────────────────────────────┘ │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Middleware (Edge)                                 │
│  • Check authentication status                              │
│  • Redirect to sign-in if not authenticated                 │
│  • Refresh session tokens automatically                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Row Level Security (Database)                     │
│  • Users can only read/write their own data                 │
│  • Service role can do everything (for webhooks)            │
│  • Enforce data isolation at database level                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Server-Side Validation                            │
│  • Verify user identity on every API call                   │
│  • Check app permissions before serving data                │
│  • Validate subscription status for paid features           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 4: Client-Side UI                                    │
│  • Hide features user doesn't have access to                │
│  • Show upgrade prompts for locked features                 │
│  • Optimistic UI updates                                    │
└─────────────────────────────────────────────────────────────┘
```

## Development Workflow

```
Developer          Local App         Supabase Dev      Database
    │                  │                   │               │
    │  npm run dev     │                   │               │
    ├─────────────────▶│                   │               │
    │                  │                   │               │
    │                  │  Load .env.local  │               │
    │                  │  (Supabase creds) │               │
    │                  │                   │               │
    │  Test Sign Up    │                   │               │
    ├─────────────────▶│                   │               │
    │                  │  createUser()     │               │
    │                  ├──────────────────▶│               │
    │                  │                   │  INSERT       │
    │                  │                   ├──────────────▶│
    │                  │                   │               │
    │  View in Browser │◀──────────────────┤               │
    │◀─────────────────│                   │               │
    │                  │                   │               │
    │  Check DB        │                   │               │
    ├──────────────────┼───────────────────┼──────────────▶│
    │                  │                   │  SELECT *     │
    │◀─────────────────┴───────────────────┴───────────────│
    │                                                       │
```

---

## Key Takeaways

1. **Single Source of Truth**: One Supabase project for all apps
2. **Shared Authentication**: Same session across all Total Audio apps
3. **Permission-Based Access**: Subscription tier controls app access
4. **Automatic Updates**: Triggers handle permission updates
5. **Secure by Default**: Multiple security layers (RLS, middleware, validation)

---

**Next:** Follow [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) to implement this system!
