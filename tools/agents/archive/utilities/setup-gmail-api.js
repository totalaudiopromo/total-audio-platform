#!/usr/bin/env node

/**
 * Gmail API Setup Script for Liberty Music PR
 *
 * This script helps you get Gmail API access for campaign discovery
 */

const fs = require('fs');
const path = require('path');

console.log('🔑 Gmail API Setup for Liberty Music PR\n');

console.log('📋 Step-by-step setup:');
console.log('');
console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Enable Gmail API:');
console.log('   - Go to "APIs & Services" → "Library"');
console.log('   - Search for "Gmail API"');
console.log('   - Click "Enable"');
console.log('');
console.log('4. Create OAuth 2.0 credentials:');
console.log('   - Go to "APIs & Services" → "Credentials"');
console.log('   - Click "Create Credentials" → "OAuth 2.0 Client ID"');
console.log('   - Choose "Desktop application"');
console.log('   - Download the JSON file');
console.log('');
console.log('5. Save the credentials file as: gmail-credentials.json');
console.log('6. Run this script again to get your access token');
console.log('');

// Check if credentials file exists
const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
if (fs.existsSync(credentialsPath)) {
  console.log('✅ Found gmail-credentials.json');
  console.log('Run: node setup-gmail-api.js --get-token');
} else {
  console.log('❌ gmail-credentials.json not found');
  console.log('Please download your OAuth credentials and save as gmail-credentials.json');
}

// If --get-token flag is provided, help with token generation
if (process.argv.includes('--get-token')) {
  console.log('\n🔐 To get your access token:');
  console.log('1. Install googleapis: npm install googleapis');
  console.log('2. Run the OAuth flow to get your token');
  console.log('3. Add the token to your .env file:');
  console.log('   GMAIL_ACCESS_TOKEN=your_access_token_here');
  console.log('');
  console.log('📧 The agent will then be able to:');
  console.log('- Search your Gmail for campaign emails');
  console.log('- Extract artist information from email threads');
  console.log('- Cross-reference with Typeform responses');
  console.log('- Find your actual Liberty Music PR campaigns');
}
