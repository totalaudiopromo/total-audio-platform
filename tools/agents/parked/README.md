# Parked Agents

This directory contains agents that are **dormant** - complete implementations that are not currently integrated into the active system workflows.

## Parked Agents

### 🎵 Music Industry Specialists

- **`music-marketing-mastermind.js`** - Advanced music marketing strategies
- **`music-industry-strategist.js`** - Industry strategy and positioning
- **`growth-hacking-optimizer.js`** - Growth optimization and scaling
- **`viral-content-automation.js`** - Viral content strategies

### 👥 User Acquisition

- **`beta-user-acquisition-agent.js`** - Beta user acquisition workflows

## Status: INACTIVE ⏸️

These agents are:

- ✅ **Complete implementations** - Fully functional code
- ❌ **Not orchestrator-integrated** - Not called by main workflows
- ❌ **No system references** - Not used by other agents
- 🔒 **Available for reactivation** - Can be moved back to active when needed

## Reactivation Process

To reactivate a parked agent:

1. **Move back to main agents directory**:

   ```bash
   mv parked/[agent-name].js ./
   ```

2. **Update orchestrator.js**:

   ```javascript
   // Uncomment the require and instantiation
   const AgentName = require('./agent-name');
   // Add to agents object
   agentName: new AgentName();
   ```

3. **Test integration**:

   ```bash
   node orchestrator.js health
   ```

4. **Update agent status dashboard** in Command Centre

## Why Parked?

These agents were moved to maintain a clean active agent ecosystem while preserving valuable specialized functionality for future use. They represent complete, working implementations that can be quickly reintegrated when business needs require their specific capabilities.
