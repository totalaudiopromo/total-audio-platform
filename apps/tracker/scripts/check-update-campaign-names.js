#!/usr/bin/env node
/**
 * Check and update campaign names in Supabase
 * Ensures all campaigns have proper names for demo
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✓' : '✗');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function checkAndUpdateCampaignNames() {
  console.log('🔍 Checking campaign names in database...\n');

  try {
    // Query all campaigns - check what columns exist
    const { data: campaigns, error: queryError } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (queryError) {
      console.error('❌ Error querying campaigns:', queryError);
      console.error('\n💡 Trying to query with specific columns...');

      // Try querying with title instead of name
      const { data: campaignsAlt, error: altError } = await supabase
        .from('campaigns')
        .select('id, title, artist_name, platform, genre, status, created_at')
        .order('created_at', { ascending: false });

      if (altError) {
        console.error('❌ Error with alternative query:', altError);
        process.exit(1);
      }

      // Use campaignsAlt and map title to name
      campaigns = campaignsAlt.map(c => ({ ...c, name: c.title }));
    }

    if (!campaigns || campaigns.length === 0) {
      console.log('⚠️  No campaigns found in database');
      return;
    }

    console.log(`📊 Found ${campaigns.length} campaign(s):\n`);

    // Display current state
    campaigns.forEach((campaign, index) => {
      console.log(`Campaign ${index + 1}:`);
      console.log(`  ID: ${campaign.id}`);
      console.log(`  Name: ${campaign.name || campaign.title || '(EMPTY)'}`);
      console.log(`  Title: ${campaign.title || '(EMPTY)'}`);
      console.log(`  Artist: ${campaign.artist_name || '(EMPTY)'}`);
      console.log(`  Platform: ${campaign.platform || '(EMPTY)'}`);
      console.log(`  Genre: ${campaign.genre || '(EMPTY)'}`);
      console.log(`  Status: ${campaign.status || '(EMPTY)'}`);
      console.log('');
    });

    // Check which campaigns need names (check both name and title)
    // Also check if they need better names or are missing other fields
    const campaignsNeedingNames = campaigns.filter(c => {
      const hasName =
        (c.name && c.name.trim() !== '') || (c.title && c.title.trim() !== '');
      const hasAllFields = c.artist_name && c.platform && c.genre && c.status;
      // Update if name is generic or missing fields
      return (
        !hasName ||
        !hasAllFields ||
        c.name === 'maybe i - sadact' ||
        c.title === 'maybe i - sadact'
      );
    });

    if (campaignsNeedingNames.length === 0) {
      console.log('✅ All campaigns already have names!');
      return;
    }

    console.log(
      `⚠️  Found ${campaignsNeedingNames.length} campaign(s) without names\n`
    );

    // Generate realistic Liberty Music PR campaign names
    const campaignNameTemplates = [
      {
        name: 'Summer Radio Push - Single Release (Electronic/House)',
        artist: 'The Audio Dogs',
        platform: 'BBC Radio 1',
        genre: 'Electronic',
        status: 'active',
      },
      {
        name: 'EP Launch Campaign - Indie Alternative',
        artist: 'Liberty Artists',
        platform: 'BBC Radio 6 Music',
        genre: 'Indie',
        status: 'active',
      },
      {
        name: 'Album Campaign - Pop Single',
        artist: 'Liberty Pop Act',
        platform: 'Commercial Radio',
        genre: 'Pop',
        status: 'active',
      },
    ];

    // Update campaigns with names
    console.log('📝 Updating campaigns with names...\n');

    for (let i = 0; i < campaignsNeedingNames.length; i++) {
      const campaign = campaignsNeedingNames[i];
      const template = campaignNameTemplates[i] || campaignNameTemplates[0];

      // Use existing data if available, otherwise use template
      // Database schema only has: id, title, goal_total, release_date, user_id, created_at, updated_at
      // So we only update the title field
      const updateData = {
        title: template.name,
      };

      // Try to update name field too if it exists
      if (campaign.name !== undefined) {
        updateData.name = template.name;
      }

      const { data: updatedCampaign, error: updateError } = await supabase
        .from('campaigns')
        .update(updateData)
        .eq('id', campaign.id)
        .select()
        .single();

      if (updateError) {
        console.error(
          `❌ Error updating campaign ${campaign.id}:`,
          updateError
        );
      } else {
        console.log(`✅ Updated Campaign ${i + 1}:`);
        console.log(
          `   Name/Title: ${updatedCampaign.title || updatedCampaign.name}`
        );
        console.log(`   ID: ${updatedCampaign.id}`);
        console.log('');
      }
    }

    // Verify all campaigns now have names
    console.log('🔍 Verifying all campaigns have names...\n');

    const { data: verifyCampaigns, error: verifyError } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (verifyError) {
      console.error('❌ Error verifying campaigns:', verifyError);
      return;
    }

    // Map title to name if needed
    const mappedCampaigns = verifyCampaigns.map(c => ({
      ...c,
      name: c.name || c.title,
    }));

    const stillEmpty = mappedCampaigns.filter(
      c =>
        (!c.name || c.name.trim() === '') && (!c.title || c.title.trim() === '')
    );

    if (stillEmpty.length > 0) {
      console.log(
        `⚠️  Warning: ${stillEmpty.length} campaign(s) still have empty names`
      );
    } else {
      console.log('✅ All campaigns now have names!\n');
      console.log('📋 Final campaign list:');
      mappedCampaigns.forEach((campaign, index) => {
        console.log(
          `\n${index + 1}. ${campaign.name || campaign.title || 'Untitled'}`
        );
        console.log(`   Artist: ${campaign.artist_name || 'N/A'}`);
        console.log(`   Platform: ${campaign.platform || 'N/A'}`);
        console.log(`   Genre: ${campaign.genre || 'N/A'}`);
      });
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the check and update
checkAndUpdateCampaignNames()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
