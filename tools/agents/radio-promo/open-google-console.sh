#!/bin/bash

echo "🚀 Opening Google Cloud Console Pages for OAuth Fix"
echo "================================================="
echo ""
echo "This will open the 3 pages you need to configure OAuth:"
echo ""
echo "1. OAuth Consent Screen - Add test user"
echo "2. OAuth Credentials - Add redirect URIs"
echo "3. APIs - Verify enabled"
echo ""

# OAuth Consent Screen
echo "📱 Opening OAuth Consent Screen..."
open "https://console.cloud.google.com/apis/credentials/consent?project=gleaming-realm-471715-p3"
sleep 2

# OAuth Credentials
echo "🔑 Opening OAuth Credentials..."
open "https://console.cloud.google.com/apis/credentials?project=gleaming-realm-471715-p3"
sleep 2

# Gmail API
echo "📧 Opening Gmail API..."
open "https://console.cloud.google.com/apis/library/gmail.googleapis.com?project=gleaming-realm-471715-p3"
sleep 1

# Drive API
echo "💾 Opening Drive API..."
open "https://console.cloud.google.com/apis/library/drive.googleapis.com?project=gleaming-realm-471715-p3"
sleep 1

# Calendar API
echo "📅 Opening Calendar API..."
open "https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=gleaming-realm-471715-p3"

echo ""
echo "✅ All pages opened!"
echo ""
echo "📋 Follow the steps in COMPLETE-OAUTH-FIX-GUIDE.md"
echo ""
echo "🚀 After fixing Google Cloud Console, run:"
echo "   node foolproof-oauth-setup.js"
echo ""