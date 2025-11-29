# Genspark Prompt: Liberty Music PR Pitch Deck Alignment

Use this prompt with Genspark to validate and improve the Liberty Music PR pitch deck against the actual platform capabilities.

---

## PROMPT FOR GENSPARK

```
I have a pitch deck for Total Audio Promo presenting to Liberty Music PR on 19 November 2025. I need you to validate all claims against the actual platform capabilities and suggest improvements for maximum impact.

PLATFORM CONTEXT:
- Total Audio Promo: 3-app suite (Audio Intel, Pitch Generator, Campaign Tracker)
- Built for UK music PR agencies and radio promoters
- Founder: Chris Schofield (5+ years radio promotion experience)
- Technology: Next.js 15, TypeScript, Supabase, Claude API
- Design: Postcraft aesthetic (bold borders, hard shadows, no gradients)
- Branding: VoiceGuard™ trademark for pitch voice enforcement

LIBERTY MUSIC PR CONTEXT:
- UK independent music PR agency (founded 2016, Brighton/London)
- Services: Radio promotion, digital marketing, brand collaborations
- 5 stars on Trustpilot (211 reviews)
- Current pain: 15+ hours per campaign on manual contact research
- Volume: 5-10 radio campaigns/month
- Freelancer rate: £30/hour blended average (verify this assumption in pitch)

VALIDATED PLATFORM CAPABILITIES:
Audio Intel: Claude-powered contact enrichment (90s per contact)
100% success rate on BBC/Spotify contact discovery
Pitch Generator: VoiceGuard™ UK spelling + corporate speak detection
Campaign Tracker: CRM-style tracking with Gmail/Airtable sync
Demo pages: Production-ready (2,910+ lines of code)
Error handling: Professional ErrorBoundary + Toast notifications
Mobile responsive: WCAG 2.2 Level AA compliance

PITCH DECK STRUCTURE (10 slides):
1. Title: "Contact Intelligence for Liberty Music PR"
2. Problem: Last campaign vs Next campaign comparison
3. Cost: £2,212-£4,425/month wasted on manual research
4. Solution: 3-app suite (Intel, Pitch, Tracker)
5. Workflow: Campaign kickoff to results (15h → 45min)
6. Results: 50 contacts enriched in 12 minutes, 100% success rate
7. ROI: 453% return on investment
8. Pilot: 3-phase approach (Free → £200 → £400)
9. [Error slide - ignore]
10. Timeline: Today → This Week → Pilot → Review

SPECIFIC CLAIMS TO VALIDATE:
1. "15 hours → 15 minutes contact research" - Is this achievable?
2. "£2,212-£4,425/month waste" - Does math check out?
3. "90 seconds each" enrichment - Can Claude API deliver this?
4. "100% success rate" - Is this realistic or overselling?
5. "453% ROI" - Is calculation accurate?
6. "VoiceGuard™ preserves Liberty's authentic tone" - How does this work?

AREAS FOR IMPROVEMENT:
1. **Visual design**: Make slides visually stunning while maintaining Postcraft aesthetic
2. **Tone calibration**: Current deck is too bold/brash (American sales tactics) - needs British casual-professional softening across ALL slides
3. Mobile-first UX claims (deck doesn't mention this strength)
4. Integration potential with Monday.com, Typeform, Coveragebook (Liberty's known tools)
5. Case study specificity (make examples feel more relevant to UK radio)
6. Risk mitigation (what if live demo fails?)
7. Demo script optimization (flow, timing, emphasis points)

QUESTIONS TO ADDRESS:
1. How to demonstrate VoiceGuard™ preserving "authentic tone" when we don't have Liberty's writing samples?
2. Is "90 seconds each" too specific? Should we say "90 seconds average"?
3. Should we show competitor comparison (vs manual research, not vs other tools)?
4. What's the backup plan if live enrichment demo fails during presentation?
5. How should demo script flow to maximize impact in limited time?

DESIRED OUTPUT:
1. Slide-by-slide validation with "KEEP/REVISE/REMOVE" recommendation
2. Suggested rewording for any oversold claims
3. Additional slides to strengthen pitch (if needed)
4. **VISUAL DESIGN IMPROVEMENTS**: Specific suggestions for each slide to make it visually compelling
   - Layout improvements (hierarchy, whitespace, alignment)
   - Data visualization enhancements (charts, icons, comparisons)
   - Typography recommendations (size, weight, contrast)
   - Colour usage (maintain Postcraft aesthetic: bold borders, hard shadows, no gradients)
   - Visual storytelling elements (before/after, timelines, visual metaphors)
5. Risk mitigation strategies for live demo
6. **UPDATED DEMO SCRIPT**: Optimized presentation flow with timing, transitions, and emphasis points
7. Backup strategies if live demo fails

TONE:
- British casual-professional (not American corporate)
- Honest about limitations (builds trust)
- Confident but not arrogant
- Data-driven, not marketing hype

Please analyze the pitch deck and provide:
A) Validated claims (with evidence from platform capabilities)
B) Risky claims (that need softening or qualification)
C) Missing opportunities (what should we add?)
D) **VISUAL DESIGN IMPROVEMENTS**: Slide-by-slide design recommendations to make each slide visually compelling
   - What visual elements would strengthen the message?
   - How to improve data visualization (charts, comparisons, timelines)?
   - Typography and hierarchy improvements
   - Visual storytelling techniques (before/after, visual metaphors)
   - Maintain Postcraft aesthetic: bold borders, hard shadows, high contrast, no gradients
E) **DEMO SCRIPT**: Complete presentation flow with timing (e.g., "Slide 1: 30 seconds - open with pain point")
F) Backup strategies for live demo failures
G) Final recommendation (GO/NO-GO for pitch on 19 Nov)
```

