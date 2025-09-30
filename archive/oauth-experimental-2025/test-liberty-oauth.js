#!/usr/bin/env node

/**
 * Test Liberty OAuth Connection
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function testLibertyOAuth() {
  console.log('🧪 Testing Liberty OAuth Connection...\n');
  
  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    const { client_id, client_secret } = credentials.installed || credentials.web;
    
    // Load tokens
    const tokenPath = path.join(__dirname, 'liberty-tokens.json');
    if (!fs.existsSync(tokenPath)) {
      console.log('❌ No tokens found. Run: node liberty-oauth-setup.js');
      return;
    }
    
    const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    
    // Create OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      client_id, 
      client_secret, 
      'http://localhost:8080'
    );
    oAuth2Client.setCredentials(tokens);
    
    // Test Gmail
    console.log('📧 Testing Gmail...');
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    console.log(`   ✅ Gmail connected: ${profile.data.emailAddress}`);
    
    // Test Drive
    console.log('📁 Testing Google Drive...');
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const about = await drive.about.get({ fields: 'user' });
    console.log(`   ✅ Drive connected: ${about.data.user.emailAddress}`);
    
    // Test Calendar
    console.log('📅 Testing Google Calendar...');
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const calendarList = await calendar.calendarList.list();
    console.log(`   ✅ Calendar connected: ${calendarList.data.items.length} calendars found`);
    
    console.log('\n🎉 All Google services connected successfully!');
    console.log('✅ Ready to use the Radio Promo Agent');
    
  } catch (error) {
    console.error('❌ OAuth test failed:', error.message);
    console.log('\n🔧 Try running: node liberty-oauth-setup.js');
  }
}

testLibertyOAuth();
