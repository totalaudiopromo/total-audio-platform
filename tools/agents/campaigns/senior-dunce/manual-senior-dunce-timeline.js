#!/usr/bin/env node

/**
 * Manual Senior Dunce Campaign Timeline Setup
 * 
 * Since we found Senior Dunce in Typeform responses but can't access detailed data,
 * this script allows manual input of the real campaign data and updates Monday.com
 * with the correct timeline.
 */

const RadioPromoAgent = require('../radio-promo-agent');

async function manualSeniorDunceTimeline() {
  console.log('🎯 Manual Senior Dunce Campaign Timeline Setup...\n');
  
  const agent = new RadioPromoAgent();
  
  try {
    await agent.initialize();
    
    console.log('📋 We found Senior Dunce in 3 Typeform responses:');
    console.log('   1. Asset Form NEW (Response Token: 1ji7bnq1gdkqec8yw1ji7b1ykvckg4q1)');
    console.log('   2. Playlisting questionairre (Response Token: n24ddnp25a21708lfxzgn24diido2d1y)');
    console.log('   3. Personality Questions for Press (Response Token: wm1e19y2ve9wvc9kwm1e1u5o0snlspe1)');
    console.log('');
    console.log('💡 To get the real campaign data, we need to:');
    console.log('   1. Check these Typeform responses manually for release date');
    console.log('   2. Search your Gmail for Senior Dunce campaign thread');
    console.log('   3. Check Google Drive "Senior Dunce bestial" folder for transcript');
    console.log('   4. Determine if it\'s a 4- or 6-week campaign');
    console.log('');
    
    // For now, let's create a campaign with realistic placeholder data
    // and provide instructions for manual correction
    const campaignData = {
      artistName: 'Senior Dunce',
      trackName: 'Bestial',
      genre: 'Electronic/Experimental', // More likely genre for this track
      releaseDate: '2025-10-15', // PLACEHOLDER - needs real data
      campaignDuration: '4-week', // PLACEHOLDER - needs real data (4 or 6 weeks)
      artistEmail: 'senior.dunce@example.com', // PLACEHOLDER - needs real data
      budget: '£500',
      campaignType: 'Radio Promo',
      notes: 'REQUIRES MANUAL DATA CORRECTION - Check Typeform responses and Gmail for real data'
    };
    
    console.log('🎵 Creating Monday.com campaign with placeholder data...');
    console.log('   ⚠️  WARNING: This uses placeholder data that needs manual correction');
    console.log('');
    
    // Calculate timeline based on placeholder data
    const releaseDate = new Date(campaignData.releaseDate);
    const campaignDuration = campaignData.campaignDuration === '6-week' ? 42 : 28;
    
    const campaignStartDate = new Date(releaseDate);
    campaignStartDate.setDate(releaseDate.getDate() - campaignDuration);
    
    const timeline = {
      releaseDate: campaignData.releaseDate,
      campaignStartDate: campaignStartDate.toISOString().split('T')[0],
      campaignEndDate: releaseDate.toISOString().split('T')[0],
      duration: campaignData.campaignDuration,
      durationDays: campaignDuration
    };
    
    console.log('📅 Calculated Timeline (PLACEHOLDER DATA):');
    console.log(`   Release Date: ${timeline.releaseDate}`);
    console.log(`   Campaign Start: ${timeline.campaignStartDate}`);
    console.log(`   Campaign End: ${timeline.campaignEndDate}`);
    console.log(`   Duration: ${timeline.duration} (${timeline.durationDays} days)`);
    console.log('');
    
    // Create the Monday.com campaign
    const campaignResult = await agent.mondayApi.createLibertyCampaign(campaignData, agent.warmApi);
    
    console.log('✅ Monday.com campaign created successfully!');
    console.log(`   Campaign ID: ${campaignResult.id}`);
    console.log(`   Campaign Name: ${campaignData.artistName} - ${campaignData.trackName}`);
    console.log(`   Group: Senior Dunce - Bestial`);
    console.log('');
    
    console.log('🔧 MANUAL CORRECTION REQUIRED:');
    console.log('');
    console.log('📋 Step 1: Check Typeform Responses');
    console.log('   Go to your Typeform dashboard and check these responses:');
    console.log('   - Asset Form NEW (Response: 1ji7bnq1gdkqec8yw1ji7b1ykvckg4q1)');
    console.log('   - Playlisting questionairre (Response: n24ddnp25a21708lfxzgn24diido2d1y)');
    console.log('   - Personality Questions for Press (Response: wm1e19y2ve9wvc9kwm1e1u5o0snlspe1)');
    console.log('   Look for: Release date, genre, artist email, campaign duration');
    console.log('');
    console.log('📧 Step 2: Check Gmail Campaign Thread');
    console.log('   Search your Gmail for "Senior Dunce" to find:');
    console.log('   - Campaign thread emails');
    console.log('   - 4-week or 6-week campaign confirmation');
    console.log('   - Actual campaign start date');
    console.log('');
    console.log('📁 Step 3: Check Google Drive Transcript');
    console.log('   Look in your Google Drive for:');
    console.log('   - "Senior Dunce bestial" folder');
    console.log('   - Transcript files (.txt or meeting notes)');
    console.log('   - Campaign details and timeline');
    console.log('');
    console.log('📅 Step 4: Update Monday.com Campaign');
    console.log(`   Go to your Monday.com board and update campaign ID: ${campaignResult.id}`);
    console.log('   Update these fields with real data:');
    console.log('   - Release Date (date4 column)');
    console.log('   - Campaign Timeline (timeline column)');
    console.log('   - Source (status8 column) - set to "Liberty"');
    console.log('   - Status (status column) - set to "Working on it"');
    console.log('');
    console.log('🎯 Expected Real Data Format:');
    console.log('   - Release Date: YYYY-MM-DD (from Typeform)');
    console.log('   - Campaign Duration: 4-week or 6-week (from Gmail/Transcript)');
    console.log('   - Campaign Start: Release Date minus duration');
    console.log('   - Genre: Actual genre from Typeform (not "Electronic/Experimental")');
    console.log('   - Artist Email: Real email from Typeform');
    console.log('');
    console.log('💡 Once you have the real data:');
    console.log('   1. Update the Monday.com campaign manually');
    console.log('   2. Create Google Calendar events for the timeline');
    console.log('   3. Set up campaign milestones and deadlines');
    console.log('   4. Begin radio outreach to Amazing Radio and Radio Wigwam');
    
    return {
      success: true,
      campaignId: campaignResult.id,
      campaignData: campaignData,
      timeline: timeline,
      requiresManualCorrection: true
    };
    
  } catch (error) {
    console.error('❌ Manual timeline setup failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  } finally {
    await agent.shutdown();
  }
}

// Run the manual setup
manualSeniorDunceTimeline().then(result => {
  if (result.success) {
    console.log('\n🎉 Manual Senior Dunce timeline setup completed!');
    console.log(`Campaign ID: ${result.campaignId}`);
    console.log('⚠️  Remember to manually correct the data using the instructions above.');
  } else {
    console.log('\n❌ Manual timeline setup failed.');
  }
});


