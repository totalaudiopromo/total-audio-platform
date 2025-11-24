# 🤖 Codex Configuration for Total Audio Platform

## Recommended Settings

### Container Image

- **Select:** `universal` (Ubuntu 24.04 based)
- **Workspace directory:** `/workspace/total-audio-platform`
- ✅ **Preinstalled packages:** Useful for common dependencies

### Container Caching

- **Toggle:** `On` ✅
- Speeds up container start by caching state after running the setup script

### Setup Script

- **Toggle:** `Manual` (NOT Automatic)
- **Reason:** This is a pnpm monorepo with specific setup requirements

**Manual Setup Script Content:**

```bash
# Install pnpm if not present
npm install -g pnpm@latest

# Install all dependencies
pnpm install

# Build shared packages (if needed)
pnpm --filter @total-audio/* build || true
```

### Agent Internet Access

- **Toggle:** `On` ✅
- **Required for:**
  - Installing npm packages
  - Making API calls to external services (Anthropic, Stripe, Supabase, etc.)
  - Fetching dependencies during development

---

## Environment Variables

Add all of these in the **Environment Variables** section:

### 🎯 Core Supabase (REQUIRED - All Apps)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://lbtazcdqirgvmhvtwrbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 🤖 AI Services (REQUIRED)

```bash
# Anthropic Claude API (for Audio Intel & Pitch Generator)
ANTHROPIC_API_KEY=sk-ant-api03-your_anthropic_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Perplexity AI (for contact enrichment in Audio Intel)
PERPLEXITY_API_KEY=pplx-your_perplexity_key_here
```

### 💳 Stripe (REQUIRED - Payment Processing)

```bash
# Audio Intel Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_PRICE_MONTHLY=price_your_monthly_price_id
STRIPE_PRICE_ANNUAL=price_your_annual_price_id
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_your_monthly_price_id
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_your_annual_price_id

# Pitch Generator Stripe Configuration
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_your_professional_monthly_id
STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_your_professional_annual_id
STRIPE_PRICE_AGENCY_MONTHLY=price_your_agency_monthly_id
STRIPE_PRICE_AGENCY_ANNUAL=price_your_agency_annual_id
```

### 🔐 Authentication (Pitch Generator & Audio Intel)

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your_random_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Audio Intel Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Pitch Generator URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3001

# Demo User Credentials (for testing)
DEMO_USER_EMAIL=founder@totalaudiopromo.com
DEMO_USER_PASSWORD=buildfast
```

### 📝 Notion Integration (Audio Intel)

```bash
NOTION_API_KEY=secret_your_notion_integration_key_here
NOTION_CONTENT_PAGE_ID=your_notion_page_id_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

### 📧 Email Services (Optional but Recommended)

```bash
# Resend (Transactional Email)
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM=Audio Intel <exports@totalaudiopromo.com>

# ConvertKit (Marketing Automation)
CONVERTKIT_API_KEY=your_convertkit_api_key_here
CONVERTKIT_API_SECRET=your_convertkit_secret_here
CONVERTKIT_FORM_ID=your_convertkit_form_id_here
CONVERTKIT_ENTERPRISE_TRIAL_FORM_ID=8440957
CONVERTKIT_PRICING_FORM_ID=8405293
```

### 🔌 OAuth Integrations (Tracker App)

```bash
# Google OAuth (for Sheets/Gmail integrations)
NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID=your_google_client_id_here
GOOGLE_SHEETS_CLIENT_SECRET=your_google_client_secret_here
NEXT_PUBLIC_GMAIL_CLIENT_ID=your_google_client_id_here
GMAIL_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Airtable OAuth
NEXT_PUBLIC_AIRTABLE_CLIENT_ID=your_airtable_client_id_here
AIRTABLE_CLIENT_SECRET=your_airtable_secret_here
AIRTABLE_API_KEY=pat_your_airtable_personal_access_token_here
AIRTABLE_BASE_ID=appx7uTQWRH8cIC20

# Mailchimp OAuth
NEXT_PUBLIC_MAILCHIMP_CLIENT_ID=your_mailchimp_client_id_here
MAILCHIMP_CLIENT_SECRET=your_mailchimp_secret_here
```

### 🌐 App URLs

