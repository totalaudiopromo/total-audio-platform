# 🔍 Claude Code Session Freeze Diagnosis

**Date**: November 21, 2025  
**Status**: RESOLVED - Process Killed

## 🚨 Root Cause

A Next.js dev server process (PID 21897) was stuck in an infinite compilation loop:

- **Process**: `next-server (v15.3.0)` on port 3005
- **CPU Usage**: 90.2% (stuck for 38+ minutes)
- **Memory**: 832MB
- **App**: `tap-dashboard`

## ✅ Immediate Fix Applied

Killed the stuck process:

```bash
kill -9 21897
```

## 🔧 Underlying Issues Found

### 1. **Version Mismatch**

- `tap-dashboard` uses Next.js `14.2.0`
- Root `package.json` has override to Next.js `15.3.0`
- This mismatch can cause compilation issues

### 2. **Excessive Transpilation**

`tap-dashboard/next.config.js` transpiles 10 workspace packages:

- `@total-audio/fusion-layer`
- `@total-audio/intelligence-navigator`
- `@total-audio/correlation-engine`
- `@total-audio/trajectory-lens`
- `@total-audio/automations-drawer`
- `@total-audio/identity-kernel`
- `@total-audio/coverage-fusion`
- `@total-audio/workspace-benchmarking`
- `@total-audio/signal-threads`
- `@total-audio/dashboard-modes`

This can cause slow compilation and potential infinite loops.

### 3. **Port Conflict Risk**

Both `tap-dashboard` and `command-centre` use port 3005, which could cause conflicts.

## 🛠️ Recommended Fixes

### Fix 1: Align Next.js Version

Update `apps/tap-dashboard/package.json`:

```json
"next": "15.3.0"
```

### Fix 2: Optimise Transpilation

Consider reducing transpiled packages or using Next.js 15's improved workspace support.

### Fix 3: Add Watch Options

Add to `next.config.js` to prevent infinite loops:

```js
const nextConfig = {
  // ... existing config
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    return config;
  },
};
```

### Fix 4: Clear Build Cache

If freezes continue:

```bash
cd apps/tap-dashboard
rm -rf .next
pnpm install
```

## 📊 Prevention

1. **Monitor Processes**: Check for stuck processes with `ps aux | grep next`
2. **Version Alignment**: Keep Next.js versions consistent across monorepo
3. **Limit Transpilation**: Only transpile packages that actually need it
4. **Watch for Loops**: If compilation takes >5 minutes, kill and investigate

## ✅ Status

- [x] Stuck process killed
- [x] Next.js version aligned (15.3.0)
- [x] React/React-DOM updated (19.1.0)
- [x] React types updated (19.0.0)
- [x] Watch options added (prevents infinite loops)
- [x] Build cache cleared

## 🔄 Recurring Freeze (2025-11-22)

**Issue**: `liberty-demo` was using Next.js 16.0.1 while root override forces 15.3.0

**Fix Applied**:
- Updated `apps/liberty-demo/package.json`: `next: 16.0.1` → `15.3.0`
- Added webpack watch options to `apps/liberty-demo/next.config.js`
- Cleared `.next` and `node_modules/.cache` directories

**Prevention**: Always ensure app-level `package.json` matches root `pnpm.overrides` for Next.js version.

## 🔄 Additional Freeze Fixes (2025-11-22 - Second Occurrence)

**Additional Issues Found**:
1. **Router dependency in useEffect**: `app/artist/[slug]/page.tsx` had `router` in useEffect deps, causing potential infinite re-renders
2. **Insufficient watch exclusions**: Webpack wasn't ignoring enough paths

**Fixes Applied**:
- Enhanced `next.config.js` with more aggressive watch exclusions (`.next`, `.git`, `dist`, `build`, `tsconfig.tsbuildinfo`)
- Removed `router` from useEffect dependency array in artist portal page
- Increased `aggregateTimeout` to 500ms for better stability
- Created `kill-stuck-processes.sh` script for emergency cleanup

**Emergency Cleanup Script**:
```bash
./kill-stuck-processes.sh
```

This will:
- Kill all processes on port 3005
- Kill all Next.js dev servers
- Kill high CPU node processes
- Clean build artifacts (.next, cache, tsconfig.tsbuildinfo)

## 🎯 Fixes Applied

1. **Updated `apps/tap-dashboard/package.json`**:
   - Next.js: `14.2.0` → `15.3.0`
   - React: `18.2.0` → `19.1.0`
   - React-DOM: `18.2.0` → `19.1.0`
   - React types: `18.2.0` → `19.0.0`

2. **Updated `apps/tap-dashboard/next.config.js`**:
   - Added webpack watch options to prevent infinite compilation loops
   - Configured polling and ignored paths for better performance

3. **Cleared build cache**:
   - Removed `.next` directory and `node_modules/.cache`

**Next step**: Run `pnpm install` in `apps/tap-dashboard` to install updated dependencies.
