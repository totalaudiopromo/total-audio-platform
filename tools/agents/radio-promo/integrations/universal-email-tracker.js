#!/usr/bin/env node

/**
 * Universal Email Tracker
 * 
 * Works with any email system - Gmail, Outlook, Mailchimp, etc.
 * Adds tracking to emails before sending
 */

const EmailTracking = require('./email-tracking');

class UniversalEmailTracker {
  constructor() {
    this.emailTracking = new EmailTracking();
    this.trackingBaseUrl = process.env.TRACKING_BASE_URL || 'http://localhost:3001/track';
  }

  /**
   * Prepare email for tracking (call this before sending)
   */
  prepareEmailForTracking(emailContent, emailId, contactId, campaignId) {
    console.log(`📧 Preparing email for tracking: ${emailId}`);
    
    const trackedEmail = this.emailTracking.generateTrackedEmail(
      emailContent,
      emailId,
      contactId,
      campaignId
    );
    
    return {
      content: trackedEmail.content,
      trackingInfo: trackedEmail.trackingData,
      instructions: this.getSendingInstructions(trackedEmail.trackingData)
    };
  }

  /**
   * Get sending instructions for different email systems
   */
  getSendingInstructions(trackingData) {
    return {
      gmail: {
        method: 'Gmail API or manual send',
        notes: 'Copy the tracked content and send via Gmail. Tracking will work automatically.',
        trackingUrl: this.trackingBaseUrl
      },
      outlook: {
        method: 'Outlook API or manual send',
        notes: 'Copy the tracked content and send via Outlook. Tracking will work automatically.',
        trackingUrl: this.trackingBaseUrl
      },
      mailchimp: {
        method: 'Mailchimp API',
        notes: 'Use the tracked content in your Mailchimp template. You can also use Mailchimp\'s built-in tracking.',
        trackingUrl: this.trackingBaseUrl
      },
      manual: {
        method: 'Manual copy/paste',
        notes: 'Copy the tracked content and paste into your email client. Make sure to send as HTML.',
        trackingUrl: this.trackingBaseUrl
      }
    };
  }

  /**
   * Track email sent (call this after sending)
   */
  trackEmailSent(emailId, contactId, campaignId, sentVia = 'unknown') {
    console.log(`📤 Tracking email sent: ${emailId} via ${sentVia}`);
    
    // This is just for logging - actual tracking happens when recipient opens/clicks
    const sentData = {
      emailId,
      contactId,
      campaignId,
      sentVia,
      sentAt: Date.now(),
      status: 'sent'
    };
    
    // You could store this in a separate "sent" tracking system
    return sentData;
  }

  /**
   * Get campaign performance
   */
  getCampaignPerformance(campaignId) {
    const stats = this.emailTracking.getCampaignStats(campaignId);
    
    console.log(`📊 Campaign Performance: ${campaignId}`);
    console.log(`   Total Emails: ${stats.totalEmails}`);
    console.log(`   Open Rate: ${stats.openRate.toFixed(1)}%`);
    console.log(`   Click Rate: ${stats.clickRate.toFixed(1)}%`);
    console.log(`   Click-Through Rate: ${stats.clickThroughRate.toFixed(1)}%`);
    
    return stats;
  }

  /**
   * Get contact engagement
   */
  getContactEngagement(contactId) {
    const engagement = this.emailTracking.getContactEngagement(contactId);
    
    console.log(`👤 Contact Engagement: ${contactId}`);
    console.log(`   Engagement Score: ${engagement.engagementScore}/100`);
    console.log(`   Open Rate: ${engagement.openRate.toFixed(1)}%`);
    console.log(`   Click Rate: ${engagement.clickRate.toFixed(1)}%`);
    console.log(`   Last Engagement: ${engagement.lastEngagement ? new Date(engagement.lastEngagement.timestamp).toLocaleString() : 'Never'}`);
    
    return engagement;
  }

