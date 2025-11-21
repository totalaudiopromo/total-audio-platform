---
name: task-orchestrator
description: Use when complex tasks require multiple specialized approaches or parallel work - coordinates Task tool usage for multi-agent workflows, parallel execution patterns, and delegation decision framework for 3-5x faster execution
---

# Task Orchestration

## Core Principle

**Complex tasks should delegate to specialized subagents via Task tool.**

Single agent doing everything serially = slow.
Multiple specialist subagents working parallel = fast.

## When to Orchestrate

### USE Task Tool When:

- Task requires 3+ distinct skills/expertise areas
- Multiple independent subtasks can run parallel
- Deep specialized knowledge needed (TypeScript, testing, API design)
- Task will take >30 minutes of focused work
- Multiple files/areas need simultaneous updates
- Quality checks can run independently (typecheck + tests + lint)

###  DON'T Use Task Tool When:

- Simple single-skill task (<15 minutes)
- Sequential dependencies (must finish A before starting B)
- Exploratory work (gathering context, reading code)
- Single file edits
- User needs to make decisions between steps
- Debugging (use systematic-debugging skill instead)

## Quick Decision Tree

```
Can task be split into 2+ independent subtasks?
  → Yes: Will each take >15 minutes?
    → Yes: Will parallelization save significant time?
      → Yes: USE TASK TOOL
      → No: Do it directly
    → No: Do it directly
  → No: Do it directly
```

## Parallel Execution Pattern

### CORRECT: Multiple Tasks in Single Message

```xml
<function_calls>
  <invoke name="Task">
    <parameter name="subagent_type">general-purpose</parameter>
    <parameter name="description">Fix TypeScript errors</parameter>
    <parameter name="prompt">
Fix all TypeScript errors in apps/audio-intel/
- Run typecheck to identify errors
- Fix type definitions
- Ensure strict mode compliance
Return summary of fixes made.
    </parameter>
  </invoke>
  <invoke name="Task">
    <parameter name="subagent_type">general-purpose</parameter>
    <parameter name="description">Update mobile tests</parameter>
    <parameter name="prompt">
Update Playwright mobile tests in apps/audio-intel/tests/mobile/
- Add missing touch target tests
- Update responsive breakpoint tests
Return test coverage summary.
    </parameter>
  </invoke>
  <invoke name="Task">
    <parameter name="subagent_type">general-purpose</parameter>
    <parameter name="description">Generate documentation</parameter>
    <parameter name="prompt">
Generate API documentation for audio-intel routes
- Document all endpoints
- Include request/response examples
Return doc structure.
    </parameter>
  </invoke>
</function_calls>
```

**Result**: All 3 tasks run simultaneously. Total time = slowest task (not sum of all).

###  WRONG: Sequential Messages

```xml
<!-- Don't do this - runs serially -->
<function_calls>
  <invoke name="Task">
    <parameter name="description">Fix TypeScript</parameter>
    ...
  </invoke>
</function_calls>

<!-- Wait for response -->
<!-- Then send another -->

<function_calls>
  <invoke name="Task">
    <parameter name="description">Update tests</parameter>
    ...
  </invoke>
</function_calls>
```

**Result**: Tasks run one after another. Total time = sum of all tasks.

## Common Orchestration Patterns

### Pattern 1: Multi-Area Updates

**When**: Updating multiple apps in monorepo

```xml
<function_calls>
  <invoke name="Task">
    <parameter name="description">Update audio-intel</parameter>
    <parameter name="prompt">Add X feature to audio-intel...</parameter>
  </invoke>
  <invoke name="Task">
    <parameter name="description">Update pitch-generator</parameter>
    <parameter name="prompt">Add X feature to pitch-generator...</parameter>
  </invoke>
  <invoke name="Task">
    <parameter name="description">Update tracker</parameter>
    <parameter name="prompt">Add X feature to tracker...</parameter>
  </invoke>
</function_calls>
```

**Time Savings**: 3x faster (20 mins vs 60 mins)

### Pattern 2: Parallel Quality Checks

**When**: Running validation before deployment

```xml
<function_calls>
  <invoke name="Task">
    <parameter name="description">TypeScript validation</parameter>
    <parameter name="prompt">Run typecheck on all apps, fix errors</parameter>
  </invoke>
  <invoke name="Task">
    <parameter name="description">Test validation</parameter>
    <parameter name="prompt">Run test suite, fix failures</parameter>
  </invoke>
  <invoke name="Task">
    <parameter name="description">Mobile UX validation</parameter>
    <parameter name="prompt">Check 21 mobile UX standards</parameter>
  </invoke>
</function_calls>
```

**Time Savings**: 3x faster (15 mins vs 45 mins)

### Pattern 3: Comprehensive Pre-Deployment

**When**: Preparing for production deployment

```xml
<function_calls>
  <invoke name="Task">
    <parameter name="description">Build all apps</parameter>
    <parameter name="prompt">Build audio-intel, tracker, pitch-generator</parameter>
  </invoke>
  <invoke name="Task">
    <parameter name="description">Run test suite</parameter>
    <parameter name="prompt">Run full test suite, report failures</parameter>
  </invoke>
  <invoke name="Task">
    <parameter name="description">Generate changelog</parameter>
    <parameter name="prompt">Generate customer-facing changelog from recent commits</parameter>
  </invoke>
</function_calls>
```

**Time Savings**: 4x faster (15 mins vs 60 mins)

## Subagent Prompt Best Practices

### Good Prompts

- Clear objective stated first
- Bullet list of specific tasks
- Expected output format specified
- Context provided (file paths, constraints)
- Success criteria defined

**Example**:

