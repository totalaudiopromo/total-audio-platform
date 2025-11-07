# ANTHROPIC SDK UPGRADE PRIORITIES

**Date**: 2 October 2025
**Project**: Total Audio Platform Agent System

## UPGRADE CLASSIFICATION SYSTEM

### Priority Levels

- 🔴 **CRITICAL**: Revenue-impacting, customer-facing, system-critical
- 🟠 **HIGH**: Customer acquisition, content generation, active workflows
- 🟡 **MEDIUM**: Supporting features, automation enhancements
- 🟢 **LOW**: Nice-to-have, experimental, archived agents

### Upgrade Flags

- ❌ **CRITICAL**: Not using SDK streaming for long operations
- ❌ **HIGH**: No prompt caching despite repeated context
- ❌ **MEDIUM**: Manual tool orchestration instead of agentic loop
- ⚠️ **LOW**: Missing extended thinking for complex decisions
- ℹ️ **INFO**: Could benefit from batch processing

---

## 🔴 CRITICAL PRIORITY AGENTS

### 1. Contact Agent (`core-agents/technical/contact-agent.js`)

**Current Status**:

- ❌ **CRITICAL**: No streaming for enrichment progress
- ❌ **HIGH**: No caching for UK contacts context (515 contacts)
- ❌ **MEDIUM**: Manual enrichment flow instead of agentic loops
- ℹ️ **INFO**: Perfect candidate for batch processing

**Why Critical**:

- Core Audio Intel feature (revenue-generating)
- Customer-facing performance
- Used in demo calls (customer acquisition)
- High-volume operations (515 contacts)

**Upgrade Benefits**:

1. **Streaming**: Real-time progress for demo demonstrations

   - Show contact enrichment happening live
   - 40-60% faster perceived performance
   - Better UX for prospects

2. **Prompt Caching**: Massive token savings

   - Cache UK music industry context
   - Cache 515 contact database schema
   - Estimated 80-90% cache hit rate
   - 70-85% cost reduction

3. **Agentic Loops**: Autonomous multi-step enrichment

   - Find social profiles → Validate email → Enrich database
   - Fewer API calls, smarter execution
   - Better quality results

4. **Batch Processing**: Overnight bulk enrichment
   - Process 100+ contacts in single batch
   - 50% cost reduction vs individual calls
   - Background processing for large uploads

**Implementation Plan**:

```typescript
// Before: Manual, no streaming, no caching
async enrichContact(contactId) {
  const contact = await prisma.contact.findUnique({ where: { id: contactId }});
  const enriched = await manualEnrichmentSteps(contact);
  return enriched;
}

// After: Streaming + Caching + Agentic
class ContactEnrichmentAgent extends StreamingAgent {
  constructor() {
    super('ContactEnrichment', CACHED_CONTEXT, TOOLS);
  }

  async enrichContact(contactId) {
    // Emit real-time progress events
    return await this.executeAgenticLoop(
      `Enrich contact ${contactId} with social profiles, email validation, and database update`,
      { maxIterations: 10 }
    );
  }
}
```

**Expected Impact**:

- **Performance**: 40-60% faster
- **Cost**: 70-85% reduction
- **Quality**: Better enrichment accuracy
- **UX**: Real-time progress visibility
- **Revenue**: Better demo conversion rates

**Timeline**: Week 1 (3-5 days)

---

### 2. Agent Manager (`core-agents/technical/agent-manager.js`)

**Current Status**:

- ❌ **CRITICAL**: No SDK health monitoring
- ❌ **HIGH**: No cost tracking or cache hit rate visibility
- ❌ **MEDIUM**: No centralized event system for agents
- ⚠️ **LOW**: No performance benchmarking

**Why Critical**:

- Orchestrates all 40+ agents
- System observability requirement
- Cost control necessity (customer acquisition budget)
- Foundation for Command Centre dashboard

**Upgrade Benefits**:

1. **SDK Health Checks**: System reliability

   - Monitor API connectivity
   - Track rate limits
   - Alert on failures

2. **Cost Monitoring Dashboard**: Financial visibility

   - Real-time API cost tracking
   - Cache hit rate monitoring
   - Budget alerts and projections

3. **Event System**: Real-time agent activity

   - Agent start/stop events
   - Progress updates
   - Error notifications
   - Command Centre integration

