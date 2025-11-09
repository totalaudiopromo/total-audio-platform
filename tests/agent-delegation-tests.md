# Agent Delegation Test Suite

**Purpose**: Validate that Claude Code properly delegates to the custom agent orchestrator with parallel execution.

**Created**: 2025-11-09
**Status**: Ready for validation testing

---

## Test 1: Single Agent Delegation

**Input**: "Create a press release for my new single"

**Expected Behavior**:
- ✅ Detects "press release" trigger keyword
- ✅ Delegates to `contentGeneration` agent via orchestrator
- ✅ Uses Bash tool to invoke: `cd tools/agents && node orchestrator.js ...`
- ❌ Does NOT provide generic content directly without delegation

**Verification Commands**:
```bash
# Check if orchestrator has contentGeneration agent
cd tools/agents && node orchestrator.js health | grep -i content
```

**Success Criteria**:
- Response includes: "Delegating to content-generation-agent..."
- Bash tool is invoked with orchestrator command
- Results are synthesized from agent output

---

## Test 2: Parallel Multi-Agent Delegation

**Input**: "Help me launch a music campaign with social media and radio promotion"

**Expected Behavior**:
- ✅ Detects multiple triggers: "campaign" + "social media" + "radio"
- ✅ Maps to `campaign-launch` workflow OR custom operation with 3+ agents
- ✅ Delegates IN PARALLEL to: campaign, socialMedia, radioPromo
- ✅ Uses `executeCustomOperation` with `parallel: true`
- ✅ Creates TodoWrite items tracking each parallel delegation

**Verification Commands**:
```bash
# List available workflows
cd tools/agents && node orchestrator.js workflows | grep -i campaign

# Expected output should show: campaign-launch workflow
```

**Success Criteria**:
- Response mentions "parallel" execution
- TodoWrite shows multiple agents delegated simultaneously
- Results from all 3+ agents are collected and synthesized

---

## Test 3: Predefined Workflow Usage

**Input**: "I need a complete multi-platform launch for my album"

**Expected Behavior**:
- ✅ Detects "multi-platform" + "launch" triggers
- ✅ Maps to `multi-platform-launch` workflow (10 agents)
- ✅ Executes via: `node orchestrator.js execute multi-platform-launch`
- ❌ Does NOT create custom operation (workflow already exists)

**Verification Commands**:
```bash
# Verify multi-platform-launch workflow exists
cd tools/agents && node orchestrator.js workflows | grep multi-platform
```

**Success Criteria**:
- Uses predefined workflow, not custom operation
- All 10 agents in workflow are coordinated
- Response summarizes complete multi-platform strategy

---

## Test 4: Sequential vs Parallel Decision

**Input**: "Analyze my campaign performance and create a report based on the analysis"

**Expected Behavior**:
- ✅ Recognizes dependency: analytics THEN contentGeneration
- ✅ Executes SEQUENTIALLY (not parallel)
- ✅ Step 1: analytics.analyzeCampaignPerformance
- ✅ Step 2: contentGeneration.generateCustomReport (uses analytics data)

**Success Criteria**:
- Does NOT use `parallel: true` for dependent operations
- Sequential execution is clearly indicated
- Second agent receives results from first agent

---

## Test 5: No Delegation (Direct Handling)

**Input**: "What is the best audio format for streaming?"

**Expected Behavior**:
- ✅ No delegation triggers detected
- ✅ Responds directly with technical information
- ❌ Does NOT delegate to musicTech unnecessarily

**Success Criteria**:
- No Bash tool invocation for orchestrator
- Direct informational response provided
- No unnecessary agent delegation

---

## Test 6: TodoWrite Tracking for Multi-Agent Workflows

**Input**: "Create a viral social media campaign"

**Expected Behavior**:
- ✅ Creates TodoWrite items before delegation:
  1. "Delegating to social-media-agent (in parallel)"
  2. "Delegating to viral-content-automation agent (in parallel)"
  3. "Collecting results from all agents"
  4. "Synthesizing viral strategy recommendations"
