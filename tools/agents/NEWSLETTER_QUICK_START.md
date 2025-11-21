# "The Unsigned Advantage" Newsletter - Quick Start

##  Run Weekly Newsletter (5 minutes)

```bash
cd ~/workspace/active/total-audio-platform/tools/agents

# Generate newsletter from RSS feeds
node generate-real-newsletter.js

# Send to ConvertKit as draft
node send-to-convertkit.js --test
```

##  What You Get

- **3 newsletter sections** from indie-relevant music news
- **Fresh content** written in your voice by Claude API
- **ConvertKit draft** ready for your review
- **Cost**: £0.01-0.03 per newsletter

##  Voice Quality Checks

Every newsletter should have:

-  "After 5+ years in radio promotion" OR "Building Audio Intel taught me"
-  British spelling (organised, whilst, realise)
-  Specific action (30min-2hr commitment)
-  NO BBC Radio 1 mentions
-  NO name dropping (Fred Again, Royal Blood, etc)
-  NO invented personal examples

##  Monday Workflow

1. **Generate** (5 min): Run newsletter generator
2. **Review** (5 min): Read 3 sections, check voice
3. **Edit** (optional): Tweak any sections if needed
4. **Schedule** (2 min): Approve in ConvertKit for Tuesday 9am
5. **Done**: 12 minutes total

##  Success Metrics

- **Open rate**: Target 40%+
- **Click rate**: Target 8%+
- **Subscriber growth**: Track weekly
- **Quality**: Every newsletter sounds like you

##  Files

All files saved to:
`~/workspace/active/total-audio-platform/tools/agents/`

- `generate-real-newsletter.js` - Main generator
- `send-to-convertkit.js` - ConvertKit integration
- `FINAL_CHRIS_VOICE.md` - Your verified voice profile
- `NEWSLETTER_SYSTEM_COMPLETE.md` - Full documentation

##  If Something Breaks

**Issue**: Claude API error
**Fix**: Check API key in `generate-real-newsletter.js` line 14

**Issue**: ConvertKit fails
**Fix**: Check credentials in `apps/audio-intel/.env.local`

**Issue**: No relevant stories found
**Fix**: Normal! Newsletter skips that week (quality over quantity)

##  Tips

- Run Monday morning for Tuesday send
- Keep manual approval (don't auto-send)
- Monitor first 3 newsletters closely
- Adjust if open rate <35%
- Quality > frequency

---

**Next**: Run `node generate-real-newsletter.js` to test
