-- Migration: Create tables for 7 new Total Audio Promo features
-- Created: 2025-11-16
-- Purpose: Support Contact Confidence, Similarity, Pitch Variations, Post-Mortems, Audit Trail, Export Templates, Widget

-- =====================================================
-- 1. CONTACT CONFIDENCE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contact_confidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL,
  contact_email TEXT NOT NULL,

  -- Confidence scores (0-100)
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  email_validity_score INTEGER NOT NULL DEFAULT 0,
  data_freshness_score INTEGER NOT NULL DEFAULT 0,
  source_quality_score INTEGER NOT NULL DEFAULT 0,
  enrichment_depth_score INTEGER NOT NULL DEFAULT 0,
  verification_status_score INTEGER NOT NULL DEFAULT 0,

  -- Confidence level classification
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('high', 'medium', 'low')),

  -- Metadata
  requires_reverification BOOLEAN DEFAULT FALSE,
  high_risk_contact BOOLEAN DEFAULT FALSE,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, contact_id)
);

CREATE INDEX idx_contact_confidence_user ON public.contact_confidence(user_id);
CREATE INDEX idx_contact_confidence_level ON public.contact_confidence(confidence_level);
CREATE INDEX idx_contact_confidence_contact ON public.contact_confidence(contact_id);

-- =====================================================
-- 2. CONTACT SIMILARITY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contact_similarity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_contact_id UUID NOT NULL,
  similar_contact_id UUID NOT NULL,

  -- Similarity metrics (0-100)
  overall_similarity_score INTEGER NOT NULL CHECK (overall_similarity_score >= 0 AND overall_similarity_score <= 100),
  genre_similarity INTEGER DEFAULT 0,
  location_similarity INTEGER DEFAULT 0,
  platform_similarity INTEGER DEFAULT 0,
  role_similarity INTEGER DEFAULT 0,
  audience_similarity INTEGER DEFAULT 0,

  -- Explanation
  similarity_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, source_contact_id, similar_contact_id)
);

CREATE INDEX idx_contact_similarity_user ON public.contact_similarity(user_id);
CREATE INDEX idx_contact_similarity_source ON public.contact_similarity(source_contact_id);
CREATE INDEX idx_contact_similarity_score ON public.contact_similarity(overall_similarity_score DESC);

-- =====================================================
-- 3. PITCH VARIATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.pitch_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Variation metadata
  variation_type TEXT NOT NULL CHECK (variation_type IN ('formal', 'casual', 'concise', 'detailed', 'follow-up')),
  subject_line TEXT NOT NULL,
  body TEXT NOT NULL,

  -- Generation info
  generated_by TEXT DEFAULT 'ai',
  generation_model TEXT,

  -- Campaign context
  artist_name TEXT,
  track_title TEXT,
  genre TEXT,
  target_contact_type TEXT CHECK (target_contact_type IN ('radio', 'playlist', 'press', 'blog')),

  -- Usage tracking
  times_used INTEGER DEFAULT 0,
  times_opened INTEGER DEFAULT 0,
  times_replied INTEGER DEFAULT 0,
  effectiveness_score DECIMAL(3,2) DEFAULT 0.00,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pitch_variations_user ON public.pitch_variations(user_id);
CREATE INDEX idx_pitch_variations_type ON public.pitch_variations(variation_type);
CREATE INDEX idx_pitch_variations_artist ON public.pitch_variations(artist_name);
CREATE INDEX idx_pitch_variations_effectiveness ON public.pitch_variations(effectiveness_score DESC);

-- =====================================================
-- 4. CAMPAIGN POST-MORTEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.campaign_postmortems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL,
  campaign_name TEXT NOT NULL,

  -- Analysis content
  executive_summary TEXT,
  key_wins TEXT[], -- Array of wins
  key_learnings TEXT[], -- Array of learnings
  improvement_recommendations TEXT[], -- Array of recommendations

  -- Generation metadata
  generated_by TEXT DEFAULT 'ai',
  generation_model TEXT,
  tokens_used INTEGER,
  generation_time_ms INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, campaign_id)
);

CREATE INDEX idx_campaign_postmortems_user ON public.campaign_postmortems(user_id);
CREATE INDEX idx_campaign_postmortems_campaign ON public.campaign_postmortems(campaign_id);

-- =====================================================
-- 5. ENRICHMENT AUDIT TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.enrichment_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID,
  contact_email TEXT NOT NULL,
  contact_name TEXT,

  -- Enrichment details
  enrichment_source TEXT NOT NULL CHECK (enrichment_source IN ('perplexity', 'claude', 'manual', 'cache')),
  enrichment_status TEXT NOT NULL CHECK (enrichment_status IN ('success', 'partial', 'failed', 'cached', 'rate_limited')),

  -- Performance metrics
  response_time_ms INTEGER,
  api_tokens_used INTEGER,
  api_cost_cents INTEGER, -- Cost in pence/cents

  -- Enriched data snapshot
  fields_enriched TEXT[],
  enrichment_data JSONB,

  -- Error tracking
  error_message TEXT,
  error_code TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enrichment_audit_user ON public.enrichment_audit(user_id);
