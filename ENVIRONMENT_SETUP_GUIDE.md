# 🚀 Total Audio Platform - Environment Setup Guide

## Overview
I've created `.env.local` files for all your apps with the correct configuration templates. Here's what you need to do to get everything working:

## 🎯 Priority Apps (Revenue Critical)

### 1. Audio Intel (Port 3000) - PRIMARY REVENUE APP
**Location**: `apps/audio-intel/.env.local`

**CRITICAL FOR PAYMENTS:**
```env
# Stripe Configuration (REQUIRED for payments)
STRIPE_SECRET_KEY=sk_live_your_actual_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_stripe_publishable_key
```

**CORE FEATURES:**
```env
# Perplexity AI (REQUIRED for contact enrichment)
PERPLEXITY_API_KEY=pplx-your_actual_perplexity_api_key

# Anthropic Claude (REQUIRED for AI agents)
ANTHROPIC_API_KEY=sk-ant-your_actual_anthropic_api_key

# Notion (REQUIRED for content management)
NOTION_API_KEY=secret_your_actual_notion_integration_key
NOTION_CONTENT_PAGE_ID=your_actual_notion_page_id
```

**OPTIONAL BUT RECOMMENDED:**
```env
# Email notifications
RESEND_API_KEY=re_your_actual_resend_api_key

# Marketing automation
CONVERTKIT_API_KEY=your_actual_convertkit_api_key
```

### 2. API Backend (Port 3001)
**Location**: `apps/api/.env.local`

**CRITICAL:**
```env
# Airtable (REQUIRED for contact management)
AIRTABLE_API_KEY=pat_your_actual_airtable_personal_access_token
AIRTABLE_BASE_ID=appx7uTQWRH8cIC20  # Your actual base ID

# Firecrawl (REQUIRED for web scraping)
FIRECRAWL_API_KEY=fc-your_actual_firecrawl_api_key

# AI Services
PERPLEXITY_API_KEY=pplx-your_actual_perplexity_api_key
ANTHROPIC_API_KEY=sk-ant-your_actual_anthropic_api_key
```

### 3. Command Centre (Port 3005)
**Location**: `apps/command-centre/.env.local`

**REQUIRED:**
```env
# Notion (for business metrics)
NOTION_API_KEY=secret_your_actual_notion_integration_key

# ConvertKit (for subscriber management)
CONVERTKIT_API_SECRET=your_actual_convertkit_api_secret
```

## 🎵 Secondary Apps

### 4. Playlist Pulse (Port 3002)
**Location**: `apps/playlist-pulse/.env.local`

**FOR AUTHENTICATION:**
```env
NEXTAUTH_SECRET=your_32_character_random_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

**FOR PAYMENTS:**
```env
STRIPE_SECRET_KEY=sk_live_your_actual_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_stripe_publishable_key
```

### 5. Voice Echo (Port 3000 - different from Audio Intel)
**Location**: `apps/voice-echo/.env.local`

**REQUIRED:**
```env
PERPLEXITY_API_KEY=pplx-your_actual_perplexity_api_key
```

### 6. Web App (Port 3003)
**Location**: `apps/web/.env.local`

**REQUIRED:**
```env
AIRTABLE_TOKEN=pat_your_actual_airtable_personal_access_token
AIRTABLE_API_KEY=pat_your_actual_airtable_personal_access_token
```

### 7. Tracker (Port 3004)
**Location**: `apps/tracker/.env.local`

**REQUIRED:**
```env
AIRTABLE_API_KEY=pat_your_actual_airtable_personal_access_token
AIRTABLE_BASE_ID=your_actual_airtable_base_id
```

### 8. Content Domination (Port 3006)
**Location**: `apps/content-domination/.env.local`

**REQUIRED:**
```env
PERPLEXITY_API_KEY=pplx-your_actual_perplexity_api_key
ANTHROPIC_API_KEY=sk-ant-your_actual_anthropic_api_key
```

## 🔑 How to Get Your API Keys

### Stripe (CRITICAL for payments)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your **Secret Key** (starts with `sk_live_` or `sk_test_`)
3. Get your **Publishable Key** (starts with `pk_live_` or `pk_test_`)

### Perplexity AI (CRITICAL for contact enrichment)
1. Go to [Perplexity AI](https://www.perplexity.ai/)
2. Sign up and get your API key from the dashboard
3. Key starts with `pplx-`

### Anthropic Claude (CRITICAL for AI features)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Key starts with `sk-ant-`

### Airtable (CRITICAL for data management)
1. Go to [Airtable Account](https://airtable.com/account)
2. Generate a Personal Access Token
3. Token starts with `pat`

### Notion (CRITICAL for content management)
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the Internal Integration Secret
4. Share your pages with the integration

### Firecrawl (CRITICAL for web scraping)
1. Go to [Firecrawl](https://firecrawl.dev/)
2. Sign up and get your API key
3. Key starts with `fc-`

### ConvertKit (for marketing)
1. Go to [ConvertKit](https://app.convertkit.com/)
2. Get API Secret from Settings > Advanced

## 🚨 IMMEDIATE ACTION REQUIRED

1. **Replace ALL `*_here` placeholders** in the `.env.local` files with your actual API keys
2. **Start with Audio Intel** - this is your primary revenue app
3. **Test payments** by running Audio Intel and trying a checkout flow
4. **Verify Airtable connections** by running the API backend

## 🧪 Testing Your Setup

After updating the environment variables:

```bash
# Test Audio Intel (primary revenue app)
cd apps/audio-intel
npm run dev

# Test API backend
cd apps/api
npm run dev

# Test payments
# Visit http://localhost:3000 and try the checkout flow
```

## 💡 Pro Tips

- **Use test keys first** for Stripe to avoid real charges during development
- **Keep your keys secure** - never commit `.env.local` files to git
- **Start with Audio Intel** - it's your money maker
- **Test the complete flow**: signup → upload → enrichment → payment

## 🔧 Troubleshooting

If you get errors:
1. Check that all `*_here` placeholders are replaced
2. Verify API keys are valid and have proper permissions
3. Ensure your Notion pages are shared with integrations
4. Check that Stripe webhooks are configured for production

---

**Remember**: Audio Intel is THE priority. Get that working first, then worry about the other apps. Your revenue depends on it! 🎯

