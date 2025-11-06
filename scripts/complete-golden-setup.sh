#!/bin/bash
# Complete Golden Deployment Setup
# Sets up ALL environment variables for GitHub Actions and Vercel

set -e

echo "🚀 Golden Deployment - Complete Setup Script"
echo "=============================================="
echo ""
echo "This script will:"
echo "  1. Add GitHub Secrets (for GitHub Actions builds)"
echo "  2. Add Vercel Environment Variables (for all 5 projects)"
echo "  3. Verify everything is configured correctly"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vercel project IDs
AUDIO_INTEL_PROJECT="prj_3rSBMs1gaZj8uSg2XyCW31tzeF60"
TRACKER_PROJECT="prj_uiEWXtOUY3d9ly8JureSAcSXaoRd"
PITCH_PROJECT="prj_3EJMQY0EfED1fFosCyOmJwmH4Unf"
COMMAND_PROJECT="prj_wFn8qksUxQ4zxJ0ATudZiqI62Ej9"
WEB_PROJECT="prj_ZlaEHqJPwOJ8XnQmW7FAUL9OiL7C"

REPO="totalaudiopromo/total-audio-platform"

# ==========================
# STEP 1: Collect Credentials
# ==========================

echo "📝 STEP 1: Enter your credentials"
echo "=================================="
echo ""

echo -e "${YELLOW}Supabase Credentials (required):${NC}"
read -p "NEXT_PUBLIC_SUPABASE_URL: " SUPABASE_URL
read -p "NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
read -sp "SUPABASE_SERVICE_ROLE_KEY (hidden): " SUPABASE_SERVICE_ROLE_KEY
echo ""
echo ""

echo -e "${YELLOW}Vercel Credentials (required):${NC}"
read -p "VERCEL_TOKEN: " VERCEL_TOKEN
echo ""

echo -e "${YELLOW}Other API Keys (required for functionality):${NC}"
read -p "ANTHROPIC_API_KEY: " ANTHROPIC_API_KEY
read -sp "STRIPE_SECRET_KEY: " STRIPE_SECRET_KEY
echo ""
read -p "NEXTAUTH_SECRET: " NEXTAUTH_SECRET
echo ""

echo -e "${YELLOW}Telegram (optional - press Enter to skip):${NC}"
read -p "TELEGRAM_BOT_TOKEN: " TELEGRAM_BOT_TOKEN
read -p "TELEGRAM_CHAT_ID: " TELEGRAM_CHAT_ID
echo ""

# ==========================
# STEP 2: Add GitHub Secrets
# ==========================

echo ""
echo "🔐 STEP 2: Adding GitHub Secrets"
echo "================================="
echo ""

# Check gh auth
if ! gh auth status &>/dev/null; then
  echo -e "${RED}GitHub CLI not authenticated!${NC}"
  echo "Please run: gh auth login"
  echo "Then run this script again."
  exit 1
fi

# Function to add GitHub secret
add_github_secret() {
  local secret_name=$1
  local secret_value=$2

  if [[ -n "$secret_value" ]]; then
    echo "  Adding $secret_name..."
    echo "$secret_value" | gh secret set "$secret_name" -R "$REPO" 2>&1 | grep -v "Updated" || true
  fi
}

# Add all GitHub secrets
add_github_secret "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
add_github_secret "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY"
add_github_secret "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
add_github_secret "VERCEL_TOKEN" "$VERCEL_TOKEN"
add_github_secret "VERCEL_ORG_ID" "team_YkDxhZ9BKq4kDxzxZGjQWlQR"
add_github_secret "VERCEL_PROJECT_ID" "$AUDIO_INTEL_PROJECT"
add_github_secret "VERCEL_PROJECT_ID_TRACKER" "$TRACKER_PROJECT"
add_github_secret "VERCEL_PROJECT_ID_PITCH_GENERATOR" "$PITCH_PROJECT"
add_github_secret "VERCEL_PROJECT_ID_COMMAND_CENTRE" "$COMMAND_PROJECT"
add_github_secret "VERCEL_PROJECT_ID_WEB" "$WEB_PROJECT"
add_github_secret "TELEGRAM_BOT_TOKEN" "$TELEGRAM_BOT_TOKEN"
add_github_secret "TELEGRAM_CHAT_ID" "$TELEGRAM_CHAT_ID"

echo -e "${GREEN}✅ GitHub Secrets added!${NC}"

# ==========================
# STEP 3: Add Vercel Env Vars
# ==========================

echo ""
echo "☁️  STEP 3: Adding Vercel Environment Variables"
echo "==============================================="
echo ""

# Function to add Vercel env var (all environments)
add_vercel_env() {
  local project_id=$1
  local var_name=$2
  local var_value=$3
  local env_type=$4  # production, preview, or development

  if [[ -n "$var_value" ]]; then
    # Use printf to avoid issues with special characters
    printf "%s" "$var_value" | vercel env add "$var_name" "$env_type" --yes 2>&1 | grep -v "Created" || true
  fi
}

