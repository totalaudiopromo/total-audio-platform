#!/bin/bash

echo "🔐 Setting up Google MCP OAuth Authentication"
echo "============================================="

# Check if we have the client credentials
echo "Using OAuth Client ID: 309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com"

# Set environment variables for OAuth
export GOOGLE_CLIENT_ID="309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com"

echo "📧 Starting Gmail MCP server with OAuth..."
echo "This should open a browser window for authentication."
echo ""
echo "If prompted, use your Google account credentials."
echo "Once authenticated, the server should connect successfully."
echo ""

# Test the Gmail MCP server with authentication
npx @modelcontextprotocol/server-gmail --client-id="309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com"