---
name: customer-acquisition-focus
description: Use when working on Total Audio Platform (Audio Intel) during customer acquisition phase - enforces focus on customer-facing features over technical perfection, validates work contributes to £500/month goal, prevents perfectionism and over-optimization that delays customer acquisition
---

# Customer Acquisition Focus

## Overview

**During customer acquisition phase: Shipping beats polishing.**

This skill enforces focus on getting first paying customers for Audio Intel, not building the perfect product.

**Core principle:** Every task must answer "Does this help acquire the first paying customer?"

## When to Use

Use this skill when working on:

- **Total Audio Platform** (`~/workspace/active/total-audio-platform/`)
- **Audio Intel** specifically (`apps/audio-intel/`)
- Any customer-facing feature work
- Planning 2-hour development sessions

**Especially use when you notice:**

- Refactoring working code
- "Just one more optimization..."
- Technical perfectionism
- Building features customers didn't request
- Scope creeping beyond 2 hours

## Current Business Context

**Project**: Total Audio Platform (Audio Intel SaaS)
**Phase**: Customer Acquisition (0 → £500/month)
**Target**: First paying customer by November 2025
**Foundation Status**: ✅ Complete (mobile UX fixed, enrichment working, payment integrated)

**Conversion Rates (Validated)**:

- Radio promoters: 85% (highest priority)
- Solo artists with budget: 60%
- Growing PR agencies: 70%

## The Iron Law

```
NO WORK THAT DOESN'T CONTRIBUTE TO FIRST CUSTOMER
```

If you can't explain how this task helps acquire first paying customer, STOP and choose different task.

## Decision Framework

### ✅ DO (Customer Acquisition Tasks)

**Customer Communication:**

- Generate changelogs for demo calls
- Create case study content (BBC Radio 1, Spotify successes)
- Write testimonial request emails
- Update marketing site copy
- Newsletter content for "The Unsigned Advantage"

**Conversion Optimization:**

- Fix bugs that block signups
- Improve onboarding flow
- Add social proof elements
- Optimize mobile experience
- Speed up contact enrichment

**Demo Preparation:**

- Create demo scripts (Radio 15min, Artist 12min, Agency 20min)
- Prepare real-time enrichment demonstrations
- Document proven ROI ("15 hours → 15 minutes")
- Build confidence in live demos

**Customer Success:**

- Fix issues blocking beta users
- Respond to customer feedback
- Improve error messages
- Add usage analytics
- Make first-time experience smooth

### ❌ DON'T (Technical Perfection)

**Premature Optimization:**

- Refactoring working code
- Micro-optimizations (< 100ms improvements)
- Architecture "improvements"
- Code style cleanup
- Test coverage increases (unless fixing bugs)

**Nice-to-Have Features:**

- Features customers didn't request
- "Wouldn't it be cool if..." ideas
- Advanced features for power users
- Integration with services customers don't use
- Experimental AI features (save for totalaud.io)

**Technical Debt:**

- TypeScript strict mode fixes (unless blocking features)
- ESLint rule enforcement
- Dependency updates (unless security critical)
- Documentation improvements (unless customer-facing)
- Build optimization (unless blocking deployments)

## Session Start Checklist

Before starting any 2-hour session on Audio Intel:

**1. Task Validates:**

- [ ] Task is customer-facing or customer-blocking
- [ ] Task contributes to first paying customer
- [ ] Task fits in 2 hours (scope is clear)
- [ ] Not refactoring/optimizing working code
- [ ] Not building unrequested features

**2. Customer Impact Clear:**

- [ ] Can explain to customer why this matters
- [ ] Directly improves conversion or removes blocker
- [ ] Would mention in demo call or changelog
- [ ] Customer would notice and appreciate

**3. Alternatives Considered:**

- [ ] Is there a simpler version that ships faster?
- [ ] Can we validate with customers before building fully?
- [ ] Is there a 80/20 version (20% effort, 80% value)?

