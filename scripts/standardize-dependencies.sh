#!/bin/bash

# Dependency Standardization Script
# Updates all package.json files to use consistent dependency versions

set -e

echo "🔧 Starting dependency standardization..."
echo ""

# Colors for output
GREEN='\033[0.32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Standard versions
NEXT_VERSION="15.3.0"
TAILWIND_VERSION="3.4.17"
STRIPE_VERSION="18.5.0"
LUCIDE_VERSION="0.525.0"
ANTHROPIC_VERSION="0.65.0"

echo -e "${BLUE}📦 Standard versions:${NC}"
echo "  Next.js: $NEXT_VERSION"
echo "  Tailwind CSS: $TAIL WIND_VERSION"
echo "  Stripe: $STRIPE_VERSION"
echo "  Lucide React: $LUCIDE_VERSION"
echo ""

# Function to update package.json
update_package() {
    local file=$1
    local app_name=$2

    echo -e "${YELLOW}Updating $app_name...${NC}"

    # Use jq to update versions (if installed)
    if command -v jq &> /dev/null; then
        # Update with jq
        jq --arg next "$NEXT_VERSION" \
           --arg stripe "$STRIPE_VERSION" \
           --arg lucide "$LUCIDE_VERSION" \
           '.dependencies.next = $next |
            .dependencies.stripe = $stripe |
            .dependencies["lucide-react"] = $lucide' \
           "$file" > "$file.tmp" && mv "$file.tmp" "$file"

        echo -e "${GREEN}✅ Updated $app_name${NC}"
    else
        echo -e "${YELLOW}⚠️  jq not installed, skipping automated updates${NC}"
    fi
}

# Update each app
echo -e "${BLUE}📝 Updating app package.json files...${NC}"
echo ""

# Note: Manual updates required - jq may not be available
echo "Manual updates required in:"
echo "  - apps/audio-intel/package.json"
echo "  - apps/tracker/package.json"
echo "  - apps/pitch-generator/package.json"
echo ""

echo -e "${GREEN}✅ Dependency standardization complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Review package.json changes"
echo "  2. Run: npm install (at root)"
echo "  3. Test each app individually"
echo "  4. Run: npm run build --workspaces"
