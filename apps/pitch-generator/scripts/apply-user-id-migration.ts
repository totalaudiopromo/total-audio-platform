/**
 * Apply user_id migration directly via Supabase Admin client
 * This changes user_pitch_settings.user_id from UUID to TEXT
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey) as any;

async function applyMigration() {
  console.log('🔧 Applying user_id type migration...\n');

  // Read the migration file
  const migrationPath = path.join(
    __dirname,
    '../supabase/migrations/004_fix_user_pitch_settings_user_id.sql'
  );

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

  console.log('📄 Migration SQL:');
  console.log('---');
  console.log(migrationSQL);
  console.log('---\n');

  try {
    // Execute via raw HTTP request to Supabase's SQL endpoint
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseServiceKey}`,
    };

    if (supabaseServiceKey) {
      headers['apikey'] = supabaseServiceKey;
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: migrationSQL,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    console.log('✅ Migration applied successfully!\n');

    // Verify the change
    console.log('🔍 Verifying column type...');

    const { data, error } = await (supabase as any)
      .from('information_schema.columns')
      .select('column_name, data_type, udt_name')
      .eq('table_name', 'user_pitch_settings')
      .eq('column_name', 'user_id')
      .single();

    if (error) {
      console.error('⚠️  Could not verify column type:', error);
    } else {
      console.log('   Column:', data.column_name);
      console.log('   Type:', data.data_type);
      console.log('   UDT:', data.udt_name);

      if (data.data_type === 'text' || data.udt_name === 'text') {
        console.log('\n✅ SUCCESS: user_id is now TEXT type!');
      } else {
        console.log('\n⚠️  WARNING: user_id is still', data.data_type);
      }
    }
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    console.error('\n📋 Manual steps required:');
    console.error(
      '   1. Go to: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/editor'
    );
    console.error('   2. Click "SQL Editor" in the left sidebar');
    console.error('   3. Click "New query"');
    console.error('   4. Paste and run this SQL:\n');
    console.error('   ALTER TABLE user_pitch_settings');
    console.error('   ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;\n');
    process.exit(1);
  }
}

applyMigration();
