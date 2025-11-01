# Threads Agent Deployment Checklist

Complete checklist for deploying the Threads autonomous posting agent to production.

## Pre-Deployment Setup

### 1. Meta Developer App Configuration

- [ ] Create Meta Developer account at https://developers.facebook.com/
- [ ] Create new app (Business type)
- [ ] Add Threads API product to app
- [ ] Note App ID and App Secret

**Estimated Time**: 10 minutes

### 2. Instagram Account Setup

- [ ] Convert Instagram account to Professional (Creator or Business)
  - Settings → Account → Switch to Professional Account
- [ ] Create or link Facebook Page
  - Required for Threads API access
- [ ] Link Facebook Page to Instagram
  - Instagram Settings → Account → Linked Accounts → Facebook

**Estimated Time**: 5 minutes

### 3. OAuth Configuration

- [ ] Add app domains in Meta app settings
  - `totalaudiopromo.com`
  - `intel.totalaudiopromo.com`
- [ ] Add OAuth redirect URIs
  - Production: `https://intel.totalaudiopromo.com/api/auth/threads/callback`
  - Development: `http://localhost:3000/api/auth/threads/callback`
- [ ] Enable permissions
  - `threads_basic`
  - `threads_content_publish`

**Estimated Time**: 5 minutes

### 4. Access Token Generation

- [ ] Generate short-lived token via Graph API Explorer
  - Visit: https://developers.facebook.com/tools/explorer/
  - Select your app
  - Add permissions: threads_basic, threads_content_publish
  - Generate Access Token
  - Copy token (valid 1 hour)

**Estimated Time**: 3 minutes

### 5. Convert to Long-Lived Token

```bash
curl -X GET "https://graph.threads.net/access_token" \
  -d "grant_type=th_exchange_token" \
  -d "client_secret={FACEBOOK_APP_SECRET}" \
  -d "access_token={SHORT_LIVED_TOKEN}"
```

- [ ] Execute curl command
- [ ] Save long-lived token (valid 60 days)
- [ ] Store securely (1Password, Bitwarden, etc.)

**Estimated Time**: 2 minutes

### 6. Get Instagram User ID

```bash
curl -X GET "https://graph.threads.net/v1.0/me" \
  -d "fields=id,username" \
  -d "access_token={LONG_LIVED_TOKEN}"
```

- [ ] Execute curl command
- [ ] Note Instagram User ID (numeric)
- [ ] Verify username matches your account

**Estimated Time**: 1 minute

**Total Setup Time**: ~25 minutes

---

## Local Testing

### 1. Environment Configuration

- [ ] Copy environment template

  ```bash
  cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel
  cp .env.threads.example .env.local
  ```

- [ ] Add credentials to .env.local

  ```bash
  THREADS_USER_ID=123456789
  THREADS_ACCESS_TOKEN=IGQ...
  FACEBOOK_APP_ID=987654321
  FACEBOOK_APP_SECRET=abc123xyz
  ```

- [ ] Verify .env.local is in .gitignore
  ```bash
  grep ".env.local" .gitignore
  ```

**Estimated Time**: 3 minutes

### 2. Run Test Suite

- [ ] Execute test script

  ```bash
  npx tsx scripts/test-threads-agent.ts
  ```

- [ ] Verify all checks pass:
  - [x] Environment variables loaded
  - [x] Agent created successfully
  - [x] Health check passed
  - [x] Account insights retrieved
  - [x] Content retrieval working

- [ ] Review test output for errors

**Estimated Time**: 2 minutes

### 3. Test Posting (Optional)

- [ ] Uncomment posting section in test script
- [ ] Review test post content
- [ ] Execute posting test
- [ ] Verify post appears on Threads
- [ ] Delete test post from Threads
- [ ] Re-comment posting section

**Estimated Time**: 5 minutes (optional)

**Total Testing Time**: 5-10 minutes

---

## Production Deployment

### 1. Vercel Environment Variables

