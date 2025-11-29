# Total Audio - FREE Automation Quick Start

**Monthly Cost**: £0
**Time Saved**: 15-23 hours/week
**Setup Time**: 10 minutes

---

## Quick Install (One Command)

```bash
cd ~/workspace/active/total-audio-platform/tools/agents
./setup-free-automation.sh
```

This sets up 5 automation agents that run automatically with **zero monthly costs**.

---

## What Gets Automated (All Free)

| Agent                 | Schedule        | Time Saved         | Cost   |
| --------------------- | --------------- | ------------------ | ------ |
| **Gmail Autopilot**  | Hourly          | 2-3 hrs/week       | £0     |
| **Social Calendar**  | Weekly Sun 8pm  | 5-8 hrs/week       | £0     |
| **Newsletter Gen**   | Weekly Mon 9am  | 3-4 hrs/week       | £0     |
| **Data Cleanup**     | Weekly Sun 11pm | 1-2 hrs/week       | £0     |
| **Station Discovery**| Weekly Tue 9am  | 4-6 hrs/week       | £0     |
| **TOTAL**            | -               | **15-23 hrs/week**| **£0**|

---

## What Each Agent Does

### 1. Gmail Autopilot (Hourly)

**Automatically organizes your Gmail:**

- Otter AI emails → Personal Tools folder
- Gemini emails → Personal Tools folder
- WARM marketing → Marketing Junk (archived + mark read)
- Machina marketing → Marketing Junk (archived + mark read)
- Auto-creates Liberty campaign sub-labels

**No more**: Manual email sorting
**You get**: Clean inbox every hour

---

### 2. Social Media Calendar (Weekly Sunday 8pm)

**Generates 4-week content calendar:**

- LinkedIn posts
- Twitter threads
- Bluesky posts
- Threads posts

**Outputs**:

- `CONTENT_CALENDAR.csv` → Import to Buffer/Hootsuite
- `CONTENT_CALENDAR.md` → Human readable schedule
- `CONTENT_CALENDAR.json` → API integration ready

**No more**: Hours planning social posts
**You get**: Weekly calendar → bulk upload to Buffer

---

### 3. Newsletter Generator (Weekly Monday 9am)

**Auto-generates "The Unsigned Advantage" newsletter:**

- Fetches music industry news
- AI-powered content generation
- Template-based formatting
- Saves as draft for your review

**No more**: 3-4 hours writing newsletter
**You get**: Draft ready Monday mornings → review + send

---

### 4. Data Cleanup (Weekly Sunday 11pm)

**Cleans up Airtable contacts:**

- Removes duplicate contacts
- Flags invalid emails
- Archives low-quality entries

**No more**: Manual spreadsheet cleanup
**You get**: Clean database every week

---

### 5. Station Discovery (Weekly Tuesday 9am)

**Discovers new radio stations:**

- Queries WARM API for new stations
- Extracts contact information
- Identifies station format/genres

**No more**: Manual station research
**You get**: Weekly report of new stations

---

## What's NOT Automated (Costs Money)

### Contact Enrichment - MANUAL TRIGGER ONLY

**Cost**: £3 per run (~1000 contacts)
**Why manual**: You control when to spend money

**When to run**:

- Before big Audio Intel campaigns
- When you have budget for enrichment
- Weekly for high-value contacts

**How to run**:

```bash
cd ~/workspace/active/total-audio-platform/tools/agents/radio-promo
node enrich-all-contacts.js
```

---

## Your New Weekly Schedule

**Monday 9am**:

- Check email: Newsletter draft ready
- Review draft → Send via ConvertKit
- Time: 15 minutes (vs 3-4 hours writing)

**Tuesday 9am**:

- Check email: Station discovery report
- Review findings → Import to Airtable
- Time: 10 minutes (vs 2-3 hours research)

**Sunday 8pm**:

- Check email: Social calendar ready
- Download CSV → Upload to Buffer
- Time: 5 minutes (vs 5-8 hours planning)

**Every Hour**:

- Gmail automatically organized
- Zero manual work required

**Total Weekly Time**: ~30 minutes (vs 15-23 hours)

---

## Monitoring Your Automation

### Check Cron Jobs

```bash
crontab -l | grep "Total Audio"
```

### View Logs

```bash
# All logs
ls -la ~/.total-audio-logs/

# Watch Gmail autopilot live
tail -f ~/.total-audio-logs/gmail-autopilot.log

# Check social calendar output
tail -f ~/.total-audio-logs/social-calendar.log

# Review newsletter generation
tail -f ~/.total-audio-logs/newsletter.log
```

### Check Agent Status

