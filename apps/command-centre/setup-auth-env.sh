#!/bin/bash

# Command Centre Authentication Setup Script
# This script sets up the environment variables for password protection

echo "🔒 Command Centre Authentication Setup"
echo "======================================"
echo ""

# Generate secure auth token
AUTH_TOKEN=$(openssl rand -base64 32)

echo "Generated secure auth token: $AUTH_TOKEN"
echo ""

# Prompt for password
echo "Choose a strong password for your Command Centre:"
read -s -p "Password: " PASSWORD
echo ""
read -s -p "Confirm password: " PASSWORD_CONFIRM
echo ""

if [ "$PASSWORD" != "$PASSWORD_CONFIRM" ]; then
    echo "❌ Passwords don't match. Please run the script again."
    exit 1
fi

echo ""
echo "Setting Vercel environment variables..."

# Set environment variables in Vercel
vercel env add COMMAND_CENTRE_PASSWORD production <<< "$PASSWORD"
vercel env add COMMAND_CENTRE_AUTH_TOKEN production <<< "$AUTH_TOKEN"

echo ""
echo "✅ Environment variables set successfully!"
echo ""
echo "Next steps:"
echo "1. Deploy your Command Centre: cd apps/command-centre && vercel --prod"
echo "2. Access it at your Vercel URL"
echo "3. Use the password you just set to log in"
echo ""
echo "⚠️  IMPORTANT: Save your password securely - there's no password recovery!"
