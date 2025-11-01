#!/usr/bin/env node

/**
 * Test Otter.ai Downloads Only - Liberty Music PR
 *
 * One-time scan of your Downloads folder for Otter.ai files only
 * This is more targeted and won't get confused with other files
 */

const RadioPromoAgent = require('./radio-promo-agent');

async function testOtterOnly() {
  console.log('📁 Testing Otter.ai Downloads Only (One-Time Scan)...\n');

  try {
    const agent = new RadioPromoAgent();
    await agent.initialize();

    // Use the more targeted scan method
    console.log('🔍 Scanning Downloads folder for Otter.ai files only...');
    console.log('   Looking for files with "otter" in the name and .txt extension');
    console.log('   Excluding backup and old files\n');

    const otterData = await agent.scanOtterFilesOnly();

    console.log(`📊 Results:`);
    console.log(`   Total Otter.ai files found: ${otterData.totalFiles}`);
    console.log(`   Successfully processed: ${otterData.processedFiles}`);
    console.log(`   Errors: ${otterData.errors}`);
    console.log(`   Note: ${otterData.note}\n`);

    if (otterData.processedFiles > 0) {
      console.log('✅ Successfully processed files:');
      otterData.files.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.fileName}`);
        if (file.campaignBrief.data.artistName) {
          console.log(`      Artist: ${file.campaignBrief.data.artistName}`);
        }
        if (file.campaignBrief.data.trackTitle) {
          console.log(`      Track: ${file.campaignBrief.data.trackTitle}`);
        }
        if (file.campaignBrief.data.genre) {
          console.log(`      Genre: ${file.campaignBrief.data.genre}`);
        }
        console.log(`      Confidence: ${file.campaignBrief.confidence}%`);
        console.log('');
      });
    }

    if (otterData.errors > 0) {
      console.log('❌ Files with errors:');
      otterData.errorFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.fileName}: ${file.error}`);
      });
      console.log('');
    }

    if (otterData.totalFiles === 0) {
      console.log('ℹ️  No Otter.ai files found in Downloads folder');
      console.log('   Make sure your Otter.ai files have "otter" in the filename');
      console.log('   and are saved as .txt files');
      console.log('');
    }

    console.log('🎉 Otter.ai one-time scan complete!');
    console.log('\n📁 What was scanned:');
    console.log('   - Files with "otter" in the name');
    console.log('   - Files ending with .txt');
    console.log('   - Excluded backup and old files');
    console.log('   - One-time operation for training data');

    console.log('\n🎯 Next steps:');
    console.log('1. Review the processed campaign briefs');
    console.log('2. Use specific files with: downloads:filename.txt');
    console.log('3. Run complete workflow: personal-workflow downloads:filename.txt');
    console.log('4. Set up Google Gemini for future transcripts');

    await agent.shutdown();
  } catch (error) {
    console.error('❌ Otter.ai scan failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your Downloads folder has Otter.ai files');
    console.error('2. Ensure files have "otter" in the filename');
    console.error('3. Check files are .txt format');
    console.error('4. Verify file permissions');
  }
}

// Run the test
testOtterOnly();
