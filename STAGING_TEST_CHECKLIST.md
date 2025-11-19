# 🧪 Staging Test Checklist - 7 New Features

**Branch**: `staging/total-audio-promo-features`
**Date Started**: 2025-11-16
**Tester**: Chris Schofield

---

## ✅ Phase 1: Environment Setup

- [x] **Update pnpm workspace** - pnpm-workspace.yaml includes agent-layer
- [x] **Install agent-layer dependencies** - @anthropic-ai/sdk + zod installed
- [x] **Install workspace dependencies** - All packages updated
- [x] **Verify ANTHROPIC_API_KEY** - Present in apps/audio-intel/.env.local

---

## 🗄️ Phase 2: Database Migration

**Migration File**: `packages/core-db/supabase/migrations/20251115000002_total_audio_promo_features.sql`
**Supabase Project**: ucncbighzqudaszewjrv

### Steps:

1. [ ] Open Supabase Dashboard → SQL Editor
2. [ ] Copy full migration file content
3. [ ] Paste and run in SQL Editor
4. [ ] Verify tables created:
   - [ ] contact_confidence
   - [ ] contact_similarity
   - [ ] pitch_variations
   - [ ] campaign_postmortems
   - [ ] export_templates
   - [ ] export_history
   - [ ] enrichment_audit
   - [ ] widget_usage
5. [ ] Verify views created:
   - [ ] high_confidence_contacts
   - [ ] recent_enrichments
6. [ ] Verify 4 system templates inserted in export_templates table

**Migration Result**:

- [ ] Success (all tables/views created)
- [ ] Partial (errors logged below)
- [ ] Failed (rollback required)

**Notes**:

---

## 🚀 Phase 3: Dev Server

- [ ] Start Audio Intel: `cd apps/audio-intel && npm run dev`
- [ ] Server running on http://localhost:3000
- [ ] No TypeScript compilation errors
- [ ] No dependency errors in console

---

## 🔌 Phase 4: API Endpoint Testing

### 1. Contact Confidence API (`/api/contacts/confidence`)

**POST /api/contacts/confidence**

```bash
curl -X POST http://localhost:3000/api/contacts/confidence \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "test-contact-123",
    "contactEmail": "test@example.com",
    "enrichmentData": {}
  }'
```

- [ ] Returns confidence score (0-100)
- [ ] Returns confidence level (high/medium/low)
- [ ] Returns individual factor scores
- [ ] Stores data in database

**GET /api/contacts/confidence?contactId=test-contact-123**

- [ ] Returns stored confidence data
- [ ] Returns 404 for non-existent contact

---

### 2. Contact Similarity API (`/api/contacts/similar`)

**POST /api/contacts/similar**

```bash
curl -X POST http://localhost:3000/api/contacts/similar \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "test-contact-123",
    "intelligence": "BBC Radio 6 Music, indie rock, 50k listeners"
  }'
```

- [ ] Returns similar contacts with scores
- [ ] Similarity scores between 0-100
- [ ] Matching attributes tracked
- [ ] Caches results for future requests

**GET /api/contacts/similar?contactId=test-contact-123**

- [ ] Returns cached similar contacts

---

### 3. Pitch Variations API (`/api/pitch/variations`)

**POST /api/pitch/variations**

```bash
curl -X POST http://localhost:3000/api/pitch/variations \
  -H "Content-Type: application/json" \
  -d '{
    "variationType": "formal",
    "artistName": "The XX",
    "trackTitle": "On Hold",
    "genre": "Indie Electronic",
    "targetContactType": "radio"
  }'
```

- [ ] Generates formal variation
- [ ] UK English enforcement works
- [ ] Subject line + body generated
- [ ] Stores in database with generation metadata

**Test all 5 variation types**:

- [ ] Formal
- [ ] Casual
- [ ] Concise
- [ ] Detailed
- [ ] Follow-up

**GET /api/pitch/variations?userId=xxx**

