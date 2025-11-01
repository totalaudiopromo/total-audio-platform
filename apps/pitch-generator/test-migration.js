const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ucncbighzqudaszewjrv.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmNiaWdoenF1ZGFzemV3anJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkxNTYyMSwiZXhwIjoyMDc0NDkxNjIxfQ.jNbVTjvh7uOGINRPXJ6TFQJuNEbOLuOccVm8nqnlgPE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  console.log('Running migrations...');

  // Migration 1: Add voice profile columns
  console.log('Migration 1: Adding voice profile columns...');
  const { error: migration1Error } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE user_pitch_settings
      ADD COLUMN IF NOT EXISTS voice_background TEXT,
      ADD COLUMN IF NOT EXISTS voice_style TEXT,
      ADD COLUMN IF NOT EXISTS voice_achievements TEXT,
      ADD COLUMN IF NOT EXISTS voice_approach TEXT,
      ADD COLUMN IF NOT EXISTS voice_differentiator TEXT,
      ADD COLUMN IF NOT EXISTS voice_typical_opener TEXT,
      ADD COLUMN IF NOT EXISTS voice_context_notes TEXT,
      ADD COLUMN IF NOT EXISTS voice_profile_completed BOOLEAN DEFAULT false;
    `,
  });

  if (migration1Error) {
    console.error('Migration 1 error:', migration1Error);
  } else {
    console.log('✓ Migration 1 complete');
  }

  // Migration 2: Fix user_id types
  console.log('Migration 2: Fixing user_id types...');
  const { error: migration2Error } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE contacts ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
      ALTER TABLE pitches ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
      ALTER TABLE pitch_templates ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
    `,
  });

  if (migration2Error) {
    console.error('Migration 2 error:', migration2Error);
  } else {
    console.log('✓ Migration 2 complete');
  }

  console.log('All migrations complete!');
}

runMigrations();