4. **Performance Benchmarks**: Data-driven optimization
   - Track execution times
   - Identify bottlenecks
   - A/B test improvements

**Implementation Plan**:

```typescript
class AgentManager {
  async checkSDKHealth() {
    const checks = await Promise.all([
      this.checkStreamingCapability(),
      this.checkPromptCaching(),
      this.checkToolExecution(),
      this.checkBatchProcessing(),
    ]);

    return {
      status: checks.every(c => c.passed) ? 'healthy' : 'degraded',
      checks,
      timestamp: new Date(),
    };
  }

  async getCostMetrics() {
    return {
      currentMonth: this.calculateCurrentCosts(),
      cacheHitRate: this.calculateCacheHitRate(),
      projectedSavings: this.calculateCacheSavings(),
      budgetStatus: this.checkBudgetLimits(),
    };
  }

  setupEventStream() {
    this.eventEmitter = new EventEmitter();
    // All agents emit to this central stream
    // Command Centre subscribes for real-time updates
  }
}
```

**Expected Impact**:

- **Visibility**: Full system observability
- **Cost Control**: 50-80% savings with caching
- **Reliability**: Proactive health monitoring
- **Integration**: Command Centre dashboard ready

**Timeline**: Week 1 (3-5 days, parallel with Contact Agent)

---

### 3. Campaign Agent (`core-agents/radio-promo/campaign-agent.js`)

**Current Status**:

- ❌ **CRITICAL**: No streaming for campaign planning
- ❌ **HIGH**: No caching for music industry context
- ⚠️ **LOW**: Missing extended thinking for strategy
- ❌ **MEDIUM**: Manual campaign workflow orchestration

**Why Critical**:

- Core Radio Promo feature
- Used in Liberty Music PR workflow (beta customer)
- Campaign planning is complex (needs thinking mode)
- Customer-facing performance

**Upgrade Benefits**:

1. **Extended Thinking**: Better campaign strategies

   - Strategic radio targeting decisions
   - Genre-based playlist selection
   - DJ relationship prioritisation
   - Budget allocation optimisation

2. **Streaming**: Real-time campaign creation

   - Show campaign building progress
   - Better UX for agency clients
   - Progress visibility for stakeholders

3. **Prompt Caching**: Industry knowledge efficiency

   - Cache UK radio landscape data
   - Cache genre-based targeting rules
   - Cache DJ relationship best practices

4. **Agentic Loops**: Autonomous campaign execution
   - Research stations → Build contact list → Schedule outreach
   - Fewer manual steps, smarter automation

**Implementation Plan**:

```typescript
class CampaignAgent extends StreamingAgent {
  async planCampaign(artistName, genre, budget) {
    // Use extended thinking for strategy
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      thinking: {
        type: 'enabled',
        budget_tokens: 10000,
      },
      system: [
        CachedContextManager.getAudioIntelContext(),
        CachedContextManager.getUKRadioLandscapeContext(),
      ],
      messages: [
        {
          role: 'user',
          content: `Plan radio campaign for ${artistName} (${genre}) with £${budget} budget`,
        },
      ],
    });

    return this.parseCampaignPlan(response);
  }
}
```

**Expected Impact**:

- **Quality**: 30-50% better campaign strategies
- **Speed**: 40-60% faster campaign creation
- **Cost**: 60-80% reduction with caching
- **Client Satisfaction**: Better results for Liberty Music PR

**Timeline**: Week 2 (3-4 days)

---

## 🟠 HIGH PRIORITY AGENTS

### 4. Content Generation Agent (`core-agents/content/content-generation-agent.js`)

**Upgrade Flags**:

- ❌ **CRITICAL**: No streaming for long-form content
- ❌ **HIGH**: No brand voice caching
- ⚠️ **LOW**: Could benefit from thinking mode for creative strategy

**Why High Priority**:

- Customer acquisition content creation
- Case study generation (BBC Radio 1, Spotify)
- Blog post automation
- Active use in content marketing

**Upgrade Benefits**:

- Stream content generation for better UX
- Cache Total Audio brand voice guidelines
- Extended thinking for content strategy
- Estimated 60-80% cost reduction

**Timeline**: Week 3 (2-3 days)

---

### 5. Newsletter Automation Agent (`core-agents/content/newsletter-automation-agent.js`)

**Upgrade Flags**:

