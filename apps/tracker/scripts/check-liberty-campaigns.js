#!/usr/bin/env node
/**
 * Check if Liberty campaigns exist in database
 * Run: node scripts/check-liberty-campaigns.js
 */

// Load environment variables from .env.local manually
const fs = require('fs');
const path = require('path');
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
  console.error(
    '   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkLibertyCampaigns() {
  console.log('🔍 Checking for Liberty campaigns...\n');

  // Check for specific Liberty campaign names
  const libertyCampaignNames = ['KYARA', 'Senior Dunce', 'Concerta'];

  try {
    // Get all campaigns (we'll filter client-side since we can't use LIKE in JS client)
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('id, name, artist_name, platform, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching campaigns:', error.message);
      return;
    }

    if (!campaigns || campaigns.length === 0) {
      console.log('⚠️  No campaigns found in database');
      console.log('   This could mean:');
      console.log('   1. No campaigns exist yet');
      console.log(
        '   2. RLS policies require authentication (try logging in via UI first)'
      );
      console.log('   3. Campaigns exist but for a different user\n');
      console.log(
        '   💡 Try checking via the UI: http://localhost:3000/dashboard\n'
      );
      return;
    }

    console.log(`📊 Found ${campaigns.length} total campaign(s)\n`);

    // Check for Liberty campaigns
    const foundLibertyCampaigns = campaigns.filter(campaign => {
      const name = (campaign.name || '').toUpperCase();
      const artist = (campaign.artist_name || '').toUpperCase();
      return libertyCampaignNames.some(
        libertyName =>
          name.includes(libertyName.toUpperCase()) ||
          artist.includes(libertyName.toUpperCase())
      );
    });

    if (foundLibertyCampaigns.length > 0) {
      console.log('✅ LIBERTY CAMPAIGNS FOUND:\n');
      foundLibertyCampaigns.forEach(campaign => {
        console.log(`   • ${campaign.name}`);
        console.log(`     Artist: ${campaign.artist_name || 'N/A'}`);
        console.log(`     Platform: ${campaign.platform || 'N/A'}`);
        console.log(`     Status: ${campaign.status || 'N/A'}`);
        console.log('');
      });
      console.log("✅ You're ready for the demo!\n");
    } else {
      console.log('⚠️  LIBERTY CAMPAIGNS NOT FOUND\n');
      console.log('   Looking for:');
      libertyCampaignNames.forEach(name => {
        console.log(`   • ${name}`);
      });
      console.log('\n   Found campaigns:');
      campaigns.slice(0, 10).forEach(campaign => {
        console.log(`   • ${campaign.name} (${campaign.artist_name || 'N/A'})`);
      });
      if (campaigns.length > 10) {
        console.log(`   ... and ${campaigns.length - 10} more`);
      }
      console.log(
        '\n❌ You need to create Liberty campaigns before the demo.\n'
      );
      console.log('   Options:');
      console.log('   1. Run: npx ts-node scripts/seed-liberty-demo-data.ts');
      console.log(
        "      (Generates SQL - you'll need to run it in Supabase SQL Editor)"
      );
      console.log('   2. Create campaigns manually via the UI');
      console.log('   3. Update campaigns to use Liberty names\n');
    }

    // Show all campaigns for reference
    console.log('📋 ALL CAMPAIGNS IN DATABASE:');
    console.log('─'.repeat(60));
    campaigns.forEach((campaign, index) => {
      console.log(`${index + 1}. ${campaign.name}`);
      console.log(`   Artist: ${campaign.artist_name || 'N/A'}`);
      console.log(
        `   Platform: ${campaign.platform || 'N/A'} | Status: ${campaign.status || 'N/A'}`
      );
      console.log('');
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkLibertyCampaigns();
