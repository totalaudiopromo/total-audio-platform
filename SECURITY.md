# Security Guidelines

## ⚠️ CRITICAL: API Keys and Secrets

**NEVER commit secrets to the repository!**

### Vercel Configuration

- `vercel.json` should only contain non-sensitive configuration
- All API keys, tokens, and secrets must be stored in Vercel Dashboard → Environment Variables
- **Stripe keys were previously exposed in vercel.json and have been removed**

### Environment Variables That Must Be Set in Vercel Dashboard:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_*` variables
- `CRON_SECRET`
- Any other sensitive tokens

### After Any Security Incident:

1. Rotate all exposed API keys immediately
2. Check git history for any committed secrets
3. Update environment variables in Vercel Dashboard
4. Monitor for unauthorized usage

## GitHub Actions Security

- Use `secrets.*` context for sensitive data
- Never hardcode API keys in workflow files
- Set minimal permissions in workflow files

---
**Last Updated**: September 2025 after API key exposure incident
