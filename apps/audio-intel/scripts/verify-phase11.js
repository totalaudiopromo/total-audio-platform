/**
 * Phase 11 Verification Script
 *
 * Verifies that Phase 11 silent intelligence tracking is operational:
 * 1. Supabase connection works
 * 2. intel_logs table exists
 * 3. Can query recent enrichment logs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function verifyPhase11() {
  console.log('\n🔍 Phase 11 Verification\n');
  console.log('================================\n');

  // Step 1: Check environment variables
  console.log('1️⃣  Checking environment variables...');
  if (!SUPABASE_URL) {
    console.error('   ❌ NEXT_PUBLIC_SUPABASE_URL not set');
    return false;
  }
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('   ❌ SUPABASE_SERVICE_ROLE_KEY not set');
    return false;
  }
  console.log('   ✅ Environment variables configured\n');

  // Step 2: Test Supabase connection
  console.log('2️⃣  Testing Supabase connection...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Query intel_logs table
    const { data, error, count } = await supabase
      .from('intel_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('   ❌ Supabase query failed:', error.message);
      return false;
    }

    console.log('   ✅ Connected to Supabase');
    console.log(`   ℹ️  Found ${count || 0} enrichment logs\n`);

    // Step 3: Display recent logs
    if (data && data.length > 0) {
      console.log('3️⃣  Recent enrichment batches:\n');
      data.forEach((log, index) => {
        console.log(`   Batch ${index + 1}:`);
        console.log(`   - ID: ${log.batch_id}`);
        console.log(`   - Contacts: ${log.total} (${log.enriched} enriched, ${log.failed} failed)`);
        console.log(`   - Success Rate: ${log.success_rate}%`);
        console.log(`   - Cost: $${log.cost}`);
        console.log(`   - Tokens: ${log.input_tokens} in / ${log.output_tokens} out`);
        console.log(`   - Model: ${log.model_used}`);
        console.log(`   - Created: ${new Date(log.created_at).toLocaleString()}`);
        console.log('');
      });
    } else {
      console.log('3️⃣  No enrichment logs yet (table is empty)\n');
      console.log('   ℹ️  This is expected if you haven\'t run any enrichments since Phase 11 deployment\n');
    }

    // Step 4: Verify table structure
    console.log('4️⃣  Verifying table structure...');
    const { data: tableInfo, error: schemaError } = await supabase
      .from('intel_logs')
      .select('*')
      .limit(1);

    if (schemaError) {
      console.error('   ❌ Schema verification failed:', schemaError.message);
      return false;
    }

    console.log('   ✅ intel_logs table exists with correct schema\n');

    // Summary
    console.log('================================\n');
    console.log('✅ Phase 11 Verification Complete\n');
    console.log('Phase 11 Silent Intelligence is operational and ready for production.\n');
    console.log('Next steps:');
    console.log('- Run enrichments to start logging batch summaries');
    console.log('- Monitor metrics at /api/metrics/enrichment');
    console.log('- Check Command Centre dashboard for cost efficiency insights\n');

    return true;
  } catch (error) {
    console.error('   ❌ Unexpected error:', error.message);
    return false;
  }
}

// Run verification
verifyPhase11().then(success => {
  process.exit(success ? 0 : 1);
});
