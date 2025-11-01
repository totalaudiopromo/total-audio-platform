// Quick fix script to add activity_date column
// Run with: node apps/tracker/fix-activity-date.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ucncbighzqudaszewjrv.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmNiaWdoenF1ZGFzemV3anJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkxNTYyMSwiZXhwIjoyMDc0NDkxNjIxfQ.jNbVTjvh7uOGINRPXJ6TFQJuNEbOLuOccVm8nqnlgPE'; // Service role key from pitch-generator

const supabase = createClient(supabaseUrl, supabaseKey);

async function addActivityDateColumn() {
  console.log('Adding activity_date column to campaign_activities table...');

  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE campaign_activities
      ADD COLUMN IF NOT EXISTS activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();

      UPDATE campaign_activities
      SET activity_date = COALESCE(submitted_at, created_at)
      WHERE activity_date IS NULL;
    `,
  });

  if (error) {
    console.error('Error:', error);
    console.log('\nTrying alternative approach - using direct SQL...');

    // Alternative: Try using a custom RPC function
    const { error: rpcError } = await supabase.rpc('add_activity_date_column');

    if (rpcError) {
      console.error('RPC Error:', rpcError);
      console.log('\n⚠️  Manual fix required:');
      console.log(
        '1. Go to https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/editor'
      );
      console.log('2. Click SQL Editor');
      console.log('3. Run this SQL:');
      console.log(`
ALTER TABLE campaign_activities
ADD COLUMN IF NOT EXISTS activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();

UPDATE campaign_activities
SET activity_date = COALESCE(submitted_at, created_at)
WHERE activity_date IS NULL;
      `);
      process.exit(1);
    }
  }

  console.log('✅ Successfully added activity_date column!');
  console.log('You can now create campaigns in Tracker.');
}

addActivityDateColumn();
