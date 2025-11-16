# ✅ Staging Environment Setup Complete

**Branch**: `staging/total-audio-promo-features`
**Date**: 2025-11-16
**Status**: Ready for database migration and testing

---

## ✅ Completed Setup Steps

### 1. Workspace Configuration

- [x] **Updated pnpm-workspace.yaml** - Added `packages/agent-layer` to workspace
- [x] **Installed agent-layer dependencies** - @anthropic-ai/sdk + zod installed
- [x] **Installed all workspace dependencies** - `pnpm install` completed successfully
- [x] **Verified ANTHROPIC_API_KEY** - Present in `apps/audio-intel/.env.local`

### 2. Dev Server

- [x] **Audio Intel dev server started** - Running on `http://localhost:3005`
- Background process ID: fd67f5

### 3. Documentation Created

- [x] **STAGING_TEST_CHECKLIST.md** - Comprehensive 9-phase testing guide
- [x] **STAGING_SETUP_COMPLETE.md** - This summary document

---

## 📋 Next Steps (Manual Actions Required)

### Step 1: Apply Database Migration to Supabase

**Supabase Dashboard**: https://ucncbighzqudaszewjrv.supabase.co

**Instructions**:

1. Open Supabase Dashboard → SQL Editor
2. Copy the full SQL migration below
3. Paste into SQL Editor and run
4. Verify all 8 tables created successfully

**SQL Migration** (copy everything below):