---

## ADDITIONAL CONTEXT FOR GENSPARK

### Total Audio Promo Technical Architecture

**CRITICAL**: Total Audio apps maintain their own distinct production branding (verified from live sites):

- **Audio Intel**: Blue (#2563EB / blue-600) - contact intelligence focus
- **Pitch Generator**: Amber (#F59E0B / amber-500) - creative writing focus
- **Campaign Tracker**: Teal (#14B8A6 / teal-500) - analytics focus
- **Production Postcraft aesthetic**: Softer than original spec - rounded corners (0.75rem), selective borders (2px standard, 4px hero), friendly shadows

**DO NOT change these production colours in the pitch deck. They are verified from:**

- intel.totalaudiopromo.com (uses #2563EB)
- pitch.totalaudiopromo.com (uses #F59E0B)
- tracker.totalaudiopromo.com (uses #14B8A6)
- Source: `/packages/ui/tailwind/brand-config.js`

**PRODUCTION DESIGN SPECIFICATIONS (from live sites):**

- **Border radius**: 0.75rem (rounded-xl) for cards/boxes, 9999px (rounded-full) for badges
- **Border widths**: 2px standard, 4px for hero elements only, 6px for top accent bars
- **Shadows**: 4px 4px 0px rgba(0,0,0,0.1) standard, 6px 6px 0px rgba(0,0,0,0.15) for emphasis
- **Typography**: font-sans (system stack), font-black (900) for display, font-bold (700) for headings, font-semibold (600) for body
- **Colour treatment**: Softer tints (#DBEAFE, #FEF3C7, #CCFBF1) for backgrounds, not harsh primary colours everywhere

**Audio Intel:**

- Claude API for enrichment
- Supabase PostgreSQL for data storage
- Next.js 15 server actions
- Export: CSV, Airtable, CRM integrations
- Demo: `/apps/audio-intel/app/demo/page.tsx` (850 lines)

**Pitch Generator:**

- VoiceGuard™ Skill (`/src/core/skills/implementations/VoiceGuardSkill.ts`)
- UK spelling enforcement (organise, personalise, colour, etc.)
- Corporate speak detection (leverage, solution, synergy, etc.)
- Compliance scoring (92-98% shown in demo)
- Demo: `/apps/pitch-generator/app/demo/page.tsx` (584 lines)

**Campaign Tracker:**

- CRM-style contact tracking
- Gmail integration for reply detection
- Airtable sync for client reporting
- Follow-up automation
- Demo: `/apps/tracker/app/demo/page.tsx` (746 lines)

### Pitch Deck Weakness Analysis

**Slide 3: Cost Calculation**

- Uses "blended freelancer rate: £30/hour"
- **Question**: Is this Liberty's actual rate? Or assumed?
- **Risk**: If Liberty's actual rate is different, ROI calculation breaks
- **Mitigation**: Say "typical freelancer rate" instead of assuming Liberty's rate

**Slide 5: "Live demo of contact enrichment during presentation"**

- Requires internet connection
- Claude API must be responsive
- **Risk**: What if WiFi fails? What if API is slow?
- **Mitigation**: Have recorded demo video as backup

**Slide 6: "100% success rate"**

- Based on production testing with BBC/Spotify
- **Risk**: Overselling? What if live demo finds a contact it can't enrich?
- **Mitigation**: Say "99%+ success rate in testing" or "100% success rate with major BBC/Spotify contacts"

**Slide 8: "Radio team picks which campaigns"**

- Good: Shows confidence and low-pressure approach
- **Risk**: What if radio team picks campaigns that don't fit the tool?
- **Mitigation**: Add selection criteria (e.g., "radio campaigns with 20+ UK stations")

**Slide 10: "Binary decision: all YES = continue"**

- Clear success criteria (good)
- **Risk**: Too rigid? What if 2/3 YES?
- **Mitigation**: Add flexibility clause ("If 2/3 YES, we'll discuss custom solution")

### CRITICAL: Tone Calibration Across ALL Slides

**PROBLEM**: The current deck is too bold/brash (American sales pitch) and doesn't match Chris's British casual-professional voice.

**REQUIRED TONE SHIFT**:

- **From**: Aggressive, accusatory, "YOU'RE FAILING" energy
- **To**: Consultative, friendly, "here's the industry reality" approach
- **Voice**: "Right, so... here's what we've built" (British casual-professional)
- **NOT**: "YOU NEED THIS NOW!" (American sales tactics)

**SLIDE-BY-SLIDE TONE ADJUSTMENTS**:

**Slide 1 (Title)**: Already good - "Live Demo for Liberty Music PR Radio Team" is friendly and specific

**Slide 2 (Problem)**: Needs softening

- **Current**: "THE LIBERTY REALITY: LAST CAMPAIGN VS NEXT CAMPAIGN" (too dramatic)
- **Better**: "How your workflow could change" or "Before and after: A typical campaign"
- Keep the side-by-side comparison but soften the framing from accusatory to observational

**Slide 3 (Cost)**: MAJOR tone issue

- **Current**: "WHAT THIS COSTS YOU RIGHT NOW" + giant red "£2,212-£4,425/MONTH WASTED"
- **Better**: "The hidden cost of manual research" or "What 15 hours per campaign really means"
- Reduce number size by 40%, change red to amber, add consultative context
- Frame as industry reality, not personal failure

**Slide 4 (Suite)**: Needs balancing

- **Current**: Feels like feature dumping
- **Better**: Add context about workflow integration, not just feature lists
- Soften "Time saved: 5 hours/week → 30 minutes" to feel like observation not promise

**Slide 5 (Workflow)**: Good but could be friendlier

- **Current**: "HOW IT WORKS: CAMPAIGN KICKOFF TO RESULTS" (clinical)
- **Better**: "Here's how a typical campaign flows" or "From contact list to coverage"
- The "90 seconds each" badge feels overly specific - consider "~90 seconds average"

**Slide 6 (Results)**: Tone is decent but could soften claims

- **Current**: "99%+ success rate with major BBC/Spotify contacts" (feels like marketing hype)
- **Better**: "99%+ success rate in testing with major BBC/Spotify contacts" (adds honesty)
- The before/after comparison is good - keep this visual storytelling

**Slide 7 (ROI)**: Same issue as Slide 3

- **Current**: Giant "453% ROI" feels like infomercial
- **Better**: Reduce size, add context, frame as example calculation (which you already do in disclaimer)
- The disclaimer "Example calculation. We'll measure your actual ROI during the pilot" is PERFECT - lean into this honesty

**Slide 8 (Pilot)**: Good structure but headlines too rigid

- **Current**: "RADIO TEAM PILOT → FOUNDING PARTNER PATH" (transactional)
- **Better**: "How we'd work together" or "Proposed pilot approach"
- The "3× YES?    → GO" is actually charming - keep this

**Slide 9 (Benefits)**: Good but feels like feature list

- **Current**: "WHAT THIS MEANS FOR LIBERTY" (corporate)
- **Better**: "What this could mean for Liberty's workflow" (softer, consultative)
- The final line is BRILLIANT: "This isn't about saving money—it's about winning more renewals and taking on bigger artists." - more of this tone throughout!

**Slide 10 (Timeline)**: Good practical tone

- "FROM DEMO TO RADIO TEAM PILOT" is clear and friendly
- "Binary decision: all YES = continue, any NO = walk away" is honest and low-pressure

**VISUAL DESIGN PRINCIPLES FOR SOFTENING**:

1. Reduce all display number sizes by 30-40% (64px instead of 100px)
2. Use amber (#F59E0B) for warnings instead of harsh red (#DC2626)
3. Use teal (#14B8A6) for success/positive framing instead of bright green
4. Add more whitespace - let content breathe
5. Use softer tints for backgrounds (#DBEAFE, #FEF3C7, #CCFBF1)
6. Rounded corners everywhere (0.75rem standard)
7. Lighter shadows (rgba(0,0,0,0.1) not rgba(0,0,0,1))

### Recommended Deck Improvements

**1. Add Slide: "How We Built This"**

- Chris's 5+ years radio promotion background
- Built the tool solving own pain points
- Not a tech startup - actual music industry insider
- **Why**: Establishes credibility and authenticity

**2. Revise Slide 3: Cost Calculation**

- Change "Blended freelancer rate: £30/hour" to "Typical freelancer rate: £30/hour"
- Add footnote: "Adjust for your actual team costs"
- **Why**: Removes assumption about Liberty's specific rates

**3. Add Slide: "Integration with Your Stack"**

- Monday.com (project management)
- Typeform (client intake)
- Coveragebook (media monitoring)
- Gmail + Airtable (current workflow)
- **Why**: Shows we understand Liberty's existing tools

**4. Add Slide: "What This Doesn't Do"**

- Honest about limitations
- Doesn't replace human relationships
- Doesn't guarantee coverage (still needs good music)
- Doesn't write pitches from scratch (augments, not replaces)
- **Why**: Builds trust through honesty

**5. Revise Slide 6: Results**

- Change "100% success rate" to "99%+ success rate with major BBC/Spotify contacts"
- Add qualifier: "Based on 200+ test enrichments"
- **Why**: More honest, less overselling

---

## EXPECTED GENSPARK OUTPUT

After running this prompt through Genspark, you should receive:

1. **Validated Claims**: Which deck claims are accurate based on platform capabilities
2. **Risky Claims**: Which claims need softening or qualification
3. **Missing Slides**: What should be added for stronger pitch
4. **VISUAL DESIGN IMPROVEMENTS**: Slide-by-slide design recommendations (layout, typography, data viz, visual storytelling)
5. **DEMO SCRIPT**: Complete presentation flow with timing for each slide
6. **Risk Mitigation**: Backup plans for live demo failures
7. **Final Recommendation**: Confidence score for 19 Nov pitch

---

## HOW TO USE THIS PROMPT

1. Copy the main prompt section above
2. Paste into Genspark
3. Review Genspark's analysis
4. Apply recommended changes to pitch deck
5. Re-validate claims after deck updates
6. Run final practice pitch before 19 Nov

---

**This prompt ensures the Liberty Music PR pitch deck accurately represents the Total Audio Promo platform capabilities and sets realistic expectations for the pilot.**
