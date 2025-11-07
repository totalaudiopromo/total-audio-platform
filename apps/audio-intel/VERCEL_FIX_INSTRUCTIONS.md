# 🔧 VERCEL MONOREPO FIX - REQUIRED MANUAL STEPS

## ❌ Current Problem

Vercel is failing to build because it can't find `@total-audio/ui`:

```
Module not found: Can't resolve '@total-audio/ui'
```

## 🎯 Root Cause

- Vercel is only uploading `apps/audio-intel` directory
- The workspace dependency `@total-audio/ui` lives in `../../packages/ui`
- Vercel needs access to the **entire monorepo** to link workspace packages

## ✅ SOLUTION: Configure Vercel Root Directory

### Option 1: Via Vercel Dashboard (RECOMMENDED)

1. **Go to Vercel Project Settings:**

   - https://vercel.com/chris-projects-6ffe0e29/audio-intel/settings

2. **Click "General" tab**

3. **Scroll to "Build & Development Settings"**

4. **Set Root Directory:**

   - Click "Edit" next to "Root Directory"
   - Change from `.` to: `apps/audio-intel`
   - ✅ Check "Include source files outside of the Root Directory in the Build Step"

5. **Framework Preset:**

   - Should auto-detect as "Next.js"

6. **Build Command:**

   - Leave as default: `next build` (or `npm run build`)

7. **Output Directory:**

   - Leave as default: `.next`

8. **Install Command:**

   - IMPORTANT: Change to: `npm install`
   - (This runs at monorepo root before cd'ing to apps/audio-intel)

9. **Click "Save"**

10. **Redeploy:**
    - Go to Deployments tab
    - Click "..." on latest deployment
    - Click "Redeploy"

### Option 2: Via vercel.json (If Dashboard Doesn't Work)

Update `apps/audio-intel/vercel.json`:

```json
{
  "build": {
    "env": {
      "NODE_VERSION": "18"
    }
  },
  "framework": "nextjs",
  "buildCommand": "cd apps/audio-intel && npm run build",
  "installCommand": "npm install",
  "outputDirectory": "apps/audio-intel/.next",
  "env": {
    "NEXT_PUBLIC_BASE_URL": "https://intel.totalaudiopromo.com"
  },
  "functions": {
    "app/api/**": {
      "maxDuration": 30
    }
  },
  "regions": ["lhr1"]
}
```

### Option 3: Use Vercel Turborepo Support

If you're using turborepo, add to monorepo root:

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

## 🧪 Verification Steps

After applying the fix:

1. **Check build logs show monorepo context:**

   ```
   Installing dependencies...
   ✓ Packages installed from monorepo root
   ✓ Workspace @total-audio/ui linked
   ```

2. **Build should succeed in ~55 seconds**

3. **Test the deployed site:**
   ```bash
   curl -I https://intel.totalaudiopromo.com/demo
   # Should redirect (307/302) not 200
   ```

## 📊 Expected Results

✅ Dependencies install from monorepo root  
✅ Workspace packages (`@total-audio/ui`) are linked  
✅ `transpilePackages` config works  
✅ Build completes successfully  
✅ Auth middleware protects routes

## ⚡ Quick Test Command

After fixing Vercel settings:

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel

# Monitor deployment
watch -n 5 'vercel ls | head -8'

# Or run verification script once deployed
./verify-deployment.sh
```

## 🆘 If Still Failing

Try this alternative approach - convert to relative imports:

1. Copy `packages/ui/components/*` into `apps/audio-intel/components/shared/`
2. Update imports:

   ```typescript
   // Before
   import { SiteHeader } from '@total-audio/ui';

   // After
   import { SiteHeader } from '@/components/shared/SiteHeader';
   ```

3. Remove `@total-audio/ui` dependency from package.json

This eliminates the workspace dependency entirely (less elegant, but guaranteed to work).