# Function to add var to all 3 environments
add_to_all_envs() {
  local project_id=$1
  local var_name=$2
  local var_value=$3

  if [[ -n "$var_value" ]]; then
    # Set context to the project
    export VERCEL_PROJECT_ID="$project_id"
    export VERCEL_ORG_ID="team_YkDxhZ9BKq4kDxzxZGjQWlQR"

    add_vercel_env "$project_id" "$var_name" "$var_value" "production"
    add_vercel_env "$project_id" "$var_name" "$var_value" "preview"
    add_vercel_env "$project_id" "$var_name" "$var_value" "development"
  fi
}

# Add to audio-intel
echo -e "${YELLOW}📱 audio-intel${NC}"
cd apps/audio-intel 2>/dev/null || true
add_to_all_envs "$AUDIO_INTEL_PROJECT" "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
add_to_all_envs "$AUDIO_INTEL_PROJECT" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY"
add_to_all_envs "$AUDIO_INTEL_PROJECT" "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
add_to_all_envs "$AUDIO_INTEL_PROJECT" "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
add_to_all_envs "$AUDIO_INTEL_PROJECT" "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY"
add_to_all_envs "$AUDIO_INTEL_PROJECT" "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"
add_to_all_envs "$AUDIO_INTEL_PROJECT" "NEXTAUTH_URL" "https://intel.totalaudiopromo.com"
add_to_all_envs "$AUDIO_INTEL_PROJECT" "NEXT_PUBLIC_BASE_URL" "https://intel.totalaudiopromo.com"
add_to_all_envs "$AUDIO_INTEL_PROJECT" "NODE_ENV" "production"
cd ../..
echo -e "${GREEN}  ✅ audio-intel configured${NC}"

# Add to tracker
echo -e "${YELLOW}📊 tracker${NC}"
cd apps/tracker 2>/dev/null || true
add_to_all_envs "$TRACKER_PROJECT" "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
add_to_all_envs "$TRACKER_PROJECT" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY"
add_to_all_envs "$TRACKER_PROJECT" "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
add_to_all_envs "$TRACKER_PROJECT" "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
add_to_all_envs "$TRACKER_PROJECT" "NEXT_PUBLIC_APP_URL" "https://tracker.totalaudiopromo.com"
add_to_all_envs "$TRACKER_PROJECT" "NEXT_PUBLIC_BASE_URL" "https://tracker.totalaudiopromo.com"
cd ../..
echo -e "${GREEN}  ✅ tracker configured${NC}"

# Add to pitch-generator
echo -e "${YELLOW}✉️  pitch-generator${NC}"
cd apps/pitch-generator 2>/dev/null || true
add_to_all_envs "$PITCH_PROJECT" "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
add_to_all_envs "$PITCH_PROJECT" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY"
add_to_all_envs "$PITCH_PROJECT" "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
add_to_all_envs "$PITCH_PROJECT" "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
add_to_all_envs "$PITCH_PROJECT" "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"
add_to_all_envs "$PITCH_PROJECT" "NEXTAUTH_URL" "https://pitch.totalaudiopromo.com"
add_to_all_envs "$PITCH_PROJECT" "NEXT_PUBLIC_BASE_URL" "https://pitch.totalaudiopromo.com"
cd ../..
echo -e "${GREEN}  ✅ pitch-generator configured${NC}"

# Add to command-centre
echo -e "${YELLOW}🎛️  command-centre${NC}"
cd apps/command-centre 2>/dev/null || true
add_to_all_envs "$COMMAND_PROJECT" "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
add_to_all_envs "$COMMAND_PROJECT" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY"
add_to_all_envs "$COMMAND_PROJECT" "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
add_to_all_envs "$COMMAND_PROJECT" "COMMAND_CENTRE_URL" "https://command.totalaudiopromo.com"
add_to_all_envs "$COMMAND_PROJECT" "AUDIO_INTEL_API_URL" "https://intel.totalaudiopromo.com"
cd ../..
echo -e "${GREEN}  ✅ command-centre configured${NC}"

# Add to web
echo -e "${YELLOW}🌐 web${NC}"
cd apps/web 2>/dev/null || true
add_to_all_envs "$WEB_PROJECT" "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
add_to_all_envs "$WEB_PROJECT" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY"
add_to_all_envs "$WEB_PROJECT" "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
add_to_all_envs "$WEB_PROJECT" "NEXT_PUBLIC_BASE_URL" "https://totalaudiopromo.com"
cd ../..
echo -e "${GREEN}  ✅ web configured${NC}"

echo ""
echo -e "${GREEN}✅ Vercel environment variables added to all 5 projects!${NC}"

# ==========================
# STEP 4: Verification
# ==========================

echo ""
echo "🔍 STEP 4: Verification"
echo "======================="
echo ""

echo "GitHub Secrets:"
gh secret list -R "$REPO" 2>&1 | head -15 || echo "  (authentication required)"

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "📋 Next Steps:"
echo "  1. Commit any changes: git add . && git commit -m 'chore: update deployment scripts'"
echo "  2. Deploy: git tag v2.5.4-golden && git push origin v2.5.4-golden"
echo "  3. Monitor: https://github.com/totalaudiopromo/total-audio-platform/actions"
echo ""
