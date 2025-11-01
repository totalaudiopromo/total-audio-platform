/**
 * Revenue Audit Script
 * Generates comprehensive revenue validation report
 *
 * Usage:
 *   npx tsx scripts/revenue-audit.ts
 *   npx tsx scripts/revenue-audit.ts --month 2025-11
 *   npx tsx scripts/revenue-audit.ts --output reports/revenue/2025-11.md
 */

import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// ... rest of the implementation from before
