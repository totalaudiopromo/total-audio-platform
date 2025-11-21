# 🔍 Deployment Monitoring Guide

## ✅ Fixes Committed

**Latest Commit**: Vercel build command fixes

- Updated all `vercel.json` files to use `pnpm build` instead of `pnpm --filter`
- Should resolve deployment build errors

## 📊 How to Monitor Deployments

### 1. Check Vercel Dashboard

Visit: **https://vercel.com/dashboard**

For each project, check:

#### Audio Intel

- Project: `audio-intel`
- URL: https://vercel.com/chris-projects-6ffe0e29/audio-intel
- Look for: Latest deployment status (Building → Ready/Failed)
- Production: https://intel.totalaudiopromo.com

#### Pitch Generator

- Project: `pitch-generator`
- URL: https://vercel.com/chris-projects-6ffe0e29/pitch-generator
- Look for: Latest deployment status
- Production: https://pitch.totalaudiopromo.com

#### Tracker

- Project: `tracker`
- URL: https://vercel.com/chris-projects-6ffe0e29/tracker
- Look for: Latest deployment status
- Production: https://tracker.totalaudiopromo.com

### 2. What to Look For

**✅ Success Indicators:**

- Build status: "Ready" (green)
- Build time: 1-3 minutes
- Build logs show: `✓ Compiled successfully`
- No errors in build logs

**❌ Failure Indicators:**

- Build status: "Error" (red)
- Build logs show: Module not found errors
- Build logs show: TypeScript errors
- Build logs show: Command not found

### 3. Check Build Logs

Click on any deployment → "Build Logs" tab

**Good build log should show:**

```
Installing dependencies...
Running "pnpm install --frozen-lockfile"
✓ Packages installed

Building...
Running "pnpm build"
✓ Compiled successfully
```

**Bad build log might show:**

```
Error: Cannot find module '@total-audio/ui'
Error: Command 'pnpm --filter' not found
TypeScript errors...
```

### 4. GitHub Actions (if enabled)

Visit: **https://github.com/totalaudiopromo/total-audio-platform/actions**

Check for:

- CI workflows running
- Deployment workflows
- Test results

### 5. Test Production URLs

After successful deployment:

**Audio Intel:**

```bash
curl -I https://intel.totalaudiopromo.com
# Should return: 200 OK
```

**Pitch Generator:**

```bash
curl -I https://pitch.totalaudiopromo.com
# Should return: 200 OK
```

**Tracker:**

```bash
curl -I https://tracker.totalaudiopromo.com
# Should return: 200 OK
```

## 🚨 If Deployments Still Fail

### Check These:

1. **Vercel Root Directory Settings**
   - Should be: `apps/audio-intel` (for each app)
   - ✅ "Include source files outside of Root Directory" should be ENABLED

2. **Build Command**
   - Should be: `pnpm build` (from vercel.json)
   - NOT: `pnpm --filter audio-intel build`

3. **Install Command**
   - Should be: `pnpm install --frozen-lockfile`

4. **Environment Variables**
   - Check all required env vars are set in Vercel dashboard
   - Check for missing API keys

5. **TypeScript Errors**
   - Run locally: `npm run typecheck:all`
   - Fix any TypeScript errors before deploying

## 📝 Expected Timeline

- **0-2 minutes**: Vercel detects push, starts deployment
- **2-5 minutes**: Installing dependencies
- **5-10 minutes**: Building application
- **10-12 minutes**: Deployment complete

## 🎯 Success Criteria

- [ ] All three apps show "Ready" status in Vercel
- [ ] Build logs show successful compilation
- [ ] Production URLs return 200 OK
- [ ] No errors in build logs
- [ ] Mobile fixes are live (test on actual devices)

---

**Last Updated**: Just now
**Branch**: `local-workflow-test`
**Status**: Monitoring deployments...
