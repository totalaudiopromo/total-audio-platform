# Programmatic SEO Page Generation System

**Philosophy**: Better to generate 10 truthful pages than 60 with fake data.

## 🎯 Core Principles

1. **Truthfulness First**: Every contact, presenter name, and submission detail must be verified
2. **Source Verification**: All claims must have source URLs
3. **Recency Requirements**: Contact verification must be within 6 months
4. **Confidence Scoring**: All contacts must have 85%+ confidence scores
5. **No Fake Data**: Never generate pages without verified research

## 📁 System Architecture

```
apps/audio-intel/
├── docs/pseo/
│   ├── programmatic-pages.csv          # Master CSV with all page metadata
│   ├── research/
│   │   ├── bbc-6-music-research.md     # Verified research data
│   │   ├── spotify-editorial-research.md
│   │   └── [topic-slug]-research.md
│   └── PSEO_GENERATION_GUIDE.md        # This file
├── utils/pseo/
│   ├── csvParser.ts                    # CSV parsing + validation
│   └── generatePages.ts                # Page generation script
└── app/blog/
    ├── [topic-slug]/
    │   └── page.tsx                    # Generated page
    └── ...
```

## 🚀 Usage

### Generate All Planned Pages

```bash
npm run pseo:generate -- --all
```

### Generate Single Page

```bash
npm run pseo:generate -- --slug=bbc-6-music
```

### Generate All Tier 1 Pages

```bash
npm run pseo:generate -- --tier=1
```

### Validate Without Generating

```bash
npm run pseo:validate
```

## ✅ Validation Checks

Before any page is generated, the system validates:

### 1. Research Data Exists

- Must have a research file in `docs/pseo/research/[topic-slug]-research.md`
- Must be parseable into structured data

### 2. Contact Verification Recency

- All contacts must be verified within 6 months
- Verification dates older than 6 months trigger errors

### 3. Confidence Scores

- All contacts must have confidence scores >= 85%
- Lower scores require re-verification before generation

### 4. Source URLs

- All contacts must have source URLs for verification
- Missing sources prevent page generation

### 5. Research Currency

- Research date must be within 6 months
- Older research requires update before generation

## 📝 Creating New Pages

### Step 1: Add Row to CSV

Edit `docs/pseo/programmatic-pages.csv`:

```csv
topic_slug,page_url,page_title,meta_description,search_intent,audience,pain_point,solution_angle,proof_points,cta_primary,category,tier,monthly_searches_est,status
new-station,/blog/new-station-contact-enrichment,"New Station Contact Enrichment | Audio Intel","Description here","search keywords","target audience","pain point description","solution angle","proof points","Start Free Trial","UK Radio Stations",2,400,planned
```

### Step 2: Create Research File

Create `docs/pseo/research/new-station-research.md`:

```markdown
# New Station Contact Research - [Current Date]

## Research Date

[ISO Date: 2025-10-03]

## Current Contacts (2025)

### 1. Presenter Name

- **Show**: Show Title
- **Time**: Broadcast schedule
- **Genre Focus**: Genre details
- **Submission Notes**: How to submit
- **Verified**: [Date]
- **Source**: [URL to official page]
- **Confidence**: 94%

[Repeat for all contacts]

## Submission Process

### Primary Route

Description of main submission method

### Alternative Routes

- Alternative method 1
- Alternative method 2

### Timing Requirements

When to submit, deadlines, etc.

### Common Mistakes

1. Mistake #1: Why it fails
2. Mistake #2: Why it fails

## Sources

- https://official-station-page.com
- https://bbc.co.uk/schedules
- https://presenter-social-profile
```

### Step 3: Generate Page

```bash
npm run pseo:generate -- --slug=new-station
```

### Step 4: Review and Test

1. Check generated page at `app/blog/new-station/page.tsx`
2. Verify all contacts are accurate
3. Check source URLs are correct
4. Test page locally: `npm run dev`
5. Review at `http://localhost:3000/blog/new-station`

## 🔍 Quality Control Checklist

Before marking a page as "live" in CSV:

- [ ] All presenter names are current (verified within 6 months)
- [ ] Show titles match official station schedules
- [ ] Submission processes are accurate
- [ ] No fake email addresses or made-up contacts
- [ ] Source URLs are provided and accessible
- [ ] Confidence scores are >= 85%
- [ ] Pain points are realistic and specific
- [ ] Proof points are truthful (no fake metrics)
- [ ] Page renders correctly on mobile and desktop
- [ ] Internal links work correctly
- [ ] CTAs link to correct pricing/demo pages

## 📊 Generation Statistics

The system tracks:

- **Total processed**: All rows attempted
- **Generated**: Pages successfully created
- **Skipped**: Pages without research data
- **Errors**: Pages that failed validation

Example output:

```
📊 Generation Summary
=====================
Total processed: 10
✓ Generated: 7
⚠️  Skipped: 2 (no research data)
❌ Errors: 1 (validation failed)
```

## ⚠️ Error Handling

Common errors and solutions:

### "No research file for [slug]"

**Solution**: Create research file at `docs/pseo/research/[slug]-research.md`

### "Contact verification older than 6 months"

**Solution**: Re-verify contact details and update verification dates

### "Confidence score too low"

**Solution**: Improve research quality or remove low-confidence contacts

### "No source URLs provided"

**Solution**: Add source URLs to research file for all claims

## 🎯 Best Practices

1. **Start with Tier 1**: Focus on high-volume searches first
2. **Verify Everything**: Double-check all presenter names and show titles
3. **Use Official Sources**: BBC schedules, station websites, official social media
4. **Update Regularly**: Re-verify contacts every 6 months
5. **Quality Over Quantity**: 10 perfect pages > 60 mediocre pages

## 📈 SEO Impact Tracking

Track these metrics for each page:

- Organic traffic (Google Analytics)
- Keyword rankings (Google Search Console)
- Free trial signups from page (UTM tracking)
- Time on page and bounce rate
- Internal link clicks

## 🔄 Maintenance Schedule

**Monthly**:

- Review pages with most traffic
- Update any outdated contact information
- Check for 404 errors on source URLs

**Quarterly**:

- Re-verify all Tier 1 page contacts
- Update research files with latest information
- Regenerate pages with updated data

**Annually**:

- Complete audit of all 60 pages
- Remove pages for defunct stations/platforms
- Add new high-priority targets

## 🛠️ Troubleshooting

### Page Won't Generate

1. Check research file exists
2. Validate CSV row data is complete
3. Run validation-only mode: `npm run pseo:validate`
4. Check error messages for specific issues

### Generated Page Has Wrong Data

1. Check research file has correct information
2. Verify CSV row data is accurate
3. Delete generated page and regenerate
4. Review template code in `utils/pseo/generatePages.ts`

### Contacts Look Outdated

1. Check verification dates in research file
2. Re-verify contacts on official sources
3. Update research file with new dates
4. Regenerate page

## 📞 Support

For issues with the PSEO generation system:

1. Check this guide first
2. Review error messages carefully
3. Validate research file structure
4. Test with `--validate-only` flag first

---

**Remember**: Every page represents Audio Intel's credibility. Only generate pages with verified, truthful, current information that provides genuine value to independent artists.
