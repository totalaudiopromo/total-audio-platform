#!/bin/bash

echo "🚀 Quick Google Cloud Console OAuth Setup"
echo "========================================"
echo ""
echo "This will open all the pages you need to configure OAuth."
echo "Just click the buttons as instructed below."
echo ""

# Open OAuth Consent Screen
echo "📱 Opening OAuth Consent Screen..."
open "https://console.cloud.google.com/apis/credentials/consent?project=gleaming-realm-471715-p3"

sleep 2

# Open OAuth Credentials
echo "🔑 Opening OAuth Credentials..."
open "https://console.cloud.google.com/apis/credentials?project=gleaming-realm-471715-p3"

sleep 2

# Open Gmail API
echo "📧 Opening Gmail API..."
open "https://console.cloud.google.com/apis/library/gmail.googleapis.com?project=gleaming-realm-471715-p3"

sleep 2

# Open Drive API
echo "💾 Opening Drive API..."
open "https://console.cloud.google.com/apis/library/drive.googleapis.com?project=gleaming-realm-471715-p3"

sleep 2

# Open Calendar API
echo "📅 Opening Calendar API..."
open "https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=gleaming-realm-471715-p3"

echo ""
echo "✅ All pages opened!"
echo ""
echo "📋 Now just follow these steps:"
echo ""
echo "1. OAuth Consent Screen page:"
echo "   - Click 'Edit App'"
echo "   - Add 'localhost' as authorized domain"
echo "   - Add '127.0.0.1' as authorized domain"
echo "   - Click 'Save and Continue'"
echo ""
echo "2. OAuth Credentials page:"
echo "   - Click the edit icon next to your OAuth 2.0 Client ID"
echo "   - Add these redirect URIs:"
echo "     * http://localhost:8080"
echo "     * urn:ietf:wg:oauth:2.0:oob"
echo "   - Click 'Save'"
echo ""
echo "3. API pages (Gmail, Drive, Calendar):"
echo "   - Click 'Enable' on each page"
echo ""
echo "4. Test the setup:"
echo "   node simple-oauth-test.js"
echo ""
echo "That's it! Takes about 2 minutes total."