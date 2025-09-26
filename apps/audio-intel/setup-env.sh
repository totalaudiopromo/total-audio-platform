#!/bin/bash

# Audio Intel Environment Setup Script
echo "🚀 Setting up Audio Intel environment..."

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

# Create .env.local with template
cat > .env.local << 'EOF'
############################################################
# Audio Intel Environment Configuration (.env.local)
# Replace any *_here placeholders with your real credentials
############################################################

# === Core URLs ===
NEXT_PUBLIC_BASE_URL=http://localhost:3000
PW_BASE_URL=http://localhost:3000

# === Notion (Required for Notion features) ===
NOTION_API_KEY=your_notion_internal_integration_secret_here
NOTION_CONTENT_PAGE_ID=your_notion_page_id_here

# === Perplexity (Required for enrichment/search) ===
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# === Anthropic Claude (Required for AI agent endpoints) ===
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# === Stripe (Required for payments) ===
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
# Optional price IDs
STRIPE_PRICE_MONTHLY=price_monthly_here
STRIPE_PRICE_ANNUAL=price_annual_here
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_monthly_here
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_annual_here

# === Resend (Optional: transactional email) ===
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=Audio Intel <exports@totalaudiopromo.com>

# === SMTP (Optional: some export routes) ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=your_app_password_here
SMTP_FROM=Audio Intel <you@example.com>

# === ConvertKit (Optional: marketing forms/events) ===
CONVERTKIT_API_KEY=your_convertkit_api_key_here
KIT_API_KEY=your_convertkit_api_key_here
CONVERTKIT_ENTERPRISE_TRIAL_FORM_ID=8440957
CONVERTKIT_PRICING_FORM_ID=8405293

# === Cron protection (Optional: background agent routes) ===
CRON_SECRET=your_random_bearer_token_here

# === Feature flags (Optional) ===
NEXT_PUBLIC_ENABLE_SEO_ANALYSIS=false
EOF

echo "✅ Created .env.local file"
echo ""
echo "📝 Next steps:"
echo "1. Open .env.local and replace *_here placeholders with real credentials"
echo "2. Ensure your Notion page is shared with the integration (Share → Add connections)"
echo "3. Run: npm install"
echo "4. Run: npm run dev"
echo "5. Test Notion: open http://localhost:3000/notion-test"
echo ""
echo "🔑 Get your Perplexity API key at: https://www.perplexity.ai/"
echo "" 