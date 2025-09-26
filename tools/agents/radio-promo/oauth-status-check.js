#!/usr/bin/env node

/**
 * OAuth Status Check - Liberty Radio Promo Agent
 *
 * Checks the current status of Google OAuth integration and provides next steps
 */

const fs = require('fs');
const path = require('path');

function checkOAuthStatus() {
  console.log('🔍 OAuth Status Check - Liberty Radio Promo Agent\n');

  const results = {
    credentials: false,
    tokens: false,
    nextSteps: []
  };

  // Check credentials file
  const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
  if (fs.existsSync(credentialsPath)) {
    console.log('✅ Gmail credentials found');
    results.credentials = true;

    try {
      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      const clientId = credentials.installed.client_id;
      console.log(`   Client ID: ${clientId}`);
      console.log(`   Project: ${credentials.installed.project_id}`);
    } catch (error) {
      console.log('⚠️  Credentials file exists but is corrupted');
    }
  } else {
    console.log('❌ Gmail credentials missing');
    results.nextSteps.push('Create gmail-credentials.json file');
  }

  // Check tokens file
  const tokenPath = path.join(__dirname, 'gmail-token.json');
  if (fs.existsSync(tokenPath)) {
    console.log('✅ OAuth tokens found');
    results.tokens = true;

    try {
      const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      console.log('   Token types:', Object.keys(tokens).join(', '));

      // Check if tokens are expired
      if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
        console.log('⚠️  Access token expired');
        results.nextSteps.push('Refresh OAuth tokens');
      }
    } catch (error) {
      console.log('⚠️  Token file exists but is corrupted');
      results.nextSteps.push('Re-run OAuth setup');
    }
  } else {
    console.log('❌ OAuth tokens missing');
    results.nextSteps.push('Complete OAuth setup');
  }

  // Check agent integration
  const agentPath = path.join(__dirname, '../radio-promo-agent.js');
  if (fs.existsSync(agentPath)) {
    console.log('✅ Radio Promo Agent found');
  } else {
    console.log('❌ Radio Promo Agent missing');
    results.nextSteps.push('Check agent file location');
  }

  console.log('\n📋 Integration Status Summary:');
  console.log('================================');

  if (results.credentials && results.tokens) {
    console.log('🎉 OAuth Integration: READY');
    console.log('\n✨ You can now run:');
    console.log('   node radio-promo-agent.js find-liberty-campaigns-gmail');
  } else if (results.credentials && !results.tokens) {
    console.log('🔧 OAuth Integration: NEEDS TOKENS');
    console.log('\n🔗 Generated OAuth URL:');

    // Show the OAuth URL for convenience
    try {
      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      const clientId = credentials.installed.client_id;
      const scopes = [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/calendar.readonly'
      ];
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=${encodeURIComponent(scopes.join(' '))}&prompt=consent&response_type=code&client_id=${clientId}&redirect_uri=postmessage`;
      console.log(`   ${authUrl}`);
    } catch (error) {
      // Fallback
    }

    console.log('\n📝 Complete OAuth setup:');
    console.log('   1. Fix Google Cloud Console (see oauth-setup-guide.md)');
    console.log('   2. Run: node simple-oauth-test.js');
    console.log('   3. Follow the OAuth flow');
  } else {
    console.log('🚨 OAuth Integration: NOT CONFIGURED');
    console.log('\n📚 Setup Guide: oauth-setup-guide.md');
  }

  // Show MCP server fallback status
  console.log('\n🔄 MCP Server Fallback:');
  const mcpPath = path.join(__dirname, 'mcp-servers/google-services-mcp.js');
  if (fs.existsSync(mcpPath)) {
    console.log('✅ MCP server available as fallback');
    if (!results.tokens) {
      console.log('   💡 Agent will use MCP server until OAuth is configured');
    }
  } else {
    console.log('❌ MCP server missing');
  }

  // Next steps
  if (results.nextSteps.length > 0) {
    console.log('\n🎯 Next Steps:');
    results.nextSteps.forEach((step, index) => {
      console.log(`   ${index + 1}. ${step}`);
    });
  }

  console.log('\n📞 Need help?');
  console.log('   Check: oauth-setup-guide.md');
  console.log('   Or run: node simple-oauth-test.js');

  return results;
}

// Run if called directly
if (require.main === module) {
  checkOAuthStatus();
}

module.exports = { checkOAuthStatus };