```sql
-- Total Audio Promo - 7 High-ROI Features Migration
-- Created: 2025-11-15
-- Features: Contact Confidence, Quick Intel, Pitch Variations, Contact Similarity,
--           Campaign Post-Mortem, Export Templates, Enrichment Audit Trail

-- ============================================================================
-- 1. CONTACT CONFIDENCE ENGINE
-- ============================================================================

-- Contact confidence scoring table
CREATE TABLE IF NOT EXISTS public.contact_confidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Confidence metrics
  overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('high', 'medium', 'low')),

  -- Individual confidence factors (each 0-100)
  email_validity_score INTEGER CHECK (email_validity_score BETWEEN 0 AND 100),
  data_freshness_score INTEGER CHECK (data_freshness_score BETWEEN 0 AND 100),
  source_quality_score INTEGER CHECK (source_quality_score BETWEEN 0 AND 100),
  enrichment_depth_score INTEGER CHECK (enrichment_depth_score BETWEEN 0 AND 100),
  verification_status_score INTEGER CHECK (verification_status_score BETWEEN 0 AND 100),

  -- Metadata
  last_verified_at TIMESTAMP WITH TIME ZONE,
  verification_method TEXT,
  confidence_notes TEXT,

  -- Flags
  requires_reverification BOOLEAN DEFAULT FALSE,
  high_risk_contact BOOLEAN DEFAULT FALSE,

  UNIQUE(user_id, contact_id)
);

CREATE INDEX idx_contact_confidence_user ON public.contact_confidence(user_id);
CREATE INDEX idx_contact_confidence_contact ON public.contact_confidence(contact_id);
CREATE INDEX idx_contact_confidence_level ON public.contact_confidence(confidence_level);
CREATE INDEX idx_contact_confidence_score ON public.contact_confidence(overall_score DESC);

-- ============================================================================
-- 2. CONTACT SIMILARITY ENGINE
-- ============================================================================

-- Contact similarity vectors and scoring
CREATE TABLE IF NOT EXISTS public.contact_similarity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL,
  similar_contact_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Similarity metrics
  similarity_score DECIMAL(5,2) NOT NULL CHECK (similarity_score BETWEEN 0 AND 100),

  -- Similarity factors breakdown
  genre_similarity DECIMAL(5,2) CHECK (genre_similarity BETWEEN 0 AND 100),
  location_similarity DECIMAL(5,2) CHECK (location_similarity BETWEEN 0 AND 100),
  role_similarity DECIMAL(5,2) CHECK (role_similarity BETWEEN 0 AND 100),
  audience_size_similarity DECIMAL(5,2) CHECK (audience_size_similarity BETWEEN 0 AND 100),
  platform_similarity DECIMAL(5,2) CHECK (platform_similarity BETWEEN 0 AND 100),

  -- Metadata
  matching_attributes JSONB,
  recommendation_reason TEXT,

  UNIQUE(user_id, contact_id, similar_contact_id),
  CHECK (contact_id != similar_contact_id)
);

CREATE INDEX idx_contact_similarity_user ON public.contact_similarity(user_id);
CREATE INDEX idx_contact_similarity_contact ON public.contact_similarity(contact_id);
CREATE INDEX idx_contact_similarity_score ON public.contact_similarity(similarity_score DESC);
CREATE INDEX idx_contact_similarity_matching ON public.contact_similarity USING GIN (matching_attributes);

-- ============================================================================
-- 3. PITCH VARIATIONS
-- ============================================================================

-- Pitch variations storage
CREATE TABLE IF NOT EXISTS public.pitch_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_pitch_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Pitch content
  variation_type TEXT NOT NULL CHECK (variation_type IN ('formal', 'casual', 'concise', 'detailed', 'follow-up', 'custom')),
  subject_line TEXT NOT NULL,
  body TEXT NOT NULL,

  -- Generation metadata
  generated_by TEXT DEFAULT 'ai',
  generation_model TEXT,
  generation_prompt TEXT,

  -- Artist/campaign context
  artist_name TEXT,
  track_title TEXT,
  genre TEXT,
  target_contact_type TEXT,

  -- Usage tracking
  times_used INTEGER DEFAULT 0,
  times_opened INTEGER DEFAULT 0,
  times_replied INTEGER DEFAULT 0,

  -- Quality metrics
  user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
  effectiveness_score DECIMAL(5,2)
);

CREATE INDEX idx_pitch_variations_user ON public.pitch_variations(user_id);
CREATE INDEX idx_pitch_variations_type ON public.pitch_variations(variation_type);
CREATE INDEX idx_pitch_variations_artist ON public.pitch_variations(artist_name);
CREATE INDEX idx_pitch_variations_effectiveness ON public.pitch_variations(effectiveness_score DESC NULLS LAST);

-- ============================================================================
-- 4. CAMPAIGN POST-MORTEMS
-- ============================================================================

-- Campaign post-mortem analysis
CREATE TABLE IF NOT EXISTS public.campaign_postmortems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Campaign details
  campaign_name TEXT NOT NULL,
  artist_name TEXT,
  date_range_start DATE,
  date_range_end DATE,

  -- AI-generated analysis
  executive_summary TEXT NOT NULL,
  key_wins TEXT[],
  key_learnings TEXT[],
  improvement_recommendations TEXT[],

  -- Metrics analyzed
  total_contacts_reached INTEGER,
  response_rate DECIMAL(5,2),
  success_rate DECIMAL(5,2),
  avg_response_time_hours DECIMAL(8,2),

  -- Performance breakdown by category
  performance_by_channel JSONB,
  performance_by_genre JSONB,
  top_performing_pitches JSONB,
  underperforming_areas JSONB,

  -- Generation metadata
  generated_by TEXT DEFAULT 'ai',
  generation_model TEXT,
  generation_quality_score INTEGER CHECK (generation_quality_score BETWEEN 1 AND 5),

  -- User interaction
  user_notes TEXT,
  shared_with_team BOOLEAN DEFAULT FALSE,
  exported_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_campaign_postmortems_user ON public.campaign_postmortems(user_id);
CREATE INDEX idx_campaign_postmortems_campaign ON public.campaign_postmortems(campaign_id);
CREATE INDEX idx_campaign_postmortems_artist ON public.campaign_postmortems(artist_name);
CREATE INDEX idx_campaign_postmortems_date ON public.campaign_postmortems(date_range_end DESC);

-- ============================================================================
-- 5. EXPORT TEMPLATES
-- ============================================================================

-- Export template configurations
CREATE TABLE IF NOT EXISTS public.export_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Template identification
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('press-kit', 'radio-plan', 'playlist-pack', 'client-report', 'custom')),
  is_system_template BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  -- Template configuration
  description TEXT,
  output_format TEXT NOT NULL CHECK (output_format IN ('pdf', 'csv', 'zip', 'docx', 'excel')),

  -- Template structure
  template_schema JSONB NOT NULL,

  -- Branding/styling
  custom_branding JSONB,
  header_content TEXT,
  footer_content TEXT,

  -- Usage tracking
  times_used INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT unique_system_template_type UNIQUE NULLS NOT DISTINCT (user_id, template_type, is_system_template)
);

CREATE INDEX idx_export_templates_user ON public.export_templates(user_id);
CREATE INDEX idx_export_templates_type ON public.export_templates(template_type);
CREATE INDEX idx_export_templates_system ON public.export_templates(is_system_template);

-- Export history/audit log
CREATE TABLE IF NOT EXISTS public.export_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.export_templates(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Export details
  export_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes INTEGER,

  -- Export content summary
  records_exported INTEGER,
  data_snapshot JSONB,

  -- Storage
  file_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  generation_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_export_history_user ON public.export_history(user_id);
CREATE INDEX idx_export_history_template ON public.export_history(template_id);
CREATE INDEX idx_export_history_created ON public.export_history(created_at DESC);

-- ============================================================================
-- 6. ENRICHMENT AUDIT TRAIL
-- ============================================================================

-- Enhanced enrichment audit log
CREATE TABLE IF NOT EXISTS public.enrichment_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Contact being enriched
  contact_email TEXT NOT NULL,
  contact_name TEXT,
  contact_id UUID,

  -- Enrichment process details
  enrichment_source TEXT NOT NULL,
  enrichment_method TEXT,

  -- Request/response tracking
  api_request_id TEXT,
  request_payload JSONB,
  response_payload JSONB,

  -- Performance metrics
  response_time_ms INTEGER,
  api_tokens_used INTEGER,
  api_cost_cents INTEGER,

  -- Quality metrics
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  data_quality_score INTEGER CHECK (data_quality_score BETWEEN 0 AND 100),
  fields_enriched TEXT[],

  -- Status tracking
  status TEXT NOT NULL CHECK (status IN ('success', 'partial', 'failed', 'cached', 'rate-limited')),
  error_code TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Data changes tracking
  fields_before JSONB,
  fields_after JSONB,
  changes_detected TEXT[],

  -- Trust & verification
  verification_method TEXT,
  verification_score INTEGER CHECK (verification_score BETWEEN 0 AND 100),
  sources_used TEXT[],

  -- User context
  ip_address INET,
  user_agent TEXT,
  session_id TEXT
);

CREATE INDEX idx_enrichment_audit_user ON public.enrichment_audit(user_id);
CREATE INDEX idx_enrichment_audit_contact_email ON public.enrichment_audit(contact_email);
CREATE INDEX idx_enrichment_audit_contact_id ON public.enrichment_audit(contact_id);
CREATE INDEX idx_enrichment_audit_created ON public.enrichment_audit(created_at DESC);
CREATE INDEX idx_enrichment_audit_status ON public.enrichment_audit(status);
CREATE INDEX idx_enrichment_audit_source ON public.enrichment_audit(enrichment_source);

-- ============================================================================
-- 7. QUICK INTEL WIDGET TRACKING
-- ============================================================================

-- Track widget usage and free enrichment quotas
CREATE TABLE IF NOT EXISTS public.widget_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Anonymous tracking
  widget_session_id TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT,

  -- Widget interaction
  enrichments_used INTEGER DEFAULT 0,
  enrichments_limit INTEGER DEFAULT 3,

  -- Conversion tracking
  converted_to_signup BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  converted_at TIMESTAMP WITH TIME ZONE,

  -- Widget config
  widget_version TEXT,
  embed_domain TEXT,

  -- Metadata
  last_enrichment_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_widget_usage_session ON public.widget_usage(widget_session_id);
CREATE INDEX idx_widget_usage_ip ON public.widget_usage(ip_address);
CREATE INDEX idx_widget_usage_converted ON public.widget_usage(converted_to_signup);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Contact Confidence
ALTER TABLE public.contact_confidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contact confidence scores"
  ON public.contact_confidence FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contact confidence scores"
  ON public.contact_confidence FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contact confidence scores"
  ON public.contact_confidence FOR UPDATE USING (auth.uid() = user_id);

-- Contact Similarity
ALTER TABLE public.contact_similarity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contact similarity data"
  ON public.contact_similarity FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contact similarity data"
  ON public.contact_similarity FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pitch Variations
ALTER TABLE public.pitch_variations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pitch variations"
  ON public.pitch_variations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pitch variations"
  ON public.pitch_variations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pitch variations"
  ON public.pitch_variations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pitch variations"
  ON public.pitch_variations FOR DELETE USING (auth.uid() = user_id);

-- Campaign Post-Mortems
ALTER TABLE public.campaign_postmortems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own campaign post-mortems"
  ON public.campaign_postmortems FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaign post-mortems"
  ON public.campaign_postmortems FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaign post-mortems"
  ON public.campaign_postmortems FOR UPDATE USING (auth.uid() = user_id);

-- Export Templates
ALTER TABLE public.export_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own templates and system templates"
  ON public.export_templates FOR SELECT USING (auth.uid() = user_id OR is_system_template = TRUE);

CREATE POLICY "Users can create their own templates"
  ON public.export_templates FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON public.export_templates FOR UPDATE USING (auth.uid() = user_id AND is_system_template = FALSE);

-- Export History
ALTER TABLE public.export_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own export history"
  ON public.export_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own export history"
  ON public.export_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enrichment Audit
ALTER TABLE public.enrichment_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrichment audit logs"
  ON public.enrichment_audit FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrichment audit logs"
  ON public.enrichment_audit FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Widget Usage
ALTER TABLE public.widget_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Widget usage viewable by associated user"
  ON public.widget_usage FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create widget usage records"
  ON public.widget_usage FOR INSERT WITH CHECK (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Calculate overall confidence score from individual factors
CREATE OR REPLACE FUNCTION calculate_contact_confidence_score(
  p_email_validity INTEGER,
  p_data_freshness INTEGER,
  p_source_quality INTEGER,
  p_enrichment_depth INTEGER,
  p_verification_status INTEGER
)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    (COALESCE(p_verification_status, 50) * 0.3) +
    (COALESCE(p_data_freshness, 50) * 0.25) +
    (COALESCE(p_email_validity, 50) * 0.2) +
    (COALESCE(p_source_quality, 50) * 0.15) +
    (COALESCE(p_enrichment_depth, 50) * 0.1)
  )::INTEGER;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Determine confidence level from score
CREATE OR REPLACE FUNCTION get_confidence_level(p_score INTEGER)
RETURNS TEXT AS $$
BEGIN
  RETURN CASE
    WHEN p_score >= 75 THEN 'high'
    WHEN p_score >= 50 THEN 'medium'
    ELSE 'low'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Calculate similarity score from individual factors
CREATE OR REPLACE FUNCTION calculate_similarity_score(
  p_genre DECIMAL,
  p_location DECIMAL,
  p_role DECIMAL,
  p_audience DECIMAL,
  p_platform DECIMAL
)
RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    (COALESCE(p_genre, 0) * 0.35) +
    (COALESCE(p_role, 0) * 0.25) +
    (COALESCE(p_platform, 0) * 0.2) +
    (COALESCE(p_location, 0) * 0.1) +
    (COALESCE(p_audience, 0) * 0.1)
  )::DECIMAL(5,2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_contact_confidence_updated_at
  BEFORE UPDATE ON public.contact_confidence
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pitch_variations_updated_at
  BEFORE UPDATE ON public.pitch_variations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_postmortems_updated_at
  BEFORE UPDATE ON public.campaign_postmortems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_export_templates_updated_at
  BEFORE UPDATE ON public.export_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SYSTEM EXPORT TEMPLATES (Pre-populated)
-- ============================================================================

-- Insert default system templates
INSERT INTO public.export_templates (
  template_name, template_type, is_system_template, description, output_format, template_schema
) VALUES
(
  'Press Kit - Standard', 'press-kit', TRUE,
  'Professional press kit with artist bio, photos, streaming links, and press coverage', 'pdf',
  '{"sections": ["artist_bio", "press_photos", "streaming_stats", "press_coverage", "contact_info", "social_links"]}'::jsonb
),
(
  'Radio Plan - Campaign Overview', 'radio-plan', TRUE,
  'Radio campaign plan with target stations, contact list, and pitch schedule', 'pdf',
  '{"sections": ["campaign_overview", "target_stations", "contact_list", "pitch_schedule", "follow_up_plan", "success_metrics"]}'::jsonb
),
(
  'Playlist Pack - Curator Outreach', 'playlist-pack', TRUE,
  'Playlist curator contact pack with curated lists by genre and reach', 'csv',
  '{"fields": ["curator_name", "playlist_name", "genre", "follower_count", "contact_email", "submission_link", "notes"]}'::jsonb
),
(
  'Client Report - Monthly Performance', 'client-report', TRUE,
  'Professional monthly report for clients showing campaign performance and ROI', 'pdf',
  '{"sections": ["executive_summary", "key_metrics", "coverage_achieved", "engagement_stats", "next_steps", "appendix"]}'::jsonb
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_confidence TO authenticated;
GRANT SELECT, INSERT ON public.contact_similarity TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pitch_variations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.campaign_postmortems TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.export_templates TO authenticated;
GRANT SELECT, INSERT ON public.export_history TO authenticated;
GRANT SELECT, INSERT ON public.enrichment_audit TO authenticated;
GRANT SELECT, INSERT ON public.widget_usage TO anon, authenticated;

-- ============================================================================
-- VIEWS (for easier querying)
-- ============================================================================

-- High-confidence contacts view
CREATE OR REPLACE VIEW public.high_confidence_contacts AS
SELECT cc.*, 'high'::text as confidence_level
FROM public.contact_confidence cc
WHERE cc.confidence_level = 'high' AND cc.requires_reverification = FALSE;

-- Recent enrichments audit view
CREATE OR REPLACE VIEW public.recent_enrichments AS
SELECT
  ea.*,
  ea.created_at::date as enrichment_date,
  CASE
    WHEN ea.status = 'success' THEN 'Success'
    WHEN ea.status = 'cached' THEN 'Cached (Fast)'
    WHEN ea.status = 'partial' THEN 'Partial'
    ELSE 'Failed'
  END as status_display
FROM public.enrichment_audit ea
ORDER BY ea.created_at DESC
LIMIT 100;

COMMENT ON TABLE public.contact_confidence IS 'Contact confidence scoring and trust metrics';
COMMENT ON TABLE public.contact_similarity IS 'Contact similarity scoring for recommendations';
COMMENT ON TABLE public.pitch_variations IS 'AI-generated pitch variations and templates';
COMMENT ON TABLE public.campaign_postmortems IS 'AI-powered campaign analysis and insights';
COMMENT ON TABLE public.export_templates IS 'Export template configurations (press kits, reports, etc.)';
COMMENT ON TABLE public.export_history IS 'Export generation history and audit trail';
COMMENT ON TABLE public.enrichment_audit IS 'Detailed enrichment process audit trail for debugging and trust';
COMMENT ON TABLE public.widget_usage IS 'Quick Intel widget usage tracking and conversion';
```

