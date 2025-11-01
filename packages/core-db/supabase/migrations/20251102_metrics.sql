-- Migration: Metrics Schema for Audio Intel Analytics
-- Created: 2025-11-02
-- Purpose: Lightweight event tracking, usage counters, and payment analytics

-- ============================================================
-- 1. EVENTS TABLE
-- ============================================================
-- Tracks user interactions and system events across all apps

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- Event identification
    event_name TEXT NOT NULL,
    event_category TEXT NOT NULL,  -- e.g., 'enrichment', 'payment', 'auth', 'demo'
    app_name TEXT NOT NULL,         -- 'audio-intel', 'tracker', 'pitch-generator'

    -- User context
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,

    -- Event metadata
    properties JSONB DEFAULT '{}'::jsonb,

    -- Performance tracking
    duration_ms INTEGER,

    -- Request context
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,

    -- Success/failure tracking
    status TEXT CHECK (status IN ('success', 'error', 'pending')),
    error_message TEXT,

    -- Indexing for fast queries
    CONSTRAINT events_event_name_check CHECK (char_length(event_name) <= 100),
    CONSTRAINT events_category_check CHECK (char_length(event_category) <= 50)
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_name ON public.events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_category_app ON public.events(event_category, app_name);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status) WHERE status = 'error';

-- GIN index for JSONB properties queries
CREATE INDEX IF NOT EXISTS idx_events_properties ON public.events USING GIN (properties);

-- Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Users can only see their own events
CREATE POLICY "Users can view own events"
    ON public.events FOR SELECT
    USING (auth.uid() = user_id);

-- Service role can insert events (for server-side tracking)
CREATE POLICY "Service role can insert events"
    ON public.events FOR INSERT
    WITH CHECK (true);

-- Admins can view all events
CREATE POLICY "Admins can view all events"
    ON public.events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================
-- 2. USAGE COUNTERS TABLE
-- ============================================================
-- Aggregated usage metrics per user per day

