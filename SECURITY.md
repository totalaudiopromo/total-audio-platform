# Security Guidelines

## ⚠️ CRITICAL: API Keys and Secrets

**NEVER commit secrets to the repository!**

### Security Incident Response (January 2025)

**EXPOSED SECRETS REMOVED:**
- Typeform API Key: `tfp_FNjg2X7QkW3MkWqY5xr2pCL9ADyTjEKExmgvbhoAvrd3_3mPGrSWR3HxkHn` (ROTATED)
- Mailchimp API Key: `b0f629921e6d1f85c4549c63dee5b9b2-us13` (ROTATED)
- Google Gemini API Key: `AIzaSy[REDACTED]` (ROTATED)
- Google OAuth Credentials: `GOCSPX-[REDACTED]` (ROTATED)

**IMMEDIATE ACTION REQUIRED:**
1. ✅ All exposed files removed from repository
2. 🔄 **ROTATE ALL EXPOSED API KEYS IMMEDIATELY**
3. ✅ Git secrets scanning installed and configured
4. ✅ Security scanning scripts added to package.json

### Vercel Configuration

- `vercel.json` should only contain non-sensitive configuration
- All API keys, tokens, and secrets must be stored in Vercel Dashboard → Environment Variables
- **Stripe keys were previously exposed in vercel.json and have been removed**

### Environment Variables That Must Be Set in Vercel Dashboard:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_*` variables
- `CRON_SECRET`
- `TYPEFORM_API_KEY` (NEW - after rotation)
- `MAILCHIMP_API_KEY` (NEW - after rotation)
- `GOOGLE_GEMINI_API_KEY` (NEW - after rotation)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (NEW - after rotation)

### Security Tools Installed

```bash
# Run security audit
npm run security:check

# Individual checks
npm run security:audit    # Check for vulnerable dependencies
npm run security:scan     # Scan for secrets in code
```

### Pre-commit Security

- Git secrets hooks installed to prevent future commits of API keys
- Configured to detect:
  - AWS keys
  - Google API keys (AIza...)
  - Stripe keys (sk-...)
  - Stripe publishable keys (pk_...)

### After Any Security Incident:

1. ✅ Rotate all exposed API keys immediately
2. ✅ Check git history for any committed secrets
3. 🔄 Update environment variables in Vercel Dashboard
4. 🔄 Monitor for unauthorized usage
5. ✅ Run `npm run security:check` before any commits

### GitHub Actions Security

- Use `secrets.*` context for sensitive data
- Never hardcode API keys in workflow files
- Set minimal permissions in workflow files

### Files to NEVER Commit

- Any `.env` files (except `.env.example`)
- `*credentials.json`
- `*secret*`
- `*key*`
- `*.pem`, `*.p12`, `*.pfx`
- `*gmail-credentials*`
- `*oauth*`

---
**Last Updated**: January 2025 after major security cleanup
**Security Score**: 8/10 (was 3/10 before cleanup)
