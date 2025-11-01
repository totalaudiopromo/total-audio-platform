# 🔄 Total Audio Seamless Workflow

## The Vision: One-Click Radio Promotion

**Goal:** Transform radio promotion from 15+ hours of manual work to 15 minutes of seamless automation.

---

## 🎯 Complete User Journey

### **Step 1: Audio Intel** (Contact Enrichment)

**URL:** `https://intel.totalaudiopromo.com/demo`

**Actions:**

1. User uploads contact list OR loads demo data
2. AI enriches contacts with intelligence:
   - Outlet/station name
   - Role and focus (genres, show type)
   - Best contact times
   - Confidence score (High/Medium/Low)
3. User reviews enriched contacts
4. User clicks **"→ Pitch"** on a contact

**Output:** Contact data copied to clipboard + opens Pitch Generator

---

### **Step 2: Pitch Generator** (AI Pitch Creation)

**URL:** `https://pitch.totalaudiopromo.com/pitch/generate?import=clipboard`

**First-Time User Flow:**

1. **Guided Onboarding Modal** appears:
   - "Welcome to Pitch Generator!"
   - Explains authentic voice setup (2 mins)
   - Options: "Set Up My Voice" or "Skip for Now"
2. If "Set Up Now": Goes to `/profile/voice`
   - Quick setup: Paste sample pitch text, AI analyzes
   - OR Guided: Answer 5 questions about style/approach
3. If "Skip": Uses professional default tone

**Returning User Flow:**

1. Auto-imports contact from clipboard
2. Contact details pre-filled:
   - Name: Jack Saunders
   - Outlet: BBC Radio 1
   - Role: Presenter
   - Show Focus: Alternative/Indie/Electronic
3. User fills in campaign details:
   - Artist name: sadact
   - Track title: "Midnight Circuits"
   - Genre: Electronic
   - Release date: 2025-11-15
   - Key hook: "Dark techno with analogue warmth"
   - Track link: Spotify/SoundCloud
4. Clicks **"Generate Pitch"**
5. AI creates personalized pitch using authentic voice
6. User reviews, edits if needed
7. Clicks **"Send to Tracker"**

**Output:** Pitch text + contact added to campaign tracker

---

### **Step 3: Tracker** (Campaign Management)

**URL:** `https://tracker.totalaudiopromo.com/campaigns/[campaign-id]`

**Actions:**

1. Auto-creates campaign or adds to existing
2. Contact card shows:
   - Jack Saunders (BBC Radio 1)
   - Pitch sent: 2025-10-11
   - Status: Awaiting Reply
   - Intelligence notes from Audio Intel
3. User sends pitch via their preferred method:
   - Copy to email
   - Send via integrated email
   - Export to MailChimp/ConvertKit
4. User tracks responses:
   - Mark as "Replied", "Interested", "Not Interested"
   - Add notes about conversation
   - Schedule follow-ups
5. View campaign analytics:
   - Response rate by outlet type
   - Best performing contacts
   - Follow-up reminders

---

## 🛠️ Technical Integration Points

### **Audio Intel → Pitch Generator**

```javascript
// Audio Intel sends contact data via clipboard
const clipboardData = {
  source: 'intel',
  contacts: [
    {
      name: 'Jack Saunders',
      outlet: 'BBC Radio 1',
      role: 'Presenter',
      genres: 'Alternative, Indie, Electronic',
      notes: 'Key tastemaker for breaking new artists...',
      email: 'jack.saunders@bbc.co.uk',
    },
  ],
};

await navigator.clipboard.writeText(JSON.stringify(clipboardData));
window.open('https://pitch.totalaudiopromo.com/pitch/generate?import=clipboard', '_blank');
```

### **Pitch Generator → Tracker**