```bash
# View all status files
ls -la ~/.total-audio-status/

# Read specific status
cat ~/.total-audio-status/contact-enrichment-status.json | jq
```

---

## Test Before Automating

Want to test agents before setting up cron?

### Test Gmail Autopilot

```bash
cd ~/workspace/active/total-audio-platform/tools/agents/gmail-setup
node liberty-autopilot.js run
```

### Test Social Calendar

```bash
cd ~/workspace/active/total-audio-platform/tools/agents/active
node social-media-scheduler.js generate

# Check output
ls -la ~/workspace/active/total-audio-platform/apps/audio-intel/social-content/CONTENT_CALENDAR.*
```

### Test Newsletter

```bash
cd ~/workspace/active/total-audio-platform/tools/agents/core-agents/content
node newsletter-automation-agent.js

# Review draft before sending
```

---

## Troubleshooting

### Agent Not Running?

```bash
# Check if cron is running
crontab -l

# Check logs for errors
tail -50 ~/.total-audio-logs/[agent-name].log
```

### Gmail Autopilot Failing?

```bash
# Check OAuth tokens
ls -la ~/workspace/active/total-audio-platform/tools/agents/radio-promo/gmail-token.json

# Re-authenticate if needed
cd ~/workspace/active/total-audio-platform/tools/agents
./quick-oauth-setup.sh
```

### Social Calendar Empty?

```bash
# Check content library exists
ls -la ~/workspace/active/total-audio-platform/apps/audio-intel/social-content/

# Regenerate if needed
cd ~/workspace/active/total-audio-platform/tools/agents/active
node social-media-scheduler.js generate
```

---

## Success Metrics

**Week 1**(After Setup):

-  5 agents running automatically
-  Gmail organized hourly
-  Social calendar generated weekly
-  Newsletter drafted weekly
-  15-23 hrs/week saved
-  £0 monthly costs

**Week 4**(Fully Integrated):

-  Zero manual email sorting
-  Social content pre-planned for month
-  Newsletter on autopilot
-  Clean Airtable database
-  New stations discovered weekly
-  Chris focused on customer acquisition

---

## Command Centre Dashboard

Once automation is running, build the Command Centre dashboard:

**Location**: `apps/command-centre/app/agents/page.tsx`

**Shows**:

- Agent status (last run, next run)
- Time saved this week
- Automation health
- Manual tasks pending
- Cost tracking (£0 for free agents)

**Build Time**: 2-3 hours
**Value**: Single pane of glass for all automation

---

## Pro Tips

### Optimize Gmail Autopilot

Add your own email patterns:

```javascript
// Edit: tools/agents/gmail-setup/liberty-autopilot.js
// Add custom filters for your workflow
```

### Customize Social Calendar

Update content library:

```bash
# Edit content files:
apps/audio-intel/social-content/RADIO_PROMOTER_LINKEDIN_POSTS.md
apps/audio-intel/social-content/TWITTER_X_THREADS_RADIO_PROMOTERS.md
apps/audio-intel/social-content/BLUESKY_THREADS_CONTENT.md
```

### Newsletter Topics

Customize news sources:

```javascript
// Edit: tools/agents/core-agents/content/newsletter-automation-agent.js
// Add your industry sources
```

---

## Next Steps

1. **Run setup**: `./setup-free-automation.sh`
2. **Wait 24 hours**: Let agents run their first cycle
3. **Check logs**: Verify successful runs
4. **Review outputs**: Newsletter draft, social calendar
5. **Build dashboard**: Command Centre integration (optional)

---

## When to Add Paid Automation

**After £500/month recurring revenue**:

- Contact enrichment (daily automated)
- Platform API integrations (Twitter, LinkedIn)
- Perplexity for advanced research
- Full AI-powered content generation

**For now**: Free automation saves 15-23 hrs/week with zero costs.

---

## FAQ

**Q: Will this break my existing cron jobs?**
A: No, setup script backs up existing crontab before adding new entries.

**Q: Can I disable specific agents?**
A: Yes, edit crontab with `crontab -e` and comment out lines you don't want.

**Q: What if I want to change schedules?**
A: Edit crontab with `crontab -e` and modify the time patterns.

**Q: How do I stop all automation?**
A: `crontab -r` removes all cron jobs (backs up first with `crontab -l > backup.txt`)

**Q: What about contact enrichment?**
A: Manual trigger only - run when you have budget, not automatically.

---

**Ready to save 15-23 hours/week with zero costs?**

```bash
cd ~/workspace/active/total-audio-platform/tools/agents
./setup-free-automation.sh
```

 **Welcome to automated productivity!**