- ❌ **CRITICAL**: No streaming for newsletter generation
- ❌ **HIGH**: No caching for "The Unsigned Advantage" format
- ❌ **MEDIUM**: Manual content assembly vs agentic generation

**Why High Priority**:

- "The Unsigned Advantage" newsletter (active system)
- Weekly automated distribution
- Customer acquisition channel (25+ subscribers target)
- Integration with ConvertKit

**Upgrade Benefits**:

- Real-time newsletter generation progress
- Cache newsletter format and style guide
- Agentic loops for content sourcing and assembly
- Better quality with extended thinking

**Timeline**: Week 3 (2-3 days)

---

### 6. Audio Intel Content Agent (`core-agents/content/audio-intel-content-agent.js`)

**Upgrade Flags**:

- ❌ **CRITICAL**: No streaming
- ❌ **HIGH**: No product context caching
- ⚠️ **LOW**: Needs thinking mode for positioning

**Why High Priority**:

- Product-specific marketing content
- Customer acquisition phase requirement
- Demo scripts, landing page copy, email campaigns
- Directly impacts conversion rates

**Upgrade Benefits**:

- Cache Audio Intel product context (pricing, features, benefits)
- Extended thinking for competitive positioning
- Streaming for rapid content iteration

**Timeline**: Week 3-4 (2-3 days)

---

### 7. SaaS Marketing Agent (`core-agents/business/chris-saas-marketing-agent.js`)

**Upgrade Flags**:

- ❌ **HIGH**: No caching for customer acquisition strategies
- ⚠️ **LOW**: Needs extended thinking for market analysis
- ❌ **MEDIUM**: Manual campaign orchestration

**Why High Priority**:

- Customer acquisition phase
- Target: First £500/month by November 2025
- Radio promoter outreach (85% conversion rate)
- Strategic marketing decisions

**Upgrade Benefits**:

- Extended thinking for customer acquisition strategy
- Cache market positioning and competitive analysis
- Agentic loops for multi-channel campaign execution

**Timeline**: Week 4 (2-3 days)

---

## 🟡 MEDIUM PRIORITY AGENTS

### 8. Social Media Agent (`core-agents/content/social-media-agent.js`)

**Upgrade Benefits**: Streaming for real-time post generation, caching brand voice
**Timeline**: Week 5

### 9. Radio Promo Agent (`radio-promo-agent.js`)

**Upgrade Benefits**: Large complex agent (113KB), would benefit from modularisation + SDK
**Timeline**: Week 5 (major refactor)

### 10. Newsjacking Agent (`core-agents/content/newsjacking-agent.js`)

**Upgrade Benefits**: Extended thinking for news analysis, caching for news sources
**Timeline**: Week 5

### 11. Memory Persistence Agent (`utilities/memory-persistence-agent.js`)

**Upgrade Benefits**: Prompt caching for session context, better context management
**Timeline**: Week 6

### 12. Agent Dashboard (`core-agents/technical/agent-dashboard.js`)

**Upgrade Benefits**: Integration with upgraded agents, real-time event streaming
**Timeline**: Week 6

---

## 🟢 LOW PRIORITY AGENTS

### Radio Promo Sub-Agents (7 agents)

- Timeline: Week 7+ (as needed)
- Benefit: Incremental improvements

### Analytics Agent

- Timeline: Week 7+
- Benefit: Better reporting with extended thinking

### Music Tech Agent

- Timeline: Week 8+
- Benefit: Low usage currently

### Integration Agent

- Timeline: Week 8+
- Benefit: Utility function, not customer-facing

### Archived TDD Agents

- Timeline: Only if TDD workflow reactivated
- Benefit: Historical reference

---

## UPGRADE IMPLEMENTATION SEQUENCE

### Week 1: Critical Foundation

1. ✅ Create `BaseStreamingAgent` class (Day 1-2)
2. ✅ Create `CachedContextManager` (Day 1-2)
3. ✅ Upgrade Contact Agent (Day 2-4)
4. ✅ Upgrade Agent Manager (Day 2-4)
5. ✅ Create test suite (Day 5)

**Milestone**: Revenue-critical agents upgraded, system monitoring operational

---

### Week 2: Campaign Intelligence

1. ✅ Upgrade Campaign Agent (Day 1-3)
2. ✅ Create `BatchContactProcessor` (Day 2-3)
3. ✅ Integration testing (Day 4)
4. ✅ Deploy to production with rollback (Day 5)

