# Command Centre Audit Report

**Date**: 2025-11-02
**Purpose**: Transform Command Centre → Ops Console Web (Phase 9D)
**Status**: Pre-implementation Audit

## Current State Analysis

### Existing Pages (9 pages)

| Route                   | Purpose                   | Status | Action                        |
| ----------------------- | ------------------------- | ------ | ----------------------------- |
| `/agents`               | Agent monitoring          | Keep   | Enhance with Phase 9B data    |
| `/social-scheduler`     | Social media posting      | Keep   | Integrate with new connectors |
| `/social-media-hub`     | Social content management | Keep   | Consolidate with scheduler    |
| `/newsjacking`          | News-based content        | Keep   | Wire to newsjacker API        |
| `/revenue-intelligence` | Revenue tracking          | Retire | Move to Audio Intel metrics   |
| `/predictive-revenue`   | Revenue forecasting       | Retire | Superseded by cohorts         |
| `/beta-management`      | Beta user controls        | Keep   | Extend with feedback data     |
| `/radio-promo`          | Radio campaign tools      | Retire | Moved to Audio Intel          |
| `/users`                | User management           | Keep   | Admin-only access             |

### Existing API Routes (15 routes)

| Endpoint                              | Purpose               | Status  | Action                     |
| ------------------------------------- | --------------------- | ------- | -------------------------- |
| `/api/agents/consolidated`            | Agent metrics         | Keep    | Wire to Phase 9B tables    |
| `/api/agents/social-media-scheduler`  | Social agent          | Keep    | Update with new connectors |
| `/api/social-media/schedule`          | Schedule posts        | Keep    | Add BlueSky/Threads        |
| `/api/social-media/bluesky`           | BlueSky integration   | Enhance | Complete OAuth flow        |
| `/api/social-media/templates`         | Content templates     | Keep    | Add AI generation          |
| `/api/content-domination/newsjacking` | News content          | Keep    | Wire to Claude API         |
| `/api/content-domination/scheduling`  | Content calendar      | Keep    | Integrate with ConvertKit  |
| `/api/revenue-prediction`             | Revenue ML            | Retire  | Use cohorts instead        |
| `/api/revenue-alerts`                 | Revenue notifications | Retire  | Telegram replaces          |
| `/api/revenue-opportunities`          | Revenue insights      | Retire  | Move to growth-reflex      |
| `/api/social-content`                 | Content generation    | Keep    | Enhance with Claude        |
| `/api/audio-intel-metrics`            | Metrics proxy         | Retire  | Direct Supabase queries    |
| `/api/saas-marketing`                 | Marketing automation  | Keep    | Wire to ConvertKit         |
| `/api/beta-limits`                    | Beta restrictions     | Keep    | Extend with usage tracking |
| `/api/health`                         | Health check          | Keep    | Add agent status           |

## Social Integration Status

### Working Integrations

- **X (Twitter)**: OAuth 2.0 flow operational
- **LinkedIn**: OAuth 2.0 flow operational
- Tokens stored in Vercel environment variables
- Posting API endpoints functional

### Incomplete Integrations

- **BlueSky**: Stub exists, needs OAuth completion
- **Threads**: No connector, needs full implementation
- **Instagram**: Not implemented (future consideration)

## Security Audit

### Current Issues

-  No CSP headers configured
-  Missing HSTS enforcement
-  API keys in some client-side code
-  No env variable validation with Zod
-  Authentication uses custom JWT (migrate to Supabase Auth?)

### Required Changes

1. Add security headers middleware
2. Move all secrets to server-side env
3. Implement Zod env validation schema
4. Rotate all API keys post-migration
5. Add rate limiting to public endpoints

## Database Integration

### Current State

- Custom Prisma schema in `/prisma/`
- No connection to Phase 9B tables
- Separate from Audio Intel Supabase project

### Required Changes

- Migrate to `@total-audio/core-db` package
- Connect to existing Supabase project
- Use Phase 9B tables:
  - `agent_events`
  - `feedback_events`
  - `conversion_events`
- Retire custom Prisma schema

## UI/UX Assessment

### Current Design System

