const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/tracker/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Campaigns:', JSON.stringify(data, null, 2));
  }
}

checkCampaigns();