**Milestone**: Full Audio Intel + Campaign workflow upgraded

---

### Week 3-4: Content Automation

1. ✅ Upgrade Content Generation Agent (Week 3, Day 1-2)
2. ✅ Upgrade Newsletter Automation Agent (Week 3, Day 3-4)
3. ✅ Upgrade Audio Intel Content Agent (Week 4, Day 1-2)
4. ✅ Upgrade SaaS Marketing Agent (Week 4, Day 3-4)
5. ✅ Testing and refinement (Week 4, Day 5)

**Milestone**: Customer acquisition content pipeline fully optimised

---

### Week 5: Integration & Monitoring

1. ✅ Build Command Centre dashboard integration (Day 1-3)
2. ✅ Implement cost monitoring UI (Day 2-3)
3. ✅ Add real-time agent activity stream (Day 4)
4. ✅ Create performance benchmarking dashboard (Day 5)

**Milestone**: Full system observability and cost control

---

### Week 6+: Remaining Agents

1. ✅ Upgrade medium priority agents (Week 6)
2. ✅ Upgrade low priority agents as needed (Week 7-8)
3. ✅ Documentation and training (Week 8)
4. ✅ Create upgrade guide for future agents (Week 8)

**Milestone**: Complete agent ecosystem modernised

---

## SUCCESS METRICS

### Performance Metrics

- ✅ 40-60% faster perceived performance (streaming)
- ✅ <2s response time for cached queries
- ✅ Real-time progress visibility in Command Centre

### Cost Metrics

- ✅ 70-85% cost reduction on Contact Agent (prompt caching)
- ✅ 50-80% overall cost reduction across all agents
- ✅ 80%+ cache hit rate for repeated context
- ✅ 50% batch processing savings

### Quality Metrics

- ✅ 30-50% better campaign strategies (extended thinking)
- ✅ Autonomous multi-step workflows (agentic loops)
- ✅ Higher quality enrichment data

### Business Metrics

- ✅ Better demo conversion rates (real-time enrichment)
- ✅ Faster content production (customer acquisition)
- ✅ Lower operational costs (API savings)
- ✅ Better customer experience (Command Centre visibility)

---

## ROLLBACK PLAN

### For Each Agent Upgrade

1. **Pre-Upgrade Backup**

   - Create `.backup` copy of original agent
   - Document current metrics (performance, cost)
   - Capture current behaviour with test cases

2. **Gradual Rollout**

   - Deploy to staging first
   - Run parallel with old agent (A/B test)
   - Monitor for 24-48 hours

3. **Rollback Triggers**

   - > 10% performance degradation
   - > 20% increase in errors
   - Any data integrity issues
   - Customer-facing failures

4. **Rollback Procedure**
   - Restore `.backup` file
   - Clear cached context
   - Restart agent manager
   - Verify metrics return to baseline

---

## RISK ASSESSMENT

### High Risk Areas

1. **Contact Agent Database Integration**

   - **Risk**: Breaking Prisma queries
   - **Mitigation**: Preserve all database logic, test extensively

2. **Radio Promo Agent Complexity**

   - **Risk**: 113KB file, many integrations
   - **Mitigation**: Upgrade in phases, maintain backward compatibility

3. **Production Newsletter System**

   - **Risk**: Breaking weekly "The Unsigned Advantage" delivery
   - **Mitigation**: Extensive testing, gradual rollout

4. **Liberty Music PR Workflow**
   - **Risk**: Breaking beta customer's active campaigns
   - **Mitigation**: Test with non-critical campaigns first

### Mitigation Strategies

1. ✅ Comprehensive test suite for each agent
2. ✅ Staging environment testing (48 hours minimum)
3. ✅ Gradual rollout with feature flags
4. ✅ Real-time monitoring and alerts
5. ✅ Quick rollback capability (<5 minutes)
6. ✅ Customer communication plan for beta users

---

## NEXT ACTIONS

1. ✅ Review this priorities document
2. ✅ Approve Week 1 implementation plan
3. ✅ Set up baseline metrics (current costs, performance)
4. ✅ Create development branch: `feature/sdk-upgrade`
5. ✅ Begin Phase 1: BaseStreamingAgent implementation

---

**Document Status**: READY FOR REVIEW
**Approval Required**: Yes
**Timeline**: 6-8 weeks for full upgrade
**Expected ROI**: 50-80% cost reduction, 40-60% performance gain
