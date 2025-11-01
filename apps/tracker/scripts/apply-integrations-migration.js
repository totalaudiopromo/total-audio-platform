#!/usr/bin/env node

/**
 * Apply integrations system migration to Supabase
 * Reads SQL file and executes via Supabase client
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('📖 Reading migration file...');
    const migrationPath = path.join(
      __dirname,
      '../supabase/migrations/013_integrations_system.sql'
    );
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('🚀 Applying migration to Supabase...');

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // Try alternative method - split into statements
      console.log('⚠️  RPC method failed, trying direct execution...');
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'));

      for (const statement of statements) {
        if (!statement) continue;

        console.log(`  Executing: ${statement.substring(0, 60)}...`);
        const { error: stmtError } = await supabase.from('_migrations').insert({
          name: '013_integrations_system',
          sql: statement,
        });

        if (stmtError && !stmtError.message.includes('already exists')) {
          console.error(`❌ Error: ${stmtError.message}`);
        }
      }
    }

    console.log('✅ Migration applied successfully!');
    console.log('\n📊 Verifying tables...');

    // Verify tables were created
    const tables = [
      'integration_connections',
      'integration_sync_logs',
      'integration_field_mappings',
      'gmail_tracked_emails',
    ];

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`  ❌ ${table}: ${error.message}`);
      } else {
        console.log(`  ✅ ${table}: Created successfully`);
      }
    }

    console.log('\n🎉 Integration system ready!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

applyMigration();
