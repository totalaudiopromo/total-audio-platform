#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../../apps/tracker/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ucncbighzqudaszewjrv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Allowed types: email_open, email_reply, track_download, playlist_add, radio_play, social_share, stream_milestone, contact_engaged
const ACTIVITIES = [
  {
    activity_type: 'contact_engaged',
    description: 'Initial pitch wave sent to 15 Australian radio contacts',
    timestamp: '2025-10-07T10:00:00Z',
    metadata: { contacts: 15, region: 'Australia', targets: ['Triple J', 'Triple R', 'PBS FM', 'KIIS', 'FBi Radio'] }
  },
  {
    activity_type: 'contact_engaged',
    description: '5 Gmail drafts auto-created for Australian radio (Liberty inbox)',
    timestamp: '2025-10-08T14:00:00Z',
    metadata: { tool: 'Gmail API', drafts: 5, contacts: ['Anika Luna', 'Claire Mooney', 'Simon Winkler', 'Firas', 'KIIS Music Team'] }
  },
  {
    activity_type: 'email_reply',
    description: 'Amazing Radio (UK) confirmed support for "Bloodshot"',
    timestamp: '2025-10-09T16:30:00Z',
    metadata: { station: 'Amazing Radio', region: 'UK', status: 'CONFIRMED ADD' }
  },
  {
    activity_type: 'radio_play',
    description: 'WARM report: 85 plays across 9 countries (pre-release)',
    timestamp: '2025-10-10T12:00:00Z',
    metadata: { plays: 85, countries: 9, stations: 12, source: 'WARM API' }
  },
  {
    activity_type: 'contact_engaged',
    description: 'Mailchimp campaign sent to 20 UK electronic specialist contacts',
    timestamp: '2025-10-10T18:00:00Z',
    metadata: { tool: 'Mailchimp', recipients: 20, region: 'UK', targets: ['BBC Radio 1', 'BBC 6 Music', 'Community Radio'] }
  },
  {
    activity_type: 'contact_engaged',
    description: 'Release day email blast prepared (Monday 14th Oct, 7am AEST)',
    timestamp: '2025-10-11T20:00:00Z',
    metadata: { scheduled_for: '2025-10-14T07:00:00+10:00', recipients: 30, type: 'Release day announcement', regions: ['Australia', 'UK'] }
  }
];

async function run() {
  console.log('📅 Adding 6 Activities to KYARA Campaign\n');

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, user_id, name')
    .ilike('name', '%KYARA%')
    .order('created_at', { ascending: false })
    .limit(1);

  if (!campaigns || campaigns.length === 0) {
    console.error('❌ No KYARA campaign found');
    return;
  }

  const campaign = campaigns[0];
  console.log(`✅ Found: ${campaign.name} (ID: ${campaign.id})\n`);

  for (const activity of ACTIVITIES) {
    const { error } = await supabase
      .from('campaign_activities')
      .insert([{
        campaign_id: campaign.id,
        activity_type: activity.activity_type,
        description: activity.description,
        timestamp: activity.timestamp,
        metadata: activity.metadata
      }]);

    if (error) {
      console.log(`   ⚠️  ${activity.description} - ${error.message}`);
    } else {
      console.log(`   ✅ ${activity.description}`);
    }
  }

  console.log('\n🎉 All 6 Activities Added!');
  console.log('🚀 Visit: https://tracker.totalaudiopromo.com/dashboard\n');
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

