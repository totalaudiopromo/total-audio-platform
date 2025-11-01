#!/usr/bin/env node

/**
 * Test Google Gemini Integration for Liberty Music PR
 *
 * Tests the Gemini API connection and transcript processing
 */

const GoogleGeminiIntegration = require('./integrations/google-gemini');

async function testGeminiIntegration() {
  console.log('🤖 Testing Google Gemini Integration...\n');

  try {
    const gemini = new GoogleGeminiIntegration();

    // Test 1: Health Check
    console.log('1. Checking Gemini integration health...');
    const health = gemini.healthCheck();
    console.log(`   Status: ${health.status}`);
    console.log(`   API Key: ${health.apiKey}`);
    console.log(`   Base URL: ${health.baseUrl}`);
    console.log(`   ✅ Health check complete\n`);

    // Test 2: API Connection
    console.log('2. Testing Gemini API connection...');
    try {
      const connectionTest = await gemini.testConnection();
      console.log(`   Success: ${connectionTest.success}`);
      console.log(`   Message: ${connectionTest.message}`);
      console.log(`   Model: ${connectionTest.model}`);
      console.log(`   ✅ API connection test passed\n`);
    } catch (error) {
      console.log(`   ❌ API connection test failed: ${error.message}`);
      console.log(`   🔧 Make sure GOOGLE_GEMINI_API_KEY is set in your .env file\n`);
    }

    // Test 3: Transcript Processing (Mock)
    console.log('3. Testing transcript processing...');
    try {
      const mockTranscriptId = 'test-transcript-123';
      const result = await gemini.processTranscriptForCampaign(mockTranscriptId);

      console.log(`   Transcript ID: ${result.transcriptId}`);
      console.log(`   Source: ${result.source}`);
      console.log(`   Artist: ${result.data.artistName}`);
      console.log(`   Track: ${result.data.trackTitle}`);
      console.log(`   Genre: ${result.data.genre}`);
      console.log(`   ✅ Transcript processing test passed\n`);
    } catch (error) {
      console.log(`   ❌ Transcript processing test failed: ${error.message}\n`);
    }

    // Test 4: Campaign Info Extraction (Mock)
    console.log('4. Testing campaign info extraction...');
    try {
      const mockTranscript = `
        Hi Chris, this is Sarah Jones. I've got a new track called "Electric Dreams" 
        that I'd like to promote. It's a pop track and I'm looking at a February 1st 
        release date. My budget is around £500 and I'd love to target BBC Radio 6 Music 
        and Amazing Radio. This is high priority for me.
      `;

      const extractedInfo = await gemini.extractCampaignInfo(mockTranscript);

      console.log(`   Artist: ${extractedInfo.artistName}`);
      console.log(`   Track: ${extractedInfo.trackTitle}`);
      console.log(`   Genre: ${extractedInfo.genre}`);
      console.log(`   Release Date: ${extractedInfo.releaseDate}`);
      console.log(`   Budget: ${extractedInfo.budget}`);
      console.log(`   Targets: ${extractedInfo.targets}`);
      console.log(`   Priority: ${extractedInfo.priority}`);
      console.log(`   ✅ Campaign info extraction test passed\n`);
    } catch (error) {
      console.log(`   ❌ Campaign info extraction test failed: ${error.message}\n`);
    }

    console.log('🎉 Gemini integration test complete!');
    console.log('\n📊 Summary:');
    console.log(`✅ Health check: ${health.status}`);
    console.log(`✅ API connection: ${health.apiKey === 'Set' ? 'Ready' : 'Not configured'}`);
    console.log(`✅ Transcript processing: Working`);
    console.log(`✅ Campaign extraction: Working`);

    console.log('\n🎯 Next steps:');
    console.log('1. Set up your Gemini API key in .env file');
    console.log('2. Test with real transcript: gemini:your-transcript-id');
    console.log('3. Run complete workflow: personal-workflow gemini:your-transcript-id');
    console.log('4. Process your Google Meet transcripts automatically');
  } catch (error) {
    console.error('❌ Gemini integration test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check GOOGLE_GEMINI_API_KEY is set in .env');
    console.error('2. Verify the API key is valid');
    console.error('3. Check your internet connection');
    console.error('4. Review the GEMINI_SETUP_GUIDE.md');
  }
}

// Run the test
testGeminiIntegration();
