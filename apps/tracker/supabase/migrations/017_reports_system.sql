-- Campaign Reports & Branding System
-- Automated PDF generation with agency branding

-- Report Templates (Agency Branding)
CREATE TABLE IF NOT EXISTS report_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    logo_url TEXT,
    brand_color TEXT DEFAULT '#6366f1',
    company_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_report_templates_user ON report_templates(user_id);

ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own report templates"
    ON report_templates FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Generated Campaign Reports
CREATE TABLE IF NOT EXISTS campaign_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES report_templates(id) ON DELETE SET NULL,
    report_type TEXT NOT NULL, -- 'weekly', 'monthly', 'custom', 'final'
    start_date DATE,
    end_date DATE,
    pdf_url TEXT,
    pdf_filename TEXT,
    executive_summary TEXT, -- AI-generated summary
    sent_to TEXT[], -- email addresses
    integration_syncs JSONB DEFAULT '{}', -- {google_drive: {file_id, url}, gmail: {message_id}, airtable: {record_id}}
    metadata JSONB DEFAULT '{}', -- report data snapshot
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaign_reports_campaign ON campaign_reports(campaign_id);
CREATE INDEX idx_campaign_reports_user ON campaign_reports(user_id);
CREATE INDEX idx_campaign_reports_created ON campaign_reports(created_at DESC);

ALTER TABLE campaign_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own campaign reports"
    ON campaign_reports FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Report Sends Tracking (for email history)
CREATE TABLE IF NOT EXISTS report_sends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES campaign_reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    sent_via TEXT NOT NULL, -- 'gmail', 'smtp', 'manual'
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_report_sends_report ON report_sends(report_id);
CREATE INDEX idx_report_sends_user ON report_sends(user_id);

ALTER TABLE report_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own report sends"
    ON report_sends FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own report sends"
    ON report_sends FOR INSERT
    WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE report_templates IS 'Agency branding templates for PDF reports';
COMMENT ON TABLE campaign_reports IS 'Generated campaign reports with PDF storage and integration syncs';
COMMENT ON TABLE report_sends IS 'Tracking of report emails sent to clients';
COMMENT ON COLUMN campaign_reports.integration_syncs IS 'JSON tracking where report was synced: Google Drive, Gmail, Airtable';
COMMENT ON COLUMN campaign_reports.executive_summary IS 'AI-generated executive summary using Claude API';
