# Claude Code Skills - Implementation Checklist

## Phase 1: Foundation (This Week)

### Day 1: Enable & Install Core Skills

- [ ] **Enable Skills in Claude Code**
  - Open Claude Code settings (⌘,)
  - Navigate to Capabilities
  - Toggle "Skills" to ON
  - Restart Claude Code
  - Verify skills capability is active

- [ ] **Install Skill Creator**
  - Method 1: `/plugin` → Add marketplace → Install
  - Method 2: Manual git clone from obra/superpowers
  - Location: `~/.claude/skills/skill-creator/`
  - Test: Ask Claude to "Use Skill Creator to..."

- [ ] **Install Changelog Generator**
  - Source: ComposioHQ/awesome-claude-skills
  - Location: `~/.claude/skills/changelog-generator/`
  - Test: Generate changelog from recent commits

- [ ] **Install Systematic Debugging**
  - Source: obra/superpowers
  - Location: `~/.claude/skills/systematic-debugging/`
  - Test: Use on a known bug/issue

---

### Day 2: Create Audio Intel Custom Skills

- [ ] **Create: audio-intel-mobile-validator**

  ```
  Use Skill Creator to build a skill that validates mobile UX against 21 standards:

  Standards to check:
  1. Touch targets minimum 44x44px
  2. Responsive breakpoints (320px, 375px, 768px, 1024px)
  3. Loading states for all async operations
  4. Error boundaries and user-friendly error messages
  5. Form validation with inline feedback
  6. Accessible colour contrast (WCAG AA)
  7. Focus management for keyboard navigation
  8. Haptic feedback on mobile interactions
  9. Optimistic UI updates
  10. Skeleton loaders (not spinners)
  11. Viewport meta tag correct
  12. No horizontal scroll
  13. Safe area insets for notched devices
  14. Text readable without zoom
  15. Tap targets not overlapping
  16. Swipe gestures don't conflict
  17. Portrait and landscape support
  18. Network error recovery
  19. Offline state handling
  20. Performance budgets met (Core Web Vitals)
  21. Conversion funnel optimized

  Trigger: When creating/modifying components in apps/audio-intel/
  ```

- [ ] **Create: customer-acquisition-tracker**

  ```
  Use Skill Creator to build a skill that tracks customer metrics:

  Metrics to track:
  - Current MRR: £0 → Target: £500
  - Demo calls booked vs completed
  - Conversion rates by segment:
    * Radio promoters (target 85%)
    * Solo artists with budget (target 60%)
    * Growing PR agencies (target 70%)
  - Beta signups from content marketing
  - Newsletter subscriber growth
  - Feature requests from prospects
  - Churn reasons (if any)

  Trigger: When updating CLAUDE.md or customer data
  Output: Dashboard summary + next action recommendations
  ```

- [ ] **Create: two-hour-session-validator**

  ```
  Use Skill Creator to build a skill that prevents scope creep:

  Checks at session start:
  - Task scope clearly defined
  - Success criteria measurable
  - Estimated time ≤ 2 hours
  - Customer acquisition focused

  Checks every 30 minutes:
  - Still on track for 2-hour completion
  - No rabbit holes detected
  - No perfectionism over shipping

  Red flags:
  - "Just one more optimization..."
  - "Let me refactor this first..."
  - "This could be cleaner..."
  - "I'll add this nice-to-have..."

  Trigger: Manual invocation at session start + every 30 mins
  ```

---

### Day 3: Create totalaud.io Custom Skills

- [ ] **Create: experimental-sandbox-guard**

  ```
  Use Skill Creator to build a skill that keeps experiments separate:

  Checks when working in /totalaud.io:
  - No imports from /total-audio-platform
  - No shared Supabase tables affecting production
  - No production API keys in experimental code
  - No customer data used for testing
  - Clear documentation of experiments

  Warnings:
  - If experimental code could affect Audio Intel
  - If Supabase migration affects production tables
  - If environment variables overlap

  Trigger: When working in totalaud.io directory
  ```

- [ ] **Create: theme-system-validator**

  ```
  Use Skill Creator to build a skill for theme consistency:

  Validates across 5 themes (ascii, xp, aqua, daw, analogue):
  - All themes have required ThemeConfig keys
  - Colour contrast meets WCAG AA
  - Sound banks defined (oscillator, frequencies, durations)
  - Layout configs consistent (borderStyle, borderRadius, etc.)
  - Narrative descriptors present (tagline, personality)
  - No hardcoded theme names in components

  Trigger: When modifying themes/ or theme-aware components
  ```

---

## Phase 2: Validation (Week 2)

### Skill Effectiveness Testing

- [ ] **Test Skill Creator**
  - Successfully created 5 custom skills
  - Skills activate when expected
  - Skills provide actionable feedback
  - Token usage is reasonable

- [ ] **Test Changelog Generator**
  - Generate Audio Intel changelog
  - Generate totalaud.io changelog
  - Customer-facing vs developer-facing versions
  - Accurate commit attribution

- [ ] **Test Systematic Debugging**
  - Use on real bug/issue
  - 4-phase framework followed
  - Root cause identified correctly
  - Solution implemented successfully

- [ ] **Test Custom Skills**
  - audio-intel-mobile-validator catches violations
  - customer-acquisition-tracker updates metrics
  - two-hour-session-validator prevents scope creep
  - experimental-sandbox-guard warns correctly
  - theme-system-validator catches inconsistencies

---

### Integration Testing

- [ ] **Git Workflow Integration**

  ```bash
  # Before commit checklist:
  1. Skills validate code quality 
  2. Changelog generated 
  3. Customer metrics updated 
  4. Commit message includes context 
  ```