- [ ] Log in to Vercel dashboard
- [ ] Navigate to Audio Intel project
- [ ] Go to Settings → Environment Variables
- [ ] Add production variables:
  ```
  THREADS_USER_ID=123456789
  THREADS_ACCESS_TOKEN=IGQ...
  FACEBOOK_APP_ID=987654321
  FACEBOOK_APP_SECRET=abc123xyz
  CRON_SECRET=generate_secure_random_string
  ```
- [ ] Set scope: Production
- [ ] Save changes

**Estimated Time**: 5 minutes

### 2. Generate Cron Secret

```bash
# Generate secure random string
openssl rand -base64 32
```

- [ ] Generate secret
- [ ] Add to Vercel environment variables
- [ ] Store in secure location

**Estimated Time**: 2 minutes

### 3. Create Cron Endpoint

- [ ] Create file: `app/api/cron/threads-posting/route.ts`
- [ ] Add cron handler code (see THREADS_AGENT_SUMMARY.md)
- [ ] Verify authentication check implemented
- [ ] Commit changes

**Estimated Time**: 5 minutes

### 4. Configure Vercel Cron

- [ ] Update `vercel.json` with cron configuration:
  ```json
  {
    "crons": [
      {
        "path": "/api/cron/threads-posting",
        "schedule": "0 * * * *"
      }
    ]
  }
  ```
- [ ] Commit changes
- [ ] Deploy to production

**Estimated Time**: 3 minutes

### 5. Verify Deployment

- [ ] Check Vercel deployment logs
  - Deployment succeeded
  - No build errors
  - Environment variables loaded

- [ ] Verify cron job scheduled
  - Vercel dashboard → Project → Cron Jobs
  - Confirm schedule: "0 \* \* \* \*" (hourly)

- [ ] Monitor first cron execution
  - Wait for next hour
  - Check execution logs
  - Verify API calls successful

**Estimated Time**: 15 minutes (includes waiting)

**Total Deployment Time**: 30 minutes

---

## Post-Deployment Monitoring

### Week 1: Daily Checks

- [ ] **Day 1**: Monitor first 24 hours of posting
  - Check Vercel cron logs
  - Verify posts appearing on Threads
  - Review error rates

- [ ] **Day 2**: Validate scheduling accuracy
  - Compare posted times vs calendar
  - Check skipped posts (not in window)
  - Review content accuracy

- [ ] **Day 3**: Review engagement metrics
  - Check account insights
  - Views, likes, replies
  - Identify top-performing posts

- [ ] **Days 4-7**: Stability monitoring
  - Daily log review
  - API rate limit check
  - Token expiration tracking

### Week 2: Optimisation

- [ ] Analyse posting patterns
  - Best performing times
  - Content engagement rates
  - Response rate tracking

- [ ] Adjust schedule if needed
  - Update CONTENT_CALENDAR.json
  - Test new posting times
  - Monitor impact

- [ ] Review API usage
  - Stay under rate limits
  - Optimise call frequency
  - Reduce unnecessary requests

### Month 1: Long-term Health

- [ ] Token refresh planning
  - Track token expiration (60 days)
  - Set calendar reminder (55 days)
  - Test refresh process

- [ ] Performance review
  - Total posts published
  - Success rate %
  - Engagement trends

- [ ] Content optimisation
  - Identify best performers
  - Update underperforming content
  - A/B test variations

---

## Troubleshooting Guide

### Issue: Health Check Fails

**Symptoms**: Test script reports "Health check failed"

**Possible Causes**:

- Access token expired or invalid
- Instagram account not Professional
- Missing Threads API permissions
- User ID doesn't match token

**Resolution**:

1. Verify token with Graph API Explorer
2. Check Instagram account type
3. Review Meta app permissions
4. Regenerate access token if needed

### Issue: Posts Not Publishing

**Symptoms**: Cron runs but no posts appear

**Possible Causes**:

- Posts outside 1-hour scheduling window
- Content not found for title
- API rate limit exceeded
- Network timeout

**Resolution**:

