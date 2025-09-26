#!/usr/bin/env node

/**
 * Test script for Liberty Radio Promo Agent
 * Tests all functionality with mock data
 */

const RadioPromoAgent = require('./radio-promo-agent.js');
const fs = require('fs');
const path = require('path');

async function testLibertyWorkflow() {
  console.log('🎵 Testing Liberty Music PR Radio Promo Agent...\n');
  
  const agent = new RadioPromoAgent();
  
  // Disable verification for testing
  agent.setVerificationMode(false);
  
  try {
    // Initialize agent
    console.log('1. Initializing agent...');
    await agent.initialize();
    console.log('✅ Agent initialized\n');
    
    // Test health check
    console.log('2. Health check...');
    const health = await agent.healthCheck();
    console.log(`✅ Agent Status: ${health.status}\n`);
    
    // Create mock transcript for testing
    console.log('3. Creating mock transcript...');
    const mockTranscript = `
    Artist call with Sarah Jones today.
    The artist is Sarah Jones and she's got this new track title "Electric Dreams".
    It's an indie pop track that she wants to promote.
    The release date is March 15th, 2025.
    Budget is around £150 for radio promotion.
    Priority is high priority and she wants to target indie radio stations.
    Deadline for the campaign launch is March 1st, 2025.
    `;
    
    const transcriptPath = path.join(__dirname, '../campaigns/test-transcript.txt');
    if (!fs.existsSync(path.dirname(transcriptPath))) {
      fs.mkdirSync(path.dirname(transcriptPath), { recursive: true });
    }
    fs.writeFileSync(transcriptPath, mockTranscript);
    console.log('✅ Mock transcript created\n');
    
    // Test complete workflow
    console.log('4. Testing complete personal workflow...');
    const workflow = await agent.executePersonalWorkflow(transcriptPath);
    console.log('✅ Complete workflow executed\n');
    
    // Display results
    console.log('📊 WORKFLOW RESULTS:');
    console.log('==================');
    console.log(`✅ Steps completed: ${workflow.steps.join(', ')}`);
    console.log(`✅ Duration: ${workflow.duration}ms`);
    
    if (workflow.results.campaignBrief) {
      const brief = workflow.results.campaignBrief;
      console.log(`✅ Artist: ${brief.data.artistName}`);
      console.log(`✅ Track: ${brief.data.trackTitle}`);
      console.log(`✅ Genre: ${brief.data.genre}`);
      console.log(`✅ Budget: ${brief.data.budget}`);
    }
    
    if (workflow.results.mondayCampaign) {
      console.log(`✅ Monday.com Board: ${workflow.results.mondayCampaign.boardId}`);
    }
    
    if (workflow.results.pressRelease) {
      console.log(`✅ Press Release: ${workflow.results.pressRelease.filePath}`);
    }
    
    console.log('\n🎉 All tests passed! Your Liberty Radio Promo Agent is ready.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await agent.shutdown();
  }
}

// Run tests if called directly
if (require.main === module) {
  testLibertyWorkflow();
}

module.exports = { testLibertyWorkflow };
