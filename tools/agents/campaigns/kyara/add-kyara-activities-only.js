#!/usr/bin/env node

/**
 * Add 6 Timeline Activities to Existing KYARA Campaign
 * Quick script to populate the timeline for Friday demo with Dan
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../../apps/tracker/.env.local') });

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ucncbighzqudaszewjrv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE key not found');
  console.log('   Set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 6 KYARA Campaign Activities for Timeline
const ACTIVITIES = [
  {
    activity_type: 'email_sent',
    description: 'Initial pitch wave sent to 15 Australian radio contacts',
    activity_date: '2025-10-07',
    metadata: {
      contacts: 15,
      region: 'Australia',
      targets: ['Triple J', 'Triple R', 'PBS FM', 'KIIS', 'FBi Radio']
    }
  },
  {
    activity_type: 'email_sent',
    description: '5 Gmail drafts auto-created for Australian radio (Liberty inbox)',
    activity_date: '2025-10-08',
    metadata: {
      tool: 'Gmail API',
      drafts: 5,
      contacts: ['Anika Luna', 'Claire Mooney', 'Simon Winkler', 'Firas', 'KIIS Music Team']
    }
  },
  {
    activity_type: 'response',
    description: 'Amazing Radio (UK) confirmed support for "Bloodshot"',
    activity_date: '2025-10-09',
    metadata: {
      station: 'Amazing Radio',
      region: 'UK',
      status: 'CONFIRMED ADD'
    }
  },
  {
    activity_type: 'milestone',
    description: 'WARM report: 85 plays across 9 countries (pre-release)',
    activity_date: '2025-10-10',
    metadata: {
      plays: 85,
      countries: 9,
      stations: 12,
      source: 'WARM API'
    }
  },
  {
    activity_type: 'email_sent',
    description: 'Mailchimp campaign sent to UK electronic specialist contacts',
    activity_date: '2025-10-10',
    metadata: {
      tool: 'Mailchimp',
      recipients: 20,
      region: 'UK',
      targets: ['BBC Radio 1', 'BBC 6 Music', 'Community Radio']
    }
  },
  {
    activity_type: 'scheduled',
    description: 'Release day email blast prepared (Monday 14th Oct, 7am AEST)',
    activity_date: '2025-10-11',
    metadata: {
      scheduled_for: '2025-10-14T07:00:00+10:00',
      recipients: 30,
      type: 'Release day announcement',
      regions: ['Australia', 'UK']
    }
  }
];

async function addActivitiesToKyaraCampaign() {
  console.log('🎵 Adding 6 Timeline Activities to KYARA Campaign\n');

  try {
    // Step 1: Find KYARA campaign
    console.log('🔍 Looking for KYARA campaign...');
    const { data: campaigns, error: findError } = await supabase
      .from('campaigns')
      .select('id, name, user_id')
      .ilike('name', '%KYARA%')
      .order('created_at', { ascending: false })
      .limit(1);

    if (findError) {
      console.error('❌ Error finding campaign:', findError.message);
      return;
    }

    if (!campaigns || campaigns.length === 0) {
      console.error('❌ No KYARA campaign found');
      console.log('   Create the campaign first at tracker.totalaudiopromo.com');
      return;
    }

    const campaign = campaigns[0];
    console.log(`✅ Found campaign: "${campaign.name}" (ID: ${campaign.id})\n`);

    // Step 2: Check if activities already exist
    const { data: existingActivities, error: checkError } = await supabase
      .from('campaign_activities')
      .select('id')
      .eq('campaign_id', campaign.id);

    if (checkError) {
      console.error('❌ Error checking activities:', checkError.message);
      return;
    }

    if (existingActivities && existingActivities.length > 0) {
      console.log(`⚠️  Campaign already has ${existingActivities.length} activities`);
      console.log('   Deleting existing activities first...\n');
      
      const { error: deleteError } = await supabase
        .from('campaign_activities')
        .delete()
        .eq('campaign_id', campaign.id);

      if (deleteError) {
        console.error('❌ Error deleting old activities:', deleteError.message);
        return;
      }
    }

    // Step 3: Add the 6 activities
    console.log('📅 Adding 6 timeline activities...\n');

    for (const activity of ACTIVITIES) {
      const activityData = {
        campaign_id: campaign.id,
        user_id: campaign.user_id,
        activity_type: activity.activity_type,
        description: activity.description,
        activity_date: activity.activity_date,
        metadata: activity.metadata,
        created_at: new Date(activity.activity_date).toISOString(),
      };

      const { error: insertError } = await supabase
        .from('campaign_activities')
        .insert([activityData]);

      if (insertError) {
        console.log(`   ⚠️  Failed: ${activity.description}`);
        console.log(`      Error: ${insertError.message}`);
      } else {
        console.log(`   ✅ ${activity.activity_date} - ${activity.description}`);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n🎉 All 6 Activities Added!\n');
    console.log('📋 NEXT: View Your Timeline\n');
    console.log('1. Go to: https://tracker.totalaudiopromo.com/dashboard');
    console.log('2. Click on "KYARA - Bloodshot" campaign');
    console.log('3. See the 6 activities in chronological order');
    console.log('4. Perfect for Friday demo with Dan!\n');
    console.log('✅ Ready for demo! 🚀\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    throw error;
  }
}

// Run it
if (require.main === module) {
  addActivitiesToKyaraCampaign()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Failed:', error);
      process.exit(1);
    });
}

module.exports = { addActivitiesToKyaraCampaign };

