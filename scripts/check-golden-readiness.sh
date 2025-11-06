#!/bin/bash
# Check Golden Deployment Readiness
# Verifies all environment variables are configured before deploying

set -e

ROOT_DIR="/Users/chrisschofield/workspace/active/total-audio-platform"
cd "$ROOT_DIR"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Golden Deployment Readiness Check"
echo "======================================"
echo ""

READY=true

# Check 1: GitHub Secrets
echo "1️⃣  Checking GitHub Secrets..."
REQUIRED_SECRETS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "VERCEL_TOKEN"
    "VERCEL_ORG_ID"
    "VERCEL_PROJECT_ID"
    "VERCEL_PROJECT_ID_TRACKER"
    "VERCEL_PROJECT_ID_PITCH_GENERATOR"
    "VERCEL_PROJECT_ID_COMMAND_CENTRE"
    "VERCEL_PROJECT_ID_WEB"
)

unset GITHUB_TOKEN
SECRETS=$(gh secret list -R totalaudiopromo/total-audio-platform 2>&1 || echo "")

for secret in "${REQUIRED_SECRETS[@]}"; do
    if echo "$SECRETS" | grep -q "^$secret"; then
        echo -e "   ${GREEN}✓${NC} $secret"
    else
        echo -e "   ${RED}✗${NC} $secret MISSING"
        READY=false
    fi
done

# Optional secrets
for secret in "TELEGRAM_BOT_TOKEN" "TELEGRAM_CHAT_ID"; do
    if echo "$SECRETS" | grep -q "^$secret"; then
        echo -e "   ${GREEN}✓${NC} $secret (optional)"
    else
        echo -e "   ${YELLOW}⚠${NC} $secret (optional - notifications disabled)"
    fi
done

echo ""

# Check 2: Vercel Environment Variables for audio-intel
echo "2️⃣  Checking Vercel Environment Variables (audio-intel)..."
cd "$ROOT_DIR/apps/audio-intel"

VERCEL_VARS=$(vercel env ls production 2>&1 || echo "")

for var in "NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY"; do
    if echo "$VERCEL_VARS" | grep -q "$var"; then
        echo -e "   ${GREEN}✓${NC} $var"
    else
        echo -e "   ${RED}✗${NC} $var MISSING in audio-intel"
        READY=false
    fi
done

echo ""

# Check 3: Workflow Configuration
echo "3️⃣  Checking Workflow Configuration..."
WORKFLOW_FILE="$ROOT_DIR/.github/workflows/golden-deploy.yml"

if grep -q "VERCEL_PROJECT_ID_TRACKER" "$WORKFLOW_FILE" && \
   grep -q "VERCEL_PROJECT_ID_PITCH_GENERATOR" "$WORKFLOW_FILE" && \
   grep -q "VERCEL_PROJECT_ID_COMMAND_CENTRE" "$WORKFLOW_FILE" && \
   grep -q "VERCEL_PROJECT_ID_WEB" "$WORKFLOW_FILE"; then
    echo -e "   ${GREEN}✓${NC} All 5 project IDs in promote step"
else
    echo -e "   ${RED}✗${NC} Missing project IDs in workflow"
    READY=false
fi

if grep -q "web: 'total-audio-promo-frontend'" "$ROOT_DIR/scripts/golden-check.ts"; then
    echo -e "   ${GREEN}✓${NC} Package name mapping for web"
else
    echo -e "   ${RED}✗${NC} Missing package name mapping"
    READY=false
fi

echo ""

# Check 4: Git Status
echo "4️⃣  Checking Git Status..."
cd "$ROOT_DIR"

if [[ -z $(git status --porcelain) ]]; then
    echo -e "   ${GREEN}✓${NC} No uncommitted changes"
else
    echo -e "   ${YELLOW}⚠${NC} Uncommitted changes detected"
    git status --short
fi

echo ""

# Final Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$READY" = true ]; then
    echo -e "${GREEN}✅ READY TO DEPLOY!${NC}"
    echo ""
    echo "Next steps:"
    echo "  git tag v2.5.4-golden"
    echo "  git push origin v2.5.4-golden"
    echo ""
    echo "Monitor at: https://github.com/totalaudiopromo/total-audio-platform/actions"
else
    echo -e "${RED}❌ NOT READY - Fix issues above${NC}"
    echo ""
    echo "To fix missing Vercel env vars, run:"
    echo "  ./scripts/verify-and-add-vercel-vars.sh"
    echo ""
    echo "To fix missing GitHub secrets, add them at:"
    echo "  https://github.com/totalaudiopromo/total-audio-platform/settings/secrets/actions"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
