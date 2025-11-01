---
name: experimental-sandbox-guard
description: Use when working on totalaud.io experimental project - ensures experimental code stays isolated from Total Audio Platform production code, prevents cross-contamination of dependencies, validates no production impact from experimental features
---

# Experimental Sandbox Guard

## Overview

**totalaud.io is your playground. Total Audio Platform is your business.**

This skill ensures experimental work in totalaud.io never affects production Audio Intel.

**Core principle:** Experiments can fail. Production cannot.

## When to Use

Use this skill when:

- Working in `/Users/chrisschofield/workspace/active/totalaud.io/`
- Creating new experimental features
- Testing wild AI agent ideas
- Trying new UI patterns
- Experimenting with architecture

**Especially important when:**

- Using shared resources (Supabase, APIs)
- Creating new integrations
- Testing with real data
- Deploying to production (Vercel)

## The Two Projects

### Total Audio Platform (Production)

**Location**: `~/workspace/active/total-audio-platform/`
**Status**: Customer acquisition phase
**Rules**: Ship fast, no experiments, customer-focused
**Database**: Shared Supabase (production tables)
**Risk Tolerance**: LOW (customer-facing)

### totalaud.io (Experimental)

**Location**: `~/workspace/active/totalaud.io/`
**Status**: Learning sandbox, innovation lab
**Rules**: Experiment freely, break things, learn
**Database**: Shared Supabase (experimental tables)
**Risk Tolerance**: HIGH (no customers)

## The Iron Law

```
NO PRODUCTION CODE IN EXPERIMENTAL PROJECTS
NO EXPERIMENTAL CODE IN PRODUCTION PROJECTS
```

Clear separation prevents "quick experiment" from breaking customer-facing features.

## Isolation Checklist

### Before Starting Experimental Work

**1. Directory Verification:**

- [ ] Confirm you're in `/totalaud.io/` directory
- [ ] NOT in `/total-audio-platform/` directory
- [ ] Git remote is separate repository

**2. Dependency Isolation:**

- [ ] No imports from `total-audio-platform` code
- [ ] No shared components (copy if needed)
- [ ] Separate package.json dependencies
- [ ] No shared node_modules

**3. Database Isolation:**

- [ ] Experimental tables have clear prefix (`exp_`, `totalaud_`)
- [ ] No writes to production tables (`contacts`, `users`, `enrichments`)
- [ ] No production API keys in experimental code
- [ ] Separate Supabase projects (or careful table namespacing)

**4. API Isolation:**

- [ ] Separate API keys for experimental services
- [ ] No production Anthropic API key in experiments
- [ ] Rate limits won't affect production
- [ ] Separate Stripe test mode keys

## Supabase Safety (Shared Database)

**Both projects use same Supabase instance. HIGH RISK.**

### Safe Experimental Tables

```sql
-- SAFE: Experimental tables (totalaud.io only)
CREATE TABLE totalaud_agent_manifests (...)
CREATE TABLE totalaud_flows (...)
CREATE TABLE totalaud_missions (...)
CREATE TABLE exp_theme_configs (...)
CREATE TABLE exp_onboarding_state (...)
```

### NEVER Touch Production Tables

```sql
-- DANGER: Production tables (Audio Intel only)
contacts
users
enrichment_jobs
subscriptions
payments
radio_contacts
```

**Rule:** If table name doesn't start with `totalaud_` or `exp_`, it's production. Don't touch.

## Environment Variables

### Production (.env in total-audio-platform)

```bash
# Production keys - NEVER use in experiments
NEXT_PUBLIC_SUPABASE_URL=https://ucncbighzqudaszewjrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<prod-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<prod-service-key>
ANTHROPIC_API_KEY=<prod-api-key>
STRIPE_SECRET_KEY=<prod-stripe-key>
```

### Experimental (.env in totalaud.io)

```bash
# Same Supabase, but different table access
NEXT_PUBLIC_SUPABASE_URL=https://ucncbighzqudaszewjrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<prod-anon-key>  # OK, RLS protects tables
SUPABASE_SERVICE_ROLE_KEY=<separate-or-careful>  # DANGER if used on prod tables
ANTHROPIC_API_KEY=<separate-experimental-key>  # Use different key if possible
NEXT_PUBLIC_APP_URL=https://totalaud.io
```

**Key Safety:**

- Supabase anon key: Safe (RLS protects tables)
- Supabase service key: DANGER (bypasses RLS, could write to prod)
- Anthropic API key: Use separate key (rate limits, costs)
- Stripe keys: Always test mode in experiments

