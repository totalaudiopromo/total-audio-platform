# pSEO Implementation Roadmap - Audio Intel Contact Intelligence Authority

##  Goal

Scale from 1 case study (BBC Radio 1) → 60 programmatic landing pages → 2,000+ monthly organic visits → 100+ monthly leads

##  Timeline: 8-Week Implementation

### Week 1: Template Extraction & Foundation

**Objective**: Extract reusable components from BBC Radio 1 case study

**Tasks**:

- [x] BBC Radio 1 case study complete (reference template)
- [ ] Extract template components into reusable React components
- [ ] Create TypeScript interfaces for programmatic data
- [ ] Design Next.js dynamic route structure (`/blog/[topic-slug]/page.tsx`)
- [ ] Build CSV parser utility for content generation

**Deliverables**:

- Reusable `<CaseStudyTemplate />` component
- TypeScript `CaseStudyData` interface
- CSV→Component data pipeline

**Time Estimate**: 8-10 hours

---

### Week 2: High-Priority Content Research (Tier 1 Targets)

**Objective**: Research and validate contacts for highest-traffic opportunities

**Tier 1 Targets** (10 pages, 1,200-2,000 monthly searches each):

1.  BBC Radio 1 (complete)
2. Spotify Editorial Playlists
3. BBC Radio 6 Music
4. Apple Music Editorial
5. BBC Radio 1Xtra
6. BBC Radio 2
7. KISS FM
8. Capital FM
9. Kerrang Radio
10. Absolute Radio

**Research Checklist per Target**:

- [ ] Verify current presenter names (check official station websites)
- [ ] Document show titles and schedules
- [ ] Research submission processes (official uploaders, email formats)
- [ ] Identify genre specializations per show
- [ ] Find recent campaign proof points (if available)
- [ ] Document pain points specific to this station/platform

**Deliverables**:

- 10 completed CSV rows with validated data
- Contact verification log (source URLs for each presenter)
- Genre specialization notes

**Time Estimate**: 15-20 hours

---

### Week 3: Medium-Priority Content Research (Tier 2 Targets)

**Objective**: Research second wave of content opportunities

**Tier 2 Targets** (20 pages, 300-800 monthly searches each):

- Amazing Radio, NTS Radio, Rinse FM, Soho Radio
- Foundation FM, Reprezent Radio, Worldwide FM, Threads Radio
- DIY Magazine, Clash Music, The Quietus, Loud And Quiet
- Resident Advisor, Mixmag, DJ Mag, Attack Magazine
- Bandcamp Editorial, SoundCloud Playlists, Deezer Editorial
- (Additional 5 targets based on research)

**Research Process**: Same as Week 2, scaled across 20 targets

**Deliverables**:

- 20 completed CSV rows with validated data
- Contact verification sources
- Genre/niche specialization notes

**Time Estimate**: 20-25 hours

---

### Week 4: Template Component Development

**Objective**: Build programmatic page generation system

**Technical Tasks**:

- [ ] Create `app/blog/[topic-slug]/page.tsx` dynamic route
- [ ] Build `<CaseStudyHero />` component (accepts data props)
- [ ] Build `<CampaignSnapshot />` component
- [ ] Build `<PainPointsSection />` component
- [ ] Build `<WorkflowBreakdown />` component
- [ ] Build `<ContactsTable />` component
- [ ] Build `<ResultsMetrics />` component
- [ ] Build `<PlaybookChecklist />` component
- [ ] Build `<TestimonialQuote />` component
- [ ] Build `<DualCTA />` component

**Data Pipeline**:

- [ ] CSV parser: Read programmatic-pages.csv
- [ ] Data validator: Check required fields
- [ ] Metadata generator: Generate SEO metadata from CSV data
- [ ] Dynamic route: Pass CSV data to template components

**Deliverables**:

- Fully modular template system
- CSV→Component data flow working
- Test with 5 pages (BBC Radio 1 + 4 new pages)

**Time Estimate**: 12-15 hours

---

### Week 5: Batch Content Generation (Phase 1)

**Objective**: Generate first 30 landing pages from template

**Process**:

1. Populate CSV with research data (Weeks 2-3)
2. Run programmatic generation on 30 targets
3. Manual QA: Check tone, accuracy, formatting
4. Fix template issues and regenerate
5. Add unique touches to top 10 pages

**Quality Checks**:

- [ ] All presenter names current and accurate
- [ ] Submission processes match official sources
- [ ] Tone matches Chris's casual-professional voice
- [ ] No fake email addresses or made-up contacts
- [ ] Internal links correct
- [ ] Schema markup present

**Deliverables**:

- 30 live landing pages
- QA checklist completed
- Template refinements documented

**Time Estimate**: 10-12 hours

---

### Week 6: Batch Content Generation (Phase 2)

**Objective**: Complete remaining 30 landing pages

**Process**: Same as Week 5, covering final 30 targets

**Tier 3 Targets** (30 pages, 50-300 monthly searches each):

- Long-tail radio stations (Reform Radio, Balamii, etc.)
- Music publications (Gold Flake Paint, The 405, etc.)
- Regional BBC Introducing stations
- Niche streaming platforms
- Underground blogs and zines

**Deliverables**:

- All 60 landing pages live
- Complete CSV with validated data
- QA log for all pages

**Time Estimate**: 10-12 hours

---

### Week 7: SEO Optimization & Internal Linking

**Objective**: Maximize organic search performance

**SEO Tasks**:

- [ ] Add schema markup to all 60 pages (Article, HowTo, FAQ)
- [ ] Create internal linking structure (hub pages → case studies)
- [ ] Build programmatic sitemap.xml
- [ ] Generate robots.txt rules
- [ ] Add canonical URLs
- [ ] Create category index pages (Radio Stations, Streaming, Publications)
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics goal tracking (free trial signups from organic)

