# Agent Usage Guide: Production vs Development

## 🚀 Production Agents (Use in Live Workflows)

### Real Data Integration Agents
- **`integration-agent-real.js`** ✅ - Live Airtable, Mailchimp, Gmail, Claude connections
- **`orchestrator-real.js`** ✅ - Production service orchestration
- **`newsjacking-agent.js`** ✅ - Live RSS/API news monitoring
- **`notion-health-check.js`** ✅ - Active Notion API integration

### Core Platform Agents  
- **`database-agent.js`** ✅ - Live Prisma database operations
- **`orchestrator.js`** ✅ - **NOW USES REAL AGENTS** for production workflows
- **`campaign-agent.js`** ✅ - **NOW USES REAL AGENTS** for integrations

### TDD Development System
- **`total-audio-tdd-orchestrator.js`** ✅ - Production TDD workflow coordination
- **`total-audio-*-specialist.js`** ✅ - Suite of specialist agents

## 🧪 Development/Testing Agents (Mock Data Only)

### Mock Integration Agents
- **`integration-agent.js`** 🧪 - Mock service responses for testing
- **`test-newsjacking-system.js`** 🧪 - Test mode with mockMode flag

### Partial Implementation Agents
- **`contact-agent.js`** ⚠️ - CRUD complete, enrichment incomplete
- **`agency-agent.js`** ⚠️ - Core structure, billing missing  
- **`analytics-agent.js`** ⚠️ - Framework exists, algorithms minimal
- **`music-tech-agent.js`** ⚠️ - API skeleton, audio processing incomplete

### Stub/Placeholder Agents
- **`social-media-agent.js`** 📝 - Method signatures, no implementation
- **`content-generation-agent.js`** 📝 - Structure only
- **`radio-promo-agent.js`** 📝 - Framework, no API integrations

## ⏸️ Parked Agents (Inactive but Available)

Located in `parked/` directory:
- **`music-marketing-mastermind.js`** - Advanced music marketing strategies
- **`music-industry-strategist.js`** - Industry strategy and positioning  
- **`growth-hacking-optimizer.js`** - Growth optimization and scaling
- **`viral-content-automation.js`** - Viral content strategies
- **`beta-user-acquisition-agent.js`** - Beta user acquisition workflows

## 🔧 Recent Production Updates

### ✅ Fixed for Production Use:
1. **`orchestrator.js`** now imports `integration-agent-real.js` instead of mock version
2. **`campaign-agent.js`** now uses `integration-agent-real.js` for live integrations
3. **Parked agents** commented out in orchestrator to prevent import errors
4. **Agent status dashboard** created in Command Centre with color-coded status

## 🚀 Deployment Commands

### Production Orchestrator
```bash
# Use for live workflows
cd tools/agents
node orchestrator.js [workflow-name]
```

### Real Service Integration
```bash
# Direct real agent usage
node integration-agent-real.js health
node notion-health-check.js
```

### Development Testing
```bash
# Use mock agents for testing
node integration-agent.js health
node test-newsjacking-system.js
```

## 🔍 Agent Status Monitoring

Visit **Command Centre** dashboard at http://localhost:3005 to see real-time agent status with color-coded categories:

- 🔵 **Blue**: Intel-related agents
- 🟢 **Green**: Production ready  
- 🟠 **Amber**: Partially working
- 🔴 **Red**: Mock/testing only
- ⚫ **Grey**: Parked (inactive)

## ⚠️ Important Notes

1. **Always use `-real.js` versions** for production workflows
2. **Mock agents are for development only** - they return simulated data
3. **Parked agents are complete** but not integrated into current workflows
4. **Agent dashboard is live** - reflects current system status
5. **TDD system is production-ready** - use for development workflows

## 🔄 Reactivating Parked Agents

1. Move agent back: `mv parked/[agent-name].js ./`
2. Uncomment in `orchestrator.js`
3. Update agent status dashboard
4. Test integration: `node orchestrator.js health`

This guide ensures clear separation between production-ready and development-only agents.