- [ ] Returns saved variations

**PATCH /api/pitch/variations/:id**

- [ ] Updates usage stats (times_used, times_opened, times_replied)

---

### 4. Campaign Post-Mortem API (`/api/campaigns/[id]/post-mortem`)

**POST /api/campaigns/123/post-mortem**

```bash
curl -X POST http://localhost:3000/api/campaigns/123/post-mortem \
  -H "Content-Type: application/json" \
  -d '{
    "campaignName": "Liberty Music Radio Campaign",
    "totalContactsReached": 150,
    "responseRate": 45,
    "successRate": 30
  }'
```

- [ ] Generates executive summary
- [ ] Lists 3-5 key wins
- [ ] Lists 3-5 key learnings
- [ ] Lists 3-5 improvement recommendations
- [ ] Includes performance metrics

**GET /api/campaigns/123/post-mortem**

- [ ] Returns existing post-mortem

---

### 5. Export Templates API (`/api/export/[template]/generate`)

**POST /api/export/press-kit/generate**

- [ ] Generates Press Kit export
- [ ] Returns CSV download

**POST /api/export/radio-plan/generate**

- [ ] Generates Radio Plan export
- [ ] Returns PDF/HTML download

**POST /api/export/playlist-pack/generate**

- [ ] Generates Playlist Pack export
- [ ] Returns CSV download

**POST /api/export/client-report/generate**

- [ ] Generates Client Report export
- [ ] Returns PDF/HTML download

**GET /api/export/press-kit/generate**

- [ ] Returns template info

---

### 6. Enrichment Audit Trail API (`/api/audit/enrichment`)

**POST /api/audit/enrichment**

```bash
curl -X POST http://localhost:3000/api/audit/enrichment \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "test-123",
    "enrichmentSource": "perplexity",
    "responseTime": 2500,
    "tokensUsed": 1200,
    "costGBP": 0.05
  }'
```

- [ ] Creates audit log entry
- [ ] Stores request/response payload
- [ ] Tracks performance metrics
- [ ] Tracks cost in £GBP

**GET /api/audit/enrichment?userId=xxx**

- [ ] Returns audit logs
- [ ] Filtering works (by status, source, date)
- [ ] Summary dashboard data included

---

### 7. Widget Enrichment API (`/api/enrich-lite`)

**POST /api/enrich-lite**

```bash
curl -X POST http://localhost:3000/api/enrich-lite \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test Contact",
    "sessionId": "widget-session-123"
  }'
```

- [ ] Enriches contact (lightweight)
- [ ] Tracks quota (3 free enrichments)
- [ ] Returns enrichment result
- [ ] Shows upgrade prompt after 3rd enrichment

---

### 8. Widget Analytics API (`/api/widget-track`)

**POST /api/widget-track**

- [ ] Tracks widget loads
- [ ] Tracks enrichment attempts
- [ ] Tracks conversions (widget → signup)

**GET /api/widget-track?sessionId=xxx**

- [ ] Returns widget usage analytics

---

## 🎨 Phase 5: UI Component Testing

### 1. ContactConfidenceBadge Component

**Test Page**: Create `/apps/audio-intel/app/test-features/page.tsx`

```tsx
import { ContactConfidenceBadge } from '@/components/features/ContactConfidenceBadge';

<ContactConfidenceBadge
  contactId="test-contact-123"
  contactEmail="test@example.com"
  showDetails={true}
/>;
```

- [ ] Component renders without errors
- [ ] Traffic light badge displays (green/yellow/red)
- [ ] Expandable detail view shows factor breakdowns
- [ ] High-risk contact warning appears when flagged
- [ ] Mobile-responsive layout

---

### 2. SimilarContactsSidebar Component

```tsx
import { SimilarContactsSidebar } from '@/components/features/SimilarContactsSidebar';

<SimilarContactsSidebar
  contactId="test-contact-123"
  onSelectContact={id => console.log('Selected:', id)}
/>;
```

