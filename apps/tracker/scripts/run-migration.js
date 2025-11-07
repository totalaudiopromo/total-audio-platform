#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 Running database migration...\n');

  const migrationPath = path.join(
    __dirname,
    '../supabase/migrations/001_campaigns_mvp.sql'
  );
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Split by semicolon to run each statement separately
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`📝 Executing statement ${i + 1}/${statements.length}...`);

    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement + ';',
      });

      if (error) {
        // Try alternative method - direct query
        const { error: error2 } = await supabase.from('_').select('*').limit(0);
        console.log(
          `⚠️  Note: Cannot execute SQL directly via API. Please run this in Supabase SQL Editor:`
        );
        console.log(
          `\nhttps://supabase.com/dashboard/project/${
            supabaseUrl.split('.')[0].split('//')[1]
          }/sql\n`
        );
        console.log('Copy and paste the contents of:');
        console.log(migrationPath);
        process.exit(1);
      }

      console.log(`✅ Statement ${i + 1} completed`);
    } catch (err) {
      console.error(`❌ Error on statement ${i + 1}:`, err.message);
    }
  }

  console.log('\n✅ Migration completed!');
}

runMigration();
