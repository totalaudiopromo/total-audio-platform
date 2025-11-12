/**
 * Import Real Liberty Music PR Campaigns
 * KYARA "Bloodshot", Senior Dunce "Bestial", Concerta "Consumption"
 *
 * Usage: tsx apps/tracker/scripts/import-liberty-campaigns.ts
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@total-audio/core-db/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('🎵 Importing Liberty Music PR Campaigns...\n');

  // Get or create Liberty user ID
  const libertyUser = await getOrCreateLibertyUser();
  console.log(`✅ Liberty user: ${libertyUser.email}\n`);

  // Import campaigns
  await importKyaraCampaign(libertyUser.id);
  await importSeniorDunceCampaign(libertyUser.id);
  await importConcertaCampaign(libertyUser.id);

  console.log('\n✨ All campaigns imported successfully!');
}

async function getOrCreateLibertyUser() {
  // Check if demo user exists
  const { data: user } = await supabase.auth.admin.getUserById(
    'liberty-demo-user'
  );

  if (user) {
    return user.user;
  }

  // Create demo user
  const { data: newUser, error } = await supabase.auth.admin.createUser({
    email: 'demo@libertymusicpr.com',
    email_confirm: true,
    user_metadata: {
      name: 'Liberty Music PR Demo',
      company: 'Liberty Music PR',
    },
  });

  if (error || !newUser.user) {
    throw new Error(`Failed to create Liberty user: ${error?.message}`);
  }

  return newUser.user;
}

// ============================================================================
// KYARA "Bloodshot" Campaign
// ============================================================================
async function importKyaraCampaign(userId: string) {
  console.log('📀 Importing KYARA "Bloodshot" campaign...');

  // Create campaign
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .insert({
      user_id: userId,
      title: 'KYARA - Bloodshot',
      artist_name: 'KYARA',
      track_name: 'Bloodshot',
      genre: 'Electronic / Dance',
      release_date: '2025-10-14',
      budget: '£1,500',
      campaign_angle: 'Pre-release radio push for Australian artist breaking into UK',
      region: 'UK & Australia',
      campaign_duration: '4 weeks (pre-release)',
      status: 'active',
      gmail_label: 'Campaign: KYARA',
      mailchimp_campaign_id: 'kyara_bloodshot_oct2025',
    })
    .select()
    .single();

  if (campaignError || !campaign) {
    throw new Error(`Failed to create KYARA campaign: ${campaignError?.message}`);
  }

  console.log(`  ✅ Campaign created: ${campaign.id}`);

  // Import contacts
  const contacts = [
    {
      contact_name: 'Anika Luna',
      contact_email: 'anika@triplej.net.au',
      outlet: 'Triple J',
      contact_type: 'National' as const,
      priority: 'high' as const,
      status: 'contacted' as const,
    },
    {
      contact_name: 'Claire Mooney',
      contact_email: 'claire@tripler.com.au',
      outlet: 'Triple R',
      contact_type: 'Community' as const,
      priority: 'high' as const,
      status: 'contacted' as const,
    },
    {
      contact_name: 'Simon Winkler',
      contact_email: 'simon@pbsfm.org.au',
      outlet: 'PBS FM',
      contact_type: 'Community' as const,
      priority: 'medium' as const,
      status: 'pending' as const,
    },
    {
      contact_name: 'Amazing Radio UK',
      contact_email: 'music@amazingradio.com',
      outlet: 'Amazing Radio',
      contact_type: 'National' as const,
      priority: 'high' as const,
      status: 'confirmed' as const,
    },
    {
      contact_name: 'Danny Howard',
      contact_email: 'danny@bbc.co.uk',
      outlet: 'BBC Radio 1',
      contact_type: 'National' as const,
      priority: 'high' as const,
      status: 'contacted' as const,
    },
  ];

  const { data: insertedContacts } = await supabase
    .from('campaign_contacts')
    .insert(
      contacts.map((c) => ({
        ...c,
        campaign_id: campaign.id,
      }))
    )
    .select();

  console.log(`  ✅ ${insertedContacts?.length || 0} contacts imported`);

  // Import activities
  const activities = [
    {
      activity_type: 'milestone' as const,
      description: 'Campaign started: KYARA "Bloodshot" pre-release push',
      timestamp: '2025-10-07T09:00:00Z',
      integration_source: 'manual' as const,
      user_name: 'Chris Schofield',
      user_location: 'Brighton, UK',
    },
    {
      activity_type: 'gmail_sent' as const,
      description: 'Initial pitch wave sent to 15 Australian radio contacts',
      notes: 'Targeted Triple J, Triple R, PBS FM, KIIS, FBi Radio',
      timestamp: '2025-10-07T10:30:00Z',
      integration_source: 'gmail' as const,
      user_name: 'Chris Schofield',
      user_location: 'Brighton, UK',
    },
    {
      activity_type: 'gmail_sent' as const,
      description: '5 Gmail drafts auto-created for Australian radio (Liberty inbox)',
      notes: 'Anika Luna, Claire Mooney, Simon Winkler, Firas, KIIS Music Team',
      timestamp: '2025-10-08T11:00:00Z',
      integration_source: 'gmail' as const,
      user_name: 'Chris Schofield',
      user_location: 'Brighton, UK',
    },
    {
      activity_type: 'play_confirmed' as const,
      description: 'Amazing Radio (UK) confirmed support for "Bloodshot"',
      notes: 'CONFIRMED ADD - UK national radio ⭐',
      timestamp: '2025-10-09T14:20:00Z',
      integration_source: 'gmail' as const,
      user_name: 'Chris Schofield',
      user_location: 'Brighton, UK',
    },
    {
      activity_type: 'warm_play' as const,
      description: 'WARM report: 85 plays across 9 countries (pre-release)',
      notes: '85 plays, 9 countries, 12 stations',
      timestamp: '2025-10-10T09:00:00Z',
      integration_source: 'warm_report' as const,
      metadata: {
        totalPlays: 85,
        countriesCount: 9,
        stationsCount: 12,
      },
    },
    {
      activity_type: 'mailchimp_sent' as const,
      description: 'Mailchimp campaign sent to 20 UK specialist electronic contacts',
      notes: 'Danny Howard, Pete Tong, BBC Radio 1/6 Music targets',
      timestamp: '2025-10-11T10:00:00Z',
      integration_source: 'mailchimp' as const,
      user_name: 'Chris Schofield',
      user_location: 'Brighton, UK',
    },
    {
      activity_type: 'milestone' as const,
      description: 'Monday release day email blast prepared (40 contacts)',
      notes: '4 email variations ready, scheduled for 7am AEST Monday',
      timestamp: '2025-10-11T16:00:00Z',
      integration_source: 'manual' as const,
      user_name: 'Chris Schofield',
      user_location: 'Brighton, UK',
    },
  ];

  await supabase.from('campaign_activities').insert(
    activities.map((a) => ({
      ...a,
      campaign_id: campaign.id,
      user_id: userId,
    }))
  );

  console.log(`  ✅ ${activities.length} activities imported`);

  // Import metrics
  await supabase.from('campaign_metrics').insert([
    {
      campaign_id: campaign.id,
      metric_type: 'plays',
      value: 85,
      source: 'warm_report',
    },
    {
      campaign_id: campaign.id,
      metric_type: 'emails_sent',
      value: 20,
      source: 'mailchimp_api',
    },
    {
      campaign_id: campaign.id,
      metric_type: 'email_opens',
      value: 12,
      source: 'mailchimp_api',
    },
  ]);

  console.log(`  ✅ Metrics imported\n`);
}

// ============================================================================
// SENIOR DUNCE "Bestial" Campaign
// ============================================================================
async function importSeniorDunceCampaign(userId: string) {
  console.log('🎸 Importing Senior Dunce "Bestial" campaign...');

  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .insert({
      user_id: userId,
      title: 'Senior Dunce - Bestial',
      artist_name: 'Senior Dunce',
      track_name: 'Bestial',
      genre: 'Rock / Alternative',
      release_date: '2025-09-20',
      budget: '£800',
      campaign_angle: 'UK radio expansion for established act',
      region: 'UK',
      campaign_duration: '6 weeks',
      status: 'active',
      gmail_label: 'Campaign: Senior Dunce',
    })
    .select()
    .single();

  if (campaignError || !campaign) {
    throw new Error(`Failed to create Senior Dunce campaign: ${campaignError?.message}`);
  }

  console.log(`  ✅ Campaign created: ${campaign.id}`);

  // Import contacts
  const contacts = [
    {
      contact_name: 'BBC Radio 6 Music',
      contact_email: 'music@bbc.co.uk',
      outlet: 'BBC Radio 6 Music',
      contact_type: 'National' as const,
      priority: 'high' as const,
      status: 'contacted' as const,
    },
    {
      contact_name: 'Tom Robinson',
      contact_email: 'tom@bbc.co.uk',
      outlet: 'BBC Radio 6 Music',
      contact_type: 'National' as const,
      priority: 'high' as const,
      status: 'responded' as const,
    },
    {
      contact_name: 'XS Manchester',
      contact_email: 'music@xsmanchester.co.uk',
      outlet: 'XS Manchester',
      contact_type: 'Community' as const,
      priority: 'medium' as const,
      status: 'contacted' as const,
    },
  ];

  await supabase.from('campaign_contacts').insert(
    contacts.map((c) => ({
      ...c,
      campaign_id: campaign.id,
    }))
  );

  console.log(`  ✅ ${contacts.length} contacts imported`);

  // Import activities
  const activities = [
    {
      activity_type: 'milestone' as const,
      description: 'Campaign launched: Senior Dunce UK radio expansion',
      timestamp: '2025-09-20T09:00:00Z',
      integration_source: 'manual' as const,
    },
    {
      activity_type: 'warm_play' as const,
      description: '5 confirmed plays across UK stations',
      notes: 'BBC Radio 6 Music (2x), XS Manchester (3x)',
      timestamp: '2025-09-25T14:00:00Z',
      integration_source: 'warm_report' as const,
    },
    {
      activity_type: 'got_response' as const,
      description: 'Tom Robinson (BBC 6 Music) responded positively',
      notes: 'Interested in live session for his show',
      timestamp: '2025-09-28T11:30:00Z',
      integration_source: 'gmail' as const,
    },
  ];

  await supabase.from('campaign_activities').insert(
    activities.map((a) => ({
      ...a,
      campaign_id: campaign.id,
      user_id: userId,
    }))
  );

  console.log(`  ✅ ${activities.length} activities imported`);

  // Import metrics
  await supabase.from('campaign_metrics').insert([
    {
      campaign_id: campaign.id,
      metric_type: 'plays',
      value: 5,
      source: 'warm_report',
    },
  ]);

  console.log(`  ✅ Metrics imported\n`);
}

// ============================================================================
// CONCERTA "Consumption" Campaign
// ============================================================================
async function importConcertaCampaign(userId: string) {
  console.log('🎹 Importing Concerta "Consumption" campaign...');

  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .insert({
      user_id: userId,
      title: 'Concerta - Consumption',
      artist_name: 'Concerta',
      track_name: 'Consumption',
      genre: 'Electronic / Experimental',
      release_date: '2025-11-01',
      budget: '£2,000',
      campaign_angle: 'South Korean artist breaking European electronic market',
      region: 'Europe (UK, Germany, Netherlands, Belgium)',
      campaign_duration: '8 weeks',
      status: 'active',
      airtable_base_id: 'appConcertaContacts2025',
      airtable_table_id: 'Electronic Contacts',
    })
    .select()
    .single();

  if (campaignError || !campaign) {
    throw new Error(`Failed to create Concerta campaign: ${campaignError?.message}`);
  }

  console.log(`  ✅ Campaign created: ${campaign.id}`);

  // Import contacts (sample from 132 total)
  const contacts = [
    {
      contact_name: 'KEXP Seattle',
      contact_email: 'music@kexp.org',
      outlet: 'KEXP',
      contact_type: 'National' as const,
      priority: 'high' as const,
      status: 'pending' as const,
    },
    {
      contact_name: 'Rinse FM',
      contact_email: 'submissions@rinse.fm',
      outlet: 'Rinse FM',
      contact_type: 'Commercial' as const,
      priority: 'high' as const,
      status: 'pending' as const,
    },
    {
      contact_name: 'NTS Radio',
      contact_email: 'music@nts.live',
      outlet: 'NTS Radio',
      contact_type: 'Online' as const,
      priority: 'high' as const,
      status: 'pending' as const,
    },
  ];

  await supabase.from('campaign_contacts').insert(
    contacts.map((c) => ({
      ...c,
      campaign_id: campaign.id,
      synced_to_airtable: true,
    }))
  );

  console.log(`  ✅ ${contacts.length} contacts imported (132 total in Airtable)`);

  // Import activities
  const activities = [
    {
      activity_type: 'milestone' as const,
      description: 'Campaign created: Concerta European electronic push',
      timestamp: '2025-10-15T09:00:00Z',
      integration_source: 'manual' as const,
    },
    {
      activity_type: 'milestone' as const,
      description: 'Imported 132 electronic/dance contacts from Airtable',
      notes: 'Synced with Airtable base: Electronic Contacts',
      timestamp: '2025-10-15T10:00:00Z',
      integration_source: 'airtable' as const,
    },
  ];

  await supabase.from('campaign_activities').insert(
    activities.map((a) => ({
      ...a,
      campaign_id: campaign.id,
      user_id: userId,
    }))
  );

  console.log(`  ✅ ${activities.length} activities imported\n`);
}

// Run import
main().catch((error) => {
  console.error('❌ Import failed:', error);
  process.exit(1);
});