## Red Flags - STOP and Reconsider

If you catch yourself:

- "Just a quick refactor first..."
- "Let me clean up this code while I'm here..."
- "This optimization will make it better..."
- "We should really fix this technical debt..."
- "Adding this extra feature would be cool..."
- "Let me make this perfect..."
- Planning work beyond 2-hour session scope

**ALL of these mean:** STOP. Return to customer acquisition focus.

## When Technical Work IS Justified

**Fix it NOW if:**

- Blocking customer signups
- Causing support tickets
- Breaking demo calls
- Affecting conversion rates
- Security vulnerability

**Fix it LATER (after £500/month) if:**

- Technical debt that doesn't affect customers
- Code quality improvements
- Performance optimizations (if not user-facing)
- Architecture refactoring
- Developer experience improvements

## Integration with Other Skills

**Before proposing any work:**

1. Use this skill to validate customer acquisition focus
2. If debugging, use **systematic-debugging** to fix fast
3. After fixing, use **changelog-generator** for customer communication

**This skill overrides:**

- Perfectionism instincts
- Technical debt anxiety
- "Clean code" principles (temporarily)
- Feature scope expansion

## Experimental Work (totalaud.io)

**This skill does NOT apply to totalaud.io work.**

totalaud.io is your experimental sandbox - perfectionism, refactoring, wild ideas are ENCOURAGED there.

**Clear separation:**

- **Total Audio Platform** = customer acquisition focus, ship fast, validate with users
- **totalaud.io** = experimental, learn, innovate, no pressure

## Time-Boxed Sessions (2 Hours)

**Session Planning:**

- Start: Validate task against customer acquisition focus
- Every 30 mins: Check scope hasn't expanded
- End: Generate changelog, update customer metrics

**Scope Expansion Detection:**

- Original task: "Fix signup error"
- Scope creep: "Fix signup error + refactor auth + improve validation + add analytics"

**If scope expanding:** STOP. Ship original task. Add other items to backlog.

## Success Metrics

**Weekly Check:**

- Demo calls booked this week: **\_**
- Beta signups this week: **\_**
- Customer feedback received: **\_**
- Time spent on non-customer work: **\_** (target: < 20%)

**Monthly Check:**

- Progress toward £500/month: **\_**
- Conversion rate by segment: **\_**
- Customer testimonials collected: **\_**
- Time saved vs wasted on perfectionism: **\_**

## Common Rationalizations

| Excuse                              | Reality                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------- |
| "This refactor will help long-term" | Long-term doesn't matter if no customers. Ship first.                     |
| "Clean code is important"           | Perfect code with no customers = $0. Messy code with customers = revenue. |
| "Technical debt will slow us down"  | Premature optimization is real debt. Fix when proven necessary.           |
| "This feature would be so useful"   | Customers tell you what's useful. Don't guess.                            |
| "Just one more polish..."           | Polishing delays shipping. Ship, get feedback, iterate.                   |
| "It's almost perfect"               | Perfect is the enemy of done. Done gets customers.                        |

## Real-World Impact

**From Audio Intel journey:**

- Foundation complete (21 UX issues resolved)
- 100% enrichment success rate proven
- Payment systems functional
- Mobile experience optimized

**What's blocking first customer?**

- NOT technical perfection (foundation is solid)
- NOT feature completeness (core value proven)
- Customer acquisition execution (demos, outreach, trust-building)

**This skill prevents:** Wasting 2-hour sessions on technical perfectionism when customer acquisition actions are what's needed.

## Bottom Line

**During customer acquisition phase:**

- Ship > Polish
- Done > Perfect
- Customer-facing > Technical excellence
- Validate > Build
- Fast iteration > Clean architecture

**After £500/month:**

- Refactor with confidence
- Optimize for scale
- Clean up technical debt
- Build advanced features

**Right now:** Focus ruthlessly on first paying customer.