```
Fix all TypeScript errors in apps/audio-intel/

Tasks:
- Run typecheck to identify all errors
- Fix type definitions
- Add missing interfaces
- Ensure strict mode compliance

Context:
- Project uses Next.js App Router
- Strict TypeScript mode enabled
- Prisma for database types

Return:
- Summary of errors fixed
- List of files modified
- Verification that typecheck passes
```

###  Bad Prompts

- Vague objectives ("fix stuff")
- No specific tasks listed
- Missing context
- Unclear success criteria
- Too open-ended

**Example**:

```
Fix TypeScript errors
```

## Integration with Customer Acquisition Phase

**During customer acquisition** (NOW - before £500/month):

### Delegate Technical Work

Use Task tool for:

- Bug fixes (doesn't block customer work)
- Quality checks (TypeScript, tests, mobile UX)
- Build/deployment validation
- Documentation generation

### Keep Customer Work in Main Agent

Handle directly:

-  Customer outreach scripts (needs your judgment)
-  Demo preparation (customer-specific context)
-  Case study creation (authentic voice required)
-  Revenue metric tracking (business decisions)

### Example: Prepare for Liberty Music PR Demo

**USER REQUEST**: "Prepare Audio Intel for Liberty Music PR demo"

**YOUR RESPONSE**:

1. Use brainstorming skill to plan demo improvements
2. Delegate technical prep to subagents:

```xml
<function_calls>
  <invoke name="Task">
    <parameter name="description">Fix any bugs</parameter>
    <parameter name="prompt">
Test Audio Intel critical paths, fix bugs:
- Contact upload flow
- Enrichment process
- Results display
- Export functionality
Return bug fixes summary.
    </parameter>
  </invoke>
  <invoke name="Task">
    <parameter name="description">Validate mobile UX</parameter>
    <parameter name="prompt">
Run mobile UX validation against 21 standards:
- Touch targets 44px minimum
- Responsive breakpoints working
- Loading states present
- Error handling clear
Return UX validation report.
    </parameter>
  </invoke>
  <invoke name="Task">
    <parameter name="description">Generate demo data</parameter>
    <parameter name="prompt">
Create demo dataset with BBC Radio contacts:
- BBC Radio 1, Radio 6 Music contacts
- Enriched with real data
- Ready for live demo
Return demo data summary.
    </parameter>
  </invoke>
</function_calls>
```

3. Synthesize results (main agent)
4. Create demo script (main agent, authentic voice)

## Performance Metrics

### Expected Time Savings

| Task Type             | Without Orchestration | With Orchestration | Improvement |
| --------------------- | --------------------- | ------------------ | ----------- |
| Complex multi-area    | 60 mins               | 15-20 mins         | 3-4x faster |
| Multi-app updates     | 90 mins               | 20-30 mins         | 3-4x faster |
| Parallel validation   | 45 mins               | 15 mins            | 3x faster   |
| Pre-deployment checks | 60 mins               | 15 mins            | 4x faster   |

### 2-Hour Session Capacity

**Without orchestration**: 1-2 features completed
**With orchestration**: 3-4 features completed
**Improvement**: 2x more work per session

## Common Mistakes

### Mistake 1: Over-Delegating Simple Tasks

```xml
<!-- DON'T: Task is too simple -->
<invoke name="Task">
  <parameter name="description">Fix typo</parameter>
  <parameter name="prompt">Fix typo in README.md line 42</parameter>
</invoke>
```

**FIX**: Do it directly. Task tool has overhead. Simple edits (<5 mins) should be direct.

### Mistake 2: Sequential Instead of Parallel

```xml
<!-- DON'T: Sends tasks in separate messages -->
Message 1: <invoke name="Task">Fix TypeScript</invoke>
Message 2: <invoke name="Task">Run tests</invoke>
```

**FIX**: Send all Tasks in single message for parallel execution.

### Mistake 3: Unclear Prompts

```xml
<!-- DON'T: Vague prompt -->
<invoke name="Task">
  <parameter name="prompt">Make it better</parameter>
</invoke>
```

**FIX**: Be specific. List exact tasks, files, success criteria.

### Mistake 4: Delegating Creative Work

```xml
<!-- DON'T: Requires your authentic voice -->
<invoke name="Task">
  <parameter name="prompt">Write customer email for radio promoters</parameter>
</invoke>
```

**FIX**: Keep customer-facing content in main agent. Your voice, context, judgment required.

## Red Flags

If you catch yourself thinking:

- "This task is complex..." → Consider Task tool
- "Multiple things could run parallel..." → Use Task tool
- "This needs deep expertise in X..." → Delegate to Task tool
- "I'll do A, then B, then C..." → Can A, B, C run parallel? Use Task tool

If you notice:

- Spending >30 mins on single task → Should have delegated
- Doing similar work in multiple places → Should have parallelized
- Waiting for one task to finish before starting another → Should have run parallel

## Integration with Skills

**This skill coordinates usage of other skills via Task tool:**

- Use `systematic-debugging` → For bug investigation (then delegate fixes)
- Use `customer-acquisition-focus` → For prioritization (before delegating work)
- Use `brainstorming` → For planning (then delegate implementation)
- Use `changelog-generator` → Via Task tool (parallel with other work)
- Use `mobile-first-validator` → Via Task tool (parallel validation)

## Bottom Line

**Always ask yourself**: "Can this be parallelized?"

- If **YES** → Use Task tool (multiple calls in one message)
- If **NO** → Handle directly

When in doubt, delegate. Subagents are fast and specialized.

**Expected ROI**: 3-5x faster execution on complex tasks = 10-15 hours saved per month = 5-7 extra 2-hour sessions.

That's the difference between hitting £500/month goal by November vs missing it.
