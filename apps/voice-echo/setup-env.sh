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
# Audio Intel Environment Configuration
# Replace with your actual API keys

# Required: Perplexity API for contact enrichment and research
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# Optional: Resend API for email notifications
RESEND_API_KEY=your_resend_api_key_here

# Optional: Stripe for payment processing
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Optional: Analytics and monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id_here

# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
EOF

echo "✅ Created .env.local file"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.local and add your Perplexity API key"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
echo "4. Visit: http://localhost:3000"
echo ""
echo "🔑 Get your Perplexity API key at: https://www.perplexity.ai/"
echo "" 