#!/usr/bin/env node

/**
 * Test Real-time Play Monitoring System
 *
 * Demonstrates instant play alerts and analytics
 */

require('dotenv').config();
const AnalyticsAgent = require('./agents/analytics-agent');

async function testRealTimeMonitoring() {
  console.log('🎵 Testing Real-time Play Monitoring System...\n');

  // Initialize Analytics Agent
  const analyticsAgent = new AnalyticsAgent();

  try {
    // Initialize the agent
    console.log('1. 🔧 Initializing Analytics Agent...');
    const initialized = await analyticsAgent.initialize();
    if (!initialized) {
      console.error('❌ Failed to initialize Analytics Agent');
      return;
    }
    console.log('✅ Analytics Agent initialized\n');

    // Setup tracking for a test campaign
    console.log('2. 📊 Setting up tracking for test campaign...');
    const campaignData = {
      campaignId: 'test-campaign-' + Date.now(),
      artistName: 'Test Artist',
      startDate: new Date().toISOString().split('T')[0],
    };

    const trackingSetup = await analyticsAgent.setupTracking(campaignData);
    console.log('Tracking Setup:', JSON.stringify(trackingSetup, null, 2));
    console.log('✅ Tracking setup complete\n');

    // Start continuous monitoring
    console.log('3. 🔄 Starting continuous monitoring...');
    const monitoringStatus = await analyticsAgent.startContinuousMonitoring(campaignData);
    console.log('Monitoring Status:', JSON.stringify(monitoringStatus, null, 2));
    console.log('✅ Continuous monitoring started\n');

    // Get monitoring status
    console.log('4. 📈 Getting monitoring status...');
    const status = analyticsAgent.getMonitoringStatus();
    console.log('Monitoring Status:', JSON.stringify(status, null, 2));
    console.log('✅ Monitoring status retrieved\n');

    // Get campaign analytics
    console.log('5. 📊 Getting campaign analytics...');
    const campaignAnalytics = analyticsAgent.getCampaignAnalytics(campaignData.campaignId);
    console.log('Campaign Analytics:', JSON.stringify(campaignAnalytics, null, 2));
    console.log('✅ Campaign analytics retrieved\n');

    // Get overall analytics
    console.log('6. 📈 Getting overall analytics...');
    const overallAnalytics = analyticsAgent.getOverallAnalytics();
    console.log('Overall Analytics:', JSON.stringify(overallAnalytics, null, 2));
    console.log('✅ Overall analytics retrieved\n');

    // Health check
    console.log('7. 🏥 Running health check...');
    const health = await analyticsAgent.healthCheck();
    console.log('Health Check:', JSON.stringify(health, null, 2));
    console.log('✅ Health check complete\n');

    // Simulate monitoring for a few minutes
    console.log('8. ⏰ Simulating monitoring for 2 minutes...');
    console.log('   (In real usage, this would run continuously)');
    console.log('   (Check your WARM API for actual plays)');

    // Wait a bit to show monitoring is active
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get updated analytics
    const updatedAnalytics = analyticsAgent.getOverallAnalytics();
    console.log('Updated Analytics:', JSON.stringify(updatedAnalytics, null, 2));

    // Export analytics
    console.log('9. 📤 Exporting analytics data...');
    const jsonExport = analyticsAgent.exportAnalytics('json');
    console.log('JSON Export keys:', Object.keys(jsonExport));

    const csvExport = analyticsAgent.exportAnalytics('csv');
    console.log('CSV Export preview:', csvExport.substring(0, 200) + '...');
    console.log('✅ Analytics exported\n');

    // Stop monitoring
    console.log('10. 🛑 Stopping monitoring...');
    analyticsAgent.stopMonitoring(campaignData.campaignId);
    console.log('✅ Monitoring stopped\n');

    // Shutdown
    console.log('11. 🔌 Shutting down...');
    await analyticsAgent.shutdown();
    console.log('✅ Shutdown complete\n');

    console.log('🎉 Real-time monitoring test completed successfully!');
    console.log('\n📋 What this system provides:');
    console.log('   • Real-time play detection via WARM API');
    console.log('   • Instant alerts when tracks get played');
    console.log('   • Comprehensive analytics and reporting');
    console.log('   • Campaign performance tracking');
    console.log('   • Station performance analysis');
    console.log('   • Data export capabilities');
    console.log('   • Health monitoring and error handling');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
if (require.main === module) {
  testRealTimeMonitoring().catch(console.error);
}

module.exports = testRealTimeMonitoring;
