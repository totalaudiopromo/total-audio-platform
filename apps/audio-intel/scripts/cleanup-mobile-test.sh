#!/bin/bash
echo "Cleaning up mobile testing processes..."

if [ -f .dev-server.pid ]; then
    kill $(cat .dev-server.pid) 2>/dev/null
    rm .dev-server.pid
    echo "✅ Development server stopped"
fi

if [ -f .tunnel.pid ]; then
    kill $(cat .tunnel.pid) 2>/dev/null
    rm .tunnel.pid
    echo "✅ Tunnel stopped"
fi

echo "🧹 Mobile testing cleanup complete"
