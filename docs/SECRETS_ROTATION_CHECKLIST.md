# Secrets Rotation Checklist

This checklist helps safely rotate credentials exposed in commit history.

Affected integrations (Audio Intel):
- ANTHROPIC_API_KEY
- PERPLEXITY_API_KEY
- CONVERTKIT_API_KEY, CONVERTKIT_API_SECRET (or KIT_API_KEY)
- STRIPE_SECRET_KEY (if exposed)
- CRON_SECRET
- RESEND_API_KEY (verify)

## 1) Immediate Mitigation
- Remove tracked secrets file:
  - git rm apps/audio-intel/.env.local
  - git commit -m "Remove committed secrets file"
- Verify `.gitignore` excludes env files (`.env*`, `.env.local`).

## 2) Rotate Credentials
- Anthropic: Revoke old key, create new, update `.env.local`.
- Perplexity: Revoke old key, create new, update `.env.local`.
- ConvertKit: Regenerate API key and secret, update `.env.local`.
- Stripe: Create a new restricted secret key if necessary; update `.env.local`.
- Resend (if used): Revoke and reissue.
- Cron Secret: Generate a new random value; update `.env.local`.

## 3) Update Environments
- Local: Update `apps/audio-intel/.env.local` from `apps/audio-intel/.env.local.example`.
- Vercel/Hosting: Update project environment variables for all environments (Production, Preview).
- CI: Update GitHub Actions repo secrets if referenced.

## 4) Validate
- Run locally: `npm run dev:audio-intel` and exercise key paths.
- E2E: `cd apps/audio-intel && npx playwright test` (webServer is wired).
- API probes (optional): Use POSTMAN/curl against `/api/checkout`, `/api/convertkit/*`.

## 5) Prevent Recurrence
- Keep `.env.local` untracked; commit only `.env.local.example`.
- Use the centralized env helper (`apps/audio-intel/lib/env.ts`) and avoid hardcoded fallbacks.
- For secrets in logs, redact values and avoid printing raw tokens.

## 6) Optional: Purge from History
- If required, use `git filter-repo` or GitHub secret scanning guidance to purge historical secrets.
- After rewriting history, force push and rotate keys again.

---
Owner: Security + Engineering
Last updated: {{ TODAY }}