- ✅ Updates status to 'in_progress' then 'completed' for each step

**Verification Commands**:
```bash
# Verify both agents exist
cd tools/agents && ls -1 | grep -E "(social-media|viral-content)"
```

**Success Criteria**:
- TodoWrite tool is used to track delegation
- All parallel delegations are tracked
- Status updates reflect actual progress

---

## Test 7: Crisis Management (MUST Delegate)

**Input**: "We're facing negative PR on social media - help with crisis management"

**Expected Behavior**:
- ✅ MUST use `crisis-management` workflow
- ✅ Delegates to: socialMedia + contentGeneration + analytics
- ✅ Never provides generic advice without delegation

**Verification Commands**:
```bash
# Verify crisis-management workflow exists
cd tools/agents && node orchestrator.js workflows | grep crisis
```

**Success Criteria**:
- Immediate delegation to crisis-management workflow
- Coordinated response from multiple agents
- No generic "here's what you should do" advice

---

## Test 8: Complex Multi-Workflow Scenario

**Input**: "Launch my new album with radio promotion, social media campaign, and press coverage"

**Expected Behavior**:
- ✅ Recognizes this needs `music-release-campaign` workflow
- ✅ Coordinates 8+ agents: musicTech → contentGeneration → socialMedia → radioPromo → analytics
- ✅ Some steps parallel, some sequential based on dependencies
- ✅ Comprehensive results from all specialized agents

**Verification Commands**:
```bash
# Execute the workflow to see agent coordination
cd tools/agents && node orchestrator.js workflows | grep music-release
```

**Success Criteria**:
- Uses appropriate predefined workflow
- Clear indication of parallel vs sequential execution
- Results show contributions from all relevant agents

---

## Regression Test: Previous Behavior (What NOT to Do)

### BAD (Pre-Fix Behavior):
```
User: "Launch my campaign"
Claude: Here's how to launch a music campaign:
        1. Define your target audience
        2. Create engaging content
        3. Choose your platforms
        [... generic advice ...]
```
**Problem**: No delegation, generic advice only

### GOOD (Post-Fix Behavior):
```
User: "Launch my campaign"
Claude: Delegating to specialized agents for campaign launch...

[TodoWrite: Delegating to campaign-agent (in parallel)]
[TodoWrite: Delegating to integration-agent (in parallel)]
[TodoWrite: Delegating to social-media-agent (in parallel)]

[Bash execution:]
cd tools/agents && node orchestrator.js execute campaign-launch

[Results:]
✓ Campaign-agent: Campaign structure created with targeting
✓ Integration-agent: Mailchimp/Gmail integration configured
✓ Social-media-agent: Cross-platform strategy developed

[Synthesized recommendations from all agents...]
```
**Success**: Proper delegation with parallel execution and specialized outputs

---

## Test 9: Edge Case - Ambiguous Request

**Input**: "Help me with my music"

**Expected Behavior**:
- ✅ Recognizes request is too vague for delegation
- ✅ Asks clarifying questions:
  - "What would you like help with? Campaign launch, content creation, radio promotion, analytics?"
- ✅ After clarification, delegates appropriately

**Success Criteria**:
- Doesn't blindly delegate without context
- Asks for clarification before choosing workflow
- Delegates correctly once intent is clear

---

## Test 10: System Health Verification

**Input**: "Check if all agents are working properly"

**Expected Behavior**:
- ✅ Uses: `cd tools/agents && node orchestrator.js health`
- ✅ Reports health status of all agents
- ✅ Identifies any agents with issues

**Verification Commands**:
```bash
# Manual health check
cd tools/agents && node orchestrator.js health
```

**Success Criteria**:
- Health check command is executed
- Status of all 10+ agents is reported
- Any issues are highlighted

---

## Running the Test Suite

### Prerequisites:
```bash
# Install dependencies first (required for orchestrator to run)
npm install

# Generate Prisma client (required for database-agent)
npm run db:generate
```

