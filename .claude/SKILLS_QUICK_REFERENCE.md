# Claude Code Skills - Quick Reference

## 🚀 Daily Usage Patterns

### Before Starting Work (Audio Intel)
```
✓ Check: Two-hour session scope fits today's goal
✓ Invoke: Systematic Debugging if fixing bugs
✓ Track: Customer acquisition metrics updated
```

### Before Starting Work (totalaud.io)
```
✓ Check: Experimental sandbox guard active
✓ Document: What you're learning/testing
✓ Ensure: No production dependencies
```

### Before Committing Code
```bash
# Audio Intel
1. Run: npm run test:mobile
2. Invoke: Changelog Generator
3. Update: Customer acquisition metrics
4. Commit with customer-facing message

# totalaud.io
1. Run: pnpm typecheck
2. Document experimental findings
3. Ensure no production impact
4. Commit with learning notes
```

---

## 🎯 When to Use Each Skill

### Skill Creator
**Use When:**
- You notice a repetitive workflow pattern
- You want to enforce a new code standard
- You need project-specific validation

**Example:**
```
"Use Skill Creator to build a mobile UX validator that checks all 21 standards"
```

---

### Changelog Generator
**Use When:**
- Preparing for customer demo calls
- Publishing Audio Intel updates
- Documenting experimental features
- Investor/progress updates

**Example:**
```
"Generate customer-facing changelog from commits abc123..def456"
```

---

### Systematic Debugging
**Use When:**
- Stuck on a bug for >15 minutes
- Vercel deployment fails
- TypeScript errors are confusing
- Mobile UX issue is hard to reproduce

**Example:**
```
"Use Systematic Debugging to investigate why Vercel can't resolve @/components"
```

**4 Phases:**
1. Root cause analysis
2. Pattern identification
3. Hypothesis testing
4. Implementation + verification

---

### Brainstorming
**Use When:**
- Planning new Audio Intel features
- Designing customer acquisition experiments
- Scoping 2-hour development sessions
- Exploring totalaud.io workflows

**Example:**
```
"Brainstorm: How to improve Audio Intel conversion rate from 60% to 75%"
```

---

### Simplification Cascades
**Use When:** (Deferred until post-£500/month)
- Code has obvious duplication
- Multiple components do same thing
- Abstractions are too complex
- Refactoring won't break customer features

**Example:**
```
"Simplify: We have 3 different contact enrichment patterns across the codebase"
```

---

## 🎨 Custom Skills (To Be Created)

### audio-intel-mobile-validator
```bash
# Auto-invokes when:
- Creating new components in apps/audio-intel/
- Modifying existing mobile UX
- Running mobile test suite

# Checks:
- Touch targets ≥44x44px
- Responsive breakpoints correct
- Loading states present
- Error handling user-friendly
```

---

### customer-acquisition-tracker
```bash
# Auto-invokes when:
- Updating CLAUDE.md with metrics
- Logging demo call outcomes
- Recording customer feedback

# Reports:
- Current: £0/month → Target: £500/month
- Conversion rates by segment
- Demo call quality scores
```

---

### two-hour-session-validator
```bash
# Auto-invokes:
- At session start
- Every 30 minutes during session
- When scope creep detected

# Validates:
- Task fits remaining time
- No rabbit holes
- Customer acquisition focus maintained
```

---

## ⚡ Quick Commands

### Manual Skill Invocation
```
"Use [skill name] to [specific task]"

Examples:
"Use Systematic Debugging to fix this Vercel error"
"Use Changelog Generator for commits from last week"
"Use Skill Creator to enforce theme system consistency"
```

---

## 🎯 Decision Tree: Which Skill?

```
Is it a BUG?
├─ Yes → Systematic Debugging
└─ No ↓

Is it about CUSTOMER ACQUISITION?
├─ Yes → Customer Acquisition Tracker
└─ No ↓

Is it a NEW FEATURE idea?
├─ Yes → Brainstorming
└─ No ↓

Is it about CODE QUALITY?
├─ During customer acquisition → Skip (defer)
└─ Post-£500/month → Simplification Cascades

Is it a NEW WORKFLOW PATTERN?
└─ Yes → Skill Creator
```

---

## 🚨 Red Flags (When to Stop & Use Skills)

### 🔴 Use Systematic Debugging If:
- "I've tried 3 different approaches and none work"
- "This error message doesn't make sense"
- "It works locally but fails in production"
- "I've been debugging for >30 minutes"

### 🔴 Use Two-Hour Session Validator If:
- "This is taking longer than expected"
- "I've gone down a rabbit hole"
- "This optimization isn't customer-facing"
- "I'm refactoring instead of shipping"

### 🔴 Use Brainstorming If:
- "I'm not sure how to approach this feature"
- "Multiple solutions seem equally valid"
- "This could affect customer conversion rates"
- "Architecture decision needed"

---

## 📊 Measuring Skill Effectiveness

### Weekly Review Questions
- Which skills saved time this week?
- Which skills were invoked but not helpful?
- What new skills should be created?
- What skills should be archived?

### Monthly Metrics
- Time saved per skill (estimated)
- Customer acquisition impact
- Code quality improvements
- Developer velocity changes

---

## 🎪 Integration with Existing Tools

### Skills + MCP Servers
```
Gmail MCP + Customer Tracker = Auto-track demo responses
Notion MCP + Changelog Generator = Auto-publish releases
Puppeteer MCP + Mobile Validator = Automated UX testing
```

### Skills + Git Workflow
```
Before commit:
1. Skills validate code quality
2. Changelog Generator creates notes
3. Customer metrics updated
4. Git commit with context
```

### Skills + 2-Hour Sessions
```
Session Start:
1. Two-Hour Validator scopes work
2. Set clear completion criteria
3. Use Systematic Debugging if stuck

Every 30 mins:
1. Check time remaining
2. Adjust scope if needed
3. No rabbit holes

Session End:
1. Generate changelog
2. Update customer metrics
3. Document learnings
```

---

## 🔧 Troubleshooting

### "Skill Not Activating"
```bash
# Check skill is installed
ls -la ~/.claude/skills/[skill-name]

# Restart Claude Code
# Try manual invocation: "Use [skill name] to..."
```

### "Too Many Tokens Being Used"
```bash
# Archive unused skills
mv ~/.claude/skills/[unused-skill] ~/.claude/skills-archive/

# Disable auto-invocation for experimental skills
# Use manual invocation only
```

### "Skills Conflicting"
```
Priority order:
1. Customer acquisition skills (always)
2. Debugging skills (when stuck)
3. Quality skills (manual only)
4. Optimization skills (deferred)
```

---

## 📝 Notes Section

### Skill Creator Notes
```
Custom skills created:
- [ ] audio-intel-mobile-validator
- [ ] customer-acquisition-tracker
- [ ] two-hour-session-validator
- [ ] experimental-sandbox-guard
- [ ] theme-system-validator
```

### Effectiveness Log
```
Date: [Date]
Skill: [Name]
Time Saved: [Estimate]
Impact: [Customer acquisition / Code quality / Developer velocity]
Keep?: [Yes/No/Archive]
```

---

**Last Updated:** October 2025
**Next Review:** After first customer acquisition
**Philosophy:** Skills should accelerate customer acquisition, not distract from it
