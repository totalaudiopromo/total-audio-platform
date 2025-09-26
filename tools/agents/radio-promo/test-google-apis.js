#!/usr/bin/env node

/**
 * Test Google APIs without OAuth flow
 * Let's see what we can access with your current setup
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function testGoogleAPIs() {
  console.log('🧪 Testing Google APIs Access...\n');
  
  try {
    // Check if we have existing tokens
    const tokenPath = path.join(__dirname, 'gmail-token.json');
    let hasTokens = false;
    
    if (fs.existsSync(tokenPath)) {
      console.log('✅ Found existing token file');
      hasTokens = true;
    } else {
      console.log('⚠️  No existing token file found');
    }
    
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    if (!fs.existsSync(credentialsPath)) {
      throw new Error('No gmail-credentials.json file found');
    }
    
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    console.log('✅ Loaded Google credentials');
    console.log(`   Project ID: ${credentials.installed.project_id}`);
    console.log(`   Client ID: ${credentials.installed.client_id.substring(0, 20)}...`);
    console.log(`   Redirect URIs: ${credentials.installed.redirect_uris.join(', ')}`);
    console.log('');
    
    // Test with API key if available
    if (process.env.GOOGLE_API_KEY) {
      console.log('🔑 Testing with Google API Key...');
      
      // Test Gemini API (this doesn't require OAuth)
      try {
        const genAI = require('@google/generative-ai');
        const genAIKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
        
        if (genAIKey) {
          const model = genAI.getGenerativeModel({ model: 'gemini-pro', apiKey: genAIKey });
          const result = await model.generateContent('Hello, test message');
          console.log('   ✅ Gemini API: Working');
        }
      } catch (error) {
        console.log(`   ❌ Gemini API: ${error.message}`);
      }
    }
    
    // Test MCP server approach
    console.log('\n🔗 Testing MCP Server Integration...');
    try {
      const { spawn } = require('child_process');
      
      // Check if MCP server is available
      const mcpServerPath = path.join(__dirname, 'mcp-servers', 'google-services-mcp.js');
      if (fs.existsSync(mcpServerPath)) {
        console.log('   ✅ MCP Server file exists');
        
        // Try to load the MCP server module
        const mcpServer = require('./mcp-servers/google-services-mcp');
        console.log('   ✅ MCP Server module loaded');
        
        // Test MCP server functionality
        if (mcpServer.testConnection) {
          const mcpResult = await mcpServer.testConnection();
          console.log(`   ✅ MCP Server: ${mcpResult}`);
        }
      } else {
        console.log('   ❌ MCP Server file not found');
      }
    } catch (error) {
      console.log(`   ⚠️  MCP Server: ${error.message}`);
    }
    
    // Test direct API access with service account (if available)
    console.log('\n🔐 Testing Service Account Access...');
    const serviceAccountPath = path.join(__dirname, 'service-account-key.json');
    if (fs.existsSync(serviceAccountPath)) {
      console.log('   ✅ Service account key found');
      try {
        const auth = new google.auth.GoogleAuth({
          keyFile: serviceAccountPath,
          scopes: [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/calendar.readonly'
          ]
        });
        
        const authClient = await auth.getClient();
        console.log('   ✅ Service account authentication successful');
        
        // Test Gmail with service account
        try {
          const gmail = google.gmail({ version: 'v1', auth: authClient });
          // This might fail if service account doesn't have domain-wide delegation
          console.log('   ⚠️  Gmail access requires domain-wide delegation setup');
        } catch (error) {
          console.log(`   ⚠️  Gmail: ${error.message}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Service account: ${error.message}`);
      }
    } else {
      console.log('   ⚠️  No service account key found');
    }
    
    console.log('\n📋 Summary & Recommendations:');
    console.log('==============================');
    
    if (hasTokens) {
      console.log('✅ You have existing OAuth tokens - Google APIs should work');
      console.log('   Try running: node radio-promo-agent.js find-liberty-campaigns-gmail');
    } else {
      console.log('⚠️  No OAuth tokens found - you need to complete OAuth flow');
      console.log('');
      console.log('🔧 OAuth Setup Options:');
      console.log('1. Run the OAuth flow manually:');
      console.log('   node fix-google-oauth.js');
      console.log('');
      console.log('2. Or use the MCP server approach (recommended):');
      console.log('   The agent will use MCP server for Google services');
      console.log('');
      console.log('3. Or set up service account with domain-wide delegation');
      console.log('   (More complex but doesn\'t require OAuth flow)');
    }
    
    console.log('\n💡 The MCP server approach might be the most reliable');
    console.log('   since it handles authentication differently');
    
  } catch (error) {
    console.error('❌ Google APIs test failed:', error.message);
  }
}

// Run the test
testGoogleAPIs();


