#!/usr/bin/env node

/**
 * Add KYARA Campaign Directly (Service Role)
 * Uses service role key to bypass auth
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../../apps/tracker/.env.local') });

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ucncbighzqudaszewjrv.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// KYARA Campaign Data (matching actual tracker schema)
const CAMPAIGN = {
  name: 'KYARA - Bloodshot',
  artist_name: 'KYARA',
  release_type: 'single',
  start_date: '2025-10-01',
  end_date: '2025-11-14',
  budget: 2500,
  spent: 0,
  status: 'active',
  platforms: ['radio', 'streaming'],
  goals: { release_date: '2025-10-14', target_plays: 85, target_stations: 50 },
  notes: `🎵 ARTIST: KYARA (Sydney electro-pop artist)
📀 TRACK: "Bloodshot"
🗓️ RELEASE DATE: Monday 14th October 2025
🌍 REGION: Australia (primary) + UK (secondary)

📊 KEY METRICS (As of Oct 11, 2025):
- 85 plays across 9 countries (pre-release, via WARM)
- Amazing Radio (UK) confirmed support ✅
- Triple J Home & Hosed history ("Yearn" played Aug 2024)
- 15 radio contacts pitched (initial wave)
- 5 Gmail drafts created for Australian radio
- Release week email blast prepared for Monday 14th Oct

🎯 CONTACTS PITCHED:
WARM: Anika Luna (Triple J Home & Hosed) - Previous "Yearn" support
HIGH PRIORITY: Claire Mooney (Triple J MD), Simon Winkler (Triple R), Firas (PBS FM), KIIS Music Team
UK TARGETS: Danny Howard (R1 Dance), Pete Tong (R1 Essential), Amazing Radio (CONFIRMED)

🚀 NEXT ACTIONS:
- Monday 14th Oct: Release day email blast (7am AEST, 30+ contacts)
- Follow-up with Anika Luna (Triple J warm contact)
- Thank Amazing Radio + request social post
- Pull WARM report (first 24 hours post-release)

💼 DEMO NOTES:
Real Liberty Music PR campaign. Showcases Gmail integration (5 drafts), Mailchimp sync (UK list), WARM API (85 plays), activity timeline, AI next actions.`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// 6 Activities
const ACTIVITIES = [
  {
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

async function run() {
  console.log('🎵 Adding KYARA Campaign Directly to Database\n');

  try {
    // Get YOUR user profile (find by email or first user)
    console.log('🔍 Finding your user profile...');
    const { data: users, error: userError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name')
      .limit(1);

    if (userError || !users || users.length === 0) {
      console.error('❌ No user found:', userError?.message);
      return;
    }

    const user = users[0];
    console.log(`✅ Found user: ${user.email || user.full_name}\n`);

    // Insert campaign
    console.log('📝 Creating KYARA campaign...');
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert([{ ...CAMPAIGN, user_id: user.id }])
      .select()
      .single();

    if (campaignError) {
      console.error('❌ Campaign error:', campaignError.message);
      return;
    }

    console.log(`✅ Campaign created! ID: ${campaign.id}\n`);

    // Insert activities
    console.log('📅 Adding 6 timeline activities...\n');

    for (const activity of ACTIVITIES) {
      const { error: actError } = await supabase.from('campaign_activities').insert([
        {
          campaign_id: campaign.id,
          user_id: user.id,
          activity_type: activity.activity_type,
          description: activity.description,
          activity_date: activity.activity_date,
          metadata: activity.metadata,
          created_at: new Date(activity.activity_date).toISOString(),
        },
      ]);

      if (actError) {
        console.log(`   ⚠️  ${activity.description} - ${actError.message}`);
      } else {
        console.log(`   ✅ ${activity.activity_date} - ${activity.description}`);
      }

      await new Promise(r => setTimeout(r, 100));
    }

    console.log('\n🎉 DONE! KYARA Campaign Ready!\n');
    console.log('📋 Next Steps:\n');
    console.log('1. Visit: https://tracker.totalaudiopromo.com/dashboard');
    console.log('2. See KYARA - Bloodshot campaign with 6 activities');
    console.log('3. Demo to Dan on Friday! 🚀\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

run()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
