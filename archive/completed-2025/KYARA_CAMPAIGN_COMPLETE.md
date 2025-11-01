# KYARA Campaign - Complete Setup Summary

**Artist**: KYARA
**Track**: Yearn
**Genre**: Alternative/Indie
**SoundCloud**: https://on.soundcloud.com/1oiblSoRYCp1swzCr3
**Release Date**: October 14, 2025

---

## ✅ Campaign Setup Complete

### 1. Triple j Contacts (Australia) - READY TO SEND

**All email content prepared with SoundCloud link**

#### Priority Contacts:

1. **Claire Mooney** (Music Director)
   - Email: mooney.claire@abc.net.au
   - Pitch: General triple j consideration
   - Previous support angle emphasized

2. **Anika Luna** (Home & Hosed) ⭐ KEY TARGET
   - Email: luna.anika@abc.net.au
   - Pitch: Follow-up to previous play
   - Context: Jaimee Taylor-Neilsen played "Yearn" on Home & Hosed (August 2024)
   - This is the show that champions independent artists

3. **Abby Butler** (Presenter)
   - Email: butler.abby@abc.net.au
   - Pitch: Part of Abby & Tyrone duo
   - Alternative/indie programming angle

4. **Tyrone Pynor** (Presenter)
   - Email: pynor.tyrone@abc.net.au
   - Pitch: Part of Abby & Tyrone duo
   - Alternative/indie programming angle

**Email Content Location**:

```bash
node tools/agents/radio-promo/kyara-send-emails.js
```

---

### 2. UK Alternative/Indie Contacts - FROM AIRTABLE

**Relevant contacts identified:**

1. **Amazing Radio** (Online) - Warm
   - Submission required: https://amazingradio.com/submit
   - Use SoundCloud link: https://on.soundcloud.com/1oiblSoRYCp1swzCr3
   - Previous support: triple j Home & Hosed

2. **Radio Wigwam** (Community) - Warm
   - Submission required: https://radiowigwam.com/submit
   - Use SoundCloud link: https://on.soundcloud.com/1oiblSoRYCp1swzCr3
   - Previous support: triple j Home & Hosed

3. **BBC Radio 6 Music** (National) - Cold
   - Email: 6music@bbc.co.uk
   - Pitch similar to triple j approach

4. **NTS Radio** (Online) - Cold
   - Email: submissions@nts.live
   - Alternative/electronic angle

5. **Resonance FM** (Community) - Cold
   - Email: programming@resonancefm.com
   - Experimental alternative angle

---

### 3. Mailchimp Press Release Update

**Action Required**: Update Mailchimp press release "Listen Now" button

**Old Link**: Google Drive link (broken)
**New Link**: https://on.soundcloud.com/1oiblSoRYCp1swzCr3

**Steps**:

1. Login to Mailchimp: https://mailchimp.com
2. Find KYARA press release campaign
3. Edit campaign content
4. Replace Google Drive link with SoundCloud link
5. Save and send/schedule

---

## 📋 Immediate Next Steps

### Priority 1: Triple j Emails (Today)

- [ ] Copy email content from generated output
- [ ] Send to Anika Luna (Home & Hosed) - **HIGHEST PRIORITY**
- [ ] Send to Claire Mooney (Music Director)
- [ ] Send to Abby Butler & Tyrone Pynor

### Priority 2: UK Radio Submissions (This Week)

- [ ] Submit to Amazing Radio: https://amazingradio.com/submit
- [ ] Submit to Radio Wigwam: https://radiowigwam.com/submit
- [ ] Update Mailchimp press release with SoundCloud link

### Priority 3: Additional UK Outreach (Week 2)

- [ ] Email BBC Radio 6 Music
- [ ] Email NTS Radio
- [ ] Email Resonance FM

### Priority 4: Follow-up (Week 2-3)

- [ ] Follow up with Anika Luna if no response (1 week)
- [ ] Follow up with Claire Mooney if no response (1 week)
- [ ] Monitor WARM API for plays

---

## 🎯 Campaign Success Metrics

### Target Outcomes:

- **Primary**: Home & Hosed play (follow-up to previous support)
- **Secondary**: General triple j playlist consideration
- **Tertiary**: UK alternative radio support (Amazing Radio, Wigwam)

### Tracking:

- Email responses from triple j team
- WARM API play tracking
- Mailchimp campaign open/click rates
- Artist feedback from Marie (KYARA)

---

## 📁 Campaign Files Created

1. **Liberty Agent Script**: `tools/agents/radio-promo/liberty-agent-kyara.js`
   - Full SDK-powered agent with Monday.com, Gmail, WARM API integration
   - Prompt caching, extended thinking, agentic loops
   - Currently requires additional API setup

2. **Campaign Launcher**: `tools/agents/radio-promo/kyara-campaign-launcher.js`
   - Complete campaign orchestration
   - Airtable search, webhook submissions, Mailchimp update
   - Campaign summary generation

3. **Email Generator**: `tools/agents/radio-promo/kyara-send-emails.js`
   - Personalized email content for each triple j contact
   - SoundCloud link included
   - Ready to copy/paste and send

4. **Environment Setup**: `tools/agents/radio-promo/.env`
   - Mailchimp API key: 83f53d36bd6667b4c56015e8a0d1ed66-us13
   - Monday.com, WARM API, Google credentials configured

---

## 💡 Key Campaign Angles

### Triple j Pitch:

- **Home & Hosed**: "Follow-up to successful play by Jaimee Taylor-Neilsen (August 2024)"
- **Music Director**: "Previous triple j support, strong progression in sound"
- **Presenters**: "Building momentum in Australian alternative scene"

### UK Alternative Radio Pitch:

- **Previous Support**: "triple j Home & Hosed play demonstrates indie credibility"
- **Genre Fit**: "Raw emotional intensity with polished production"
- **Audience**: "Perfect for alternative/indie programming"

---

## 🤖 Technical Implementation

### SDK Features Used:

1. **Prompt Caching**: 80-90% cost reduction on repeated context
2. **Extended Thinking**: Better campaign strategy generation
3. **Agentic Loops**: Autonomous multi-step execution
4. **Streaming Progress**: Real-time campaign visibility
5. **Tool Integration**: Monday.com, Gmail, WARM API orchestration

### Agent Architecture:

- Extends `StreamingAgent` base class
- 5 specialized tools for campaign execution
- Cached UK music industry and Liberty PR context
- Event-driven progress monitoring

---

## 📞 Contact Information

**Artist Contact**:

- Name: Marie (KYARA)
- Email: kyaramusic@outlook.com

**Liberty Music PR**:

- Contact: Chris Schofield
- Email: chris@libertymusicpr.com
- Sending Email: chrisschofield@libertymusicpr.com

---

## 🎉 Campaign Status: READY TO LAUNCH

All preparation complete. Email content ready to send. Manual submissions prepared.

**Next Action**: Send emails to triple j contacts (start with Anika Luna at Home & Hosed)

---

**Campaign Created**: October 3, 2025
**Liberty Agent**: v2.0 (SDK-powered)
**Anthropic Claude**: Sonnet 4.5
