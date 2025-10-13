#!/usr/bin/env node

/**
 * Add 6 Timeline Activities to KYARA Campaign
 * Quick script to populate the campaign timeline for Friday demo
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Try multiple possible paths for .env.local
const possiblePaths = [
  path.join(__dirname, '../../../apps/tracker/.env.local'),
  path.join(__dirname, '../../../../apps/tracker/.env.local'),
  path.join(process.cwd(), 'apps/tracker/.env.local'),
];

let envPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    envPath = p;
    break;
  }
}

if (envPath) {
  require('dotenv').config({ path: envPath });
  console.log(`✅ Loaded .env.local from: ${envPath}\n`);
} else {
  console.error('❌ Could not find .env.local file');
  console.log('Tried paths:', possiblePaths);
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ Supabase credentials not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addActivities() {
  console.log('🚀 Adding 6 activities to KYARA campaign...\n');

  // First, get the campaign ID
  const { data: campaigns, error: campaignError } = await supabase
    .from('campaigns')
    .select('id, name')
    .ilike('name', '%KYARA%')
    .limit(1);

  if (campaignError || !campaigns || campaigns.length === 0) {
    console.error('❌ Could not find KYARA campaign:', campaignError?.message);
    console.log('\nMake sure you have created the KYARA campaign first!');
    process.exit(1);
  }

  const campaignId = campaigns[0].id;
  console.log(`✅ Found campaign: "${campaigns[0].name}" (ID: ${campaignId})\n`);

  // Get user ID (assuming you're the only user)
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('❌ Not authenticated. Please sign in first.');
    process.exit(1);
  }

  const userId = user.id;
  console.log(`✅ User ID: ${userId}\n`);

  // Define the 6 activities
  const activities = [
    {
      campaign_id: campaignId,
      user_id: userId,
      activity_type: 'email_sent',
      description: 'Initial pitch wave sent to 15 Australian radio contacts',
      activity_date: '2025-10-07',
      notes: 'Targeted Triple J, Triple R, PBS FM, KIIS, FBi Radio',
      metadata: {
        contacts: 15,
        region: 'Australia',
        targets: ['Triple J', 'Triple R', 'PBS FM', 'KIIS', 'FBi Radio']
      }
    },
    {
      campaign_id: campaignId,
      user_id: userId,
      activity_type: 'email_sent',
      description: '5 Gmail drafts auto-created for Australian radio (Liberty inbox)',
      activity_date: '2025-10-08',
      notes: 'Anika Luna, Claire Mooney, Simon Winkler, Firas, KIIS Music Team',
      metadata: {
        tool: 'Gmail API',
        drafts: 5,
        contacts: ['Anika Luna', 'Claire Mooney', 'Simon Winkler', 'Firas', 'KIIS Music Team']
      }
    },
    {
      campaign_id: campaignId,
      user_id: userId,
      activity_type: 'response',
      description: 'Amazing Radio (UK) confirmed support for "Bloodshot"',
      activity_date: '2025-10-09',
      notes: 'CONFIRMED ADD - UK national radio',
      metadata: {
        station: 'Amazing Radio',
        region: 'UK',
        status: 'CONFIRMED ADD'
      }
    },
    {
      campaign_id: campaignId,
      user_id: userId,
      activity_type: 'milestone',
      description: 'WARM report: 85 plays across 9 countries (pre-release)',
      activity_date: '2025-10-10',
      notes: '85 plays, 9 countries, 12 stations',
      metadata: {
        plays: 85,
        countries: 9,
        stations: 12,
        source: 'WARM API'
      }
    },
    {
      campaign_id: campaignId,
      user_id: userId,
      activity_type: 'email_sent',
      description: 'Mailchimp campaign sent to 20 UK specialist electronic contacts',
      activity_date: '2025-10-11',
      notes: 'Danny Howard, Pete Tong, BBC Radio 1/6 Music targets',
      metadata: {
        tool: 'Mailchimp',
        contacts: 20,
        region: 'UK',
        targets: ['Danny Howard', 'Pete Tong', 'BBC Radio 1', 'BBC 6 Music']
      }
    },
    {
      campaign_id: campaignId,
      user_id: userId,
      activity_type: 'planning',
      description: 'Monday release day email blast prepared (40 contacts)',
      activity_date: '2025-10-11',
      notes: '4 email variations ready, scheduled for 7am AEST Monday',
      metadata: {
        contacts: 40,
        variations: 4,
        send_date: '2025-10-14',
        send_time: '7am AEST'
      }
    }
  ];

  // Insert activities one by one
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    console.log(`${i + 1}. Adding: "${activity.description}"...`);

    const { data, error } = await supabase
      .from('campaign_activities')
      .insert(activity)
      .select();

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
    } else {
      console.log(`   ✅ Added (${activity.activity_date})`);
    }
  }

  console.log('\n🎉 Done! Refresh your tracker dashboard to see the timeline.');
  console.log('📍 Go to: http://localhost:3004/dashboard\n');
}

addActivities().catch(console.error);
