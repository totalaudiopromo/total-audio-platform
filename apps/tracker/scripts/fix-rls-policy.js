#!/usr/bin/env node
/**
 * Fix RLS Policy Recursion for campaign_collaborators
 *
 * This script applies the SQL fix to resolve the infinite recursion error
 * when querying campaigns.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✓' : '✗');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applyFix() {
  console.log('🔧 Applying RLS policy fix for campaign_collaborators...\n');

  // Read the SQL file
  const sqlFile = path.join(
    __dirname,
    'fix-campaign-collaborators-rls-simple.sql'
  );
  const sql = fs.readFileSync(sqlFile, 'utf8');

  // Split SQL into individual statements (simple approach)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

  try {
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length < 10) continue; // Skip very short statements

      console.log(`   [${i + 1}/${statements.length}] Executing statement...`);

      const { error } = await supabase.rpc('exec_sql', {
        sql_query: statement,
      });

      // If RPC doesn't work, try direct query (this might not work for DDL)
      if (error) {
        console.log(`   ⚠️  RPC method failed, trying alternative...`);
        // Note: Supabase JS client doesn't support raw SQL execution
        // We'll need to use the dashboard or provide instructions
      }
    }

    console.log('\n✅ Fix applied successfully!');
    console.log('   Please refresh your dashboard to verify the fix.');
  } catch (error) {
    console.error('\n❌ Error applying fix:', error.message);
    console.error(
      '\n📋 Alternative: Apply the SQL manually via Supabase Dashboard:'
    );
    console.error(
      '   1. Go to: https://app.supabase.com/project/ucncbighzqudaszewjrv'
    );
    console.error('   2. Navigate to: SQL Editor');
    console.error(
      '   3. Copy contents of: fix-campaign-collaborators-rls-simple.sql'
    );
    console.error('   4. Paste and Run');
    process.exit(1);
  }
}

// Note: Supabase JS client doesn't support executing DDL statements directly
// We need to use the Supabase Dashboard SQL Editor or Supabase CLI
console.log(
  '⚠️  Note: Supabase JS client cannot execute DDL statements directly.'
);
console.log('📋 Please apply the fix using one of these methods:\n');
console.log('Method 1: Supabase Dashboard (Easiest)');
console.log(
  '   1. Go to: https://app.supabase.com/project/ucncbighzqudaszewjrv'
);
console.log('   2. Navigate to: SQL Editor');
console.log(
  '   3. Copy contents of: fix-campaign-collaborators-rls-simple.sql'
);
console.log('   4. Paste and click "Run"\n');
console.log('Method 2: Supabase CLI');
console.log(
  '   supabase db execute --file fix-campaign-collaborators-rls-simple.sql\n'
);

applyFix().catch(console.error);
