#!/usr/bin/env tsx
/**
 * Verify Skills System Setup
 * Check if skills tables exist and test the system
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

async function verify() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('   Checked: SUPABASE_URL, NEXT_PUBLIC_SUPABASE_URL');
    console.error('   Checked: SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY');
    process.exit(1);
  }

  console.log('🔧 Connecting to Supabase...');
  console.log(`   URL: ${supabaseUrl.substring(0, 40)}...`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('\n📊 Checking Skills System Tables...\n');

  const tables = [
    { name: 'skill', description: 'Skills registry' },
    { name: 'skill_version', description: 'Skill versions' },
    { name: 'skill_binding', description: 'Org/user bindings' },
    { name: 'skill_invocation', description: 'Execution audit trail' },
  ];

  let allExist = true;

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${table.name.padEnd(20)} - ${table.description}`);
        console.log(`   Error: ${error.message}`);
        allExist = false;
      } else {
        console.log(`✅ ${table.name.padEnd(20)} - ${table.description} (${count || 0} rows)`);
      }
    } catch (err) {
      console.log(`❌ ${table.name.padEnd(20)} - ${table.description}`);
      console.log(`   Error: ${err.message}`);
      allExist = false;
    }
  }

  if (!allExist) {
    console.log('\n⚠️  Some tables are missing.');
    console.log('   Run the migration SQL manually in Supabase dashboard:');
    console.log('   https://supabase.com/dashboard/project/_/sql');
    console.log('   Or copy from: supabase/migrations/20251017000001_skills_system.sql');
    process.exit(1);
  }

  console.log('\n✅ All skills tables exist!');
  console.log('   Skills system is ready to use.');
}

verify().catch(console.error);