CREATE TABLE IF NOT EXISTS public.usage_counters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- User and time period
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    app_name TEXT NOT NULL,

    -- Counter types (Audio Intel specific)
    enrichments_count INTEGER DEFAULT 0,
    searches_count INTEGER DEFAULT 0,
    exports_count INTEGER DEFAULT 0,

    -- Pitch Generator counters
    pitches_generated INTEGER DEFAULT 0,
    emails_sent INTEGER DEFAULT 0,

    -- Tracker counters
    campaigns_created INTEGER DEFAULT 0,
    contacts_added INTEGER DEFAULT 0,

    -- Engagement metrics
    sessions_count INTEGER DEFAULT 0,
    total_session_duration_ms BIGINT DEFAULT 0,

    -- Prevent duplicate entries per user/date/app
    CONSTRAINT usage_counters_unique UNIQUE (user_id, date, app_name)
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_usage_counters_user_date ON public.usage_counters(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_usage_counters_date ON public.usage_counters(date DESC);
CREATE INDEX IF NOT EXISTS idx_usage_counters_app ON public.usage_counters(app_name);

-- Row Level Security
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

-- Users can view own usage
CREATE POLICY "Users can view own usage"
    ON public.usage_counters FOR SELECT
    USING (auth.uid() = user_id);

-- Service role can upsert counters
CREATE POLICY "Service role can manage usage counters"
    ON public.usage_counters FOR ALL
    USING (true)
    WITH CHECK (true);

-- Admins can view all usage
CREATE POLICY "Admins can view all usage"
    ON public.usage_counters FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================
-- 3. PAYMENTS TABLE
-- ============================================================
-- Track all payment transactions and subscription changes

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- User relationship
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Stripe references
    stripe_payment_id TEXT UNIQUE,
    stripe_subscription_id TEXT,
    stripe_invoice_id TEXT,
    stripe_customer_id TEXT,

    -- Payment details
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'gbp' NOT NULL,
    status TEXT NOT NULL CHECK (status IN (
        'pending',
        'succeeded',
        'failed',
        'refunded',
        'cancelled'
    )),

    -- Payment metadata
    payment_method TEXT,  -- 'card', 'paypal', etc.
    description TEXT,

    -- Subscription details
    plan_name TEXT,       -- 'pro', 'agency', etc.
    billing_period TEXT,  -- 'monthly', 'annual'

    -- Transaction metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Failure tracking
    failure_reason TEXT,
    failure_code TEXT,

    -- Refund tracking
    refunded_at TIMESTAMP WITH TIME ZONE,
    refund_amount_cents INTEGER,
    refund_reason TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_id ON public.payments(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_subscription_id ON public.payments(stripe_subscription_id);

-- Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view own payments
CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    USING (auth.uid() = user_id);

-- Service role can insert/update payments
CREATE POLICY "Service role can manage payments"
    ON public.payments FOR ALL
    USING (true)
    WITH CHECK (true);

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
    ON public.payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================
-- 4. HELPER FUNCTIONS
-- ============================================================

-- Function to increment usage counters
CREATE OR REPLACE FUNCTION public.increment_usage_counter(
    p_user_id UUID,
    p_app_name TEXT,
    p_counter_name TEXT,
    p_increment INTEGER DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.usage_counters (
        user_id,
        date,
        app_name
    )
    VALUES (
        p_user_id,
        CURRENT_DATE,
        p_app_name
    )
    ON CONFLICT (user_id, date, app_name)
    DO UPDATE SET
        enrichments_count = CASE
            WHEN p_counter_name = 'enrichments'
            THEN usage_counters.enrichments_count + p_increment
            ELSE usage_counters.enrichments_count
        END,
        searches_count = CASE
            WHEN p_counter_name = 'searches'
            THEN usage_counters.searches_count + p_increment
            ELSE usage_counters.searches_count
        END,
        exports_count = CASE
            WHEN p_counter_name = 'exports'
            THEN usage_counters.exports_count + p_increment
            ELSE usage_counters.exports_count
        END,
        pitches_generated = CASE
            WHEN p_counter_name = 'pitches'
            THEN usage_counters.pitches_generated + p_increment
            ELSE usage_counters.pitches_generated
        END,
        emails_sent = CASE
            WHEN p_counter_name = 'emails'
            THEN usage_counters.emails_sent + p_increment
            ELSE usage_counters.emails_sent
        END,
        campaigns_created = CASE
            WHEN p_counter_name = 'campaigns'
            THEN usage_counters.campaigns_created + p_increment
            ELSE usage_counters.campaigns_created
        END,
        contacts_added = CASE
            WHEN p_counter_name = 'contacts'
            THEN usage_counters.contacts_added + p_increment
            ELSE usage_counters.contacts_added
        END,
        updated_at = NOW();
END;
$$;

-- Function to get user event summary
CREATE OR REPLACE FUNCTION public.get_user_event_summary(
    p_user_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    event_category TEXT,
    event_count BIGINT,
    success_rate NUMERIC,
    avg_duration_ms NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.event_category,
        COUNT(*) as event_count,
        ROUND(
            (COUNT(*) FILTER (WHERE e.status = 'success')::NUMERIC /
            NULLIF(COUNT(*), 0)::NUMERIC) * 100,
            2
        ) as success_rate,
        ROUND(AVG(e.duration_ms), 2) as avg_duration_ms
    FROM public.events e
    WHERE e.user_id = p_user_id
        AND e.created_at >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY e.event_category
    ORDER BY event_count DESC;
END;
$$;

-- ============================================================
-- 5. UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_usage_counters_updated_at
    BEFORE UPDATE ON public.usage_counters
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================================

COMMENT ON TABLE public.events IS 'User interaction and system event tracking across all apps';
COMMENT ON TABLE public.usage_counters IS 'Aggregated daily usage metrics per user per app';
COMMENT ON TABLE public.payments IS 'Payment transactions and subscription change tracking';

COMMENT ON FUNCTION public.increment_usage_counter IS 'Atomically increment usage counters for a user';
COMMENT ON FUNCTION public.get_user_event_summary IS 'Get event summary statistics for a user over a time period';
