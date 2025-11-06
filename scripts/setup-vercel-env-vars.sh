#!/bin/bash
# Setup Vercel Environment Variables for Golden Deployment
# This script adds the required environment variables to all 5 Vercel projects

set -e  # Exit on error

echo "🔧 Vercel Environment Variables Setup Script"
echo "=============================================="
echo ""

# Vercel project IDs
AUDIO_INTEL_PROJECT="prj_3rSBMs1gaZj8uSg2XyCW31tzeF60"
TRACKER_PROJECT="prj_uiEWXtOUY3d9ly8JureSAcSXaoRd"
PITCH_PROJECT="prj_3EJMQY0EfED1fFosCyOmJwmH4Unf"
COMMAND_PROJECT="prj_wFn8qksUxQ4zxJ0ATudZiqI62Ej9"
WEB_PROJECT="prj_ZlaEHqJPwOJ8XnQmW7FAUL9OiL7C"

# Prompt for Supabase credentials (these are the same for all projects)
echo "📋 First, we need your Supabase credentials (same for all 5 projects):"
echo ""

read -p "NEXT_PUBLIC_SUPABASE_URL (e.g., https://xxx.supabase.co): " SUPABASE_URL
read -p "NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
read -sp "SUPABASE_SERVICE_ROLE_KEY (hidden): " SUPABASE_SERVICE_ROLE_KEY
echo ""
echo ""

# Function to add env var to all 3 environments
add_env_var() {
  local project_id=$1
  local var_name=$2
  local var_value=$3
  local project_name=$4

  echo "  Adding $var_name to $project_name..."

  # Add to Production
  echo "$var_value" | vercel env add "$var_name" production --project-id="$project_id" --yes 2>/dev/null || true

  # Add to Preview
  echo "$var_value" | vercel env add "$var_name" preview --project-id="$project_id" --yes 2>/dev/null || true

  # Add to Development
  echo "$var_value" | vercel env add "$var_name" development --project-id="$project_id" --yes 2>/dev/null || true
}

# Function to add Supabase vars to a project
add_supabase_vars() {
  local project_id=$1
  local project_name=$2

  echo ""
  echo "🔹 Setting up $project_name..."

  add_env_var "$project_id" "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL" "$project_name"
  add_env_var "$project_id" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY" "$project_name"
  add_env_var "$project_id" "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY" "$project_name"

  echo "  ✅ Supabase vars added to $project_name"
}

echo "🚀 Adding Supabase environment variables to all 5 projects..."
echo ""

# Add Supabase vars to all 5 projects
add_supabase_vars "$AUDIO_INTEL_PROJECT" "audio-intel"
add_supabase_vars "$TRACKER_PROJECT" "tracker"
add_supabase_vars "$PITCH_PROJECT" "pitch-generator"
add_supabase_vars "$COMMAND_PROJECT" "command-centre"
add_supabase_vars "$WEB_PROJECT" "web"

echo ""
echo "✅ Core Supabase variables added to all 5 projects!"
echo ""
echo "📋 App-Specific Variables (Optional - Add Manually if Needed):"
echo ""
echo "audio-intel needs:"
echo "  - STRIPE_SECRET_KEY"
echo "  - ANTHROPIC_API_KEY"
echo "  - NEXTAUTH_URL"
echo "  - NEXTAUTH_SECRET"
echo "  - NEXT_PUBLIC_BASE_URL"
echo ""
echo "tracker needs:"
echo "  - ANTHROPIC_API_KEY"
echo "  - NEXT_PUBLIC_APP_URL"
echo ""
echo "pitch-generator needs:"
echo "  - ANTHROPIC_API_KEY"
echo "  - NEXTAUTH_SECRET"
echo "  - NEXTAUTH_URL"
echo "  - NEXT_PUBLIC_BASE_URL"
echo ""
echo "command-centre needs:"
echo "  - COMMAND_CENTRE_URL"
echo "  - AUDIO_INTEL_API_URL"
echo ""
echo "web needs:"
echo "  - NEXT_PUBLIC_BASE_URL"
echo ""
echo "Would you like to add app-specific variables now? (y/n)"
read -p "> " ADD_APP_SPECIFIC

if [[ "$ADD_APP_SPECIFIC" == "y" ]]; then
  echo ""
  echo "🔹 Adding app-specific variables..."
  echo ""

  # audio-intel specific
  echo "📱 audio-intel variables:"
  read -sp "STRIPE_SECRET_KEY: " STRIPE_SECRET_KEY
  echo ""
  read -p "ANTHROPIC_API_KEY: " ANTHROPIC_API_KEY
  read -p "NEXTAUTH_SECRET: " NEXTAUTH_SECRET

  add_env_var "$AUDIO_INTEL_PROJECT" "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY" "audio-intel"
  add_env_var "$AUDIO_INTEL_PROJECT" "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY" "audio-intel"
  add_env_var "$AUDIO_INTEL_PROJECT" "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "audio-intel"
  add_env_var "$AUDIO_INTEL_PROJECT" "NEXTAUTH_URL" "https://intel.totalaudiopromo.com" "audio-intel"
  add_env_var "$AUDIO_INTEL_PROJECT" "NEXT_PUBLIC_BASE_URL" "https://intel.totalaudiopromo.com" "audio-intel"
  add_env_var "$AUDIO_INTEL_PROJECT" "NODE_ENV" "production" "audio-intel"

  # tracker specific
  echo ""
  echo "📊 tracker variables:"
  add_env_var "$TRACKER_PROJECT" "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY" "tracker"
  add_env_var "$TRACKER_PROJECT" "NEXT_PUBLIC_APP_URL" "https://tracker.totalaudiopromo.com" "tracker"
  add_env_var "$TRACKER_PROJECT" "NEXT_PUBLIC_BASE_URL" "https://tracker.totalaudiopromo.com" "tracker"

  # pitch-generator specific
  echo ""
  echo "✉️  pitch-generator variables:"
  add_env_var "$PITCH_PROJECT" "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY" "pitch-generator"
  add_env_var "$PITCH_PROJECT" "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "pitch-generator"
  add_env_var "$PITCH_PROJECT" "NEXTAUTH_URL" "https://pitch.totalaudiopromo.com" "pitch-generator"
  add_env_var "$PITCH_PROJECT" "NEXT_PUBLIC_BASE_URL" "https://pitch.totalaudiopromo.com" "pitch-generator"

  # command-centre specific
  echo ""
  echo "🎛️  command-centre variables:"
  add_env_var "$COMMAND_PROJECT" "COMMAND_CENTRE_URL" "https://command.totalaudiopromo.com" "command-centre"
  add_env_var "$COMMAND_PROJECT" "AUDIO_INTEL_API_URL" "https://intel.totalaudiopromo.com" "command-centre"

  # web specific
  echo ""
  echo "🌐 web variables:"
  add_env_var "$WEB_PROJECT" "NEXT_PUBLIC_BASE_URL" "https://totalaudiopromo.com" "web"

  echo ""
  echo "✅ All app-specific variables added!"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Verify variables in Vercel dashboard"
echo "2. Check GitHub Secrets are configured"
echo "3. Deploy with: git tag v2.5.4-golden && git push origin v2.5.4-golden"
echo ""
