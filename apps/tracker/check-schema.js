#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  console.log('🔍 Checking database schema...\n');

  const tables = ['campaigns', 'campaign_contacts', 'campaign_activities', 'campaign_metrics', 'warm_reports'];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.log(`❌ Table "${table}" does not exist`);
      } else {
        console.log(`⚠️  Table "${table}": ${error.message}`);
      }
    } else {
      console.log(`✅ Table "${table}" exists (${data?.length || 0} sample rows)`);
    }
  }

  console.log('\n📝 If tables are missing, apply the migration:');
  console.log('https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/sql/new');
}

checkSchema().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
