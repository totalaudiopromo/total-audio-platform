#!/usr/bin/env node

/**
 * Test Email Tracking System
 *
 * Demonstrates how to use the universal email tracker
 * with any email system (Gmail, Outlook, Mailchimp, etc.)
 */

require('dotenv').config();

const UniversalEmailTracker = require('./integrations/universal-email-tracker');

async function testEmailTracking() {
  console.log('📧 Testing Universal Email Tracking System\n');

  try {
    // Initialize tracker
    const tracker = new UniversalEmailTracker();

    // Test 1: Health check
    console.log('='.repeat(60));
    console.log('TEST 1: Health Check');
    console.log('='.repeat(60));

    const health = await tracker.healthCheck();
    console.log('🏥 System Health:');
    console.log(`   Status: ${health.status}`);
    console.log(`   Tracking URL: ${health.trackingUrl}`);
    console.log(`   Records: ${health.tracking.totalRecords}`);
    console.log('');

    // Test 2: Prepare email for tracking
    console.log('='.repeat(60));
    console.log('TEST 2: Prepare Email for Tracking');
    console.log('='.repeat(60));

    const emailContent = `
      <h2>New House Pop Track: Senior Dunce - Bestial</h2>
      <p>Hi Sarah,</p>
      <p>I hope you're well! I'm reaching out from Liberty Music PR with a new house pop track that I think would be perfect for BBC Radio 1.</p>
      
      <p><strong>Senior Dunce - "Bestial"</strong> is a fresh house pop track that combines commercial appeal with artistic integrity.</p>
      
      <p>The track has:</p>
      <ul>
        <li>Strong commercial potential with catchy hooks</li>
        <li>Radio-ready production values</li>
        <li>Perfect for drive time and evening shows</li>
        <li>Already gaining traction with early supporters</li>
      </ul>
      
      <p>I'd love to send you the track for your consideration. Would you like me to send over the track and press materials?</p>
      
      <p>You can also check out our <a href="https://libertymusicpr.com">website</a> for more information.</p>
      
      <p>Best regards,<br>
      Chris Schofield<br>
      Liberty Music PR<br>
      <a href="mailto:chrisschofield@libertymusicpr.com">chrisschofield@libertymusicpr.com</a></p>
    `;

    const emailId = 'email-' + Date.now();
    const contactId = 'sarah-johnson-bbc-radio-1';
    const campaignId = 'senior-dunce-bestial-campaign';

    const trackedEmail = tracker.prepareEmailForTracking(
      emailContent,
      emailId,
      contactId,
      campaignId
    );

    console.log('📧 Email prepared for tracking:');
    console.log(`   Email ID: ${emailId}`);
    console.log(`   Contact ID: ${contactId}`);
    console.log(`   Campaign ID: ${campaignId}`);
    console.log(`   Content Length: ${trackedEmail.content.length} characters`);
    console.log(`   Tracking Pixel: ${trackedEmail.trackingInfo.pixelId ? 'Added' : 'Not added'}`);
    console.log(`   Tracking Links: ${trackedEmail.trackingInfo.linkCount}`);
    console.log('');

    // Test 3: Show sending instructions
    console.log('='.repeat(60));
    console.log('TEST 3: Sending Instructions');
    console.log('='.repeat(60));

    const instructions = trackedEmail.instructions;
    console.log('📋 Sending Instructions for Different Email Systems:');
    console.log('');

    Object.entries(instructions).forEach(([system, info]) => {
      console.log(`📧 ${system.toUpperCase()}:`);
      console.log(`   Method: ${info.method}`);
      console.log(`   Notes: ${info.notes}`);
      console.log('');
    });

    // Test 4: Simulate tracking events
    console.log('='.repeat(60));
    console.log('TEST 4: Simulate Tracking Events');
    console.log('='.repeat(60));

    console.log('📧 Simulating email open...');
    await tracker.emailTracking.processOpenTracking(
      trackedEmail.trackingInfo.pixelId,
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      '192.168.1.100'
    );

    console.log('🔗 Simulating link clicks...');
    const linkMatches = trackedEmail.content.match(/click\/([^"]+)/g);
    if (linkMatches && linkMatches.length > 0) {
      for (let i = 0; i < Math.min(2, linkMatches.length); i++) {
        const linkId = linkMatches[i].replace('click/', '');
        await tracker.emailTracking.processClickTracking(
          linkId,
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          '192.168.1.100'
        );
        console.log(`   Clicked link ${i + 1}`);
      }
    }
    console.log('');

    // Test 5: Get campaign performance
    console.log('='.repeat(60));
    console.log('TEST 5: Campaign Performance');
    console.log('='.repeat(60));

    const performance = tracker.getCampaignPerformance(campaignId);
    console.log('');

    // Test 6: Get contact engagement
    console.log('='.repeat(60));
    console.log('TEST 6: Contact Engagement');
    console.log('='.repeat(60));

    const engagement = tracker.getContactEngagement(contactId);
    console.log('');

    // Test 7: Generate tracking report
    console.log('='.repeat(60));
    console.log('TEST 7: Tracking Report');
    console.log('='.repeat(60));

    const report = tracker.generateTrackingReport(campaignId);
    console.log('📊 Tracking Report Generated:');
    console.log(`   Campaign: ${report.campaignId}`);
    console.log(`   Generated: ${report.generatedAt}`);
    console.log(`   Summary:`);
    console.log(`     Total Emails: ${report.summary.totalEmails}`);
    console.log(`     Open Rate: ${report.summary.openRate}`);
    console.log(`     Click Rate: ${report.summary.clickRate}`);
    console.log(`     Click-Through Rate: ${report.summary.clickThroughRate}`);
    console.log(`   Recommendations: ${report.recommendations.length}`);

    report.recommendations.forEach((rec, index) => {
      console.log(`     ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);
    });
    console.log('');

    // Test 8: Export data
    console.log('='.repeat(60));
    console.log('TEST 8: Export Tracking Data');
    console.log('='.repeat(60));

    const csvData = tracker.emailTracking.exportToCSV(campaignId);
    console.log(`📁 CSV Export Generated: ${csvData.split('\n').length - 1} records`);
    console.log('   (First few lines):');
    csvData
      .split('\n')
      .slice(0, 3)
      .forEach(line => {
        console.log(`   ${line}`);
      });
    console.log('');

    // Summary
    console.log('='.repeat(60));
    console.log('🎉 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log('✅ Universal Email Tracking System is working!');
    console.log('');
    console.log('🚀 Key Features Demonstrated:');
    console.log('   • Email open tracking with invisible pixels');
    console.log('   • Link click tracking with redirects');
    console.log('   • Campaign performance analytics');
    console.log('   • Contact engagement scoring');
    console.log('   • Automated recommendations');
    console.log('   • CSV data export');
    console.log('   • Works with any email system');
    console.log('');
    console.log('💰 Benefits:');
    console.log('   • No need for Mailchimp or paid services');
    console.log('   • Works with Gmail, Outlook, any email system');
    console.log('   • Real-time tracking and analytics');
    console.log('   • Engagement scoring for better targeting');
    console.log('   • Automated recommendations for improvement');
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('   1. Deploy tracking server (Vercel, Netlify, etc.)');
    console.log('   2. Update TRACKING_BASE_URL in your .env');
    console.log('   3. Integrate with your email sending system');
    console.log('   4. Start tracking your radio promo campaigns!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run the test
if (require.main === module) {
  testEmailTracking();
}

module.exports = { testEmailTracking };
