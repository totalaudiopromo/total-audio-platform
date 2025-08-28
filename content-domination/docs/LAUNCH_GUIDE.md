# 🚀 Content Domination System - Launch Guide

**The Complete Newsjacker 3000 Setup & Launch Process**

## Overview

This guide will take you from zero to having a fully operational Content Domination System with real-time newsjacking capabilities running in production.

---

## 📋 Pre-Launch Checklist

### 1. Environment Setup
- [ ] `.env` file created from `.env.example`
- [ ] All API credentials configured
- [ ] Database connections tested
- [ ] Security secrets generated

### 2. API Integrations  
- [ ] Twitter API v2 with Elevated access
- [ ] LinkedIn OAuth completed
- [ ] Notion databases created and shared
- [ ] Claude API with sufficient credits
- [ ] Kit.com forms and sequences configured

### 3. System Validation
- [ ] All setup verification tests passed
- [ ] RSS feeds accessible
- [ ] Alert systems configured
- [ ] Content quality thresholds set

---

## 🛠️ Step-by-Step Launch Process

### Step 1: Initial Setup

```bash
# 1. Clone and navigate to content-domination directory
cd /Users/chrisschofield/total-audio-promo/content-domination

# 2. Install all dependencies
npm run install:all

# 3. Copy environment template
cp .env.example .env

# 4. Edit .env with your actual credentials
nano .env  # or use your preferred editor
```

### Step 2: API Configuration

Follow the complete [API Setup Guide](./API_SETUP_GUIDE.md) to configure:

1. **Twitter API** - Get elevated access and generate all tokens
2. **LinkedIn API** - Run OAuth flow: `npm run auth:linkedin`
3. **Notion API** - Create integration and databases
4. **Claude API** - Set up Anthropic account and API key
5. **Kit.com API** - Configure newsletter automation
6. **News Sources** - Verify RSS feed access

### Step 3: Verification

```bash
# Run complete system verification
npm run verify-setup
```

This will check:
- All environment variables
- API connectivity  
- Database access
- Security configuration
- RSS feed availability

**🚨 Do not proceed until all checks pass!**

### Step 4: Test Run

```bash
# Test newsjacking with sample data
npm run test:newsjacking
```

This performs a dry run to verify:
- News detection works
- Content generation functions
- Notion integration saves data
- Alert systems trigger correctly

### Step 5: Production Launch

```bash
# Start live monitoring
npm run start
```

Or for background process:
```bash
# Start in background with logging
nohup npm run start > monitoring.log 2>&1 &
```

---

## 📊 Monitoring & Dashboard

### Live Dashboard

When you run `npm run start`, you'll see a live dashboard showing:

```
╔══════════════════════════════════════════════════════════════════════╗
║                    🔥 NEWSJACKER 3000 - LIVE DASHBOARD 🔥            ║
╚══════════════════════════════════════════════════════════════════════╝

📊 CURRENT STATUS: 🟢 ACTIVE
⏰ Started: 18/08/2025, 15:30:00
🕐 Last Scan: 18/08/2025, 15:35:00

📈 PERFORMANCE METRICS:
   Total Scans: 24
   Opportunities Found: 3
   High-Value Alerts: 1
   Alerts Sent: 1

🎯 MONITORING:
   RSS Sources: 7 active
   Twitter Keywords: 12
   Alert Channels: 2

⚡ NEXT ACTIONS:
   → RSS Scan: Every 5 minutes
   → Twitter Scan: Every 10 minutes  
   → Performance Report: Every hour
   → Daily Summary: 9 AM UK
```

### Monitoring Schedule

- **RSS Feeds**: Scanned every 5 minutes
- **Twitter Trends**: Analyzed every 10 minutes
- **Performance Reports**: Generated hourly
- **Daily Summaries**: 9 AM UK time
- **Critical Alerts**: Immediate (within 30 seconds)

---

## 🚨 Alert Configuration

### Alert Channels

Configure these in your `.env`:

**Email Alerts** (via SMTP):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ALERT_EMAIL=chris@totalaudiopromo.com
```

**Slack Alerts**:
```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

**Custom Webhooks**:
```env
WEBHOOK_ALERT_URL=https://your-webhook-endpoint.com/alerts
WEBHOOK_SECRET=your_secure_webhook_secret
```

### Alert Triggers

- **Critical Opportunities**: Relevance score > 0.8
- **First-Mover Advantages**: News < 15 minutes old + high relevance
- **System Errors**: API failures, connection issues
- **Performance Issues**: Response time > 60 seconds

---

## 🎯 Content Quality Controls

### Automatic Approval Settings

```env
# Quality thresholds
MIN_VOICE_CONSISTENCY_SCORE=8.0
MIN_RELEVANCE_SCORE=0.6
AUTO_APPROVAL_THRESHOLD=0.8
VIRAL_THRESHOLD=0.85

# Content limits
MAX_DAILY_POSTS=25
MIN_CONTENT_SPACING_MINUTES=30

# Feature flags
ENABLE_AUTO_PUBLISH=false  # Start with manual approval
REQUIRE_APPROVAL_FOR_AUDIO_INTEL=true
```

