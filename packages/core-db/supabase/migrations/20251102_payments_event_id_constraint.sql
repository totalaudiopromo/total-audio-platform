-- Migration: Add event_id unique constraint to payments table
-- Purpose: Enable idempotent Stripe webhook ingestion
-- Date: 2025-11-02

-- Add event_id column if it doesn't exist (it should from 20251102_metrics.sql)
-- This is a safety check in case migrations run out of order
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'payments'
        AND column_name = 'event_id'
    ) THEN
        ALTER TABLE public.payments
        ADD COLUMN event_id TEXT;
    END IF;
END $$;

-- Add unique constraint on event_id to prevent duplicate webhook processing
-- This ensures idempotency: same Stripe event won't create duplicate payment records
ALTER TABLE public.payments
ADD CONSTRAINT payments_event_id_unique UNIQUE (event_id);

-- Create index for faster lookups by event_id
CREATE INDEX IF NOT EXISTS idx_payments_event_id ON public.payments (event_id);

-- Add comment explaining the constraint
COMMENT ON CONSTRAINT payments_event_id_unique ON public.payments IS
'Ensures idempotent Stripe webhook processing - prevents duplicate payment records from the same webhook event';

COMMENT ON COLUMN public.payments.event_id IS
'Stripe webhook event ID for idempotent processing. Each Stripe event can only create one payment record.';