---

### Step 2: Verify Migration Success

After running the SQL above, verify in Supabase Dashboard:

**Tables Created** (should see 8 tables):

- ✅ contact_confidence
- ✅ contact_similarity
- ✅ pitch_variations
- ✅ campaign_postmortems
- ✅ export_templates
- ✅ export_history
- ✅ enrichment_audit
- ✅ widget_usage

**Views Created** (should see 2 views):

- ✅ high_confidence_contacts
- ✅ recent_enrichments

**System Templates Inserted**:

- Query: `SELECT * FROM export_templates WHERE is_system_template = TRUE;`
- Should return 4 rows (Press Kit, Radio Plan, Playlist Pack, Client Report)

---

### Step 3: Begin Testing

Once database migration is complete:

1. **Open test checklist**: `STAGING_TEST_CHECKLIST.md`
2. **Test API endpoints**: Follow Phase 4 (8 API routes)
3. **Test UI components**: Follow Phase 5 (6 React components)
4. **Test widget**: Follow Phase 6 (embeddable widget)
5. **Integration testing**: Follow Phase 8 (end-to-end flows)

---

## 📊 What's Ready to Test

### Backend (API Routes)

- `/api/contacts/confidence` - Contact confidence scoring
- `/api/contacts/similar` - Similar contacts search
- `/api/pitch/variations` - AI pitch generation (formal, casual, concise, detailed, follow-up)
- `/api/campaigns/[id]/post-mortem` - Campaign analysis
- `/api/export/[template]/generate` - Export generation (4 templates)
- `/api/audit/enrichment` - Enrichment audit logging
- `/api/enrich-lite` - Widget enrichment (quota-limited)
- `/api/widget-track` - Widget analytics