  /**
   * Generate tracking report
   */
  generateTrackingReport(campaignId) {
    const stats = this.getCampaignPerformance(campaignId);
    
    const report = {
      campaignId,
      generatedAt: new Date().toISOString(),
      summary: {
        totalEmails: stats.totalEmails,
        uniqueOpens: stats.uniqueOpens,
        uniqueClicks: stats.uniqueClicks,
        openRate: `${stats.openRate.toFixed(1)}%`,
        clickRate: `${stats.clickRate.toFixed(1)}%`,
        clickThroughRate: `${stats.clickThroughRate.toFixed(1)}%`
      },
      topLinks: stats.topLinks,
      timeline: stats.timeline,
      recommendations: this.generateRecommendations(stats)
    };
    
    return report;
  }

  /**
   * Generate recommendations based on performance
   */
  generateRecommendations(stats) {
    const recommendations = [];
    
    if (stats.openRate < 20) {
      recommendations.push({
        type: 'subject_line',
        priority: 'high',
        message: 'Low open rate - try more compelling subject lines',
        suggestion: 'Test subject lines with urgency, personalization, or curiosity'
      });
    }
    
    if (stats.clickRate < 5) {
      recommendations.push({
        type: 'content',
        priority: 'high',
        message: 'Low click rate - improve email content and call-to-action',
        suggestion: 'Make links more prominent and add clear value proposition'
      });
    }
    
    if (stats.clickThroughRate < 10) {
      recommendations.push({
        type: 'targeting',
        priority: 'medium',
        message: 'Low click-through rate - improve targeting',
        suggestion: 'Focus on contacts who have engaged before or match your ideal audience'
      });
    }
    
    if (stats.openRate > 40 && stats.clickRate > 15) {
      recommendations.push({
        type: 'success',
        priority: 'low',
        message: 'Great performance! Consider scaling this approach',
        suggestion: 'Use similar subject lines and content for future campaigns'
      });
    }
    
    return recommendations;
  }

  /**
   * Test tracking system
   */
  async testTracking() {
    console.log('🧪 Testing email tracking system...');
    
    try {
      // Test data
      const testEmailId = 'test-' + Date.now();
      const testContactId = 'contact-test-123';
      const testCampaignId = 'campaign-test-456';
      
      // Test email content
      const testContent = `
        <h2>Test Email</h2>
        <p>This is a test email with <a href="https://example.com">a test link</a>.</p>
        <p>Here's another <a href="https://google.com">link to Google</a>.</p>
      `;
      
      // Prepare email for tracking
      const trackedEmail = this.prepareEmailForTracking(
        testContent,
        testEmailId,
        testContactId,
        testCampaignId
      );
      
      console.log('✅ Email prepared for tracking');
      console.log(`   Tracking pixel: ${trackedEmail.trackingInfo.pixelId ? 'Added' : 'Not added'}`);
      console.log(`   Tracking links: ${trackedEmail.trackingInfo.linkCount}`);
      
      // Simulate tracking (in real use, this would happen when recipient opens/clicks)
      console.log('📧 Simulating email open...');
      await this.emailTracking.processOpenTracking(
        trackedEmail.trackingInfo.pixelId,
        'Test User Agent',
        '127.0.0.1'
      );
      
      console.log('🔗 Simulating link click...');
      const linkIds = trackedEmail.content.match(/click\/([^"]+)/g);
      if (linkIds && linkIds.length > 0) {
        const firstLinkId = linkIds[0].replace('click/', '');
        await this.emailTracking.processClickTracking(
          firstLinkId,
          'Test User Agent',
          '127.0.0.1'
        );
      }
      
      // Get stats
      const stats = this.getCampaignPerformance(testCampaignId);
      const engagement = this.getContactEngagement(testContactId);
      
      console.log('✅ Tracking test completed successfully');
      return {
        success: true,
        stats,
        engagement,
        trackedEmail: {
          contentLength: trackedEmail.content.length,
          hasTrackingPixel: !!trackedEmail.trackingInfo.pixelId,
          linkCount: trackedEmail.trackingInfo.linkCount
        }
      };
      
    } catch (error) {
      console.error('❌ Tracking test failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    const trackingHealth = await this.emailTracking.healthCheck();
    
    return {
      status: 'healthy',
      tracking: trackingHealth,
      trackingUrl: this.trackingBaseUrl,
      lastChecked: new Date().toISOString()
    };
  }
}

module.exports = UniversalEmailTracker;
