#!/usr/bin/env ts-node

/**
 * Usage Monitoring Script - Track Jeremy's Beta Usage
 *
 * Monitors:
 * - Enrichments used vs limit
 * - Subscription status
 * - Beta period remaining
 * - Recent activity
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  dotenv.config({ path: path.join(__dirname, '../apps/audio-intel/.env.local') });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Load from apps/audio-intel if not in root
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  dotenv.config({ path: path.join(__dirname, '../apps/audio-intel/.env.local') });
}

const JEREMY_EMAIL = 'info@streamer.co.uk';

async function monitorSupabaseUsage() {
  console.log('📊 Monitoring Audio Intel Usage (Supabase)...\n');

  if (!SUPABASE_URL) {
    console.error('❌ Supabase URL not found');
    return null;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY || '');

  try {
    // Find user by email
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', JEREMY_EMAIL)
      .limit(1);

    if (userError || !users || users.length === 0) {
      console.warn('⚠️  User not found in Supabase');
      return null;
    }

    const user = users[0];
    const enrichmentsUsed = user.enrichments_used || 0;
    const enrichmentsLimit = user.enrichments_limit || 500;
    const usagePercent = (enrichmentsUsed / enrichmentsLimit) * 100;

    console.log('📈 Usage Statistics:');
    console.log(`   Enrichments Used: ${enrichmentsUsed} / ${enrichmentsLimit}`);
    console.log(`   Usage: ${usagePercent.toFixed(1)}%`);
    console.log(`   Remaining: ${enrichmentsLimit - enrichmentsUsed}`);
    console.log(`   Subscription Tier: ${user.subscription_tier || 'beta'}`);
    console.log(`   Beta Access: ${user.beta_access ? 'Yes' : 'No'}`);

    // Get recent enrichment logs
    const { data: logs, error: logsError } = await supabase
      .from('enrichment_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!logsError && logs && logs.length > 0) {
      console.log('\n📝 Recent Activity:');
      logs.forEach((log: any, index: number) => {
        const date = new Date(log.created_at).toLocaleString();
        console.log(`   ${index + 1}. ${date}: ${log.contacts_count} contacts (${log.status})`);
      });
    }

    // Usage warnings
    if (usagePercent >= 100) {
      console.log('\n🚨 WARNING: Usage limit reached!');
    } else if (usagePercent >= 80) {
      console.log('\n⚠️  WARNING: Approaching usage limit (80%+)');
    }

    return {
      enrichmentsUsed,
      enrichmentsLimit,
      usagePercent,
      subscriptionTier: user.subscription_tier,
      betaAccess: user.beta_access,
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
}

async function monitorBetaPeriod() {
  console.log('\n📅 Monitoring Beta Period...\n');

  if (!SUPABASE_URL) {
    console.warn('⚠️  Supabase URL not found');
    return null;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY || '');

  try {
    // Check if there's a subscription or beta period tracking in Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', JEREMY_EMAIL)
      .single();

    if (userError || !user) {
      console.warn('⚠️  User not found in Supabase');
      return null;
    }

    // Check created_at for beta period calculation (60 days from signup)
    const createdAt = new Date(user.created_at);
    const betaEndDate = new Date(createdAt);
    betaEndDate.setDate(betaEndDate.getDate() + 60); // 60-day beta period

    const now = new Date();
    const daysRemaining = Math.ceil(
      (betaEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    console.log('📅 Beta Period Details:');
    console.log(`   Signup Date: ${createdAt.toLocaleDateString()}`);
    console.log(`   Beta End Date: ${betaEndDate.toLocaleDateString()}`);
    console.log(`   Days Remaining: ${daysRemaining}`);

    if (daysRemaining <= 0) {
      console.log('\n🚨 WARNING: Beta period has expired!');
    } else if (daysRemaining <= 7) {
      console.log('\n⚠️  WARNING: Beta period ending soon!');
    }

    return {
      signupDate: createdAt,
      betaEndDate,
      daysRemaining,
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
}

async function runMonitoring() {
  console.log("📊 Jeremy's Beta Usage Monitor\n");
  console.log('='.repeat(50));
  console.log(`Email: ${JEREMY_EMAIL}`);
  console.log(`Date: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50) + '\n');

  const supabaseUsage = await monitorSupabaseUsage();
  const betaPeriod = await monitorBetaPeriod();

  console.log('\n' + '='.repeat(50));
  console.log('📋 Summary');
  console.log('='.repeat(50));

  if (supabaseUsage) {
    console.log(`Enrichments: ${supabaseUsage.enrichmentsUsed}/${supabaseUsage.enrichmentsLimit}`);
  }

  if (betaPeriod) {
    console.log(`Beta Period: ${betaPeriod.daysRemaining} days remaining`);
  }
}

if (require.main === module) {
  runMonitoring()
    .then(() => {
      console.log('\n✅ Monitoring complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Monitoring failed:', error);
      process.exit(1);
    });
}

export { monitorSupabaseUsage, monitorBetaPeriod };