- Using Tailwind CSS
- Custom components (not from `@total-audio/ui`)
- Inconsistent with Audio Intel design language
- Mobile responsiveness: partial

### Proposed Changes

- Import `@total-audio/ui` component library
- Adopt Audio Intel colour palette
- Add dark mode support
- Full mobile optimisation
- Consistent navigation structure

## Analytics & SEO

### Current State

-  No sitemap.xml
-  No robots.txt
-  Missing meta tags
-  No analytics integration
-  No Open Graph tags

### Required Implementation

- Generate dynamic sitemap.xml
- Add robots.txt with proper directives
- Implement Plausible analytics
- Add comprehensive meta tags
- Include Open Graph and Twitter Card tags

## Deployment Status

### Current Configuration

- Deployed at: command.totalaudiopromo.com
- Platform: Vercel
- Build command: `npm run build`
- Environment: Production + Preview

### Post-Migration Plan

- Keep existing domain
- Add new routes under `/ops-console/`
- Implement feature flags for gradual rollout
- Blue-green deployment strategy

## Phase 9D Integration Points

### Agent Layer Connection

- Display agent metrics from `agent_events` table
- Show agent success rates, latency, error counts
- Telegram notifications for agent failures
- Real-time dashboard updates

### Feedback System

- Display feedback from `feedback_events` table
- Sentiment analysis summary
- User feedback trends
- Weekly digest generation

### Growth Intelligence

- Show growth-reflex insights
- Conversion tracking from `conversion_events`
- Revenue impact visualisation
- Automated Telegram summaries

## Migration Risk Assessment

### High Risk

- OAuth token migration (X, LinkedIn)
- Database schema migration
- Existing user sessions

### Medium Risk

- UI component library switch
- API endpoint changes
- Analytics integration

### Low Risk

- Security headers addition
- SEO improvements
- Documentation updates

## Recommendations

### Phase 1: Foundation (Week 1)

1. Create audit summary document 
2. Set up `/ops-console/` route structure
3. Import `@total-audio/ui` components
4. Configure security headers
5. Implement env validation

### Phase 2: Integration (Week 2)

1. Connect to Phase 9B database tables
2. Migrate working social integrations
3. Complete BlueSky OAuth flow
4. Implement Threads connector stub
5. Wire Telegram notifications

### Phase 3: Features (Week 3)

1. Build ops-console dashboard pages
2. Implement agent monitoring UI
3. Create feedback sentiment views
4. Add growth intelligence displays
5. Generate SEO assets

### Phase 4: Polish (Week 4)

1. Add dark mode support
2. Optimise mobile experience
3. Complete documentation
4. Run security audit
5. Tag v2.4.0 release

## Success Criteria

- Clean build with zero TypeScript errors
- All Phase 9B tables connected
- Working social integrations (X + LinkedIn active)
- Agent monitoring dashboard operational
- Telegram notifications live
- Security headers implemented
- SEO assets generated
- Lighthouse score >90
- Documentation complete
- Release tagged: v2.4.0-phase9d-ops-console-revival

## Appendix: File Structure Mapping

### Old → New Route Structure

```
apps/command-centre/app/
 agents/                    → ops-console/agents/
 social-scheduler/          → ops-console/social/
 social-media-hub/          → ops-console/social/ (merged)
 newsjacking/               → ops-console/newsjacker/
 beta-management/           → ops-console/admin/beta/
 users/                     → ops-console/admin/users/
 revenue-intelligence/      → RETIRE (use Audio Intel)
 predictive-revenue/        → RETIRE (use cohorts)
 radio-promo/               → RETIRE (use Audio Intel)
```

### New Routes (Phase 9D)

```
apps/command-centre/app/(dashboard)/ops-console/
 overview/                  # System status + metrics
 agents/                    # Agent health dashboard
 social/                    # Social posting hub
 feedback/                  # Sentiment digest
 growth/                    # Growth reflex summaries
 admin/
    beta/                  # Beta management
    users/                 # User management
 settings/                  # Configuration
```

---

**Next Steps**: Begin Phase 1 implementation with repository scan and foundation setup.
