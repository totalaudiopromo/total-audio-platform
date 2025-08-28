#!/bin/bash

echo "🚀 Setting up GitHub repository for Total Audio Promo Clean"
echo "=========================================================="
echo ""

echo "📋 Instructions to create the GitHub repository:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: total-audio-promo-clean"
echo "3. Description: Clean version of Total Audio Promo without large texture files"
echo "4. Make it Public (or Private if you prefer)"
echo "5. DO NOT initialize with README, .gitignore, or license"
echo "6. Click 'Create repository'"
echo ""

echo "⏳ Waiting for you to create the repository..."
echo "Press Enter when you've created the repository on GitHub..."
read

echo "🔄 Pushing clean code to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Success! Clean repository pushed to GitHub"
    echo "🌐 Your repository: https://github.com/chrisschofield/total-audio-promo-clean"
else
    echo "❌ Failed to push. Please check:"
    echo "   - Repository exists on GitHub"
    echo "   - You have write access"
    echo "   - Internet connection"
fi 