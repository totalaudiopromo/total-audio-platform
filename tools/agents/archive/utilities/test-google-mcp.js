#!/usr/bin/env node

/**
 * Test Google Services MCP Server for Liberty Music PR
 *
 * Tests the MCP server functionality for Gmail, Drive, and Calendar
 */

const { GoogleServicesMCPServer } = require('./mcp-servers/google-services-mcp');

async function testGoogleMCP() {
  console.log('🔧 Testing Google Services MCP Server...\n');

  try {
    const mcpServer = new GoogleServicesMCPServer();

    // Test 1: List tools
    console.log('1. Testing tool listing...');
    const tools = await mcpServer.listTools();
    console.log(`   ✅ Found ${tools.tools.length} tools`);
    tools.tools.forEach(tool => {
      console.log(`   - ${tool.name}: ${tool.description}`);
    });
    console.log('');

    // Test 2: List resources
    console.log('2. Testing resource listing...');
    const resources = mcpServer.listResources();
    console.log(`   ✅ Found ${resources.resources.length} resources`);
    resources.resources.forEach(resource => {
      console.log(`   - ${resource.uri}: ${resource.name}`);
    });
    console.log('');

    // Test 3: Check Gmail profile (if authenticated)
    if (mcpServer.gmail) {
      console.log('3. Testing Gmail profile...');
      try {
        const profile = await mcpServer.getGmailProfile();
        const profileData = JSON.parse(profile.content[0].text);
        console.log(`   ✅ Connected to Gmail as: ${profileData.emailAddress}`);
        console.log(`   📧 Total messages: ${profileData.messagesTotal}`);
        console.log(`   📥 Total threads: ${profileData.threadsTotal}`);
      } catch (error) {
        console.log(`   ⚠️  Gmail profile: ${error.message}`);
      }
      console.log('');
    } else {
      console.log('3. Gmail not authenticated - need to run OAuth flow');
      console.log('');
    }

    // Test 4: Check Google Drive (if authenticated)
    if (mcpServer.drive) {
      console.log('4. Testing Google Drive...');
      try {
        const files = await mcpServer.getDriveFiles();
        const filesData = JSON.parse(files.content[0].text);
        console.log(`   ✅ Connected to Drive with ${filesData.length} files`);
      } catch (error) {
        console.log(`   ⚠️  Google Drive: ${error.message}`);
      }
      console.log('');
    } else {
      console.log('4. Google Drive not authenticated - need to run OAuth flow');
      console.log('');
    }

    // Test 5: Check Google Calendar (if authenticated)
    if (mcpServer.calendar) {
      console.log('5. Testing Google Calendar...');
      try {
        const events = await mcpServer.getCalendarEvents();
        const eventsData = JSON.parse(events.content[0].text);
        console.log(`   ✅ Connected to Calendar with ${eventsData.length} upcoming events`);
      } catch (error) {
        console.log(`   ⚠️  Google Calendar: ${error.message}`);
      }
      console.log('');
    } else {
      console.log('5. Google Calendar not authenticated - need to run OAuth flow');
      console.log('');
    }

    console.log('🎉 Google Services MCP Server test complete!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Run OAuth flow to authenticate:');
    console.log('   node simple-gmail-oauth.js');
    console.log('');
    console.log('2. Add MCP server to Claude Desktop:');
    console.log('   - Open Claude Desktop settings');
    console.log('   - Go to Model Context Protocol servers');
    console.log('   - Add server with config from mcp-config.json');
    console.log('');
    console.log('3. Test MCP integration:');
    console.log('   - Ask Claude to search Gmail for campaign emails');
    console.log('   - Ask Claude to create calendar events');
    console.log('   - Ask Claude to search Google Drive');
  } catch (error) {
    console.error('❌ MCP server test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure gmail-credentials.json exists');
    console.log('2. Run OAuth flow to get gmail-token.json');
    console.log('3. Check file paths in mcp-config.json');
  }
}

// Run the test
testGoogleMCP();