- [ ] **MCP + Skills Integration**
  - Gmail MCP + Customer Tracker: Auto-track responses
  - Notion MCP + Changelog Generator: Auto-publish
  - Puppeteer MCP + Mobile Validator: Automated testing

- [ ] **2-Hour Session Integration**
  - Session starts with scope validation
  - 30-minute check-ins automated
  - Session ends with changelog + metrics

---

## Phase 3: Optimization (Month 1)

### Token Usage Optimization

- [ ] **Measure Skill Token Usage**
  - Track token consumption per skill
  - Identify heavy consumers
  - Optimize or archive if needed

- [ ] **Archive Unused Skills**
  - Move Simplification Cascades to archive (defer until post-revenue)
  - Move any custom skills not being used
  - Keep only customer acquisition focused skills

- [ ] **Disable Auto-Invocation**
  - Experimental skills: Manual invocation only
  - Optimization skills: Deferred
  - Customer acquisition skills: Always active

---

### Skill Refinement

- [ ] **Refine audio-intel-mobile-validator**
  - Add checks for new UX standards discovered
  - Remove checks that are never violated
  - Improve feedback messages

- [ ] **Refine customer-acquisition-tracker**
  - Add metrics based on actual customer feedback
  - Integrate with real demo call data
  - Add forecasting based on trends

- [ ] **Refine two-hour-session-validator**
  - Adjust time estimates based on actual sessions
  - Add common rabbit hole patterns observed
  - Improve scope estimation accuracy

---

## Phase 4: Maintenance (Ongoing)

### Weekly Reviews

- [ ] **Week 1 Review**
  - Date: \***\*\_\*\***
  - Skills used this week: \***\*\_\*\***
  - Time saved estimate: \***\*\_\*\***
  - Customer acquisition impact: \***\*\_\*\***
  - Adjustments needed: \***\*\_\*\***

- [ ] **Week 2 Review**
  - Date: \***\*\_\*\***
  - Skills used this week: \***\*\_\*\***
  - Time saved estimate: \***\*\_\*\***
  - Customer acquisition impact: \***\*\_\*\***
  - Adjustments needed: \***\*\_\*\***

- [ ] **Week 3 Review**
  - Date: \***\*\_\*\***
  - Skills used this week: \***\*\_\*\***
  - Time saved estimate: \***\*\_\*\***
  - Customer acquisition impact: \***\*\_\*\***
  - Adjustments needed: \***\*\_\*\***

- [ ] **Week 4 Review**
  - Date: \***\*\_\*\***
  - Skills used this week: \***\*\_\*\***
  - Time saved estimate: \***\*\_\*\***
  - Customer acquisition impact: \***\*\_\*\***
  - Adjustments needed: \***\*\_\*\***

---

### Monthly Reviews

- [ ] **Month 1 Review**
  - Skills created: \***\*\_\*\***
  - Skills archived: \***\*\_\*\***
  - Time saved total: \***\*\_\*\***
  - Customer acquisition wins attributed to skills: \***\*\_\*\***
  - Skills to create next month: \***\*\_\*\***

---

## Success Metrics

### Quantitative

- [ ] Reduced average debugging time by >30%
- [ ] Reduced mobile UX issues in production by >50%
- [ ] Generated changelogs for 100% of releases
- [ ] Maintained 2-hour session discipline for >80% of sessions
- [ ] Zero experimental code leaked to Audio Intel production

### Qualitative

- [ ] Skills feel helpful, not intrusive
- [ ] Custom skills reflect actual workflow needs
- [ ] Token usage is sustainable
- [ ] Skills accelerate customer acquisition (don't distract)

---

## Red Flags (When to Pause & Reassess)

- [ ] Skills are consuming too many tokens (>20% increase)
- [ ] Skills are slowing down workflow instead of accelerating
- [ ] Custom skills are rarely used (archive them)
- [ ] Skills are detecting patterns you don't care about
- [ ] Skills are distracting from customer acquisition

---

## Resources & Links

### Documentation Created

- `~/.claude/skills/README.md` - Installation status & guidelines
- `~/.claude/SKILLS_SETUP_GUIDE.md` - Step-by-step setup instructions
- `~/.claude/SKILLS_QUICK_REFERENCE.md` - Daily usage patterns
- `~/.claude/SKILLS_IMPLEMENTATION_CHECKLIST.md` - This file

### External Resources

- Anthropic Skills Repo: https://github.com/anthropics/anthropic-skills
- obra/superpowers: https://github.com/obra/superpowers
- obra/superpowers-skills: https://github.com/obra/superpowers-skills
- ComposioHQ/awesome-claude-skills: https://github.com/ComposioHQ/awesome-claude-skills
- Video Tutorial: https://www.youtube.com/watch?v=901VMcZq8X4

---

## Notes & Observations

### What's Working

```
[Add notes as you implement]
```

### What's Not Working

```
[Add notes as you implement]
```

### Ideas for New Skills

```
[Add ideas as they come up]
```

### Skills to Archive

```
[Add skills that aren't providing value]
```

---

## Next Actions (After Checklist Complete)

- [ ] Update main CLAUDE.md with skills integration
- [ ] Document skill effectiveness in project READMEs
- [ ] Share learnings with community (if applicable)
- [ ] Consider contributing custom skills back to community repos
- [ ] Review skill strategy after first customer acquisition (£500/month milestone)

---

**Last Updated:** October 2025
**Status:** Ready to implement
**Estimated Time:**

- Phase 1 (Foundation): 3-4 hours
- Phase 2 (Validation): 2-3 hours
- Phase 3 (Optimization): 1-2 hours/week
- Phase 4 (Maintenance): 30 mins/week

**Next Action:** Enable Skills in Claude Code (⌘, → Capabilities → Skills → Restart)
