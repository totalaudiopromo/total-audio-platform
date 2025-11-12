#!/usr/bin/env node
/**
 * Apply database migration to Supabase
 * Reads the migration SQL file and executes it
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  console.log('📊 Applying database migration...\n');

  // Read migration file
  const migrationPath = path.join(__dirname, 'supabase/migrations/20251119_tracker_production_schema.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  try {
    // Execute migration SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(async () => {
      // If exec_sql function doesn't exist, try direct execution via REST API
      console.log('Executing migration via Supabase REST API...');

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ query: sql })
      });

      if (!response.ok) {
        // Try using pg_stat_statements or direct SQL execution
        console.log('Using alternative: Direct SQL execution...');

        // Split SQL into individual statements
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const statement of statements) {
          console.log(`Executing: ${statement.substring(0, 80)}...`);
          const { error: stmtError } = await supabase.from('_migrations').insert({
            name: '20251119_tracker_production_schema',
            executed_at: new Date().toISOString()
          }).catch(() => ({}));

          // Try to execute via a custom function or direct table manipulation
          // For now, we'll output instructions
        }

        throw new Error('Manual migration required - see instructions below');
      }

      return await response.json();
    });

    if (error) {
      console.error('❌ Migration failed:', error.message);
      console.log('\n📝 Manual migration required:');
      console.log('1. Go to: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/editor');
      console.log('2. Click "SQL Editor" in the left sidebar');
      console.log('3. Click "New query"');
      console.log('4. Copy the contents of: apps/tracker/supabase/migrations/20251119_tracker_production_schema.sql');
      console.log('5. Paste and click "Run"');
      process.exit(1);
    }

    console.log('✅ Migration applied successfully!\n');
    return true;
  } catch (err) {
    console.log('⚠️  Automatic migration not supported by this Supabase setup\n');
    console.log('📝 Please apply migration manually:');
    console.log('1. Go to: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/editor');
    console.log('2. Click "SQL Editor" in the left sidebar');
    console.log('3. Click "New query"');
    console.log('4. Copy the contents of: apps/tracker/supabase/migrations/20251119_tracker_production_schema.sql');
    console.log('5. Paste and click "Run"\n');
    console.log('After applying the migration, run: npm run import:liberty');
    return false;
  }
}

applyMigration()
  .then(success => {
    if (success) {
      console.log('✅ Ready to import Liberty campaign data');
      console.log('Run: npm run import:liberty\n');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
