# Incident Response Guide - Total Audio Platform

**Last Updated**: 2025-11-02
**Owner**: Chris Schofield
**Status**: Active

---

## Table of Contents

1. [Incident Classification](#incident-classification)
2. [Response Procedures](#response-procedures)
3. [Communication Templates](#communication-templates)
4. [Post-Incident Review](#post-incident-review)
5. [Incident History](#incident-history)

---

## Incident Classification

### Severity Levels

#### P0 - Critical (Complete Outage)

**Impact**: All users unable to access the application
**Response Time**: Immediate (< 15 minutes)
**Examples**:

- All apps returning 5xx errors
- Database completely unavailable
- Supabase project paused/deleted
- Payment processing completely broken

**Response Team**: All available engineers + stakeholders notified

---

#### P1 - Major (Core Feature Down)

**Impact**: Core functionality broken for all users
**Response Time**: < 1 hour
**Examples**:

- Contact enrichment API failing (Audio Intel)
- User authentication broken
- Stripe payment flow failing
- Database queries timing out

**Response Team**: On-call engineer + backup

---

#### P2 - Minor (Degraded Performance)

**Impact**: Some users experiencing issues
**Response Time**: < 4 hours
**Examples**:

- Slow page load times (> 5 seconds)
- Email sending delays
- Intermittent API errors
- Mobile UI rendering issues

**Response Team**: On-call engineer

---

#### P3 - Low (Non-Critical Issue)

**Impact**: Minimal user impact
**Response Time**: Next business day
**Examples**:

- Cosmetic UI bugs
- Documentation errors
- Analytics not tracking
- Feature flag misconfiguration

**Response Team**: Assigned to backlog

---

## Response Procedures

### P0 - Critical Incident Response

**1. Detection & Acknowledgment (0-5 minutes)**

```bash
# Immediately acknowledge in incident channel
# Post template:
P0 INCIDENT DETECTED

App: [Audio Intel / Tracker / Pitch Generator / All]
Impact: [Description of user impact]
Detected: [Timestamp]
On-call: @chris
Status: INVESTIGATING

Incident ID: INC-YYYY-MM-DD-001
```

**2. Initial Assessment (5-15 minutes)**

- Check Vercel deployment status
- Verify Supabase database health
- Review recent deployments (last 24 hours)
- Check external service status (Stripe, Perplexity)

**Tools:**

```bash
# Quick health check commands
curl -I https://intel.totalaudiopromo.com/api/health
curl -I https://tracker.totalaudiopromo.com/api/health
curl -I https://pitch.totalaudiopromo.com/api/health

# Check Vercel deployment status
vercel ls

# Check Supabase project status
supabase projects list
```

**3. Mitigation (15-60 minutes)**

**Option A: Rollback to Last Known Good Deployment**

```bash
# Via Vercel Dashboard
# 1. Go to Deployments tab
# 2. Find last successful deployment
# 3. Click "Promote to Production"

# Or via CLI
cd apps/audio-intel
vercel rollback
```

**Option B: Emergency Hotfix**

```bash
# Create hotfix branch
git checkout -b hotfix/critical-issue-description

# Make minimal fix
# ... edit files ...

# Commit and push
git commit -m "hotfix: critical issue description"
git push origin hotfix/critical-issue-description

# Deploy immediately
cd apps/audio-intel
vercel --prod
```

**4. Verification (Post-Mitigation)**

- [ ] All apps return 200 status codes
- [ ] Core user flows work (login, enrichment, payment)
- [ ] No errors in Vercel logs
- [ ] Database queries executing normally
- [ ] External services responding

**5. Communication Update**

```bash
P0 INCIDENT RESOLVED

App: [Audio Intel / Tracker / Pitch Generator / All]
Root Cause: [Brief description]
Fix Applied: [What was done]
Resolved: [Timestamp]
Duration: [Total downtime]

Incident ID: INC-YYYY-MM-DD-001
Post-Mortem: To be published within 24 hours
```

---

### P1 - Major Incident Response

**Similar to P0 but with extended timelines:**

1. **Detection & Acknowledgment**(0-15 minutes)
2. **Initial Assessment**(15-30 minutes)
3. **Mitigation**(30-60 minutes)
4. **Verification**(Post-Mitigation)
5. **Communication Update**

**Additional Steps:**

- Contact affected users directly if identifiable
- Offer service credit/refund if payment-related
- Update status page (if implemented)

---

### P2 - Minor Incident Response

**Standard workflow:**

1. Create GitHub issue with `incident` label
2. Investigate within 4 hours
3. Deploy fix within normal release cycle
4. Update issue with resolution

**No immediate rollback required**- fix via normal deployment process

---

## Communication Templates

### Internal Incident Notification

**Slack/Discord Template:**

```markdown
[P0/P1/P2] INCIDENT DETECTED

**App**: [Audio Intel / Tracker / Pitch Generator]
**Impact**: [User-facing description]
**Severity**: [P0 / P1 / P2]
**Detected**: [Timestamp]
**On-call**: @chris

**Status**: INVESTIGATING

**Incident ID**: INC-YYYY-MM-DD-001

---

**Updates will be posted every 15 minutes during P0/P1 incidents**
```

### Customer Communication (If Required)

**Email Template - Service Disruption:**

```markdown
Subject: [Action Required] Service Issue - Audio Intel

Hi [Customer Name],

We're currently experiencing a service disruption affecting Audio Intel contact enrichment.

**What's Happening:**
[Brief, non-technical description]

**Impact:**
[What users cannot do right now]

**Status:**
We're actively working on a fix and expect resolution within [timeframe].

**What You Should Do:**
[Any actions users should take, or "No action required"]

We'll send an update within the next hour with more information.

Apologies for the inconvenience,
Chris Schofield
Total Audio Promo
```

**Email Template - Resolution:**

```markdown
Subject: [Resolved] Audio Intel Service Restored

Hi [Customer Name],

The service disruption affecting Audio Intel has been resolved.

**What Happened:**
[Brief explanation of root cause]

**Resolution:**
[What was done to fix it]

**Duration:**
[Total downtime: X hours Y minutes]

**Next Steps:**
[Any actions users should take, or "Everything is back to normal"]

We're conducting a full post-incident review to prevent this from happening again.

Thank you for your patience,
Chris Schofield
Total Audio Promo
```

---

## Post-Incident Review

### Post-Mortem Template

**Create within 24 hours of P0/P1 incidents:**

```markdown
# Post-Incident Review: INC-YYYY-MM-DD-001

**Date**: YYYY-MM-DD
**Incident ID**: INC-YYYY-MM-DD-001
**Severity**: P0 / P1 / P2
**Duration**: [Total time from detection to resolution]
**Impact**: [Number of users affected, revenue impact]

---

## Summary

[2-3 sentence overview of what happened]

---

## Timeline

| Time (GMT) | Event                 |
| ---------- | --------------------- |
| HH:MM      | Incident detected     |
| HH:MM      | Investigation started |
| HH:MM      | Root cause identified |
| HH:MM      | Mitigation applied    |
| HH:MM      | Incident resolved     |

---

## Root Cause Analysis

### What Happened?

[Detailed technical explanation]

### Why Did It Happen?

[Contributing factors, missing safeguards]

### Why Wasn't It Caught Earlier?

[Gaps in monitoring, testing, review process]

---

## Impact Assessment

### Users Affected

- Total users: [Number]
- Paying customers: [Number]
- Free tier users: [Number]

### Revenue Impact

- Lost transactions: [Number]
- Estimated revenue loss: £[Amount]
- Service credits issued: £[Amount]

### Business Impact

- Customer satisfaction impact: [Description]
- Churn risk: [High / Medium / Low]
- Reputation impact: [Description]

---

## What Went Well

1. [Thing that went well]
2. [Thing that went well]
3. [Thing that went well]

---

## What Went Poorly

1. [Thing that went poorly]
2. [Thing that went poorly]
3. [Thing that went poorly]

---

## Action Items

| Action                 | Owner  | Due Date   | Priority | Status  |
| ---------------------- | ------ | ---------- | -------- | ------- |
| [Specific action item] | @chris | YYYY-MM-DD | High     | Pending |
| [Specific action item] | @chris | YYYY-MM-DD | Medium   | Pending |
| [Specific action item] | @chris | YYYY-MM-DD | Low      | Pending |

---

## Prevention Measures

### Short-term (Next Sprint)

1. [Immediate fix or safeguard]
2. [Immediate fix or safeguard]

### Medium-term (Next Quarter)

1. [Process improvement]
2. [Infrastructure upgrade]

### Long-term (Next 6 Months)

1. [Architectural change]
2. [Team/org change]

---

**Review Attendees**:

- Chris Schofield (Developer)
- [Other stakeholders if applicable]

**Next Review Date**: [Follow-up date to check action items]
```

---

## Incident History

### 2025 Incidents

| ID                 | Date       | Severity | App | Duration | Root Cause             | Status    |
| ------------------ | ---------- | -------- | --- | -------- | ---------------------- | --------- |
| INC-2025-11-02-001 | 2025-11-02 | P3       | All | 0m       | N/A - Initial template | Reference |

---

## Monitoring & Alerting

### Key Metrics to Monitor

**Application Health:**

- API response time (p50, p95, p99)
- Error rate (% of 5xx responses)
- Request volume (requests per minute)

**Database Health:**

- Connection pool usage
- Query execution time
- Replication lag (if applicable)

**External Services:**

- Stripe API availability
- Perplexity API rate limits
- Gmail API quota

### Alert Thresholds

**Critical Alerts (Immediate notification):**

- Error rate > 5% for 2 minutes
- API response time p95 > 10 seconds for 5 minutes
- Database connection pool > 90% for 2 minutes
- Any 503 Service Unavailable responses

**Warning Alerts (Notification within 15 minutes):**

- Error rate > 1% for 5 minutes
- API response time p95 > 5 seconds for 10 minutes
- Database connection pool > 75% for 5 minutes

---

## Escalation Path

1. **On-call Engineer**(Chris Schofield) - First responder
2. **Backup Engineer**(TBD) - If on-call unavailable
3. **External Support**:
   - Vercel Support (hosting issues)
   - Supabase Support (database issues)
   - Stripe Support (payment issues)

**Contact Methods:**

- Slack/Discord: Fastest
- Email: chris@totalaudiopromo.com
- Phone: Emergency only

---

## Tools & Resources

**Monitoring:**

- Vercel Analytics Dashboard
- Supabase Database Logs
- Stripe Dashboard (webhook logs)

**Communication:**

- GitHub Issues (incident tracking)
- Slack/Discord (real-time updates)
- Email (customer communication)

**Documentation:**

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment procedures
- [SLO.md](./SLO.md) - Service level objectives
- Runbooks (to be created per-app)

---

**Last Reviewed**: 2025-11-02
**Next Review**: 2026-02-02 (Quarterly)