### Automated Validation:
```bash
# 1. Check orchestrator functionality
cd tools/agents && node orchestrator.js health

# 2. List all workflows
cd tools/agents && node orchestrator.js workflows

# 3. Verify all agent files exist
ls -la tools/agents/*-agent.js

# 4. Test a simple workflow execution (dry run)
cd tools/agents && node orchestrator.js execute --help
```

### Manual Validation:
1. Open a new Claude Code session
2. Send each test input one by one
3. Verify expected behavior occurs
4. Check for delegation vs direct response
5. Validate parallel vs sequential execution
6. Confirm TodoWrite tracking

---

## Success Metrics

**Overall Test Pass Criteria**:
- ✅ 8/10 tests pass (80% threshold)
- ✅ All "MUST delegate" scenarios delegate properly
- ✅ Parallel execution is used when appropriate
- ✅ No regression to generic advice responses
- ✅ TodoWrite tracking is consistent

**Critical Tests (Must Pass)**:
- Test 2: Parallel Multi-Agent Delegation
- Test 3: Predefined Workflow Usage
- Test 7: Crisis Management
- Regression Test: No generic advice for delegation triggers

---

## Troubleshooting Failed Tests

### If Test 2 Fails (No Parallel Execution):
**Symptom**: Agents are executed sequentially instead of in parallel

**Diagnosis**:
```bash
# Check if executeCustomOperation supports parallel
grep -n "parallel" tools/agents/orchestrator.js
```

**Fix**: Ensure CLAUDE.md delegation triggers are properly loaded in system prompt

### If Test 3 Fails (Workflow Not Used):
**Symptom**: Custom operation created instead of using predefined workflow

**Diagnosis**:
```bash
# Verify workflow exists
cd tools/agents && node orchestrator.js workflows | grep -i <workflow-name>
```

**Fix**: Update delegation decision tree to check workflows first

### If Test 7 Fails (Generic Advice Given):
**Symptom**: Generic crisis management advice instead of delegation

**Diagnosis**: Check if "crisis-management" is in mandatory delegation list

**Fix**: Emphasize NEVER handle these directly section in CLAUDE.md

---

## Test Results Log

**Date**: _____________
**Session ID**: _____________
**Claude Code Version**: _____________

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Single Agent Delegation | ⬜ Pass / ❌ Fail | |
| 2 | Parallel Multi-Agent | ⬜ Pass / ❌ Fail | |
| 3 | Predefined Workflow | ⬜ Pass / ❌ Fail | |
| 4 | Sequential vs Parallel | ⬜ Pass / ❌ Fail | |
| 5 | No Delegation | ⬜ Pass / ❌ Fail | |
| 6 | TodoWrite Tracking | ⬜ Pass / ❌ Fail | |
| 7 | Crisis Management | ⬜ Pass / ❌ Fail | |
| 8 | Complex Multi-Workflow | ⬜ Pass / ❌ Fail | |
| 9 | Edge Case Ambiguous | ⬜ Pass / ❌ Fail | |
| 10 | System Health | ⬜ Pass / ❌ Fail | |

**Overall Score**: _____ / 10 (___%)

---

## Next Steps After Testing

1. **If 80%+ tests pass**:
   - Mark delegation system as operational
   - Monitor for edge cases
   - Create additional workflows as needed

2. **If 50-79% tests pass**:
   - Review failed test patterns
   - Adjust delegation triggers in CLAUDE.md
   - Retest failed scenarios

3. **If <50% tests pass**:
   - Review system prompt integration
   - Verify CLAUDE.md is being loaded
   - Check orchestrator.js functionality
   - Consider additional training examples

---

## Additional Test Scenarios (Future)

- Test with multiple simultaneous requests
- Test error handling when agents fail
- Test with partial agent availability
- Test workflow customization
- Test with real data (non-demo mode)
- Performance testing with timing metrics

---

**End of Test Suite**