**Internal Linking Strategy**:

- Features page → "See what you can achieve" grid (9 featured case studies)
- Pricing page → "Real results" section (3 case study links)
- Blog index → Category sections (Radio, Streaming, Publications)
- Cross-links → "Similar Stations/Platforms" in sidebar
- Footer → "Contact Intelligence Guides" section

**Deliverables**:

- Schema markup on all pages
- Internal linking complete
- Sitemap submitted to GSC
- Analytics tracking configured

**Time Estimate**: 8-10 hours

---

### Week 8: Launch, Monitor & Backlink Outreach

**Objective**: Deploy to production and start building authority

**Launch Tasks**:

- [ ] Final QA pass on all 60 pages
- [ ] Deploy to production (Vercel)
- [ ] Monitor Google Search Console for indexing
- [ ] Check Core Web Vitals scores
- [ ] Test mobile experience on all pages
- [ ] Set up ranking tracker for primary keywords

**Backlink Outreach**:

- [ ] Create "Ultimate UK Radio Contact Guide" PDF lead magnet
- [ ] Submit to /r/WeAreTheMusicMakers, /r/MusicMarketing
- [ ] Reach out to music business educators (resource lists)
- [ ] Post on Indie Hackers, Hacker News (Show HN: Contact Intelligence for Musicians)
- [ ] Email 10 music promotion bloggers for feedback
- [ ] Submit to Product Hunt (Music category)

**Monitoring Setup**:

- [ ] Google Search Console: Track impressions, clicks, CTR
- [ ] Google Analytics: Organic traffic, bounce rate, conversions
- [ ] Ranking Tracker: Top 50 keywords monitored weekly
- [ ] Conversion Tracking: Free trial signups from each case study

**Deliverables**:

- 60 pages live in production
- Backlink outreach list (50+ targets)
- Monitoring dashboards configured
- First outreach batch sent (10 contacts)

**Time Estimate**: 10-12 hours

---

##  Success Metrics (Post-Launch)

### Month 1-3: Initial Indexing & Ranking

- **Target**: 200-500 monthly organic visits
- **Focus**: Monitor Google indexing, fix technical issues
- **Key Metric**: Pages indexed (target: 90%+ of 60 pages)

### Month 4-6: Ranking Improvements

- **Target**: 1,000-1,500 monthly organic visits
- **Focus**: Improve content based on early performance
- **Key Metric**: Keywords ranking in top 30 (target: 20+ keywords)

### Month 7-12: Established Authority

- **Target**: 2,000-3,000 monthly organic visits
- **Focus**: Backlink building, content updates
- **Key Metric**: Free trial signups from organic (target: 100-150 monthly)

---

##  Maintenance Schedule (Post-Launch)

### Quarterly (Every 3 Months):

- [ ] Contact accuracy audit (verify presenters still active)
- [ ] Update outdated show information
- [ ] Refresh submission process changes
- [ ] Add new stations/platforms as they emerge
- [ ] Review top-performing pages and create similar content

### Monthly:

- [ ] Check Google Search Console for new ranking opportunities
- [ ] Analyze top 10 performing pages (double down on what works)
- [ ] Monitor backlink profile (new referring domains)
- [ ] Track free trial signup conversions from organic traffic

### Weekly:

- [ ] Review organic traffic trends
- [ ] Check for negative ranking changes (fix quickly)
- [ ] Monitor user feedback (comments, emails)
- [ ] Track competitor content in same space

---

##  Investment Summary

**Total Time Investment**: 93-118 hours over 8 weeks
**Cost at £50/hour**: £4,650-£5,900
**Additional Costs**: £0 (using existing tech stack)

**Expected ROI (12 Months)**:

- Organic Traffic: 2,500 monthly visits average
- Free Trial Signups: 150 monthly (6% conversion)
- Paid Customers: 22 new customers (15% trial→paid)
- Annual Revenue: £5,016 from organic channel

**Payback Period**: 11-14 months
**Year 2+ ROI**: 10x+ (minimal ongoing maintenance)

---

##  Quick Wins to Implement First

### Immediate (This Week):

1.  BBC Radio 1 case study live (complete)
2. [ ] Extract template components (4 hours)
3. [ ] Create 3 more Tier 1 pages manually (Spotify, BBC 6 Music, Apple Music) (6 hours)
4. [ ] Submit sitemap with 4 pages to GSC
5. [ ] Start tracking rankings for primary keywords

### Short-Term (Weeks 2-4):

1. [ ] Research remaining Tier 1 targets (7 pages)
2. [ ] Complete all Tier 1 pages (10 total high-traffic targets)
3. [ ] Build programmatic generation system
4. [ ] Test template with 5 pages from CSV

### Medium-Term (Weeks 5-8):

1. [ ] Scale to all 60 landing pages
2. [ ] Launch backlink outreach campaign
3. [ ] Monitor early traffic and rankings
4. [ ] Optimize top performers

---

##  Bottom Line

This roadmap takes Audio Intel from **1 manual case study** → **60 programmatic landing pages** → **established authority** in music industry contact intelligence.

**Key Success Factors**:

-  Truthful, accurate contact information (builds trust)
-  Quarterly maintenance (keeps content current)
-  Scalable template system (enables rapid expansion)
-  Chris's authentic voice throughout (differentiates from generic content)
-  Focus on indie artist pain points (matches target audience perfectly)

**By Week 8**: Audio Intel becomes the go-to resource for "how to pitch [any UK station/platform]" searches, driving consistent organic traffic and establishing industry credibility.
