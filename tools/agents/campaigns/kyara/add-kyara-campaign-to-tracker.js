#!/usr/bin/env node

/**
 * Add KYARA "Bloodshot" Campaign to tracker.totalaudiopromo.com
 *
 * This script adds the real KYARA campaign data to your tracker
 * for the Friday demo with Dan from Liberty Music PR
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../../apps/tracker/.env.local') });

// Supabase setup (from your tracker app .env.local)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ucncbighzqudaszewjrv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_ANON_KEY not found in environment');
  console.log('   Expected location: apps/tracker/.env.local');
  console.log('   URL found:', supabaseUrl);
  process.exit(1);
}

console.log('✅ Loaded Supabase config from apps/tracker/.env.local');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);
console.log('');

const supabase = createClient(supabaseUrl, supabaseKey);

// KYARA Campaign Data (Real Liberty Music PR Campaign)
const KYARA_CAMPAIGN = {
  // Basic Info
  name: 'KYARA - Bloodshot',
  artist: 'KYARA',
  track: 'Bloodshot',
  status: 'active', // active, completed, paused

  // Campaign Details
  platform: 'radio', // radio, press, playlisting, social
  genre: 'electronic', // electronic, pop, rock, hip-hop, indie, etc.
  region: 'Australia + UK',

  // Dates
  start_date: '2025-10-01', // Campaign start
  release_date: '2025-10-14', // Monday release
  end_date: '2025-11-14', // 6-week campaign

  // Budget & Targets
  budget: 2500, // £2,500 Liberty standard campaign
  target_reach: 50, // Target 50 radio stations/contacts
  actual_reach: 15, // 15 contacts pitched so far

  // Performance Metrics
  success_rate: 75, // 75% progress to release week

  // Campaign Notes
  notes: `
    Real Liberty Music PR campaign for Sydney artist KYARA.

    KEY METRICS (As of Oct 11, 2025):
    - 85 plays across 9 countries (pre-release, via WARM)
    - Amazing Radio (UK) confirmed support
    - Triple J Home & Hosed history ("Yearn" played Aug 2024)
    - 15 radio contacts pitched (initial wave)
    - 5 Gmail drafts created for Australian radio
    - Release week email blast prepared for Monday 14th Oct

    CONTACTS PITCHED:
    WARM:
    - Anika Luna (Triple J Home & Hosed) - Previous "Yearn" support

    HIGH PRIORITY:
    - Claire Mooney (Triple J Music Director)
    - Simon Winkler (Triple R Melbourne)
    - Firas (PBS FM)
    - KIIS Music Team (Sydney)

    UK TARGETS:
    - Danny Howard (BBC Radio 1 Dance)
    - Pete Tong (BBC Radio 1 Essential Selection)
    - Amazing Radio (CONFIRMED SUPPORT)

    NEXT ACTIONS:
    - Monday 14th Oct: Release day email blast (7am AEST)
    - Follow-up with Anika Luna (Triple J)
    - Thank Amazing Radio + request social post
    - Pull WARM report (first 24 hours post-release)

    DEMO NOTES FOR DAN:
    This campaign showcases:
    ✅ Gmail integration (5 auto-drafted emails)
    ✅ Mailchimp sync (UK contact list)
    ✅ WARM API tracking (85 plays real-time)
    ✅ Activity timeline (week-by-week progress)
    ✅ AI next actions (automated suggestions)
  `,

  // Metadata
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Campaign Activities (Timeline for Demo)
const CAMPAIGN_ACTIVITIES = [
  {
    campaign_name: 'KYARA - Bloodshot',
    activity_type: 'email_sent',
    description: 'Initial pitch wave sent to 15 Australian radio contacts',
    activity_date: '2025-10-07',
    metadata: {
      contacts: 15,
      region: 'Australia',
      targets: ['Triple J', 'Triple R', 'PBS FM', 'KIIS', 'FBi Radio'],
    },
  },
  {
    campaign_name: 'KYARA - Bloodshot',
    activity_type: 'email_sent',
    description: '5 Gmail drafts auto-created for Australian radio (Liberty inbox)',
    activity_date: '2025-10-08',
    metadata: {
      tool: 'Gmail API',
      drafts: 5,
      contacts: ['Anika Luna', 'Claire Mooney', 'Simon Winkler', 'Firas', 'KIIS Music Team'],
    },
  },
  {
    campaign_name: 'KYARA - Bloodshot',
    activity_type: 'response',
    description: 'Amazing Radio (UK) confirmed support for "Bloodshot"',
    activity_date: '2025-10-09',
    metadata: {
      station: 'Amazing Radio',
      region: 'UK',
      status: 'CONFIRMED ADD',
    },
  },
  {
    campaign_name: 'KYARA - Bloodshot',
    activity_type: 'milestone',
    description: 'WARM report: 85 plays across 9 countries (pre-release)',
    activity_date: '2025-10-10',
    metadata: {
      plays: 85,
      countries: 9,
      stations: 12,
      source: 'WARM API',
    },
  },
  {
    campaign_name: 'KYARA - Bloodshot',
    activity_type: 'email_sent',
    description: 'Mailchimp campaign sent to UK electronic specialist contacts',
    activity_date: '2025-10-10',
    metadata: {
      tool: 'Mailchimp',
      recipients: 20,
      region: 'UK',
      targets: ['BBC Radio 1', 'BBC 6 Music', 'Community Radio'],
    },
  },
  {
    campaign_name: 'KYARA - Bloodshot',
    activity_type: 'scheduled',
    description: 'Release day email blast prepared (Monday 14th Oct, 7am AEST)',
    activity_date: '2025-10-11',
    metadata: {
      scheduled_for: '2025-10-14T07:00:00+10:00',
      recipients: 30,
      type: 'Release day announcement',
      regions: ['Australia', 'UK'],
    },
  },
];

async function addKyaraCampaignToTracker() {
  console.log('🎵 Adding KYARA "Bloodshot" Campaign to Tracker\n');
  console.log('📊 Campaign Data:');
  console.log(`   Artist: ${KYARA_CAMPAIGN.artist}`);
  console.log(`   Track: ${KYARA_CAMPAIGN.track}`);
  console.log(`   Release Date: ${KYARA_CAMPAIGN.release_date}`);
  console.log(`   Platform: ${KYARA_CAMPAIGN.platform}`);
  console.log(`   Genre: ${KYARA_CAMPAIGN.genre}`);
  console.log(`   Budget: £${KYARA_CAMPAIGN.budget}`);
  console.log(`   Status: ${KYARA_CAMPAIGN.status}`);
  console.log('');

  try {
    // Step 1: Get user ID (you'll need to be authenticated)
    console.log('🔐 Fetching user authentication...');
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error(
        '❌ Authentication required. Please sign in to tracker.totalaudiopromo.com first'
      );
      console.log('   Then export your session token to SUPABASE_SERVICE_ROLE_KEY');
      return;
    }

    console.log(`✅ Authenticated as: ${user.email}\n`);

    // Step 2: Insert campaign
    console.log('📝 Creating campaign in database...');
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert([
        {
          ...KYARA_CAMPAIGN,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (campaignError) {
      console.error('❌ Failed to create campaign:', campaignError.message);
      return;
    }

    console.log(`✅ Campaign created successfully!`);
    console.log(`   Campaign ID: ${campaign.id}`);
    console.log(`   Name: ${campaign.name}\n`);

    // Step 3: Add campaign activities (timeline)
    console.log('📅 Adding campaign activities (timeline)...\n');

    for (const activity of CAMPAIGN_ACTIVITIES) {
      const activityData = {
        ...activity,
        campaign_id: campaign.id,
        user_id: user.id,
        created_at: new Date(activity.activity_date).toISOString(),
      };

      const { error: activityError } = await supabase
        .from('campaign_activities')
        .insert([activityData]);

      if (activityError) {
        console.log(`   ⚠️  Failed to add activity: ${activity.description}`);
        console.log(`      Error: ${activityError.message}`);
      } else {
        console.log(`   ✅ Added: ${activity.description}`);
      }

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('');
    console.log('🎉 KYARA Campaign Added Successfully!\n');
    console.log('📋 NEXT STEPS FOR DEMO:\n');
    console.log('1. Visit: https://tracker.totalaudiopromo.com/dashboard');
    console.log('2. Find the "KYARA - Bloodshot" campaign card');
    console.log('3. Review the activity timeline (6 activities logged)');
    console.log('4. Check the campaign stats:');
    console.log('   - 85 plays (pre-release)');
    console.log('   - 15 contacts pitched');
    console.log('   - 75% campaign progress');
    console.log('   - Release date: Monday 14th October');
    console.log('');
    console.log('5. DEMO TO DAN:');
    console.log('   - Show the campaign overview');
    console.log('   - Walk through the activity timeline');
    console.log('   - Highlight the integrations (Gmail, Mailchimp, WARM)');
    console.log('   - Show the Monday release day scheduled blast');
    console.log('   - Emphasize time savings vs manual tracking');
    console.log('');
    console.log('💼 BUSINESS CASE FOR DAN:');
    console.log('   - This campaign data = 10+ hours saved on tracking');
    console.log('   - Gmail drafts auto-created = 2 hours saved');
    console.log('   - WARM data auto-fetched = 1 hour saved');
    console.log('   - Activity timeline = 30 minutes saved per client update');
    console.log('   - Total for this campaign alone: 13+ hours saved');
    console.log('');
    console.log('✅ Ready for Friday demo with Dan!\n');

    return campaign;
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  addKyaraCampaignToTracker()
    .then(() => {
      console.log('✅ Script complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { addKyaraCampaignToTracker, KYARA_CAMPAIGN, CAMPAIGN_ACTIVITIES };
