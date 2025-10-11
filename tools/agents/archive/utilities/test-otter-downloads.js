#!/usr/bin/env node

/**
 * Test Otter.ai Downloads Processing for Liberty Music PR
 * 
 * Scans your Downloads folder for Otter.ai files and processes them for training
 */

const RadioPromoAgent = require('./radio-promo-agent');

async function testOtterDownloads() {
  console.log('📁 Testing Otter.ai Downloads Processing...\n');
  
  try {
    const agent = new RadioPromoAgent();
    await agent.initialize();
    
    // Test 1: Scan Downloads folder
    console.log('1. Scanning Downloads folder for Otter.ai files...');
    const trainingData = await agent.scanDownloadsForOtterFiles();
    
    console.log(`   Total files found: ${trainingData.totalFiles}`);
    console.log(`   Successfully processed: ${trainingData.processedFiles}`);
    console.log(`   Errors: ${trainingData.errors}`);
    console.log(`   ✅ Downloads scan complete\n`);
    
    // Test 2: Show processed files
    if (trainingData.processedFiles > 0) {
      console.log('2. Processed files:');
      trainingData.files.forEach((file, index) => {
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
      });
      console.log('');
    }
    
    // Test 3: Show errors
    if (trainingData.errors > 0) {
      console.log('3. Files with errors:');
      trainingData.errorFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.fileName}: ${file.error}`);
      });
      console.log('');
    }
    
    // Test 4: Test individual file processing
    if (trainingData.files.length > 0) {
      console.log('4. Testing individual file processing...');
      const firstFile = trainingData.files[0];
      console.log(`   Testing: ${firstFile.fileName}`);
      
      const individualResult = await agent.processTranscript(`downloads:${firstFile.fileName}`);
      console.log(`   Artist: ${individualResult.data.artistName || 'Not found'}`);
      console.log(`   Track: ${individualResult.data.trackTitle || 'Not found'}`);
      console.log(`   Genre: ${individualResult.data.genre || 'Not found'}`);
      console.log(`   ✅ Individual file processing works\n`);
    }
    
    console.log('🎉 Otter.ai downloads processing test complete!');
    console.log('\n📊 Summary:');
    console.log(`✅ Found ${trainingData.totalFiles} potential Otter.ai files`);
    console.log(`✅ Successfully processed ${trainingData.processedFiles} files`);
    console.log(`✅ Training data saved to ./training-data/`);
    
    console.log('\n🎯 Next steps:');
    console.log('1. Review the processed campaign briefs');
    console.log('2. Use specific files with: downloads:filename.txt');
    console.log('3. Run complete workflow: personal-workflow downloads:filename.txt');
    console.log('4. Set up Google Gemini for future transcripts');
    
    await agent.shutdown();
    
  } catch (error) {
    console.error('❌ Otter.ai downloads test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your Downloads folder has Otter.ai files');
    console.error('2. Ensure files are .txt format');
    console.error('3. Check file permissions');
    console.error('4. Verify file naming patterns');
  }
}

// Run the test
testOtterDownloads();

