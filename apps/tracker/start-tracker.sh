#!/bin/bash

# Tracker Startup Script - Use Port 3004
# This prevents conflicts with other Total Audio sites

echo "🔧 Starting Tracker on port 3004..."
echo ""
echo "📍 URL: http://localhost:3004"
echo "🔗 Integrations: http://localhost:3004/dashboard/integrations"
echo ""

# Kill any existing processes on this port
lsof -ti:3004 | xargs kill -9 2>/dev/null

# Start the server
PORT=3004 npm run dev
