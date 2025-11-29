# Audio Intel - Environment Variables Reference

Copy this file to `.env.local` for local development, or add to Vercel Environment Variables for production.

## REQUIRED - Core Functionality

### Supabase (Authentication & Database)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Get from:**[Supabase Dashboard](https://app.supabase.com) → Your Project → Settings → API

### Anthropic Claude API (Contact Enrichment)

```bash
ANTHROPIC_API_KEY=sk-ant-api03-your_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

**Get from:**[Anthropic Console](https://console.anthropic.com/) → API Keys

### Stripe (Payments & Subscriptions)

```bash
# Secret Keys (Server-side)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Publishable Keys (Client-side)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Price IDs (Get from Stripe Dashboard → Products)
STRIPE_PRICE_MONTHLY=price_xxx_monthly
STRIPE_PRICE_ANNUAL=price_xxx_annual
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_xxx_monthly
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_xxx_annual
```

**Get from:**[Stripe Dashboard](https://dashboard.stripe.com) → Developers → API Keys & Webhooks

### Base URL

```bash
# Local
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Production
NEXT_PUBLIC_BASE_URL=https://intel.totalaudiopromo.com
```

---

## OPTIONAL - Enhanced Features

### Perplexity AI (Alternative enrichment source)

```bash
PERPLEXITY_API_KEY=pplx-your_key_here
```

**Get from:**[Perplexity](https://www.perplexity.ai/settings/api)

### ConvertKit (Email Marketing & Newsletter)

```bash
CONVERTKIT_API_KEY=your_convertkit_key
CONVERTKIT_API_SECRET=your_convertkit_secret
CONVERTKIT_FORM_ID=your_form_id
```

**Get from:**[ConvertKit](https://app.convertkit.com/account_settings/advanced_settings)

### Notion (Content Database Sync)

```bash
NOTION_API_KEY=secret_your_notion_key
NOTION_DATABASE_ID=your_database_id
```

**Get from:**[Notion Integrations](https://www.notion.so/my-integrations)

### Resend (Email Sending)

```bash
RESEND_API_KEY=re_your_key_here
```

**Get from:**[Resend](https://resend.com/api-keys)

### Analytics & SEO

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code
NEXT_PUBLIC_BING_SITE_VERIFICATION=your_bing_verification
```

---

## Setup Instructions

### For Local Development:

1. Create `.env.local` in project root
2. Copy all REQUIRED variables above
3. Use **test/development keys**for Stripe (`sk_test_` and `pk_test_`)
4. Run: `npm run dev`
5. Test at: `http://localhost:3000`

### For Vercel Production:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to: `audio-intel` → Settings → Environment Variables
3. Add all REQUIRED variables
4. Use **production keys**for Stripe (`sk_live_` and `pk_live_`)
5. Set environment to: **Production**, **Preview**, and **Development**(or as needed)
6. Deploy: `git push origin main`

---

## Security Notes

-  **Never commit `.env.local`**to git (already in `.gitignore`)
-  **Use test keys**for local development
-  **Use live keys**only in Vercel production environment
-  **Rotate keys**if accidentally exposed
-  **Variables starting with `NEXT_PUBLIC_`**are exposed to the browser (client-side)
-  **Variables without `NEXT_PUBLIC_`**are server-side only (secure)

---

## Testing Your Setup

### Test Supabase Connection:

```bash
curl http://localhost:3000/api/health
# Should return: {"status":"ok","supabase":"connected"}
```

### Test Authentication:

1. Go to: `http://localhost:3000/signup`
2. Create test account
3. Check Supabase Dashboard → Authentication → Users for new user

### Test Stripe:

Use test card: `4242 4242 4242 4242` (any future date, any CVC)

### Test Claude API:

1. Upload CSV at: `http://localhost:3000/demo`
2. Check Anthropic Console for API usage

---

## Cost Estimates (for budgeting)

| Service                 | Plan             | Monthly Cost               |
| ----------------------- | ---------------- | -------------------------- |
| Supabase                | Free tier        | £0 (up to 50K users)       |
| Anthropic Claude        | Pay-per-use      | ~£0.003/request            |
| Stripe                  | Transaction fees | 1.5% + 20p per transaction |
| Vercel                  | Pro              | £20/month                  |
| **Total (pre-revenue)**|                  | **~£20-30/month**         |

---

## Troubleshooting

### "Supabase connection failed"

- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify project is active at app.supabase.com

### "Stripe error: Invalid API key"

- Ensure using correct environment keys (test vs live)
- Verify keys start with `sk_` and `pk_`

### "Anthropic API error"

- Check API key is valid at console.anthropic.com
- Verify billing is set up (requires credit card)

### "Environment variable undefined"

- Restart dev server after adding new variables
- In Vercel: redeploy after adding variables

---

**Need help?**Check:

- [Audio Intel Setup Guide](./docs/setup/SETUP_GUIDE.md)
- [Authentication Docs](./AUTH_IMPLEMENTATION_COMPLETE.md)
- [Deployment Guide](../../DEPLOYMENT_SETUP_GUIDE.md)
