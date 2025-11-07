# 🚨 URGENT: Fix Build Matrix in ci-cd.yml

## Problem

You only added 3 apps to the build matrix when there should be 5.

## Current State (WRONG) ❌

```yaml
matrix:
  app: [audio-intel, web, api]
```

## Required State (CORRECT) ✅

```yaml
matrix:
  app: [audio-intel, tracker, pitch-generator, command-centre, web]
```

## Files to Fix

### `.github/workflows/ci-cd.yml`

**Three locations need fixing:**

1. **Line 81** - Build matrix
2. **Line 119** - Deploy staging matrix
3. **Line 204** - Deploy production matrix

### Changes Required

**Find and replace ALL THREE occurrences:**

❌ **REMOVE:**

```yaml
app: [audio-intel, web, api]
```

✅ **REPLACE WITH:**

```yaml
app: [audio-intel, tracker, pitch-generator, command-centre, web]
```

## Why This Matters

- **tracker** and **pitch-generator** are PRODUCTION apps that need deployment
- **command-centre** is a PRODUCTION app that needs deployment
- **api** is NOT a Vercel app and should NOT be in the deployment matrix

## Verification After Fix

Run this command to verify:

```bash
grep "app: \[" .github/workflows/ci-cd.yml
```

Expected output (3 lines, all identical):

```
        app: [audio-intel, tracker, pitch-generator, command-centre, web]
        app: [audio-intel, tracker, pitch-generator, command-centre, web]
        app: [audio-intel, tracker, pitch-generator, command-centre, web]
```

## Apps Confirmation

**Include these 5 apps:**

1. ✅ audio-intel (Vercel project: prj_3rSBMs1gaZj8uSg2XyCW31tzeF60)
2. ✅ tracker (Vercel project: prj_uiEWXtOUY3d9ly8JureSAcSXaoRd)
3. ✅ pitch-generator (Vercel project: prj_3EJMQY0EfED1fFosCyOmJwmH4Unf)
4. ✅ command-centre (Vercel project: prj_wFn8qksUxQ4zxJ0ATudZiqI62Ej9)
5. ✅ web (Vercel project: prj_ZlaEHqJPwOJ8XnQmW7FAUL9OiL7C)

**Exclude these apps:**

- ❌ api (backend service, not deployed via Vercel)
- ❌ playlist-pulse (explicitly excluded)
- ❌ mobile, seo-tool, voice-echo (experimental/archived)

## Commit Message After Fix

```
fix: correct build matrix to include all 5 production apps in ci-cd.yml

- Add tracker and pitch-generator to build/deploy matrices
- Add command-centre to build/deploy matrices
- Remove 'api' from deployment matrix (not a Vercel app)
- Fix applies to all 3 matrix locations (build, deploy-staging, deploy-production)

Apps: audio-intel, tracker, pitch-generator, command-centre, web
```