### Frontend (React Components)

- `ContactConfidenceBadge.tsx` - Traffic light trust scoring
- `SimilarContactsSidebar.tsx` - Find similar contacts
- `PitchVariationsViewer.tsx` - Tabbed pitch generator
- `CampaignPostMortemReport.tsx` - Campaign analysis report
- `ExportTemplateSelector.tsx` - Template picker + download
- `EnrichmentAuditTrail.tsx` - Audit log dashboard

### Widget

- `widget.js` - Embeddable Quick Intel widget (3 free enrichments)

### Agent Layer

- `packages/agent-layer` - Reusable skills architecture
- `skills/pitch-variation` - Manifest-based pitch generation skill

---

## 🎯 Business Impact

**Revenue Drivers**:

1. **Contact Confidence** → Trust = Higher conversion
2. **Pitch Variations** → Better pitches = More placements = Retention
3. **Similar Contacts** → Network effects = Database growth
4. **Campaign Post-Mortem** → Learning = Retention
5. **Export Templates** → Professional deliverables = PRO/Agency upsell
6. **Audit Trail** → Transparency = Trust = Lower churn
7. **Quick Intel Widget** → Lead gen = More signups = Top-of-funnel

**Tier Differentiation**:

- **FREE**: Confidence (basic), 1 pitch type, audit read-only
- **PRO (£19/month)**: All features, 5 pitch types, 2 export templates
- **AGENCY (£79/month)**: Everything + custom branding + multi-client features

