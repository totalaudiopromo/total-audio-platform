# URGENT: Vercel Cache Issue

**Status**: Production is still serving 79+ hour old cached version  
**Problem**: `x-vercel-cache: HIT` and `x-nextjs-prerender: 1` indicate old static cache

## Current Production Response

```
HTTP/2 200
age: 285984  # ← 79+ hours old!
x-nextjs-prerender: 1  # ← Static cached version
x-vercel-cache: HIT  # ← Serving from cache
etag: "1ccefe22c74f3f7bb6264e11fdd7ecb3"  # ← OLD etag
```

## IMMEDIATE ACTIONS REQUIRED

### Option 1: Clear Vercel Cache (Fastest)

1. **Go to Vercel Dashboard**:
   - https://vercel.com/[your-account]/intel-totalaudiopromo-com/deployments

2. **Find Latest Deployment**:
   - Should be from the last few minutes (commits 82e34f7, 94ec7f3, 84174c2)
   - Check if it's completed successfully

3. **Clear Cache**:
   - Click on the deployment
   - Go to "..." menu → **"Redeploy"**
   - Check **"Use existing build cache"**= OFF
   - Click **"Redeploy"**

### Option 2: Force New Deployment

```bash
# Trigger a new deployment with cache bypass
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel

# Option A: Use Vercel CLI
vercel --prod --force

# Option B: Empty commit to trigger deploy
git commit --allow-empty -m "chore: Force deployment to clear cache"
git push origin main
```

### Option 3: Manual Cache Headers (If Above Fails)

Add explicit cache control to `next.config.js`:

```javascript
/**@type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: '/demo',
      headers: [
        {
          key: 'Cache-Control',
          value: 'private, no-cache, no-store, must-revalidate',
        },
      ],
    },
    {
      source: '/dashboard',
      headers: [
        {
          key: 'Cache-Control',
          value: 'private, no-cache, no-store, must-revalidate',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
```

## How to Verify Fix Worked

After clearing cache, check:

```bash
curl -I https://intel.totalaudiopromo.com/demo
```

**Should see:**

-  NO `x-nextjs-prerender: 1`
-  NO `age: [high number]`
-  Different etag than `1ccefe22c74f3f7bb6264e11fdd7ecb3`
-  HTTP 307 or 302 redirect (not 200)

**Or run verification script:**

```bash
./verify-deployment.sh
```

## Root Cause

The `export const dynamic = 'force-dynamic'` in client components doesn't prevent Next.js from prerendering the initial HTML. The page is still being statically generated at build time and served from Vercel's CDN cache.

## Permanent Fix (If Issue Persists)

Convert `/demo` and `/dashboard` to server components with auth checks:

1. Create server component wrapper:

```typescript
// app/demo/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DemoClient } from './DemoClient';

export const dynamic = 'force-dynamic';

export default async function DemoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin?redirectTo=/demo');
  }

  return <DemoClient />;
}
```

2. Move current client code to `DemoClient.tsx`

This ensures auth check happens on the server BEFORE any HTML is generated.

## ⏱ Timeline

- **Immediate**: Clear Vercel cache or force redeploy
- **5-10 min**: New deployment completes
- **Result**: Auth protection active, no cached pages

## Support

If cache persists after all attempts:

1. Check Vercel project settings → Caching → Clear All
2. Contact Vercel support about stale cache
3. Consider temporary fix: Add `?v=2` to all protected route redirects to bypass cache