## Code Import Safety

### ❌ NEVER Do This (Cross-Project Imports)

```typescript
// totalaud.io importing from production
import { enrichContact } from '@total-audio-platform/audio-intel/enrichment';
import { ContactSchema } from '@total-audio-platform/core/schemas';

// This creates dependency on production code!
// If you change production, experiments break (and vice versa)
```

### ✅ DO This (Copy or Rewrite)

```typescript
// totalaud.io with independent code
// Copy the schema if you need it, don't import
interface ExperimentalContact {
  id: string;
  email: string;
  // ... copied structure, not shared code
}

// Or create new experimental version
interface AgentManifest {
  // Totally new experimental concept
}
```

## Deployment Isolation

### Production Deployment (Audio Intel)

- **Platform**: Vercel
- **URL**: https://intel.totalaudiopromo.com
- **Branch**: `main` in total-audio-platform repo
- **Database**: Production Supabase tables
- **Impact**: Customer-facing, must work

### Experimental Deployment (totalaud.io)

- **Platform**: Vercel
- **URL**: https://totalaud.io
- **Branch**: `main` in totalaud.io repo
- **Database**: Experimental Supabase tables
- **Impact**: No customers, can break

**Rule:** Separate Vercel projects, separate deployments, separate URLs.

## Red Flags - STOP Immediately

If you catch yourself:

- Importing code from `../total-audio-platform/`
- Writing to production Supabase tables
- Using production API keys in experiments
- "Just testing with real customer data..."
- Copying production code and modifying it in place
- "This experiment is ready for production, let me merge it..."

**ALL of these mean:** STOP. Violating isolation. Fix immediately.

## When to Move Experimental → Production

**Only move to production if:**

1. Experiment is validated and stable
2. Customer need is proven (not just "cool idea")
3. Code is rewritten for production quality (not copied)
4. Tests are added
5. Customer acquisition phase allows new features (post-£500/month)

**Process:**

1. Rewrite from scratch in production repo (don't copy experimental code)
2. Add proper error handling, tests, monitoring
3. Deploy to production Supabase tables (with migration)
4. Update production environment variables
5. Test thoroughly before customer use

## Success Metrics

**Isolation Health Check (Weekly):**

- [ ] No experimental code in production repo
- [ ] No production code in experimental repo
- [ ] No cross-imports between projects
- [ ] Separate deployment pipelines working
- [ ] No production table writes from experiments

**Risk Indicators (Monthly):**

- Incidents caused by experimental code: **\_** (target: 0)
- Production data affected by experiments: **\_** (target: 0)
- Customer-facing breaks from experiments: **\_** (target: 0)

## Common Rationalizations

| Excuse                                | Reality                                         |
| ------------------------------------- | ----------------------------------------------- |
| "Just a quick test with prod data"    | Test data exists for a reason. Use it.          |
| "Importing is easier than copying"    | Coupling is expensive. Copy is cheap.           |
| "Same Supabase, no big deal"          | RLS can fail. Mistakes happen. Isolate anyway.  |
| "This experiment is production-ready" | Rewrite it properly. Experiments != production. |
| "I'll be careful"                     | Careful isn't a strategy. Isolation is.         |

## Integration with Other Skills

**When working on totalaud.io:**

1. Use this skill to verify isolation
2. DON'T use **customer-acquisition-focus** (no customers in experiments)
3. Experiment freely, break things, learn

**When working on Total Audio Platform:**

1. Use **customer-acquisition-focus** to validate customer impact
2. DON'T use experimental patterns from totalaud.io
3. Ship fast, validate with customers

## Real-World Example

**Safe Experimental Work:**

```typescript
// totalaud.io: Testing multi-agent spawning
const manifest = await supabase
  .from('totalaud_agent_manifests') // ✅ Experimental table
  .insert({ name, role, personality });

// Experiments with themes, onboarding, AI agents
// If it breaks, no customers affected
// Learn fast, iterate freely
```

**Production Work:**

```typescript
// total-audio-platform: Audio Intel enrichment
const contact = await supabase
  .from('contacts') // Production table
  .select('*')
  .eq('user_id', userId);

// Customer-facing, must work
// No experiments, validated patterns only
```

## Bottom Line

**totalaud.io exists so you can experiment without risk.**

Use it! Try crazy ideas! Break things! Learn!

**Just keep it isolated from production.**

Customer-facing code is sacred. Experimental code is disposable.

**This skill ensures:**

- Experiments stay in sandbox
- Production stays stable
- You can innovate without fear
- Customers are never affected by experiments
