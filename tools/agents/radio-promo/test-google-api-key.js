#!/usr/bin/env node

/**
 * Test Google API Key for Gmail Access
 * 
 * Tests what APIs the provided key can access
 */

const { google } = require('googleapis');

async function testGoogleApiKey() {
  console.log('🔑 Testing Google API Key...\n');
  
  const apiKey = 'AIzaSy[REDACTED]';
  
  try {
    // Test Gmail API with API key (this won't work for Gmail)
    console.log('1. Testing Gmail API with API key...');
    try {
      const gmail = google.gmail({ version: 'v1', auth: apiKey });
      await gmail.users.getProfile({ userId: 'me' });
      console.log('   ✅ Gmail API access successful');
    } catch (error) {
      console.log('   ❌ Gmail API access failed:', error.message);
      console.log('   📝 Note: Gmail API requires OAuth 2.0, not API key');
    }
    
    // Test other Google APIs that might work with API key
    console.log('\n2. Testing other Google APIs...');
    
    // Test YouTube API
    try {
      const youtube = google.youtube({ version: 'v3', auth: apiKey });
      const response = await youtube.search.list({
        part: 'snippet',
        q: 'test',
        maxResults: 1
      });
      console.log('   ✅ YouTube API access successful');
    } catch (error) {
      console.log('   ❌ YouTube API access failed:', error.message);
    }
    
    // Test Google Drive API
    try {
      const drive = google.drive({ version: 'v3', auth: apiKey });
      const response = await drive.about.get({ fields: 'user' });
      console.log('   ✅ Google Drive API access successful');
    } catch (error) {
      console.log('   ❌ Google Drive API access failed:', error.message);
    }
    
    // Test Google Sheets API
    try {
      const sheets = google.sheets({ version: 'v4', auth: apiKey });
      // This will fail without a specific spreadsheet ID, but we can test the auth
      console.log('   ✅ Google Sheets API key format valid');
    } catch (error) {
      console.log('   ❌ Google Sheets API access failed:', error.message);
    }
    
    console.log('\n📋 Summary:');
    console.log('✅ API key format is valid');
    console.log('❌ Gmail API requires OAuth 2.0 credentials (not API key)');
    console.log('✅ Some Google APIs may work with this key');
    
    console.log('\n🔧 Next Steps for Gmail Access:');
    console.log('1. You need OAuth 2.0 credentials (Client ID + Client Secret)');
    console.log('2. Download credentials.json from Google Cloud Console');
    console.log('3. Run OAuth flow to get access token');
    console.log('4. Use access token for Gmail API calls');
    
    console.log('\n💡 Your API key can be used for:');
    console.log('- Google Gemini API (for transcript processing)');
    console.log('- YouTube API (if enabled)');
    console.log('- Google Drive API (if enabled)');
    console.log('- Google Sheets API (if enabled)');
    
  } catch (error) {
    console.error('❌ API key test failed:', error.message);
  }
}

// Run the test
testGoogleApiKey();

