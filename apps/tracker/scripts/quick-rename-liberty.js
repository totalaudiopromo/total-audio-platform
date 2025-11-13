#!/usr/bin/env node
/**
 * Quick script to generate SQL for renaming campaigns to Liberty names
 * Run: node scripts/quick-rename-liberty.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const libertyCampaigns = [
  {
    name: 'KYARA - Bloodshot',
    artist_name: 'KYARA',
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
    name: 'Senior Dunce - Bestial',
    artist_name: 'Senior Dunce',
    platform: 'Community Radio',
    genre: 'Electronic',
    start_date: '2025-01-15',
    end_date: '2025-02-15',
    budget: 480,
    target_reach: 38,
    actual_reach: 12,
    status: 'active',
    notes: 'Electronic/Experimental track campaign targeting community radio stations.',
  },
  {
    name: 'Concerta - Consumption',
    artist_name: 'Concerta',
    platform: 'Playlists',
    genre: 'Electronic',
    start_date: '2025-01-05',
    end_date: '2025-02-05',
    budget: 750,
    target_reach: 52,
    actual_reach: 10,
    status: 'active',
    notes: 'Electronic playlist campaign targeting Spotify editorial and indie playlists.',
  },
];

async function generateRenameSQL() {
  console.log('📝 LIBERTY CAMPAIGN RENAME SQL');
  console.log('='.repeat(60));
  console.log('');
  console.log('⚠️  IMPORTANT: You need your user ID first!');
  console.log('');
  console.log('Run this query to find your user ID:');
  console.log('');
  console.log('SELECT id, email FROM auth.users;');
  console.log('');
  console.log('Then replace YOUR_USER_ID in the SQL below with your actual ID');
  console.log('');
  console.log('─'.repeat(60));
  console.log('');

  libertyCampaigns.forEach((campaign, index) => {
    console.log(`-- Campaign ${index + 1}: ${campaign.name}`);
    console.log('UPDATE campaigns');
    console.log('SET');
    console.log(`  name = '${campaign.name}',`);
    console.log(`  artist_name = '${campaign.artist_name}',`);
    console.log(`  platform = '${campaign.platform}',`);
    console.log(`  genre = '${campaign.genre}',`);
    console.log(`  start_date = '${campaign.start_date}',`);
    console.log(`  end_date = '${campaign.end_date}',`);
    console.log(`  budget = ${campaign.budget},`);
    console.log(`  target_reach = ${campaign.target_reach},`);
    console.log(`  actual_reach = ${campaign.actual_reach},`);
    console.log(`  status = '${campaign.status}',`);
    console.log(`  notes = '${campaign.notes.replace(/'/g, "''")}'`);
    console.log("WHERE user_id = 'YOUR_USER_ID'");
    console.log("  AND (name IS NULL OR name = '' OR name = 'Untitled Campaign')");
    console.log('LIMIT 1;');
    console.log('');
  });

  console.log('─'.repeat(60));
  console.log('');
  console.log('✅ Copy the SQL above and run it in Supabase SQL Editor');
  console.log('   URL: https://supabase.com/dashboard/project/mjfhegawkusjlkcgfevp/sql');
  console.log('');
}

generateRenameSQL().catch(console.error);