- [ ] "Find Similar Contacts" button appears
- [ ] Sidebar opens on click
- [ ] Similarity scores display (0-100%)
- [ ] Matching attributes shown
- [ ] Click-through navigation works

---

### 3. PitchVariationsViewer Component

```tsx
import { PitchVariationsViewer } from '@/components/features/PitchVariationsViewer';

<PitchVariationsViewer
  artistName="The XX"
  trackTitle="On Hold"
  genre="Indie Electronic"
  targetContactType="radio"
/>;
```

- [ ] Tabbed interface renders (5 tabs)
- [ ] Generate button works for each type
- [ ] Copy-to-clipboard functionality works
- [ ] Subject line preview displays
- [ ] Body preview displays
- [ ] Loading states show during generation
- [ ] Error handling for API failures

---

### 4. CampaignPostMortemReport Component

```tsx
import { CampaignPostMortemReport } from '@/components/features/CampaignPostMortemReport';

<CampaignPostMortemReport
  campaignId="camp-123"
  campaignName="Liberty Music Radio Campaign"
  campaignData={{
    totalContactsReached: 150,
    responseRate: 45,
    successRate: 30,
  }}
/>;
```

- [ ] Full-page report layout renders
- [ ] Metric cards display correctly
- [ ] Executive summary shows
- [ ] Key wins section (✓ icons)
- [ ] Key learnings section (💡 icons)
- [ ] Recommendations section (→ icons)
- [ ] Export as text file works
- [ ] AI model attribution shown

---

### 5. ExportTemplateSelector Component

```tsx
import { ExportTemplateSelector } from '@/components/features/ExportTemplateSelector';

<ExportTemplateSelector contactIds={['contact-1', 'contact-2']} campaignId="camp-123" />;
```

- [ ] Template dropdown displays 4 options
- [ ] Template preview shows on select
- [ ] Format badge displays (CSV/PDF/ZIP)
- [ ] One-click download works
- [ ] File downloads correctly
- [ ] Custom branding options appear (AGENCY tier)

---

### 6. EnrichmentAuditTrail Component

```tsx
import { EnrichmentAuditTrail } from '@/components/features/EnrichmentAuditTrail';

<EnrichmentAuditTrail userId="user-123" />;
```

- [ ] Summary dashboard displays:
  - [ ] Total enrichments count
  - [ ] Success rate percentage
  - [ ] Average response time
  - [ ] Total cost in £GBP
- [ ] Audit log table renders
- [ ] Filterable by status, source, date
- [ ] Expandable rows show full details
- [ ] Status badges (success, cached, partial, failed, rate-limited)
- [ ] Source badges (Perplexity, Claude, manual, cache)
- [ ] Cost tracking accurate

---

## 🪝 Phase 6: Widget Testing

### Create Test HTML File

```html
<!-- test-widget.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Quick Intel Widget Test</title>
  </head>
  <body>
    <h1>Test Widget</h1>
    <script src="http://localhost:3000/widget.js"></script>
    <div id="audio-intel-widget" data-api-url="http://localhost:3000"></div>
  </body>
</html>
```

### Widget Tests

- [ ] Widget loads on external HTML file
- [ ] Email + name input fields appear
- [ ] Enrichment works (first attempt)
- [ ] Results preview shows with confidence badge
- [ ] Quota tracking (3 free enrichments)
- [ ] 4th enrichment shows upgrade prompt
- [ ] localStorage persists quota on refresh
- [ ] Analytics tracking fires to /api/widget-track
- [ ] Responsive design on mobile
- [ ] Error handling for network failures

---

## 🔧 Phase 7: Agent Layer Verification

### TypeScript Compilation

```bash
cd packages/agent-layer
pnpm run typecheck
```

- [ ] TypeScript compiles without errors
- [ ] All type definitions valid

### Skill Testing

