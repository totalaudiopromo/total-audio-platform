const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/tracker/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createCampaign() {
  // Get user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error('Not authenticated:', userError);
    return;
  }

  console.log('User ID:', user.id);
  console.log('Creating KYARA campaign...\n');

  const campaign = {
    user_id: user.id,
    name: 'KYARA - Bloodshot',
    platform: 'radio',
    genre: 'electronic',
    status: 'active',
    start_date: '2025-10-01',
    end_date: '2025-11-14',
    budget: 2500,
    target_reach: 50,
    actual_reach: 3,
    notes: `Real Liberty Music PR campaign for KYARA "Bloodshot"
    
Release: Monday 14th October 2025
Genre: Electro-pop (The Weeknd, Madison Beer vibes)

Current Stats:
- 85 plays across 9 countries (WARM report)
- Amazing Radio (UK) confirmed support
- Sydney-based artist with Triple J history

Key Contacts:
- Anika Luna (Triple J Home & Hosed)
- Claire Mooney (Triple J Music Director)  
- Danny Howard (BBC Radio 1)
- Pete Tong (BBC Radio 1)

Campaign for Friday demo with Dan from Liberty Music PR.`
  };

  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaign)
    .select();

  if (error) {
    console.error('Error creating campaign:', error);
  } else {
    console.log('✅ Campaign created successfully!');
    console.log('Campaign ID:', data[0].id);
    console.log('\nNow run: node tools/agents/campaigns/kyara/add-activities.js');
  }
}

createCampaign();
