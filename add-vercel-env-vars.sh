#!/bin/bash

# Environment variables that we have
SUPABASE_URL="https://ucncbighzqudaszewjrv.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmNiaWdoenF1ZGFzemV3anJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTU2MjEsImV4cCI6MjA3NDQ5MTYyMX0.byAFslDRcX_Peto69Z7jG90CoWnQRaqNGOzhxteAgCI"
ANTHROPIC_API_KEY="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"
NEXTAUTH_SECRET="e7a1f8c2d3b4a5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9"

# Project directories
APPS=("audio-intel" "tracker" "pitch-generator" "command-centre" "web")

# Function to add env var to a project
add_env_var() {
    local app=$1
    local key=$2
    local value=$3
    local env_type=${4:-"production preview development"}

    echo "Adding $key to $app..."
    cd "/Users/chrisschofield/workspace/active/total-audio-platform/apps/$app"

    for env in $env_type; do
        echo "$value" | vercel env add "$key" "$env" 2>/dev/null || echo "  $key already exists in $env"
    done
}

# Add Supabase vars to all apps
echo "=== Adding Supabase environment variables to all apps ==="
for app in "${APPS[@]}"; do
    echo ""
    echo "📦 Processing $app..."
    add_env_var "$app" "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
    add_env_var "$app" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY"
done

# Add app-specific variables
echo ""
echo "=== Adding app-specific environment variables ==="

# Audio Intel specific
echo ""
echo "📦 Adding Audio Intel specific vars..."
add_env_var "audio-intel" "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
add_env_var "audio-intel" "NEXTAUTH_URL" "https://intel.totalaudiopromo.com"
add_env_var "audio-intel" "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"
add_env_var "audio-intel" "NEXT_PUBLIC_BASE_URL" "https://intel.totalaudiopromo.com"
add_env_var "audio-intel" "NODE_ENV" "production"

# Tracker specific
echo ""
echo "📦 Adding Tracker specific vars..."
add_env_var "tracker" "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
add_env_var "tracker" "NEXT_PUBLIC_APP_URL" "https://tracker.totalaudiopromo.com"
add_env_var "tracker" "NEXT_PUBLIC_BASE_URL" "https://tracker.totalaudiopromo.com"

# Pitch Generator specific
echo ""
echo "📦 Adding Pitch Generator specific vars..."
add_env_var "pitch-generator" "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
add_env_var "pitch-generator" "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"
add_env_var "pitch-generator" "NEXTAUTH_URL" "https://pitch.totalaudiopromo.com"
add_env_var "pitch-generator" "NEXT_PUBLIC_BASE_URL" "https://pitch.totalaudiopromo.com"

# Command Centre specific
echo ""
echo "📦 Adding Command Centre specific vars..."
add_env_var "command-centre" "COMMAND_CENTRE_URL" "https://command.totalaudiopromo.com"
add_env_var "command-centre" "AUDIO_INTEL_API_URL" "https://intel.totalaudiopromo.com"

# Web specific
echo ""
echo "📦 Adding Web specific vars..."
add_env_var "web" "NEXT_PUBLIC_BASE_URL" "https://totalaudiopromo.com"

echo ""
echo "✅ Environment variables added to all Vercel projects!"
echo ""
echo "Note: Some variables like STRIPE keys, social media tokens, etc. need to be added manually"
echo "as they are not available in the local env files."