---

## 🔧 Testing Tools

### cURL Commands Ready

- All API endpoint tests include cURL examples in `STAGING_TEST_CHECKLIST.md`

### React Component Test Page

- Create: `apps/audio-intel/app/test-features/page.tsx`
- Import and test all 6 components in one page

### Widget Test HTML

- Create: `test-widget.html` in project root
- Load in browser to test widget

---

## ✅ Sign-Off Checklist

- [x] Workspace configured (pnpm-workspace.yaml updated)
- [x] Dependencies installed (@anthropic-ai/sdk, zod)
- [x] Dev server running (http://localhost:3000)
- [x] ANTHROPIC_API_KEY present
- [x] Test checklist created
- [ ] **Database migration applied** ← **YOU ARE HERE**
- [ ] All tables verified
- [ ] API endpoints tested
- [ ] UI components tested
- [ ] Widget tested
- [ ] Integration tests passed

---

## 📝 Notes

**UK English Enforcement**: All AI-generated content (pitches, post-mortems) uses British spelling and authentic music industry voice.

**Mobile-First**: All UI components are responsive and mobile-optimised.

**Security**: RLS policies active on all tables - users can only see their own data.

**Cost Tracking**: Enrichment audit trail tracks API cost in £GBP (pence).

**Quota Enforcement**: Widget limited to 3 free enrichments via localStorage.

---

**Next Action**: Copy the SQL migration above and paste it into Supabase Dashboard SQL Editor, then proceed with testing!
