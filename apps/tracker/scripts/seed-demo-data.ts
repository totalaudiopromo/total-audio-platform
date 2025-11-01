#!/usr/bin/env ts-node
/**
 * Seed Demo Data for Tracker
 * Creates realistic UK music industry campaigns for testing
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

// Demo campaigns based on real UK music industry scenarios
const demoCampaigns = [
  {
    name: 'BBC Radio 1 - Future Sounds Pitch',
    artist_name: 'sadact',
    platform: 'BBC Radio',
    genre: 'Electronic',
    start_date: '2025-01-15',
    end_date: '2025-02-15',
    budget: 550,
    target_reach: 25,
    actual_reach: 18,
    status: 'completed',
    notes:
      'Pitched to Annie Mac successor. Got 18/25 playlist adds. Strong performance for electronic.',
  },
  {
    name: 'Spotify UK Editorial Playlists',
    artist_name: 'sadact',
    platform: 'Playlists',
    genre: 'Electronic',
    start_date: '2025-02-01',
    end_date: '2025-03-01',
    budget: 380,
    target_reach: 15,
    actual_reach: 22,
    status: 'completed',
    notes:
      'Exceeded expectations! Got into Singled Out, Fresh Finds, and 3 regional playlists.',
  },
  {
    name: 'Commercial Radio - Kiss FM Push',
    artist_name: 'sadact',
    platform: 'Commercial Radio',
    genre: 'Electronic',
    start_date: '2025-03-01',
    end_date: '2025-04-01',
    budget: 850,
    target_reach: 12,
    actual_reach: 8,
    status: 'completed',
    notes:
      'Tough market. 8/12 stations added to rotation. Cost per station higher than expected.',
  },
  {
    name: 'Blog Outreach - UK Electronic Scene',
    artist_name: 'sadact',
    platform: 'Blogs',
    genre: 'Electronic',
    start_date: '2025-01-20',
    end_date: '2025-02-20',
    budget: 420,
    target_reach: 20,
    actual_reach: 27,
    status: 'completed',
    notes:
      'Brilliant results. NME, Line of Best Fit, DIY, The Quietus plus 23 specialist blogs.',
  },
  {
    name: 'BBC 6Music Daytime',
    artist_name: 'Various Artists',
    platform: 'BBC Radio',
    genre: 'Indie',
    start_date: '2025-02-10',
    end_date: '2025-03-10',
    budget: 480,
    target_reach: 20,
    actual_reach: 14,
    status: 'completed',
    notes:
      'Steve Lamacq featured track. Good reception but competitive landscape.',
  },
  {
    name: 'Instagram Influencer Campaign',
    artist_name: 'sadact',
    platform: 'Social',
    genre: 'Electronic',
    start_date: '2025-03-15',
    end_date: null,
    budget: 300,
    target_reach: 30,
    actual_reach: 12,
    status: 'active',
    notes:
      'In progress. 12/30 influencers confirmed. Targeting UK electronic music accounts.',
  },
  {
    name: 'Community Radio Grassroots',
    artist_name: 'Various Artists',
    platform: 'BBC Radio',
    genre: 'Jazz',
    start_date: '2025-01-05',
    end_date: '2025-02-05',
    budget: 220,
    target_reach: 15,
    actual_reach: 11,
    status: 'completed',
    notes:
      'Solid community radio support. Lower cost per station than commercial.',
  },
];

async function seedData() {
  console.log('🌱 TRACKER SEED DATA');
  console.log('===================');
  console.log('');

  // Check if we need a test user (you'll need to create this manually first)
  console.log('⚠️  IMPORTANT: You need a test user account first!');
  console.log('   1. Visit http://localhost:3004/signup');
  console.log('   2. Create account: test@tracker.com');
  console.log('   3. Then run this script again');
  console.log('');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');

  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('');
  console.log('📝 Attempting to create demo campaigns...');
  console.log('');

  // Try to get current user (won't work without auth, but shows the approach)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log('❌ Not authenticated. Manual approach:');
    console.log('');
    console.log('1. Sign up at http://localhost:3004/signup');
    console.log('2. Copy this SQL and run in Supabase SQL Editor:');
    console.log('');
    console.log(
      '-- Replace YOUR_USER_ID with your actual user ID from auth.users table'
    );
    console.log('');

    demoCampaigns.forEach((campaign, index) => {
      console.log(
        `INSERT INTO campaigns (user_id, name, artist_name, platform, genre, start_date, end_date, budget, target_reach, actual_reach, status, notes) VALUES`
      );
      console.log(`  ('YOUR_USER_ID',`);
      console.log(`   '${campaign.name}',`);
      console.log(`   '${campaign.artist_name}',`);
      console.log(`   '${campaign.platform}',`);
      console.log(`   '${campaign.genre}',`);
      console.log(`   '${campaign.start_date}',`);
      console.log(
        `   ${campaign.end_date ? `'${campaign.end_date}'` : 'NULL'},`
      );
      console.log(`   ${campaign.budget},`);
      console.log(`   ${campaign.target_reach},`);
      console.log(`   ${campaign.actual_reach},`);
      console.log(`   '${campaign.status}',`);
      console.log(`   '${campaign.notes}');`);
      console.log('');
    });

    return;
  }

  console.log(`✅ Authenticated as: ${user.email}`);
  console.log('');

  // Insert campaigns
  let successCount = 0;
  let failCount = 0;

  for (const campaign of demoCampaigns) {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([
        {
          user_id: user.id,
          ...campaign,
        },
      ])
      .select()
      .single();

    if (error) {
      console.log(`❌ Failed: ${campaign.name}`);
      console.log(`   ${error.message}`);
      failCount++;
    } else {
      console.log(`✅ Created: ${campaign.name}`);
      successCount++;
    }
  }

  console.log('');
  console.log('📊 Summary:');
  console.log(`   ✅ ${successCount} campaigns created`);
  console.log(`   ❌ ${failCount} failed`);
  console.log('');
  console.log('🎉 Seed data complete!');
  console.log('   Visit http://localhost:3004/dashboard to see your campaigns');
}

seedData().catch(console.error);
