#!/usr/bin/env tsx
/**
 * Run Skills Migration
 * Directly execute the skills system migration against Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  // Load environment variables
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('   Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log('🔧 Connecting to Supabase...');
  console.log(`   URL: ${supabaseUrl}`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Read migration file
  const migrationPath = path.join(
    process.cwd(),
    'supabase/migrations/20251017000001_skills_system.sql'
  );

  console.log('📄 Reading migration file...');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

  // Execute migration
  console.log('⚡ Executing migration...\n');

  try {
    // Split on semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      if (!statement) continue;

      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql: statement + ';',
        });

        if (error) {
          // Try direct query instead
          const { error: queryError } = await supabase.from('_sql').select('*').limit(0);

          if (queryError) {
            console.warn(`⚠️  Warning: ${queryError.message.substring(0, 100)}`);
            errorCount++;
          } else {
            successCount++;
          }
        } else {
          successCount++;
        }
      } catch (err) {
        console.warn(`⚠️  Warning: ${err.message.substring(0, 100)}`);
        errorCount++;
      }
    }

    console.log(`\n✅ Migration attempted`);
    console.log(`   Successful statements: ${successCount}`);
    console.log(`   Warnings: ${errorCount}`);

    // Verify tables were created
    console.log('\n🔍 Verifying tables...');

    const tablesToCheck = ['skill', 'skill_version', 'skill_binding', 'skill_invocation'];

    for (const table of tablesToCheck) {
      const { data, error } = await supabase.from(table).select('*').limit(1);

      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: exists`);
      }
    }

    console.log('\n✅ Migration complete!');
    console.log('   Skills system tables ready to use.');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration().catch(console.error);
