#!/usr/bin/env node

/**
 * Apply Supabase Migration - Golden Verify + Testing Integration
 * Uses Supabase JS client to execute migration SQL
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SUPABASE_URL = 'https://ucncbighzqudaszewjrv.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmNiaWdoenF1ZGFzemV3anJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkxNTYyMSwiZXhwIjoyMDc0NDkxNjIxfQ.jNbVTjvh7uOGINRPXJ6TFQJuNEbOLuOccVm8nqnlgPE';
const MIGRATION_FILE = join(__dirname, '../supabase/migrations/20251111_golden_verify_integration.sql');

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🚀 Golden Verify + Testing Integration Migration\n');
console.log('Project:', SUPABASE_URL);
console.log('Migration:', MIGRATION_FILE);
console.log('');

// Read migration file
const migrationSQL = readFileSync(MIGRATION_FILE, 'utf8');

// Split SQL into individual statements (rough split by semicolons)
// Note: This is a simplified approach - production migrations should use proper SQL parsing
const statements = migrationSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

// Execute migration
async function executeMigration() {
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    // Skip comments and DO blocks (they need special handling)
    if (statement.startsWith('DO $$') || statement.startsWith('COMMENT ON')) {
      console.log(`⏭️  Skipping statement ${i + 1}: ${statement.substring(0, 50)}...`);
      continue;
    }

    try {
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);

      // Use Supabase's rpc to execute raw SQL
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: statement
      });

      if (error) {
        // Some statements might not work via RPC, try direct query
        console.log(`⚠️  RPC failed, trying direct approach...`);

        // For certain statements like CREATE TABLE, we can use the REST API
        // But this is limited - best to use Supabase Dashboard SQL Editor
        throw error;
      }

      successCount++;
      console.log(`✅ Statement ${i + 1} executed successfully`);

    } catch (error) {
      errorCount++;
      console.error(`❌ Statement ${i + 1} failed:`, error.message);

      // For DDL statements, we need to use the dashboard
      if (statement.includes('CREATE TABLE') || statement.includes('CREATE INDEX') || statement.includes('CREATE POLICY')) {
        console.log('⚠️  DDL statement detected - requires Supabase Dashboard SQL Editor\n');
        break; // Stop here and provide manual instructions
      }
    }
  }

  return { successCount, errorCount };
}

// Verify tables exist using Supabase client
async function verifyTables() {
  console.log('\n🔍 Verifying table creation...\n');

  try {
    // Try to query golden_history table
    const { count: goldenCount, error: goldenError } = await supabase
      .from('golden_history')
      .select('*', { count: 'exact', head: true });

    if (goldenError) {
      console.log('❌ golden_history table not found:', goldenError.message);
    } else {
      console.log(`✅ golden_history table exists (${goldenCount || 0} records)`);
    }

    // Try to query testing_results table
    const { count: testingCount, error: testingError } = await supabase
      .from('testing_results')
      .select('*', { count: 'exact', head: true });

    if (testingError) {
      console.log('❌ testing_results table not found:', testingError.message);
    } else {
      console.log(`✅ testing_results table exists (${testingCount || 0} records)`);
    }

    return !goldenError && !testingError;

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

// Main execution
(async () => {
  try {
    // First, try to verify if tables already exist
    const tablesExist = await verifyTables();

    if (tablesExist) {
      console.log('\n✨ Migration already applied! Tables exist and are accessible.');
      console.log('\n📊 You can now:');
      console.log('1. Query golden_history and testing_results tables');
      console.log('2. Integrate with Command Centre Ops Console');
      console.log('3. View data in Supabase Dashboard: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/editor');
      process.exit(0);
    }

    // If tables don't exist, we need to apply migration via Dashboard
    console.log('\n⚠️  Tables do not exist - migration needs to be applied\n');
    console.log('🔧 MANUAL MIGRATION REQUIRED:\n');
    console.log('Supabase JS client cannot execute DDL statements (CREATE TABLE, etc.)');
    console.log('Please apply migration manually:\n');
    console.log('1. Open Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/sql/new');
    console.log('');
    console.log('2. Copy the entire contents of:');
    console.log('   supabase/migrations/20251111_golden_verify_integration.sql');
    console.log('');
    console.log('3. Paste into SQL Editor and click "Run"');
    console.log('');
    console.log('4. Re-run this script to verify: node scripts/apply-migration.mjs');
    console.log('');

    process.exit(1);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
})();