- [ ] Manifest exists: `skills/pitch-variation/manifest.json`
- [ ] Skill run function: `skills/pitch-variation/run.ts`
- [ ] Skill can be invoked directly
- [ ] Package exports work:
  - [ ] `import { PitchVariationSkill } from '@total-audio/agent-layer/skills'`
  - [ ] `import { SkillRegistry } from '@total-audio/agent-layer/registry'`
  - [ ] `import { SkillManifest } from '@total-audio/agent-layer/types'`

---

## 🔄 Phase 8: Integration Testing

### End-to-End Flow

1. [ ] **Enrich Contact** → Contact data populated
2. [ ] **Check Confidence** → Traffic light badge shows high confidence
3. [ ] **Find Similar** → 5+ similar contacts returned
4. [ ] **Generate Pitch** → All 5 variation types generated
5. [ ] **Create Post-Mortem** → Campaign analysis complete
6. [ ] **Export Results** → Press Kit downloads successfully

### Tier Differentiation

**FREE Tier (10 enrichments)**:

- [ ] Contact Confidence (basic) - Works
- [ ] Similar Contacts (1 preview) - Works
- [ ] Pitch Variations (1 type only) - Restricted
- [ ] Campaign Post-Mortem - Blocked
- [ ] Export Templates - Blocked
- [ ] Audit Trail (read-only) - Works

**PRO Tier (£19/month)**:

- [ ] All confidence features - Works
- [ ] Unlimited similar contacts - Works
- [ ] All 5 pitch types - Works
- [ ] Campaign post-mortems - Works
- [ ] 2 export templates - Works
- [ ] Full audit trail - Works

**AGENCY Tier (£79/month)**:

- [ ] All 4 export templates - Works
- [ ] Custom branding - Works
- [ ] Multi-client features - Works
- [ ] Advanced analytics - Works
- [ ] White-label widget - Works

### Error Handling

- [ ] Invalid contact ID → 404 error
- [ ] Missing ANTHROPIC_API_KEY → Clear error message
- [ ] Rate limit exceeded → Retry with backoff
- [ ] Network timeout → User-friendly error
- [ ] Malformed data → Validation error with details

### Performance

- [ ] Contact Confidence calculation < 1s
- [ ] Similar contacts search < 3s
- [ ] Pitch generation < 10s (AI call)
- [ ] Post-mortem generation < 15s (AI call)
- [ ] Export generation < 5s
- [ ] Widget enrichment < 3s

---

## ✅ Final Checklist

### Database

- [ ] All 7 tables created and accessible
- [ ] RLS policies active and working
- [ ] 2 views returning correct data
- [ ] 4 system templates inserted

### Backend

- [ ] All 8 API routes respond correctly
- [ ] Error handling comprehensive
- [ ] Logging and audit trails working
- [ ] Performance meets targets

### Frontend

- [ ] All 6 UI components render
- [ ] Mobile-responsive design maintained
- [ ] No console errors
- [ ] shadcn/ui styling consistent

### Business Logic

- [ ] UK English enforcement works
- [ ] Tier differentiation accurate
- [ ] Quota enforcement correct
- [ ] Analytics tracking fires

### Developer Experience

- [ ] TypeScript strict mode passes
- [ ] No ESLint errors
- [ ] Agent layer package importable
- [ ] Clear error messages

---

## 🐛 Issues Found

**Issue #1**:

- **Component/API**:
- **Description**:
- **Severity**: Critical / High / Medium / Low
- **Fix Required**:
- **Status**: Open / Fixed / Won't Fix

**Issue #2**:

- **Component/API**:
- **Description**:
- **Severity**:
- **Fix Required**:
- **Status**:

---

## ✅ Sign-Off

- [ ] All critical issues resolved
- [ ] All high-priority issues resolved or documented
- [ ] Performance targets met
- [ ] Mobile UX validated
- [ ] Ready for production deployment

**Tested By**: Chris Schofield
**Date Completed**: \***\*\_\_\_\*\***
**Next Steps**: Apply migration to production → Merge to main → Deploy
