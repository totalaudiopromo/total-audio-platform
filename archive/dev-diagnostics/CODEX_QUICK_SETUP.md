# 🚀 Codex Quick Setup - Copy & Paste Guide

## Settings Configuration

### Container Image

- Select: **`universal`**

### Container Caching

- **ON** ✅

### Setup Script

- **Manual** (NOT Automatic)
- Script content (paste into manual setup):

```bash
npm install -g pnpm@latest
pnpm install
```

### Agent Internet Access

- **ON** ✅ (Required for npm installs and API calls)

### Agent Browser Access

- **ON** ✅ (As requested - for testing web interfaces)

---

## Environment Variables (Copy & Paste)

Add these in the **Environment Variables** section:

**Note:** Values marked with ✅ are actual values found in your codebase. Values marked with ⚠️ need to be filled from your password manager/vault.

```bash
# Core Supabase (REQUIRED) ✅ Actual URLs found
NEXT_PUBLIC_SUPABASE_URL=https://lbtazcdqirgvmhvtwrbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=⚠️_your_supabase_anon_key_from_vault
SUPABASE_SERVICE_ROLE_KEY=⚠️_your_supabase_service_role_key_from_vault
SUPABASE_SERVICE_KEY=⚠️_your_supabase_service_role_key_from_vault
SUPABASE_URL=https://lbtazcdqirgvmhvtwrbc.supabase.co
SUPABASE_ANON_KEY=⚠️_your_supabase_anon_key_from_vault
# Tracker uses different Supabase instance (✅ Actual values):
# NEXT_PUBLIC_SUPABASE_URL=https://ucncbighzqudaszewjrv.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmNiaWdoenF1ZGFzemV3anJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTU2MjEsImV4cCI6MjA3NDQ5MTYyMX0.byAFslDRcX_Peto69Z7jG90CoWnQRaqNGOzhxteAgCI
DATABASE_URL=⚠️_postgresql://user:password@host:port/database

# AI Services (REQUIRED)
ANTHROPIC_API_KEY=⚠️_sk-ant-api03-your_key_from_vault
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
PERPLEXITY_API_KEY=⚠️_pplx-your_key_from_vault
OPENAI_API_KEY=⚠️_sk-your_openai_key_from_vault
GEMINI_API_KEY=⚠️_your_gemini_api_key_from_vault

# Stripe (REQUIRED)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_PRICE_MONTHLY=price_your_monthly_id
STRIPE_PRICE_ANNUAL=price_your_annual_id
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_your_monthly_id
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_your_annual_id
STRIPE_PRICE_FREE_MONTHLY=price_tracker_free
STRIPE_PRICE_PRO_MONTHLY=price_tracker_pro_19
STRIPE_PRICE_AGENCY_MONTHLY=price_tracker_agency_49

# Authentication
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Notion
NOTION_API_KEY=secret_your_key
NOTION_CONTENT_PAGE_ID=your_page_id
NOTION_DATABASE_ID=your_database_id

# Email Services ✅ Form IDs are actual values
RESEND_API_KEY=⚠️_re_your_key_from_vault
EMAIL_FROM=Audio Intel <exports@totalaudiopromo.com>
CONVERTKIT_API_KEY=⚠️_your_convertkit_key_from_vault
CONVERTKIT_API_SECRET=⚠️_your_convertkit_secret_from_vault
CONVERTKIT_FORM_ID=⚠️_your_form_id_from_vault
CONVERTKIT_ENTERPRISE_TRIAL_FORM_ID=8440957
CONVERTKIT_PRICING_FORM_ID=8405293
KIT_API_KEY=⚠️_your_convertkit_key_from_vault

# SMTP (Optional: email sending fallback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=your_app_password_here
SMTP_FROM=Audio Intel <you@example.com>

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID=your_google_client_id
GOOGLE_SHEETS_CLIENT_SECRET=your_google_secret
NEXT_PUBLIC_GMAIL_CLIENT_ID=your_google_client_id
GMAIL_CLIENT_SECRET=your_google_secret

# Airtable ✅ Base ID is actual value
AIRTABLE_API_KEY=⚠️_pat_your_token_from_vault
AIRTABLE_TOKEN=⚠️_pat_your_token_from_vault
AIRTABLE_BASE_ID=appx7uTQWRH8cIC20
NEXT_PUBLIC_AIRTABLE_CLIENT_ID=⚠️_your_airtable_client_id_from_vault
AIRTABLE_CLIENT_SECRET=⚠️_your_airtable_secret_from_vault

# Mailchimp
NEXT_PUBLIC_MAILCHIMP_CLIENT_ID=your_mailchimp_client_id
MAILCHIMP_CLIENT_SECRET=your_mailchimp_secret

# App URLs (Production)
PW_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3002
NEXT_PUBLIC_BASE_URL=http://localhost:3000
COMMAND_CENTRE_URL=http://localhost:3005
AUDIO_INTEL_API_URL=http://localhost:3000
PITCH_GENERATOR_API_URL=http://localhost:3001
TRACKER_API_URL=http://localhost:3002
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_API_KEY=your_api_key

# Production URLs
# NEXT_PUBLIC_BASE_URL=https://intel.totalaudiopromo.com
# NEXT_PUBLIC_APP_URL=https://tracker.totalaudiopromo.com
# NEXT_PUBLIC_BASE_URL=https://pitch.totalaudiopromo.com
# NEXT_PUBLIC_BASE_URL=https://tracker.totalaudiopromo.com
# COMMAND_CENTRE_URL=https://command.totalaudiopromo.com
# NEXT_PUBLIC_BASE_URL=https://dashboard.totalaudiopromo.com
# NEXT_PUBLIC_BASE_URL=https://totalaudiopromo.com
# AUDIO_INTEL_API_URL=https://intel.totalaudiopromo.com/api
# PITCH_GENERATOR_API_URL=https://pitch.totalaudiopromo.com/api
# TRACKER_API_URL=https://tracker.totalaudiopromo.com/api
# NEXT_PUBLIC_API_BASE_URL=https://api.totalaudiopromo.com

# Security & Configuration
CRON_SECRET=your_random_secret
NODE_ENV=development
PORT=3000
ADAPTIVE_TIMEOUT_RETRY=true

# Social Media (Command Centre)
BLUESKY_IDENTIFIER=your_handle.bsky.social
BLUESKY_APP_PASSWORD=your_bluesky_password
LINKEDIN_ACCESS_TOKEN=your_linkedin_token
LINKEDIN_PERSON_ID=your_linkedin_person_id
LINKEDIN_TOKEN_EXPIRES=your_linkedin_token_expires
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_API_VERSION=202401
LINKEDIN_SCOPES=openid profile email
FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_token
FACEBOOK_PAGE_ID=your_facebook_page_id

# Pitch Generator Stripe Prices
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_your_pro_id
STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_your_pro_annual_id
STRIPE_PRICE_AGENCY_MONTHLY=price_your_agency_id
STRIPE_PRICE_AGENCY_ANNUAL=price_your_agency_annual_id

# Demo Credentials ✅ Actual values from codebase
DEMO_USER_EMAIL=founder@totalaudiopromo.com
DEMO_USER_PASSWORD=buildfast

# Other Services ✅ Analytics ID is actual value
FIRECRAWL_API_KEY=⚠️_fc-your_key_from_vault
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=⚠️_your_verification_code_from_vault
NEXT_PUBLIC_BING_SITE_VERIFICATION=⚠️_your_bing_code_from_vault
NEXT_PUBLIC_ANALYTICS_ID=GTM-WZNJWDKH

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_SEO_ANALYSIS=false
ENABLE_EMAIL_VERIFICATION=false
ENABLE_ONBOARDING=false

# WARM API (Radio Promo Agent) ✅ Base URL and email are actual values
WARM_API_TOKEN=⚠️_your_warm_api_token_from_vault
WARM_API_BASE_URL=https://public-api.warmmusic.net/api/v1
WARM_API_EMAIL=promo@totalaudiopromo.com
WARM_API_PASSWORD=⚠️_your_warm_password_from_vault

# DataForSEO (Hybrid SEO Service)
DATAFORSEO_USERNAME=your_dataforseo_username
DATAFORSEO_PASSWORD=your_dataforseo_password

# Authentication & Security ✅ Admin email is actual value
JWT_SECRET=⚠️_your_jwt_secret_key_from_vault
ADMIN_EMAIL=chris@totalaudiopromo.com

# Discord Bot (Radio Promo Agent)
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_APP_ID=your_discord_app_id
DISCORD_GUILD_ID=your_discord_guild_id
DISCORD_BOT_TEST_CHANNEL_ID=your_discord_channel_id

# Monday.com Integration ✅ Board ID is actual value
MONDAY_API_KEY=⚠️_your_monday_api_key_from_vault
# Monday.com Board ID: 2443582331 (Liberty Music PR board)
MONDAY_BOARD_ID=2443582331

# Other Integrations
GOOGLE_CHAT_WEBHOOK=your_google_chat_webhook
TYPEFORM_API_KEY=your_typeform_api_key
MAILCHIMP_API_KEY=your_mailchimp_api_key

# Vercel Deployment (GitHub Actions) ✅ All project IDs and org ID are actual values
VERCEL_TOKEN=⚠️_your_vercel_token_from_vault
VERCEL_ORG_ID=team_YkDxhZ9BKq4kDxzxZGjQWlQR
VERCEL_PROJECT_ID=prj_3rSBMs1gaZj8uSg2XyCW31tzeF60
VERCEL_PROJECT_ID_AUDIO_INTEL=prj_3rSBMs1gaZj8uSg2XyCW31tzeF60
VERCEL_PROJECT_ID_TRACKER=prj_uiEWXtOUY3d9ly8JureSAcSXaoRd
VERCEL_PROJECT_ID_PITCH_GENERATOR=prj_3EJMQY0EfED1fFosCyOmJwmH4Unf
VERCEL_PROJECT_ID_COMMAND_CENTRE=prj_wFn8qksUxQ4zxJ0ATudZiqI62Ej9
VERCEL_PROJECT_ID_WEB=prj_ZlaEHqJPwOJ8XnQmW7FAUL9OiL7C
VERCEL_WEB_PROJECT_ID=prj_ZlaEHqJPwOJ8XnQmW7FAUL9OiL7C
VERCEL_AUDIO_INTEL_PROJECT_ID=prj_3rSBMs1gaZj8uSg2XyCW31tzeF60
VERCEL_PITCH_PROJECT_ID=prj_3EJMQY0EfED1fFosCyOmJwmH4Unf
VERCEL_TRACKER_PROJECT_ID=prj_uiEWXtOUY3d9ly8JureSAcSXaoRd

# GitHub Actions (CI/CD)
GITHUB_REF=refs/heads/main
GITHUB_ACTIONS=true
CI=false

# Testing
TEST_URL=http://localhost:3000
TEST_VAR=test_value

# Script Variables
TEXT=your_message_text
```

---

## Minimum Required (Start Here)

If you want to start with just the essentials:

```bash
# Absolute minimum for basic functionality
NEXT_PUBLIC_SUPABASE_URL=https://lbtazcdqirgvmhvtwrbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
ANTHROPIC_API_KEY=sk-ant-api03-your_key
PERPLEXITY_API_KEY=pplx-your_key
STRIPE_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

---

## Workspace Directory

Set workspace directory to:

```
/workspace/total-audio-platform
```

---

**💡 Tip:** Replace all `your_key`, `your_secret`, etc. placeholders with your actual values from your password manager or vault.

For full details, see `CODEX_CONFIGURATION.md`.
