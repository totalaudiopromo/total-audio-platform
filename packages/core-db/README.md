# @total-audio/core-db

**Single source of truth**for Supabase integration across Total Audio Platform.

## Overview

This package provides typed Supabase clients, utilities, and database types for all apps in the Total Audio monorepo. It centralises authentication, database access, and RLS (Row Level Security) logic.

## Installation

This package is internal to the monorepo and managed via pnpm workspaces.

```json
{
  "dependencies": {
    "@total-audio/core-db": "workspace:*"
  }
}
```

## Usage

### Browser Client (React Components, Client-Side Code)

```typescript
import { createClient } from '@total-audio/core-db/client';

const supabase = createClient();
const { data, error } = await supabase.from('campaigns').select('*');
```

### Server Client (Server Components, Server Actions, Route Handlers)

```typescript
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';

const supabase = createServerClient(cookies());
const { data } = await supabase.from('campaigns').select('*');
```

### Admin Client (Bypasses RLS - Use with Caution)

```typescript
import { createAdminClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';

//  WARNING: This bypasses RLS and should ONLY be used in secure server contexts
const supabase = createAdminClient(cookies());
const { data } = await supabase.from('users').select('*'); // Bypasses RLS
```

### Middleware (Authentication & Session Management)

```typescript
// middleware.ts
import { updateSession } from '@total-audio/core-db/middleware';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

### TypeScript Types

```typescript
import type { Database, Json } from '@total-audio/core-db/types';

// Use in your app
type Campaign = Database['public']['Tables']['campaigns']['Row'];
type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
type CampaignUpdate = Database['public']['Tables']['campaigns']['Update'];
```

### Utility Functions

```typescript
import { isAdmin, ownsResource, getSubscriptionTier } from '@total-audio/core-db';

// Check if user is admin
const adminStatus = await isAdmin(supabase, userId);

// Check if user owns a resource
const hasAccess = await ownsResource(supabase, userId, 'campaigns', campaignId);

// Get user's subscription tier
const tier = await getSubscriptionTier(supabase, userId);
```

## Environment Variables

Required environment variables (validated with Zod):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Only for admin operations
```

## Scripts

### Generate TypeScript Types

Generate types from your Supabase schema:

```bash
# Set environment variables
export SUPABASE_PROJECT_ID=your-project-id

# Generate types
pnpm --filter @total-audio/core-db generate:types
```

### Run Migrations

Apply database migrations:

```bash
# Set environment variables
export SUPABASE_PROJECT_ID=your-project-id
export SUPABASE_DB_PASSWORD=your-db-password

# Run migrations
pnpm --filter @total-audio/core-db migrate
```

## Package Structure

```
packages/core-db/
 src/
    client.ts           # Browser client
    server.ts           # Server client (regular & admin)
    middleware.ts       # Next.js middleware helper
    index.ts            # Main exports
    types/
       database.ts     # Generated types from Supabase schema
       index.ts        # Type exports
    utils/
        env.ts          # Environment validation (Zod)
        permissions.ts  # RLS helper functions
        index.ts        # Utility exports
 supabase/
    migrations/         # Database migrations (chronological)
 scripts/
    generate-types.sh   # Type generation script
    migrate.sh          # Migration script
 package.json
 README.md
```

## Migration Strategy

All apps (audio-intel, tracker, pitch-generator) should migrate to use this package:

1. **Before**: Each app has duplicate `lib/supabase/` implementations
2. **After**: All apps import from `@total-audio/core-db`

### Migration Checklist

- [ ] Replace `lib/supabase/client.ts` with `@total-audio/core-db/client`
- [ ] Replace `lib/supabase/server.ts` with `@total-audio/core-db/server`
- [ ] Replace `middleware.ts` logic with `@total-audio/core-db/middleware`
- [ ] Move app-specific migrations to `packages/core-db/supabase/migrations/`
- [ ] Run type generation to update types
- [ ] Remove duplicate Supabase implementation files

## Security Considerations

### RLS (Row Level Security)

- **createClient()**and **createServerClient()**use the anon key and respect RLS policies
- **createAdminClient()**uses the service role key and **bypasses RLS**
- Only use admin client in secure server contexts with explicit permission checks

### Environment Variables

- All environment variables are validated with Zod at runtime
- Service role key is optional and only required for admin operations
- Never expose service role key to client-side code

## Contributing

When making schema changes:

1. Create migration file in `supabase/migrations/`
2. Run `pnpm --filter @total-audio/core-db migrate`
3. Run `pnpm --filter @total-audio/core-db generate:types`
4. Commit both migration and generated types

## References

- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