CREATE INDEX idx_enrichment_audit_contact ON public.enrichment_audit(contact_id);
CREATE INDEX idx_enrichment_audit_source ON public.enrichment_audit(enrichment_source);
CREATE INDEX idx_enrichment_audit_status ON public.enrichment_audit(enrichment_status);
CREATE INDEX idx_enrichment_audit_created ON public.enrichment_audit(created_at DESC);

-- =====================================================
-- 6. EXPORT TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.export_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for system templates

  -- Template metadata
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('press-kit', 'radio-plan', 'playlist-pack', 'client-report', 'custom')),
  template_description TEXT,

  -- Template configuration
  template_schema JSONB NOT NULL, -- Field definitions, layout config
  output_format TEXT[] DEFAULT ARRAY['pdf'], -- Supported formats: pdf, csv, zip, docx, excel

  -- Customisation
  supports_branding BOOLEAN DEFAULT TRUE,
  default_branding JSONB, -- Logo, colors, fonts

  -- Usage tracking
  times_used INTEGER DEFAULT 0,
  is_system_template BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_export_templates_user ON public.export_templates(user_id);
CREATE INDEX idx_export_templates_type ON public.export_templates(template_type);
CREATE INDEX idx_export_templates_system ON public.export_templates(is_system_template);

-- =====================================================
-- 7. WIDGET USAGE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.widget_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_session_id TEXT NOT NULL UNIQUE,

  -- Session metadata
  domain TEXT, -- Where widget is embedded
  referrer TEXT,
  user_agent TEXT,

  -- Usage tracking
  enrichments_used INTEGER DEFAULT 0,
  enrichments_limit INTEGER DEFAULT 3,
  first_enrichment_at TIMESTAMPTZ,
  last_enrichment_at TIMESTAMPTZ,

  -- Conversion tracking
  upgraded_to_paid BOOLEAN DEFAULT FALSE,
  upgraded_at TIMESTAMPTZ,
  converted_user_id UUID REFERENCES auth.users(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX idx_widget_usage_session ON public.widget_usage(widget_session_id);
CREATE INDEX idx_widget_usage_domain ON public.widget_usage(domain);
CREATE INDEX idx_widget_usage_converted ON public.widget_usage(upgraded_to_paid);
CREATE INDEX idx_widget_usage_expires ON public.widget_usage(expires_at);

-- =====================================================
-- POSTGRES FUNCTIONS
-- =====================================================

-- Function: Calculate contact confidence score
CREATE OR REPLACE FUNCTION calculate_contact_confidence_score(
  p_email_validity INTEGER,
  p_data_freshness INTEGER,
  p_source_quality INTEGER,
  p_enrichment_depth INTEGER,
  p_verification_status INTEGER
) RETURNS INTEGER AS $$
BEGIN
  RETURN (
    (p_email_validity * 0.25) +
    (p_data_freshness * 0.20) +
    (p_source_quality * 0.20) +
    (p_enrichment_depth * 0.20) +
    (p_verification_status * 0.15)
  )::INTEGER;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Get confidence level from score
CREATE OR REPLACE FUNCTION get_confidence_level(p_score INTEGER) RETURNS TEXT AS $$
BEGIN
  IF p_score >= 80 THEN
    RETURN 'high';
  ELSIF p_score >= 50 THEN
    RETURN 'medium';
  ELSE
    RETURN 'low';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.contact_confidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_similarity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_postmortems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrichment_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own contact confidence"
  ON public.contact_confidence FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contact confidence"
  ON public.contact_confidence FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contact confidence"
  ON public.contact_confidence FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own contact similarity"
  ON public.contact_similarity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contact similarity"
  ON public.contact_similarity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own pitch variations"
  ON public.pitch_variations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pitch variations"
  ON public.pitch_variations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pitch variations"
  ON public.pitch_variations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own campaign postmortems"
  ON public.campaign_postmortems FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaign postmortems"
  ON public.campaign_postmortems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own enrichment audit"
  ON public.enrichment_audit FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrichment audit"
  ON public.enrichment_audit FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own export templates"
  ON public.export_templates FOR SELECT
  USING (auth.uid() = user_id OR is_system_template = TRUE);

CREATE POLICY "Users can insert own export templates"
  ON public.export_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own export templates"
  ON public.export_templates FOR UPDATE
  USING (auth.uid() = user_id);

-- Widget usage: No RLS (public for embedded widgets)
CREATE POLICY "Public widget usage access"
  ON public.widget_usage FOR ALL
  USING (TRUE);

-- =====================================================
-- GRANTS
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
