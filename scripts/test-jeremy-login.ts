#!/usr/bin/env ts-node

/**
 * Test Login Script - Verify Jeremy can log in to Supabase
 *
 * Tests Supabase authentication (used by all apps):
 * - Audio Intel
 * - Campaign Tracker
 * - Pitch Generator
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
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const JEREMY_EMAIL = 'info@streamer.co.uk';
const JEREMY_PASSWORD = 'Streamer2024!BetaAccess';

async function testSupabaseLogin() {
  console.log('🔐 Testing Supabase Login (Audio Intel)...\n');

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Supabase credentials not found');
    return false;
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: JEREMY_EMAIL,
      password: JEREMY_PASSWORD,
    });

    if (error) {
      console.error(`❌ Login failed: ${error.message}`);
      return false;
    }

    if (!data.user) {
      console.error('❌ No user data returned');
      return false;
    }

    console.log('✅ Supabase login successful!');
    console.log(`   User ID: ${data.user.id}`);
    console.log(`   Email: ${data.user.email}`);
    console.log(`   Email Confirmed: ${data.user.email_confirmed_at ? 'Yes' : 'No'}`);

    // Check user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.warn(`   ⚠️  Profile check failed: ${profileError.message}`);
    } else if (profile) {
      console.log(`   Enrichments Used: ${profile.enrichments_used || 0}`);
      console.log(`   Enrichments Limit: ${profile.enrichments_limit || 500}`);
      console.log(`   Subscription Tier: ${profile.subscription_tier || 'beta'}`);
      console.log(`   Beta Access: ${profile.beta_access ? 'Yes' : 'No'}`);
    }

    return true;
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

async function testAllAppsAccess() {
  console.log('\n🔐 Testing Access Across All Apps...\n');

  const apps = [
    { name: 'Audio Intel', url: 'https://intel.totalaudiopromo.com' },
    { name: 'Campaign Tracker', url: 'https://tracker.totalaudiopromo.com' },
    { name: 'Pitch Generator', url: 'https://pitch.totalaudiopromo.com' },
  ];

  let allAccessible = true;

  for (const app of apps) {
    try {
      const response = await fetch(`${app.url}/signin`, {
        method: 'HEAD',
        redirect: 'follow',
      });

      if (response.ok || response.status === 200) {
        console.log(`✅ ${app.name}: Accessible`);
      } else {
        console.log(`⚠️  ${app.name}: Status ${response.status}`);
        allAccessible = false;
      }
    } catch (error) {
      console.log(`❌ ${app.name}: ${error instanceof Error ? error.message : 'Not accessible'}`);
      allAccessible = false;
    }
  }

  return allAccessible;
}

async function runTests() {
  console.log("🧪 Testing Jeremy's Login Access\n");
  console.log('='.repeat(50));
  console.log(`Email: ${JEREMY_EMAIL}`);
  console.log('='.repeat(50) + '\n');

  const supabaseResult = await testSupabaseLogin();
  const appsResult = await testAllAppsAccess();

  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(50));
  console.log(`Supabase Authentication: ${supabaseResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`All Apps Accessible: ${appsResult ? '✅ PASS' : '⚠️  SOME ISSUES'}`);

  if (supabaseResult) {
    console.log('\n🎉 Supabase authentication works! Jeremy can log in to all apps.');
    return 0;
  } else {
    console.log('\n⚠️  Authentication test failed. Check the errors above.');
    return 1;
  }
}

if (require.main === module) {
  runTests()
    .then(exitCode => process.exit(exitCode))
    .catch(error => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}

export { testSupabaseLogin, testAllAppsAccess };
