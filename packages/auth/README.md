# @total-audio/auth

Shared authentication package for Total Audio Promo platform. Provides unified authentication across all Total Audio apps using Supabase.

## Features

- ✅ Single sign-on across all apps
- ✅ Shared user database with subscription management
- ✅ App-specific permissions
- ✅ React hooks for auth state
- ✅ TypeScript support
- ✅ Server and client utilities
- ✅ Middleware for route protection

## Installation

This package is part of the Total Audio monorepo and uses npm workspaces. Install dependencies from the root:

```bash
npm install
```

## Usage

### In Your App

Add to your app's `package.json`:

```json
{
  "dependencies": {
    "@total-audio/auth": "*"
  }
}
```

### Environment Variables

Add these to your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Client-Side Authentication

```typescript
import { useAuth } from '@total-audio/auth/hooks'

function MyComponent() {
  const { user, profile, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>

  return (
    <div>
      <h1>Welcome, {profile?.full_name || user.email}</h1>
      <p>Subscription: {profile?.subscription_tier}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Check App Permissions

```typescript
import { usePermissions } from '@total-audio/auth/hooks'

function AppSwitcher() {
  const { tier, checkAccess, accessibleApps } = usePermissions()

  return (
    <div>
      <p>Your plan: {tier}</p>
      <ul>
        {accessibleApps.map((app) => (
          <li key={app}>{app}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Server-Side Authentication

```typescript
import { createClient, getCurrentUser } from '@total-audio/auth/server'

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  return Response.json({ user })
}
```

### Middleware

Add to your `middleware.ts`:

```typescript
import { createMiddleware } from '@total-audio/auth/middleware'

export const middleware = createMiddleware({
  protectedRoutes: ['/dashboard', '/settings'],
  authRoutes: ['/signin', '/signup'],
  signInPath: '/signin',
  defaultRedirect: '/dashboard',
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

## API Reference

### Hooks

#### `useAuth()`

Returns the current authentication state:

```typescript
{
  user: TotalAudioUser | null
  profile: UserProfile | null
  loading: boolean
  error: Error | null
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}
```

#### `useUser()`

Returns just the user profile:

```typescript
{
  profile: UserProfile | null
  loading: boolean
  error: Error | null
}
```

#### `usePermissions()`

Returns permission checking utilities:

```typescript
{
  tier: SubscriptionTier
  checkAccess: (appName: AppName) => boolean
  accessibleApps: AppName[]
  hasBundle: boolean
  loading: boolean
}
```

### Utility Functions

#### Permission Utilities

```typescript
import {
  hasAppAccess,
  getAccessibleApps,
  getMinimumTierForApp,
  getUpgradeRecommendation,
} from '@total-audio/auth/utils'

// Check if tier has access to app
const canAccess = hasAppAccess('pro', 'audio-intel') // true

// Get all accessible apps for a tier
const apps = getAccessibleApps('bundle') // ['audio-intel', 'tracker', 'pitch-generator', 'command-centre']

// Get minimum tier for an app
const minTier = getMinimumTierForApp('tracker') // 'bundle'

// Get upgrade recommendation
const recommendation = getUpgradeRecommendation('free', 'tracker')
// { needsUpgrade: true, recommendedTier: 'bundle', additionalApps: [...] }
```

#### Subscription Utilities

```typescript
import {
  isSubscriptionActive,
  getTierDisplayName,
  getTierPricing,
  getDaysUntilPeriodEnd,
} from '@total-audio/auth/utils'

// Check if subscription is active
const active = isSubscriptionActive('active') // true

// Get display name
const name = getTierDisplayName('bundle') // 'Total Audio Bundle'

// Get pricing
const pricing = getTierPricing('pro')
// { monthly: 19, annual: 190, currency: 'GBP' }

// Calculate days until period end
const days = getDaysUntilPeriodEnd('2025-11-13') // number of days
```

## Database Schema

The package expects these tables in Supabase:

### `user_profiles`

- `id` (uuid, primary key, references auth.users)
- `email` (text)
- `full_name` (text, nullable)
- `subscription_tier` (text, default 'free')
- `stripe_customer_id` (text, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### `app_permissions`

- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `app_name` (text)
- `has_access` (boolean)
- `granted_at` (timestamptz)

### `subscriptions`

- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `stripe_subscription_id` (text, nullable)
- `status` (text)
- `plan_id` (text)
- `plan_name` (text)
- `current_period_end` (timestamptz, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

See the full migration in `UNIFIED_AUTH_IMPLEMENTATION.md`.

## Subscription Tiers

- **free**: 10 enrichments/month on Audio Intel
- **pro**: Unlimited enrichments on Audio Intel (£19/month)
- **agency**: Unlimited + team features on Audio Intel (£79/month)
- **bundle**: Access to all Total Audio apps (£99/month)

## App Access Matrix

| Tier    | Audio Intel | Tracker | Pitch Generator | Command Centre |
| ------- | ----------- | ------- | --------------- | -------------- |
| free    | ✅          | ❌      | ❌              | ❌             |
| pro     | ✅          | ❌      | ❌              | ❌             |
| agency  | ✅          | ❌      | ❌              | ❌             |
| bundle  | ✅          | ✅      | ✅              | ✅             |

## TypeScript Types

All types are exported from `@total-audio/auth/types`:

```typescript
import type {
  UserProfile,
  SubscriptionTier,
  AppName,
  TotalAudioUser,
  AppPermission,
  Subscription,
} from '@total-audio/auth/types'
```

## Security

- All tables use Row Level Security (RLS)
- Session tokens are stored in secure, httpOnly cookies
- Server-side validation for all protected operations
- Automatic session refresh in middleware

## Contributing

This package is internal to Total Audio Promo. For changes:

1. Update the source in `packages/auth/src/`
2. Run `npm run build` to compile TypeScript
3. Test in consuming apps
4. Update this README if needed

## License

UNLICENSED - Internal Total Audio Promo package
