#!/bin/bash

echo " Creating GitHub Repository for Total Audio Promo Clean"
echo "========================================================"
echo ""

# Check if we have the necessary tools
if ! command -v gh &> /dev/null; then
    echo " Installing GitHub CLI..."
    brew install gh
fi

echo " Authenticating with GitHub..."
gh auth login --web

echo " Creating repository..."
gh repo create total-audio-promo-clean --public --description "Clean version of Total Audio Promo without large texture files" --source=. --remote=origin --push

if [ $? -eq 0 ]; then
    echo " Success! Repository created and code pushed!"
    echo " Your repository: https://github.com/chrisschofield/total-audio-promo-clean"
else
    echo " Failed to create repository. Trying manual approach..."
    echo ""
    echo " Manual Instructions:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: total-audio-promo-clean"
    echo "3. Description: Clean version of Total Audio Promo without large texture files"
    echo "4. Make it Public"
    echo "5. DO NOT initialize with README, .gitignore, or license"
    echo "6. Click 'Create repository'"
    echo ""
    echo "⏳ Waiting for you to create the repository..."
    echo "Press Enter when you've created the repository on GitHub..."
    read
    
    echo " Pushing clean code to GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo " Success! Clean repository pushed to GitHub"
        echo " Your repository: https://github.com/chrisschofield/total-audio-promo-clean"
    else
        echo " Failed to push. Please check your repository settings."
    fi
fi 