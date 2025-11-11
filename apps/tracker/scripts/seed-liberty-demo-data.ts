#!/usr/bin/env ts-node
/**
 * Liberty Music PR Demo Data for Tracker
 * Creates realistic UK music PR campaigns with contacts for demo
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials');
  console.error(
    '   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Liberty Music PR Demo Campaigns
const libertyCampaigns = [
  {
    name: 'Artist A - Single Release',
    artist_name: 'Artist A',
    platform: 'BBC Radio',
    genre: 'Electronic',
    start_date: '2025-01-10',
    end_date: '2025-02-10',
    budget: 650,
    target_reach: 45,
    actual_reach: 12,
    status: 'active',
    notes: 'Main single release campaign. Focus on BBC Radio 1 and 6Music.',
  },
  {
    name: 'Artist B - EP Launch',
    artist_name: 'Artist B',
    platform: 'Playlists',
    genre: 'Indie',
    start_date: '2025-01-15',
    end_date: '2025-02-15',
    budget: 480,
    target_reach: 38,
    actual_reach: 12,
    status: 'active',
    notes:
      'EP launch campaign targeting Spotify editorial and indie playlists.',
  },
  {
    name: 'Artist C - Album Campaign',
    artist_name: 'Artist C',
    platform: 'Blogs',
    genre: 'Pop',
    start_date: '2025-01-05',
    end_date: '2025-02-05',
    budget: 750,
    target_reach: 52,
    actual_reach: 10,
    status: 'active',
    notes: 'Major album campaign with press outreach and blog features.',
  },
  {
    name: 'Artist D - Radio Push',
    artist_name: 'Artist D',
    platform: 'Commercial Radio',
    genre: 'Rock',
    start_date: '2024-12-15',
    end_date: '2025-01-15',
    budget: 920,
    target_reach: 28,
    actual_reach: 11,
    status: 'paused',
    notes: 'Commercial radio push paused for review. Strong initial response.',
  },
  {
    name: 'Artist E - Playlist Focus',
    artist_name: 'Artist E',
    platform: 'Playlists',
    genre: 'R&B',
    start_date: '2024-12-01',
    end_date: '2024-12-31',
    budget: 420,
    target_reach: 35,
    actual_reach: 13,
    status: 'completed',
    notes:
      'Completed playlist campaign. Excellent results with 37% response rate.',
  },
];

// UK Music Industry Contacts
const ukContacts = {
  bbc_radio: [
    {
      name: 'Jack Saunders',
      org: 'BBC Radio 1',
      email: 'jack.saunders@bbc.co.uk',
    },
    { name: 'Clara Amfo', org: 'BBC Radio 1', email: 'clara.amfo@bbc.co.uk' },
    {
      name: 'Danny Howard',
      org: 'BBC Radio 1',
      email: 'danny.howard@bbc.co.uk',
    },
    {
      name: 'Mary Anne Hobbs',
      org: 'BBC Radio 6 Music',
      email: 'maryanne.hobbs@bbc.co.uk',
    },
    {
      name: 'Tom Ravenscroft',
      org: 'BBC Radio 6 Music',
      email: 'tom.ravenscroft@bbc.co.uk',
    },
    {
      name: 'Lauren Laverne',
      org: 'BBC Radio 6 Music',
      email: 'lauren.laverne@bbc.co.uk',
    },
    {
      name: 'Steve Lamacq',
      org: 'BBC Radio 6 Music',
      email: 'steve.lamacq@bbc.co.uk',
    },
  ],
  commercial_radio: [
    { name: 'Sarah Story', org: 'Kiss FM', email: 'sarah.story@kissfm.com' },
    {
      name: 'Matt Wilkinson',
      org: 'Radio X',
      email: 'matt.wilkinson@radiox.co.uk',
    },
    {
      name: 'Chris Moyles',
      org: 'Radio X',
      email: 'chris.moyles@radiox.co.uk',
    },
  ],
  playlists: [
    { name: 'UK Pop Editorial', org: 'Spotify', email: 'ukpop@spotify.com' },
    { name: 'New Music Friday UK', org: 'Spotify', email: 'nmfuk@spotify.com' },
    {
      name: 'Fresh Finds UK',
      org: 'Spotify',
      email: 'freshfindsuk@spotify.com',
    },
    { name: 'Indie Radar', org: 'Spotify', email: 'indieradar@spotify.com' },
  ],
  blogs: [
    {
      name: 'Alexis Petridis',
      org: 'The Guardian',
      email: 'alexis.petridis@theguardian.com',
    },
    {
      name: 'Laura Snapes',
      org: 'The Guardian',
      email: 'laura.snapes@theguardian.com',
    },
    { name: 'Mark Beaumont', org: 'NME', email: 'mark.beaumont@nme.com' },
    { name: 'Rhian Daly', org: 'NME', email: 'rhian.daly@nme.com' },
    {
      name: 'Lisa Wright',
      org: 'DIY Magazine',
      email: 'lisa.wright@diymag.com',
    },
    {
      name: 'Ben Homewood',
      org: 'DIY Magazine',
      email: 'ben.homewood@diymag.com',
    },
    {
      name: 'Will Richards',
      org: 'The Line of Best Fit',
      email: 'will.richards@thelineofbestfit.com',
    },
    {
      name: 'Robin Murray',
      org: 'Clash Magazine',
      email: 'robin.murray@clashmusic.com',
    },
  ],
};

// Generate activities with contacts for each campaign
function generateActivitiesForCampaign(
  campaignId: string,
  campaign: (typeof libertyCampaigns)[0],
  startDate: Date
): any[] {
  const activities: any[] = [];
  const platform = campaign.platform.toLowerCase().replace(' ', '_');
  const contacts = ukContacts[platform as keyof typeof ukContacts] || [];

  // Determine how many contacts to use based on target_reach
  const numContacts = Math.min(campaign.target_reach, contacts.length);
  const selectedContacts = contacts.slice(0, numContacts);

  // Calculate dates
  const campaignStart = new Date(startDate);
  const daysSinceStart = Math.floor(
    (new Date().getTime() - campaignStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Generate pitch activities
  selectedContacts.forEach((contact, index) => {
    const pitchDate = new Date(campaignStart);
    pitchDate.setDate(pitchDate.getDate() + index * 2); // Stagger pitches over 2 days

    activities.push({
      campaign_id: campaignId,
      activity_type: 'pitch_sent',
      description: `Pitch sent to ${contact.name} at ${contact.org}`,
      activity_date: pitchDate.toISOString().split('T')[0],
      contact_name: contact.name,
      contact_org: contact.org,
      platform: campaign.platform,
      notes: `Initial pitch for ${campaign.artist_name} - ${campaign.name}`,
    });

    // Some contacts respond
    if (index < campaign.actual_reach) {
      const responseDate = new Date(pitchDate);
      responseDate.setDate(
        responseDate.getDate() + Math.floor(Math.random() * 7) + 2
      );

      // Determine response type
      const responseType =
        index < campaign.actual_reach * 0.4
          ? 'response_received'
          : index < campaign.actual_reach * 0.7
            ? 'playlist_add'
            : 'radio_play';

      activities.push({
        campaign_id: campaignId,
        activity_type: responseType,
        description:
          responseType === 'playlist_add'
            ? `Added to playlist by ${contact.name}`
            : responseType === 'radio_play'
              ? `Radio play confirmed by ${contact.name}`
              : `Response received from ${contact.name}`,
        activity_date: responseDate.toISOString().split('T')[0],
        contact_name: contact.name,
        contact_org: contact.org,
        platform: campaign.platform,
        notes: `Positive response from ${contact.org}`,
      });
    }
  });

  return activities.sort(
    (a, b) =>
      new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime()
  );
}

async function seedLibertyData() {
  console.log('🌱 LIBERTY MUSIC PR DEMO DATA');
  console.log('==============================');
  console.log('');

  console.log('⚠️  IMPORTANT: You need a user account first!');
  console.log('   1. Visit http://localhost:3004/signup');
  console.log('   2. Create your account');
  console.log('   3. Copy your user ID from Supabase auth.users table');
  console.log('   4. Update YOUR_USER_ID in the SQL below');
  console.log('');
  console.log('Press Ctrl+C to cancel, or wait 3 seconds to see SQL...');

  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('');
  console.log('📝 SQL to run in Supabase SQL Editor:');
  console.log('');
  console.log('-- Replace YOUR_USER_ID with your actual user ID');
  console.log('');

  // Generate SQL for campaigns
  libertyCampaigns.forEach((campaign, index) => {
    const campaignId = `campaign-${index + 1}`;
    console.log(`-- Campaign ${index + 1}: ${campaign.name}`);
    console.log(
      `INSERT INTO campaigns (id, user_id, name, artist_name, platform, genre, start_date, end_date, budget, target_reach, actual_reach, status, notes, created_at, updated_at) VALUES`
    );
    console.log(`  ('${campaignId}',`);
    console.log(`   'YOUR_USER_ID',`);
    console.log(`   '${campaign.name}',`);
    console.log(`   '${campaign.artist_name}',`);
    console.log(`   '${campaign.platform}',`);
    console.log(`   '${campaign.genre}',`);
    console.log(`   '${campaign.start_date}',`);
    console.log(`   ${campaign.end_date ? `'${campaign.end_date}'` : 'NULL'},`);
    console.log(`   ${campaign.budget},`);
    console.log(`   ${campaign.target_reach},`);
    console.log(`   ${campaign.actual_reach},`);
    console.log(`   '${campaign.status}',`);
    console.log(`   '${campaign.notes.replace(/'/g, "''")}',`);
    console.log(`   NOW(),`);
    console.log(`   NOW());`);
    console.log('');

    // Generate activities
    const activities = generateActivitiesForCampaign(
      campaignId,
      campaign,
      new Date(campaign.start_date)
    );

    activities.forEach(activity => {
      console.log(
        `INSERT INTO campaign_activities (campaign_id, activity_type, description, activity_date, contact_name, contact_org, platform, notes, created_at) VALUES`
      );
      console.log(`  ('${campaignId}',`);
      console.log(`   '${activity.activity_type}',`);
      console.log(`   '${activity.description.replace(/'/g, "''")}',`);
      console.log(`   '${activity.activity_date}',`);
      console.log(
        `   ${
          activity.contact_name
            ? `'${activity.contact_name.replace(/'/g, "''")}'`
            : 'NULL'
        },`
      );
      console.log(
        `   ${
          activity.contact_org
            ? `'${activity.contact_org.replace(/'/g, "''")}'`
            : 'NULL'
        },`
      );
      console.log(`   '${activity.platform}',`);
      console.log(
        `   ${
          activity.notes ? `'${activity.notes.replace(/'/g, "''")}'` : 'NULL'
        },`
      );
      console.log(`   NOW());`);
    });
    console.log('');
  });

  console.log('✅ SQL generation complete!');
  console.log('');
  console.log('📋 Summary:');
  console.log(`   • ${libertyCampaigns.length} campaigns`);
  console.log(
    `   • ~${libertyCampaigns.reduce(
      (sum, c) => sum + c.target_reach,
      0
    )} total contacts`
  );
  console.log(`   • Realistic UK music industry contacts`);
  console.log(`   • Activities with proper status tracking`);
  console.log('');
  console.log('🎉 Copy the SQL above and run it in Supabase SQL Editor');
}

seedLibertyData().catch(console.error);
