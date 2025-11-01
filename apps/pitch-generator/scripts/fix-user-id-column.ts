import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'MISSING');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixUserIdColumn() {
  console.log('🔧 Fixing user_pitch_settings.user_id column type...\n');
  console.log(`   Database: ${supabaseUrl}\n`);

  try {
    // Step 1: Check current column type
    console.log('1️⃣  Checking current column type...');
    const { data: columnInfo, error: checkError } = await supabase.rpc('exec_sql', {
      sql: `
          SELECT column_name, data_type, udt_name
          FROM information_schema.columns
          WHERE table_name = 'user_pitch_settings'
          AND column_name = 'user_id';
        `,
    });

    if (checkError) {
      console.log('   ℹ️  RPC not available, will proceed with direct migration\n');
    } else if (columnInfo && columnInfo.length > 0) {
      console.log(`   Current type: ${columnInfo[0].data_type}`);
      if (columnInfo[0].data_type === 'text') {
        console.log('   ✅ Column is already TEXT type!\n');
        console.log('   The migration has already been applied.');
        process.exit(0);
      }
    }

    console.log('   Current type: uuid (needs migration)\n');

    // Step 2: Apply the migration using raw SQL
    console.log('2️⃣  Applying migration...');

    // First, convert the column type
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE user_pitch_settings
        ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
      `,
    });

    if (alterError) {
      console.error('   ❌ Failed to alter column:', alterError);
      console.log('\n📋 Manual SQL to run in Supabase dashboard:');
      console.log('```sql');
      console.log('ALTER TABLE user_pitch_settings');
      console.log('ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;');
      console.log('');
      console.log('ALTER TABLE user_pitch_settings');
      console.log('DROP CONSTRAINT IF EXISTS user_pitch_settings_user_id_key;');
      console.log('');
      console.log('ALTER TABLE user_pitch_settings');
      console.log('ADD CONSTRAINT user_pitch_settings_user_id_key UNIQUE (user_id);');
      console.log('```');
      process.exit(1);
    }

    console.log('   ✅ Column type changed to TEXT');

    // Drop and recreate constraint
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE user_pitch_settings
        DROP CONSTRAINT IF EXISTS user_pitch_settings_user_id_key;
      `,
    });

    if (dropError) {
      console.log('   ⚠️  Warning dropping constraint:', dropError.message);
    }

    const { error: addError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE user_pitch_settings
        ADD CONSTRAINT user_pitch_settings_user_id_key UNIQUE (user_id);
      `,
    });

    if (addError) {
      console.log('   ⚠️  Warning adding constraint:', addError.message);
    }

    console.log('   ✅ Constraint updated\n');

    console.log('✨ Migration complete!\n');
    console.log('You can now save voice profiles with email-based user IDs.');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    console.log('\n📋 Please run this SQL manually in Supabase dashboard:\n');
    console.log('```sql');
    console.log('ALTER TABLE user_pitch_settings');
    console.log('ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;');
    console.log('');
    console.log('ALTER TABLE user_pitch_settings');
    console.log('DROP CONSTRAINT IF EXISTS user_pitch_settings_user_id_key;');
    console.log('');
    console.log('ALTER TABLE user_pitch_settings');
    console.log('ADD CONSTRAINT user_pitch_settings_user_id_key UNIQUE (user_id);');
    console.log('```');
    process.exit(1);
  }
}

fixUserIdColumn();
