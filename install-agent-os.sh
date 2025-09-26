#!/bin/bash

# Agent OS Installation Script for Total Audio Platform
echo "🤖 Installing Agent OS for Total Audio..."

# Create Agent OS directory structure
mkdir -p agent-os/{agents,workflows,memory,config}

# Install Agent OS dependencies
npm install @buildermethods/agent-os --save

# Add Agent OS scripts to package.json
echo "✅ Agent OS installation complete!"
echo "📁 Created agent-os/ directory structure"
echo "📦 Installed @buildermethods/agent-os package"
echo ""
echo "Next steps:"
echo "1. Configure your first Agent OS workflow"
echo "2. Migrate existing agents to Agent OS patterns"
echo "3. Test integration with current setup"
