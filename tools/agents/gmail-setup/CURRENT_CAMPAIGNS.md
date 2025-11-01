# Liberty Gmail - Current Campaign Setup

## 🎯 YOUR ACTIVE CAMPAIGNS (Front & Center)

**🎵 Kiara - Bloodshot** (50 emails)

- Automatically routes all emails with "Kiara", "Bloodshot", or "KYARA"
- Stays in inbox if mentions "Chris"
- Color: Red

**🎵 Senior Dunce - Bestial** (44 emails)

- Automatically routes all emails with "Senior Dunce" or "Bestial"
- Stays in inbox if mentions "Chris"
- Color: Pink

**📅 Weekly Releases** (100 emails)

- Sam's weekly releases emails
- Always stays in inbox (marked important)
- Auto-updates when Sam sends new releases
- Color: Yellow

## 📋 Complete Structure

```
🎵 Kiara - Bloodshot (50)        ← CURRENT CAMPAIGN
🎵 Senior Dunce - Bestial (44)   ← CURRENT CAMPAIGN
📅 Weekly Releases (100)         ← REGULAR UPDATES

Liberty/
  ├── Station Feedback           ← Responses from stations
  ├── Needs Action              ← Requires your response
  ├── Internal                  ← Team communication
  └── Archive (43)              ← Old campaigns

Personal/
  ├── Otter AI (35)             ← Call transcripts
  └── Gemini (3)                ← AI transcripts

Junk/
  └── Marketing                 ← Spam (archived)
```

## 🔧 How It Works

### Automatic Routing (11 filters active)

**Current Campaigns:**

- Kiara/Bloodshot emails → 🎵 Kiara - Bloodshot
- Senior Dunce/Bestial emails → 🎵 Senior Dunce - Bestial
- Weekly releases from Sam → 📅 Weekly Releases (always in inbox)

**Station Feedback:**

- Mentions "Chris" → Keep in inbox + mark important
- Doesn't mention "Chris" → Archive to Liberty/Station Feedback

**Personal Tools:**

- Otter AI → Archive to Personal/Otter AI
- Gemini → Archive to Personal/Gemini

**Marketing Junk:**

- WARM/Machina/Music Reaction → Archive + mark read

### Inbox Behavior

**STAYS IN INBOX:**

- 🎵 Kiara - Bloodshot (if mentions "Chris")
- 🎵 Senior Dunce - Bestial (if mentions "Chris")
- 📅 Weekly Releases (always)
- Liberty/Station Feedback (if mentions "Chris")
- Liberty/Internal (team emails)

**ARCHIVED AUTOMATICALLY:**

- Campaign emails without "Chris"
- Station feedback without "Chris"
- Otter AI transcripts
- Gemini transcripts
- All marketing spam
- Auto-responses

## 🚁 Autopilot Maintenance

**Status:** Running every hour (next runs at top of each hour)

**What it does:**

- Checks last 2 hours of new emails
- Applies correct campaign labels
- Archives marketing spam
- Creates new campaign sub-labels when needed
- Logs all actions

**View activity:**

```bash
tail -f autopilot.log
```

**Recent runs:**

- 17:00 - ✅ Inbox clean
- 21:00 - ✅ Inbox clean

## 📝 Adding New Campaigns

When you start a new campaign, tell me:

1. Campaign name (artist + release)
2. Keywords to watch for

I'll:

1. Create emoji label (colored)
2. Add filter to auto-route emails
3. Move existing emails to the label
4. Archive old campaign to Liberty/Archive

## 🎨 Label Colors

- 🎵 **Red** - Kiara Bloodshot
- 🎵 **Pink** - Senior Dunce Bestial
- 📅 **Yellow** - Weekly Releases
- No color - Everything else

## ✅ What's Working

- ✅ 2 active campaigns front and center
- ✅ Weekly releases always visible
- ✅ Auto-routing to correct campaigns
- ✅ Only emails mentioning "Chris" stay in inbox
- ✅ Old campaigns archived (43 emails)
- ✅ Personal tools organized
- ✅ Marketing spam filtered
- ✅ Hourly autopilot maintaining everything

## 💡 Quick Access

**Check Kiara campaign:**
Click "🎵 Kiara - Bloodshot" in sidebar

**Check Senior Dunce campaign:**
Click "🎵 Senior Dunce - Bestial" in sidebar

**Check Weekly Releases:**
Click "📅 Weekly Releases" in sidebar

**All campaigns organized, front and center, auto-maintained!**
