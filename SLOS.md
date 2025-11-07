# Service Level Objectives (SLOs) - Total Audio Platform

**Last Updated**: 2025-11-02
**Review Cycle**: Quarterly
**Owner**: Chris Schofield

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Service Level Objectives](#service-level-objectives)
3. [Service Level Indicators (SLIs)](#service-level-indicators-slis)
4. [Error Budgets](#error-budgets)
5. [Measurement & Reporting](#measurement--reporting)

---

## Overview

Service Level Objectives (SLOs) define the target reliability and performance standards for the Total Audio Platform. These objectives guide operational decisions, deployment strategies, and incident response priorities.

### Why SLOs Matter

- **Customer Acquisition Focus**: Reliable service builds trust with first paying customers
- **Revenue Protection**: Downtime during payment processing = lost revenue
- **Reputation Management**: UK music industry word-of-mouth is critical
- **Development Velocity**: Clear targets prevent over-engineering during customer acquisition phase

### SLO Philosophy

**Current Phase (Customer Acquisition):**

- Prioritise availability over perfection
- Fast iteration with safe rollback capabilities
- Manual monitoring acceptable (automated monitoring future investment)
- Focus on core user journeys (enrichment, payment, authentication)

**Future Phase (Scale):**

- Automated monitoring and alerting
- Sub-second response time targets
- 99.9% availability commitments
- Multi-region redundancy

---

## Service Level Objectives

### Audio Intel (Primary Revenue Product)

#### Availability SLO

**Target**: 99.5% uptime per month
**Measurement Window**: Rolling 30 days
**Downtime Budget**: ~3.5 hours per month

**Rationale**: During customer acquisition phase, brief maintenance windows acceptable. Prioritise rapid feature deployment over absolute uptime.

#### Performance SLO

**Target**: 95% of requests complete within 3 seconds
**Measurement Window**: Rolling 7 days

**Critical Paths:**

- Homepage load: < 2 seconds (p95)
- Contact enrichment: < 5 seconds (p95)
- Database queries: < 500ms (p95)
- Authentication: < 1 second (p95)

#### Success Rate SLO

**Target**: 99% of API requests succeed (non-5xx)
**Measurement Window**: Rolling 7 days

**Exclusions:**

- 4xx client errors (user input errors)
- Rate limit errors (expected behaviour)
- Scheduled maintenance windows

---

### Campaign Tracker

#### Availability SLO

**Target**: 99.0% uptime per month
**Measurement Window**: Rolling 30 days
**Downtime Budget**: ~7 hours per month

**Rationale**: Supporting app for Audio Intel users. Lower priority during customer acquisition phase.

#### Performance SLO

**Target**: 95% of requests complete within 4 seconds
**Measurement Window**: Rolling 7 days

---

### Pitch Generator

#### Availability SLO

**Target**: 99.0% uptime per month
**Measurement Window**: Rolling 30 days
**Downtime Budget**: ~7 hours per month

**Rationale**: Supporting app for Audio Intel users. Lower priority during customer acquisition phase.

#### Performance SLO

**Target**: 95% of requests complete within 5 seconds
**Measurement Window**: Rolling 7 days

---

## Service Level Indicators (SLIs)

### Primary SLIs (Measured)

#### Availability SLI

**Definition**: Percentage of successful HTTP responses (non-5xx)

**Calculation**:

```
Availability = (Total Requests - 5xx Errors) / Total Requests × 100
```

**Data Source**: Vercel Analytics

**Measurement**:

- Collected automatically by Vercel edge network
- Aggregated per minute
- Excludes scheduled maintenance windows

---

#### Latency SLI

**Definition**: Time from request received to response sent

**Calculation**:

```
Latency p95 = 95th percentile of request duration
```

**Data Source**: Vercel Analytics

**Measurement**:

- Measured at edge network (includes CDN)
- Excludes client-side rendering time
- Per-route granularity available

---

#### Success Rate SLI

**Definition**: Percentage of API requests that succeed

**Calculation**:

```
Success Rate = (2xx + 3xx Responses) / (Total Requests - 4xx) × 100
```

**Data Source**: Application logs + Vercel Analytics

**Measurement**:

- Excludes 4xx errors (client-side issues)
- Includes redirects (3xx) as successful
- Measured per API endpoint

---

### Secondary SLIs (Manual Monitoring)

#### Contact Enrichment Success Rate (Audio Intel)

**Definition**: Percentage of enrichment requests that return valid contact data

**Target**: 95% success rate
**Measurement**: Manual review of enrichment logs
**Frequency**: Weekly during customer acquisition phase

---

#### Payment Processing Success Rate

**Definition**: Percentage of Stripe payment intents that succeed

**Target**: 98% success rate (excluding declined cards)
**Measurement**: Stripe Dashboard analytics
**Frequency**: Daily during active customer acquisition

**Exclusions**:

- Customer-declined cards
- Insufficient funds
- Fraud prevention blocks

---

#### Database Query Performance

**Definition**: Average query execution time

**Target**: p95 < 500ms
**Measurement**: Supabase dashboard
**Frequency**: Weekly

---

## Error Budgets

### What is an Error Budget?

**Error Budget** = Allowed downtime/errors within SLO target

**Example:**

- SLO: 99.5% availability
- Error Budget: 0.5% downtime = ~3.5 hours per month

### Error Budget Policy

#### When Error Budget is Healthy (> 50% remaining)

**Development Mode:**

- Deploy new features aggressively
- 2-3 deployments per week
- Prioritise velocity over caution
- Test in production with feature flags

**Risk Tolerance:** High

---

#### When Error Budget is Depleting (25-50% remaining)

**Caution Mode:**

- Increase deployment testing
- Deploy during low-traffic hours
- Require manual verification before deployment
- Monitor post-deployment closely

**Risk Tolerance:** Medium

---

#### When Error Budget is Exhausted (< 25% remaining)

**Freeze Mode:**

- **STOP all feature development**
- Focus 100% on reliability improvements
- Only critical bug fixes and security patches
- Extended testing for all changes
- Post-mortem required for all incidents

**Risk Tolerance:** Low

**Restoration:**

- Error budget resets monthly (rolling 30 days)
- Can exit freeze mode once budget > 50%

---

### Error Budget Tracking

**Manual Tracking (Current Phase):**

| Month    | App         | SLO Target | Actual | Error Budget Used | Status     |
| -------- | ----------- | ---------- | ------ | ----------------- | ---------- |
| Nov 2025 | Audio Intel | 99.5%      | TBD    | TBD%              | 🟢 Healthy |
| Nov 2025 | Tracker     | 99.0%      | TBD    | TBD%              | 🟢 Healthy |
| Nov 2025 | Pitch Gen   | 99.0%      | TBD    | TBD%              | 🟢 Healthy |

**Update Frequency:** Weekly during customer acquisition phase

---

## Measurement & Reporting

### Data Sources

#### Automated Collection

1. **Vercel Analytics**

   - Request volume
   - Response times (p50, p95, p99)
   - Status code distribution
   - Geographic distribution

2. **Supabase Dashboard**

   - Database connection pool usage
   - Query execution times
   - Replication lag
   - Storage usage

3. **Stripe Dashboard**
   - Payment success rate
   - Webhook delivery status
   - API error rate

#### Manual Collection

1. **Contact Enrichment Logs**

   - Review enrichment success/failure rates
   - Analyse Perplexity API performance
   - Track data quality metrics

2. **User Feedback**
   - Customer support tickets
   - Demo call feedback
   - User satisfaction scores

---

### Weekly SLO Review (During Customer Acquisition Phase)

**Every Monday Morning:**

1. **Calculate SLIs** (from Vercel + Supabase dashboards)
2. **Check Error Budget** (update tracking table)
3. **Review Incidents** (count P0/P1/P2 incidents from previous week)
4. **Assess Deployment Velocity** (number of deployments vs. error budget health)
5. **Update Status** (🟢 Healthy / 🟡 Caution / 🔴 Freeze)

**Report Format:**

```markdown
## Weekly SLO Report - Week of [Date]

### Audio Intel

- Availability: [X.X%] (Target: 99.5%) [✅ / ⚠️ / ❌]
- Latency p95: [X.Xs] (Target: < 3s) [✅ / ⚠️ / ❌]
- Success Rate: [X.X%] (Target: 99%) [✅ / ⚠️ / ❌]
- Error Budget: [X%] remaining [🟢 / 🟡 / 🔴]

### Incidents

- P0: [Count]
- P1: [Count]
- P2: [Count]

### Deployment Velocity

- Deployments this week: [Count]
- Recommended mode: [Development / Caution / Freeze]

### Action Items

1. [Action if SLO missed]
2. [Action if error budget low]
```

---

### Monthly SLO Review (After Sustainable Revenue)

**First Monday of Each Month:**

1. **Comprehensive SLI analysis** (all apps, all metrics)
2. **Error budget reset** (new month, fresh budget)
3. **SLO target review** (adjust based on business priorities)
4. **Incident retrospective** (review all P0/P1 incidents)
5. **Customer impact assessment** (churn analysis, satisfaction scores)

---

## SLO Evolution

### Current Phase (Customer Acquisition - Q4 2025)

**Focus**: Availability > Performance > Features
**Targets**: Moderate (99.0-99.5%)
**Monitoring**: Manual weekly reviews
**Risk Tolerance**: Medium-High (prioritise velocity)

---

### Next Phase (Sustainable Revenue - Q1 2026)

**Focus**: Performance > Availability > Features
**Targets**: Increased (99.5-99.9%)
**Monitoring**: Automated alerting
**Risk Tolerance**: Medium (balanced velocity + stability)

**Planned Improvements:**

- Automated SLO dashboards
- Real-time error budget tracking
- Alerting on SLO violations
- Per-customer SLA commitments

---

### Future Phase (Scale - Q2 2026+)

**Focus**: Reliability > Performance > Features
**Targets**: Premium (99.9%+)
**Monitoring**: Full observability stack
**Risk Tolerance**: Low (prioritise stability)

**Planned Investments:**

- Multi-region redundancy
- Automated incident response
- Chaos engineering
- SLA-backed customer commitments

---

## Customer Commitments

### Current (No Formal SLAs)

During customer acquisition phase:

- **No contractual SLA commitments**
- **Best effort** reliability based on SLOs above
- **Transparent communication** during incidents
- **Service credits** offered at discretion for major outages

---

### Future (SLA-Backed Plans)

After sustainable revenue established:

#### Pro Tier (£19/month)

- **99.5% monthly uptime guarantee**
- **< 3 second response time** (p95)
- **Email support** (24-hour response)
- **Service credit**: 5% per 0.5% below SLA

#### Agency Tier (£79/month)

- **99.9% monthly uptime guarantee**
- **< 2 second response time** (p95)
- **Priority email support** (12-hour response)
- **Service credit**: 10% per 0.1% below SLA

---

## Appendix

### SLO Definitions

**SLO (Service Level Objective)**: Internal target for service reliability
**SLA (Service Level Agreement)**: Contractual commitment to customers
**SLI (Service Level Indicator)**: Measured metric used to track SLO

**Relationship**: `SLI` measures → `SLO` targets → `SLA` commitments

---

### Calculation Examples

**Availability Calculation (Monthly):**

```
Total minutes in month: 30 days × 24 hours × 60 minutes = 43,200 minutes
99.5% SLO = 43,200 × 0.995 = 42,984 minutes uptime required
Error budget = 43,200 - 42,984 = 216 minutes (~3.6 hours)
```

**Success Rate Calculation (Weekly):**

```
Total requests: 100,000
5xx errors: 500
4xx errors: 2,000 (excluded)

Success rate = (100,000 - 500) / 100,000 × 100 = 99.5% ✅
```

---

**Last Reviewed**: 2025-11-02
**Next Review**: 2026-02-02 (Quarterly during customer acquisition)
**Next Major Revision**: After £500/month revenue achieved