```javascript
// After pitch generation, send to tracker
const campaignData = {
  source: 'pitch-generator',
  contact: {
    name: 'Jack Saunders',
    outlet: 'BBC Radio 1',
    email: 'jack.saunders@bbc.co.uk',
  },
  pitch: {
    subject: 'New Music: sadact - Midnight Circuits',
    body: '[Generated pitch text]',
    sentAt: '2025-10-11T14:30:00Z',
  },
  intelligence: '[Intelligence notes from Audio Intel]',
};

// Option 1: Direct API call
await fetch('https://tracker.totalaudiopromo.com/api/campaigns/add', {
  method: 'POST',
  body: JSON.stringify(campaignData),
});

// Option 2: Clipboard + redirect
await navigator.clipboard.writeText(JSON.stringify(campaignData));
window.open('https://tracker.totalaudiopromo.com/campaigns/new?import=clipboard', '_blank');
```

---

## 📊 Demo Voice Profile

**For Liberty and other demos, pre-configure Chris's authentic voice:**

**Location:** `/apps/pitch-generator/scripts/setup-demo-voice.js`

**Profile:**

- **Background:** Chris Schofield, producer behind sadact - 5+ years radio promotion
- **Style:** British casual-professional, no corporate speak
- **Achievements:** BBC Radio 1, 6 Music placements
- **Approach:** Authentic relationship-building, not spam
- **Differentiator:** Actually a working producer, not just a tool seller

**Setup:**

```bash
cd /apps/pitch-generator
node scripts/setup-demo-voice.js --import
```

---

## 🎬 Liberty Demo Script

**Time:** 5 minutes total

### **Part 1: Audio Intel (2 mins)**

1. Open `/demo`
2. "This is Audio Intel - what I use for all my radio campaigns"
3. Click "Load Demo Data"
4. "Watch how it enriches BBC Radio 1 contacts instantly"
5. Show results with confidence scores
6. "This would take 15+ hours manually"

### **Part 2: Pitch Generator (2 mins)**

7. Click "→ Pitch" on Jack Saunders
8. "Now I'm in Pitch Generator with the contact pre-loaded"
9. Fill in track details (use prepared example)
10. Click "Generate Pitch"
11. "AI creates a pitch using my authentic voice"
12. Show the result
13. "I can tweak it, then send it"

### **Part 3: Tracker (1 min)**

14. Click "Send to Tracker"
15. "Now it's in my campaign tracker"
16. Show campaign view with status tracking
17. "I can track replies, schedule follow-ups, see analytics"

**The Kicker:**
"This entire workflow - from messy spreadsheet to tracked pitch campaign - takes 15 minutes. It used to take me 15+ hours."

---

## 🚀 Future Enhancements

### **Phase 1: Complete Integration** (Next 2 weeks)

- ✅ Audio Intel → Pitch (Done)
- 🔄 Pitch → Tracker (In progress)
- 🔄 Guided onboarding for first-time users
- 🔄 Demo voice profile setup

### **Phase 2: Automation** (Next month)

- Email integration (send directly from Pitch Generator)
- Auto-tracking of replies
- MailChimp/ConvertKit sync
- Automated follow-up reminders

### **Phase 3: Intelligence** (2-3 months)

- AI learns from successful pitches
- Suggests best times to contact
- Predicts response likelihood
- Recommends which contacts to prioritize

---

## 📝 Implementation Checklist

### **Audio Intel**

- [x] Fix duplicate headers on /demo
- [x] Add "→ Pitch" button to contact cards
- [x] Implement clipboard data export
- [x] Fix Pitch Generator URL (add `/pitch/generate?import=clipboard`)
- [x] Replace Annie Mac with Nick Grimshaw
- [x] Use real BBC/Spotify contact emails

### **Pitch Generator**

- [x] Create VoiceOnboarding component
- [x] Create demo voice profile script
- [ ] Integrate onboarding modal into `/pitch/generate`
- [ ] Add "Send to Tracker" button after pitch generation
- [ ] Implement Tracker API integration

### **Tracker**

- [ ] Create `/api/campaigns/add` endpoint
- [ ] Add clipboard import support
- [ ] Design campaign card with intelligence notes
- [ ] Build response tracking UI
- [ ] Add analytics dashboard

---

**Status:** Phase 1 in progress (80% complete)
**Next Priority:** Complete Pitch → Tracker integration
**Timeline:** Complete Phase 1 by end of week for Liberty demo

---

_Last Updated: October 11, 2025_
_Owner: Chris Schofield (sadact)_
