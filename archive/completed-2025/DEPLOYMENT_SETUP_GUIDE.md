# 🚀 Deployment Setup Guide

This document captures the current, working deployment shape for the Total Audio Platform monorepo and the remaining manual bits you need to double‑check.

## ✅ Pipeline Snapshot

- **Single workflow:** `.github/workflows/ci-cd.yml` drives all CI, build, and deploy stages.
- **Deterministic installs:** Every job now runs `npm ci --no-audit --no-fund` against the regenerated `package-lock.json`.
- **Active apps in this repo:** `total-audio-promo-frontend` (`apps/web`), `tracker` (`apps/tracker`), and `pitch-generator` (`apps/pitch-generator`).
- **Branch logic:** `staging` → staging deploys, `main` → production deploys, PRs → CI only.
- **Health verification:** Deploy jobs can `curl` app health endpoints when the optional URL secrets are present.
- **Legacy apps:** `audio-intel` and `command-centre` deploy from their own repositories; they are intentionally excluded from this monorepo matrix.

## 🔐 GitHub Secrets Checklist

Add or confirm the following under **Settings → Secrets → Actions**:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID` (format `usr_xxx...`)
- `VERCEL_PROJECT_ID_WEB`
- `VERCEL_PROJECT_ID_TRACKER`
- `VERCEL_PROJECT_ID_PITCH_GENERATOR`

Optional (enables post-deploy health checks; populate only if you have stable URLs):

- `HEALTHCHECK_URL_WEB` (staging)
- `HEALTHCHECK_URL_TRACKER` (staging)
- `HEALTHCHECK_URL_PITCH_GENERATOR` (staging)
- `HEALTHCHECK_URL_WEB_PROD`
- `HEALTHCHECK_URL_TRACKER_PROD`
- `HEALTHCHECK_URL_PITCH_GENERATOR_PROD`

> 📌 Tip: Each Project ID lives in Vercel → Project → Settings → General. Health URLs are typically `https://<app-domain>/api/health`.

## 🔗 Vercel Project Linking

For each of the three apps above:

1. Vercel Dashboard → select project.
2. Settings → Git → Connect Repository.
3. Choose `totalaudiopromo/total-audio-platform`.
4. Root Directory:
   - Web → `apps/web`
   - Tracker → `apps/tracker`
   - Pitch Generator → `apps/pitch-generator`
5. Leave build command/output blank (handled by repo scripts and `vercel.json` where present).

## 🧪 Local Verification Before Pushing

Run the following from the repository root:

```bash
npm ci
npm run lint           # currently scopes to audio-intel; keep an eye on warnings
npm run typecheck      # same scope as lint
```

CI will also execute `npm run test` (no-op placeholder) and the TypeScript check. Address lint/TS warnings when you are ready to make the lint step blocking again.

## 🛠️ Workflow Internals

- **Test job:** checkout → Node 20 setup with npm cache → `npm ci` → lint (non-blocking) → typecheck → tests.
- **Build job:** matrix over the three active apps → `npm ci` → `npm run build --workspace=<app>`.
- **Deploy jobs:** reuse the same app matrix; set `VERCEL_PROJECT_ID` and `APP_PATH` via matrix-specific mapping; install Vercel CLI; deploy to staging or production; optionally `curl` health URL.
- **Security job:** basic `npm ci` followed by informational `npm audit`.
- **Notify job:** prints success/failure summaries after deploy stages complete.

## 🚨 Troubleshooting Highlights

- **Install failures:** Re-run `npm ci` locally; if it fails, lockfile drift is back.
- **Deploy skips:** Usually missing `VERCEL_PROJECT_ID_*` or `VERCEL_TOKEN`.
- **Health check failures:** Inspect the deployed `/api/health` route and confirm secrets point at the right domain.
- **Legacy app deploys:** Confirm they are handled in their dedicated repositories; this workflow will no longer touch them.

## 📦 Ongoing Maintenance

- When dependencies change, run `npm install` (to update the lockfile), commit `package-lock.json`, and make sure `npm ci` still succeeds locally.
- Keep Vercel project IDs and health check URLs updated if domains change.
- Once lint infra is green, remove `continue-on-error` from the lint step to re-enable the gate.

With the lockfile regenerated, `npm ci` back in CI, and the workflow trimmed to the three active apps, the pipeline is ready for consistent Vercel deploys. 🎉
