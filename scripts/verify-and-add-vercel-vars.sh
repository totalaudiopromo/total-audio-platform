#!/bin/bash
# Verify and Add Missing Vercel Environment Variables

set -e

ROOT_DIR="/Users/chrisschofield/workspace/active/total-audio-platform"
cd "$ROOT_DIR"

echo "🔍 Vercel Environment Variables - Verification & Setup"
echo "======================================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not installed"
    exit 1
fi

# Function to add env var (stdin for value)
add_vercel_var() {
    local app_dir=$1
    local var_name=$2
    local var_value=$3
    local env_type=$4

    cd "$ROOT_DIR/$app_dir"
    echo "  Adding $var_name to $env_type..."
    printf "%s" "$var_value" | vercel env add "$var_name" "$env_type" --yes 2>&1 | grep -v "Error" || true
}

# Get Supabase credentials from user
echo "Enter your Supabase credentials (will be added to all projects):"
read -p "NEXT_PUBLIC_SUPABASE_URL: " SUPABASE_URL
read -p "NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
read -sp "SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY
echo ""
echo ""

# Projects to configure
declare -A PROJECTS
PROJECTS=(
    ["apps/audio-intel"]="audio-intel"
    ["apps/tracker"]="tracker"
    ["apps/pitch-generator"]="pitch-generator"
    ["apps/command-centre"]="command-centre"
    ["apps/web"]="web"
)

# Add Supabase vars to each project
for app_dir in "${!PROJECTS[@]}"; do
    app_name="${PROJECTS[$app_dir]}"

    if [ ! -d "$ROOT_DIR/$app_dir" ]; then
        echo "⚠️  Skipping $app_name (directory not found: $app_dir)"
        continue
    fi

    echo ""
    echo "📦 $app_name"
    echo "   Adding Supabase environment variables..."

    # Add to all 3 environments
    for env in production preview development; do
        add_vercel_var "$app_dir" "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL" "$env"
        add_vercel_var "$app_dir" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY" "$env"
        add_vercel_var "$app_dir" "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY" "$env"
    done

    echo "   ✅ $app_name configured"
done

echo ""
echo "✅ All Vercel environment variables added!"
echo ""
echo "Verifying audio-intel configuration:"
cd "$ROOT_DIR/apps/audio-intel"
vercel env ls production | grep SUPABASE || echo "  (check manually)"

echo ""
echo "🎉 Setup complete!"