### Manual Review Process

1. **High-value opportunities** (score > 0.8) generate content automatically
2. **Generated content** is saved to Notion for review
3. **Critical alerts** notify you of time-sensitive opportunities  
4. **Manual approval** required before publishing (initially)
5. **Auto-publishing** can be enabled once you trust the system

---

## 📈 Performance Optimization

### Timing Configuration

```env
# UK business hours optimization
TIMEZONE=Europe/London
BUSINESS_HOURS_START=9
BUSINESS_HOURS_END=18
PEAK_POSTING_TIMES=9,13,17

# Content velocity
CONTENT_VELOCITY_TARGET=25  # per week
NEWSJACKING_RESPONSE_TARGET=30  # minutes
```

### Resource Management

**CPU & Memory**:
- RSS scanning: ~50MB RAM
- Content generation: ~200MB RAM (peak)
- Background monitoring: ~30MB RAM

**API Rate Limits**:
- Twitter: 300 tweets/3 hours
- LinkedIn: 100 requests/hour
- Claude: Based on your plan
- Notion: 3 requests/second

**Storage**:
- Notion databases handle all content storage
- Local logs: ~10MB/day (rotated weekly)

---

## 🔧 Troubleshooting

### Common Issues

**"RSS feeds not accessible"**
```bash
# Check internet connection and DNS
ping musicbusinessworldwide.com

# Test RSS parsing manually
node -e "
const Parser = require('rss-parser');
const parser = new Parser();
parser.parseURL('https://www.musicbusinessworldwide.com/feed/')
  .then(feed => console.log(feed.title))
  .catch(err => console.error(err));
"
```

**"Claude API rate limited"**
- Check usage in Anthropic console
- Increase billing limits
- Switch to Claude-3-Sonnet for lower costs
- Implement content batching

**"LinkedIn access token expired"**
```bash
# Re-run OAuth flow
npm run auth:linkedin
```

**"Notion database not accessible"**
- Verify integration permissions
- Check database IDs in .env
- Ensure integration is shared with databases

### Health Checks

Monitor these endpoints/logs for system health:

```bash
# View recent logs
tail -f monitoring.log

# Check process status  
ps aux | grep node

# Monitor resource usage
top -p $(pgrep -f "start-monitoring")

# Test API connections
npm run verify-setup
```

---

## 🎯 Success Metrics

### Week 1 Targets

- [ ] 5+ newsjacking opportunities detected daily
- [ ] 2+ high-value opportunities (score > 0.8) weekly
- [ ] 30-minute average response time
- [ ] 95%+ system uptime
- [ ] Zero false-positive critical alerts

### Month 1 Targets  

- [ ] 50+ content pieces generated
- [ ] 10+ viral opportunities identified (score > 0.85)
- [ ] 500+ total reach from newsjacking content
- [ ] Auto-publishing enabled for trusted content
- [ ] ROI tracking and optimization

### Ongoing Optimization

- Monitor voice consistency scores
- Track audience engagement patterns
- Optimize posting times based on performance
- Expand to additional news sources
- Enhance automation angle detection

---

## 🚀 Going Live - Final Steps

### 1. Final Pre-Flight Check

```bash
# Run one final verification
npm run verify-setup

# Test with sample data
npm run test:newsjacking

# Check all alert channels
# Send test alerts to verify delivery
```

### 2. Launch Monitoring

```bash
# Start in production mode
npm run start
```

### 3. Monitor First Hour

- Watch for RSS feed scanning
- Verify opportunities are detected
- Check Notion database updates
- Confirm alerts are working
- Monitor system performance

### 4. Enable Auto-Features (After 24 Hours)

Once confident in system performance:

```env
# Gradually enable automation
ENABLE_AUTO_PUBLISH=true  # Start with low scores
AUTO_APPROVAL_THRESHOLD=0.9  # Conservative initially
```

---

## 📞 Support & Maintenance

### Daily Tasks

- [ ] Check dashboard for opportunities
- [ ] Review generated content in Notion
- [ ] Monitor system health logs
- [ ] Respond to critical alerts

### Weekly Tasks

- [ ] Review performance metrics
- [ ] Optimize content quality thresholds
- [ ] Update news source priorities
- [ ] Analyze ROI and engagement

### Monthly Tasks

- [ ] Review and refresh API credentials
- [ ] Update voice consistency examples
- [ ] Expand monitoring sources
- [ ] Performance optimization review

---

## 🎉 You're Ready to Launch!

Your Content Domination System with Newsjacker 3000 is now configured and ready for production use.

**Next Commands:**
```bash
# Final verification
npm run verify-setup

# Start live monitoring  
npm run start
```

**Watch for**: 
- Real-time opportunity detection
- Automated content generation
- Instant critical alerts
- Performance tracking

**Remember**: Start with manual approval enabled and gradually increase automation as you build confidence in the system's performance.

---

**🔥 Welcome to the age of Total Content Domination! 🔥**