1. Check Vercel cron logs for errors
2. Verify content mapping in agent
3. Review scheduling in CONTENT_CALENDAR.json
4. Check Meta Developer dashboard for API issues

### Issue: Rate Limit Errors

**Symptoms**: "Rate limit exceeded" errors

**Possible Causes**:

- Too many API calls (>1,000/hour)
- Multiple agents running simultaneously
- Insufficient delays between posts

**Resolution**:

1. Check API usage in Meta dashboard
2. Increase delay between posts
3. Reduce cron frequency
4. Implement exponential backoff

### Issue: Token Expired

**Symptoms**: "Invalid OAuth access token" error

**Possible Causes**:

- Long-lived token expired (60 days)
- Token revoked in Meta settings
- App permissions changed

**Resolution**:

1. Generate new short-lived token
2. Convert to long-lived token
3. Update Vercel environment variables
4. Redeploy application

---

## Maintenance Schedule

### Daily

- [x] Monitor cron execution logs
- [x] Check posting success rate
- [x] Review any error messages

### Weekly

- [x] Review engagement metrics
- [x] Check API rate limit usage
- [x] Verify content calendar accuracy

### Monthly

- [x] Analyse posting performance
- [x] Optimise content and schedule
- [x] Review API quotas and costs

### Every 55 Days

- [x] Refresh long-lived access token
- [x] Update Vercel environment variables
- [x] Test token validity
- [x] Schedule next refresh

---

## Success Metrics

### Technical KPIs

- **Uptime**: >99% cron execution success
- **Posting Rate**: >95% scheduled posts published
- **API Errors**: <5% failure rate
- **Response Time**: <5s per post

### Engagement KPIs

- **Views**: Track weekly trends
- **Likes**: Measure content resonance
- **Replies**: Monitor community engagement
- **Followers**: Growth rate tracking

### Business KPIs

- **Click-through Rate**: UTM tracking to intel.totalaudiopromo.com
- **Beta Signups**: "Comment BETA" conversions
- **Demo Bookings**: Attributed to Threads traffic
- **Brand Awareness**: Reach and impressions

---

## Rollback Plan

If critical issues occur:

### 1. Immediate Actions

- [ ] Disable Vercel cron job
- [ ] Pause scheduled posts
- [ ] Investigate error logs

### 2. Temporary Measures

- [ ] Switch to manual posting
- [ ] Reduce posting frequency
- [ ] Test with single post

### 3. Resolution Steps

- [ ] Identify root cause
- [ ] Implement fix
- [ ] Test in development
- [ ] Gradual re-enable

### 4. Prevention

- [ ] Document issue
- [ ] Update troubleshooting guide
- [ ] Implement monitoring alerts
- [ ] Review deployment process

---

## Documentation Reference

- **Setup Guide**: `lib/THREADS_API_SETUP.md`
- **Implementation**: `THREADS_AGENT_SUMMARY.md`
- **Comparison**: `AGENT_COMPARISON.md`
- **Test Script**: `scripts/test-threads-agent.ts`
- **Content Source**: `social-content/BLUESKY_THREADS_CONTENT.md`
- **Calendar**: `social-content/CONTENT_CALENDAR.json`

---

## Completion Sign-Off

### Pre-Deployment

- [ ] All setup steps completed
- [ ] Local testing passed
- [ ] Documentation reviewed

**Signed**: **\*\*\*\***\_**\*\*\*\*** Date: \***\*\_\*\***

### Production Deployment

- [ ] Vercel configured
- [ ] Cron job active
- [ ] First posts verified

**Signed**: **\*\*\*\***\_**\*\*\*\*** Date: \***\*\_\*\***

### Post-Deployment

- [ ] Week 1 monitoring complete
- [ ] Performance acceptable
- [ ] No critical issues

**Signed**: **\*\*\*\***\_**\*\*\*\*** Date: \***\*\_\*\***

---

**Status**: Ready for Deployment
**Maintainer**: Chris Schofield / Total Audio
**Last Updated**: October 2025