```bash
# Audio Intel
PW_BASE_URL=http://localhost:3000

# Tracker
NEXT_PUBLIC_APP_URL=http://localhost:3002

# Command Centre
COMMAND_CENTRE_URL=http://localhost:3005
AUDIO_INTEL_API_URL=http://localhost:3000
```

### 🔒 Security & Cron Protection

```bash
# Cron Secret (for protected background jobs)
CRON_SECRET=your_random_cron_secret_here

# Node Environment
NODE_ENV=development
```

### 🐦 Social Media APIs (Command Centre)

```bash
# BlueSky
BLUESKY_IDENTIFIER=your_handle.bsky.social
BLUESKY_APP_PASSWORD=your_bluesky_app_password_here

# LinkedIn
LINKEDIN_ACCESS_TOKEN=your_linkedin_token_here

# Facebook
FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_page_token_here
FACEBOOK_PAGE_ID=your_facebook_page_id_here
```

### 📊 Analytics & SEO (Optional)

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_google_verification_code
NEXT_PUBLIC_BING_SITE_VERIFICATION=your_bing_verification_code
```

### 🔧 Development Tools

```bash
# Playwright Testing
PW_BASE_URL=http://localhost:3000

# Firecrawl (for web scraping in API)
FIRECRAWL_API_KEY=fc-your_firecrawl_api_key_here
```

---

## Secrets (Add in Secrets Section)

If Codex supports a Secrets section separate from Environment Variables, add these sensitive keys there instead:

- `ANTHROPIC_API_KEY`
- `PERPLEXITY_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`
- `CRON_SECRET`
- All OAuth client secrets
- All API keys that should not be exposed

---

## Complete Setup Checklist

### ✅ Container Settings

- [ ] Container image: `universal`
- [ ] Workspace directory: `/workspace/total-audio-platform`
- [ ] Container caching: `On`
- [ ] Setup script: `Manual` (with pnpm install commands)
- [ ] Agent internet access: `On` ✅

### ✅ Environment Variables (Minimum Required for Development)

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `ANTHROPIC_API_KEY`
- [ ] `PERPLEXITY_API_KEY` (for Audio Intel)
- [ ] `STRIPE_SECRET_KEY` (test keys for dev)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (test keys for dev)
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXT_PUBLIC_BASE_URL`

### ✅ Optional but Recommended

- [ ] `NOTION_API_KEY` (if using Notion features)
- [ ] `RESEND_API_KEY` (if using email features)
- [ ] `CONVERTKIT_API_KEY` (if using marketing features)
- [ ] Google OAuth credentials (if using tracker integrations)

---

## Quick Reference Commands

Once configured, Codex can use these commands:

```bash
# Install dependencies
pnpm install

# Start specific app
pnpm --filter audio-intel dev        # Port 3000
pnpm --filter pitch-generator dev    # Port 3001
pnpm --filter tracker dev            # Port 3002

# Start all apps
pnpm dev:all

# Build specific app
pnpm build:audio-intel
pnpm build:pitch-generator

# Type check
pnpm typecheck:all

# Lint
pnpm lint:all

# Run tests
pnpm test
pnpm test:audio-intel
```

---

## Notes

1. **Test Keys for Development:** Use Stripe test keys (`sk_test_` and `pk_test_`) when setting up for local development
2. **Environment-Specific:** Some variables may need different values for production vs development
3. **Monorepo Structure:** Remember this is a pnpm workspace, so all commands should use `pnpm --filter <app-name>` or workspace scripts
4. **Browser Access:** Enable agent browser access if you need to test web interfaces or scrape data
5. **Internet Access:** Keep enabled for npm package installation and API calls

---

## Where to Get API Keys

- **Supabase:** https://app.supabase.com → Project Settings → API
- **Anthropic:** https://console.anthropic.com/ → API Keys
- **Perplexity:** https://www.perplexity.ai/settings/api
- **Stripe:** https://dashboard.stripe.com → Developers → API Keys
- **Notion:** https://www.notion.so/my-integrations
- **Resend:** https://resend.com/api-keys
- **ConvertKit:** https://app.convertkit.com/account_settings/advanced_settings

---

**Need to update this config?** This file lives at the root of your repo and can be updated as your environment requirements change.
