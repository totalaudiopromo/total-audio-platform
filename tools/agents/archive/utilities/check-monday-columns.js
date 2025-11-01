#!/usr/bin/env node

/**
 * Check Monday.com Board Columns and Structure
 */

require('dotenv').config();
const MondayApiIntegration = require('./integrations/monday-api');

async function checkMondayColumns() {
  console.log('📋 Checking Monday.com Board Structure and Columns...\n');

  const mondayApi = new MondayApiIntegration();

  try {
    console.log('🔍 Getting board structure...');

    const boardStructure = await mondayApi.getLibertyBoardStructure();

    console.log(`✅ Board: ${boardStructure.name}`);
    console.log(`   Board ID: ${boardStructure.id}`);
    console.log('');

    console.log('📊 Available Columns:');
    boardStructure.columns.forEach((column, index) => {
      console.log(`   ${index + 1}. ${column.title}`);
      console.log(`      ID: ${column.id}`);
      console.log(`      Type: ${column.type}`);
      if (column.settings_str) {
        console.log(`      Settings: ${column.settings_str}`);
      }
      console.log('');
    });

    console.log('📁 Available Groups:');
    boardStructure.groups.forEach((group, index) => {
      console.log(`   ${index + 1}. ${group.title}`);
      console.log(`      ID: ${group.id}`);
      console.log(`      Color: ${group.color}`);
      console.log('');
    });

    console.log('💡 Column Mapping for Campaign Creation:');
    console.log('   Current mapping uses hardcoded column IDs:');
    console.log('   - text: Artist Name');
    console.log('   - text1: Track Title');
    console.log('   - text2: Genre');
    console.log('   - date: Release Date');
    console.log('   - status: Status');
    console.log('   - text3: Budget');
    console.log('   - text4: Priority');
    console.log('');
    console.log('🔧 To fix campaign creation:');
    console.log('1. Match column IDs with actual board columns');
    console.log('2. Update createCampaignItem method');
    console.log('3. Test with correct column mapping');

    return boardStructure;
  } catch (error) {
    console.error('❌ Failed to check board structure:', error.message);
    return null;
  }
}

// Run the check
checkMondayColumns().then(boardStructure => {
  if (boardStructure) {
    console.log('\n✅ Board structure check completed successfully!');
    console.log('Use this information to fix the column mapping in createCampaignItem.');
  } else {
    console.log('\n❌ Board structure check failed.');
  }
});
